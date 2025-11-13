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
  occupant: number;
  images: string[];
  thumbnail: string;
  property_type: TpropertyType;
  created_at: string;
  updated_at: string;
};

export type Toccupied_rooms = {
  id: string;
  room_Id: string;
  tenant_Id: string;
  createdAt: string;
};

export type propertiesCount = {
  unlisted: number;
  available: number;
  occupied: number;
  total: number;
};

export type tenantSaves = {
  id: string;
  tenant_ID: string;
  listing_ID: string;
  created_at: string;
}