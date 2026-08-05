import Link from "next/link";

export default async function AdminPage() {

    return (
        <div className="flex flex-col items-center gap-4">
            <h1 className="text-center m-5 text-3xl">Panel de Administración</h1>

            <section className="flex flex-col gap-5">
                <Link href={'/admin/movies'}>
                    <button className="btn">Películas</button>
                </Link>

                <Link href={'/admin/candy'}>
                    <button className="btn">Candy</button>
                </Link>

                <Link href={'/admin/store'}>
                    <button className="btn">Store</button>
                </Link>
            </section>
        </div>
    )
}