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

export const movieSchema = z.object({
    title: z
        .string()
        .nonempty('Ingrese el título'),
    synopsis: z
        .string()
        .nonempty('Ingrese la sinopsis'),
    duration: z
        .string()
        .nonempty('Ingrese la duración'),
    release_date: z
        .string()
        .nonempty('Ingrese la fecha de estreno'),
    classification_id: z
        .coerce
        .string()
        .nonempty('Seleccione una clasificación'),
    status_id: z
        .coerce
        .string()
        .nonempty('Seleccione un estado'),
    genres: z
        .coerce
        .string()
        .nonempty('Seleccione uno o más géneros')
});

export const showtimesSchema = z.object({
    movie_id: z
        .coerce
        .string()
        .nonempty('Seleccione una película'),
    room_id: z
        .coerce
        .string()
        .nonempty('Seleccione una sala'),
    hour: z
        .string()
        .nonempty('Seleccione la fecha y hora'),
    days: z
        .coerce
        .number()
        .min(1, 'Debe ser al menos 1 día')
        .max(30, 'Máximo 30 días')
        .optional()
        .default(1),
    price: z
        .string()
        .nonempty('Ingrese un precio')
});
