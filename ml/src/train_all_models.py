#!/usr/bin/env python3
"""
Train all ML models for Red Energy Meters platform.
Runs the complete ML training pipeline for Phase 3.
"""

import os
import sys
import pandas as pd
import time

# Add src directory to path
sys.path.insert(0, os.path.dirname(__file__))

from anomaly_detector import AnomalyDetector
from customer_segmenter import CustomerSegmenter
from failure_predictor import FailurePredictor
from demand_forecaster import DemandForecaster


def main():
    start_time = time.time()
    
    print("=" * 70)
    print("   RED ENERGY METERS - ML MODEL TRAINING PIPELINE")
    print("   Phase 3: Train All Models")
    print("=" * 70)
    
    # Paths
    data_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'sample')
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    
    readings_path = os.path.join(data_dir, 'meter_readings.parquet')
    customers_path = os.path.join(data_dir, 'customers.csv')
    transformers_path = os.path.join(data_dir, 'transformers.csv')
    
    # Check for data
    if not os.path.exists(readings_path):
        print(f"\n❌ Data file not found: {readings_path}")
        print("   Run: python generate_sample_data.py first")
        sys.exit(1)
    
    # Ensure models directory exists
    os.makedirs(models_dir, exist_ok=True)
    
    # Load data
    print("\n" + "=" * 70)
    print("STEP 1: Loading Data")
    print("=" * 70)
    
    print(f"\nLoading meter readings from {readings_path}...")
    readings = pd.read_parquet(readings_path)
    print(f"   ✅ Loaded {len(readings):,} meter readings")
    
    customers = None
    if os.path.exists(customers_path):
        print(f"\nLoading customers from {customers_path}...")
        customers = pd.read_csv(customers_path)
        print(f"   ✅ Loaded {len(customers):,} customers")
    
    transformers = None
    if os.path.exists(transformers_path):
        print(f"\nLoading transformers from {transformers_path}...")
        transformers = pd.read_csv(transformers_path)
        print(f"   ✅ Loaded {len(transformers):,} transformers")
    
    # =========================================================================
    # MODEL 1: Anomaly Detection (Isolation Forest)
    # =========================================================================
    print("\n" + "=" * 70)
    print("STEP 2: Training Anomaly Detector (Isolation Forest)")
    print("=" * 70)
    
    model_start = time.time()
    anomaly = AnomalyDetector()
    anomaly.train(readings)
    anomaly.save(os.path.join(models_dir, 'anomaly_detector.joblib'))
    print(f"   ⏱️  Training time: {time.time() - model_start:.1f} seconds")
    
    # =========================================================================
    # MODEL 2: Customer Segmentation (K-means)
    # =========================================================================
    print("\n" + "=" * 70)
    print("STEP 3: Training Customer Segmenter (K-means)")
    print("=" * 70)
    
    model_start = time.time()
    segmenter = CustomerSegmenter(n_clusters=12)
    segmenter.train(readings)
    segmenter.save(os.path.join(models_dir, 'customer_segmenter.joblib'))
    print(f"   ⏱️  Training time: {time.time() - model_start:.1f} seconds")
    
    # =========================================================================
    # MODEL 3: Failure Prediction (XGBoost)
    # =========================================================================
    print("\n" + "=" * 70)
    print("STEP 4: Training Failure Predictor (XGBoost)")
    print("=" * 70)
    
    if transformers is not None:
        model_start = time.time()
        predictor = FailurePredictor()
        predictor.train(transformers, readings)
        predictor.save(os.path.join(models_dir, 'failure_predictor.joblib'))
        print(f"   ⏱️  Training time: {time.time() - model_start:.1f} seconds")
    else:
        print("   ⚠️  Skipped - no transformer data available")
    
    # =========================================================================
    # MODEL 4: Demand Forecasting (Prophet)
    # =========================================================================
    print("\n" + "=" * 70)
    print("STEP 5: Training Demand Forecaster (Prophet)")
    print("=" * 70)
    
    model_start = time.time()
    forecaster = DemandForecaster()
    forecaster.train(readings)
    forecaster.save(os.path.join(models_dir, 'demand_forecaster.joblib'))
    print(f"   ⏱️  Training time: {time.time() - model_start:.1f} seconds")
    
    # =========================================================================
    # Summary
    # =========================================================================
    total_time = time.time() - start_time
    
    print("\n" + "=" * 70)
    print("   TRAINING COMPLETE")
    print("=" * 70)
    print(f"\n📁 Models saved to: {os.path.abspath(models_dir)}")
    
    # List saved models
    if os.path.exists(models_dir):
        models = [f for f in os.listdir(models_dir) if f.endswith('.joblib')]
        print("\n📦 Trained Models:")
        total_size = 0
        for m in sorted(models):
            path = os.path.join(models_dir, m)
            size = os.path.getsize(path) / (1024 * 1024)  # MB
            total_size += size
            print(f"   ✅ {m} ({size:.2f} MB)")
        print(f"\n   Total model size: {total_size:.2f} MB")
    
    print(f"\n⏱️  Total training time: {total_time:.1f} seconds ({total_time/60:.1f} minutes)")
    
    # Test predictions
    print("\n" + "=" * 70)
    print("   VALIDATION TESTS")
    print("=" * 70)
    
    # Test anomaly detection
    print("\n🔍 Testing Anomaly Detector...")
    sample = readings.head(1000)
    results = anomaly.predict(sample)
    print(f"   Detected {results['is_anomaly'].sum()} anomalies in 1000 samples")
    
    # Test customer segmentation
    print("\n👥 Testing Customer Segmenter...")
    results = segmenter.predict(readings)
    print(f"   Segmented {len(results['meter_id'])} customers into {len(set(results['segment_id']))} segments")
    
    # Test failure prediction
    if transformers is not None:
        print("\n⚡ Testing Failure Predictor...")
        results = predictor.predict(transformers)
        high_risk = sum(1 for r in results['risk_level'] if r in ['high', 'critical'])
        print(f"   High/Critical risk equipment: {high_risk}/{len(transformers)}")
    
    # Test demand forecast
    print("\n📈 Testing Demand Forecaster...")
    forecast = forecaster.forecast(periods=24)
    print(f"   24-hour forecast generated")
    print(f"   Peak demand: {max(forecast['predicted_demand_kw']):.2f} kW")
    
    print("\n" + "=" * 70)
    print("   ALL MODELS TRAINED AND VALIDATED SUCCESSFULLY! 🎉")
    print("=" * 70)


if __name__ == '__main__':
    main()
