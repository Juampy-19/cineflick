import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import { loginSchema } from '@/utils/schema';

export async function POST(req) {
    try {
        const body = await req.json();

        // Validación con zod.
        const result = loginSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { email, password } = result.data;

        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'cine_db'
        });

        // Verificar si el email está registrado.
        const [rows] = await connection.execute(
            'SELECT id, password FROM users WHERE email = ? LIMIT 1',
            [email]
        );

        if (rows.length <= 0) {
            await connection.end();
            return NextResponse.json(
                { error: 'El email no está registrado' },
                { status: 400 }
            );
        }

        // Comparar los passwords.        
        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return NextResponse.json(
                { error: 'La contraseña es incorrecta' },
                { status: 400 }
            );
        }

        connection.end();

        return NextResponse.json(
            { message: 'Login exitoso'},
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Error en el servidor' },
            { status: 500 }
        );
    }
}