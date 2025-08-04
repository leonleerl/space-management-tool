'use client'
import React from 'react'
import { UploadDragger } from '@/components/upload'

function UploadPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-4'>
        <div className='font-black text-2xl'>Upload your Excel files</div>
        <UploadDragger />
    </div>
  )
}

export default UploadPage
