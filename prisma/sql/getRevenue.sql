SELECT TO_CHAR(i.date, 'Mon') AS month, SUM(i.amount) / 100.0 AS revenue
FROM invoices i
JOIN customers c ON i.customer_id = c.id
WHERE i.date >= CURRENT_DATE - INTERVAL '12 months'
AND c.org_code = $1
GROUP BY TO_CHAR(i.date, 'Mon'), EXTRACT(MONTH FROM i.date)
ORDER BY EXTRACT(MONTH FROM i.date);
