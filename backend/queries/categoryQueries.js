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

export const INSERT_NEW_CATEGORY = `
  INSERT INTO product_categories (category_name)
  VALUES ($1)
  RETURNING category_id;
`;

export const CHECK_CATEGORY_EXISTS = `
  SELECT category_id FROM product_categories WHERE category_name = $1;
`;

