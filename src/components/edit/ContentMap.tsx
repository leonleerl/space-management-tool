import React from "react";
import {
  AccFinStaff,
  MarketingStaff,
  MOStaff,
  EconomicsStaff,
  DeanStaff,
} from "./staff";
import { AccFinAcc, MarketingAcc, MOAcc, EconomicsAcc, GroundFloorCSI, GroundFloorDA } from "./accommodation";
import { AccFinStu, EconomicsStu, MarketingStu, GroundFloorStu } from './student'


const ContentMap: Record<string, React.ReactNode> = {
  "11": <GroundFloorCSI />,
  "12": <GroundFloorDA />,
  "13": <MOAcc />,
  "14": <EconomicsAcc />,
  "15": <MarketingAcc />,
  "16": <AccFinAcc />,
  "21": <AccFinStaff />,
  "22": <EconomicsStaff />,
  "23": <MarketingStaff />,
  "24": <MOStaff />,
  "25": <DeanStaff />, 
  "32": <EconomicsStu />,
  "33": <MarketingStu />,
  "34": <AccFinStu />,
  "35": <GroundFloorStu />,
};
export { ContentMap };