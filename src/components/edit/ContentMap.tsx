import React from "react";
import {
  AccFinStaff,
  MarketingStaff,
  MOStaff,
  EconomicsStaff,
  DeanStaff,
} from "./staff";
import {
  AccFinAcc,
  MarketingAcc,
  MOAcc,
  EconomicsAcc,
  DeanAcc,
} from "./accommodation";
import { AccFinStu, EconomicsStu, MarketingStu } from "./student";

const ContentMap: Record<string, React.ReactNode> = {
  // Accommodation Map
  "13": <MOAcc />,
  "14": <EconomicsAcc />,
  "15": <MarketingAcc />,
  "16": <AccFinAcc />,
  "17": <DeanAcc />,

  // Staff List
  "21": <AccFinStaff />,
  "22": <EconomicsStaff />,
  "23": <MarketingStaff />,
  "24": <MOStaff />,
  "25": <DeanStaff />,

  // Student List
  "32": <EconomicsStu />,
  "33": <MarketingStu />,
  "34": <AccFinStu />,
};

export { ContentMap };
