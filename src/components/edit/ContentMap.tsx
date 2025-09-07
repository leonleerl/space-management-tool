import React from "react";

// Staff
import {
  AccFinStaff,
  MarketingStaff,
  MOStaff,
  EconomicsStaff,
  DeanStaff,
} from "./staff";

// Accommodation
import {
  AccFinAcc,
  MarketingAcc,
  MOAcc,
  EconomicsAcc,
  GroundFloorCSI,
  GroundFloorDA,
  DeanAcc,
} from "./accommodation";

// Student
import {
  AccFinStu,
  EconomicsStu,
  MarketingStu,
  GroundFloorStu,
  MOStu,
} from "./student";

// Room
import {
  DeanRoom,
  AccFinRoom,
  EconomicsRoom,
  MarketingRoom,
  MORoom,
  GroundFloorDARoom,
  GroundFloorCSIRoom,
} from "./room";

const ContentMap: Record<string, React.ReactNode> = {
  // Accommodation Map
  "11": <GroundFloorCSI />,
  "12": <GroundFloorDA />,
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
  "31": <MOStu />,
  "32": <EconomicsStu />,
  "33": <MarketingStu />,
  "34": <AccFinStu />,
  "35": <GroundFloorStu />,

  // Room Management
  "41": <GroundFloorCSIRoom />,
  "42": <GroundFloorDARoom />,
  "43": <MORoom />,
  "44": <EconomicsRoom />,
  "45": <MarketingRoom />,
  "46": <AccFinRoom />,
  "47": <DeanRoom />,
};

export { ContentMap };
