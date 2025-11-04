import { pool } from '@/db/connection';

export async function GET(req, context) {
    const { id } = await context.params;

    try {
        const[rows] = await pool.query(`
            SELECT
                t.id,
                u.name AS user_name,
                u.lastname AS user_lastname,
                m.title AS movie_title,
                s.hour AS showtime_hour,
                t.seat_number
            FROM tickets t
            INNER JOIN users u ON t.user_id = u.id
            INNER JOIN showtimes s ON t.showtime_id = s.id
            INNER JOIN movies m ON s.movie_id = m.id
            WHERE t.showtime_id = ?
        `, [id]);

        const occupied = rows
            .map(r => ({
                ticket_id: r.id,
                user_name: r.user_name,
                user_lastname: r.user_lastname,
                movie_title: r.movie_title,
                showtime_hour: r.showtime_hour,
                seat_number: r.seat_number
            }))
            .filter(seat => seat !== null)

        return Response.json(occupied)
    } catch (error) {
        console.error('Error al obtener las butacas ocupadas:', error);
        return Response.json(
            { error: 'Error al obtener las butacas ocupadas'},
            { status: 500 }
        )
    }
}