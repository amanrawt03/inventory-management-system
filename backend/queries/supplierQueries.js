export const GET_ALL_SUPPLIERS = `
SELECT * FROM suppliers
 LIMIT $1 OFFSET $2;`;


export const CHECK_SUPPLIER_EXISTS = `SELECT * FROM suppliers WHERE contact_email = $1;`;

export const INSERT_NEW_SUPPLIER = `INSERT INTO suppliers (supplier_name, contact_email)
VALUES ($1, $2)
RETURNING supplier_id;`;
