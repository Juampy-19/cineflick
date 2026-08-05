'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSort } from "@/app/hooks/useSort";
import SortableHeader from "@/app/components/SortableHeader";

export default function AdminStorePage() {
    
    const [store, setStore] = useState([]);
    const { sortedData: sortedStore, handleSort, getSortIcon, getHeaderClass } = useSort(store, 'id', 'desc');


    useEffect(() => {
        loadStore();
    }, []);

    async function loadStore() {
        const res = await fetch('/api/store');
        const data = await res.json();

        setStore(data);
    };

    return (
        <div>
            <h1 className="text-center text-3xl font-bold my-2">Administrar Store</h1>

            <div>
                <Link href={'/admin/store/create'}>
                    <button className="btn">Agregar nuevo producto</button>
                </Link>
            </div>

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
                    {sortedStore.map((store) => (
                        <tr key={store.id} className="border-b">
                            <td className="p-3 flex justify-center">
                                {store.img ? (
                                    <Image
                                        src={store.img}
                                        alt="Imagen del producto"
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
                                {store.id}
                            </td>

                            <td className="p-3 text-center text-lg">
                                {store.title}
                            </td>

                            <td className="p-3 text-center text-lg">
                                {store.name}
                            </td>

                            <td className="p-3">
                                <div className="flex gap-2 justify-center">
                                    <Link href={`/admin/store/${store.id}`}>
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
}