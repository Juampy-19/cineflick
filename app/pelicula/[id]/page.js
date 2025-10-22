'use client';

import React, { useEffect, useState, use } from "react";
import { classificationColor } from "@/utils/helpers";

export default function PeliculaPage({ params }) {
    const { id } = use(params);
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMovies() {
            try {
                const res = await  fetch(`/api/movies/${id}`);
                const data = await res.json();
                setMovie(data);
            } catch (error) {
                console.error('Error al cargar la película: ', error);
            } finally {
                setLoading(false);
            }
        }
        fetchMovies();
    }, [id])

    if (loading) return <p>Cargando...</p>;
    if (!movie) return <p>Película no encontrada</p>;

    return (
        <div className="flex mx-15 border-2 border-[var(--green)] rounded-xl shadow-lg bg-[var(--teal)]">
            <div className="w-100 h-130 overflow-hidden">
                <img src={movie.poster_url}
                    alt="Poster de la película"
                    className="w-full h-full rounded-xl"
                />
            </div>
            <div className="flex p-4 flex-col w-full h-130 justify-between">
                <h1 className="text-2xl font-bold mb-5 text-center">{movie.title}</h1>
                <p className="text-xl p-2">{movie.synopsis}</p>
                <p>{movie.duration}</p>
                <div className="flex gap-10 items-center">
                    <p>{movie.release_date}</p>
                    <div className="flex flex-wrap gap-2">
                        {movie.genres.split(', ').map((genre, index) => (
                            <span 
                            key={index}
                            className="bg-[var(--navy)] px-3 py-1 rounded-full text-xs font-semibold"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                </div>
                <p className={`mt-3 mb-3 text-black px-2 py-1 w-10 rounded-full text-xs font-bold ${classificationColor(movie.classification_id)}`}>{movie.classification}</p>
            </div>
        </div>
    )
}