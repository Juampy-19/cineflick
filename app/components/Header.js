import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
    return (
        <header className="w-full ">
            <div className="flex items-center justify-evenly">
                <Image 
                    src="/img/cineflick-logo.svg" 
                    alt="Logo de CineFlick"
                    width={150}
                    height={150}
                />
                <h1>CineFlick</h1>
            </div>
            <nav className="flex items-center justify-center gap-4">
                <Link href='/'>Inicio</Link>
                <Link href='/api/movies'>Cartelera</Link>
                <Link href='/candy'>Candy</Link>
                <Link href='/login'>
                    <FontAwesomeIcon icon={faArrowRightToBracket} 
                        width={20} 
                        className="hover:text-yellow-400"
                    />
                </Link>
            </nav>
        </header>
    )
}