'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { classificationColor } from '@/utils/helpers';

export default function Card() {
    const [cartelera, setCartelera] = useState([]);

    useEffect(() => {
        async function fetchMovies() {
            try {
                const res = await fetch('/api/movies');
                const movies = await res.json();
                const filtered = movies.filter((m) => m.status_id === 1 || m.status_id === 2);
                setCartelera(filtered);
            } catch (error) {
                console.error(error);
                return <p>Error al cargar las películas</p>
            }
        }
        fetchMovies();
    }, []);

    if (cartelera.length === 0) {
        return <p>No hay películas disponibles</p>
    }

    return (
        <div className='w-2/3 grid grid-cols-4 gap-6 p-6'>
            {cartelera.map((movie) => (
                <Link key={movie.id} href={`/pelicula/${movie.id}`} className='relative flex flex-col items-center border-2 border-[var(--green)] rounded-xl shadow-lg bg-[var(--teal)]'>
                    <div className='w-full h-full items-center justify-center overflow-hidden'>
                        <img
                            src={movie.poster_url}
                            alt='Poster de la película'
                            className='w-full h-full rounded-xl'
                        />
                    </div>
                    <h2 className='mt-3 mb-3 text-sm text-center p-2 h-10'>{movie.title}</h2>
                    <p className={`mt-3 mb-3 text-black px-2 py-1 rounded-full text-xs font-bold ${classificationColor(movie.classification_id)}`}>{movie.classification}</p>

                    {movie.status_id === 1 && (
                        <p className='absolute top-5 left-[-15px] bg-red-600 text-white text-xs font-bold px-5 py-1 rotate-[-45deg] shadow-lg rounded-lg'>Estreno</p>
                    )}
                    <p className='absolute right-[0px] bg-black/50 p-1 text-sm rounded-tr-lg rounded-bl-lg'>{movie.duration}</p>
                </Link>
            ))}
        </div>
    )
}