import Link from "next/link";

export default function AdminMoviePage() {
    return (
        <div>
            <h1>Administrar películas</h1>

            <div>
                <Link href={'/admin/movies/create'}>
                    <button className="btn">Agregar nueva película</button>
                </Link>
            </div>
        </div>
    )
};