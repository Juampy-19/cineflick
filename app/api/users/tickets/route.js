import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { pool } from "@/db/connection";

export async function GET() {
    try {
        // Validación de usuario autenticado.
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return Response.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Consultar compras del usuario logueado.
        const [rows] = await pool.query(
            `
            SELECT
                t.id AS ticket_id,
                t.seat_number,
                t.showtime_id,
                s.hour AS showtime_hour,
                s.price,
                r.number AS room_number,
                m.id AS movie_id,
                m.title AS movie_title,
                m.poster_url AS movie_poster,
                m.duration AS movie_duration
            FROM tickets t
            INNER JOIN showtimes s ON t.showtime_id = s.id
            INNER JOIN movies m ON s.movie_id = m.id
            INNER JOIN rooms r ON s.room_id = r.id
            WHERE t.user_id = ?
            ORDER BY s.hour DESC
            `, [userId]
        );

        // Agrupar los asientos por función.
        const purchasesMap = {};

        rows.forEach((row) => {
            if (!purchasesMap[row.showtime_id]) {
                purchasesMap[row.showtime_id] = {
                    showtime_id: row.showtime_id,
                    movie_title: row.movie_title,
                    movie_poster: row.movie_poster,
                    movie_duration: row.movie_duration,
                    room_number: row.room_number,
                    showtime_hour: row.showtime_hour,
                    price_ticket: Number(row.price),
                    seats: [],
                    tickets: []
                };
            }

            purchasesMap[row.showtime_id].seats.push(row.seat_number);
            purchasesMap[row.showtime_id].tickets.push(row.ticket_id);
        });

        // Formatear lista final.
        const purchases = Object.values(purchasesMap).map((p) => ({
            ...p,
            total_price: p.price_ticket * p.seats.length,
            qr_payload: JSON.stringify({
                tickets: p.tickets,
                user_id: userId,
                showtime_id: p.showtime_id,
                seats: p.seats
            })
        }));

        return Response.json(purchases, { status: 200 });
    } catch (error) {
        console.error('Error al obtener historial de compras:', error);
        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    }
}