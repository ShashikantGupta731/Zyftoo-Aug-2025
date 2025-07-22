'use client';
import React from 'react';

export default function ResetPassword({ password, setPassword, confirmPassword, setConfirmPassword, onSubmit }) {

    return (
        <>
            <h2>Reset Your Password</h2>
            <input 
                type="password" 
                placeholder="New Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '8px', margin: '10px 0', width: '80%' }} 
            />
            <br />
            <input 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ padding: '8px', margin: '10px 0', width: '80%' }} 
            />
            <br />
            <button className="tptrack__submition" onClick={onSubmit}>Submit</button>
        </>
    );
}
