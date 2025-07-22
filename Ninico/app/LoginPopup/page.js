// app/page.js or wherever your login trigger is
'use client';
import React, { useState } from 'react';
import LoginModal from '@/components/Modal/LoginModal'; // adjust path as needed

export default function LoginPopup() {
    const [showLogin, setShowLogin] = useState(false);

    return (
        <div>
            <h1>Welcome to My Next.js App</h1>
            <button onClick={() => setShowLogin(true)}>Login</button>

            <LoginModal show={showLogin} onClose={() => setShowLogin(false)} />
        </div>
    );
}
