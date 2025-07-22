'use client';
import React from 'react';


export default function Modal({ show, onClose, children }) {
    if (!show) return null;

    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal-content">
                <button onClick={onClose} className="custom-modal-close">×</button>
                {children}
            </div>
        </div>
    );
}
