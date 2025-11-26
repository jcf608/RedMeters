#!/usr/bin/env python3
"""
Demand Forecasting Model for Grid Load Prediction.
Uses Facebook Prophet for time series forecasting.
"""

import pandas as pd
import numpy as np
from prophet import Prophet
import joblib
import os
from typing import Dict, Any, List
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')


class DemandForecaster:
    """Prophet based demand forecasting model for grid load prediction."""
    
    def __init__(self):
        self.model = None
        self.aggregation_interval = 'H'  # Hourly aggregation
    
    def prepare_data(self, readings_df: pd.DataFrame) -> pd.DataFrame:
        """
        Prepare data for Prophet.
        Prophet requires columns named 'ds' (datetime) and 'y' (value).
        """
        readings = readings_df.copy()
        
        # Ensure datetime format
        readings['reading_time'] = pd.to_datetime(readings['reading_time'])
        
        # Aggregate to hourly demand
        hourly = readings.set_index('reading_time').resample(self.aggregation_interval).agg({
            'consumption_kwh': 'sum',
            'demand_kw': 'max'
        }).reset_index()
        
        # Rename for Prophet
        prophet_data = pd.DataFrame({
            'ds': hourly['reading_time'],
            'y': hourly['demand_kw']  # Predict peak demand
        })
        
        return prophet_data.dropna()
    
    def train(self, readings_df: pd.DataFrame) -> 'DemandForecaster':
        """Train Prophet model for demand forecasting."""
        print("Preparing time series data...")
        data = self.prepare_data(readings_df)
        print(f"   Prepared {len(data)} hourly data points")
        print(f"   Date range: {data['ds'].min()} to {data['ds'].max()}")
        
        print("\nTraining Prophet model...")
        print("   (This may take a minute...)")
        
        self.model = Prophet(
            yearly_seasonality=False,  # Not enough data for yearly
            weekly_seasonality=True,
            daily_seasonality=True,
            seasonality_mode='multiplicative',
            changepoint_prior_scale=0.05,
            interval_width=0.95
        )
        
        # Add custom seasonalities
        self.model.add_seasonality(
            name='time_of_use',
            period=1,  # Daily
            fourier_order=8
        )
        
        # Fit the model
        self.model.fit(data)
        
        print(f"\n✅ Training complete!")
        print(f"   Model changepoints: {len(self.model.changepoints)}")
        
        return self
    
    def forecast(self, periods: int = 72) -> Dict[str, Any]:
        """
        Generate demand forecast.
        
        Args:
            periods: Number of hours to forecast (default 72 = 3 days)
        
        Returns:
            Dictionary with forecast data
        """
        # Create future dataframe
        future = self.model.make_future_dataframe(periods=periods, freq='H')
        
        # Generate forecast
        forecast = self.model.predict(future)
        
        # Get only future predictions
        future_forecast = forecast.tail(periods)
        
        return {
            'timestamps': future_forecast['ds'].dt.strftime('%Y-%m-%d %H:%M:%S').tolist(),
            'predicted_demand_kw': future_forecast['yhat'].round(2).tolist(),
            'lower_bound_kw': future_forecast['yhat_lower'].round(2).tolist(),
            'upper_bound_kw': future_forecast['yhat_upper'].round(2).tolist(),
            'trend': future_forecast['trend'].round(2).tolist(),
            'periods': periods,
            'generated_at': datetime.now().isoformat()
        }
    
    def predict_peak_hours(self, periods: int = 24) -> List[Dict[str, Any]]:
        """Predict peak demand hours for the next N periods."""
        forecast = self.forecast(periods)
        
        # Create dataframe for analysis
        df = pd.DataFrame({
            'timestamp': pd.to_datetime(forecast['timestamps']),
            'demand': forecast['predicted_demand_kw']
        })
        
        # Find peak hours (top 10%)
        threshold = df['demand'].quantile(0.9)
        peaks = df[df['demand'] >= threshold].copy()
        
        return peaks.to_dict('records')
    
    def get_daily_profile(self) -> Dict[str, List[float]]:
        """Get average daily demand profile."""
        # Generate 24 hours forecast to get daily pattern
        forecast = self.forecast(periods=168)  # One week
        
        df = pd.DataFrame({
            'timestamp': pd.to_datetime(forecast['timestamps']),
            'demand': forecast['predicted_demand_kw']
        })
        df['hour'] = df['timestamp'].dt.hour
        
        # Average by hour
        hourly_avg = df.groupby('hour')['demand'].mean().round(2)
        
        return {
            'hours': list(range(24)),
            'average_demand_kw': hourly_avg.tolist()
        }
    
    def save(self, path: str = 'models/demand_forecaster.joblib') -> None:
        """Save model to disk."""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        
        # Prophet models need special handling
        joblib.dump({
            'model': self.model,
            'aggregation_interval': self.aggregation_interval
        }, path)
        print(f"✅ Model saved to {path}")
    
    @classmethod
    def load(cls, path: str = 'models/demand_forecaster.joblib') -> 'DemandForecaster':
        """Load model from disk."""
        data = joblib.load(path)
        forecaster = cls()
        forecaster.model = data['model']
        forecaster.aggregation_interval = data['aggregation_interval']
        return forecaster


if __name__ == '__main__':
    # Training script
    print("=" * 60)
    print("DEMAND FORECASTER TRAINING")
    print("=" * 60)
    
    # Load sample data
    data_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'sample', 'meter_readings.parquet')
    
    if not os.path.exists(data_path):
        print(f"❌ Data file not found: {data_path}")
        print("   Run: python generate_sample_data.py first")
        exit(1)
    
    print(f"\nLoading data from {data_path}...")
    df = pd.read_parquet(data_path)
    print(f"   Loaded {len(df):,} readings")
    
    # Train model
    forecaster = DemandForecaster()
    forecaster.train(df)
    
    # Save model
    model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'demand_forecaster.joblib')
    forecaster.save(model_path)
    
    # Test forecast
    print("\n📊 Testing 72-hour forecast...")
    forecast = forecaster.forecast(periods=72)
    print(f"   Forecast generated for {forecast['periods']} hours")
    print(f"   Peak predicted demand: {max(forecast['predicted_demand_kw']):.2f} kW")
    print(f"   Min predicted demand: {min(forecast['predicted_demand_kw']):.2f} kW")
    
    # Show daily profile
    print("\n📈 Daily demand profile:")
    profile = forecaster.get_daily_profile()
    peak_hour = profile['hours'][profile['average_demand_kw'].index(max(profile['average_demand_kw']))]
    min_hour = profile['hours'][profile['average_demand_kw'].index(min(profile['average_demand_kw']))]
    print(f"   Peak hour: {peak_hour}:00 ({max(profile['average_demand_kw']):.2f} kW)")
    print(f"   Lowest hour: {min_hour}:00 ({min(profile['average_demand_kw']):.2f} kW)")

