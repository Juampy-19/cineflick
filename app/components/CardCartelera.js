import { getMovies } from '@/utils/db';

export default async function Card() {
    try {
        const movies = await getMovies();

        if (movies.length === 0) {
            return <p>No hay películas disponibles.</p>
        }

        const cartelera = movies.filter(m => m.status_id === 1 || m.status_id === 2);

        return (
            <div className='grid grid-cols-4 gap-6 p-6'>
                {cartelera.map((movie) => (
                    <div key={movie.id} className='relative flex flex-col items-center border-2 border-[var(--green)] rounded-xl'>
                        <h2 className='mt-5'>{movie.title}</h2>
                        <img
                            src={movie.poster_url}
                            alt='Poster de la película'
                            className='w-full h-full p-4'
                        />
                        <p className='mb-5'>{movie.classification}</p>

                        {movie.status_id === 1 && (
                            <p className='absolute top-5 left-[-15px] bg-red-600 text-white text-xs font-bold px-5 py-1 rotate-[-45deg] shadow-md'>Estreno</p>
                        )}
                    </div>
                ))}
            </div>
        );
    } catch (error) {
        console.error(error);
        return <p>Error al cargar las películas</p>
    }
}