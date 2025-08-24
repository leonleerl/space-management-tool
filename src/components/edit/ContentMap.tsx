import React from "react";

import {
  AccFinStaff,
  MarketingStaff,
  MOStaff,
  EconomicsStaff,
  DeanStaff,
} from "./staff";
import { AccFinAcc, MarketingAcc, MOAcc, EconomicsAcc } from "./accommodation";
import { AccFinStu, EconomicsStu } from "./student";

const ContentMap: Record<string, React.ReactNode> = {
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
  "34": <AccFinStu />,
};

export { ContentMap };
