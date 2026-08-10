'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/app/components/ProductForm";
import Link from "next/link";
import toast from "react-hot-toast";
import { productSchema } from "@/utils/schema";

export default function EditCandyPage() {
    const params = useParams();
    const router = useRouter();

    const [store, setStore] = useState({
        title: '',
        description: '',
        image: null,
        img: '',
        type_id: '',
        price: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (params?.id) {
            loadStore();
        }
    }, [params]);

    async function loadStore() {
        const res = await fetch(`/api/store/${params.id}`);
        if (!res.ok) {
            alert('No se pudo cargar el producto');
            return;
        }

        const data = await res.json();

        setStore({
            title: data.title,
            description: data.description,
            image: null,
            img: data.img,
            type_id: data.type_id,
            price: data.price
        });
    };

    async function handleSubmit(e) {
        e.preventDefault();

        // Validación del formulario con zod.
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

        const response = await fetch(`/api/store/${params.id}`, {
            method: 'PUT',
            body: formData
        });

        if (response.ok) {
            router.push('/admin/store');
            toast.success('Producto modificado exitosamente');
        } else {
            toast.error('Error al modificar el producto');
        }
    };

    return (
        <div className="p-4 flex flex-col gap-4">
            <h1 className="text-center text-3xl font-bold">Editar producto</h1>

            <ProductForm
                product={store}
                setProduct={setStore}
                errors={errors}
                onSubmit={handleSubmit}
                buttonText="Guardar cambios"
                typesApiUrl="/api/storeTypes"
            />

            <Link href='/admin/store' className="m-auto">
                <button className="btn">Volver</button>
            </Link>
        </div>
    )
}