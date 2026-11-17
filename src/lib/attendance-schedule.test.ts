import { describe, it as test } from "node:test";
import assert from "node:assert/strict";
import { isAttendanceClosed } from "./attendance-schedule";
describe("prazo de confirmação", () => {
  test("aberto em 27/11/2026 às 23h59 de Brasília", () => {
    assert.equal(isAttendanceClosed(Date.parse("2026-11-28T02:59:00Z")), false);
  });
  test("fechado a partir de 28/11/2026 00h00 de Brasília", () => {
    assert.equal(isAttendanceClosed(Date.parse("2026-11-28T03:00:00Z")), true);
  });
});
