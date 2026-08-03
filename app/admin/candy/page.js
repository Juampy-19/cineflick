'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";

export default function AdminCandyPage() {

    const [candy, setCandy] = useState([]);
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        loadCandy();
    }, []);

    async function loadCandy() {
        const res = await fetch('/api/candy');
        const data = await res.json();

        setCandy(data);
    }

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

    const sortedCandy = [...candy].sort((a, b) => {
        let comparison = 0;
        if (a[sortBy] < b[sortBy]) comparison = -1;
        if (a[sortBy] > b[sortBy]) comparison = 1;
        return sortOrder === 'desc' ? comparison : -comparison;
    });

    return (
        <div>
            <h1 className="text-center text-3xl font-bold my-2">Administrar Candy</h1>

            <div>
                <Link href={'/admin/candy/create'}>
                    <button className="btn">Agregar nuevo producto</button>
                </Link>
            </div>

            <table className="w-full my-6">
                <thead>
                    <tr className="border-b">
                        <th className="text-center text-xl p-3">
                            Imagen
                        </th>

                        <th onClick={() => handleSort('id')}
                            className={getHeaderClass('id')}
                        >
                            Id {' '}
                            <FontAwesomeIcon icon={getSortIcon('id')} />
                        </th>

                        <th onClick={() => handleSort('name')}
                            className={getHeaderClass('name')}
                        >
                            Producto {' '}
                            <FontAwesomeIcon icon={getSortIcon('name')} />
                        </th>

                        <th onClick={() => handleSort('type_id')}
                            className={getHeaderClass('type_id')}
                        >
                            Tipo {' '}
                            <FontAwesomeIcon icon={getSortIcon('type_id')} />
                        </th>

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
        </div>
    )
}