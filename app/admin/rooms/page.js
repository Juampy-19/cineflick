'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "@/app/components/Loader";
import { useSort } from "@/app/hooks/useSort";
import SortableHeader from "@/app/components/SortableHeader";
import toast from "react-hot-toast";

export default function AdminRoomsPage() {
    const [rooms, setRooms] = useState([]);
    const [loading,setLoading] = useState(true);
    const { sortedData: sortedRooms, handleSort, getSortIcon, getHeaderClass } = useSort(rooms, 'id', 'desc');
    
    useEffect(() => {
        loadRooms();
    }, []);

    async function loadRooms() {
        try {
            const res = await fetch('/api/rooms');
            const data = await res.json();

            if (!res.ok) {
                toast.error('Error al cargar las salas');
                setRooms([]);
                return;
            }

            setRooms(data);
        } catch (error) {
            toast.error('Error al conectar con el servidor');
            setRooms([]);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        const confirmDelete = window.confirm('¿Está seguro que desea eliminar esta sala?');
        if (!confirmDelete) return;

        try {
            const res = await fetch(`/api/rooms/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();

            if (res.ok) {
                toast.success('Sala eliminada correctamente');
                setRooms((prev) => prev.filter((item) => item.id !== id));
            } else {
                toast.error(data.error || 'Eror al eliminar la sala');
            }
        } catch (error) {
            toast.error('Error al conectar con el servidor');
        }
    }

    return (
        <div>
            <h1 className="text-center text-3xl font-bold my-2">Administrar salas</h1>

            <div className="flex items-center justify-center gap-6 p-4">
                <Link href={'/admin/rooms/create'}>
                    <button className="btn">
                        Agregar nueva sala
                    </button>
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
                                column='number'
                                label='Número'
                                handleSort={handleSort}
                                getSortIcon={getSortIcon}
                                getHeaderClass={getHeaderClass}
                            />

                            <SortableHeader
                                column='rows_num'
                                label='Filas'
                                handleSort={handleSort}
                                getSortIcon={getSortIcon}
                                getHeaderClass={getHeaderClass}
                            />

                            <SortableHeader
                                column='cols_num'
                                label='Columnas'
                                handleSort={handleSort}
                                getSortIcon={getSortIcon}
                                getHeaderClass={getHeaderClass}
                            />

                            <th className="text-center text-xl p-3">
                                Capacidad
                            </th>

                            <th className="text-center text-xl p-3">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedRooms.map((room) => (
                            <tr key={room.id} className="border-b">
                                <td className="p-3 text-lg text-center">Sala {room.id}</td>

                                <td className="p-3 text-lg text-center">{room.cols_num}</td>

                                <td className="p-3 text-lg text-center">{room.rows_num}</td>

                                <td className="p-3 text-lg text-center">{room.rows_num * room.cols_num} asientos</td>

                                <td className="p-3">
                                    <div className="flex gap-2 justify-center">
                                        <Link href={`/admin/rooms/${room.id}`}>
                                            <button className="btn">Editar</button>
                                        </Link>

                                        <button onClick={() => handleDelete(room.id)} className="btnDelete">Eliminar</button>
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