import { RoomDto, RoomEntity } from "./room";

export interface StaffEntity{
    id: number;
    firstName: string;
    middleName: string | null;
    lastName: string;
    position: string | null;
    extNo: string | null;
    source: string | null;
    room: RoomEntity | null;
    department: DepartmentEntity | null;
}

export interface DepartmentEntity {
    id: number;
    name: string;
}

export interface StaffDto {
    id: number;
    fullName: string;
    position: string | null;
    extNo: string | null;
    source: string | null;
    room: RoomDto | null;
    department: DepartmentDto | null;
}

export interface DepartmentDto {
    id: number;
    name: string;
}