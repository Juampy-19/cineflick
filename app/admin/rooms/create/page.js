'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import RoomsForm from "@/app/components/RoomsForm";
import { roomsSchema } from "@/utils/schema";
import Link from "next/link";

export default function CreateRoomPage() {
    const router = useRouter();
    const [room, setRoom] = useState({
        number: '',
        rows_num: '',
        cols_num: ''
    });
    const [errors, setErrors] = useState({});

    async function handleSubmit(e) {
        e.preventDefault();

        const result = roomsSchema.safeParse(room);

        if (!result.success) {
            const formattedErrors = result.error.flatten().fieldErrors;
            setErrors(formattedErrors);
            return;
        };

        setErrors({});

        const formData = new FormData();
        
        formData.append('number', room.number);
        formData.append('rows_num', room.rows_num);
        formData.append('cols_num', room.cols_num);

        const response = await fetch('/api/rooms', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            router.push('/admin/rooms');
            toast.success('Sala creada correctamente');
        } else {
            toast.error(data.error || 'Error al crear la sala');
        }
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            <h1 className="text-center text-3xl font-bold">Nueva Sala</h1>

            <RoomsForm
                room={room}
                setRoom={setRoom}
                errors={errors}
                onSubmit={handleSubmit}
                buttonText="Crear sala"
            />

            <Link href={'/admin/rooms'} className="m-auto">
                <button className="btn">
                    Volver
                </button>
            </Link>
        </div>
    )
}