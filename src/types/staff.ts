import { RoomDto, RoomEntity } from "./room";

export interface StaffEntity{
    id: number;
    firstName: string;
    middleName?: string;
    lastName: string;
    position: string;
    extNo: string;
    source: string;
    room: RoomEntity;
    staffCategory: StaffCategoryEntity;
}

export interface StaffCategoryEntity {
    id: number;
    name: string;
}

export interface StaffDto {
    id: number;
    fullName: string;
    position: string;
    extNo: string;
    source: string;
    room: RoomDto;
    staffCategory: StaffCategoryDto;
}

export interface StaffCategoryDto {
    id: number;
    name: string;
}