import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' }
            },
            async authorize(credentials) {
                const connection = await mysql.createConnection({
                    host: 'localhost',
                    user: 'root',
                    database: 'cine_db'
                });

                const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [credentials.email]);
                connection.end();

                if (rows.length === 0) {
                    throw new Error('El email no está registrado');
                }

                const user = rows[0];
                const passwordMatch = await bcrypt.compare(credentials.password, user.password);

                if (!passwordMatch) {
                    throw new Error('La contraseña es incorrecta');
                }

                // Guardar en la sesión
                return { id: user.id, name: user.name, email: user.email };
            }
        })
    ],

    session: {
        strategy: 'jwt',
    },

    pages: {
        signIn: '/login'
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id
            }
            return session;
        }
    },

    secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };