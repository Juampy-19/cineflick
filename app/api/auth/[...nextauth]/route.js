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

                try {
                    const connection = await mysql.createConnection({
                        host: 'localhost',
                        user: 'root',
                        database: 'cine_db'
                    });
    
                    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [credentials.email]);
                    connection.end();
    
                    if (rows.length === 0) {
                        throw new Error('USER_NOT_FOUND');
                    }
    
                    const user = rows[0];
                    const passwordMatch = await bcrypt.compare(credentials.password, user.password);
    
                    if (!passwordMatch) {
                        throw new Error('INVALID_PASSWORD');
                    }
    
                    // Guardar en la sesión
                    // return { id: user.id, name: user.name, email: user.email };
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        rol: user.rol
                    }
                } catch (error) {
                    if (
                        error.message === 'USER_NOT_FOUND' ||
                        error.message === 'INVALID_PASSWORD'
                    ) {
                        throw error;
                    }

                    console.error(error);
                    throw new Error('SERVER_ERROR');
                }
            }
        })
    ],

    session: {
        strategy: 'jwt',
        maxAge: 900
    },

    pages: {
        signIn: '/login'
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.rol = user.rol;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id;
                session.user.rol = token.rol;
            }
            return session;
        }
    },

    secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };