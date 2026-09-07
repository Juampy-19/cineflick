'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loader from '../components/Loader';
import { 
  faTicket, 
  faFileInvoice, 
  faCalendarAlt, 
  faClock, 
  faCouch, 
  faFilm, 
  faTimes, 
  faUserCircle 
} from '@fortawesome/free-solid-svg-icons';

export default function MisComprasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Proteger la ruta si no está autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Cargar tickets del usuario
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/users/tickets')
        .then((res) => {
          if (!res.ok) throw new Error('Error al obtener compras');
          return res.json();
        })
        .then((data) => {
          setPurchases(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Cabecera de Perfil */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <FontAwesomeIcon icon={faUserCircle} className="text-5xl text-red-600" />
            <div>
              <h1 className="text-2xl font-bold text-white">{session?.user?.name}</h1>
              <p className="text-gray-400 text-sm">{session?.user?.email}</p>
            </div>
          </div>
          <div className="bg-red-600/10 border border-red-600/30 text-red-400 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon={faTicket} />
            <span>{purchases.length} Función(es) reservadas</span>
          </div>
        </div>

        {/* Sección de Entradas / Compras */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FontAwesomeIcon icon={faFilm} className="text-red-600" />
            Mis Entradas Compradas
          </h2>

          {error && (
            <div className="bg-red-950/50 border border-red-800 text-red-300 p-4 rounded-xl">
              {error}
            </div>
          )}

          {purchases.length === 0 ? (
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 text-center text-gray-400 space-y-4">
              <FontAwesomeIcon icon={faTicket} className="text-6xl text-gray-600" />
              <p className="text-lg">Aún no has comprado entradas para ninguna función.</p>
              <button
                onClick={() => router.push('/')}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-xl transition"
              >
                Ver Cartelera
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {purchases.map((purchase) => {
                const dateObj = new Date(purchase.showtime_hour);
                const formattedDate = dateObj.toLocaleDateString('es-AR', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });
                const formattedTime = dateObj.toLocaleTimeString('es-AR', {
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={purchase.showtime_id}
                    className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row hover:border-gray-700 transition"
                  >
                    {/* Poster de la película */}
                    <div className="relative w-full md:w-48 h-64 md:h-auto bg-gray-950 flex-shrink-0">
                      {purchase.movie_poster ? (
                        <Image
                          src={purchase.movie_poster}
                          alt={purchase.movie_title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <FontAwesomeIcon icon={faFilm} className="text-4xl" />
                        </div>
                      )}
                    </div>

                    {/* Detalle de la entrada */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="bg-red-600/20 text-red-400 border border-red-600/30 text-xs font-semibold px-3 py-1 rounded-full">
                            Sala {purchase.room_number}
                          </span>
                          <span className="text-xs text-gray-400">
                            Duración: {purchase.movie_duration || 'N/A'}
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold text-white">
                          {purchase.movie_title}
                        </h3>
                      </div>

                      {/* Info de fecha, hora y asientos */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm bg-gray-950/60 p-4 rounded-xl border border-gray-800/80">
                        <div className="flex items-center gap-2 text-gray-300">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-red-500" />
                          <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <FontAwesomeIcon icon={faClock} className="text-red-500" />
                          <span>{formattedTime} hs</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <FontAwesomeIcon icon={faCouch} className="text-red-500" />
                          <span className="font-semibold text-white">
                            {purchase.seats.join(', ')}
                          </span>
                        </div>
                      </div>

                      {/* Footer de la tarjeta con precio y botón de comprobante */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-gray-800/60">
                        <div>
                          <span className="text-xs text-gray-400 block">Total Abonado</span>
                          <span className="text-xl font-bold text-emerald-400">
                            ${purchase.total_price.toLocaleString('es-AR')}
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedTicket(purchase)}
                          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition shadow-md"
                        >
                          <FontAwesomeIcon icon={faFileInvoice} />
                          <span>Ver Comprobante</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Comprobante */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-md w-full p-6 space-y-6 relative shadow-2xl animate-fade-in">
            {/* Botón cerrar */}
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xl" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-red-600/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2 border border-red-600/20">
                <FontAwesomeIcon icon={faFileInvoice} className="text-xl" />
              </div>
              <h3 className="text-xl font-bold text-white">Comprobante de Compra</h3>
              <p className="text-xs text-gray-400">Detalle de tu reserva de entradas</p>
            </div>

            {/* Resumen detallado del ticket */}
            <div className="bg-gray-950 p-5 rounded-2xl border border-gray-800 text-sm space-y-3">
              <div className="flex justify-between border-b border-gray-800/80 pb-2">
                <span className="text-gray-400">Comprador:</span>
                <span className="font-semibold text-white">{session?.user?.name}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800/80 pb-2">
                <span className="text-gray-400">Película:</span>
                <span className="font-semibold text-white">{selectedTicket.movie_title}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800/80 pb-2">
                <span className="text-gray-400">Sala:</span>
                <span className="font-semibold text-white">Sala {selectedTicket.room_number}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800/80 pb-2">
                <span className="text-gray-400">Fecha y Hora:</span>
                <span className="font-semibold text-white">
                  {new Date(selectedTicket.showtime_hour).toLocaleString('es-AR', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                  })} hs
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-800/80 pb-2">
                <span className="text-gray-400">Asientos ({selectedTicket.seats.length}):</span>
                <span className="font-semibold text-red-400">{selectedTicket.seats.join(', ')}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-300 font-semibold">Total Pagado:</span>
                <span className="font-bold text-emerald-400 text-base">
                  ${selectedTicket.total_price.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTicket(null)}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 rounded-xl transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
