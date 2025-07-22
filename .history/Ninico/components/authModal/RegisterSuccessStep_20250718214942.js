'use client';

export default function RegisterSuccessStep({ setStep, onClose }) {
  return (
    <>
      <div className="login-success-message">
        <h3>Congratulations</h3>
        <p>Your account has been created successfully.</p>
      </div>
      <div className="button-row">
        <button
          className="login-next" 
          id="continue-shopping-btn" 
          onClick={() => {
            setStep('login');
            onClose();
          }}
        >
          CONTINUE SHOPPING
        </button>
        <button
          className="secondary-button" 
          id="continue-shopping-btn" 
          onClick={() => setStep('login')}
        >
          BACK TO LOGIN
        </button>
      </div>
    </>
  );
}
