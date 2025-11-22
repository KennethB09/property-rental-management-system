export type TpropertyType = {
    id: string,
    name: string
}

export type userType = "tenant" | "landlord";

export type Tstatus = "available" | "occupied" | "unlisted";

export type tenanciesStatus = "pending" | "active" | "ended" | "declined" | "cancelled";

export type tenanciesInitiatedBy = userType;