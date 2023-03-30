#!/usr/bin/python3
import csv
import pandas as pd
from prophet import Prophet

df = pd.read_csv('Sign1_full_fitted.csv')

# renames column labels to work with Prophet
df = df.rename(columns={'ts': 'ds', 'y1': 'y'})
#df.head()

p = Prophet()
p.fit(df)

future = p.make_future_dataframe(periods=365)
#future.tail()

forecast = p.predict(future)
#forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail()

forecast[['ds', 'yhat']].to_csv('forecast.csv', index=False)