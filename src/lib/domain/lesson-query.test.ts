import { describe, expect, it } from "vitest";
import { LESSONS } from "@/lib/data/mock/seed-content";
import {
  applyLessonQuery,
  normalizeSearch,
  parseLessonQuery,
  serializeLessonQuery,
  type LessonQuery,
} from "./lesson-query";

const base: LessonQuery = parseLessonQuery(new URLSearchParams());

describe("parseLessonQuery", () => {
  it("applies defaults", () => {
    expect(base).toEqual({
      q: "",
      levels: [],
      topic: undefined,
      difficulty: undefined,
      method: undefined,
      sort: "popular",
      page: 1,
      pageSize: 12,
    });
  });

  it("parses valid values and drops invalid ones", () => {
    const q = parseLessonQuery(
      new URLSearchParams("q= coffee &level=b1,A2,Z9,B1&topic=travel&difficulty=insane&method=dictation&sort=newest&page=0"),
    );
    expect(q.q).toBe("coffee");
    expect(q.levels).toEqual(["A2", "B1"]);
    expect(q.topic).toBe("travel");
    expect(q.difficulty).toBeUndefined();
    expect(q.method).toBe("dictation");
    expect(q.sort).toBe("newest");
    expect(q.page).toBe(1);
  });

  it("round-trips through serialize", () => {
    const q: LessonQuery = { ...base, q: "sleep", levels: ["B1", "B2"], topic: "science", sort: "shortest" };
    expect(parseLessonQuery(serializeLessonQuery(q))).toEqual(q);
    expect(serializeLessonQuery({ ...q, levels: ["B2", "B1"] }).toString()).toBe(
      serializeLessonQuery(q).toString(),
    );
    expect(serializeLessonQuery(q).toString()).toBe("q=sleep&level=B1%2CB2&topic=science&sort=shortest");
  });
});

describe("normalizeSearch", () => {
  it("strips Vietnamese diacritics", () => {
    expect(normalizeSearch("Cà Phê Đá")).toBe("ca phe da");
  });
});

describe("applyLessonQuery", () => {
  it("filters by level, topic and method together", () => {
    const { items } = applyLessonQuery(LESSONS, {
      ...base,
      levels: ["B1"],
      topic: "science",
      method: "shadowing",
      pageSize: 48,
    });
    expect(items.length).toBeGreaterThan(0);
    for (const l of items) {
      expect(l.level).toBe("B1");
      expect(l.topicSlugs).toContain("science");
      expect(l.methods).toContain("shadowing");
    }
  });

  it("matches every search term, accent-insensitive", () => {
    const { items } = applyLessonQuery(LESSONS, { ...base, q: "COFFEE local" });
    expect(items.map((l) => l.slug)).toEqual(["ordering-coffee"]);
    const vn = applyLessonQuery(LESSONS, { ...base, q: "ca phe" });
    expect(vn.items.map((l) => l.slug)).toContain("ordering-coffee");
  });

  it("sorts and paginates", () => {
    const all = applyLessonQuery(LESSONS, { ...base, sort: "shortest", pageSize: 48 }).items;
    for (let i = 1; i < all.length; i++) {
      expect(all[i].durationSec).toBeGreaterThanOrEqual(all[i - 1].durationSec);
    }
    const page2 = applyLessonQuery(LESSONS, { ...base, sort: "shortest", page: 2, pageSize: 5 });
    expect(page2.items).toEqual(all.slice(5, 10));
    expect(page2.total).toBe(LESSONS.length);
  });
});
