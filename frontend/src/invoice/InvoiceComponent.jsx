import React, { useState, useEffect } from "react";
import axios from "axios";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Style improvements for a more professional invoice look
const styles = StyleSheet.create({
  page: {
    padding: "30px",
    backgroundColor: "#f9f9f9",
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "normal",
    color: "#34495e",
    marginBottom: 5,
  },
  headerRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ecf0f1",
    padding: "10px 15px",
    borderRadius: 5,
    marginBottom: 10,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "8px 15px",
    borderBottom: "1px solid #ddd",
  },
  cell: {
    fontSize: 12,
    color: "#2c3e50",
    textAlign: "center",
    width: "20%",
  },
  cellBold: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "left",
  },
  totalSection: {
    marginTop: 20,
    display: "flex",
    justifyContent: "flex-end",
    borderTop: "2px solid #ccc",
    paddingTop: 10,
  },
  total: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  footer: {
    marginTop: 30,
    fontSize: 10,
    textAlign: "center",
    color: "#7f8c8d",
  },
});

const InvoiceDocument = ({ transaction, type }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPurchaseCost, setTotalPurchaseCost] = useState(0); // For purchase total

  const {
    customer_name,
    supplier_name,
    transaction_date,
    total_amount,
    sell_transaction_id,
    purchase_transaction_id,
  } = transaction;

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError("");
        let url;
        if (type === "sell") {
          url = `http://localhost:3000/api/transaction/sellingInsights/${sell_transaction_id}`;
        } else if (type === "purchase") {
          url = `http://localhost:3000/api/transaction/purchaseInsights/${purchase_transaction_id}`;
        } else {
          throw new Error("Invalid type");
        }
        const response = await axios.get(url);
        const dataItems = response.data.items;

        setItems(dataItems);

        // Calculate total purchase cost if type is purchase
        if (type === "purchase") {
          const total = dataItems.reduce(
            (sum, item) => sum + item.cost_price * item.quantity,
            0
          );
          setTotalPurchaseCost(total);
        }
      } catch (err) {
        setError("Failed to load insights. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (sell_transaction_id || purchase_transaction_id) {
      fetchInsights();
    }
  }, [sell_transaction_id, purchase_transaction_id, type]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Invoice</Text>
          <Text style={styles.subTitle}>
            {type === "sell" ? "Customer Name" : "Supplier Name"}:{" "}
            {type === "sell" ? customer_name : supplier_name}
          </Text>
          <Text style={styles.subTitle}>
            Date: {new Date(transaction_date).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.headerRow}>
            <Text style={styles.cellBold}>Product Name</Text>
            <Text style={styles.cellBold}>Quantity</Text>
            <Text style={styles.cellBold}>
              {type === "sell" ? "Selling Price" : "Purchase Price"}
            </Text>
            <Text style={styles.cellBold}>Category</Text>
            {type === "purchase" && <Text style={styles.cellBold}>Location</Text>}
          </View>
          {loading ? (
            <Text>Loading...</Text>
          ) : error ? (
            <Text>{error}</Text>
          ) : items.length > 0 ? (
            items.map((item, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.cell}>{item.product_name}</Text>
                <Text style={styles.cell}>{item.quantity}</Text>
                <Text style={styles.cell}>
                  ${type === "sell" ? item.selling_price : item.cost_price}
                </Text>
                <Text style={styles.cell}>{item.category_name}</Text>
                {type === "purchase" && <Text style={styles.cell}>{item.location_name}</Text>}
              </View>
            ))
          ) : (
            <Text>No items found</Text>
          )}
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.total}>
            Total Amount: $
            {type === "sell" ? total_amount : totalPurchaseCost.toFixed(2)}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoiceDocument;
