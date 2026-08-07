'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/app/components/ProductForm";
import Link from "next/link";
import toast from "react-hot-toast";
import { productSchema } from "@/utils/schema";

export default function CreateCandyPage() {
    const router = useRouter();
    const [candy, setCandy] = useState({
        title: '',
        description: '',
        image: null,
        type_id: '',
        price: ''
    });
    const [errors, setErrors] = useState({});

    async function handleSubmit(e) {
        e.preventDefault();

        const result = productSchema.safeParse(candy);

        if (!result.success) {
            const formattedErrors = result.error.flatten().fieldErrors;
            setErrors(formattedErrors);
            return
        };

        setErrors({});

        const formData = new FormData();

        formData.append('title', candy.title);
        formData.append('description', candy.description);
        formData.append('type_id', candy.type_id);
        formData.append('price', candy.price);
        if (candy.image) {
            formData.append('image', candy.image);
        }

        const response = await fetch('/api/candy', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            router.push('/admin/candy');
            toast.success('Producto creado correctamenre');
        } else {
            toast.error('Error al crear el producto');
        }
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            <h1 className="text-center text-3xl font-bold">Nuevo producto</h1>

            <ProductForm
                product={candy}
                setProduct={setCandy}
                errors={errors}
                onSubmit={handleSubmit}
                buttonText="Crear producto"
            />

            <Link href={'/admin/candy'} className="m-auto">
                <button className="btn">Volver</button>
            </Link>
        </div>
    )
}