import { pool } from '@/db/connection';

export async function GET() {
    try {
        const [rows] = await pool.query(`
            SELECT
                s.*,
                t.name AS name
            FROM store s
            JOIN store_types t ON s.type_id = t.id    
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