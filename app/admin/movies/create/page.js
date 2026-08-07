'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import MoviesForm from "@/app/components/MoviesForm";
import toast from "react-hot-toast";
import { movieSchema } from "@/utils/schema";

export default function CreateMoviePage() {
    const router = useRouter();
    const [movie, setMovie] = useState({
        title: '',
        synopsis: '',
        duration: '',
        poster: null,
        release_date: '',
        classification_id: '',
        status_id: '',
        genres: []
    });
    const  [errors,setErrors] = useState({});
    
    async function handleSubmit(e) {
        e.preventDefault();

        const result = movieSchema.safeParse(movie);

        if (!result.success) {
            const formattedErrors = result.error.flatten().fieldErrors;
            setErrors(formattedErrors);
            return
        };

        setErrors({});
        
        const formData = new FormData();
    
        formData.append('title', movie.title);
        formData.append('synopsis', movie.synopsis);
        formData.append('duration', movie.duration);
        formData.append('release_date', movie.release_date);
        formData.append('classification_id', movie.classification_id);
        formData.append('status_id', movie.status_id);
        formData.append('genres', JSON.stringify(movie.genres));
        if (movie.poster) {
            formData.append('poster', movie.poster);
        }

        const response = await fetch('/api/movies', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            router.push('/admin/movies');
            toast.success('Película creada exitosamente');
        } else {
            toast.error('Error al crear la película');
        }
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            <h1 className="text-center text-3xl font-bold">Nueva película</h1>

            <MoviesForm
                movie={movie}
                setMovie={setMovie}
                errors={errors}
                onSubmit={handleSubmit}
                buttonText="Crear película"
            />
        </div>
    );
}