'use client';

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { classificationColor } from "@/utils/helpers";

export default function Card() {
    const [proximamente, setProximamente] = useState([]);
    const carrouselRef = useRef(null);

    useEffect(() => {
        async function fetchMovies() {
            try {
                const res = await fetch('/api/movies');
                const movies = await res.json();
                const filtered = movies.filter((m) => m.status_id === 3);
                setProximamente(filtered);
            } catch (error) {
                console.error(error);
                return <p>Error al cargar las películas</p>
            }
        }
        fetchMovies();
    }, []);

    useEffect(() => {
        const carrousel = carrouselRef.current;
        if (!carrousel) return;

        carrousel.innerHTML += carrousel.innerHTML;

        let scrollAmount = 0;
        const speed = 1;
        let animationFrame;

        const scrollLoop = () => {
            scrollAmount += speed;
            if (scrollAmount >= carrousel.scrollWidth / 2) {
                scrollAmount = 0;
            }
            carrousel.scrollLeft = scrollAmount;
            animationFrame = requestAnimationFrame(scrollLoop);
        };

        animationFrame = requestAnimationFrame(scrollLoop);

        return () => cancelAnimationFrame(scrollLoop);
    }, [proximamente]);

    if (proximamente.length === 0) {
        return <p>No hay películas disponibles</p>
    }

    return (
        <div className="relative w-2/3 px-10">
            <div ref={carrouselRef} id="carrousel" className="flex overflow-hidden space-x-6 p-4 mb-4">
                {proximamente.map((movie) => (
                    <Link key={movie.id} href={`/pelicula/${movie.id}`} className="relative flex-shrink-0 w-56 flex flex-col items-center border-2 border-[var(--green)] rounded-xl shadow-lg bg-[var(--teal)] hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full items-center justify-center overflow-hidden">
                            <img
                                src={movie.poster_url}
                                alt="Poster de la película"
                                className="w-full h-full rounded-xl"
                            />
                        </div>
                        <h2 className="mt-5 text-sm text-center p-2 h-10 flex items-center justify-center">{movie.title}</h2>
                        <div className="flex items-center justify-center gap-5">
                            <p className={`mt-3 mb-3 text-black px-2 py-1 rounded-full text-xs font-bold ${classificationColor(movie.classification_id)}`}>{movie.classification}</p>
                            <p>{movie.release_date}</p>                            
                        </div>
                        <p className="absolute right-[0px] bg-black/50 p-1 text-sm rounded-tr-lg rounded-bl-lg">{movie.duration}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}