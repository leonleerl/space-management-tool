import React from 'react'
import { AccFinTable } from './contact'
import { AccFinTable as AccFinTableAccomodation } from './accomodation'

const ContentMap : Record<string, React.ReactNode> = {
    "11": <AccFinTableAccomodation />,
    '21': <AccFinTable />,
}

export { ContentMap }
