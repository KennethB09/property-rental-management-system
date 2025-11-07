import type { TpropertyType, Tstatus } from "./enums";

export type TProperty = {
    id: string;
    landlord_Id: string;
    name: string;
    description: string;
    rent: string;
    status: Tstatus;
    address: string;
    latitude: number;
    longitude: number;
    pictures: string[];
    thumbnail: string;
    propertyType: TpropertyType;
    createdAt: string;
    updatedAt: string;
}

export type TOccupied_rooms = {
    id: string;
    room_Id: string;
    tenant_Id: string;
    createdAt: string;
}