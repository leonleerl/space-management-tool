import { RoomDto, RoomEntity } from "./room";

export interface ContactEntity {
    id: number;
    firstName: string;
    middleName?: string;
    lastName: string;
    position: string;
    extNo: string;
    source: string;
    room: RoomEntity;
    contactCategory: ContactCategoryEntity;
}

export interface ContactCategoryEntity {
    id: number;
    name: string;
}

export interface ContactDto {
    id: number;
    fullName: string;
    position: string;
    extNo: string;
    source: string;
    room: RoomDto;
    contactCategory: ContactCategoryDto;
}

export interface ContactCategoryDto {
    id: number;
    name: string;
}