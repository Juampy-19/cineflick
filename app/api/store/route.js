import { pool } from '@/db/connection';

export async function GET() {
    try {
        const [rows] = await pool.query(`
            SELECT
                s.*,
                t.name AS name
            FROM store s
            JOIN store_types t ON s.type_id = t.id    
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
        const data = await request.formData();

        const title = data.get('title');
        const description = data.get('description');
        const image = data.get('image');
        const type_id = data.get('type_id');
        const price = data.get('price');

        let img = null;

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

        await connection.beginTransaction();

        const [result] = await connection.query(
            `
                INSERT INTO store
                (
                    title,
                    description,
                    img,
                    type_id,
                    price
                )
                VALUES (?, ?, ?, ?, ?)
            `,
            [
                title,
                description,
                img,
                type_id,
                price
            ]
        );

        const storeId = result.insertId

        await connection.commit();

        return Response.json(
            {
                message: 'Producto creado correctamente',
                storeId
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