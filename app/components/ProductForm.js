'use client';

import { useState, useEffect } from "react";

export default function ProductForm ({product, setProduct, errors = {}, onSubmit, buttonText = 'Guardar', typesApiUrl = '/api/candyTypes'}) {
    const [types, setTypes] = useState([]);

    useEffect(() => {
        async function loadData() {
            const typesRes = await fetch(typesApiUrl);

            const typesData = await typesRes.json();

            setTypes(typesData);
        }

        loadData();
    }, [typesApiUrl]);

    return (
        <div className="flex justify-center">
            <form  onSubmit={onSubmit} className="flex flex-col gap-4 w-1/2">
                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Producto</label>
                    <input
                        type="text"
                        placeholder="Producto"
                        value={product.title}
                        onChange={(e) =>
                            setProduct({
                                ...product,
                                title: e.target.value
                            })
                        }
                    />
                    <div className="flex items-center justify-center mt-2 col-span-2">
                        {errors.title && <span className="text-red-500">{errors.title[0]}</span>}
                    </div>
                </div>

                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Descripción</label>
                    <textarea
                        placeholder="Descripción"
                        value={product.description}
                        onChange={(e) =>
                            setProduct({
                                ...product,
                                description: e.target.value
                            })
                        }
                    />
                    <div className="flex items-center justify-center mt-2 col-span-2">
                        {errors.description && <span className="text-red-500">{errors.description[0]}</span>}
                    </div>
                </div>

                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Imagen</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setProduct({
                                ...product,
                                image: e.target.files[0]
                            })
                        }
                    />
                </div>

                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Tipo</label>
                    <select
                        value={product.type_id}
                        onChange={(e) =>
                            setProduct({
                                ...product,
                                type_id: e.target.value
                            })
                        }
                    >
                        <option value=''>Seleccione un tipo</option>

                        {types.map((type) => (
                            <option
                                key={type.id}
                                value={type.id}
                            >
                                {type.name}
                            </option>
                        ))}
                    </select>
                    <div className="flex items-center justify-center mt-2 col-span-2">
                        {errors.type_id && <span className="text-red-500">{errors.type_id[0]}</span>}
                    </div>
                </div>

                <div className="grid grid-cols-2 items-center">
                        <label className="text-center text-lg font-bold">Precio</label>
                        <input
                            type='number'
                            placeholder='Precio'
                            value={product.price}
                            onChange={(e) =>
                                setProduct({
                                    ...product,
                                    price: e.target.value
                                })
                            }
                        />
                        <div className="flex items-center justify-center mt-2 col-span-2">
                            {errors.price && <span className="text-red-500">{errors.price[0]}</span>}
                        </div>
                </div>

                <button type="submit" className="btn m-auto">
                    {buttonText}
                </button>
                
            </form>
        </div>
    )
}