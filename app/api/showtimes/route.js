import { pool } from "@/db/connection";

function parseDurationMinutes(durationStr) {
    if (!durationStr) return 120;
    const str = String(durationStr).trim().toLocaleLowerCase();

    if (str.includes('h')) {
        const hoursMatch = str.match(/(\d+)\s*h/);
        const minsMatch = str.match(/(\d+)\s*m/);
        const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
        const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;
        return (hours * 60) + mins
    }

    const parsed = parseInt(str, 10);
    return isNaN(parsed) || parsed <= 0 ? 120 : parsed;
}

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

        // Obtener la duración de la película.
        const [[newMovie]] = await connection.query(
            'SELECT duration FROM movies WHERE id = ?', [movie_id]
        );

        if (!newMovie) {
            await connection.rollback();
            return Response.json(
                { error: 'Película no encontrada'},
                { status: 400 }
            );
        }

        const newDurationMinutes = parseDurationMinutes(newMovie.duration);

        // Obtener las funciones exixtentes en la misma sala.
        const [existingShowtimes] = await connection.query(
            `
                SELECT s.id, s.hour, m.duration
                FROM showtimes s
                JOIN movies m ON s.movie_id = m.id
                WHERE s.room_id = ?
            `, [room_id]
        );

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

            // Calcular inicio y fin de la nueva función.
            const newStart = new Date(formattedHour).getTime();
            const newEnd = newStart + (newDurationMinutes * 60 * 1000);

            // Comprobar solapamiento de horarios.
            const hasOverlap = existingShowtimes.some((existing) => {
                const existingStart = new Date(existing.hour).getTime();
                const existingDuration = parseDurationMinutes(existing.duration);
                const existingEnd = existingStart + (existingDuration * 60 * 1000);
                return newStart < existingEnd && newEnd > existingStart;
            });

            if (hasOverlap) {
                await connection.rollback();
                return Response.json(
                    { error: `Existe una función que se solapa en esta sala el día ${day}/${month}/${year}` },
                    { status: 400 }
                );
            };

            // Se inserta la función si no hay solapamiento.
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