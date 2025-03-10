/**
 * Datastore holding patient admissions.
 * This has already been implemented for you.
 * You DO NOT need to modify this file.
 */

export interface PatientAdmission {
  admissionId: number;
  patientName: string;
  patientAge: number;
  checkinTime: number;
  checkoutTime: number | null;
}

export interface ErrorObject {
  error: string;
}

export type EmptyObject = Record<never, never>;

interface DataStore {
  admissions: PatientAdmission[];
  // This number will increase when an admission is created,
  // and is not affected by admission deletions
  numAdmissionsCreated: number;
}

const dataStore: DataStore = {
  admissions: [],
  numAdmissionsCreated: 0,
};

export const getData = (): DataStore => dataStore;
