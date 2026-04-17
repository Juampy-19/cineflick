import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mysql from 'mysql2/promise';

export async function DELETE() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'cine_db'
        });

        await connection.execute(
            'DELETE FROM users WHERE id = ?',
            [userId]
        );

        await connection.end();

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Error en el servidor' },
            { status: 500 }
        );
    }
}