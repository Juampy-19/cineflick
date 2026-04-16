'use client';

import { useState } from 'react';
import Modal from '../components/Modal';
import { SkeletonCardCandy } from './Skeletons';

export default function CardCandy({ items, loading }) {
    const [selectedItem, setSelectedItem] = useState(null);

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
                        <img
                            src={item.img}
                            alt="Imagen del producto."
                            className='w-full h-full object-contain'
                        />
                    </div>

                    <h3 className="text-center p-2 h-[48px] mb-5">{item.title}</h3>

                    <span
                        className="block overflow-hidden text-sm p-1 mt-2"
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
                        className='text-green-400 text-left text-sm p-1 mb-4 hover:inderline'
                    >
                        Ver más
                    </button>

                    <p className='mb-2 mt-auto text-center text-[var(--green)]'>${item.price}</p>
                </div>
            ))}

            <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title='Descripción'>
                <p>{selectedItem?.description}</p>
            </Modal>
        </div>
    )
}
