'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import ShowtimesForm from "@/app/components/ShowtimesForm";
import { showtimesSchema } from "@/utils/schema";

export default function CreateShowtimePage() {
    const router = useRouter();
    const [showtime, setShowtime] = useState({
        movie_id: '',
        room_id: '',
        hour: '',
        days: 1,
        price: ''
    });
    const [errors, setErrors] = useState({});

    async function handleSubmit(e) {
        e.preventDefault();

        const result = showtimesSchema.safeParse(showtime);

        if (!result.success) {
            const formattedErrors = result.error.flatten().fieldErrors;
            setErrors(formattedErrors);
            return
        };

        setErrors({});

        const formData = new FormData();

        formData.append('movie_id', showtime.movie_id);
        formData.append('room_id', showtime.room_id);
        formData.append('hour', showtime.hour);
        formData.append('days', showtime.days);
        formData.append('price', showtime.price);

        const response = await fetch('/api/showtimes', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            router.push('/admin/showtimes');
            toast.success('Función creada exitosamente');
        } else {
            toast.error('Error al crear la función');
        }
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            <h1 className="text-center text-3xl font-bold">Nueva función</h1>

            <ShowtimesForm
                showtime={showtime}
                setShowtime={setShowtime}
                errors={errors}
                onSubmit={handleSubmit}
                buttonText="Crear función"
            />

            <Link href={'/admin/showtimes'} className="m-auto">
                <button className="btn">Volver</button>
            </Link>
        </div>
    )
}
