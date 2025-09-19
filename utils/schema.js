import { email, z } from 'zod';

export const registerSchema = z.object({
    name: z.string().nonempty('Ingrese su nombre'),
    lastname: z.string().nonempty('Ingrese su apellido'),
    email: z.string().nonempty('Ingrese su email'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas deben coincidir',
    path: ['confirmPassword']
});
