export const REACTION_KINDS = ["heart", "pray", "amen"] as const;
export type ReactionKind = (typeof REACTION_KINDS)[number];
export type ReactionCounts = Record<ReactionKind, number>;
