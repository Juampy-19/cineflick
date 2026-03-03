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
                        width={150}
                        height={150}
                    />

                    <h1 className="p-6 text-2xl md:text-4xl">CineFlick</h1>
                </div>

                <div className="flex items-center justify-center mb-5 md:mb-0">
                    {session?.user ? (
                        <span className="text-[var(--green)] text-xl">Hola {session.user.name}</span>
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

                    {/* Burger menu */}
                    <div className="md:hidden relative w-full flex justify-center">
                        <button 
                            onClick={() => setOpen(!open)}
                            className={`
                              !bg-[var(--mint)]
                              !flex items-center justify-center
                              !transition-all duration-500 ease-in-out
                              ${open ? '!w-40 !h-12 !ronded-t-md' : '!w-12 !h-12 !rounded-md'}
                            `}
                        >
                            {open ? <FontAwesomeIcon icon={faArrowDown} /> : <FontAwesomeIcon icon={faBars} />}
                        </button>
                    </div>

                    <ul className={`md:hidden absolute top-full left-1/2 -translate-x-1/2 origin-top w-40 bg-[var(--mint)] text-[var(--teal)] flex flex-col items-center gap-6 py-6 text-xl rounded transform transition-all duration-500 ease-in-out ${open
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                        }
                        `}
                    >
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
        </header>
    )
}