#!/usr/bin/python3
import csv
import pandas as pd
from prophet import Prophet

# Sign1_full_fitted.csv
df = pd.read_csv('Sign1_full_fitted.csv')

# renames column labels to work with Prophet
df = df.rename(columns={'ts': 'ds', 'y1': 'y'})

p = Prophet()
p.fit(df)

future = p.make_future_dataframe(periods=365)

forecast = p.predict(future)
#forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail()

forecast[['ds', 'yhat']].to_csv('forecast1.csv', index=False)


# Sign12_full_fitted.csv
df2 = pd.read_csv('Sign12_full_fitted.csv')

# renames column labels to work with Prophet
df2 = df2.rename(columns={'ts': 'ds', 'y12': 'y'})

p2 = Prophet()
p2.fit(df2)

future2 = p2.make_future_dataframe(periods=365)

forecast2 = p2.predict(future2)
#forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail()

forecast2[['ds', 'yhat']].to_csv('forecast12.csv', index=False)


# Sign14_full_fitted.csv
df3 = pd.read_csv('Sign14_full_fitted.csv')

# renames column labels to work with Prophet
df3 = df3.rename(columns={'ts': 'ds', 'y14': 'y'})

p3 = Prophet()
p3.fit(df3)

future3 = p3.make_future_dataframe(periods=365)

forecast3 = p3.predict(future3)
#forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail()

forecast3[['ds', 'yhat']].to_csv('forecast14.csv', index=False)