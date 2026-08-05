import { useState, useMemo } from 'react';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';

export function useSort(data = [], defaultSortBy = 'id', defaultOrder = 'desc') {
    const [sortBy, setSortBy] = useState(defaultSortBy);
    const [sortOrder, setSortOrder] = useState(defaultOrder);

    function handleSort(column) {
        if (sortBy === column) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
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

    const sortedData = useMemo(() => {
        return [...(data || [])].sort((a, b) => {
            let comparison = 0;
            if (a[sortBy] < b[sortBy]) comparison = -1;
            if (a[sortBy] > b[sortBy]) comparison = 1;
            return sortOrder === 'desc' ? comparison : -comparison;
        });
    }, [data, sortBy, sortOrder]);

    return {
        sortBy,
        sortOrder,
        handleSort,
        getSortIcon,
        getHeaderClass,
        sortedData
    };
}