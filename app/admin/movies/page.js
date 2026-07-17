'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";

export default function AdminMoviePage() {

    const [movies, setMovies] = useState([]);
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        loadMovies();
    }, []);

    async function loadMovies() {
        const res = await fetch('/api/movies');
        const data = await res.json();

        setMovies(data);
    };

    function handleSort(column) {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    function getSortIcon(column) {
        if (sortBy !== column) return faSort;
        return sortOrder === 'asc' ? faSortUp : faSortDown;
    };

    function getHeaderClass(column) {
        return `cursor-pointer text-xl p-3 transition-colors ${
            sortBy === column
                ? 'text-[var(--green)]'
                : 'hover:text-[var(--green)]'
        }`
    };

    const sortedMovies = [...movies].sort((a, b) => {
        let comparison = 0;
        if (a[sortBy] < b[sortBy]) comparison = -1;
        if (a[sortBy] > b[sortBy]) comparison = 1;
        return sortOrder === 'desc' ? comparison : -comparison;
    });

    return (
        <div>
            <h1 className="text-center text-3xl font-bold my-2">Administrar películas</h1>

            <div>
                <Link href={'/admin/movies/create'}>
                    <button className="btn">Agregar nueva película</button>
                </Link>
            </div>

            <table className="w-full my-6">
                <thead>
                    <tr className="border-b">
                        <th className="text-center text-xl p-3">
                            Poster
                        </th>

                        <th onClick={() => handleSort('id')} 
                            className={getHeaderClass('id')}
                        >
                            Id {' '}
                            <FontAwesomeIcon icon={getSortIcon('id')} />
                        </th>

                        <th onClick={() => handleSort('title')} 
                            className={getHeaderClass('title')}
                        >
                            Título {' '}
                            <FontAwesomeIcon icon={getSortIcon('title')} />
                        </th>

                        <th onClick={() => handleSort('status')} 
                            className={getHeaderClass('status')}
                        >
                            Estado {' '}
                            <FontAwesomeIcon icon={getSortIcon('status')} />
                        </th>

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
                                <Image
                                    src={movie.poster_url}
                                    alt='Sin imagen'
                                    width={60}
                                    height={90}
                                />
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
        </div>
    )
};