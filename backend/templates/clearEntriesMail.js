export const generateZeroStockRemovalTemplate = (removedItems) => {
    const tableRows = removedItems
      .map(
        item => `
          <tr>
            <td style="padding: 16px; border-bottom: 1px solid #edf2f7;">${item.product_name}</td>
            <td style="padding: 16px; border-bottom: 1px solid #edf2f7;">${item.category_name}</td>
            <td style="padding: 16px; border-bottom: 1px solid #edf2f7; text-align: center;">
              ${new Date(item.updated_at).toLocaleDateString()}
            </td>
          </tr>
        `
      )
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
              background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
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
            .timestamp {
              display: inline-block;
              margin-top: 16px;
              padding: 8px 16px;
              background-color: rgba(255, 255, 255, 0.15);
              border-radius: 9999px;
              color: #ffffff;
              font-size: 14px;
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
              text-align: left;
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
              background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);              
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
              <h2>Entries with 0 stocks cleared</h2>
              <p>The following items have been removed from inventory</p>
              <div class="timestamp">
                ${new Date().toLocaleString()}
              </div>
            </div>
            
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th style="text-align: center">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows}
                </tbody>
              </table>
            </div>
  
            <div class="footer">
              <p>This is an automated message from your inventory management system.</p>
              <p>These items have been permanently removed due to zero stock.</p>
              <p>If you have any questions, please contact the system administrator.</p>
            </div>
          </div>
        </body>
      </html>
    `;
};

// Plain text version
export const generatePlainTextZeroStockEmail = (removedItems) => {
  return `ZERO STOCK ITEMS REMOVAL REPORT
Generated on: ${new Date().toLocaleString()}

The following items have been removed from inventory due to zero stock:
${removedItems
  .map(item => `- ${item.product_name} (${item.category_name}) - Last updated: ${new Date(item.updated_at).toLocaleDateString()}`)
  .join("\n")}

Note: All the empty entries have been removed from the inventory system.`
;
};