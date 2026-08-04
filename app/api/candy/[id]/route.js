import { pool } from '@/db/connection';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET(req, context) {
    const { id } = await context.params;

    try {
        const [candyRows] = await pool.query(`
            SELECT
                c.*,
                t.name AS name
            FROM candy c
            JOIN candy_types t ON c.type_id = t.id
            WHERE c.id = ?   
        `, [id]);

        if (candyRows.length === 0) {
            return new Response(JSON.stringify({ error: 'Producto no encontrado'}), { status: 404 });
        }

        const product = candyRows[0];

        return new Response(JSON.stringify(product), {
            status:200,
            headers: { 'Content-type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500});
    }
}

export async function PUT(request, context) {
    const { id } = await context.params;

    const connection = await pool.getConnection();

    try {
        const data = await request.formData();

        const title = data.get('title');
        const description = data.get('description');
        const image = data.get('image');
        const type_id = data.get('type_id');
        const price = data.get('price');

        await connection.beginTransaction();

        // Obtener la imagen actual.
        const [candyRows] = await connection.query(
            `
                SELECT img
                FROM candy
                WHERE id = ?
            `, [id]
        );

        if (candyRows.length === 0) {
            throw new Error('Producto no encontrado');
        }

        let img = candyRows[0].img;

        // Si se cambia la imagen.
        if (image && image.size > 0) {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const fileName = `${Date.now()}-${image.name.replace(/\s+/g, '-').toLowerCase()}`;

            const filePath = path.join(
                process.cwd(),
                'public',
                'img',
                'candy',
                fileName
            );

            await writeFile(filePath, buffer);

            img = `/img/candy/${fileName}`;            
        }

        await connection.query(
            `
                UPDATE candy
                SET
                    title = ?,
                    description = ?,
                    img = ?,
                    type_id = ?,
                    price = ?
                WHERE id = ?
            `,
            [
                title,
                description,
                img,
                type_id,
                price,
                id
            ]
        );

        await connection.commit();

        return Response.json(
            { message: 'Producto actualizado correctamente' },
            { status: 200 }
        );
    } catch (error) {
        await connection.rollback();

        return Response.json(
            { error: error.message },
            { status: 500 }
        )
    } finally {
        connection.release();
    }
}