'use client';

import '../globals.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginSchema } from '@/utils/schema';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import { signIn, getSession } from 'next-auth/react';

export default function LoginPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación con zod.
        const result = loginSchema.safeParse(formData);

        if (!result.success) {
            const formattedErrors = result.error.flatten().fieldErrors;
            setErrors(formattedErrors);
            return
        };

        setErrors({});

        const res = await signIn('credentials', {
            redirect: false,
            email: formData.email,
            password: formData.password
        });

        if (res.ok) {
            const session = await getSession();
            toast.success('Inicio de sesión exitoso');

            if (session?.user.rol === 'admin') {
                router.push('/admin');
            } else {
                router.push('/');
            }
        } else {
            switch (res.error) {
                case 'USER_NOT_FOUND':
                    setServerError('El email no está registrado');
                    break;
                
                case 'INVALID_PASSWORD':
                    setServerError('La contraseña es incorrecta');
                    break;

                case 'SERVER_ERROR':
                    setServerError('Error en el servidor');
                    break;

                default:
                    setServerError('Error al iniciar sesión');
            }
        };
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center gap-10 mt-20">
                    <div className='flex flex-col gap-5 w-full items-center'>
                        <div className="text-center p-3">
                            <label htmlFor="email">Email</label>
                        </div>
                        <div className='w-full text-center'>
                            <input 
                                type="email"
                                name="email"
                                placeholder="Ingrese su email"
                                onChange={handleChange}
                                className='w-3/4 md:w-1/2'
                            />
                        </div>
                        <div className='flex items-center justify-center mt-2'>
                            {errors.email && <span className='text-red-500'>{errors.email[0]}</span>}
                        </div>
                    </div>
                    <div className='flex flex-col gap-5 w-full items-center'>
                        <div className="text-center p-3">
                            <label htmlFor="password">Contraseña</label>
                        </div>
                        <div className='w-full text-center'>
                            <input 
                                type="password"
                                name="password"
                                placeholder="Ingrese su contraseña"
                                onChange={handleChange}
                                className='w-3/4 md:w-1/2'
                            />
                        </div>
                        <div className='flex items-center justify-center mt-2'>
                            {errors.password && <span className='text-red-500'>{errors.password[0]}</span>}
                        </div>
                    </div>
                    <div className='flex flex-col gap-10 mb-10'>
                        <button type='submit' className='btn'>Ingresar</button>

                        <Link href='/register'>
                            <button className='btn'>Crear cuenta</button>
                        </Link>
                    </div>
                </div>
            </form>

            <Modal isOpen={!!serverError} onClose={() => setServerError(null)} title='Error al iniciar sesión'>
                <p>{serverError}</p>
            </Modal>
        </>
    )
}