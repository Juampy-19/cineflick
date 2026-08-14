'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "@/app/components/Loader";
import { useSort } from "@/app/hooks/useSort";
import SortableHeader from "@/app/components/SortableHeader";
import toast from "react-hot-toast";
import { formatDateTime } from "@/utils/formatDate";

export default function AdminShowtimesPage() {
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { sortedData: sortedShowtimes, handleSort, getSortIcon, getHeaderClass } = useSort(showtimes, 'id', 'desc');
    
    useEffect(() => {
        loadShowtimes();
    }, []);

    async function loadShowtimes() {
        try {
            const res = await fetch('/api/showtimes');
            const data = await res.json();

            if (!res.ok) {
                toast.error('Error al cargar las funciónes');
                setShowtimes([]);
                return
            };

            setShowtimes(data);
        } catch (error) {
            toast.error('No se pudo conectar con el servidor');
            setShowtimes([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-center text-3xl font-bold my-2">Administrar funciónes</h1>

            <div className="flex items-center justify-center gap-6 p-4">
                <Link href={'/admin/showtimes/create'}>
                    <button className="btn">Agregar nueva función</button>
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
                        <tr>
                            <SortableHeader
                                column='id'
                                label='Id'
                                handleSort={handleSort}
                                getSortIcon={getSortIcon}
                                getHeaderClass={getHeaderClass}
                            />

                            <SortableHeader
                                column='title'
                                label='Película'
                                handleSort={handleSort}
                                getSortIcon={getSortIcon}
                                getHeaderClass={getHeaderClass}
                            />

                            <SortableHeader
                                column='number'
                                label='Sala'
                                handleSort={handleSort}
                                getSortIcon={getSortIcon}
                                getHeaderClass={getHeaderClass}
                            />

                            <SortableHeader
                                column='hour'
                                label='Fecha'
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
                        {sortedShowtimes.map((showtime) => (
                            <tr
                                key={showtime.id}
                                className="border-b"
                            >
                                <td className="p-3 text-lg text-center">
                                    {showtime.id}
                                </td>

                                <td className="p-3 text-lg">
                                    {showtime.title}
                                </td>

                                <td className="p-3 text-lg text-center">
                                    {showtime.number}
                                </td>

                                <td className="p-3 text-lg text-center">
                                    {formatDateTime(showtime.hour)}
                                </td>

                                <td className="p-3">
                                    <div className="flex gap-2 justify-center">
                                        <Link
                                            href={`/admin/showtimes/${showtime.id}`}
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
}