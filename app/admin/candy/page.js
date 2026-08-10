'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSort } from "@/app/hooks/useSort";
import SortableHeader from "@/app/components/SortableHeader";
import toast from "react-hot-toast";
import Loader from "@/app/components/Loader";

export default function AdminCandyPage() {

    const [candy, setCandy] = useState([]);
    const [loading, setLoading] = useState(true);
    const { sortedData: sortedCandy, handleSort, getSortIcon, getHeaderClass } = useSort(candy, 'id', 'desc');


    useEffect(() => {
        loadCandy();
    }, []);

    async function loadCandy() {
        try {
            const res = await fetch('/api/candy');
            const data = await res.json();

            if (!res.ok) {
                toast.error('Error al cargar la tienda');
                setCandy([]);
                return
            }

            setCandy(data);
        } catch (error) {
            toast.error('No se pudo conectar con el servidor');
            setCandy([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-center text-3xl font-bold my-2">Administrar Candy</h1>

            <div className="flex items-center justify-center gap-6 p-4">
                <Link href={'/admin/candy/create'}>
                    <button className="btn">Agregar nuevo producto</button>
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
                                Imagen
                            </th>

                            <SortableHeader
                                column='id'
                                label='Id'
                                handleSort={handleSort}
                                getSortIcon={getSortIcon}
                                getHeaderClass={getHeaderClass}
                            />

                            <SortableHeader
                                column='name'
                                label='Producto'
                                handleSort={handleSort}
                                getSortIcon={getSortIcon}
                                getHeaderClass={getHeaderClass}
                            />

                            <SortableHeader
                                column='type_id'
                                label='Tipo'
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
                        {sortedCandy.map((candy) => (
                            <tr key={candy.id} className="border-b">
                                <td className="p-3 flex justify-center">
                                    {candy.img ? (
                                        <Image
                                            src={candy.img}
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
                                    {candy.id}
                                </td>

                                <td className="p-3 text-center text-lg">
                                    {candy.title}
                                </td>

                                <td className="p-3 text-center text-lg">
                                    {candy.name}
                                </td>

                                <td className="p-3">
                                    <div className="flex gap-2 justify-center">
                                        <Link
                                            href={`/admin/candy/${candy.id}`}
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