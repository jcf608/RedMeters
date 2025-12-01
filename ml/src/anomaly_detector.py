#!/usr/bin/env python3
"""
Anomaly Detection Model for Smart Meter Readings.
Uses Isolation Forest algorithm for unsupervised anomaly detection.
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib
import os
from typing import Dict, Any


class AnomalyDetector:
    """Isolation Forest based anomaly detector for meter readings."""
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.feature_columns = [
            'consumption_kwh', 'demand_kw', 'voltage', 
            'power_factor', 'hour', 'day_of_week'
        ]
    
    def prepare_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Engineer features for anomaly detection."""
        features = df.copy()
        
        # Extract time features
        features['reading_time'] = pd.to_datetime(features['reading_time'])
        features['hour'] = features['reading_time'].dt.hour
        features['day_of_week'] = features['reading_time'].dt.dayofweek
        
        # Calculate voltage deviation from nominal (230V)
        features['voltage_deviation'] = abs(features['voltage'] - 230) / 230
        
        feature_cols = self.feature_columns + ['voltage_deviation']
        return features[feature_cols]
    
    def train(self, df: pd.DataFrame, contamination: float = 0.02) -> 'AnomalyDetector':
        """Train Isolation Forest model."""
        print("Preparing features...")
        features = self.prepare_features(df)
        
        print("Scaling features...")
        scaled_features = self.scaler.fit_transform(features)
        
        print("Training Isolation Forest...")
        self.model = IsolationForest(
            contamination=contamination,
            n_estimators=200,
            max_samples='auto',
            random_state=42,
            n_jobs=-1,
            verbose=1
        )
        self.model.fit(scaled_features)
        
        # Calculate scores for training data
        scores = self.model.decision_function(scaled_features)
        predictions = self.model.predict(scaled_features)
        
        n_anomalies = (predictions == -1).sum()
        print(f"\n✅ Training complete!")
        print(f"   Found {n_anomalies} anomalies ({n_anomalies/len(df)*100:.2f}%)")
        
        return self
    
    def predict(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Predict anomalies for new data."""
        features = self.prepare_features(df)
        scaled_features = self.scaler.transform(features)
        
        # Get anomaly scores and predictions
        scores = self.model.decision_function(scaled_features)
        predictions = self.model.predict(scaled_features)
        
        # Convert scores to 0-1 range (higher = more anomalous)
        anomaly_scores = 1 - (scores - scores.min()) / (scores.max() - scores.min() + 1e-10)
        is_anomaly = predictions == -1
        
        return {
            'anomaly_score': anomaly_scores,
            'is_anomaly': is_anomaly
        }
    
    def save(self, path: str = 'models/anomaly_detector.joblib') -> None:
        """Save model to disk."""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump({
            'model': self.model,
            'scaler': self.scaler,
            'feature_columns': self.feature_columns
        }, path)
        print(f"✅ Model saved to {path}")
    
    @classmethod
    def load(cls, path: str = 'models/anomaly_detector.joblib') -> 'AnomalyDetector':
        """Load model from disk."""
        data = joblib.load(path)
        detector = cls()
        detector.model = data['model']
        detector.scaler = data['scaler']
        detector.feature_columns = data['feature_columns']
        return detector


if __name__ == '__main__':
    # Training script
    print("=" * 60)
    print("ANOMALY DETECTOR TRAINING")
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
    detector = AnomalyDetector()
    detector.train(df)
    
    # Save model
    model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'anomaly_detector.joblib')
    detector.save(model_path)
    
    # Test prediction
    print("\n📊 Testing prediction on sample data...")
    sample = df.head(1000)
    results = detector.predict(sample)
    n_detected = results['is_anomaly'].sum()
    print(f"   Detected {n_detected} anomalies in 1000 samples")
    
    # Compare with actual labels
    actual_anomalies = (sample['quality_flag'] == 'anomaly').sum()
    print(f"   Actual anomalies in sample: {actual_anomalies}")


