import { pool } from '@/db/connection';
import { writeFile }  from 'fs/promises';
import path from 'path';

export async function GET(req, context) {
    const { id } = await context.params;

    // title = decodeURIComponent(title);

    try {
        const [movieRows] = await pool.query(`
            SELECT
                m.*,
                c.classification AS classification,
                s.name AS status,
                GROUP_CONCAT(g.genre_name SEPARATOR ', ') AS genres,
                GROUP_CONCAT(g.id) AS genres_id
            FROM movies m
            JOIN classifications c ON m.classification_id = c.id
            JOIN status s ON m.status_id = s.id
            LEFT JOIN movie_genres mg ON mg.movie_id = m.id
            LEFT JOIN genres g ON mg.genre_id = g.id
            WHERE m.id = ?
            GROUP BY m.id
        `, [id]);

        if (movieRows.length === 0) {
            return new Response(JSON.stringify({ error: 'Película no encontrada' }), { status: 404 });
        }

        const movie = movieRows[0];

        const [sowtimesRows] = await pool.query(`
            SELECT sh.id, r.number AS room, sh.hour, sh.price
            FROM showtimes sh
            JOIN rooms r ON sh.room_id = r.id
            WHERE sh.movie_id = ?    
        `, [id]);

        movie.showtimes = sowtimesRows;

        return new Response(JSON.stringify(movie), {
            status: 200,
            headers: { 'Content-Type': 'application/json'}
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function PUT(request, context) {
    const { id } = await context.params;

    const connection = await pool.getConnection();

    try {
        const data = await request.formData();

        const title = data.get('title');
        const synopsis = data.get('synopsis');
        const duration = data.get('duration');
        const release_date = data.get('release_date');
        const classification_id = data.get('classification_id');
        const status_id = data.get('status_id');
        const genres = JSON.parse(data.get('genres'));

        const poster = data.get('poster');

        await connection.beginTransaction();

        //Obtener el poster actual.
        const [movieRows] = await connection.query(
            `
            SELECT poster_url
            FROM movies
            WHERE id = ?
            `,
            [id]
        );

        if (movieRows.length === 0) {
            throw new Error('Película no encontrada');
        }

        let poster_url = movieRows[0].poster_url;

        // Si se cambió el poster.
        if (poster && poster.size > 0) {
            const bytes = await poster.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const fileName = `${Date.now()}-${poster.name.replace(/\s+/g, '-').toLowerCase()}`;

            const filePath = path.join(
                process.cwd(),
                'public',
                'img',
                'movies',
                fileName
            );

            await writeFile(filePath, buffer);

            poster_url = `/img/movies/${fileName}`;
        }

        await connection.query(
            `
            UPDATE movies
            SET
                title = ?,
                synopsis = ?,
                duration = ?,
                poster_url = ?,
                release_date = ?,
                classification_id = ?,
                status_id = ?
            WHERE id = ?
            `,
            [
                title,
                synopsis,
                duration,
                poster_url,
                release_date,
                classification_id,
                status_id,
                id
            ]
        );

        // Se eliminan las relaciones anteriores.
        await connection.query(
            `
            DELETE FROM movie_genres
            WHERE movie_id = ?
            `,
            [id]
        );

        // Se insertan los nuevos géneros.
        for (const genreId of genres) {
            await connection.query(
                `
                INSERT INTO movie_genres
                (
                    movie_id,
                    genre_id
                )
                VALUES (?, ?)
                `,
                [
                    id,
                    genreId
                ]
            );
        }

        await connection.commit();

        return Response.json(
            {
                message: 'Película actualizada correctamente'
            },
            {
                status: 200
            }
        );
    } catch (error) {
        await connection.rollback();

        console.error(error);

        return Response.json(
            {
                error: error.message
            },
            {
                status: 500
            }
        );
    } finally {
        connection.release();
    }
}