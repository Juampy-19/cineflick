import { pool } from '@/db/connection';

export async function GET(req, context) {
    const { id } = await context.params;

    try {
        const[rows] = await pool.query(`
            SELECT seat_number FROM tickets WHERE showtime_id = ?    
        `, [id]);

        const occupied = rows
            .map(r => r.seat_number)
            .filter(seat => seat !== null)

        return Response.json(occupied)
    } catch (error) {
        console.error('Error al obtener las butacas ocupadas:', error);
        return Response.json(
            { error: 'Error al obtener las butacas ocupadas'},
            { status: 500 }
        )
    }
}