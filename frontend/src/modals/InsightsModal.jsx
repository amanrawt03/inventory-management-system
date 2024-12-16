import React, { useState, useEffect } from "react";
import axios from "axios";

const InsightsModal = ({ typeId, onClose, type }) => {
  const [insightItems, setInsightItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  console.log(typeof typeId)
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError("");
        let url;
        if (type === "sell") {
          url = `http://localhost:3000/api/transaction/sellingInsights/${typeId}`;
        } else if (type === "purchase") {
          url = `http://localhost:3000/api/transaction/purchaseInsights/${typeId}`;
        } else {
          throw new Error("Invalid type");
        }
        const response = await axios.get(url);
        setInsightItems(response.data.items);
      } catch (err) {
        setError("Failed to load insights. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (typeId) {
      fetchInsights();
    }
  }, [typeId, type]);

  return (
    <>
      {/* Background overlay */}
      {typeId && (
        <div className="fixed inset-0 bg-gray-100 opacity-50 z-40"></div>
      )}

      <dialog
        id="insight_modal"
        className="modal fixed inset-0 z-50 flex justify-center items-center"
        open={!!typeId}
      >
        <div className="modal-box p-6 bg-white rounded-lg shadow-lg max-w-3xl w-full">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            {type === "sell" ? "Selling Insights" : "Purchase Insights"}
          </h3>

          {loading ? (
            <div className="flex justify-center items-center space-x-2">
              <div className="animate-spin rounded-full border-t-2 border-blue-500 w-8 h-8"></div>
              <span className="text-gray-500">Loading...</span>
            </div>
          ) : error ? (
            <p className="text-red-500 text-center mt-4">{error}</p>
          ) : (
            <div className="overflow-y-auto max-h-60 mt-4">
              <ul className="space-y-4">
                {insightItems.map((item, index) => (
                  <li
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-lg font-medium text-gray-700">{item.product_name}</div>
                      <div className="text-sm text-gray-500">{item.category_name}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <strong>Quantity:</strong> {item.quantity}
                      </div>
                      <div>
                        <strong>Cost Price:</strong> ${item.cost_price}
                      </div>
                      <div>
                        <strong>{type === "sell" ? "Selling Price" : "Location"}:   </strong>
                        {type === "sell" ? item.selling_price : item.location_name}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="modal-action mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="btn btn-primary text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default InsightsModal;
