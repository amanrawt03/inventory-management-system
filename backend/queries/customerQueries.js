export const CHECK_CUSTOMER_EXISTS = `SELECT * FROM customers WHERE customer_email = $1`;
export const INSERT_NEW_CUSTOMER = `INSERT INTO customers (customer_name, customer_email) VALUES ($1, $2) RETURNING customer_id`;
