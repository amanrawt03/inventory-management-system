import { useState, useEffect } from "react";
import { fetchStockInfoApi } from "../utils/routes";
export const useInventoryStock = (productId) => {
    const [realTimeStock, setRealTimeStock] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('connecting');
  
    useEffect(() => {
      let retryTimeout;
      let retryCount = 0;
      const MAX_RETRIES = 3;
      const RETRY_DELAY = 2000;
  
      const connectEventSource = () => {
        const eventSource = new EventSource(
          `${fetchStockInfoApi}?product_id=${productId}`
        );
  
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setRealTimeStock(data.totalAvailable);
            setConnectionStatus('connected');
            retryCount = 0;
          } catch (error) {
            console.error('Error parsing SSE data:', error);
            toast.error("Error updating stock information");
          }
        };
  
        eventSource.onopen = () => {
          setConnectionStatus('connected');
          retryCount = 0;
        };
  
        eventSource.onerror = (error) => {
          console.error('EventSource error:', error);
          setConnectionStatus('error');
          eventSource.close();
  
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            retryTimeout = setTimeout(() => {
              console.log(`Attempting reconnection ${retryCount}/${MAX_RETRIES}`);
              connectEventSource();
            }, RETRY_DELAY * retryCount);
          } else {
            setConnectionStatus('failed');
            toast.error("Unable to get real-time stock updates");
          }
        };
  
        return eventSource;
      };
  
      const eventSource = connectEventSource();
  
      return () => {
        if (eventSource) {
          eventSource.close();
        }
        if (retryTimeout) {
          clearTimeout(retryTimeout);
        }
        setConnectionStatus('disconnected');
      };
    }, [productId]);
  
    return { realTimeStock, connectionStatus };
  };