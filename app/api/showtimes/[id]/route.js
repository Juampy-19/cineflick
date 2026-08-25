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
                hour,
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