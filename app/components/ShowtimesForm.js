'use client';

import { useState, useEffect } from "react";
import Loader from "./Loader";

export default function ShowtimesForm({ showtime, setShowtime, errors = {}, onSubmit, buttonText = 'Guardar' }) {
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState([]);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        async function loadData() {
            try {
                const moviesRes = await fetch('/api/movies');
                const roomsRes = await fetch('/api/rooms');

                const moviesData = await moviesRes.json();
                const roomsData = await roomsRes.json();

                setMovies(moviesData);
                setRooms(roomsData);
            } catch (error) {
                console.error('Error al cargar el formulario');
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader />
            </div>
        )
    }

    return (
        <div className="flex justify-center">
            <form onSubmit={onSubmit} className="flex flex-col gap-4 w-1/2">
                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Película</label>
                    <select
                        value={showtime.movie_id}
                        onChange={(e) =>
                            setShowtime({
                                ...showtime,
                                movie_id: e.target.value
                            })
                        }
                    >
                        <option value=''>Seleccione una película</option>

                        {movies.map((movie) => (
                            <option
                                key={movie.id}
                                value={movie.id}
                            >
                                {movie.title}
                            </option>
                        ))}
                    </select>
                    <div className="flex items-center justify-center mt-2 col-span-2">
                        {errors.movie_id && <span className="text-red-500">{errors.movie_id[0]}</span>}
                    </div>
                </div>

                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Sala</label>
                    <select
                        value={showtime.room_id}
                        onChange={(e) =>
                            setShowtime({
                                ...showtime,
                                room_id: e.target.value
                            })
                        }
                    >
                        <option value=''>Seleccione una sala</option>

                        {rooms.map((room) => (
                            <option
                                key={room.id}
                                value={room.id}
                            >
                                {room.number}
                            </option>
                        ))}
                    </select>
                    <div className="flex items-center justify-center mt-2 col-span-2">
                        {errors.room_id && <span className="text-red-500">{errors.room_id[0]}</span>}
                    </div>
                </div>

                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Fecha y hora</label>
                    <input
                        type="datetime-local"
                        value={showtime.hour}
                        onChange={(e) =>
                            setShowtime({
                                ...showtime,
                                hour: e.target.value
                            })
                        }
                        className="input border p-2 rounded"
                    />
                    <div className="flex items-center justify-center mt-2 col-span-2">
                        {errors.hour && <span className="text-red-500">{errors.hour[0]}</span>}
                    </div>
                </div>

                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Días de repetición</label>
                    <input
                        type="number"
                        min='1'
                        max='30'
                        value={showtime.days}
                        onChange={(e) =>
                            setShowtime({
                                ...showtime,
                                days: e.target.value
                            })
                        }
                        className="input border p-2 rounded"
                    />
                    <div className="flex items-center justify-center mt-2 col-span-2">
                        {errors.days && <span className="text-red-500">{errors.days[0]}</span>}
                    </div>
                </div>

                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Precio</label>
                    <input
                        type="number"
                        step='0.01'
                        min='0'
                        placeholder="0.00"
                        value={showtime.price}
                        onChange={(e) =>
                            setShowtime({
                                ...showtime,
                                price: e.target.value
                            })
                        }
                        className="input border p-2 rounded"
                    />
                    <div className="flex items-center justify-center mt-2 col-span-2">
                        {errors.price && <span className="text-red-500">{errors.price[0]}</span>}
                    </div>
                </div>

                <button type="submit" className="btn m-auto">
                    {buttonText}
                </button>
            </form>
        </div>
    )
}