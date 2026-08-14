export default function formatDate(isoString) {
    if (!isoString) return '';
    const dateObj = new Date(isoString);

    return dateObj.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

export function formatDateTime(isoString) {
    if (!isoString) return '';
    const dateObj = new Date(isoString);

    const date = dateObj.toLocaleDateString('es-AR', {
        day:'2-digit',
        month: '2-digit',
        year: '2-digit'
    });

    const hour = dateObj.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return `${date} - ${hour} hs`
}