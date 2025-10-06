import Cartelera from "@/app/components/CardCartelera";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center gap-10">
        <h2 className='ml-6 text-3xl'>PELÍCULAS EN CARTELERA</h2>
        <Cartelera/>
      </div>
    </>
  );
}
