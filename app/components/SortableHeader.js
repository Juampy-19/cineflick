'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SortableHeader({ column, label, sortBy, handleSort, getSortIcon, getHeaderClass }) {
    return (
        <th
            onClick={() => handleSort(column)}
            className={getHeaderClass(column)}
        >
            {label} {''}
            <FontAwesomeIcon icon={getSortIcon(column)} />
        </th>
    );
}