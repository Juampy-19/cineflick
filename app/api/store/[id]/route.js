import { pool } from "@/db/connection";
import { writeFile } from 'fs/promises';
import path from 'path';

export async function  GET(req, context) {
    const { id } = await context.params;

    try {
        const [storeRows] = await pool.query(`
            SELECT
                s.*,
                t.name AS name
            FROM store s
            JOIN store_types t ON s.type_id = t.id
            WHERE s.id = ?   
        `, [id]);

        if (storeRows.length === 0) {
            return new Response(JSON.stringify({ error: 'Producto no encontrado'}), { status: 404 });
        };

        const product = storeRows[0];

        return new Response(JSON.stringify(product), {
            status: 200,
            headers: { 'Content-type': 'application/json' }
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

        const title = data.get('title');
        const description = data.get('description');
        const image = data.get('image');
        const type_id = data.get('type_id');
        const price = data.get('price');

        await connection.beginTransaction();

        // Obtener la imagen actual.
        const [storeRows] = await connection.query(
            `
                SELECT img
                FROM store
                WHERE id = ?
            `, [id]
        );

        if (storeRows.length === 0) {
            throw new Error('Producto no encontrado');
        };

        let img = storeRows[0].img;

        // si se cambia la imagen.
        if (image && image.size > 0) {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const fileName = `${Date.now()}-${image.name.replace(/\s+/g, '-').toLowerCase()}`;
            
            const filePath = path.join(
                process.cwd(),
                'public',
                'img',
                'store',
                fileName
            );

            await writeFile(filePath, buffer);

            img = `/img/store/${fileName}`;
        }

        await connection.query(
            `
                UPDATE store
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
            { message: 'Producto actualizado correctamente'},
            { status: 200 }
        );
    } catch (error) {
        await connection.rollback();

        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    } finally {
        connection.release();
    }
}