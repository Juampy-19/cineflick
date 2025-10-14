'use client';

import { useEffect, useState } from 'react';

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
        <div className='grid grid-cols-4 gap-6 p-6'>
            {cartelera.map((movie) => (
                <div key={movie.id} className='relative flex flex-col items-center border-2 border-[var(--green)] rounded-xl'>
                    <h2 className='mt-5'>{movie.title}</h2>
                    <div className='w-full h-full items-center justify-center overflow-hidden p-4'>
                        <img
                            src={movie.poster_url}
                            alt='Poster de la película'
                            className='w-full h-full rounded-xl'
                        />
                    </div>
                    <p className='mb-5'>{movie.classification}</p>

                    {movie.status_id === 1 && (
                        <p className='absolute top-5 left-[-15px] bg-red-600 text-white text-xs font-bold px-5 py-1 rotate-[-45deg] shadow-md'>Estreno</p>
                    )}
                </div>
            ))}
        </div>
    )
}