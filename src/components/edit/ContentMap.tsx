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
  MOStu,
  GroundFloorCSIStu,
  GroundFloorDAStu,
  DeanStu,
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

// Student Type, Staff Position, Staff Source
import { 
  StudentType, 
  StaffPosition, 
  StaffSource 
} from "./index";

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
  "21": <MOStaff />,
  "22": <EconomicsStaff />,
  "23": <MarketingStaff />,
  "24": <AccFinStaff />,
  "25": <DeanStaff />,

  // Student List
  "31": <GroundFloorCSIStu />,
  "32": <GroundFloorDAStu />,
  "33": <MOStu />,
  "34": <EconomicsStu />,
  "35": <MarketingStu />,
  "36": <AccFinStu />,
  "37": <DeanStu />,

  // Room Management
  "41": <GroundFloorCSIRoom />,
  "42": <GroundFloorDARoom />,
  "43": <MORoom />,
  "44": <EconomicsRoom />,
  "45": <MarketingRoom />,
  "46": <AccFinRoom />,
  "47": <DeanRoom />,

  // Student Type
  "51": <StudentType />,

  // Staff Position
  "61": <StaffPosition />,

  // Staff Source
  "71": <StaffSource />,
};

export { ContentMap };