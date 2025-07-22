'use client';
import React from 'react';

export default function PhoneStep({ phoneNumber, setPhoneNumber, onNext }) {
    return (
        <div className="phone-step-container">
            <h2 className="phone-step-heading">Forgot Password</h2>
            <p className="phone-step-subtext">Enter your phone number to reset your password.</p>

            <div className="phone-step-input-wrapper">
                <span className="phone-step-country-code">+91</span>
                <input
                    type="text"
                    placeholder="Phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="phone-step-input"
                />
            </div>

            <button className="phone-step-continue-btn" onClick={onNext}>
                CONTINUE
            </button>

            <p className="phone-step-cancel-text" onClick={onNext}>Cancel</p>
        </div>
    );
}
