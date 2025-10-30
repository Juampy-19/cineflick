'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SeatModal({ showtime, quantity, onClose, user }) {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchOccupied() {
            try {
                const res = await fetch(`/api/showtimes/${showtime.id}/seats`);
                const data = await res.json();
                setOccupiedSeats(data);
            } catch (error) {
                console.error('Error al cargar las butacas ocupadas:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchOccupied();
    }, [showtime.id]);

    const toggleSeat = (seatId) => {
        if (occupiedSeats.includes(seatId)) return;

        if (selectedSeats.includes(seatId)) {
            setSelectedSeats((prev) => prev.filter((s) => s !== seatId));
        } else if (selectedSeats.length < quantity) {
            setSelectedSeats((prev) => [...prev, seatId]);
        } else {
            alert(`Solo puede elegir ${quantity} butaca${quantity > 1 ? 's' : ''}.`);
        }
    };

    const handleConfirm = async () => {
        if (selectedSeats.length !== quantity) {
            alert(`Seleccióne ${quantity} butaca${quantity > 1 ? 's' : ''}`);
            return;
        }

        console.log('Enviando:', {
            user_id: user.id,
            showtime_id: showtime.id,
            seat_number: selectedSeats
        });

        try {
            const res = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    user_id: user.id,
                    showtime_id: showtime.id,
                    seat_number: selectedSeats,
                })
            })

            if (res.ok) {
                router.push('/');
                alert('Compra confirmada');
                onClose();
            } else {
                alert('Error al confirmar la compra');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const generateSeats = () => {
        const seats = [];
        for (let row = 0; row < showtime.rows_num; row++) {
            const rowSeats = [];
            for (let col = 0; col < showtime.cols_num; col++) {
                const seatId = `${String.fromCharCode(65 + row)}${col + 1}`;
                const isSelected = selectedSeats.includes(seatId);
                const isOccupied = occupiedSeats.includes(seatId);
                rowSeats.push(
                    <a
                        key={seatId}
                        onClick={() => toggleSeat(seatId)}
                        disabled={isOccupied}
                        className={`w-8 h-8 m-1 rounded-md text-ms ${
                            isOccupied
                                ? 'bg-red-600 cursor-not-allowed'
                                : isSelected
                                ? 'bg-green-500'
                                : 'bg-gray-400 hover:bg-gray-500'
                        }`}
                    >
                        {seatId}
                    </a>
                );
            }
            seats.push(<div key={row} className="flex justify-center">{rowSeats}</div>)
        }
        return seats;
    };

    if (loading) return <p>Cargando butacas...</p>

    return (
        <div>
            <h2>Seleccione sus butacas</h2>
            <div>{generateSeats()}</div>
            <div>
                <button onClick={onClose} className="px-4 py-2 bg-gray-400 rounded-lg hover:bg-gray-500">
                    Cancelar
                </button>
                <button onClick={handleConfirm} className="px-4 py-2 bg-green-500 rounded-lg">
                    Confirmar ({selectedSeats.length}/{quantity})
                </button>
            </div>
        </div>
    )
}