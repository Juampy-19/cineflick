import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import { registerSchema } from "@/utils/schema";

export async function POST(req) {
    try {
        const body = await req.json();

        // Validación con zod.
        const result = registerSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { name, lastname, email, password } = result.data;

        const hashedPassword = await bcrypt.hash(password, 10);

        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'cine_db'
        });

        // Verificar si ya existe el email en la db.
        const [rows] = await connection.execute(
            'SELECT id FROM users WHERE email = ? LIMIT 1',
            [email]
        );

        if (rows.length > 0) {
            await connection.end();
            return NextResponse.json(
                { error: 'El email ya está registrado'},
                { status: 400}
            );
        }

        await connection.execute(
            'INSERT INTO users (name, lastname, email, password) VALUES (?, ?, ?, ?)',
            [name, lastname, email, hashedPassword]
        );

        connection.end();

        return NextResponse.json({ message: 'Usuario registrado con éxito'}, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Error en el servidor'},
            { status: 500 }
        );
    }
}