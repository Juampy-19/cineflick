import { pool } from "@/db/connection";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json(
                { error: 'Debe iniciar sesión para comprar' },
                { status: 401}
            );
        }

        const { candy_id, quantity = 1 } = await req.json();

        if (!candy_id || quantity <= 0) {
            return Response.json(
                { error: 'ID de producto y cantidad requeridos' },
                { status: 400 }
            );
        }

        // Obtener precio actual del producto.
        const [candies] = await pool.query(
            'SELECT price, title FROM candy WHERE id = ?', [candy_id]
        );

        if (candies.length === 0) {
            return Response.json(
                { error: 'Producto no encontrado' },
                {status: 404 }
            );
        }

        const candy = candies[0];
        const totalPrice = Number(candy.price) * Number(quantity);

        // Registrar la venta en la DB.
        await pool.query(
            `
                INSERT INTO candy_sales
                (user_id, candy_id, quantity, total_price)
                VALUES (?, ?, ?, ?)
            `, [session.user.id, candy_id, quantity, totalPrice]
        );

        return Response.json(
            {
                success: true,
                message: `¡Compra de ${quantity} X ${candy.title} realizada con exito por $${totalPrice}!`,
                totalPrice
            }
        );
    } catch (error) {
        console.error('Error en venta de candy;', error);
        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    }
}