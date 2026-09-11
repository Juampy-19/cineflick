'use client';

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import Loader from "@/app/components/Loader";
import { formatDateTime } from "@/utils/formatDate";

export default function AdminTicketsPage() {
    const [activeTab, setActiveTab] = useState('history');

    // Filtros de historial.
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    // Estado del check-in.
    const [checkinInput, setCheckinInput] = useState('');
    const [checkinResult, setCheckinResult] = useState(null);
    const [checkinLoading, setCheckinLoading] = useState(false);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (statusFilter) params.append('status', statusFilter);
            if (dateFilter) params.append('date', dateFilter);

            const res = await fetch(`/api/admin/tickets?${params.toString()}`);
            const data = await res.json();
            if (res.ok) {
                setTickets(data);
            } else {
                toast.error(data.error || 'Error al cargar tickets');
            }
        } catch (error) {
            toast.error('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'history') {
            fetchTickets();
        }
    }, [activeTab, statusFilter, dateFilter]);

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        fetchTickets();
    }

    const handleCheckin = async (e) => {
        e?.preventDefault();
        if (!checkinInput.trim()) return;
        setCheckinLoading(true);
        setCheckinResult(null);

        try {
            const isJson = checkinInput.trim().startsWith('{');
            const body = isJson ? { qr_data: checkinInput.trim() }
                :
                { ticket_id: checkinInput.trim() };

            const res = await fetch('/api/admin/tickets/checkin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            setCheckinResult({ status: res.status, data });

            if (res.ok && data.success) {
                toast.success(data.message);
            } else if (data.warning) {
                toast(data.warning, { icon: '⚠️' });
            } else {
                toast.error(data.error || 'Error de validación');
            }
        } catch (error) {
            toast.error('Error al procesar el ingreso');
        } finally {
            setCheckinLoading(false);
        }
    }

    const handleCancelTicket = async (ticketId, seatNumber) => {
        if (!confirm(`¿Anular el ticket  #${ticketId}? Se liberará el asiento ${seatNumber}`))
            return;

        try {
            const res = await fetch('/api/admin/tickets/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ticket_id: ticketId })
            });
            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);
                fetchTickets();
            } else {
                toast.error(data.error || 'Error al anular ticket');
            }
        } catch (error) {
            toast.error('Error al conectar con el servidor');
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-red-600">
                    Gestión de Entradas y Ventas
                </h1>
                <Link href={'/admin'}>
                    <button className="btn">
                        Volver al panel
                    </button>
                </Link>
            </div>

            {/* Selector de pestañas */}
            <div className="flex border-b border-gray-700 mb-6">
                <button
                    onClick={() => setActiveTab('history')}
                    className={`py-3 px-6 font-semibold border-b-2 transition ${activeTab === 'history' ? 'border-red-600 text-red-500' : 'border-transparent text-gray-400 hover:text.white'}`}
                >
                    📜 Historial de ventas y entradas
                </button>
                <button
                    onClick={() => setActiveTab('checkin')}
                    className={`py-3 px-6 font-semibold border-b-2 transition ${activeTab === 'checkin' ? 'border-red-600 text-red-500' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    🎟️ Check-in en puerta (validación QR)
                </button>
            </div>

            {/* Pestaña 1: historial de ventas */}
            {activeTab === 'history' && (
                <div>
                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex flex-wrap gap-4 bg-gray-900 p-4 rounded-lg mb-6"
                    >
                        <input
                            type="text"
                            placeholder="Buscar por cliente, email o ID ticket..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-gray-800 text-white p-2 rounded flex-1 min-w-[200px]"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-gray-800 text-white p-2 rounded"
                        >
                            <option value=''>Todos los estados</option>
                            <option value='valid'>Válidas</option>
                            <option value='used'>Usados (Ingresados)</option>
                            <option value='cancelled'>Cancelados / Anulados</option>
                        </select>

                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="bg-gray-800 text-white p-2 rounded"
                        />
                        <button
                            type="submit"
                            className="btn"
                        >
                            Filtrar
                        </button>
                    </form>

                    {loading ? (
                        <div className="flex flex-col justify-center items-center gap-10 text-center py-10">
                            <Loader />
                            <p className="text-lg font-semibold">Cargando ventas...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto bg-gray-900 rounded-lg">
                            <table className="w-full text-left text-sm text-gray-300">
                                <thead className="bg-gray-800 text-gray-200 text-xs uppercase">
                                    <tr>
                                        <th className="p-3"># Ticket</th>
                                        <th className="p-3">cliente</th>
                                        <th className="p-3">Película</th>
                                        <th className="p-3">Sala / Butaca</th>
                                        <th className="p-3">Función</th>
                                        <th className="p-3">Precio</th>
                                        <th className="p-3">Estado</th>
                                        <th className="p-3">Acciones</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-800">
                                    {tickets.map((t) => (
                                        <tr
                                            key={t.ticket_id}
                                            className="hover:bg-gray-800/50"
                                        >
                                            <td className="p-3 font-bold text-white">#{t.ticket_id}</td>
                                            <td className="p-3">
                                                <div className="font-semibold text-white">
                                                    {t.user_name} {t.user_lastname}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {t.user_email}
                                                </div>
                                            </td>

                                            <td className="p-3 text-white font-medium">
                                                {t.movie_title}
                                            </td>

                                            <td className="p-3">
                                                Sala {t.room_number} - <span className="text-yellow-400 font-bold">Asiento {t.seat_number}</span>
                                            </td>

                                            <td className="p-3">
                                                {formatDateTime(t.showtime_hour)}
                                            </td>

                                            <td className="p-3 font-semibold text-green-400">
                                                ${t.price}
                                            </td>

                                            <td className="p-3">
                                                {t.status === 'valid' && (
                                                    <span className="bg-green-900/60 text-green-400 border border-green-700 px-2.5 py-1 rounded-full text-xs font-bold">
                                                        Válido
                                                    </span>
                                                )}

                                                {t.status === 'used' && (
                                                    <span className="bg-blue-900/60 text-blue-400 border border-blue-700 px-2.5 py-1 rounded-full text-xs font-bold">
                                                        Ingresado
                                                    </span>
                                                )}

                                                {t.status === 'cancelled' && (
                                                    <span className="bg-red-900/60 text-red-400 border border-red-700 px-2.5 py-1 rounded-full text-xs font-bold">
                                                        Anulado
                                                    </span>
                                                )}
                                            </td>

                                            <td className="p-3">
                                                {t.status === 'valid' && (
                                                    <button
                                                        onClick={() => handleCancelTicket(t.ticket_id, t.seat_number)}
                                                        className="bg-red-900/80 hover:bg-red-800 text-red-200 text-xs px-3 py-1.5 rounded transition"
                                                    >
                                                        Anular / Reembolsar
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Pestaña 2: check-in en puerta. */}
            {activeTab === 'checkin' && (
                <div className="max-w-xl mx-auto bg-gray-900 p-6 rounded-lg border borger-gray-800">
                    <h1 className="text-xl font-bold mb-4 text-center">
                        Validación de Ingreso en Puerta
                    </h1>

                    <form
                        onSubmit={handleCheckin}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">
                                Escanear Código QR o ingresar ID
                            </label>

                            <input
                                type="text"
                                value={checkinInput}
                                onChange={(e) => setCheckinInput(e.target.value)}
                                placeholder="Ej: 14 o pegar el texto/JSON del QR"
                                className="w-full bg-gray-800 text-white p-3 rounded text-lg border border-gray-700 focus:border-red-700 focus:outline-none"
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={checkinLoading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded text-lg transition"
                        >
                            {checkinLoading ? 'Verificando...' : '🔍 Validar & Confirmar Check-in'}
                        </button>
                    </form>

                    {checkinResult && (
                        <div className={`mt-6 p-4 rounded-lg border ${checkinResult.data.success ? 'bg-green-950/80 border-green-600 text-green-200' : checkinResult.data.warning ? 'bg-yellow-950/80 border-yellow-600 text-yellow-200' : 'bg-red-950/80 border-red-600 text-red-200'}`}>
                            <h3
                                className="text-xl font-bold mb-2 flex items-center gap-2"
                            >
                                {checkinResult.data.success && '✅ ACCESO PERMITIDO'}

                                {checkinResult.data.warning && '⚠️ YA INGRESADO'}

                                {checkinResult.data.error && '❌ ACCESO DENEGADO'}
                            </h3>

                            <p className="text-sm font-semibold mb-4">
                                {
                                    checkinResult.data.message ||
                                    checkinResult.data.warning ||
                                    checkinResult.data.error
                                }
                            </p>

                            {checkinResult.data.details && checkinResult.data.details.map((t) => (
                                <div key={t.id} className="bg-black/40 p-3 rounded border border-gray-700 text-sm space-y-1 mb-2">
                                    <div>
                                        <strong className="text-white">Ticket ID:</strong> #{t.id || t.ticket_id}
                                    </div>

                                    <div>
                                        <strong className="text-white">Espectador: </strong>{t.user_name || t.user?.name} {t.user_lastname || t.user?.lastname} ({t.user_email || t.user?.email})
                                    </div>

                                    <div>
                                        <strong className="text-white">Película: </strong>{t.movie_title}
                                    </div>

                                    <div>
                                        <strong className="text-white">Ubicación: </strong>Sala {t.room_number} - <span className="text-yellow-400 font-bold">Asiento {t.seat_number}</span>
                                    </div>

                                    <div>
                                        <strong className="text-white">Horario: </strong>{formatDateTime(t.showtime_hour)}
                                    </div>

                                    {t.checked_in_at && (
                                        <div className="text-xs text-gray-400">
                                            Hora de Check-in: {formatDateTime(t.checked_in_at)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}