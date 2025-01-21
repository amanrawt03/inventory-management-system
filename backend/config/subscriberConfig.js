import { createClient } from "redis";

// Create Redis subscriber client
const subscriber = createClient({
  username: "default",
  password: "",
  socket: {
    host: "",
    port: ,
  },
});

export const setupSubscription = async (io) => {
  try {
    await subscriber.connect();
    console.log("Connected to Redis for subscription");

    // Subscribe to the channel and emit messages to connected clients
    subscriber.subscribe("notifications_channel", (message) => {
      const parsedMessage = JSON.parse(message);
      io.emit("notification", parsedMessage); // Emit message to all clients
    });
  } catch (error) {
    console.error("Error setting up Redis subscription:", error);
  }
};
