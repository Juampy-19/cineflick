import { pool } from '@/db/connection';

export async function GET(req, context) {
    const { id } = await context.params;

    try {
        const [rows] = await pool.query(`
            SELECT
                sh.id,
                sh.movie_id,
                sh.room_id,
                sh.hour,
                sh.price,
                r.number AS room,
                r.rows_num,
                r.cols_num,
                m.title AS movie_title,
                m.poster_url AS porter_url
            FROM showtimes sh
            JOIN rooms r ON sh.room_id = r.id
            JOIN movies m ON sh.movie_id = m.id
            WHERE sh.id = ?    
        `, [id]);

        if (rows.length === 0) {
            return new Response(JSON.stringify({ error: 'Función no encontrada' }), { status: 404 });
        }

        return new Response(JSON.stringify(rows[0]), {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function PUT(req, context) {
    const { id } = await context.params;
    const connection = await pool.getConnection();

    try {
        const data = await req.formData();

        const movie_id = data.get('movie_id');
        const room_id = data.get('room_id');
        const hour = data.get('hour');
        const price = data.get('price');

        await connection.beginTransaction();

        // Obtener la duración de la película.
        const [[newMovie]] = await connection.query(
            'SELECT duration FROM movies WHERE id = ?', [movie_id]
        );

        if (!newMovie) {
            await connection.rollback();
            return Response.json(
                { error: 'Película no encontrada' },
                { status: 400 }
            );
        };

        const parseDurationMinutes = (durationStr) => {
            if (!durationStr) return 120;
            const str = String(durationStr).trim().toLocaleLowerCase();
            
            if (str.includes('h')) {
                const hoursMatch = str.match(/(\d+)\s*h/);
                const minsMatch = str.match(/(\d+)\s*m/);
                const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
                const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;
                return (hours * 60) + mins;
            }

            const parsed = parseInt(str, 10);
            return isNaN(parsed) || parsed <= 0 ? 120 : parsed;
        };

        const newDurationMinutes = parseDurationMinutes(newMovie.duration);

        // Formatear la fecha/hora recibida.
        const dateObj = new Date(hour);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const seconds = String(dateObj.getSeconds()).padStart(2, '0');
        const formattedHour = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        // Obtener la funciones existentes en la sala ignorando la actual.
        const [existingShowtimes] = await connection.query(
            `
                SELECT s.id, s.hour, m.duration
                FROM showtimes s
                JOIN movies m ON s.movie_id = m.id
                WHERE s.room_id = ? AND s.id != ?
            `, [room_id, id]
        );

        const newStart = new Date(formattedHour).getTime();
        const newEnd = newStart + (newDurationMinutes * 60 * 1000);
        const hasOverlap = existingShowtimes.some((existing) => {
            const existingStart = new Date(existing.hour).getTime();
            const existingDuration = parseDurationMinutes(existing.duration);
            const existingEnd = existingStart + (existingDuration * 60 * 1000);
            return newStart < existingEnd && newEnd > existingStart;
        });

        if (hasOverlap) {
            await connection.rollback();
            return Response.json(
                { error: 'El horario seleccionado se solapa con otra función en esta sala' },
                { status: 400 }
            );
        };

        // Actualizar.
        await connection.query(
            `
            UPDATE showtimes
            SET
                movie_id = ?,
                room_id = ?,
                hour = ?,
                price = ?
            WHERE id = ?
            `,
            [
                movie_id,
                room_id,
                formattedHour,
                price,
                id
            ]
        );

        await connection.commit();

        return Response.json(
            { message: 'Función actualizada correctamente' },
            { status: 200 }
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

export async function DELETE(req, context) {
    const { id } = await context.params;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            'DELETE FROM showtimes WHERE id = ?', [id]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return Response.json(
                { error: 'Función no encontrada' },
                { status: 404 }
            );
        }

        await connection.commit();

        return Response.json(
            { message: 'Función eliminada correctamente' },
            { status: 200 }
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