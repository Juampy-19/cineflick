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
        <div>
            <img src={movie.poster_url}/>
            <h1>{movie.title}</h1>
            <p>{movie.synopsis}</p>
            <p>{movie.duration}</p>
            <p>{movie.release_date}</p>
            <p className={`mt-3 mb-3 text-black px-2 py-1 rounded-full text-xs font-bold ${classificationColor(movie.classification_id)}`}>{movie.classification}</p>
        </div>
    )
}