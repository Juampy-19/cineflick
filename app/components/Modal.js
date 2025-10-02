'use client';

import { useEffect, useState } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
    const [show, setShow] = useState(false);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShow(true);
            requestAnimationFrame(() => setAnimate(true));
        } else {
            setAnimate(false);
            const timeout = setTimeout(() => setShow(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    if (!show) return null;

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-500 ${animate ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundColor: 'var(--transparent-green)'}}>
            <div className={`relative p-6 rounded-lg shadow-lg w-md text-center transform transition-all duration-500 ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} style={{ backgroundColor: 'var(--navy)'}}>
                {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
                <div className="mb-4">{children}</div>
                <button onClick={onClose} className="mt-4">
                    Cerrar
                </button>
            </div>
        </div>
    )
}