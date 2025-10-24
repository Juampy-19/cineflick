import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import CompraPageContent from './CompraPageContent';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function CompraPage({ params }) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session) {
        redirect('/login');
    }

    return <CompraPageContent id={id} user={session.user} />
}