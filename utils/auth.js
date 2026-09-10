import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Verificar si hay una sesión activa y si es rol admin.
export function withAdmin(handler) {
    return async (req, context) => {
        try {
            const session = await getServerSession(authOptions);

            if (!session || session.user?.rol !== 'admin') {
                return Response.json(
                    { error: 'Acceso no autorizado' },
                    { status: 401 }
                );
            }

            return handler(req, session, context);
        } catch (error) {
            return Response.json(
                { error: 'Sesión inválida o expirada. Inicie sesión nuevamente.' },
                { status: 401 }
            );
        }
    };
}