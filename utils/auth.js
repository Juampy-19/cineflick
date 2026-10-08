import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Verificar si hay una sesión activa.
export function withRole(allowedRoles = ['admin']) {
    return (handler) => async (req, context) => {
        try {
            const session = await getServerSession(authOptions);

            if (!session || !session.user || !allowedRoles.includes(session.user.rol?.toLowerCase()) ) {
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
    }
};

// Verificar si el rol de la sesión es admin.
export function withAdmin(handler) {
    return withRole(['admin'])
    (handler);
}