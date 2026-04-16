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
    <div className="grid grid-cols-2 w-full md:w-2/3 md:grid-cols-4 gap-6 p-6">
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
    <div className="relative w-full md:w-2/3 px-10">
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
    <div className="flex flex-col md:flex-row mx-15 border-2 border-gray-400 rounded-xl">
        <div className="w-full md:w-100 h-110 md:h-130">
            <Skeleton className="w-full h-full rounded-xl" />
        </div>
        <div className="flex gap-5 p-4 flex-col w-full h-130 items-center justify-between">
            <Skeleton className="mb-5 w-1/3 h-8 mx-auto"/>
            <Skeleton className="w-full h-50 text-md lg:text-lg p-2"/>
            <div className="flex justify-center w-full">
                <Skeleton className="w-1/2 h-30"/>
            </div>
            <div className="flex flex-col w-full gap-5 lg:gap-10 md:justify-between lg:flex-row">
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </div>
        </div>
    </div>
);

export const SkeletonCardCandy = () => (
    <div className="flex flex-col border-2 bg-[var(--teal)] border-gray-400 rounded-xl">
        <div className="w-full h-50 p-4 overflow-hidden">
            <Skeleton className="w-full h-full" />
        </div>

        <Skeleton className="p-2 h-[48px] mb-5" />
        <Skeleton className="h-[40px] mb-2" />
        <Skeleton className="h-[20px] w-20 mb-4 ml-1" />
        <Skeleton className="h-[20px] w-16 mb-2 mt-auto mx-auto" />
    </div>
);