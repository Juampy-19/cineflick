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

export async function POST(req) {
    const connection = await pool.getConnection();

    try {
        const data = await req.formData();

        const movie_id = data.get('movie_id');
        const room_id = data.get('room_id');
        const hour = data.get('hour');
        const days = data.get('days');
        const price = data.get('price');

        await connection.beginTransaction();

        const startDate = new Date(hour);

        for (let i = 0; i < days; i++) {
            const showtimeDate = new Date(startDate);

            showtimeDate.setDate(startDate.getDate() + i);

            const year = showtimeDate.getFullYear();
            const month = String(showtimeDate.getMonth() + 1).padStart(2, '0');
            const day = String(showtimeDate.getDate()).padStart(2, '0');
            const hours = String(showtimeDate.getHours()).padStart(2, '0');
            const minutes = String(showtimeDate.getMinutes()).padStart(2, '0');
            const seconds = String(showtimeDate.getSeconds()).padStart(2, '0');

            const formattedHour = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            await connection.query(
                `
                    INSERT INTO showtimes
                    (
                        movie_id,
                        room_id,
                        hour,
                        price
                    )
                    VALUES (?, ?, ?, ?)
                `,
                [
                    movie_id,
                    room_id,
                    formattedHour,
                    price
                ]
            );
        }

        await connection.commit();

        return Response.json(
            {
                message: days > 1 ? `${days} funciones creadas correctamente` : 'Función creada correctamente'
            },
            { status: 201 }
        );
    } catch (error) {
        await connection.rollback();

        console.error(error);

        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}