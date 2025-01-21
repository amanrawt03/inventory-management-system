export const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} lac`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };