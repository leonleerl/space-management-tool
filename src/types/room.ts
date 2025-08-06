
export interface RoomDto {
    id: number;
    roomNo: string;
    keyLocker: string;
    roomCategory: RoomCategoryDto;
}

export interface RoomCategoryDto {
    id: number;
    name: string;
}

export interface RoomEntity {
    id: number;
    roomNo: string;
    keyLocker: string;
    roomCategory: RoomCategoryEntity;
}

export interface RoomCategoryEntity {
    id: number;
    name: string;
}
