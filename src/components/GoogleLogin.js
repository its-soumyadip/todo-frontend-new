import React, { useEffect } from "react";

const GoogleLogin = ({ onLogin }) => {
  useEffect(() => {
    /* Initialize the Google Login button */
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,

      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      { theme: "outline", size: "large" } // Customize the button
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeBlur = () => {
    document.body.classList.remove("add_blur");
  };

  // Handle the response after a successful login
  const handleCredentialResponse = (response) => {
    const googleToken = response.credential;

    // Send the token to Django backend
    fetch("https://iamsoumyadip.pythonanywhere.com/auth/google/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: googleToken,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the backend response (e.g., store token in localStorage)
        localStorage.setItem("token", data.access_token);
        console.log("Login successful, token stored:", data.access_token);
        localStorage.setItem("username", data.username);
        removeBlur();
        onLogin(data.username);
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  return (
    <div className="google-signin-container">
      <div id="googleSignInDiv"></div>{" "}
      {/* Google Sign-in button will render here */}
    </div>
  );
};

export default GoogleLogin;
