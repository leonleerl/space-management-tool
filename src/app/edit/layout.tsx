export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function EditLayout({ children }: { children: React.ReactNode }) {   
    return (
        <>
        {children}
        </>
    )
}