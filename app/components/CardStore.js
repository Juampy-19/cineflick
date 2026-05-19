'use client';

export default function CardStore({ products }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 p-4 gap-6">
            {products.map((product) => (
                <div key={product.id} className="border-2 border-[var(--green)]">
                    <div>
                        <img 
                            src={product.img}
                            alt="Imagen del producto"
                        />
                    </div>
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                    <h5>{product.price}</h5>
                </div>
            ))}
        </div>
    )
}