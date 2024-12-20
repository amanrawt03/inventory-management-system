import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";

const InsightsModal = ({ typeId, onClose, type }) => {
  const [insightItems, setInsightItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (typeId) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [typeId]);

  if (!typeId) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
          {type === "sell" ? "Selling Insights" : "Purchase Insights"}
        </h2>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Insights List */}
        {!loading && !error && (
          <div className="space-y-4">
            {insightItems.length === 0 ? (
              <p className="text-center text-gray-500">No insights available</p>
            ) : (
              <ul className="space-y-4">
                {insightItems.map((item, index) => (
                  <li 
                    key={index} 
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.product_name}
                      </h3>
                      <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                        {item.category_name}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm text-gray-700">
                      <div>
                        <span className="font-medium">Quantity:</span> {item.quantity}
                      </div>
                      <div>
                        <span className="font-medium">Cost Price:</span> ₹{item.cost_price}
                      </div>
                      <div>
                        <span className="font-medium">
                          {type === "sell" ? "Selling Price" : "Location"}:
                        </span>{" "}
                        {type === "sell" ? `₹${item.selling_price}` : item.location_name}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsModal;