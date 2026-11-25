import {
  completedDerivationsService,
  type CreateCompletedDerivation,
} from '@/entities/derivation';
import { ensureAuthToken } from '@/shared/api';
import {
  createDraftStore,
  createOutbox,
  type OutboxEntry,
} from '@/shared/lib/offline';

export const reportDrafts = createDraftStore<CreateCompletedDerivation>(
  'derivation-report-drafts'
);

export const sendQueuedReport = async (
  entry: OutboxEntry<CreateCompletedDerivation>
) => {
  await ensureAuthToken();
  await completedDerivationsService.createCompletedDerivation({
    ...entry.payload,
    requestedDerivationId: entry.targetId,
    clientSubmissionId: entry.id,
  });
  await reportDrafts.clear(entry.ownerId, entry.targetId);
};

export const reportOutbox = createOutbox<CreateCompletedDerivation>({
  name: 'derivation-report-outbox',
  send: sendQueuedReport,
});
