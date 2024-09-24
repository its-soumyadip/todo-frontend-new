import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function GoogleLoginButton() {
  const handleLoginSuccess = async (response) => {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/auth/convert-token/",
        {
          grant_type: "convert_token",
          client_id: process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_ID,
          client_secret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
          backend: "google-oauth2",
          token: response.credential,
        }
      );

      // Store token and handle successful login
      localStorage.setItem("token", data.access_token);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={(error) => console.error("Login failed:", error)}
    />
  );
}

export default GoogleLoginButton;
