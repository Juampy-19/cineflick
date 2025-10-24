import { pool } from '@/db/connection';

export async function GET(req, context) {
    const { id } = await context.params;

    try {
        const [rows] = await pool.query(`
            SELECT
                sh.id,
                sh.hour,
                sh.price,
                r.number AS room,
                m.title AS movie_title,
                m.poster_url AS porter_url
            FROM showtimes sh
            JOIN rooms r ON sh.room_id = r.id
            JOIN movies m ON sh.movie_id = m.id
            WHERE sh.id = ?    
        `, [id]);

        if (rows.length === 0) {
            return new Response(JSON.stringify({ error: 'Función noencontrada' }), { status: 404 });
        }

        return new Response(JSON.stringify(rows[0]), {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}