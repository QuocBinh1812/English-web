import { describe, expect, it } from "vitest";
import { addDays, lastNDays, toDateKey, weekdayIndex } from "./dates";
import { computeStreak } from "./streak";

describe("dates", () => {
  it("uses the app timezone for the calendar day", () => {
    // 2026-11-15 18:30 UTC is already 2026-11-16 01:30 in Vietnam
    expect(toDateKey("2026-11-15T18:30:00Z", "Asia/Ho_Chi_Minh")).toBe("2026-11-16");
    expect(toDateKey("2026-11-15T18:30:00Z", "UTC")).toBe("2026-11-15");
  });

  it("adds days across month and year boundaries", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("lists the last n days oldest first", () => {
    expect(lastNDays("2026-11-16", 3)).toEqual(["2026-11-14", "2026-11-15", "2026-11-16"]);
  });

  it("indexes weekdays from Monday", () => {
    expect(weekdayIndex("2026-11-16")).toBe(0); // Monday
    expect(weekdayIndex("2026-11-22")).toBe(6); // Sunday
  });
});

describe("computeStreak", () => {
  const today = "2026-11-16";

  it("is zero without activity", () => {
    expect(computeStreak([], today)).toEqual({ current: 0, longest: 0 });
  });

  it("counts consecutive days ending today", () => {
    expect(computeStreak(["2026-11-14", "2026-11-15", "2026-11-16"], today).current).toBe(3);
  });

  it("keeps yesterday's streak alive until today ends", () => {
    expect(computeStreak(["2026-11-14", "2026-11-15"], today).current).toBe(2);
  });

  it("breaks after a missed day", () => {
    expect(computeStreak(["2026-11-13", "2026-11-14"], today).current).toBe(0);
  });

  it("tracks the longest run independently", () => {
    const days = ["2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04", "2026-11-16"];
    expect(computeStreak(days, today)).toEqual({ current: 1, longest: 4 });
  });

  it("ignores duplicate days", () => {
    expect(computeStreak(["2026-11-16", "2026-11-16"], today)).toEqual({ current: 1, longest: 1 });
  });
});
