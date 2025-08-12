
export interface RoomDto {
    id: number;
    roomNo: string;
    keyLocker: string | null;
    roomLocation?: RoomLocationDto | null;
}

export interface RoomLocationDto {
    id: number;
    name: string;
}

export interface RoomEntity {
    id: number;
    roomNo: string;
    keyLocker: string | null;
    roomLocation?: RoomLocationEntity | null;
}

export interface RoomLocationEntity {
    id: number;
    name: string;
}
