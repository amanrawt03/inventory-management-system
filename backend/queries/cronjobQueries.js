export const GET_ITEMS_OF_LOW_STOCK_LEVELS = `SELECT SUM(ii.quantity) AS totalStocks, p.product_name, c.category_name
FROM inventory_items ii
JOIN products p ON ii.product_id = p.product_id
JOIN product_categories c ON p.category_id = c.category_id 
GROUP BY ii.product_id, p.product_name, c.category_name
HAVING SUM(ii.quantity) < 15;`;

export const CLEAR_EMPTY_ITEMS = `SELECT ii.updated_at, p.product_name, c.category_name FROM inventory_items ii 
JOIN products p ON ii.product_id = p.product_id
JOIN product_categories c ON p.category_id = c.category_id 
WHERE ii.quantity = 0 `;
