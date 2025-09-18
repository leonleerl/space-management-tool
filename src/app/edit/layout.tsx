import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function EditLayout({ children }: { children: React.ReactNode }) {   
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