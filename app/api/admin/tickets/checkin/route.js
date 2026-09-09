import { pool } from "@/db/connection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.rol !== 'admin') {
            return Response.json(
                { error: 'No autorizado'},
                { status: 401 }
            );
        }

        const { ticket_id, qr_data } = await req.json();

        let targetIds = [];

        if (ticket_id) {
            targetIds.push(Number(ticket_id));
        } else if (qr_data) {
            try {
                const parsed = typeof qr_data === 'string' ? JSON.parse(qr_data) : qr_data;
                if (parsed.tickets && Array.isArray(parsed.tickets))
                {
                    targetIds = parsed.tickets.map(Number);
                } else if (parsed.ticket_id) {
                    targetIds.push(Number(parsed.ticket_id));
                }
            } catch (error) {
                return Response.json(
                    { error: 'Formato de QR inválido'},
                    { status: 400 }
                );
            }
        }

        if (targetIds.length === 0) {
            return Response.json(
                { error: 'Proporcione un ID de ticket o código QR válido' },
                { status: 400 }
            );
        }

        const placeholders = targetIds.map(() => '?').join(',');
        const [tickets] = await pool.query(
            `
                SELECT
                    t.id,
                    t.status,
                    t.seat_number,
                    t.checked_in_at,
                    u.name AS user_name,
                    u.lastname AS user_lastname,
                    u.email AS user_email,
                    m.title AS movie_title,
                    r.number AS room_number,
                    s.hour AS showtime_hour
                FROM tickets t
                INNER JOIN users u ON t.user_id = u.id
                INNER JOIN showtimes s ON t.showtime_id = s.id
                INNER JOIN movies m ON s.movie_id = m.id
                INNER JOIN rooms r ON s.room_id = r.id
                WHERE t.id IN (${placeholders})
            `, targetIds
        );

        if (tickets.length === 0) {
            return Response.json(
                { error: 'Ticket no encontrado' },
                { status: 404 }
            );
        }

        // Verificar si el ticket está anulado.
        const cancelled = tickets.filter(t => t.status === 'cancelled');

        if (cancelled.length > 0) {
            return Response.json(
                { error: 'Ticket cancelado / anulado previamente',
                    details: tickets
                },
                { status: 400 }
            );
        }

        // Verificar si el ticket ya fue utilizado.
        const alreadyUsed = tickets.filter(t => t.status === 'used');

        if (alreadyUsed.length > 0) {
            return  Response.json(
                { error: 'Este ticket ya fue utilizado para ingresar',
                    checked_in_at: alreadyUsed[0].checked_in_at,
                    details: tickets
                },
                { status: 200 }
            );
        }

        await pool.query(
            `
                UPDATE tickets SET
                status = 'used',
                checked_in_at = NOW()
                WHERE id IN (${placeholders}) AND status = 'valid'
            `, targetIds
        );

        const [updatedTickets] = await pool.query(
            `
                SELECT
                    t.id,
                    t.status,
                    t.seat_number,
                    t.checked_in_at,
                    u.name AS user_name,
                    u.lastname AS user_lastname,
                    u.email AS user_email,
                    m.title AS movie_title,
                    r.number AS room_number,
                    s.hour AS showtime_hour
                FROM tickets t
                INNER JOIN users u ON t.user_id = u.id
                INNER JOIN showtimes s ON t.showtime_id = s.id
                INNER JOIN movies m ON s.movie_id = m.id
                INNER JOIN rooms r ON s.room_id = r.id
                WHERE t.id IN (${placeholders})
            `, targetIds
        );

        return Response.json(
            {
                success: true,
                message: 'Entrada validada con exito. Acceso permitido',
                details: updatedTickets
            }
        );
    } catch (error) {
        console.error('Error al realizar check-in:', error);
        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    }
}