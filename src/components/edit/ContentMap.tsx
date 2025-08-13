import React from 'react'
import { AccFinStaff } from './staff'
import { AccFinAcc } from './accommodation'
import { AccFinStu } from './student'

const ContentMap : Record<string, React.ReactNode> = {
    "16": <AccFinAcc />,
    '21': <AccFinStaff />,
    "34": <AccFinStu />,
}

export { ContentMap }
