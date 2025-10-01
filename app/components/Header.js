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

    const linkClass = (path) => `hover:text-[var(--green)]  transition-colors ${pathname === path ? 'border-b-2 border-[var(--green)]' : '' }`;

    return (
        <header>
            <div className="flex items-center justify-between">
                <Image
                    src="/img/cineflick-logo.svg"
                    alt="Logo de CineFlick"
                    width={150}
                    height={150}
                />
                <nav className="text-xl flex items-center justify-center gap-8">
                    <Link href='/' className={linkClass('/')}>Inicio</Link>
                    <Link href='/api/movies' className={linkClass('api/movies')}>Cartelera</Link>
                    <Link href='/candy' className={linkClass('/candy')}>Candy</Link>

                    {session?.user? (
                        <>
                            <span>Hola, {session.user.name}</span>
                            <span className="cursor-pointer hover:text-[var(--green)] transition-colors" onClick={() => signOut()}>
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

                </nav>
                <h1 className="p-6 text-2xl">CineFlick</h1>
            </div>
        </header>
    )
}