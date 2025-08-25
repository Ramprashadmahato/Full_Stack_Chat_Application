import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  // Automatically redirect after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/"); // redirect to home page
    }, 3000);

    // Cleanup the timer on unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>404 PAGE NOT FOUND :(</h1>
      <p>Redirecting to Home page in 3 seconds...</p>
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Go to Home Now
      </button>
    </div>
  );
};

export default PageNotFound;
