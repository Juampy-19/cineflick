import '../globals.css';
import Link from 'next/link';

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
                            className='w-sm'
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
                            className='w-sm'
                        />
                    </div>
                </div>
                <div className='flex flex-col gap-10'>
                    <button>Ingresar</button>

                    <Link href='/register'>
                        <button>Crear cuenta</button>
                    </Link>
                </div>
            </div>
        </form>
    )
}