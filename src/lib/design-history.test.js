import { describe, expect, it } from "bun:test";
import { clearRedoHistory, pushHistorySnapshot, redoHistory, undoHistory } from "./design-history";

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

  it("undoes and redoes a hoodie fit selection", () => {
    const changed = "Regular";
    const previous = "Oversized";
    const undone = undoHistory(changed, [previous], [], 50);

    expect(undone?.current).toBe("Oversized");
    expect(undone && redoHistory(undone.current, undone.undo, undone.redo, 50)?.current).toBe(
      "Regular",
    );
  });

  it("clears redo when a new edit is made after undo", () => {
    const undone = undoHistory("blue hoodie", ["black hoodie"], [], 50);
    expect(undone).not.toBeNull();
    expect(clearRedoHistory(undone.redo)).toEqual([]);
  });

  it("keeps only the newest 50 undo snapshots", () => {
    const snapshots = Array.from({ length: 51 }, (_, index) => index);
    const capped = pushHistorySnapshot(snapshots.slice(0, 50), snapshots[50], 50);

    expect(capped).toHaveLength(50);
    expect(capped[0]).toBe(1);
    expect(capped[49]).toBe(50);
  });
});