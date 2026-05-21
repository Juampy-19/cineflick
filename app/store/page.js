'use client';

import { useEffect, useRef, useState } from "react";
import CardStore from "../components/CardStore";

export default function StorePage() {
    const [loading, setLoading] = useState(true);
    const [store, setStore] = useState([]);
    const [error, setError] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const linksRef = useRef({});
    const [underlineStyle, setUnderlineStyle] = useState({});
    const navRef = useRef(null);

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
                threshold: 0.1,
                rootMargin: '-50px 0px -50px 0px'
            }
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, [store]);

    useEffect(() => {
        const activeLink = linksRef.current[activeSection];

        if (activeLink) {
            setUnderlineStyle({
                left: activeLink.offsetLeft,
                width: activeLink.offsetWidth
            });
        }
    }, [activeSection]);

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

    const navItems = [
        { id: 'nuevo', label: 'Nuevo' },
        { id: 'tazas', label: 'Tazas' },
        { id: 'disney', label: 'Dinsey' },
        { id: 'pochocleras', label: 'Pochocleras' }
    ]

    return (
        <main className="mb-5 p-2">
            {/* Desktop nav */}
            <nav ref={navRef} className="hidden relative sticky top-25 mb-2 gap-4 p-2 z-10 md:flex bg-[var(--navy)]">
                <span className="absolute bottom-0 h-[3px] bg-[var(--green)] tansition-all duration-300" style={underlineStyle}></span>
                {navItems.map((item) => (
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

            <section id="nuevo" className="scroll-mt-36">
                <h3 className="text-xl text-center">Nuevo</h3>
                <CardStore products={nuevo} loading={loading} />
            </section>

            <section id="tazas" className="scroll-mt-36">
                <h3 className="text-xl text-center">Tazas</h3>
                <CardStore products={tazas} loading={loading} />
            </section>

            <section id="disney" className="scroll-mt-36">
                <h3 className="text-xl text-center">Disney</h3>
                <CardStore products={disney} loading={loading} />
            </section>

            <section id="pochocleras" className="scroll-mt-36">
                <h3 className="text-xl text-center">Pochocleras</h3>
                <CardStore products={pochocleras} loading={loading} />
            </section>
        </main>
    )
}