import { pool } from "@/db/connection";

export async function GET() {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM status ORDER BY id'
        );

        return Response.json(rows);
    } catch (error) {
        return Response.json(
            { error: error.message },
            { status: 500 }
        )
    };
}