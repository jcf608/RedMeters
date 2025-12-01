#!/usr/bin/env python3
"""
Generate realistic smart meter sample data for Red Energy Meters platform.
Creates meter readings, customers, and transformers for ML model training.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os


def generate_meter_readings(num_meters: int = 1000, days: int = 90) -> pd.DataFrame:
    """Generate realistic smart meter readings."""
    
    readings = []
    start_date = datetime.now() - timedelta(days=days)
    
    print(f"  Generating readings for {num_meters} meters over {days} days...")
    
    for meter_id in range(1, num_meters + 1):
        # Each meter has a base consumption profile
        base_consumption = np.random.uniform(5, 25)  # kWh/day average
        
        for day in range(days):
            date = start_date + timedelta(days=day)
            
            # Generate 48 readings per day (30-min intervals)
            for half_hour in range(48):
                timestamp = date + timedelta(minutes=half_hour * 30)
                hour = timestamp.hour
                
                # Time-of-use pattern
                if 6 <= hour < 9 or 17 <= hour < 21:
                    peak_factor = 1.5  # Morning/evening peak
                elif 9 <= hour < 17:
                    peak_factor = 0.8  # Daytime
                elif 21 <= hour < 24 or 0 <= hour < 6:
                    peak_factor = 0.5  # Night
                else:
                    peak_factor = 1.0
                
                # Add randomness and seasonal variation
                seasonal = 1 + 0.2 * np.sin(2 * np.pi * day / 365)
                noise = np.random.normal(1, 0.15)
                
                consumption = (base_consumption / 48) * peak_factor * seasonal * noise
                consumption = max(0, consumption)
                
                # Voltage (normally around 230V)
                voltage = np.random.normal(230, 5)
                
                # Occasionally inject anomalies (2% of readings)
                is_anomaly = np.random.random() < 0.02
                if is_anomaly:
                    anomaly_type = np.random.choice(['voltage', 'consumption', 'both'])
                    if anomaly_type in ['voltage', 'both']:
                        voltage = np.random.choice([195, 260])  # Low or high voltage
                    if anomaly_type in ['consumption', 'both']:
                        consumption *= np.random.choice([3, 5])  # Spike
                
                readings.append({
                    'meter_id': meter_id,
                    'reading_time': timestamp,
                    'consumption_kwh': round(consumption, 4),
                    'demand_kw': round(consumption * 2, 4),
                    'voltage': round(voltage, 2),
                    'power_factor': round(np.random.uniform(0.85, 0.99), 4),
                    'quality_flag': 'anomaly' if is_anomaly else 'normal'
                })
        
        if meter_id % 100 == 0:
            print(f"    Completed meter {meter_id}/{num_meters}")
    
    return pd.DataFrame(readings)


def generate_customers(num_customers: int = 1000) -> pd.DataFrame:
    """Generate customer profiles."""
    
    segments = [
        'early_morning_industrial',
        'business_hours_commercial', 
        'evening_residential_peak',
        'solar_battery_households',
        'ev_charging_households',
        'efficiency_optimizers',
        'high_consumption_all_day',
        'seasonal_variation_heavy',
        'weekend_shift_users',
        'night_owl_households',
        'retired_home_all_day',
        'low_use_minimal'
    ]
    
    # Weight distribution reflecting realistic customer mix
    segment_weights = [3, 8, 22, 7, 9, 5, 6, 12, 8, 6, 9, 5]
    
    customers = []
    for i in range(1, num_customers + 1):
        segment = np.random.choice(segments, p=np.array(segment_weights)/100)
        
        customers.append({
            'id': i,
            'customer_hash': f'CUST{i:06d}',
            'segment_id': segment,
            'tariff_type': np.random.choice(['flat', 'tou', 'demand']),
            'solar_installed': segment == 'solar_battery_households' or np.random.random() < 0.15,
            'ev_charging': segment == 'ev_charging_households' or np.random.random() < 0.1,
            'demand_response_opted_in': np.random.random() < 0.3
        })
    
    return pd.DataFrame(customers)


def generate_transformers(num_transformers: int = 50) -> pd.DataFrame:
    """Generate transformer data."""
    
    transformers = []
    for i in range(1, num_transformers + 1):
        age = np.random.uniform(1, 30)
        
        # Older transformers more likely to have issues
        failure_risk = min(0.95, 0.1 + (age / 30) * 0.5 + np.random.uniform(0, 0.2))
        
        transformers.append({
            'id': i,
            'transformer_number': f'TRF{i:04d}',
            'capacity_kva': np.random.choice([100, 200, 500, 1000]),
            'age_years': round(age, 1),
            'status': 'operational',
            'failure_risk': round(failure_risk, 3)
        })
    
    return pd.DataFrame(transformers)


def main():
    print("=" * 60)
    print("RED ENERGY METERS - SAMPLE DATA GENERATION")
    print("=" * 60)
    
    # Create output directory
    output_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'sample')
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate data
    print("\n1. Generating meter readings (this may take a few minutes)...")
    readings = generate_meter_readings(num_meters=1000, days=90)
    readings_path = os.path.join(output_dir, 'meter_readings.parquet')
    readings.to_parquet(readings_path, index=False)
    print(f"   ✅ Generated {len(readings):,} readings")
    print(f"   Saved to: {readings_path}")
    
    print("\n2. Generating customers...")
    customers = generate_customers(num_customers=1000)
    customers_path = os.path.join(output_dir, 'customers.csv')
    customers.to_csv(customers_path, index=False)
    print(f"   ✅ Generated {len(customers):,} customers")
    print(f"   Saved to: {customers_path}")
    
    print("\n3. Generating transformers...")
    transformers = generate_transformers(num_transformers=50)
    transformers_path = os.path.join(output_dir, 'transformers.csv')
    transformers.to_csv(transformers_path, index=False)
    print(f"   ✅ Generated {len(transformers):,} transformers")
    print(f"   Saved to: {transformers_path}")
    
    print("\n" + "=" * 60)
    print("SAMPLE DATA GENERATION COMPLETE")
    print("=" * 60)
    print(f"\nFiles created in: {output_dir}")
    print(f"  - meter_readings.parquet ({len(readings):,} readings)")
    print(f"  - customers.csv ({len(customers):,} customers)")
    print(f"  - transformers.csv ({len(transformers):,} transformers)")
    
    # Show summary statistics
    print("\n📊 Data Summary:")
    print(f"  Anomaly rate: {(readings['quality_flag'] == 'anomaly').mean() * 100:.2f}%")
    print(f"  Avg consumption: {readings['consumption_kwh'].mean():.4f} kWh")
    print(f"  Avg voltage: {readings['voltage'].mean():.2f} V")
    print(f"  Customers with solar: {customers['solar_installed'].sum()} ({customers['solar_installed'].mean()*100:.1f}%)")
    print(f"  Customers with EV: {customers['ev_charging'].sum()} ({customers['ev_charging'].mean()*100:.1f}%)")


if __name__ == '__main__':
    main()


