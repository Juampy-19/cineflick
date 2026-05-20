'use client';

import { useEffect, useState } from "react";
import CardStore from "../components/CardStore";

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
        <main className="mb-5 p-2">
            <section id="nuevo" className="scroll-mt-36">
                <h3 className="text-xl text-center">Nuevo</h3>
                <CardStore products={nuevo} />
            </section>

            <section id="tazas" className="scroll-mt-36">
                <h3 className="text-xl text-center">Tazas</h3>
                <CardStore products={tazas} />
            </section>

            <section id="disney" className="scroll-mt-36">
                <h3 className="text-xl text-center">Disney</h3>
                <CardStore products={disney} />
            </section>

            <section id="pochocleras" className="scroll-mt-36">
                <h3 className="text-xl text-center">Pochocleras</h3>
                <CardStore products={pochocleras} />
            </section>
        </main>
    )
}