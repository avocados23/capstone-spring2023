#!/usr/bin/python3
import csv

with open('Sign1_full_fitted.csv', 'r') as csv_file:
    reader = csv.reader(csv_file)

    for row in reader:
        print(row)