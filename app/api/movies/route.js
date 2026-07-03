import { pool } from '@/db/connection';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET() {
    try {
        const [rows] = await pool.query(`
            SELECT
                m.*,
                c.classification AS classification,
                s.name AS status
            FROM movies m
            JOIN classifications c ON m.classification_id = c.id
            JOIN status s ON m.status_id = s.id    
        `)

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

export async function POST(request) {
    const connection = await pool.getConnection();

    try {
        // const body = await request.json();
        const data = await request.formData();

        // const {
        //     title,
        //     synopsis,
        //     duration,
        //     poster_url,
        //     release_date,
        //     classification_id,
        //     status_id,
        //     genres
        // } = body;

        const title = data.get('title');
        const synopsis = data.get('synopsis');
        const duration = data.get('duration');
        const release_date = data.get('release_date');
        const classification_id = data.get('classification_id');
        const status_id = data.get('status_id');
        const genres = JSON.parse(data.get('genres'));
        const poster = data.get('poster');

        let poster_url = null;

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

        await connection.beginTransaction();

        const [result] = await connection.query(
            `
                INSERT INTO movies
                (
                    title,
                    synopsis,
                    duration,
                    poster_url,
                    release_date,
                    classification_id,
                    status_id
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                title,
                synopsis,
                duration,
                poster_url,
                release_date,
                classification_id,
                status_id
            ]
        );

        const movieId = result.insertId;

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
                    movieId,
                    genreId
                ]
            );
        }

        await connection.commit();

        return Response.json(
            {
                message: 'Película creada correctamente',
                movieId
            },
            {
                status: 201
            }
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