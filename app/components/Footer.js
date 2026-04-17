'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Modal from "./Modal";
import toast from "react-hot-toast";

export default function Footer() {
    const { data: session } = useSession();
    const [open , setOpen] = useState(false);
    const router = useRouter();

    const handleClick = () => {
        if (!session)  {
            router.push('/login');
        } else {
            setOpen(true);
        }
    };

    const handleDelete = async () => {
        const res = await fetch('/api/users/delete', {
            method: 'DELETE'
        });

        if (res.ok) {
            await signOut();
            router.push('/login');
            toast.success('Usuario eliminado exitosamente');
        }
    };

    return (
        <footer className="grid md:grid-cols-2">
            <div className="p-2 text-sm">
                <p>Copyright © 2026 Cineflick</p>
                <p>Dirección General de Defensa y Protección al Consumidor: Para consultas y/o denuncias haga <a>click aquí</a></p>
            </div>

            <div className="flex items-center justify-center p-2">
                <button className="btn" onClick={handleClick}>Eliminar cuenta</button>
            </div>

            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                title='Eliminar cuenta'
            >
                <p>¿Seguro que desea eliminar su cuenta?</p>

                <div className="flex gap-4 mt-4 justify-center">
                    <button className="btn" onClick={handleDelete}>Si</button>
                    <button className="btn" onClick={() => setOpen(false)}>No</button>
                </div>
            </Modal>
        </footer>
    )
}