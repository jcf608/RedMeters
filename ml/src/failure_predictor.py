#!/usr/bin/env python3
"""
Failure Prediction Model for Transformers and Equipment.
Uses XGBoost for supervised learning to predict equipment failure probability.
"""

import pandas as pd
import numpy as np
from xgboost import XGBClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import joblib
import os
from typing import Dict, Any, Tuple


class FailurePredictor:
    """XGBoost based failure prediction model for equipment."""
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.feature_columns = [
            'age_years', 'capacity_kva', 'avg_load_pct', 'max_load_pct',
            'voltage_variance', 'power_factor_avg', 'anomaly_rate',
            'maintenance_months_ago', 'failure_history_count'
        ]
    
    def prepare_features(self, equipment_df: pd.DataFrame, readings_df: pd.DataFrame = None) -> pd.DataFrame:
        """Prepare features for failure prediction."""
        features = equipment_df.copy()
        
        # If readings provided, calculate usage statistics per transformer
        if readings_df is not None and 'transformer_id' in readings_df.columns:
            readings_agg = readings_df.groupby('transformer_id').agg({
                'consumption_kwh': ['mean', 'max', 'std'],
                'voltage': ['std'],
                'power_factor': ['mean'],
                'quality_flag': lambda x: (x == 'anomaly').mean()  # anomaly rate
            })
            readings_agg.columns = ['avg_load', 'max_load', 'load_variance', 
                                    'voltage_variance', 'power_factor_avg', 'anomaly_rate']
            
            features = features.merge(readings_agg, left_on='id', right_index=True, how='left')
        
        # Fill missing columns with defaults
        for col in self.feature_columns:
            if col not in features.columns:
                if col == 'avg_load_pct':
                    features[col] = features.get('avg_load', 50) / features.get('capacity_kva', 1) * 100
                elif col == 'max_load_pct':
                    features[col] = features.get('max_load', 80) / features.get('capacity_kva', 1) * 100
                elif col == 'maintenance_months_ago':
                    features[col] = np.random.uniform(1, 24, len(features))
                elif col == 'failure_history_count':
                    features[col] = np.random.poisson(0.5, len(features))
                elif col not in features.columns:
                    features[col] = 0
        
        return features[self.feature_columns].fillna(0)
    
    def generate_training_labels(self, equipment_df: pd.DataFrame) -> np.ndarray:
        """
        Generate synthetic failure labels based on equipment characteristics.
        In production, these would come from actual failure history.
        """
        # Probability of failure based on age, load, and historical failures
        p_fail = (
            0.05 +  # Base rate
            (equipment_df['age_years'] / 30) * 0.3 +  # Age factor
            (equipment_df.get('failure_risk', 0.5) * 0.4) +  # Risk factor
            np.random.uniform(0, 0.1, len(equipment_df))  # Random noise
        )
        p_fail = np.clip(p_fail, 0, 0.95)
        
        # Convert to binary labels
        return (np.random.random(len(equipment_df)) < p_fail).astype(int)
    
    def train(self, equipment_df: pd.DataFrame, readings_df: pd.DataFrame = None, 
              labels: np.ndarray = None) -> 'FailurePredictor':
        """Train XGBoost classifier for failure prediction."""
        print("Preparing features...")
        features = self.prepare_features(equipment_df, readings_df)
        
        # Generate labels if not provided
        if labels is None:
            print("Generating synthetic failure labels...")
            labels = self.generate_training_labels(equipment_df)
        
        print(f"   {len(features)} samples, {labels.sum()} positive (failure) cases ({labels.mean()*100:.1f}%)")
        
        # Scale features
        print("Scaling features...")
        scaled_features = self.scaler.fit_transform(features)
        
        # Split for validation
        X_train, X_val, y_train, y_val = train_test_split(
            scaled_features, labels, test_size=0.2, random_state=42, stratify=labels
        )
        
        print(f"Training XGBoost classifier...")
        print(f"   Training samples: {len(X_train)}, Validation samples: {len(X_val)}")
        
        self.model = XGBClassifier(
            n_estimators=200,
            max_depth=6,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            use_label_encoder=False,
            eval_metric='logloss',
            early_stopping_rounds=20,
            verbosity=1
        )
        
        self.model.fit(
            X_train, y_train,
            eval_set=[(X_val, y_val)],
            verbose=True
        )
        
        # Evaluate
        train_acc = self.model.score(X_train, y_train)
        val_acc = self.model.score(X_val, y_val)
        
        print(f"\n✅ Training complete!")
        print(f"   Training accuracy: {train_acc:.2%}")
        print(f"   Validation accuracy: {val_acc:.2%}")
        
        # Feature importance
        importance = dict(zip(self.feature_columns, self.model.feature_importances_))
        print("\nFeature importance:")
        for feat, imp in sorted(importance.items(), key=lambda x: -x[1])[:5]:
            print(f"   {feat}: {imp:.3f}")
        
        return self
    
    def predict(self, equipment_df: pd.DataFrame, readings_df: pd.DataFrame = None) -> Dict[str, Any]:
        """Predict failure probability for equipment."""
        features = self.prepare_features(equipment_df, readings_df)
        scaled_features = self.scaler.transform(features)
        
        # Get probability predictions
        probabilities = self.model.predict_proba(scaled_features)[:, 1]
        predictions = self.model.predict(scaled_features)
        
        return {
            'equipment_id': equipment_df['id'].tolist() if 'id' in equipment_df.columns else list(range(len(equipment_df))),
            'failure_probability': probabilities.tolist(),
            'will_fail': predictions.tolist(),
            'risk_level': [
                'critical' if p > 0.8 else 'high' if p > 0.6 else 'medium' if p > 0.4 else 'low'
                for p in probabilities
            ]
        }
    
    def save(self, path: str = 'models/failure_predictor.joblib') -> None:
        """Save model to disk."""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump({
            'model': self.model,
            'scaler': self.scaler,
            'feature_columns': self.feature_columns
        }, path)
        print(f"✅ Model saved to {path}")
    
    @classmethod
    def load(cls, path: str = 'models/failure_predictor.joblib') -> 'FailurePredictor':
        """Load model from disk."""
        data = joblib.load(path)
        predictor = cls()
        predictor.model = data['model']
        predictor.scaler = data['scaler']
        predictor.feature_columns = data['feature_columns']
        return predictor


if __name__ == '__main__':
    # Training script
    print("=" * 60)
    print("FAILURE PREDICTOR TRAINING")
    print("=" * 60)
    
    # Load sample data
    data_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'sample')
    transformers_path = os.path.join(data_dir, 'transformers.csv')
    readings_path = os.path.join(data_dir, 'meter_readings.parquet')
    
    if not os.path.exists(transformers_path):
        print(f"❌ Data file not found: {transformers_path}")
        print("   Run: python generate_sample_data.py first")
        exit(1)
    
    print(f"\nLoading transformer data from {transformers_path}...")
    transformers = pd.read_csv(transformers_path)
    print(f"   Loaded {len(transformers)} transformers")
    
    readings = None
    if os.path.exists(readings_path):
        print(f"Loading meter readings from {readings_path}...")
        readings = pd.read_parquet(readings_path)
        print(f"   Loaded {len(readings):,} readings")
    
    # Train model
    predictor = FailurePredictor()
    predictor.train(transformers, readings)
    
    # Save model
    model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'failure_predictor.joblib')
    predictor.save(model_path)
    
    # Test prediction
    print("\n📊 Testing prediction...")
    results = predictor.predict(transformers)
    high_risk = sum(1 for r in results['risk_level'] if r in ['high', 'critical'])
    print(f"   High/Critical risk transformers: {high_risk}/{len(transformers)}")

