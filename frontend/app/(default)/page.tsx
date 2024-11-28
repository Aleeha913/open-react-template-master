"use client"; // Mark this as a Client Component

import { useState } from "react";

export default function Home() {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // New state for loading

  const handleFileUpload = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async (event: Event) => {
      const input = event.target as HTMLInputElement;

      if (input.files && input.files[0]) {
        const selectedFile = input.files[0];
        const formData = new FormData();
        formData.append("image", selectedFile);

        setLoading(true); // Set loading to true while waiting for the server response
        setPrediction(null); // Clear any previous predictions

        try {
          const response = await fetch("http://127.0.0.1:3002/api/predict", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Failed to fetch prediction");
          }

          const data = await response.json();
          setPrediction(data.prediction);
          setImagePath(`http://localhost:3002/uploads/${data.image_path}`);
        } catch (error) {
          console.error("Error during prediction:", error);
          alert("An error occurred while predicting. Please try again.");
        } finally {
          setLoading(false); // Set loading to false when the process completes
        }
      }
    };

    fileInput.click();
  };

  return (
    <div style={{ textAlign: "center", padding: "50px 20px" }}>
      {/* Heading */}
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#ffffff",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
        }}
      >
        Ocular Toxoplasmosis Prediction
      </h1>

      {/* Button */}
      <button
        onClick={handleFileUpload}
        style={{
          padding: "12px 24px",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: "pointer",
          backgroundColor: "rgb(17 13 166)",
          color: "#fff",
          border: "2px solid transparent",
          borderRadius: "15px",
          transition: "all 0.3s ease",
          boxShadow: "0 0 0 rgba(255, 255, 255, 0)",
        }}
        onMouseOver={(e) => {
          const target = e.target as HTMLButtonElement;
          target.style.backgroundColor = "#0056b3";
          target.style.boxShadow = "0 0 8px rgba(255, 255, 255, 0.8)";
        }}
        onMouseOut={(e) => {
          const target = e.target as HTMLButtonElement;
          target.style.backgroundColor = "rgb(17 13 166)";
          target.style.boxShadow = "0 0 0 rgba(255, 255, 255, 0)";
        }}
        onMouseDown={(e) => {
          const target = e.target as HTMLButtonElement;
          target.style.border = "2px solid white";
        }}
        onMouseUp={(e) => {
          const target = e.target as HTMLButtonElement;
          target.style.border = "2px solid transparent";
        }}
      >
        Upload Image for Ocular Toxoplasmosis Diagnosis
      </button>

      {/* Loading Spinner */}
      {loading && (
        <div style={{ marginTop: "30px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid rgba(255, 255, 255, 0.3)",
              borderTop: "4px solid #ffffff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          ></div>
          <p
            style={{
              marginTop: "10px",
              fontSize: "18px",
              color: "#ffffff",
              fontWeight: "bold",
            }}
          >
            Diagnosing your results...
          </p>
        </div>
      )}

      {/* Prediction Result */}
      {prediction && !loading && (
        <div
          style={{
            marginTop: "30px",
            fontSize: "20px",
            color: prediction === "Diseased" ? "red" : "green",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {prediction === "Diseased" ? (
            <>
              <span role="img" aria-label="danger">
                ⚠️
              </span>
              <span>{`Prediction Result: ${prediction}`}</span>
            </>
          ) : (
            <>
              <span role="img" aria-label="success">
                ✅
              </span>
              <span>{`Prediction Result: ${prediction}`}</span>
            </>
          )}
        </div>
      )}

      {/* Spinner Animation CSS */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
