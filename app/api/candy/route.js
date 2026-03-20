import { pool } from '@/db/connection';

export async function GET() {
    try {
        const [rows] = await pool.query(`
            SELECT 
                c.*,
                t.name AS name
            FROM candy c
            JOIN candy_types t ON c.type_id = t.id
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