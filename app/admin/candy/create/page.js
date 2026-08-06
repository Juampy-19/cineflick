'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import CandyForm from "@/app/components/ProductForm";

export default function CreateCandyPage() {
    const router = useRouter();
    const [candy, setCandy] = useState({
        title: '',
        description: '',
        image: null,
        type_id: '',
        price: ''
    });

    async function handleSubmit(e) {
        e.preventDefault();

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
        }
    }

    return (
        <div>
            <h1>Nuevo producto</h1>

            <CandyForm
                candy={candy}
                setCandy={setCandy}
                onSubmit={handleSubmit}
                buttonText="Crear producto"
            />
        </div>
    )
}