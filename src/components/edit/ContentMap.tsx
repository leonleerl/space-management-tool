import React from 'react'

import { AccFinStaff, MarketingStaff } from './staff'
import { AccFinAcc, MarketingAcc } from './accommodation'
import { AccFinStu } from './student'


const ContentMap : Record<string, React.ReactNode> = {
    "15": <MarketingAcc />,
    "16": <AccFinAcc />,
    '21': <AccFinStaff />,
    '23': <MarketingStaff />,
    "34": <AccFinStu />,
}

export { ContentMap }
