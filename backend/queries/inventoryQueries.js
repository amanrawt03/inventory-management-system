export const GET_ALL_LOCATIONS = `
  SELECT 
    l.location_id,
    l.location_name,
    COUNT(ii.product_id) AS total_items,
    l.created_at
  FROM 
    locations l
  LEFT JOIN 
    inventory_items ii ON l.location_id = ii.location_id
  GROUP BY 
    l.location_id, l.location_name, l.created_at
  ORDER BY 
    l.location_name
  LIMIT $1 OFFSET $2;
`;

export const CHECK_CATEGORY_EXISTS = `
  SELECT category_id FROM product_categories WHERE category_name = $1;
`;

export const GET_LOCATION_DETAILS = `
      SELECT 
          l.location_id,
          l.location_name,
          p.product_id,
          p.product_name,
          pc.category_name,
          ii.quantity
      FROM 
          locations l
      JOIN 
          inventory_items ii ON l.location_id = ii.location_id
      JOIN 
          products p ON ii.product_id = p.product_id
      JOIN 
          product_categories pc ON p.category_id = pc.category_id
      WHERE 
          l.location_id = $1;
`;

export const GET_ALL_CATEGORIES = `
  SELECT 
  pc.category_id, 
  pc.category_name, 
  pc.created_at,
  COUNT(DISTINCT p.product_id) AS unique_item_count
FROM 
  product_categories pc
LEFT JOIN 
  products p ON pc.category_id = p.category_id
LEFT JOIN 
  inventory_items ii ON p.product_id = ii.product_id
GROUP BY 
  pc.category_id, pc.category_name, pc.created_at
ORDER BY 
  pc.category_id
LIMIT $1 OFFSET $2;

`;

export const GET_ALL_ITEMS_FROM_CATEGORY = `
      SELECT p.product_id, p.product_name, ii.quantity
      FROM locations l
      JOIN inventory_items ii ON l.location_id = ii.location_id
      JOIN products p ON ii.product_id = p.product_id
      JOIN product_categories pc ON p.category_id = pc.category_id
      WHERE l.location_name = $1 AND pc.category_name = $2;
`;

export const IS_EXISTING_LOCATION = `SELECT * FROM locations WHERE location_name = $1`;

export const ADD_NEW_LOCATION = `
      INSERT INTO locations (location_name)
      VALUES ($1)
      RETURNING location_id, location_name;
`;

export const GET_LOCATION_ID = `SELECT location_id FROM locations WHERE location_name = $1;`;
export const GET_SUPPLIER_ID = `SELECT supplier_id FROM suppliers WHERE supplier_name = $1;`;

export const GET_CATEGORY_ID = `SELECT category_id FROM product_categories WHERE category_name = $1;`;

export const GET_ITEM_FROM_LOCATION = `
      SELECT ii.inventory_item_id 
      FROM inventory_items ii
      JOIN products p ON ii.product_id = p.product_id
      WHERE ii.location_id = $1 AND p.product_name = $2;
`;

export const GET_ITEM_QUANTITY = `
      SELECT quantity
      FROM inventory_items
      WHERE location_id = $1 AND product_id = $2;
`;

export const UPDATE_ITEM_QUANTITY = `
      UPDATE inventory_items
      SET quantity = quantity + $1
      WHERE location_id = $2 AND product_id = $3;
`;

export const INSERT_NEW_CATEGORY = `
  INSERT INTO product_categories (category_name)
  VALUES ($1)
  RETURNING category_id;
`;

export const GET_ALL_ITEMS = `
      SELECT 
          p.product_id,
          p.product_name,
          SUM(ii.quantity) AS total_quantity
      FROM 
          inventory_items ii
      JOIN 
          products p ON ii.product_id = p.product_id
      GROUP BY 
          p.product_id, p.product_name
      ORDER BY 
          p.product_name
      LIMIT $1 OFFSET $2;
      `;

export const GET_ALL_SUPPLIERS = `
SELECT * FROM suppliers
 LIMIT $1 OFFSET $2;`;

export const CHECK_SUPPLIER_EXISTS = `SELECT * FROM suppliers WHERE contact_email = $1;`;

export const INSERT_NEW_SUPPLIER = `INSERT INTO suppliers (supplier_name, contact_email)
VALUES ($1, $2)
RETURNING supplier_id;`;
