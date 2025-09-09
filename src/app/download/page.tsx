"use client"

import React, { useEffect, useState } from 'react'
import type { StaffDto } from '@/types/staff'

type DepartmentKey = 'AccFin' | 'Economics' | 'Marketing' | 'MO' | "Dean's Office"

const SHEET_ORDER: { key: DepartmentKey; sheetName: string; title: string; apiDept: string }[] = [
  { key: 'AccFin', sheetName: 'AccFin', title: 'Accounting & Finance Staff', apiDept: 'AccFin' },
  { key: 'Economics', sheetName: 'Economics', title: 'Economics Staff', apiDept: 'Economics' },
  { key: 'Marketing', sheetName: 'Marketing', title: 'Marketing Staff', apiDept: 'Marketing' },
  { key: 'MO', sheetName: 'MO', title: 'Management & Organizations Staff', apiDept: 'MGMT & ORGS' },
  { key: "Dean's Office", sheetName: "Dean's Office", title: "Dean's Office Staff", apiDept: "Dean's Office" },
]

function formatDate(date: Date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function DownloadPage() {
  const [status, setStatus] = useState<string>('Generating export file...')

  useEffect(() => {
    let didCancel = false

    async function run() {
      try {
        setStatus('Fetching staff data...')
        // fetch all departments in parallel
        const results = await Promise.all(
          SHEET_ORDER.map(async ({ apiDept }) => {
            const res = await fetch(`/api/staff?department=${encodeURIComponent(apiDept)}`)
            if (!res.ok) throw new Error(`Failed to fetch ${apiDept}`)
            const rows: StaffDto[] = await res.json()
            return rows
          })
        )

        if (didCancel) return

        setStatus('Building workbook...')
        // dynamic import for browser-only env and to avoid type resolution during build
        const xlsxModule = await import('xlsx-js-style')
        const XLSX = xlsxModule?.default ?? xlsxModule

        const workbook = XLSX.utils.book_new()

        SHEET_ORDER.forEach(({ sheetName, title }, idx) => {
          const rows: StaffDto[] = results[idx] || []
          const headers = ['#', 'Full Name', 'Position', 'Ext No', 'Room', 'Source']

          // Prepare data: row 1 reserved for merged title; row 2 headers; rest data
          const aoa: (string | number | null)[][] = []
          aoa.push([title])
          aoa.push(headers)

          rows.forEach((r, i) => {
            aoa.push([
              i + 1,
              r.fullName ?? '',
              r.position ?? '',
              r.extNo ?? '',
              r.room?.roomNo ?? '',
              r.source ?? '',
            ])
          })

          const ws = XLSX.utils.aoa_to_sheet(aoa)

          // Merge A1:F1 for the title row
          ws['!merges'] = ws['!merges'] || []
          ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } })

          // Style title cell A1
          const titleCell = ws['A1'] || { t: 's', v: title }
          titleCell.s = {
            font: { bold: true, sz: 16 },
            alignment: { horizontal: 'center', vertical: 'center' },
          }
          ws['A1'] = titleCell

          // Optional: set row height for title
          ws['!rows'] = ws['!rows'] || []
          ws['!rows'][0] = { hpt: 24 }

          // Style header row background and bold font for A2:F2
          const headerCols = ['A', 'B', 'C', 'D', 'E', 'F']
          headerCols.forEach((col) => {
            const addr = `${col}2`
            const cell = ws[addr] || { t: 's', v: '' }
            cell.s = {
              fill: { patternType: 'solid', fgColor: { rgb: 'FABF8F' } },
              font: { bold: true },
              alignment: { horizontal: 'center', vertical: 'center' },
            }
            ws[addr] = cell
          })

          // Set some reasonable column widths
          ws['!cols'] = [
            { wch: 5 }, // #
            { wch: 30 }, // Full Name
            { wch: 20 }, // Position
            { wch: 12 }, // Ext No
            { wch: 12 }, // Room
            { wch: 16 }, // Source
          ]

          XLSX.utils.book_append_sheet(workbook, ws, sheetName)
        })

        if (didCancel) return

        setStatus('Downloading...')
        const todayStr = formatDate(new Date())
        const fileName = `Business School Staff_Contact List ${todayStr}.xlsx`
        XLSX.writeFile(workbook, fileName)
        setStatus(fileName+' is ready!')
      } catch (err) {
        console.error(err)
        if (!didCancel) setStatus('Failed to generate file')
      }
    }

    run()
    return () => {
      didCancel = true
    }
  }, [])

  return (
    <div className='min-h-screen flex items-center justify-center'>
      {status}
    </div>
  )
}

export default DownloadPage
