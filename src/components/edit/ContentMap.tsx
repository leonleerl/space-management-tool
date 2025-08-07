import React from 'react'
import { AccFinCon } from './staff'
import { AccFinAcc } from './accomodation'

const ContentMap : Record<string, React.ReactNode> = {
    "16": <AccFinAcc />,
    '21': <AccFinCon />,
}

export { ContentMap }
