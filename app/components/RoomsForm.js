'use client';

export default function RoomsForm({ room = {}, setRoom, errors = {}, onSubmit, buttonText = 'Guardar' }) {
    const rows = Number(room.rows_num) || 0;
    const cols = Number(room.cols_num) || 0;
    const totalCapacity = rows * cols;

    return (
        <div className="flex justify-center">
            <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Número de sala</label>
                    <input
                        type="number"
                        placeholder="Ej: 1, 2, 3..."
                        value={room.number ?? ''}
                        onChange={(e) =>
                            setRoom({
                                ...room,
                                number: e.target.value
                            })
                        }
                        className="input border p-2 rounded"
                    />

                    <div className="flex items-center justify-center mt-2 col-span-2">
                        {errors.number && <span className="text-red-500">{errors.number[0]}</span>}
                    </div>
                </div>

                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Cantidad de filas</label>
                    <input
                        type="number"
                        min='1'
                        placeholder="Ej: 8"
                        value={room.rows_num ?? ''}
                        onChange={(e) =>
                            setRoom({
                                ...room,
                                rows_num: e.target.value
                            })
                        }
                        className="input border p-2 rounded"
                    />

                    <div className="flex items-center justify-center mt-2 col-span-2">
                        {errors.rows_num && <span className="text-red-500">{errors.rows_num[0]}</span>}
                    </div>
                </div>

                <div className="grid grid-cols-2 items-center">
                    <label className="text-center text-lg font-bold">Cantidad de columnas</label>
                    <input
                        type="number"
                        min='1'
                        placeholder="Ej: 8"
                        value={room.cols_num ?? ''}
                        onChange={(e) =>
                            setRoom({
                                ...room,
                                cols_num: e.target.value
                            })
                        }
                        className="input border p-2 rounded"
                    />

                    <div className="flex items-center justify-center mt-2 col-span-2">
                        {errors.cols_num && <span className="text-red-500">{errors.cols_num[0]}</span>}
                    </div>
                </div>

                {/* Previsualización de capacidad total */}
                <div className="p-3 bg-zinc-800 rounded text-center my-2">
                    <p className="text-lg">
                        Capacidad total: <span className="font-bold text-[var(--green)]">{totalCapacity}</span> asientos
                    </p>
                </div>

                <button type="submit" className="btn m-auto">{buttonText}</button>
            </form>
        </div>
    );
}