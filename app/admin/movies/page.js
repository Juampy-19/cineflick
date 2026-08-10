'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSort } from "@/app/hooks/useSort";
import SortableHeader from "@/app/components/SortableHeader";
import toast from "react-hot-toast";
import Loader from "@/app/components/Loader";

export default function AdminMoviePage() {

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const { sortedData: sortedMovies, handleSort, getSortIcon, getHeaderClass } = useSort(movies, 'id', 'desc');

    useEffect(() => {
        loadMovies();
    }, []);

    async function loadMovies() {
        try {
            const res = await fetch('/api/movies');
            const data = await res.json();

            if (!res.ok) {
                toast.error('Error al cargar las películas')
                setMovies([]);
                return
            };

            setMovies(data);
        } catch (error) {
            toast.error('No se pudo conectar con el servidor');
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-center text-3xl font-bold my-2">Administrar películas</h1>

            <div className="flex items-center justify-center gap-6 p-4">
                <Link href={'/admin/movies/create'}>
                    <button className="btn">Agregar nueva película</button>
                </Link>

                <Link href={'/admin'}>
                    <button className="btn">Volver</button>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader />
                </div>
            ) : (
                <table className="w-full my-6">
                    <thead>
                        <tr className="border-b">
                            <th className="text-center text-xl p-3">
                                Poster
                            </th>

                            <SortableHeader
                                column='id'
                                label='Id'
                                handleSort={handleSort}
                                getSortIcon={getSortIcon}
                                getHeaderClass={getHeaderClass}
                            />

                            <SortableHeader
                                column='title'
                                label='Titulo'
                                handleSort={handleSort}
                                getSortIcon={getSortIcon}
                                getHeaderClass={getHeaderClass}
                            />

                            <SortableHeader
                                column='status'
                                label='Estado'
                                handleSort={handleSort}
                                getSortIcon={getSortIcon}
                                getHeaderClass={getHeaderClass}
                            />

                            <th className="text-center text-xl p-3">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedMovies.map((movie) => (
                            <tr
                                key={movie.id}
                                className="border-b"
                            >
                                <td className="p-3 flex justify-center">
                                    {movie.poster_url ? (
                                        <Image
                                            src={movie.poster_url}
                                            alt='Sin imagen'
                                            width={60}
                                            height={90}
                                        />
                                    ) : (
                                        <Image
                                            src='/img/Placeholder_view_vector.svg (1).png'
                                            alt="Sin imagen"
                                            width={60}
                                            height={90}
                                        />
                                    )}
                                </td>

                                <td className="p-3 text-center text-lg">
                                    {movie.id}
                                </td>

                                <td className="p-3 text-lg">
                                    {movie.title}
                                </td>

                                <td className="p-3 text-center text-lg">
                                    {movie.status}
                                </td>

                                <td className="p-3">
                                    <div className="flex gap-2 justify-center">
                                        <Link
                                            href={`/admin/movies/${movie.id}`}
                                        >
                                            <button className="btn">Editar</button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
};