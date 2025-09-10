# comps_outlier_filter.py
import numpy as np

def filter_outliers_iqr(prices):
    q1, q3 = np.percentile(prices, [25, 75])
    iqr = q3 - q1
    lower, upper = q1 - 1.5 * iqr, q3 + 1.5 * iqr
    return [p for p in prices if lower <= p <= upper]

def filter_outliers_mad(prices):
    median = np.median(prices)
    mad = np.median(np.abs(prices - median))
    return [p for p in prices if abs(p - median) <= 2.5 * mad]
