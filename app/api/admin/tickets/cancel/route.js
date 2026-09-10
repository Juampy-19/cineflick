import { pool } from "@/db/connection";
import { withAdmin } from "@/utils/auth";

export const POST = withAdmin(async (req, session) => {
    try {
        const { ticket_id } = await req.json();
        
        if (!ticket_id) {
            return Response.json(
                { error: 'El ID de ticket es requerido' },
                { status: 400 }
            );
        }

        const [rows] = await pool.query(
            'SELECT * FROM tickets WHERE id = ?', [ticket_id]
        );

        if (rows.length === 0) {
            return Response.json(
                { error: 'Ticket no encontrado' },
                { status: 404 }
            );
        }

        const ticket = rows[0];
        if (ticket.status === 'cancelled') {
            return Response.json(
                { error: 'El ticket ya se encuentra anulado' },
                { status: 400 }
            );
        }

        // Anular ticket en la DB.
        await pool.query(
            `UPDATE tickets SET status = 'cancelled' WHERE id = ?`, [ticket_id]
        );

        return Response.json({
            success: true,
            message: `Ticket #${ticket_id} anulado. Asiento ${ticket.seat_number} liberado`
        });
    } catch (error) {
        console.error('Error al anular ticket:', ticket);
        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    }
}) 