import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DownloadLayout({ children }: { children: React.ReactNode }) {   
    const session = await getServerSession(authOptions)
    if (!session) {
        // redirect('/?error=loginRequired')
        console.log("session(if not session): ", session)
        redirect('/');
    }
    console.log("session(if session): ", session)
    return (
        <>
        {children}
        </>
    )
}