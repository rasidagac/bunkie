SELECT
  row_number() OVER () AS id,
  e.house_id,
  es.user_id AS debtor,
  e.user_id AS creditor,
  sum(es.amount) AS amount
FROM
  (
    expenses e
    JOIN expense_splits es ON ((e.id = es.expense_id))
  )
GROUP BY
  e.house_id,
  es.user_id,
  e.user_id;