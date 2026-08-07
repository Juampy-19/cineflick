'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/app/components/ProductForm";
import Link from "next/link";
import toast from "react-hot-toast";
import { productSchema } from "@/utils/schema";

export default function CreateCandyPage() {
    const router = useRouter();
    const [store, setStore] = useState({
        title: '',
        description: '',
        image: null,
        type_id: '',
        price: ''
    });
    const [errors, setErrors] = useState({});

    async function handleSubmit(e) {
        e.preventDefault();

        const result = productSchema.safeParse(store);

        if (!result.success) {
            const formattedErrors = result.error.flatten().fieldErrors;
            setErrors(formattedErrors);
            return
        };

        setErrors({});

        const formData = new FormData();

        formData.append('title', store.title);
        formData.append('description', store.description);
        formData.append('type_id', store.type_id);
        formData.append('price', store.price);
        if (store.image) {
            formData.append('image', store.image);
        }

        const response = await fetch('/api/store', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            router.push('/admin/store');
            toast.success('Producto creado correctamente');
        } else {
            toast.error('Error al crear el producto');
        }
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            <h1 className="text-center text-3xl font-bold">Nuevo producto</h1>

            <ProductForm
                product={store}
                setProduct={setStore}
                errors={errors}
                onSubmit={handleSubmit}
                buttonText="Crear producto"
                typesApiUrl="/api/storeTypes"
            />

            <Link href={'/admin/store'} className="m-auto">
                <button className="btn">Volver</button>
            </Link>
        </div>
    )
}