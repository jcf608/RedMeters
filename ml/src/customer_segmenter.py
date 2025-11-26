#!/usr/bin/env python3
"""
Customer Segmentation Model for Smart Meter Analytics.
Uses K-means clustering to identify customer usage patterns.
"""

import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib
import os
from typing import Dict, Any, List


class CustomerSegmenter:
    """K-means based customer segmentation model."""
    
    SEGMENT_NAMES = {
        0: 'early_morning_industrial',
        1: 'business_hours_commercial',
        2: 'evening_residential_peak',
        3: 'solar_battery_households',
        4: 'ev_charging_households',
        5: 'efficiency_optimizers',
        6: 'high_consumption_all_day',
        7: 'seasonal_variation_heavy',
        8: 'weekend_shift_users',
        9: 'night_owl_households',
        10: 'retired_home_all_day',
        11: 'low_use_minimal'
    }
    
    def __init__(self, n_clusters: int = 12):
        self.n_clusters = n_clusters
        self.model = None
        self.scaler = StandardScaler()
    
    def prepare_features(self, readings_df: pd.DataFrame) -> pd.DataFrame:
        """Create customer usage profile from meter readings."""
        readings_df = readings_df.copy()
        
        # Extract time features
        readings_df['reading_time'] = pd.to_datetime(readings_df['reading_time'])
        readings_df['hour'] = readings_df['reading_time'].dt.hour
        
        # Hourly profile (24 features) - average consumption per hour
        hourly = readings_df.groupby(['meter_id', 'hour'])['consumption_kwh'].mean().unstack(fill_value=0)
        
        # Rename hour columns to strings (e.g., 'hour_0', 'hour_1', etc.)
        hourly.columns = [f'hour_{h}' for h in hourly.columns]
        
        # Normalize hourly values to percentages
        hourly_sum = hourly.sum(axis=1)
        hourly_pct = hourly.div(hourly_sum + 1e-10, axis=0)
        
        # Aggregate features
        agg = readings_df.groupby('meter_id').agg({
            'consumption_kwh': ['mean', 'std', 'max'],
            'demand_kw': 'max',
            'voltage': ['mean', 'std'],
            'power_factor': 'mean'
        })
        agg.columns = ['avg_consumption', 'std_consumption', 'max_consumption', 
                       'max_demand', 'avg_voltage', 'std_voltage', 'avg_power_factor']
        
        # Weekend vs weekday ratio
        readings_df['is_weekend'] = readings_df['reading_time'].dt.dayofweek >= 5
        weekend_ratio = readings_df.groupby('meter_id').apply(
            lambda x: x[x['is_weekend']]['consumption_kwh'].mean() / 
                     (x[~x['is_weekend']]['consumption_kwh'].mean() + 0.001),
            include_groups=False
        )
        
        # Combine features
        features = hourly_pct.join(agg).join(weekend_ratio.rename('weekend_ratio'))
        
        return features.fillna(0)
    
    def train(self, readings_df: pd.DataFrame) -> 'CustomerSegmenter':
        """Train K-means clustering model."""
        print("Preparing customer features...")
        features = self.prepare_features(readings_df)
        print(f"   Created features for {len(features)} meters")
        
        print("Scaling features...")
        scaled = self.scaler.fit_transform(features)
        
        print(f"Training K-means with {self.n_clusters} clusters...")
        self.model = KMeans(
            n_clusters=self.n_clusters,
            random_state=42,
            n_init=20,
            max_iter=500,
            verbose=1
        )
        self.model.fit(scaled)
        
        # Display cluster distribution
        labels = self.model.labels_
        print(f"\n✅ Training complete!")
        print("\nCluster distribution:")
        for i in range(self.n_clusters):
            count = (labels == i).sum()
            name = self.SEGMENT_NAMES.get(i, f'cluster_{i}')
            print(f"   {name}: {count} customers ({count/len(labels)*100:.1f}%)")
        
        return self
    
    def predict(self, readings_df: pd.DataFrame) -> Dict[str, Any]:
        """Assign customers to segments."""
        features = self.prepare_features(readings_df)
        scaled = self.scaler.transform(features)
        
        labels = self.model.predict(scaled)
        
        return {
            'meter_id': features.index.tolist(),
            'segment_id': [self.SEGMENT_NAMES.get(l, f'cluster_{l}') for l in labels],
            'cluster': labels.tolist()
        }
    
    def save(self, path: str = 'models/customer_segmenter.joblib') -> None:
        """Save model to disk."""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump({
            'model': self.model,
            'scaler': self.scaler,
            'n_clusters': self.n_clusters
        }, path)
        print(f"✅ Model saved to {path}")
    
    @classmethod
    def load(cls, path: str = 'models/customer_segmenter.joblib') -> 'CustomerSegmenter':
        """Load model from disk."""
        data = joblib.load(path)
        segmenter = cls(n_clusters=data['n_clusters'])
        segmenter.model = data['model']
        segmenter.scaler = data['scaler']
        return segmenter


if __name__ == '__main__':
    # Training script
    print("=" * 60)
    print("CUSTOMER SEGMENTER TRAINING")
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
    segmenter = CustomerSegmenter(n_clusters=12)
    segmenter.train(df)
    
    # Save model
    model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'customer_segmenter.joblib')
    segmenter.save(model_path)
    
    # Test prediction
    print("\n📊 Testing prediction...")
    results = segmenter.predict(df)
    print(f"   Segmented {len(results['meter_id'])} customers")

