'use client';

export default function CardCandy({ items }) {
    return (
        <div>
            {items.map((item) => (
                <div key={item.id}>
                    <h2>{item.title}</h2>
                    <img
                        src={item.img}
                        alt="Imagen del producto."
                    />
                    <span>{item.description}</span>
                    <p>{item.price}</p>
                </div>
            ))}
        </div>
    )
}
