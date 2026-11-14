import { describe, expect, it } from "bun:test";
import { pushHistorySnapshot, redoHistory, undoHistory } from "./design-history";

describe("design history", () => {
  it("restores the previous design and redoes it", () => {
    const undone = undoHistory("blue hoodie", ["black hoodie"], [], 50);

    expect(undone).toEqual({
      current: "black hoodie",
      undo: [],
      redo: ["blue hoodie"],
    });
    expect(undone && redoHistory(undone.current, undone.undo, undone.redo, 50)).toEqual({
      current: "blue hoodie",
      undo: ["black hoodie"],
      redo: [],
    });
  });

  it("clears redo when a new edit is made after undo", () => {
    const undone = undoHistory("blue hoodie", ["black hoodie"], [], 50);
    expect(undone).not.toBeNull();

    const redoAfterNewEdit: string[] = [];
    expect(redoHistory("red hoodie", undone?.undo ?? [], redoAfterNewEdit, 50)).toBeNull();
  });

  it("keeps only the newest 50 undo snapshots", () => {
    const snapshots = Array.from({ length: 51 }, (_, index) => index);
    expect(pushHistorySnapshot(snapshots.slice(0, 50), snapshots[50], 50)).toHaveLength(50);
    expect(pushHistorySnapshot(snapshots.slice(0, 50), snapshots[50], 50)[0]).toBe(1);
  });
});