import { pool } from "@/db/connection";
import { withAdmin } from "@/utils/auth";

// Método GET para obtener detalles del usuario e historial de compras.
export const GET = withAdmin(async (req, sessionStorage, { params }) => {
    try {
        const userId = (await params).id;

        // Datos del usuario.
        const [userRows] = await pool.query(
            `
                SELECT
                    id, 
                    name, 
                    lastname, 
                    email, 
                    rol, 
                    is_blocked, 
                    created_at 
                FROM users 
                WHERE id = ?
            `, [userId]
        );

        if (userRows.length === 0) {
            return Response.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        // Historial de tickets.
        const [tickets] = await pool.query(
            `
                SELECT
                    t.id AS ticket_id,
                    t.seat_number,
                    t.status,
                    t.created_at,
                    m.title AS movie_title,
                    s.hour AS showtime_hour,
                    s.price
                FROM tickets t
                JOIN showtimes s ON t.showtime_id = s.id
                JOIN movies m ON s.movie_id = m.id
                WHERE t.user_id = ?
                ORDER BY t.created_at DESC
            `, [userId]
        );

        // Historial de candy.
        const [candySales] = await pool.query(
            `
                SELECT
                    cs.id AS candy_sale,
                    cs.quantity,
                    cs.total_price,
                    cs.created_at,
                    c.title AS candy_title
                FROM candy_sales cs
                JOIN candy c ON cs.candy_id = c.id
                WHERE cs.user_id = ?
                ORDER BY cs.created_at DESC
            `, [userId]
        );

        // Historial de store.
        const [storeSales] = await pool.query(
            `
                SELECT
                    ss.id AS store_sales,
                    ss.quantity,
                    ss.total_price,
                    ss.created_at,
                    s.title AS store_title
                FROM store_sales ss
                JOIN store s ON ss.store_id = s.id
                WHERE ss.user_id = ?
                ORDER BY ss.created_at DESC
            `, [userId]
        );

        return Response.json({
            user: userRows[0],
            tickets,
            candySales,
            storeSales
        });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    }
});

// Método PATCH para cambiar el estado del rol o bloqueo.
export const PATCH = withAdmin(async (req, session, { params }) => {
    try {
        const userId = (await params).id;
        const body = await req.json();
        const { rol, is_blocked } = body;

        // Evitar que  el admin de bloquee a sí mismo.
        if (Number(userId) === Number(session.user.id) && is_blocked === 1) {
            return Response.json(
                { error: 'No puedes bloquear tu propia cuenta de administrador' },
                { status: 400 }
            );
        }

        const updates = [];
        const queryParams = [];

        if (rol !== undefined) {
            const validRoles = ['client', 'admin', 'staff'];
            if (!validRoles.includes(rol.toLowerCase())) {
                return Response.json(
                    { error: 'Rol inválido' },
                    { status: 400 }
                );
            }
            updates.push('rol = ?');
            queryParams.push(rol.toLowerCase());
        }

        if (is_blocked !== undefined) {
            updates.push('is_blocked = ?');
            queryParams.push(is_blocked ? 1 : 0);
        }

        if (updates.length === 0) {
            return Response.json(
                { error: 'No se enviaron datos para actualizar' },
                { status: 400 }
            );
        }

        queryParams.push(userId);
        const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
        await pool.query(query, queryParams);

        return Response.json(
            { message: 'Usuario actualizado correctamente' }
        );
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    }
})