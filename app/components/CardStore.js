'use client';

import { useState } from "react";
import Modal from "./Modal";
import { SkeletonCardStore } from "./Skeletons";
import Image from "next/image";
import toast from "react-hot-toast";

export default function CardStore({ products, loading }) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [buying, setBuying] = useState(false);

    const handleOpenBuy = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
    };

    const handleConfirmPurchase = async () => {
        if (!selectedProduct) return;
        setBuying(true);
        try {
            const res = await fetch('/api/store/buy',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ store_id: selectedProduct.id, quantity })
                }
            );

            const data = await res.json();
            if (res.ok && data.success) {
                toast.success(data.message || '¡Compra realizada con exito!');
                setSelectedProduct(null);
            } else {
                toast.error('Error al  procesar la compra');
            }
        } catch (error) {
            toast.error('Error al conectar con el servidor');
        } finally {
            setBuying(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 p-4 gap-8">
                {Array.from({ length: 10 }).map((_, i) => (
                    <SkeletonCardStore key={i} />
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 p-4 gap-8">
            {products.map((product) => (
                <div key={product.id} className="flex flex-col border-2 border-[var(--green)] bg-[var(--teal)] rounded-xl hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-50 p-4 overflow-hidden">
                        {product.img ? (
                            <Image 
                                src={product.img}
                                alt={product.title}
                                width={250}
                                height={300}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <Image
                                src='/img/Placeholder_view_vector.svg (1).png'
                                alt="Imagen alternativa"
                                width={250}
                                height={300}
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>
                    <h3 className="text-center p-2 h-[48px] mb-10 md:mb-5">{product.title}</h3>
                    {/* <span className="text-sm p-2">{product.description}</span> */}
                    <p className="text-center p-2 text-[var(--green)] mb-2 mt-auto">${product.price}</p>

                    <button
                        onClick={() => handleOpenBuy(product)}
                        className="mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-lg text-sm w-full cursor-pointer transition shadow"
                    >
                        🛒 Comprar
                    </button>
                </div>
            ))}

            <Modal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                title={selectedProduct?.title}
            >
                <div className="space-y-4 text-white">
                    <p className="text-sm text-gray-300">{selectedProduct?.description}</p>
                    <div className="bg-[var(--navy)] p-4 rounded-xl border border-[var(--green)] flex flex-col items-center gap-3">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold">Cantidad:</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="bg-gray-800 text-white px-3 py-1 rounded font-bold cursor-pointer"
                                    >-</button>

                                    <span className="font-extrabold text-lg px-2">{quantity}</span>

                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="bg-gray-800 text-white p-3 py-1 rounded font-bold cursor-pointer"
                                    >+</button>
                                </div>

                                <div className="text-xl font-bold text-[var(--green)]">
                                    Total: ${(Number(selectedProduct?.price || 0) * quantity).toLocaleString('es-AR')}
                                </div>
                        </div>

                        <button
                            onClick={handleConfirmPurchase}
                            disabled={buying}
                            className="w-full bg-green-600 hover:bg-green-700 text-qhite font-bold py-3 rounded-xl cursor-pointer transition"
                        >
                            {buying ? 'Procesando...' : '✅ Confirmar compra'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}