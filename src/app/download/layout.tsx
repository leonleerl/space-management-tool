import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'

export default async function DownloadLayout({ children }: { children: React.ReactNode }) {   
    const session = await getServerSession(authOptions)
    if (!session) {
        // redirect('/?error=loginRequired')
        redirect('/');
    }
    return (
        <>
        {children}
        </>
    )
}