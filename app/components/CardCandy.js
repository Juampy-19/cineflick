'use client';

import { useState } from 'react';
import Modal from '../components/Modal';
import { SkeletonCardCandy } from './Skeletons';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function CardCandy({ items, loading, onSuccess }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [buying, setBuying] = useState(false);

    const handleOpenBuy = (item) => {
        setSelectedItem(item);
        setQuantity(1);
    };

    const handleConfirmPurchase = async () => {
        if (!selectedItem) return;
        setBuying(true);
        try {
            const res = await fetch('/api/candy/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ candy_id: selectedItem.id, quantity })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success(data.message || '¡Compra realizada con exito!');
                if (onSuccess) {
                    onSuccess(selectedItem.id, quantity, data.newStock);
                }
                setSelectedItem(null);
            } else {
                toast.error(data.error || 'Error al procesar la compra');
            }
        } catch (error) {
            toast.error('Error al conectar con el servidor');
        } finally {
            setBuying(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-6 p-4 gap-5">
                {Array.from({ length: 10 }).map((_, i) => (
                    <SkeletonCardCandy key={i} />
                ))}
            </div>
        )
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-6 p-4 gap-5">
            {items.map((item) => (
                <div key={item.id} className="flex flex-col border-2 border-[var(--green)] bg-[var(--teal)] rounded-xl hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-50 p-4 overflow-hidden">
                        {item.img ? (
                            <Image
                                src={item.img}
                                alt={item.title}
                                width={250}
                                height={300}
                                className='w-full h-full object-contain'
                            />
                        ) : (
                            <Image
                                src='/img/Placeholder_view_vector.svg (1).png'
                                alt='Imagen alternativa'
                                width={250}
                                height={300}
                                className='w-full h-full object-contain rounded-xl'
                            />
                        )}
                    </div>

                    <h3 className="text-center p-2 h-[48px] mb-5">{item.title}</h3>

                    <p className='mb-2 mt-auto text-center text-[var(--green)]'>${item.price}</p>

                    <p className='text-xs text-center mb-2 font-semibold text-gray-300'>
                        {item.stock > 0 ? `Stock: ${item.stock}` : <span className='bg-red-800/80 py-1 px-3 rounded-full border border-red-400 text-red-400 font-bold'>Sin stock</span>}
                    </p>

                    {item.stock > 0 ? (
                        <button
                            onClick={() => handleOpenBuy(item)}
                            className='bg-red-700 text-white font-bold py-2 px-3 rounded-lg text-sm w-full cursor-pointer transition shadow'
                        >
                            🛒 Comprar
                        </button>
                    ) : (
                        <button
                            disabled
                            className='bg-gray-600 text-gray-300 font-bold py-2 px-3 rounded-lg text-sm w-full cursor-not-allowed opacity-75'
                        >
                            ❌ No disponible
                        </button>
                    )}
                </div>
            ))}

            <Modal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                title={selectedItem?.title}
            >
                <div className='space-y-4 text-white'>
                    <p className='text-sm text-gray-300'>{selectedItem?.description}</p>

                    <div className='bg-[var(--navy)] p-4 rounded-xl border border-[var(--green)] flex flex-col items-center gap-3'>
                        <div className='flex items-center gap-4'>
                            <span className='text-sm font-semibold'>
                                Cantidad:
                            </span>
                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className='bg-gray-800 text-white px-3 py-1 rounded font-bold cursor-pointer'
                                >-</button>

                                <span className='font-extrabold text-lg px-2'>{quantity}</span>

                                <button
                                    onClick={() => setQuantity(Math.min(selectedItem?.stock ?? 1, quantity + 1))}
                                    disabled={!selectedItem || quantity >= selectedItem.stock}
                                    className={`px-3 py-1 rounded font-bold 
                                        ${(selectedItem && quantity >= selectedItem.stock)
                                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                            : 'bg-gray-800 text-white cursor-pointer'
                                        }`}
                                >+</button>
                            </div>

                            <div className='text-xl font-bold text-[var(--green)]'>
                                Total: ${(Number(selectedItem?.price || 0) * quantity).toLocaleString('es-AR')}
                            </div>
                        </div>

                        <button
                            onClick={handleConfirmPurchase}
                            disabled={buying}
                            className='w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl cursor-pointer transition'
                        >
                            {buying ? 'Procesando...' : '✅ Confirmar compra'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
