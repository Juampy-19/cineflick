export function classificationColor(classification) {
    switch (classification) {
        case 1:
            return 'bg-green-500';
        case 2:
            return 'bg-blue-500';
        case 3:
            return 'bg-yellow-500';
        default:
            return 'bg-gray-500';
    }
}