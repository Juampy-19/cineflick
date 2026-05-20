'use client';

export default function CardStore({ products }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 p-4 gap-8">
            {products.map((product) => (
                <div key={product.id} className="flex flex-col border-2 border-[var(--green)] bg-[var(--teal)] rounded-xl hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-50 p-4 overflow-hidden">
                        <img 
                            src={product.img}
                            alt="Imagen del producto"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h3 className="text-center p-2 h-[48px] mb-10 md:mb-5">{product.title}</h3>
                    <span className="text-sm p-2">{product.description}</span>
                    <h5 className="text-center p-2 text-[var(--green)] mt-auto">${product.price}</h5>
                </div>
            ))}
        </div>
    )
}