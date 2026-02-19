import React from "react";

export const Skeleton = ({ className = 'w-full h-4' }) => (
    <div
        className={`
            animate-pulse
            bg-gray-400
            rounded-xl
            ${className}
        `}
    />
);

export const SkeletonCardCartelera = () => (
    <div className="w-2/3 grid grid-cols-4 gap-6 p-6">
        {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className='flex flex-col items-center border-2 border-gray-400 rounded-xl shadow-lg bg-gray-200 animate-pulse'>
                <div className='w-full h-64 rounded-t-xl'>
                    <Skeleton className="w-full h-full rounded-xl" />
                </div>                
                <Skeleton className="mt-3 mb-3 w-3/4 h-4" />
                <Skeleton className="mt-2 mb-4 w-1/3 h-4" />                
            </div>
        ))}
    </div>
);

export const SkeletonCardProximamente = () => (
    <div className="relative w-2/3 px-10">
        <div className="flex overflow-hidden space-x-6 p-4 mb-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="relative flex-shrink-0 w-56 flex flex-col items-center border-2 border-gray-300 rounded-xl shadow-lg bg-gray-200 animate-pulse">
                    <div className="w-full h-72 bg-gray-300 rounded-t-xl">
                        <Skeleton className="w-full h-full rounded-xl" />
                    </div>                    
                    <Skeleton className="mt-3 mb-3 w-3/4 h-4" />                    
                    <Skeleton className="mt-2 mb-4 w-1/3 h-4" />                    
                </div>
            ))}
        </div>
    </div>
);

export const SkeletonPeliculaPage = () => (
    <div className="flex mx-15 border-2 border-gray-400 rounded-xl">
        <div className="w-100 h-130">
            <Skeleton className="w-full h-full rounded-xl" />
        </div>
        <div className="flex p-4 flex-col w-full h-130 justify-between">
            <Skeleton className="mb-5 w-1/3 h-8 mx-auto"/>
        </div>
    </div>
);