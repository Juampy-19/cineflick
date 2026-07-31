'use client';

import { useState, useEffect } from "react";

export default function CandyForm ({candy, setCandy, onSubmit, buttonText = 'Guardar'}) {
    const [types, setTypes] = useState([]);

    useEffect(() => {
        async function loadData() {
            const typesRes = await fetch('/api/candyTypes');

            const typesData = await typesRes.json();

            setTypes(typesData);
        }

        loadData();
    }, []);

    return (
        <div className="flex justify-center">
            <form  onSubmit={onSubmit} className="flex flex-col gap-4 w-1/2">
                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Producto</label>
                    <input
                        type="text"
                        placeholder="Producto"
                        value={candy.title}
                        onChange={(e) =>
                            setCandy({
                                ...candy,
                                title: e.target.value
                            })
                        }
                    />
                </div>

                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Descripción</label>
                    <textarea
                        placeholder="Descripción"
                        value={candy.description}
                        onChange={(e) =>
                            setCandy({
                                ...candy,
                                description: e.target.value
                            })
                        }
                    />
                </div>

                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Imagen</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setCandy({
                                ...candy,
                                img: e.target.files[0]
                            })
                        }
                    />
                </div>

                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Tipo</label>
                    <select
                        value={candy.type_id}
                        onChange={(e) =>
                            setCandy({
                                ...candy,
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
                </div>

                <div className="grid grid-cols-2 items-center">
                        <label className="text-center text-lg font-bold">Precio</label>
                        <input
                            type='number'
                            placeholder='Precio'
                            value={candy.price}
                            onChange={(e) =>
                                setCandy({
                                    ...candy,
                                    price: e.target.value
                                })
                            }
                        />
                </div>

                <button type="submit" className="btn m-auto">
                    {buttonText}
                </button>
                
            </form>
        </div>
    )
}