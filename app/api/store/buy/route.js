import { pool } from "@/db/connection";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json(
                { error: 'Debes iniciar sesión para comprar' },
                { status: 401 }
            );
        }

        const { store_id, quantity = 1 } = await req.json();

        if (!store_id || quantity <= 0) {
            return Response.json(
                { error: 'ID de producto y cantidad requeridos' },
                { status: 400 }
            );
        }

        // Obtener precio actual del producto.
        const [items] = await pool.query(
            'SELECT price, title FROM store WHERE id = ?', [store_id]
        );

        if (items.length === 0) {
            return Response.json(
                { error: 'Producto no encontrado' },
                { status: 404 }
            );
        }

        const product = items[0];

        // Validar que exista stock suficiente.
        if (product.stock < quantity || product.stock <= 0) {
            return Response.json(
                { error: 'Stock insuficiente' },
                { status: 400 }
            );
        }

        const totalPrice = Number(product.price) * Number(quantity);

        // Registrar la venta en la DB.
        await pool.query(
            `
                INSERT INTO store_sales
                (user_id, store_id, quantity, total_price)
                VALUES (?, ?, ?, ?)
            `, [session.user.id, store_id, quantity, totalPrice]
        );

        // Descontar la compra del stock.
        await pool.query(
            'UPDATE store SET stock = stock - ? WHERE id = ?', [quantity, store_id]
        );

        return Response.json(
            {
                success: true,
                message: `¡Compra de ${quantity} X ${product.title} realizada con exito por $${totalPrice}!`,
                totalPrice,
                newStock: store_id.stock - quantity
            }
        );
    } catch (error) {
        console.error('Error en venta de store:', error);
        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    }
}