'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket, faArrowRightFromBracket, faArrowDown, faBars } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);

    const linkClass = (path) => `md:hover:text-[var(--green)] transition-colors duration-300 ${pathname === path ? 'border-b-2 border-[var(--green)]' : ''}`;

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <header>
            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="flex items-center justify-center md:justify-start">
                    <Image
                        src="/img/cineflick-logo.svg"
                        alt="Logo de CineFlick"
                        width={100}
                        height={100}
                    />

                    <h1 className="p-6 text-2xl md:text-4xl">CineFlick</h1>

                    {/* Burger menu */}
                    <div className="md:hidden relative w-full mb-2 flex justify-center">
                        <button
                            onClick={() => setOpen(!open)}
                            className="bg-[var(--mint)] text-[var(--navy)] flex items-center justify-center rounded-xl p-2"
                        >
                            <FontAwesomeIcon icon={faBars} />
                        </button>

                        {/* Overlay */}
                        {open && (
                            <div
                                onClick={() => setOpen(false)}
                                className="fixed inset-0 bg-black/50 z-40"
                            />
                        )}

                        {/* Menu deslizable */}
                        <ul className={`
                            fixed top-0 right-0 h-full w-40 bg-[var(--navy)] p-4
                            flex flex-col items-center gap-2
                            transform transition-transform duration-300 z-50
                            ${open ? 'translate-x-0' : 'translate-x-full'}
                        `}
                        >
                            <button
                                onClick={() => setOpen(false)}
                                className="bg-[var(--mint)] text-[var(--navy)] flex items-center justify-center rounded-xl p-2 mb-2"
                            >
                                <FontAwesomeIcon icon={faBars} />
                            </button>
                            <li><Link href='/' className={linkClass('/')}>Inicio</Link></li>
                            <li><Link href='/api/movies' className={linkClass('api/movies')}>Cartelera</Link></li>
                            <li><Link href='/candy' className={linkClass('/candy')}>Candy</Link></li>

                            <div className='text-2xl'>
                                {session?.user ? (
                                    <div>
                                        <span className="cursor-pointer hover:text-[var(--green)] transition-colors duration-500" onClick={() => signOut()}>
                                            <FontAwesomeIcon icon={faArrowRightFromBracket} />
                                        </span>
                                    </div>
                                ) : (
                                    <Link href='/login' className={linkClass('/login')}>
                                        <FontAwesomeIcon icon={faArrowRightToBracket}
                                            width={20}
                                            className="hover:text-[var(--green)] transition-colors"
                                        />
                                    </Link>
                                )}
                            </div>
                        </ul>
                    </div>
                </div>

                <div className="flex items-center justify-center">
                    {session?.user ? (
                        <span className="text-[var(--green)] text-xl mb-2 md:mb-0">Hola {session.user.name}</span>
                    ) : ''}
                </div>

                <div className="flex items-center w-full md:justify-end">
                    {/* Desktop menu */}
                    <nav className="hidden md:flex md:text-xl flex-row items-center gap-8 mr-10">
                        <Link href='/' className={linkClass('/')}>Inicio</Link>
                        <Link href='/api/movies' className={linkClass('api/movies')}>Cartelera</Link>
                        <Link href='/candy' className={linkClass('/candy')}>Candy</Link>

                        <div className='text-2xl'>
                            {session?.user ? (
                                <div>
                                    <span className="cursor-pointer hover:text-[var(--green)] transition-colors duration-500" onClick={() => signOut()}>
                                        <FontAwesomeIcon icon={faArrowRightFromBracket} />
                                    </span>
                                </div>
                            ) : (
                                <Link href='/login' className={linkClass('/login')}>
                                    <FontAwesomeIcon icon={faArrowRightToBracket}
                                        width={20}
                                        className="hover:text-[var(--green)] transition-colors"
                                    />
                                </Link>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    )
}