/**
 * FILE: battle-service.ts
 * LOCATION: src/lib/server/services/battle-service.ts
 * PURPOSE: Backend battle orchestration. The current REST-first flow stores a
 *          queue ticket today and leaves one stable service boundary for future
 *          Redis-backed matchmaking and WebSocket battle room creation.
 * USED BY: src/app/api/battle/matchmaking/route.ts
 * DEPENDENCIES: platform store, shared validation types
 * LAST UPDATED: 2026-05-12
 */

import { getPlatformRepository } from "@/lib/server/repositories/get-platform-repository";
import type { BattleMatchmakingInput } from "@/lib/validation/auth";

export interface QueuedBattleMatch {
  ticketId: string;
  category: string;
  status: "queued";
  estimatedWaitSeconds: number;
  opponentPool: string;
}

/** Creates the current matchmaking ticket response returned to the client. */
export async function queueBattleMatch(
  userId: string,
  input: BattleMatchmakingInput,
): Promise<QueuedBattleMatch> {
  const repository = getPlatformRepository();
  const ticketId = await repository.battles.createMatchmakingTicket(userId, input.category);

  return {
    ticketId,
    category: input.category,
    status: "queued",
    estimatedWaitSeconds: 18,
    opponentPool: "same-track-similar-level",
  };
}
