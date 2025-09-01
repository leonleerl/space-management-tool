'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function Header() {
  const pathname = usePathname()

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
      {/*
      <Link href="/upload" className={getLinkClassName('/upload')}>Upload</Link>
      */}
      <Link href="/download" className={getLinkClassName('/download')}>Download</Link>
    </div>
  </div>
  )
}

export { Header }
