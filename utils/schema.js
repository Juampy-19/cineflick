import { z } from 'zod';

export const registerSchema = z.object({
    name: z
        .string()
        .nonempty('Ingrese su nombre'),
    lastname: z
        .string()
        .nonempty('Ingrese su apellido'),
    email: z
        .string()
        .nonempty('Ingrese su email'),
    password: z
        .string()
        .nonempty('Ingrese su contraseña')
        .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z
        .string()
        .nonempty('Ingrese su contaseña')
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas deben coincidir',
    path: ['confirmPassword']
});

export const loginSchema = z.object({
    email: z
        .string()
        .nonempty('Ingrese su email'),
    password: z
        .string()
        .nonempty('Ingrese su contraseña')
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
});

export const productSchema = z.object({
    title: z
        .string()
        .nonempty('Ingrese el nombre del producto'),
    description: z
        .string()
        .nonempty('Ingrese la descripción'),
    type_id: z
        .coerce
        .string()
        .nonempty('Seleccione el tipo de producto'),
    price: z
        .string()
        .nonempty('Ingrese un precio')
});
