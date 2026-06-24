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

        // Obtener datos del usuario.
        const [users]  = await pool.query(
            `SELECT email, name, lastname
            FROM users
            WHERE id = ?`,
            [user_id]
        );
        //console.log('Usuario:', users);

        // Obtener datos de la función.
        const [showtimes] = await pool.query(
            `SELECT
                s.hour,
                s.price,
                r.number AS room_number,
                m.title AS movie_title
            FROM showtimes s
            INNER JOIN rooms  r
                ON s.room_id = r.id
            INNER JOIN movies m
                ON s.movie_id = m.id
            WHERE s.id =?`,
            [showtime_id]
        );
        //console.log('Función:', showtimes);
        
        const user = users[0];
        const showtime = showtimes[0];
        
        // Modificación del formato de la fecha de la función.
        const formattedHour = new Date(showtime.hour).toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }) + 'hs';

        // Llamado a n8n para envio de email automático con el detalle de la compra.
        await fetch('http://localhost:5678/webhook-test/compra', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: user.email,
                name: `${user.name} ${user.lastname}`,
                movie: showtime.movie_title,
                room: showtime.room_number,
                hour: formattedHour,
                seats: seat_number,
                price: Number(showtime.price) * seat_number.length
            })
        }).catch(err => console.error('Error n8n:', err));

        // console.log({
        //     email: user.email,
        //     name: `${user.name} ${user.lastname}`,
        //     movie: showtime.movie_title,
        //     room: showtime.room_number,
        //     hour: formattedHour,
        //     seats: seat_number,
        //     price: Number(showtime.price) * seat_number.length
        // });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error('Error al registrar el ticket:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}