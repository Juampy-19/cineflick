'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function AdminMoviePage() {

    const [movies, setMovies] = useState([]);

    useEffect(() => {
        loadMovies();
    }, []);

    async function loadMovies() {
        const res = await fetch('/api/movies');
        const data = await res.json();

        setMovies(data);
    };

    return (
        <div>
            <h1>Administrar películas</h1>

            <div>
                <Link href={'/admin/movies/create'}>
                    <button className="btn">Agregar nueva película</button>
                </Link>
            </div>

            <table className="w-full border_collapse">
                <thead>
                    <tr className="border-b">
                        <th className="text-center p-3">
                            Poster
                        </th>

                        <th className="text-center p-3">
                            Título
                        </th>

                        <th className="text-center p-3">
                            Estado
                        </th>

                        <th className="text-center p-3">
                            Acciones
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {movies.map((movie) => (
                        <tr
                            key={movie.id}
                            className="border-b"
                        >
                            <td className="p-3">
                                <Image
                                    src={movie.poster_url}
                                    alt='Sin imagen'
                                    width={60}
                                    height={90}
                                />
                            </td>

                            <td className="p-3">
                                {movie.title}
                            </td>

                            <td className="p-3">
                                {movie.status}
                            </td>

                            <td className="p-3">
                                <div className="flex gap-2 justify-center">
                                    <Link
                                        href={`/admin/movies/${movie.id}`}
                                        className="btn"
                                    >
                                        Editar
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};