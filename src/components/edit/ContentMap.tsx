import React from 'react'

import { AccFinStaff, MarketingStaff, MOStaff } from './staff'
import { AccFinAcc, MarketingAcc, MOAcc } from './accommodation'
import { AccFinStu } from './student'


const ContentMap : Record<string, React.ReactNode> = {
    "13": <MOAcc />,
    "15": <MarketingAcc />,
    "16": <AccFinAcc />,
    '21': <AccFinStaff />,
    '23': <MarketingStaff />,
    '24': <MOStaff />,
    "34": <AccFinStu />,
}

export { ContentMap }
