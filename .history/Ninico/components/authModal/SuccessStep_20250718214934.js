'use client';

export default function SuccessStep({ onClose }) {
  return (
    <>
      <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>Congratulations</h3>
      <p style={{ marginBottom: "30px" }}>You have successfully Logged In.</p>
      <button className="continue-btn" onClick={onClose}>
        CONTINUE SHOPPING
      </button>
    </>
  );
}
