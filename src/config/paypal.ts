import axios from "axios";
import { AxiosError } from "axios";
import dotenv from "dotenv";

dotenv.config();

async function generateAccessToken() {
  try {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error(
        "PayPal Client ID or Secret missing in environment variables"
      );
    }

    const paypalUrl =
      process.env.PAYPAL_URL || "https://api-m.sandbox.paypal.com";

    console.log("Requesting PayPal access token...");
    const response = await axios.post(
      `${paypalUrl}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: clientId,
          password: clientSecret,
        },
      }
    );

    console.log("PayPal access token received");
    return response.data.access_token;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error(
      "PayPal generateAccessToken error:",
      axiosError.response?.data || axiosError.message
    );
    throw new Error(
      `Failed to generate PayPal access token: ${axiosError.message}`
    );
  }
}

const paypalConfig = {
  generateAccessToken,
};

// Export module
module.exports = paypalConfig;
