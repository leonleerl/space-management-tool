import React from 'react'
import { AccFinStaff } from './staff'
import { AccFinAcc } from './accomodation'

const ContentMap : Record<string, React.ReactNode> = {
    "16": <AccFinAcc />,
    '21': <AccFinStaff />,
}

export { ContentMap }
