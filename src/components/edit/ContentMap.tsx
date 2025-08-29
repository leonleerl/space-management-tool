import React from "react";
import { AccFinStaff, MarketingStaff, MOStaff, EconomicsStaff, DeanStaff, MgmtStaff} from "./staff";
import { AccFinAcc, MarketingAcc, MOAcc, EconomicsAcc } from "./accommodation";
import { AccFinStu, EconomicsStu, MarketingStu } from './student'

const ContentMap: Record<string, React.ReactNode> = {
  // Accommodation Map
  "13": <MOAcc />,
  "14": <EconomicsAcc />,
  "15": <MarketingAcc />,
  "16": <AccFinAcc />,
  
  // Staff List
  "21": <AccFinStaff />,
  "22": <EconomicsStaff />,
  "23": <MarketingStaff />,
  "24": <MOStaff />,
  "25": <DeanStaff />, 
  
  // Student List
  "31": <MOStu />,
  "32": <EconomicsStu />,
  "33": <MarketingStu />,
  "34": <AccFinStu />,
};

export { ContentMap };