'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerSchema } from '@/utils/schema';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: ''
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
        const result = registerSchema.safeParse(formData);

        if (!result.success) {
            const formattedErrors = result.error.flatten().fieldErrors;
            setErrors(formattedErrors);
            return;
        }

        setErrors({});

        // Enviar al backend.
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (res.ok) {
            router.push('/login');
            toast.success('Usuario registrado exitosamente')
        } else {
            setServerError(data.error || 'Error al registrar usuario');
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center gap-10 mt-10">
                    <div className="flex flex-col w-full items-center">
                        <div className='flex flex-col w-full gap-2 items-center'>
                            <label>Nombre</label>
                            <div className='w-full text-center'>
                                <input
                                    type="name"
                                    name="name"
                                    placeholder="Nombre"
                                    onChange={handleChange}
                                    className="w-3/4 md:w-1/3"
                                />
                            </div>
                        </div>
                        {errors.name && <span className='text-red-500 mt-2'>{errors.name[0]}</span>}
                    </div>

                    <div className='flex flex-col w-full items-center'>
                        <div className="flex flex-col w-full gap-2 items-center">
                            <label>Apellido</label>
                            <div className='w-full text-center'>
                                <input
                                    type="lastname"
                                    name="lastname"
                                    placeholder="Apellido"
                                    onChange={handleChange}
                                    className="w-3/4 md:w-1/3"
                                />
                            </div>
                        </div>
                        {errors.lastname && <span className='text-red-500 mt-2'>{errors.lastname[0]}</span>}
                    </div>

                    <div className='flex flex-col w-full items-center'>
                        <div className="flex flex-col w-full gap-2 items-center">
                            <label>Email</label>
                            <div className='w-full text-center'>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    onChange={handleChange}
                                    className="w-3/4 md:w-1/3"
                                />
                            </div>
                        </div>
                        {errors.email && <span className='text-red-500 mt-2'>{errors.email[0]}</span>}
                    </div>

                    <div className='flex flex-col w-full items-center'>
                        <div className="flex flex-col w-full gap-2 items-center">
                            <label>Contraseña</label>
                            <div className='w-full text-center'>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Contraseña"
                                    onChange={handleChange}
                                    className="w-3/4 md:w-1/3"
                                />
                            </div>
                        </div>
                        {errors.password && <span className='text-red-500 mt-2'>{errors.password[0]}</span>}
                    </div>

                    <div className='flex flex-col w-full items-center'>
                        <div className="flex flex-col w-full gap-2 items-center">
                            <label>Confirmar contraseña</label>
                            <div className='w-full text-center'>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirmar contraseña"
                                    onChange={handleChange}
                                    className="w-3/4 md:w-1/3"
                                />
                            </div>
                        </div>
                        {errors.confirmPassword && <span className='text-red-500 mt-2'>{errors.confirmPassword[0]}</span>}
                    </div>

                    <div className='mt-5 mb-10'>
                        <button type='submit'>Crear cuenta</button>
                    </div>
                </div>
            </form>

            <Modal isOpen={!!serverError} onClose={() => setServerError(null)} title='Error al registrar usuario' >
                <p>{serverError}</p>
            </Modal>
        </>
    )
}