'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CandyForm from "@/app/components/CandyForm";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EditCandyPage() {
    const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [candy, setCandy] = useState({
        title: '',
        description: '',
        image: null,
        img: '',
        type_id: '',
        price: ''
    });

    useEffect(() => {
        if (params?.id) {
            loadCandy();
        }
    }, [params]);

    async function loadCandy() {
        const res = await fetch(`/api/candy/${params.id}`);
        if (!res.ok) {
            alert('No se pudo cargar el producto');
            return;
        }

        const data = await res.json();

        setCandy({
            title: data.title,
            description: data.description,
            image: null,
            img: data.img,
            type_id: data.type_id,
            price: data.price
        });

        setLoading(false);
    };

    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();

        formData.append('title', candy.title);
        formData.append('description',  candy.description);
        formData.append('type_id', candy.type_id);
        formData.append('price', candy.price);
        if (candy.image) {
            formData.append('image', candy.image);
        }

        const response = await fetch(`/api/candy/${params.id}`, {
            method: 'PUT',
            body: formData
        });

        if (response.ok) {
            router.push('/admin/candy');
            toast.success('Producto modificado exitosamente');
        } else {
            alert('Error al actualizar el producto');
        }
    };

    if (loading) {
        return <h2>Cargando...</h2>;
    };

    return(
        <div className="p-4 flex flex-col gap-4">
            <h1 className="text-center text-3xl font-bold">Editar producto</h1>

            <CandyForm
                candy={candy}
                setCandy={setCandy}
                onSubmit={handleSubmit}
                buttonText="Guardar cambios"
            />

            <Link href='/admin/candy' className="m-auto">
                <button className="btn">Volver</button>
            </Link>
        </div>
    )
}