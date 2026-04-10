'use client';

import { useEffect, useState, useRef } from "react";
import CardCandy from "../components/CardCandy";

export default function CandyPage() {
    const [loading, setLoading] = useState(true);
    const [candy, setCandy] = useState([]);
    const [activeSection, setActiveSection] = useState('');
    const navRef = useRef(null);
    const linksRef = useRef({});
    const [underlineStyle, setUnderlineStyle] = useState({});

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

    useEffect(() => {
        const activeLink = linksRef.current[activeSection];

        if (activeLink) {
            setUnderlineStyle({
                left: activeLink.offsetLeft,
                width: activeLink.offsetWidth
            });
        }
    }, [activeSection]);

    if (loading) return <p>Cargando...</p>;

    const combos = candy.filter(c => c.type_id === 1);
    const popCorn = candy.filter(c => c.type_id === 2);
    const drinks = candy.filter(c => c.type_id === 3);
    const snacks = candy.filter(c => c.type_id === 4);
    const candies = candy.filter(c => c.type_id === 5);
    const coffeeIceCream = candy.filter(c => c.type_id === 6);

    return (
        <main className="mb-5 p-2">
            <nav ref={navRef} className="relative sticky top-25 mb-2 gap-2 p-2 z-10 flex bg-[var(--navy)]">
                <span className="absolute bottom-0 h-[3px] bg-[var(--green)] tansition-all duration-300" style={underlineStyle}></span>
                {[
                    { id: 'combos', label: 'Combos' },
                    { id: 'popCorn', label: 'Pochoclos' },
                    { id: 'drinks', label: 'Bebidas' },
                    { id: 'snacks', label: 'Snacks' },
                    { id: 'candies', label: 'Golosinas' },
                    { id: 'coffeeIceCream', label: 'Café y helado' }
                ].map((item) => (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        ref={(el) => (linksRef.current[item.id] =el)}
                        className={`pb-2 transition ${activeSection === item.id
                                ? 'text-[var(--green)]'
                                : 'hover:text-[var(--green)]'
                            }`}
                    >
                        {item.label}
                    </a>
                ))}
            </nav>

            <section id="combos" className="scroll-mt-36">
                <h3 className="text-xl text-center">Combos</h3>
                <CardCandy items={combos} />
            </section>

            <section id="popCorn" className="scroll-mt-36">
                <h3 className="text-xl text-center">Pochoclos</h3>
                <CardCandy items={popCorn} />
            </section>

            <section id="drinks" className="scroll-mt-36">
                <h3 className="text-xl text-center">Bebidas</h3>
                <CardCandy items={drinks} />
            </section>

            <section  id="snacks" className="scroll-mt-36">
                <h3 className="text-xl text-center">Snacks</h3>
                <CardCandy items={snacks} />
            </section>

            <section id="candies" className="scroll-mt-36">
                <h3 className="text-xl text-center">Golosinas</h3>
                <CardCandy items={candies} />
            </section>

            <section id="coffeeIceCream" className="scroll-mt-36">
                <h3 className="text-xl text-center">Café y helado</h3>
                <CardCandy items={coffeeIceCream} />
            </section>
        </main>
    )
}