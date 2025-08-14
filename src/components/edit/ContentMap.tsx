import React from 'react'
import { AccFinStaff, MarketingStaff } from './staff'
import { AccFinAcc, MarketingAcc } from './accommodation'


const ContentMap : Record<string, React.ReactNode> = {
    "15": <MarketingAcc />,
    "16": <AccFinAcc />,
    '21': <AccFinStaff />,
    '22': <MarketingStaff />,
}

export { ContentMap }
