'use client';

import { useEffect, useState } from "react";
import CardCandy from "../components/CardCandy";

export default function CandyPage() {
    const [loading, setLoading] = useState(true);
    const [candy, setCandy] = useState([]);
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        async function fetchCandy() {
            try {
                const res = await fetch('/api/candy');
                const data = await res.json();
                setCandy(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchCandy();
    }, []);

    useEffect(() => {
        const sections = document.querySelectorAll('section');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: '-50px 0px -50px 0px'
            }
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, [candy]);

    if (loading) return <p>Cargando...</p>;

    const combos = candy.filter(c => c.type_id === 1);
    const popCorn = candy.filter(c => c.type_id === 2);
    const drinks = candy.filter(c => c.type_id === 3);
    const snacks = candy.filter(c => c.type_id === 4);
    const candies = candy.filter(c => c.type_id === 5);
    const coffeeIceCream = candy.filter(c => c.type_id === 6);

    return (
        <main>
            <nav className="sticky top-30 z-10 flex bg-[var(--navy)]">
                <a href="#combos" className={activeSection === 'combos' ? 'border-b-2 border-[var(--green)]' :  ''}>Combos</a>
                <a href="#popCorn" className={activeSection === 'popCorn' ? 'border-b-2 border-[var(--green)]' : ''}>Pochoclos</a>
                <a href="#drinks" className={activeSection === 'drinks' ? 'border-b-2 border-[var(--green)]' : ''}>Bebidas</a>
                <a href="#snacks" className={activeSection === 'snacks' ? 'border-b-2 border-[var(--green)]' : ''}>Snacks</a>
                <a href="#candies" className={activeSection === 'candies' ? 'border-b-2 border-[var(--green)]' : ''}>Golosinas</a>
                <a href="#coffeeIceCream" className={activeSection ===  'coffeeIceCream' ? 'border-b-2 border-[var(--green)]' : ''}>Café y helado</a>
            </nav>

            <section id="combos">
                <h3>Combos</h3>
                <CardCandy items={combos} />
            </section>

            <section id="popCorn">
                <h3>Pochoclos</h3>
                <CardCandy items={popCorn} />
            </section>

            <section id="drinks">
                <h3>Bebidas</h3>
                <CardCandy items={drinks} />
            </section>

            <section  id="snacks">
                <h3>Snacks</h3>
                <CardCandy items={snacks} />
            </section>

            <section id="candies">
                <h3>Golosinas</h3>
                <CardCandy items={candies} />
            </section>

            <section id="coffeeIceCream">
                <h3>Café y helado</h3>
                <CardCandy items={coffeeIceCream} />
            </section>
        </main>
    )
}