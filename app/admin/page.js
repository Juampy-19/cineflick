import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    if (session.user.rol !== 'admin') {
        return (
            <div className="flex flex-col w-full justify-center items-center gap-5">
                <h1>Acceso denegado</h1>
                <p>No tiene permiso para acceder a esta sección.</p>
            
                <Link href={'/'} className="mt-10">
                    <button className="btn">Volver</button>
                </Link>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-center m-5 text-xl">Panel de Administración</h1>

            <section>
                <Link href={'/admin/movies'}>
                    <button className="btn">Películas</button>
                </Link>
            </section>
        </div>
    )
}