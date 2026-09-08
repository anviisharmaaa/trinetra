import type { PersonEntity } from '../../types';
import { mockPersons } from '../../data';
import { mockDelay } from '../../utils/mockDelay';

// Repository boundary: UI/services never import mock arrays directly.
// Swapping this file for an ApiPersonRepository is the only change
// needed when the backend arrives (see services/personService equivalent
// logic folded into entityService.ts).
export interface PersonRepository {
  getPerson(id: string): Promise<PersonEntity | undefined>;
  searchPersons(query: string, caseId?: string): Promise<PersonEntity[]>;
  listByCase(caseId: string): Promise<PersonEntity[]>;
}

export const mockPersonRepository: PersonRepository = {
  async getPerson(id) {
    await mockDelay(300);
    return mockPersons.find((p) => p.id === id);
  },
  async searchPersons(query, caseId) {
    await mockDelay(500);
    const q = query.toLowerCase();
    return mockPersons.filter((p) => {
      const matchesCase = !caseId || p.caseIds.includes(caseId);
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.metadata.aliases ?? []).some((a) => a.toLowerCase().includes(q));
      return matchesCase && matchesQuery;
    });
  },
  async listByCase(caseId) {
    await mockDelay(300);
    return mockPersons.filter((p) => p.caseIds.includes(caseId));
  },
};
