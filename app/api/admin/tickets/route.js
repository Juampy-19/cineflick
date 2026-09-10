import { pool } from "@/db/connection";
import { withAdmin } from "@/utils/auth";

export const GET = withAdmin(async (req, session) => {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || '';
        const date = searchParams.get('date') || '';

        let query = `
            SELECT 
                t.id AS ticket_id,
                t.seat_number,
                t.status,
                t.created_at,
                t.checked_in_at,
                u.id AS user_id,
                u.name AS user_name,
                u.lastname AS user_lastname,
                u.email AS user_email,
                s.id AS showtime_id,
                s.hour AS showtime_hour,
                s.price,
                r.number AS room_number,
                m.title AS movie_title,
                m.poster_url AS movie_poster
            FROM tickets t
            INNER JOIN users u ON t.user_id = u.id
            INNER JOIN showtimes s ON t.showtime_id = s.id
            INNER JOIN movies m ON s.movie_id = m.id
            INNER JOIN rooms r ON s.room_id = r.id
            WHERE 1=1
        `;
        const params = [];

        if (search) {
            query += ' AND (u.name LIKE ? OR u.lastname LIKE ? OR u.email LIKE ? OR t.id = ?';
            const term = `%${search}%`;
            params.push(term, term, term, isNaN(search) ? -1 : Number(search));
        }

        if (date) {
            query += ' AND t.status = ?';
            params.push(date);
        }

        query += ' ORDER BY t.id DESC LIMIT 100';

        const [rows] = await pool.query(query, params);
        return Response.json(rows);
    } catch (error) {
        console.error('Error al obtener tickets admin:', error);
        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    }
});