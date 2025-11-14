import type { occupation } from "./appData";
import type { Tstatus, TpropertyType } from "./enums";

export interface listing {
  id: string;
  landlord_ID: {
    id: string
    first_name: string;
    last_name: string;
    profile_pic: string;
  };
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
}

export interface tenant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  occupation: occupation;
  profile_pic: string;
}