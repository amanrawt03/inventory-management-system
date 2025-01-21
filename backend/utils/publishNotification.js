import client from "../config/redisConfig.js";
export const publishNotification = async (channel, message) => {
  try {
    await client.publish(channel, JSON.stringify(message));
    console.log(`Message published to ${channel}:`, message);
  } catch (error) {
    console.error("Error publishing notification:", error);
  }
};
