import { DepartmentDto, DepartmentEntity } from "./department";
import { RoomDto, RoomEntity } from "./room";
import { StudentTypeDto, StudentTypeEntity } from "./studentType";

export interface StudentEntity {
    id: number;
    comment: string | null;
    department: DepartmentEntity | null;
    endDate: Date | null;
    extNo: string | null;
    firstName: string;
    lastName: string;
    middleName: string | null;
    podNo: string | null;
    room: RoomEntity | null;
    type: StudentTypeEntity | null;
}

export interface StudentDto {
    id: number;
    comment: string | null;
    department: DepartmentDto | null;
    endDate: Date | null;
    extNo: string | null;
    fullName: string | null;
    podNo: string | null;
    room: RoomDto | null;   
    type: StudentTypeDto | null;
}