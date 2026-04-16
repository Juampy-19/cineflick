'use client';

export default function Footer() {
    return (
        <footer className="grid md:grid-cols-2">
            <div className="p-2 text-sm">
                <p>Copyright © 2026 Cineflick</p>
                <p>Dirección General de Defensa y Protección al Consumidor: Para consultas y/o denuncias haga <a>click aquí</a></p>
            </div>

            <div className="flex items-center justify-center p-2">
                <button className="btn">Eliminar cuenta</button>
            </div>
        </footer>
    )
}