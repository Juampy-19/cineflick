import { pool } from '@/db/connection';

export async function GET() {
    try {
        const [rows] = await pool.query(`
            SELECT
                m.*,
                c.classification AS classification,
                s.name AS status
            FROM movies m
            JOIN classifications c ON m.classification_id = c.id
            JOIN status s ON m.status_id = s.id    
        `)

        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}