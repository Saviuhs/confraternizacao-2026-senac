import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { transportSchema } from "./transport-schema";

const responseId = "550e8400-e29b-41d4-a716-446655440000";
describe("transport poll requirements", () => {
  it("Sim requires a name", () => {
    assert.equal(transportSchema.safeParse({ responseId, needsTransport: true, participantName: "" }).success, false);
    assert.equal(transportSchema.safeParse({ responseId, needsTransport: true, participantName: "Maria Silva" }).success, true);
  });
  it("Não can be submitted without a name", () => {
    const parsed = transportSchema.parse({ responseId, needsTransport: false, participantName: null });
    assert.equal(parsed.participantName, null);
  });
});