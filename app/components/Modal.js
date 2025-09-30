'use client';

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'var(--transparent-green)'}}>
            <div className="p-6 rounded-lg shadow-lg w-70 text-center" style={{ backgroundColor: 'var(--navy)'}}>
                {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
                <div className="mb-4">{children}</div>
                <button onClick={onClose} className="mt-4">
                    Cerrar
                </button>
            </div>
        </div>
    )
}