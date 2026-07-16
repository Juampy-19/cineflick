'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MoviesForm from "@/app/components/MoviesForm";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EditMoviePage() {

    const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [movie, setMovie] = useState({
        title: '',
        synopsis: '',
        duration: '',
        poster: null,
        poster_url: '',
        release_date: '',
        classification_id: '',
        status_id: '',
        genres: []
    });

    useEffect(() => {
        if (params?.id) {
            loadMovie();
        }
    }, [params]);

    async function loadMovie() {
        const res = await fetch(`/api/movies/${params.id}`);
        if (!res.ok) {
            alert('No se pudo cargar la película');
            return;
        }
        const data = await res.json();

        setMovie({
            title: data.title,
            synopsis: data.synopsis,
            duration: data.duration,
            release_date: data.release_date,
            classification_id: data.classification_id,
            status_id: data.status_id,
            genres: data.genres_id
                ? data.genres_id.split(',').map(Number)
                : [],
            poster: null,
            poster_url: data.poster_url
        });

        setLoading(false);
    }

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

        const response = await fetch(`/api/movies/${params.id}`, {
            method: 'PUT',
            body: formData
        });

        if (response.ok) {
            router.push('/admin/movies');
            toast.success('Película modificada exitosamente');
        } else {
            alert('Error al actualizar la película');
        }
    }

    if (loading) {
        return <h2>Cargando ...</h2>;
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            <h1 className="text-center text-2xl">Editar película</h1>

            <MoviesForm
                movie={movie}
                setMovie={setMovie}
                onSubmit={handleSubmit}
                buttonText="Guardar cambios"
            />

            <Link href='/admin/movies' className="m-auto">
                <button className="btn">Volver</button>
            </Link>
        </div>
    )
}