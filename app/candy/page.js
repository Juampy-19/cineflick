'use client';

import { useEffect, useState } from "react";
import CardCandy from "../components/CardCandy";
import Navbar from "../components/Navbar";

export default function CandyPage() {
    const [loading, setLoading] = useState(true);
    const [candy, setCandy] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchCandy() {
            try {
                const res = await fetch('/api/candy');
                if (!res.ok) {
                    throw new Error('Error en el servidor');
                }
                const data = await res.json();
                setCandy(data);
            } catch (error) {
                console.error(error);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchCandy();
    }, []);

    const combos = candy.filter(c => c.type_id === 1);
    const popCorn = candy.filter(c => c.type_id === 2);
    const drinks = candy.filter(c => c.type_id === 3);
    const snacks = candy.filter(c => c.type_id === 4);
    const candies = candy.filter(c => c.type_id === 5);
    const coffeeIceCream = candy.filter(c => c.type_id === 6);

    const navItems = [
        { id: 'combos', label: 'Combos' },
        { id: 'popCorn', label: 'Pochoclos' },
        { id: 'drinks', label: 'Bebidas' },
        { id: 'snacks', label: 'Snacks' },
        { id: 'candies', label: 'Golosinas' },
        { id: 'coffeeIceCream', label: 'Café y helado' }
    ]

    // Error en el servidor.
    if (error) {
        return (
            <div className="w-1/2 flex flex-col justify-center items-center p-4 m-auto mb-6 mt-6 border-2 border-[var(--green)] rounded-xl bg-[var(--teal)]">
                <p>Error en el servidor</p>
                <img src="/img/error500.png" />
            </div>
        )
    }

    return (
        <main className="mb-5 p-2">
            <Navbar navItems={navItems} observeDependency={candy} />

            <section id="combos" className="scroll-mt-36">
                <h3 className="text-xl text-center">Combos</h3>
                <CardCandy items={combos} loading={loading} />
            </section>

            <section id="popCorn" className="scroll-mt-36">
                <h3 className="text-xl text-center">Pochoclos</h3>
                <CardCandy items={popCorn} loading={loading}/>
            </section>

            <section id="drinks" className="scroll-mt-36">
                <h3 className="text-xl text-center">Bebidas</h3>
                <CardCandy items={drinks} loading={loading}/>
            </section>

            <section  id="snacks" className="scroll-mt-36">
                <h3 className="text-xl text-center">Snacks</h3>
                <CardCandy items={snacks} loading={loading}/>
            </section>

            <section id="candies" className="scroll-mt-36">
                <h3 className="text-xl text-center">Golosinas</h3>
                <CardCandy items={candies} loading={loading}/>
            </section>

            <section id="coffeeIceCream" className="scroll-mt-36">
                <h3 className="text-xl text-center">Café y helado</h3>
                <CardCandy items={coffeeIceCream} loading={loading}/>
            </section>
        </main>
    )
}