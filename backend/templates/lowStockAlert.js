export const generateLowStockEmailTemplate = (items) => {
  const getStockStyle = (quantity) => {
    if (quantity <= 5) {
      return 'color: #ffffff; font-weight: bold; background-color: #e63946;' // White text with dark red background for critical
    } else if (quantity <= 15) {
      return 'color: #d97706; font-weight: bold;'; // Dark orange text for low
    }
    return 'color: #2d3748;'; // Default color
  };

  const tableRows = items
    .map(
      item => `
        <tr style="${item.totalstocks <= 5 ? 'background-color: #ffe5e5;' : ''}">
          <td style="padding: 16px; border-bottom: 1px solid #edf2f7;">${item.product_name}</td>
          <td style="padding: 16px; border-bottom: 1px solid #edf2f7;">${item.category_name}</td>
          <td style="padding: 16px; border-bottom: 1px solid #edf2f7; text-align: center; ${getStockStyle(item.totalstocks)}">${item.totalstocks}</td>
        </tr>
      `
    )
    .sort((a, b) => a.totalstocks - b.totalstocks) // Sort by quantity to show most critical first
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.5;
            color: #2d3748;
            background-color: #f7fafc;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 24px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding: 24px;
            background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
            border-radius: 8px 8px 0 0;
            margin: -24px -24px 24px -24px;
          }
          .header h2 {
            color: #ffffff;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
          }
          .header p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
          }
          .threshold-badge {
            display: inline-block;
            margin-top: 16px;
            padding: 8px 16px;
            background-color: rgba(255, 255, 255, 0.15);
            border-radius: 9999px;
            color: #ffffff;
            font-size: 14px;
          }
          .legend {
            margin: 16px 0;
            padding: 12px;
            background-color: #f8fafc;
            border-radius: 6px;
            font-size: 14px;
          }
          .legend-item {
            display: flex;
            align-items: center;
            margin: 4px 0;
          }
          .legend-color {
            width: 16px;
            height: 16px;
            margin-right: 8px;
            border-radius: 4px;
          }
          .table-container {
            margin: 24px 0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            background-color: white;
          }
          .table th {
            background-color: #f8fafc;
            color: #4a5568;
            padding: 16px;
            text-align : left;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 2px solid #edf2f7;
          }
          .table td {
            font-size: 15px;
          }
          .cta-button {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);              
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            text-align: center;
            transition: transform 0.15s ease;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .cta-container {
            text-align: center;
            margin: 32px 0;
          }
          .footer {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #edf2f7;
            color: #718096;
            font-size: 14px;
            text-align: center;
          }
          .footer p + p {
            margin-top: 8px;
          }
          @media (max-width: 600px) {
            .container {
              padding: 16px;
            }
            .header {
              padding: 20px;
              margin: -16px -16px 20px -16px;
            }
            .table th, .table td {
              padding: 12px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Low Stock Alert</h2>
            <p>The following items are running low and need attention</p>
            <div class="threshold-badge">
              Critical Threshold: 5 items | Warning Threshold: 15 items
            </div>
          </div>

          <div class="legend">
            <div class="legend-item">
              <div class="legend-color" style="background-color: #e63946;"></div>
              <span>Critical Stock (5 or fewer items) - Immediate Action Required</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #ffffff;"></div>
              <span>Low Stock (15 or fewer items) - Action Required</span>
            </div>
          </div>
          
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th style="text-align: center">Current Stock</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </div>

          <div class="cta-container">
            <a href="${process.env.PURCHASE_ITEMS_URL}" class="cta-button" style="text-decoration: none">
              <p style="color:#ffffff">Purchase Items Now →</p>
            </a>
          </div>

          <div class="footer">
            <p>This is an automated message from your inventory management system.</p>
            <p>Items with 5 or fewer units require immediate attention.</p>
            <p>If you have any questions, please contact the system administrator.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Helper function to generate plain text version
export const generatePlainTextEmail = (items) => {
  const sortedItems = [...items].sort((a, b) => a.totalstocks - b.totalstocks);
  return `Low stock items:
CRITICAL (5 or fewer items):
${sortedItems
.filter(item => item.totalstocks <= 5)
.map(item => `❗ Product: ${item.product_name}, Category: ${item.category_name}, Current Stock: ${item.totalstocks}`)
.join("\n")}

WARNING (15 or fewer items):
${sortedItems
.filter(item => item.totalstocks > 5 && item.totalstocks <= 15)
.map(item => `⚠️ Product: ${item.product_name}, Category: ${item.category_name}, Current Stock: ${item.totalstocks}`)
.join("\n")}`;
};