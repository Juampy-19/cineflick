'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const linkClass = (path) => `hover:text-[var(--green)]  transition-colors duration-500 ${pathname === path ? 'border-b-2 border-[var(--green)]' : '' }`;

    return (
        <header>
            <div className=" grid grid-cols-3">
                <div className="flex items-center">
                    <Image
                        src="/img/cineflick-logo.svg"
                        alt="Logo de CineFlick"
                        width={150}
                        height={150}
                    />

                    <h1 className="p-6 text-4xl">CineFlick</h1>
                </div>

                <div className="flex items-center justify-center">
                    <nav className="text-xl flex items-center justify-center gap-8">
                        <Link href='/' className={linkClass('/')}>Inicio</Link>
                        <Link href='/api/movies' className={linkClass('api/movies')}>Cartelera</Link>
                        <Link href='/candy' className={linkClass('/candy')}>Candy</Link>
                    </nav>
                </div>
                
                <div className='flex items-center justify-end mr-10 text-2xl'>
                    {session?.user? (
                            <>
                                <span className="mr-10 text-[var(--green)]">Hola {session.user.name}</span>
                                <span className="cursor-pointer hover:text-[var(--green)] transition-colors duration-500" onClick={() => signOut()}>
                                    <FontAwesomeIcon icon={faArrowRightFromBracket}/>
                                </span>
                            </>
                        ) : (
                        <Link href='/login' className={linkClass('/login')}>
                            <FontAwesomeIcon icon={faArrowRightToBracket}
                                width={20}
                                className="hover:text-[var(--green)] transition-colors"
                            />
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}