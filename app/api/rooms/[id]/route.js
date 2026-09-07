import { pool } from "@/db/connection";

export async function GET(req, context) {
    const { id } = await context.params;

    try {
        const [rows] = await pool.query(
            'SELECT * FROM rooms WHERE id = ?', [id]
        );

        if (rows.length === 0) {
            return Response.json(
                { error: 'Sala no encontrada' },
                { status: 404 }
            );
        }

        return Response.json(rows[0]);
    } catch (error) {
        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req, context) {
    const { id } = await context.params;
    const connection = await pool.getConnection();

    try {
        const data = await req.formData();

        const number = data.get('number');
        const rows_num = data.get('rows_num');
        const cols_num = data.get('cols_num');

        await connection.beginTransaction();

        // Verificar que es número de sala no exista en la db.
        const [existing] = await connection.query(
            'SELECT id FROM rooms WHERE number = ? AND id != ?', [number, id]
        );

        if (existing.length > 0) {
            await connection.rollback();
            return Response.json(
                { error: `Ya existe otra sala con el número ${number}`},
                { status: 400 }
            );
        }

        const [result] = await connection.query(
            `
                UPDATE rooms
                SET number = ?, rows_num = ?, cols_num = ?
                WHERE id = ?
            `, [number, rows_num, cols_num, id]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();

            return Response.json(
                { error: 'Sala no encontrada' },
                { status: 404 }
            );
        }

        await connection.commit();

        return Response.json(
            { message: 'Sala actualizada correctamente' },
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

export async function DELETE(req, context) {
    const { id } = await context.params;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Verificar si la sala tiene funciones asignadas antes de eliminarla.
        const [showtimes] = await connection.query(
            'SELECT id FROM showtimes WHERE room_id = ?', [id]
        );

        if (showtimes.length > 0) {
            await connection.rollback();
            return Response.json(
                { error: 'No se puede eliminar la sala porque tiene funciones asignadas'},
                { status: 400 }
            );
        }

        const [result] = await connection.query(
            'DELETE FROM rooms WHERE id = ?', [id]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return Response.json(
                { error: 'Sala no encontrada' },
                { status: 404 }
            );
        }

        await connection.commit();

        return Response.json(
            { message: 'Sala eliminada correctamente' },
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