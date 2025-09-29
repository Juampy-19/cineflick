'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerSchema } from '@/utils/schema';
import toast from 'react-hot-toast';

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
            alert(data.message || data.error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center gap-15 p-6 m-20">
                <div className="flex flex-col items-center">
                    <div className='w-lg flex items-center  justify-between'>
                        <label>Nombre</label>
                        <input
                            type="name"
                            name="name"
                            placeholder="Nombre"
                            onChange={handleChange}
                            className="w-xs"
                        />
                    </div>
                    {errors.name && <span className='text-red-500 mt-2'>{errors.name[0]}</span>}
                </div>

                <div className='flex flex-col items-center'>
                    <div className="w-lg flex items-center justify-between">
                        <label>Apellido</label>
                        <input
                            type="lastname"
                            name="lastname"
                            placeholder="Apellido"
                            onChange={handleChange}
                            className="w-xs"
                        />
                    </div>
                    {errors.lastname && <span className='text-red-500 mt-2'>{errors.lastname[0]}</span>}
                </div>

                <div className='flex flex-col items-center'>
                    <div className="w-lg flex items-center justify-between">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            className="w-xs"
                        />
                    </div>
                    {errors.email && <span className='text-red-500 mt-2'>{errors.email[0]}</span>}
                </div>

                <div className='flex flex-col items-center'>
                    <div className="w-lg flex items-center justify-between">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            onChange={handleChange}
                            className="w-xs"
                        />
                    </div>
                    {errors.password && <span className='text-red-500 mt-2'>{errors.password[0]}</span>}
                </div>

                <div className='flex flex-col items-center'>
                    <div className="w-lg flex items-center justify-between">
                        <label>Confirmar contraseña</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirmar contraseña"
                            onChange={handleChange}
                            className="w-xs"
                        />
                    </div>
                    {errors.confirmPassword && <span className='text-red-500 mt-2'>{errors.confirmPassword[0]}</span>}
                </div>

                <div>
                    <button type='submit'>Crear cuenta</button>
                </div>
            </div>
        </form>
    )
}