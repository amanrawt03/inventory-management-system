import pool from "../config/pgConfig.js";

const getNetProfit = async(req,res)=>{
    try {
        const revenueResult = await pool.query(`
          SELECT SUM(total_amount) as total_revenue
          FROM sell_transactions
        `);

        const costResult = await pool.query(`
          SELECT SUM(total_cost_price) as total_cost
          FROM purchase_transactions
        `);
    
        const totalRevenue = revenueResult.rows[0].total_revenue || 0;
        const totalCost = costResult.rows[0].total_cost || 0;
        const netProfit = totalRevenue - totalCost;
    
        res.json({ netProfit, totalRevenue, totalCost });
      } catch (error) {
        res.status(500).json({ message: "Error calculating net profit" , error:error.message});
      }
}

export {getNetProfit}