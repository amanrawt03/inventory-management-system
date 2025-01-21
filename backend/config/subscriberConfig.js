import { createClient } from "redis";

// Create Redis subscriber client
const subscriber = createClient({
  username: "default",
  password: "gkV442y7UbB5WBHzqxznQjy9WQmnUF6K",
  socket: {
    host: "redis-11272.crce179.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 11272,
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
