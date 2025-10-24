'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SeatModal from "@/app/components/SeatModal";

export default function CompraPageContent({ id, user }) {
    const [showtime, setShowtime] = useState(null);
    const [quantity, setQuantity] = useState(1);
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

    const handleConfirm = async () => {
        const res = await fetch('/api/tickets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_email: user.id,
                showtime_id: id
            })
        });

        if (res.ok) {
            alert('Compra confirmada');
        } else {
            alert('Error al procesar la compra');
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (!showtime) return <p>Función no encontrada</p>;

    const handleContinue = () => {
        if (quantity < 1) return alert('Selecione al menos una entrada');
        setShowModal(true);
    }

    return (
        <div>
            <h1>{showtime.movie_title}</h1>
            <p>{showtime.room}</p>
            <p>{formatDate(showtime.hour)}</p>
            <p>{showtime.price}</p>

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

            <button onClick={handleContinue}>
                Continuar
            </button>

            {showModal && (
                <SeatModal
                    showtime={showtime}
                    quantity={quantity}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    )
}