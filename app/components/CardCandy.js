'use client';

import { useState } from 'react';

export default function CardCandy({ items }) {
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <div className="grid grid-cols-6 p-4 gap-5">
            {items.map((item) => (
                <div key={item.id} className="flex flex-col border-2 border-[var(--green)] bg-[var(--teal)] rounded-xl hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-50 p-4 overflow-hidden">
                        <img
                            src={item.img}
                            alt="Imagen del producto."
                            className='w-full h-full object-contain'
                        />
                    </div>

                    <h3 className="text-center p-2 h-[48px] mb-5">{item.title}</h3>

                    <span
                        className="block overflow-hidden text-sm mt-2 mb-2"
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}
                    >
                        {item.description}
                    </span>

                    <button
                        onClick={() => setSelectedItem(item)}
                        className='text-blue-500 text-sm mt-1 hover:inderline'
                    >
                        Ver más
                    </button>

                    <p className='mb-2 mt-auto text-center'>${item.price}</p>
                </div>
            ))}

            {/* Modal description */}
            {selectedItem && (
                <div
                    className='fixed inset-0 bg-black/50 flex items-center justify-center'
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        className='bg-white  p-5 rounded-xl max-w-md w-full'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p>{selectedItem.description}</p>

                        <button
                            onClick={() => setSelectedItem(null)}
                            className='bg-red-500 text-white px-4 py-2 rounded'
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
