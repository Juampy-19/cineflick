'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SeatModal from "@/app/components/SeatModal";

export default function CompraPageContent({ id, user }) {
    const [showtime, setShowtime] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchShowtime() {
            const res = await fetch(`/api/showtimes/${id}`);
            const data = await res.json();
            setShowtime(data);
            setLoading(false);
        }
        fetchShowtime();
    }, [id]);

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('es-AR', {
            day: '2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'
        })
    };

    if (loading) return <p>Cargando...</p>;
    if (!showtime) return <p>Función no encontrada</p>;

    const handleContinue = () => {
        if (quantity < 1) {
            alert('Seleccióne la cantidad de entradas.');
            return;
        }
        setShowModal(true);
    }

    return (
        <div>
            <div className="flex flex-col text-center gap-2">
                <h1 className="text-2xl">{showtime.movie_title}</h1>
                <p className="text-lg">{showtime.room}</p>
                <p className="text-lg">{formatDate(showtime.hour)}</p>
                <p className="text-lg">${showtime.price}</p>

                <div>
                    <label htmlFor="quantity">
                        Cantidad de entradas
                    </label>
                    <input
                        id="quantity"
                        type="number"
                        min='1'
                        max='10'
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                </div>

                <button onClick={handleContinue} className="m-auto mt-8">
                    Continuar
                </button>
            </div>

            {showModal && (
                <SeatModal
                    showtime={showtime}
                    quantity={quantity}
                    onClose={() => setShowModal(false)}
                    user={user}
                />
            )}
        </div>
    )
}