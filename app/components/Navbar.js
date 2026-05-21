'use client';

import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";

export default function Navbar({ navItems, observeDependency }) {
    const [activeSection, setActiveSection] = useState('');
    const [underlineStyle, setUnderlineStyle] = useState({});
    const [open, setOpen] = useState(false);

    const linksRef = useRef({});
    const navRef = useRef(null);

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
    }, [observeDependency]);

    useEffect(() => {
        const activeLink = linksRef.current[activeSection];

        if (activeLink) {
            setUnderlineStyle({
                left: activeLink.offsetLeft,
                width: activeLink.offsetWidth
            });
        }
    }, [activeSection]);

    return (
        <>
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

            {/* Mobile nav */}
            <nav className="relative sticky top-25 z-50 mb-2 bg-[var(--navy)] md:hidden">
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 p-2"
                >
                    Menu
                    {open
                         ? <FontAwesomeIcon icon={faAngleLeft} />
                         : <FontAwesomeIcon icon={faAngleRight} /> 
                    }
                </button>

                {/* Overlay */}
                {open && (
                    <div
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40"
                    />
                )}
                
                {/* Menu deslizable */}
                <div
                    className={`
                        fixed top-25 left-0 h-full w-40 bg-[var(--navy)] p-4
                        transform transition-transform duration-300 z-50
                        ${open ? 'translate-x-0' : '-translate-x-full'}
                    `}
                >
                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={() => setOpen(false)}
                            className="mb-10 flex gap-2 items-center m-auto"
                        >
                            Menu <FontAwesomeIcon icon={faAngleLeft} />
                        </button>
                        {navItems.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={() => setOpen(false)}
                                className={`block transition ${activeSection === item.id
                                    ? 'text-[var(--green)]'
                                    : ''
                                    }`}
                            >
                                {item.label}
                            </a>
                        ))
                        }
                    </div>
                </div>
            </nav>
        </>
    )
}