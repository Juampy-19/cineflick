'use client';

import { useEffect, useState } from "react";

export default function MoviesForm({ movie, setMovie, onSubmit, buttonText = 'Guardar' }) {
    const [classifications, setClassifications] = useState([]);
    const [status, setStatus] = useState([]);
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        async function loadData() {
            const classificationsRes = await fetch('/api/classifications');
            const statusRes = await fetch('/api/status');
            const genresRes = await fetch('/api/genres');

            const classificationsData = await classificationsRes.json();
            const statusData = await statusRes.json();
            const genresData = await genresRes.json();

            setClassifications(classificationsData);
            setStatus(statusData);
            setGenres(genresData);
        }

        loadData();
    }, []);

    return (
        <div className="flex justify-center">
            <form onSubmit={onSubmit} className="flex flex-col gap-4 w-1/2">

                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Título</label>
                    <input
                        type="text"
                        placeholder="Título"
                        value={movie.title}
                        onChange={(e) =>
                            setMovie({
                                ...movie,
                                title: e.target.value
                            })
                        }
                    />
                </div>

                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Descripción</label>
                    <textarea
                        placeholder="Sinopsis"
                        value={movie.synopsis}
                        onChange={(e) =>
                            setMovie({
                                ...movie,
                                synopsis: e.target.value
                            })
                        }
                    />
                </div>

                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Duración</label>
                    <input
                        type="text"
                        placeholder="Duración"
                        value={movie.duration}
                        onChange={(e) =>
                            setMovie({
                                ...movie,
                                duration: e.target.value
                            })
                        }
                    />
                </div>

                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Imágen</label>
                    <input
                        type='file'
                        accept='image/*'
                        onChange={(e) =>
                            setMovie({
                                ...movie,
                                poster: e.target.files[0]
                            })
                        }
                    />
                </div>

                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Fecha de estreno</label>
                    <input
                        type="text"
                        value={movie.release_date}
                        onChange={(e) =>
                            setMovie({
                                ...movie,
                                release_date: e.target.value
                            })
                        }
                    />
                </div>

                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Clasificación</label>
                    <select
                        value={movie.classification_id}
                        onChange={(e) =>
                            setMovie({
                                ...movie,
                                classification_id: e.target.value
                            })
                        }
                    >
                        <option value=''>Seleccione una clasificación</option>

                        {classifications.map((classification) => (
                            <option
                                key={classification.id}
                                value={classification.id}
                            >
                                {classification.classification}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Estado</label>
                    <select
                        value={movie.status_id}
                        onChange={(e) =>
                            setMovie({
                                ...movie,
                                status_id: e.target.value
                            })
                        }
                    >
                        <option value=''>Seleccione un estado</option>

                        {status.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Géneros</label>
                    <div className="flex flex-col gap-1">
                        {genres.map((genre) => (
                            <label key={genre.id} className="">
                                <input
                                    type="checkbox"
                                    checked={movie.genres.includes(genre.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setMovie({
                                                ...movie,
                                                genres: [
                                                    ...movie.genres,
                                                    genre.id
                                                ]
                                            });
                                        } else {
                                            setMovie({
                                                ...movie,
                                                genres: movie.genres.filter(
                                                    id => id !== genre.id
                                                )
                                            });
                                        }
                                    }}
                                />
                                {genre.genre_name}
                            </label>
                        ))}
                    </div>
                </div>

                <button type="submit" className="btn m-auto">
                    {buttonText}
                </button>

            </form>
        </div>
    )
}