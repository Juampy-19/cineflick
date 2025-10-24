'use client';

import React, {useState} from "react";

export default function SeatModal({ showtime, quantity, onClose }) {
    const [selectedSeats, setSelectedSeats] = useState([]);

    const toggleSeat = (seatId) => {
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

        const user = localStorage.getItem('user');

        try {
            const res = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    showtime_id: showtime.showtime_id,
                    seat: selectedSeats,
                    user: JSON.parse(user)
                })
            })

            if (res.ok) {
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
                rowSeats.push(
                    <button
                        key={seatId}
                        onClick={() => toggleSeat(seatId)}
                        className={`w-8 h-8 m-1 rounded-md text-ms ${
                            isSelected ? 'bg-green-500' : 'bg-gray-400 hover:bg-gray-500'
                        }`}
                    >
                        {seatId}
                    </button>
                );
            }
            seats.push(<div key={row} className="flex justify-center">{rowSeats}</div>)
        }
        return seats;
    };

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