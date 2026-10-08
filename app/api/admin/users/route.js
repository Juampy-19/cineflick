import { pool } from "@/db/connection";
import { withAdmin } from "@/utils/auth";

export const GET = withAdmin(async (req) => {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';
        const role = searchParams.get('role') || '';
        const status = searchParams.get('status') || '';

        let query = `
            SELECT
                u.id,
                u.name,
                u.lastname,
                u.email,
                u.rol,
                u.is_blocked,
                u.created_at,
                (SELECT COUNT(*) FROM tickets t WHERE t.user_id = u.id) AS total_tickets,
                (SELECT COUNT(*) FROM candy_sales c WHERE c.user_id = u.id) AS total_candy_orders,
                (SELECT COUNT(*) FROM store_sales s WHERE s.user_id = u.id) AS total_store_orders,
                (
                    COALESCE((
                        SELECT SUM(sh.price)
                        FROM tickets t
                        JOIN showtimes sh ON t.showtime_id = sh.id
                        WHERE t.user_id = u.id
                    ), 0) +
                    COALESCE((
                        SELECT SUM(s.total_price)
                        FROM store_sales s
                        WHERE s.user_id = u.id
                    ), 0)
                ) AS total_spent
            FROM users u
            WHERE 1=1
        `;
        const params = [];

        if (search) {
            query += ` AND (u.name LIKE ? OR u.lastname LIKE ? OR u.email LIKE ?)`;
            const term = `%${search}%`;
            params.push(term, term, term);
        }

        if (role) {
            query += ` AND u.rol = ?`;
            params.push(role);
        }

        if (status === 'blocked') {
            query += ` AND u.is_blocked = 1`;
        } else if (status === 'active') {
            query += ` AND u.is_blocked = 0`;
        }

        query += ` ORDER BY u.created_at DESC LIMIT 100`;

        const [users] = await pool.query(query, params);

        return Response.json(users);
    } catch (error) {
        console.error('Error al listar usuarios:', error);
        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    }
})