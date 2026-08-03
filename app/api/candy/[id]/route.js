import { pool } from '@/db/connection';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET(req, context) {
    const { id } = await context.params;

    try {
        const [candyRows] = await pool.query(`
            SELECT
                c.*,
                t.name AS name
            FROM candy c
            JOIN candy_types t ON c.type_id = t.id
            WHERE c.id = ?   
        `, [id]);

        if (candyRows.length === 0) {
            return new Response(JSON.stringify({ error: 'Producto no encontrado'}), { status: 404 });
        }

        const product = candyRows[0];

        return new Response(JSON.stringify(product), {
            status:200,
            headers: { 'Content-type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500});
    }
}