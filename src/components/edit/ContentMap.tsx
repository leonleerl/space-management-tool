import React from 'react'
import { AccFinCon } from './contact'
import { AccFinAcc } from './accomodation'

const ContentMap : Record<string, React.ReactNode> = {
    "16": <AccFinAcc />,
    '21': <AccFinCon />,
}

export { ContentMap }
