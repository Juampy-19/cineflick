'use client';

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import RoomsForm from "@/app/components/RoomsForm";
import Loader from "@/app/components/Loader";
import { roomsSchema } from "@/utils/schema";

export default function EditRoomPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const [room, setRoom] = useState({
        number: '',
        rows_num: '',
        cols_num: ''
    });
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        async function fetchRooms() {
            try {
                const res = await fetch(`/api/rooms/${id}`);
                const data = await res.json();

                if (res.ok) {
                    setRoom({
                        number: data.number || '',
                        rows_num: data.rows_num || '',
                        cols_num: data.cols_num || ''
                    });
                } else {
                    toast.error(data.error || 'Error al cargar la sala');
                }
            } catch (error) {
                toast.error('Error al conectar con el servidor');
            } finally {
                setLoading(false);
            }
        }
        fetchRooms();
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();

        const result = roomsSchema.safeParse(room);

        if (!result.success) {
            const formattedErrors = result.error.flatten().fieldErrors;
            setErrors(formattedErrors);
            return;
        }

        setErrors({});

        const formData = new FormData();

        formData.append('number', room.number);
        formData.append('rows_num', room.rows_num);
        formData.append('cols_num', room.cols_num);

        const response = await fetch(`/api/rooms/${id}`, {
            method: 'PUT',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            router.push('/admin/rooms');
            toast.success('Sala modificada correctamente');
        } else {
            toast.error(data.error || 'Error al modificar la sala');
        }
    }

    if (loading) {
        return(
            <div className="flex justify-center items-center py-12">
                <Loader />
            </div>
        );
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            <h1 className="text-center text-3xl font-bold">Editar Sala</h1>

            <RoomsForm
                room={room}
                setRoom={setRoom}
                errors={errors}
                onSubmit={handleSubmit}
                buttonText="Guardar cambios"
            />

            <Link href={'/admin/rooms'} className="m-auto">
                <button className="btn">
                    Volver
                </button>
            </Link>
        </div>
    );
}