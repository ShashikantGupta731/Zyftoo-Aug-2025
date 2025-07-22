'use client';
import React, { useState } from 'react';

export default function SignupDetailsForm({ onComplete }) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = () => {
        if (!name || !address || !email || !password || !confirmPassword) {
            alert('Please fill all fields');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        console.log({ name, address, email, password });
        onComplete();
    };

    return (
        <div className="tptrack__product mb-40">
            <div className="tptrack__content grey-bg-3 p-4">
                <div className="tptrack__item d-flex mb-20">
                    <div className="tptrack__item-icon">
                        <img src="/assets/img/icon/sign-up.png" alt="signup icon" />
                    </div>
                    <div className="tptrack__item-content">
                        <h4 className="tptrack__item-title">Complete Your Profile</h4>
                        <p>Please provide your details to complete registration.</p>
                    </div>
                </div>

                <div className="tptrack__id mb-10">
                    <input 
                        type="text" 
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="tptrack__id mb-10">
                    <input 
                        type="text" 
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="tptrack__id mb-10">
                    <input 
                        type="email" 
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="tptrack__email mb-10">
                    <input 
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="tptrack__email mb-10">
                    <input 
                        type="password" 
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="tptrack__btn">
                    <button 
                        className="tptrack__submition tpsign__reg"
                        onClick={handleSubmit}
                    >
                        Submit<i className="fal fa-long-arrow-right" />
                    </button>
                </div>
            </div>
        </div>
    );
}
