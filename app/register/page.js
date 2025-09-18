export default function RegisterPage() {
    return (
        <form>
            <div className="flex flex-col items-center gap-15 p-6 m-20">
                <div className="w-xl flex items-center justify-between">
                    <label>Nombre</label>
                    <input
                        type="name"
                        name="name"
                        placeholder="Nombre"
                        className="w-xs"
                    />
                </div>
                <div className="w-xl flex items-center justify-between">
                    <label>Apellido</label>
                    <input
                        type="lastname"
                        name="lastname"
                        placeholder="Apellido"
                        className="w-xs"
                    />
                </div>
                <div className="w-xl flex items-center justify-between">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-xs"
                    />
                </div>
                <div className="w-xl flex items-center justify-between">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        className="w-xs"
                    />
                </div>
                <div className="w-xl flex items-center justify-between">
                    <label>Confirmar contraseña</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmar contraseña"
                        className="w-xs"
                    />
                </div>
                <div>
                    <button>Crear cuenta</button>
                </div>
            </div>
        </form>
    )
}