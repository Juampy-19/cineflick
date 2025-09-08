import { pool } from '@/db/connection';

export async function GET() {
    try {
        const [rows] = await pool.query('SELECT * FROM movies');
        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: {
                'Content-type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}