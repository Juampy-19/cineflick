'use client';

import { useEffect, useState } from "react";

export default function StorePage() {
    const [loading, setLoading] = useState(true);
    const [store, setStore] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchStore() {
            try {
                const res = await fetch('/api/store');
                if (!res.ok) {
                    throw new Error('Error en el servidor');
                }
                const data = await res.json();
                setStore(data);
            } catch (error) {
                console.error(error);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchStore();
    }, []);

    // Error en el servidor.
    if (error) {
        return (
            <div className="w-1/2 flex flex-col justify-center items-center p-4 m-auto mb-6 mt-6 border-2 border-[var(--green)] rounded-xl bg-[var(--teal)]">
                <p>Error en el servidor</p>
                <img src="/img/error500.png" />
            </div>
        )
    }

    const nuevo = store.filter(s => s.type_id === 1);
    const tazas = store.filter(s => s.type_id === 2);
    const disney = store.filter(s => s.type_id === 3);
    const pochocleras = store.filter(s => s.type_id === 4);

    return (
        <div>
            <p>Vista store</p>
        </div>
    )
}