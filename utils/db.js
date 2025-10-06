import mysql from 'mysql2/promise';

export async function getMovies() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'cine_db'
    });

    const [rows] = await connection.execute(
        `SELECT 
            m.*, 
            c.classification AS classification,
            s.name AS status
        FROM movies m 
        JOIN classifications c ON m.classification_id = c.id
        JOIN status s ON m.status_id = s.id`
    );

    await connection.end();
    return rows;
}