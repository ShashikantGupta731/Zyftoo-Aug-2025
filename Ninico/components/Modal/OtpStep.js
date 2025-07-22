'use client';
import React from 'react';

export default function OtpStep({ otp, setOtp, onVerify, onBack }) {

    return (
        <>
            <h2>Enter OTP</h2>
            <input 
                type="text" 
                placeholder="Enter OTP" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ padding: '8px', margin: '10px 0', width: '80%' }} 
            />
            <br />
            <button className="tptrack__submition" onClick={onVerify}>Verify OTP</button>
            <br />
            <button 
                style={{ marginTop: '10px', background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
                onClick={onBack}
            >
                Back to Phone Number
            </button>
        </>
    );
}
