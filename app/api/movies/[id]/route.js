import { pool } from '@/db/connection';

export async function GET(req, context) {
    const { id } = await context.params;

    // title = decodeURIComponent(title);

    try {
        const [rows] = await pool.query(`
            SELECT
                m.*,
                c.classification AS classification,
                s.name AS status
            FROM movies m
            JOIN classifications c ON m.classification_id = c.id
            JOIN status s ON m.status_id = s.id
            WHERE m.id = ?
        `, [id]);

        if (rows.length === 0) {
            return new Response(JSON.stringify({ error: 'Película no encontrada' }), { status: 404 });
        }

        return new Response(JSON.stringify(rows[0]), {
            status: 200,
            headers: { 'Content-Type': 'application/json'}
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}