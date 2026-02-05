#!/usr/bin/env python3
# /// script
# dependencies = ["pandas", "requests"]
# ///
"""
Download and prepare life expectancy vs democracy data from Our World in Data.
Run: uv run life-expectancy-vs-electoral-democracy.csv.py
"""

import pandas as pd
import requests
from io import StringIO
from pathlib import Path

# Download data with proper headers
url = "https://ourworldindata.org/grapher/life-expectancy-vs-electoral-democracy-index.csv?v=1&csvType=full&useColumnShortNames=true"
response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
response.raise_for_status()
df = pd.read_csv(StringIO(response.text))

# Rename columns for simplicity (short names from OWID)
df = df.rename(columns={
    'life_expectancy_0': 'lifeExp',
    'electdem_vdem__estimate_best': 'democracy',
    'owid_region': 'region'
})

# Build region lookup (not all rows have region, so we fill from rows that do)
region_lookup = df[df['region'].notna()].set_index('entity')['region'].to_dict()
df['region'] = df['entity'].map(region_lookup)

# Filter out aggregate entities
aggregate_entities = {
    'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'World',
    'High-income countries', 'Low-income countries',
    'Lower-middle-income countries', 'Upper-middle-income countries'
}
df = df[~df['entity'].isin(aggregate_entities)]

# Filter to rows with both lifeExp and democracy values, and year >= 2001
df = df[df['lifeExp'].notna() & df['democracy'].notna() & (df['year'] >= 2001)]

# Select and order columns
df = df[['entity', 'code', 'year', 'lifeExp', 'democracy', 'region']]

# Save to CSV
output_path = Path(__file__).parent / 'life-expectancy-vs-electoral-democracy-index-modern.csv'
df.to_csv(output_path, index=False)

print(f"Saved {len(df)} rows to {output_path.name}")
