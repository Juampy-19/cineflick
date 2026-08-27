'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import ShowtimesForm from "@/app/components/ShowtimesForm";
import { showtimesSchema } from "@/utils/schema";

export default function EditShowtimePage() {
    const params = useParams();
    const router = useRouter();

    const [showtime, setShowtime] = useState({
        movie_id: '',
        room_id: '',
        hour: '',
        price: ''
    });

    const [errors, setErrors] = useState({});

    function formatForInput(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    useEffect(() => {
        if (params?.id) {
            loadShowtime();
        }
    }, [params]);

    async function loadShowtime() {
        const res = await fetch(`/api/showtimes/${params.id}`);
        if (!res.ok) {
            alert('No se encontró la función');
            return
        };
        
        const data = await res.json();

        setShowtime({
            movie_id: data.movie_id,
            room_id: data.room_id,
            hour: formatForInput(data.hour),
            price: data.price
        });
    }

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
        formData.append('price', showtime.price);

        const response = await fetch(`/api/showtimes/${params.id}`, {
            method: 'PUT',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            router.push('/admin/showtimes');
            toast.success('Función modificada con exito');
        } else {
            toast.error(data.error || 'Error al modificar la fnución');
        }
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            <h1 className="text-center text-3xl font-bold">Editar función</h1>

            <ShowtimesForm
                showtime={showtime}
                setShowtime={setShowtime}
                errors={errors}
                onSubmit={handleSubmit}
                buttonText="Guardar cambios"
                isEditing={true}
            />

            <Link href={'/admin/showtimes'} className="m-auto">
                <button className="btn">Volver</button>
            </Link>
        </div>
    )
}