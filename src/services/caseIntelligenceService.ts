import { caseService, type CasePersonIds } from './caseService';
import { personService, type PersonRecordResource, type PersonRecordRow } from './personService';

export type { CasePersonIds };

export async function getCasePersonIds(caseId: string): Promise<CasePersonIds> {
  return caseService.getCasePersonIds(caseId);
}

export async function getCasePersonRecords(caseId: string, resource: PersonRecordResource): Promise<Array<PersonRecordRow & { personId: string }>> {
  const { allPersonIds } = await getCasePersonIds(caseId);
  return personService.getRecordsForPeople(allPersonIds, resource);
}
