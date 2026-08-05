'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";

export default function AdminStorePage() {
    
    const [store, setStore] = useState([]);
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        loadStore();
    }, []);

    async function loadStore() {
        const res = await fetch('/api/store');
        const data = await res.json();

        setStore(data);
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
        return `cursor-pointer text-xl p-3 transition-colors ${sortBy === column
                ? 'text-[var(--green)]'
                : 'hover:text-[var(--green)]'
        }`
    };

    const sortedStore = [...store].sort((a, b) => {
        let comparison = 0;
        if (a[sortBy] < b[sortBy]) comparison = -1;
        if (a[sortBy] > b[sortBy]) comparison = 1;
        return sortOrder === 'desc' ? comparison : -comparison;
    });

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

                        <th
                            onClick={() => handleSort('id')}
                            className={getHeaderClass('id')}
                        >
                            Id {''}
                            <FontAwesomeIcon icon={getSortIcon('id')} />
                        </th>

                        <th
                            onClick={() => handleSort('name')}
                            className={getHeaderClass('name')}
                        >
                            Producto {''}
                            <FontAwesomeIcon icon={getSortIcon('name')} />
                        </th>

                        <th
                            onClick={() => handleSort('type_id')}
                            className={getHeaderClass('type_id')}
                        >
                            Tipo {''}
                            <FontAwesomeIcon icon={getSortIcon('type_id')} />
                        </th>

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