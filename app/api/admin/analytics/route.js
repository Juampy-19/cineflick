import { pool } from "@/db/connection";
import { withAdmin } from "@/utils/auth";

export const GET = withAdmin(async (req) => {
    try {
        // 1 - Ingreso de tickets por periodo.
        const [ticketsRevenue] = await pool.query(
            `
                SELECT
                    SUM(CASE WHEN DATE(t.created_at) = CURRENT_DATE THEN s.price ELSE 0 END) AS daily,
                    SUM(CASE WHEN t.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN s.price ELSE 0 END) AS weekly,
                    SUM(CASE WHEN t.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN s.price ELSE 0 END) AS monthly
                FROM tickets t
                INNER JOIN showtimes s ON t.showtime_id = s.id
                WHERE t.status != 'cancelled'
            `
        );

        // 2 - Ingresos y top productos candy.
        let candyDaily = 0, candyWeekly = 0, candyMonthly = 0;
        let topCandy = [];
        try {
            const [cRev] = await pool.query(
                `
                    SELECT
                        SUM(CASE WHEN DATE(created_at) = CURRENT_DATE THEN total_price ELSE 0 END) AS daily,
                        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN total_price ELSE 0 END) AS weekly,
                        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN total_price ELSE 0 END) AS monthly
                    FROM candy_sales
                `
            );
            if (cRev[0]) {
                candyDaily = Number(cRev[0].daily || 0);
                candyWeekly = Number(cRev[0].weekly || 0);
                candyMonthly = Number(cRev[0].monthly || 0);
            }

            const [cTop] = await pool.query(
                `
                    SELECT c.title, c.img, SUM(cs.quantity) AS sold,
                        SUM(cs.total_price) AS total
                    FROM candy_sales cs
                    JOIN candy c ON cs.candy_id = c.id
                    GROUP BY c.id
                    ORDER BY sold DESC
                    LIMIT 5
                `
            );
            topCandy = cTop;
        } catch {
            const [cFallback] = await pool.query(
                'SELECT title, img, price FROM candy LIMIT 5'
            );
            topCandy = cFallback.map(item => ({
                ...item,
                sold: 0,
                total: 0
            }));
        }

        // 3 - Ingresos y top productos store.
        let storeDaily = 0, storeWeekly = 0, storeMonthly = 0;
        let topStore = [];
        try {
            const [sRev] = await pool.query(
                `
                    SELECT
                        SUM(CASE WHEN DATE(created_at) = CURRENT_DATE THEN total_price ELSE 0 END) AS daily,
                        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN total_price ELSE 0 END) AS weekly,
                        SUN(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN total_price ELSE 0 END) AS monthly
                    FROM store_sales
                `
            );
            if (sRev[0]) {
                storeDaily = Number(sRev[0].daily || 0);
                storeWeekly = Number(sRev[0].weekly || 0);
                storeMonthly = Number(sRev[0].monthly || 0);
            }

            const [sTop] = await pool.query(
                `
                    SELECT st.title, st.img, SUM(ss.quantity) AS sold,
                        SUM(ss.total_price) AS total
                    FROM store_sales ss
                    JOIN store st ON ss.store_id = st.id
                    GROUP BY st.id
                    ORDER BY sold DESC
                    LIMIT 5
                `
            );
            topStore = sTop;
        } catch {
            const [sFallback] = await pool.query(
                'SELECT title, img, price FROM store LIMIT 5'
            );
            topStore = sFallback.map(item => ({
                ...item,
                sold: 0,
                total: 0
            }));
        }

        // 4 - Porcentaje de ocupación de sala/función.
        const [showtimeOccupancy] = await pool.query(
            `
                SELECT
                    s.id AS showtime_id,
                    s.hour,
                    m.title AS movie_title,
                    r.number AS room_number,
                    (r.rows_num * r.cols_num) AS capacity,
                    COUNT(t.id) AS tickets_sold,
                    ROUND((COUNT(t.id) / (r.rows_num * r.cols_num)) * 100, 1) AS occupancy_rate
                FROM showtimes s
                INNER JOIN movies m ON s.movie_id = m.id
                INNER JOIN rooms r ON s.room_id = r.id
                LEFT JOIN tickets t ON t.showtime_id = s.id AND t.status != 'cancelled'
                GROUP BY s.id
                ORDER BY occupancy_rate DESC, s.hour DESC
                LIMIT 6
            `
        );

        // 5 - Top películas más taquilleras.
        const [topMovies] = await pool.query(
            `
                SELECT
                    m.id,
                    m.title,
                    m.poster_url,
                    COUNT(t.id) AS tickets_sold,
                    COALESCE(SUM(s.price), 0) AS total_revenue
                FROM movies m
                INNER JOIN showtimes s ON s.movie_id = m.id
                LEFT JOIN tickets t ON t.showtime_id = s.id AND t.status != 'cancelled'
                GROUP BY m.id
                ORDER BY tickets_sold DESC, total_revenue DESC
                LIMIT 5
            `
        );

        // 6 - Conteos generales.
        const [[{ total_movies }]] = await pool.query(
            'SELECT COUNT(*) AS total_movies FROM movies'
        );

        const [[{ total_showtimes }]] = await pool.query(
            'SELECT COUNT(*) AS total_showtimes FROM showtimes'
        );
        
        const [[{ total_rooms }]] = await pool.query(
            'SELECT COUNT(*) AS total_rooms FROM rooms'
        );

        const [[{ total_tickets }]] = await pool.query(
            `SELECT COUNT(*) AS total_tickets FROM tickets WHERE status != 'cancelled'`
        );

        const tRevenue = ticketsRevenue[0] || { daily: 0, weekly: 0, monthly: 0 };
        const ticketsDaily = Number(tRevenue.daily || 0);
        const ticketsWeekly = Number(tRevenue.weekly || 0);
        const ticketsMontly = Number(tRevenue.monthly || 0);

        return Response.json({
            revenue: {
                daily: {
                    total: ticketsDaily + candyDaily + storeDaily,
                    tickets: ticketsDaily,
                    candy: candyDaily,
                    store: storeDaily
                },
                weekly: {
                    total: ticketsWeekly + candyWeekly + storeWeekly,
                    tickets: ticketsWeekly,
                    candy: candyWeekly,
                    store: storeWeekly
                },
                monthly: {
                    total: ticketsMontly + candyMonthly + storeMonthly,
                    tickets: ticketsMontly,
                    candy: candyMonthly,
                    store: storeMonthly
                }
            },
            occupancy: 
                showtimeOccupancy,
                topMovies,
                topCandy,
                topStore,
                counts: {
                    movies: total_movies,
                    showtimes: total_showtimes,
                    rooms: total_rooms,
                    tickets: total_tickets
                }
        });
    } catch (error) {
        console.error('Error al obtener analiticas:', error);
        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    }
})