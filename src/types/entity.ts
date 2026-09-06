export type EntityType =
  | 'person'
  | 'vehicle'
  | 'phone'
  | 'social'
  | 'organization'
  | 'location'
  | 'device'
  | 'document'
  | 'account'
  | 'incident';

export type EntityStatus = 'active' | 'inactive' | 'unknown';

export interface BaseEntity {
  id: string;
  caseIds: string[];
  type: EntityType;
  name: string;
  label?: string;
  status?: EntityStatus;
  confidence?: number;
  riskLevel?: 'critical' | 'high' | 'medium' | 'low' | 'unknown';
  metadata: Record<string, unknown>;
  sourceIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PersonEntity extends BaseEntity {
  type: 'person';
  metadata: {
    dateOfBirth?: string;
    aliases?: string[];
    nationality?: string;
    occupation?: string;
    phoneIds?: string[];
    socialProfileIds?: string[];
    locationIds?: string[];
    organizationIds?: string[];
    vehicleIds?: string[];
    accountIds?: string[];
    deviceIds?: string[];
    imageUrl?: string;
    identityConfidence?: number;
    address?: string;
    gender?: string;
    idNumber?: string;
  };
}

export interface VehicleEntity extends BaseEntity {
  type: 'vehicle';
  metadata: {
    registrationNumber: string;
    make?: string;
    model?: string;
    color?: string;
    ownerId?: string;
    lastSeenLocationId?: string;
  };
}

export interface PhoneEntity extends BaseEntity {
  type: 'phone';
  metadata: {
    number: string;
    carrier?: string;
    ownerId?: string;
    imei?: string;
  };
}

export interface OrganizationEntity extends BaseEntity {
  type: 'organization';
  metadata: {
    sector?: string;
    registrationId?: string;
    address?: string;
    memberIds?: string[];
  };
}

export interface LocationEntity extends BaseEntity {
  type: 'location';
  metadata: {
    address?: string;
    city?: string;
    coordinates: { lat: number; lng: number };
    category?: string;
  };
}

export interface DeviceEntity extends BaseEntity {
  type: 'device';
  metadata: {
    deviceType?: string;
    serialNumber?: string;
    ownerId?: string;
    os?: string;
  };
}

export interface DocumentEntity extends BaseEntity {
  type: 'document';
  metadata: {
    fileName: string;
    fileType: string;
    pages?: number;
    uploadedAt?: string;
    tags?: string[];
  };
}

export interface AccountEntity extends BaseEntity {
  type: 'account';
  metadata: {
    accountNumber: string;
    bankName?: string;
    ifsc?: string;
    ownerId?: string;
    balance?: number;
  };
}

export interface IncidentEntity extends BaseEntity {
  type: 'incident';
  metadata: {
    incidentType?: string;
    locationId?: string;
    severity?: string;
  };
}

export type Entity =
  | PersonEntity
  | VehicleEntity
  | PhoneEntity
  | OrganizationEntity
  | LocationEntity
  | DeviceEntity
  | DocumentEntity
  | AccountEntity
  | IncidentEntity;
