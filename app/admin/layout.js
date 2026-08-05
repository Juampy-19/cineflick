import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function AdminLayout({ children }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    };

    if (!session || session.user.rol !== 'admin') {
        return (
            <div className="flex flex-col w-full justify-center items-center gap-5">
                <h1 className="text-3xl mt-10">Acceso denegado</h1>
                <Image 
                    src="/img/high-4259761_1280.webp"
                    alt="Señal de alerta"
                    width={250}
                    height={250}    
                />
                <p>No tiene permiso para acceder a esta sección.</p>

                <Link href={'/'} className="mt-10">
                    <button className="btn">Volver</button>
                </Link>
            </div>
        )
    }

    return  <>{children}</>;
}