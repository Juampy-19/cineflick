import { pool } from '@/db/connection';

export async function POST(req) {
    try {
        const { user_id, showtime_id, seat_number } = await req.json();

        for (const seat of seat_number) {
            await pool.query(
                'INSERT INTO tickets (user_id, showtime_id, seat_number) VALUES (?, ?, ?)',
                [user_id, showtime_id, seat]                
            );
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error('Error al registrar el ticket:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}