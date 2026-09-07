import { pool } from "@/db/connection";

export async function GET() {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM rooms`
        )

        return Response.json(rows);
    } catch (error) {
        return Response.json(
            { error: error.message },
            { status: 500 }
        )
    }
}

export async function POST(req) {
    const connection = await pool.getConnection();

    try {
        const data = await req.formData();
        
        const number = data.get('number');
        const rows_num = data.get('rows_num');
        const cols_num = data.get('cols_num');

        if (!number || !rows_num || !cols_num) {
            return Response.json(
                { error: 'Todos los campos son obligatorios' },
                { status: 400 }
            );
        }

        await connection.beginTransaction();

        // Verificar si la sala ya existe
        const [existing] = await connection.query(
            'SELECT id FROM rooms WHERE number = ?', [number]
        );

        if (existing.length > 0) {
            await connection.rollback();
            return Response.json(
                { error: `Ya existe la Sala ${number}` },
                { status: 400 }
            );
        }

        const [result] = await connection.query(
            `
              INSERT INTO rooms (number, rows_num, cols_num)
              VALUES (?, ?, ?)
            `, [number, rows_num, cols_num]
        );

        await connection.commit();

        return Response.json(
            {
                message: 'Sala creada correctamente',
                roomId: result.insertId
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