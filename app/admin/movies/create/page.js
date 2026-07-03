'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import MoviesForm from "@/app/components/MoviesForm";

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
    
    async function handleSubmit(e) {
        e.preventDefault();
        
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
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            // body: JSON.stringify(movie)
            body: formData
        });

        if (response.ok) {
            router.push('/admin/movies');
        }
    }

    return (
        <>
            <h1>Nueva película</h1>

            <MoviesForm
                movie={movie}
                setMovie={setMovie}
                onSubmit={handleSubmit}
                buttonText="Crear película"
            />
        </>
    );
}