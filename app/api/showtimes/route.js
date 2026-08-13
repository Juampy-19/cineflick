import { pool } from "@/db/connection";

export async function GET() {
    try {
        const [rows] = await pool.query(
            `
                SELECT
                    s.id,
                    m.title AS title,
                    r.number AS number,
                    s.hour,
                    s.price
                FROM showtimes s
                JOIN movies m ON s.movie_id = m.id
                JOIN rooms r ON s.room_id = r.id
            `
        )

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