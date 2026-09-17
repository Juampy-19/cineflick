'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { formatDateTime } from "@/utils/formatDate";
import Image from "next/image";

export default function AdminPage() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeframe, setTimeframe] = useState('daily');

    const fetchAnalytics = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/admin/analytics');
            const data = await res.json();
            if (res.ok) {
                setAnalytics(data);
            } else {
                setError(data.error || 'Error al obtener los datos');
            }
        } catch (error) {
            setError('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center py-20 text-white gap-4">
                <Loader />
                <p className="text-xl font-semibold">Cargando las métricas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto my-10 p-6 bg-red-950/80 border-red-700 rounded-xl text-center text-white space-y-4">
                <h2 className="text-2xl font-bold">⚠️ Error al cargar el dashboard</h2>
                <p>{error}</p>
                <button onClick={fetchAnalytics} className="btn">Reintentar</button>
            </div>
        );
    }

    const { revenue, occupancy, topMovies, topCandy, topStore, counts } = analytics;
    const currentRev = revenue?.[timeframe] || { total: 0, tickets: 0, candy: 0, store: 0 };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 text-white space-y-8">
            {/* Header del dashboard */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-900/80 backdrop-blur p-6 rounded-2xl border border-gray-800 shadow-xl">
                <div>
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400">
                        📊 Dashboard de Métricas y Analíticas
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Resumen en tiempo real del rendimiento de Cineflick</p>
                </div>
                <button
                    onClick={fetchAnalytics}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-lg font-semibold text-sm transition border border-gray-700 flex items-center gap-2"
                >
                    🔄 Actualizar
                </button>
            </div>

            {/* Accesos rápidos */}
            <section className="bg-gray-900/60 p-5 rounded-2xl border border-gray-800">
                <h2 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-4">🛠️ Gestión del Sistema</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    <Link
                        href='/admin/movies'
                        className="bg-gray-800/80 hover:bg-red-900/40 border border-gray-700 hover:border-red-600/60 p-4 rounded-xl flex flex-col items-center justify-center transition group"
                    >
                        <span className="text-2xl mb-1 group-hover:scale-110 transition">🎬</span>
                        <span className="font-semibold text-sm">Películas</span>
                        <span className="text-xs text-gray-400 font-normal">{counts?.movies || 0} registradas</span>
                    </Link>

                    <Link
                        href='/admin/candy'
                        className="bg-gray-800/80 hover:bg-yellow-900/40 border border-gray-700 hover:border-yellow-600/60 p-4 rounded-xl flex flex-col items-center justify-center transition group"
                    >
                        <span className="text-2xl mb-1 group-hover:scale-110 transition">🍿</span>
                        <span className="font-semibold text-sm">Candy</span>
                    </Link>

                    <Link
                        href='/admin/store'
                        className="bg-gray-800/80 hover:bg-purple-900/40 border border-gray-700 hover:border-purple-600/60 p-4 rounded-xl flex flex-col items-center justify-center transition group"
                    >
                        <span className="text-2xl mb-1 group-hover:scale-110 transition">🛍️</span>
                        <span className="font-semibold text-sm">Store</span>
                    </Link>

                    <Link
                        href='/admin/showtimes'
                        className="bg-gray-800/80 hover:bg-blue-900/40 border border-gray-700 hover:border-blue-600/60 p-4 rounded-xl flex flex-col items-center justify-center transition group"
                    >
                        <span className="text-2xl mb-1 group-hover:scale-110">🕒</span>
                        <span className="font-semibold text-sm">Funciones</span>
                        <span className="text-sm text-gray-400 font-normal">{counts?.showtimes || 0} próximas</span>
                    </Link>

                    <Link
                        href='/admin/rooms'
                        className="bg-gray-800/80 hover:bg-emerald-900/40 border border-gray-700 hover:border-emerald-600/60 p-4 rounded-xl flex flex-col items-center justify-center transition group"
                    >
                        <span className="text-2xl mb-1 group-hover:scale-110">🏛️</span>
                        <span className="font-semibold text-sm">Salas</span>
                        <span className="text-sm text-gray-400 font-normal">{counts?.rooms || 0} disponibles</span>
                    </Link>

                    <Link
                        href='/admin/tickets'
                        className="bg-gray-800/80 hover:bg-pink-900/40 border border-gray-700 hover:border-pink-600/60 p-4 rounded-xl flex flex-col items-center justify-center transition group"
                    >
                        <span className="text-2xl mb-1 group-hover:scale-110">🎟️</span>
                        <span className="font-semibold text-sm">Entradas</span>
                        <span className="text-sm text-gray-400 font-normal">{counts?.tickets || 0} vendidas</span>
                    </Link>
                </div>
            </section>

            {/* Sección 1: KPI de ingresos (diario, semanal, mensual) */}
            <section className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h2 className="text-xl font-bold flex items-center gap-2">💰 Ingresos y Recaudación</h2>

                    {/* Selector de período */}
                    <div className="inline-flex bg-gray-900 p-1 rounded-xl border border-gray-800 text-sm">
                        <button
                            onClick={() => setTimeframe('daily')}
                            className={`px-4 py-1.5 rounded-lg font-medium transition ${timeframe === 'daily' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            📅 Hoy (Diario)
                        </button>

                        <button
                            onClick={() => setTimeframe('weekly')}
                            className={`px-4 py-1.5 rounded-lg font-medium transition ${timeframe === 'weekly' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            📅 Últimos 7 días
                        </button>

                        <button
                            onClick={() => setTimeframe('monthly')}
                            className={`px-4 py-1.5 rounded-lg font-medium transition ${timeframe === 'monthly' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            📅 Este Mes
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Total acumulado */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-6 rounded-2xl border border-yellow-500/30 shadow-lg relative overflow-hidden">
                        <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                            Ingresos Totales ({timeframe === 'daily' ? 'Hoy' : timeframe === 'weekly' ? '7 días' : '30 días'})
                        </span>

                        <div className="text-3xl font-extrabold text-white mt-2">
                            ${Number(currentRev.total).toLocaleString('es-AR')}
                        </div>

                        <p className="text-xs text-gray-400 mt-2">
                            Global entre Cine, Candy y Store
                        </p>
                    </div>

                    {/* Entradas */}
                    <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow">
                        <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                            🎟️ Entradas de Cine
                        </span>

                        <div className="text-2xl font-bold text-white mt-2">
                            ${Number(currentRev.tickets).toLocaleString('es-AR')}
                        </div>

                        <div className="w-full bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
                            <div
                                className="bg-red-500 h-full transition-all duration-500"
                                style={{ width: `${currentRev.total ? Math.min(100, (currentRev.tickets / currentRev.total) * 100) : 0}%` }}
                            />
                        </div>
                    </div>

                    {/* Candy */}
                    <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow">
                        <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                            🍿 Candy
                        </span>
                        <div className="text-2xl font-bold text-white mt-2">
                            ${Number(currentRev.candy).toLocaleString('es-AR')}
                        </div>

                        <div className="w-full bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
                            <div
                                className="bg-yellow-400 h-full transition-all duration-500"
                                style={{ width: `${currentRev.total ? Math.min(100, (currentRev.candy / currentRev.total) * 100) : 0}%` }}
                            />
                        </div>
                    </div>

                    {/* Store */}
                    <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                            🛍️ Store
                        </span>

                        <div className="text-2xl font-bold text-white mt-2">
                            ${Number(currentRev.store).toLocaleString('es-AR')}
                        </div>

                        <div className="w-full bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
                            <div
                                className="bg-purple-500 h-full transition-all duration-500"
                                style={{ width: `${currentRev.total ? Math.min(100, (currentRev.store / currentRev.total) * 100) : 0}%` }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección 2 y 3: Ocupación por sala/función + top películas taquilleras */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Ocupación por sala y función */}
                <section className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold flex items-center gap-2">🏛️ Ocupación por Función y Sala</h2>
                        <span className="text-xs text-gray-400">Mejores horarios</span>
                    </div>

                    <div className="space-y-4">
                        {occupancy?.map((item) => {
                            const rate = Number(item.occupancy_rate || 0);
                            let colorClass = 'bg-red-500 text-red-900';

                            if (rate >= 75) colorClass = 'bg-green-500 text-green-900';
                            else if (rate >= 40) colorClass = 'bg-yellow-500 text-yellow-900';

                            return (
                                <div
                                    key={item.showtime_id}
                                    className="bg-gray-800/60 p-4 rounded-xl border border-gray-700/60 space-y-2 hover:bg-gray-900/50 transition"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-white">{item.movie_title}</h3>

                                            <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                                                <span>Sala {item.room_number}</span>
                                                <span>-</span>
                                                <span>{formatDateTime(item.hour)}</span>
                                            </div>
                                        </div>

                                        <span className={`text-sm font-extrabold px-2.5 py-1 rounded-full bg-black/40 border border-current ${colorClass}`}>{rate}%</span>
                                    </div>

                                    {/* Barra de ocupación */}
                                    <div className="w-full bg-gray-900 h-2.5 rounded-full overflow-hideen">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${rate >= 75 ? 'bg-green-500' : rate >= 40 ? 'bg-yellow-400' : 'bg-red-500'}`}
                                            style={{ width: `${Math.min(100, rate)}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>Entradas: <strong>{item.tickets_sold}</strong> / {item.capacity}</span>
                                        <span>Capacidad: {item.capacity} asientos</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Top películas más taquilleras */}
                <section className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold flex items-center gap-2">🏆 Top Películas Más Taquilleras</h2>
                        <span className="text-xs text-gray-400">Por tickets vendidos</span>
                    </div>

                    <div className="space-y-3">
                        {topMovies?.map((movie, index) => (
                            <div
                                key={movie.id}
                                className="flex items-center gap-4 bg-gray-800/60 p-3 rounded-xl border border-gray-700/60 hover:bg-gray-900/50 transition"
                            >
                                <div className="font-extrabold text-lg w-6 text-center text-yellow-400">
                                    #{index + 1}
                                </div>

                                {movie.poster_url ? (
                                    <Image
                                        src={movie.poster_url}
                                        alt={movie.title}
                                        width={12}
                                        height={16}
                                        className="w-12 h-16 object-cover rounded-md shadow"
                                    />
                                ) : (
                                    <Image
                                        src='/img/Placeholder_view_vector.svg (1).png'
                                        alt={movie.title}
                                        width={12}
                                        height={16}
                                        className="w-12 h-16 object-cover rounded-md shadow"
                                    />
                                )}

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-white truncate">{movie.title}</h3>

                                    <p className="text-xs text-gray-400">🎟️ <strong>{movie.tickets_sold}</strong> entradas vendidas</p>
                                </div>

                                <div className="text-right">
                                    <div className="font-bold text-green-400 text-sm">
                                        ${Number(movie.total_revenue).toLocaleString('es-AR')}
                                    </div>

                                    <span className="text-[10px] text-gray-400 uppercase">Recaudado</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Sección 4: productos más vendidos de candy y store */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top candy */}
                <section className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">🍿 Productos Candy Más Vendidos</h2>

                    <div className="space-y-3">
                        {topCandy?.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between bg-gray-800/60 p-3 rounded-xl border border-gray-700/60 hover:bg-gray-900/50 transition"
                            >
                                <div className="flex item-center gap-3">
                                    {item.img ? (
                                        <Image
                                            src={item.img}
                                            alt={item.title}
                                            width={10}
                                            height={10}
                                            className="w-10 h-10 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <Image
                                            src='/img/Placeholder_view_vector.svg (1).png'
                                            alt={item.title}
                                            width={10}
                                            height={10}
                                            className="w-10 h-10 object-cover rounded-lg"
                                        />
                                    )}

                                    <div>
                                        <h4 className="font-semibold text-sm text-white">{item.title}</h4>

                                        <span className="text-xs text-gray-400">${item.price || item.total || 0}</span>
                                    </div>
                                </div>

                                <span className="bg-yellow-950 text-yellow-300 border border-yellow-700/60 px-2.5 py-1 rounded-full text-xs font-bold">
                                    {item.sold || 0} vendidos
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Top store */}
                <section className="bg-gray-900/80 p-6 rounded-2xl border border-gray-800 shadow space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">🛍️ Productos Store Más Vendidos</h2>

                    <div className="space-y-3">
                        {topStore?.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between bg-gray-800/60 p-3 rounded-xl border border-gray-700/60 hover:bg-gray-900/50 transition"
                            >
                                <div className="flex items-center gap-3">
                                    {item.img ? (
                                        <Image
                                            src={item.img}
                                            alt={item.title}
                                            width={10}
                                            height={10}
                                            className="w-10 h-10 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <Image
                                            src='/img/Placeholder_view_vector.svg (1).png'
                                            alt={item.title}
                                            width={10}
                                            height={10}
                                            className="w-10 h-10 object-cover rounded-lg"
                                        />
                                    )}

                                    <div>
                                        <h4 className="font-semibold text-sm text-white">{item.title}</h4>

                                        <span className="text-xs texts-gray-400">${item.price || item.total || 0}</span>
                                    </div>
                                </div>

                                <span className="bg-purple-950 text-purple-300 border border-purple-700/60 px-2.5 py-1 rounded-full text-xs font-bold">
                                    {item.sold || 0} vendidos
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}