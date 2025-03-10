/**
 * The backend implementation below has already been completed for you.
 * You DO NOT need to make any modifications to the code below.
 */

import { EmptyObject, ErrorObject, PatientAdmission, getData } from './dataStore';

const generateTimestamp = () => Math.floor(Date.now() / 1000);

export const clear = (): EmptyObject => {
  const data = getData();
  data.admissions = [];
  data.numAdmissionsCreated = 0;
  return {};
};

export const checkinPatientAdmission = (patientName: string, patientAge: number): { admissionId: number } | ErrorObject => {
  const data = getData();
  if (!patientName) {
    return { error: 'Patient name not given' };
  }
  if (!(patientAge >= 0)) {
    return { error: 'Age must be 0 or greater.' };
  }

  const admissionId = ++data.numAdmissionsCreated;
  const admission: PatientAdmission = {
    admissionId,
    patientName,
    patientAge,
    checkinTime: generateTimestamp(),
    checkoutTime: null,
  };
  data.admissions.push(admission);
  return { admissionId };
};

export const listPatientAdmissions = (maxAge: number): { admissions: PatientAdmission[] } | ErrorObject => {
  if (!(maxAge >= 0)) {
    return { error: 'Max age must be 0 or greater' };
  }
  const admissions = getData().admissions.filter((e) => e.patientAge <= maxAge);
  return { admissions };
};

export const checkoutPatientAdmission = (admissionId: number): EmptyObject | ErrorObject => {
  const data = getData();
  const admission = data.admissions.find((e) => e.admissionId === admissionId);
  if (!admission) {
    return { error: `No such admission with id: ${admissionId}` };
  }
  if (admission.checkoutTime) {
    return { error: `You have already checked out from the admission with id: ${admissionId}` };
  }
  admission.checkoutTime = generateTimestamp();
  return {};
};

export const updatePatientAdmission = (admissionId: number, patientName: string, patientAge: number): EmptyObject | ErrorObject => {
  if (!patientName) {
    return { error: 'New patient name must be given' };
  }
  if (!(patientAge >= 0)) {
    return { error: 'New age must be 0 or greater.' };
  }

  const data = getData();
  const admission = data.admissions.find((e) => e.admissionId === admissionId);
  if (!admission) {
    return { error: `No such patient with id: ${admissionId}` };
  }
  admission.patientName = patientName;
  admission.patientAge = patientAge;
  return {};
};

export const deletePatientAdmission = (admissionId: number): EmptyObject | ErrorObject => {
  const data = getData();
  let hasAdmissionToDelete = false;
  data.admissions = data.admissions.filter((e) => {
    if (e.admissionId === admissionId) {
      hasAdmissionToDelete = true;
      return false;
    }
    return true;
  });

  if (!hasAdmissionToDelete) {
    return { error: `No such admission with id: ${admissionId}` };
  }
  return {};
};
