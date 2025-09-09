'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { signOut } from 'next-auth/react'

function Header() {
  const pathname = usePathname()
  const { data: session } = useSession();
  const isLogin = session ? true : false

  const getLinkClassName = (href: string) => {
    const isActive = pathname === href
    return `hover:underline ${isActive ? 'text-blue-500' : ''}`
  }

  return (
    <div className="flex justify-between items-center p-4 mx-10">
    <div>
      <Link href="/" className="font-black text-2xl">Home</Link>
    </div>
    <div className="flex space-x-6 text-lg ">
      <Link href="/edit" className={getLinkClassName('/edit')}>Edit</Link>
      <Link href="/download" className={getLinkClassName('/download')}>Download</Link>
      {isLogin && <Link href="/logout" className={getLinkClassName('/logout')} onClick={() => signOut()}>Logout</Link>}
      {/*
      <Link href="/upload" className={getLinkClassName('/upload')}>Upload</Link>
      */}
    </div>
  </div>
  )
}

export { Header }
