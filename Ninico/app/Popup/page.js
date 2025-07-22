'use client';
import React, { useState } from 'react';
import Modal from '@/components/Modal/modal';
 // adjust the path as per your project structure

export default function HomePage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <h1>Welcome to My Next.js App</h1>
            <button onClick={() => setShowModal(true)}>Open Popup</button>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <h2>This is a Popup!</h2>
                <p>Hello from the modal!</p>
            </Modal>
        </div>
    );
}
    