SELECT TO_CHAR(date, 'Mon') AS month, SUM(amount) / 100.0 AS revenue
FROM invoices
WHERE date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY TO_CHAR(date, 'Mon'), EXTRACT(MONTH FROM date)
ORDER BY EXTRACT(MONTH FROM date);
