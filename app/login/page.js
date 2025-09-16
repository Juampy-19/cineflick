import '../globals.css';

export default function LoginPage() {
    return (
        <form>
            <div className="flex flex-col items-center gap-15 m-20">
                <div>
                    <div className="text-center p-3">
                        <label htmlFor="email">Email</label>
                    </div>
                    <div>
                        <input 
                            type="email"
                            name="email"
                            placeholder="Ingrese su email"
                        />
                    </div>
                </div>
                <div>
                    <div className="text-center p-3">
                        <label htmlFor="password">Contraseña</label>
                    </div>
                    <div>
                        <input 
                            type="password"
                            name="password"
                            placeholder="Ingrese su contraseña"
                        />
                    </div>
                </div>
                <div>
                    <button>Ingresar</button>
                </div>
            </div>
        </form>
    )
}