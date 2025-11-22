import type { occupation } from "./appData";
import type { Tstatus, TpropertyType, tenanciesStatus, tenanciesInitiatedBy } from "./enums";

export interface listing {
  id: string;
  landlord_ID: {
    id: string;
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

export interface landlord {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  business_name: string;
  profile_pic: string;
}

export interface conversation {
  id: string;
  listing_id: listing;
  tenant_id: tenant;
  landlord_id: landlord;
  last_msg: message;
}

export interface message {
  id: string;
  convo_id: string;
  content: string;
  sender_id: string;
  replyingTo: string | null;
  created_at: string;
}

export interface tenancies {
  id: string;
  landlord_id: string;
  tenant_id: string;
  property_id: tenancyProperty;
  status: tenanciesStatus;
  created_at: string;
  start: string;
  end: string;
  initiated_by: tenanciesInitiatedBy;
}

export interface tenancyProperty {
  id: string;
  name: string;
  thumbnail: string;
  rent: string
}