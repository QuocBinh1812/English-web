import { describe, expect, it } from "vitest";
import { generateStudySessions } from "@/lib/data/mock/seed-activity";
import { LESSONS, MOCK_USER } from "@/lib/data/mock/seed-content";
import type { Lesson, StudySession } from "@/types/domain";
import { buildDashboard, lessonProgress } from "./progress";

const TZ = "Asia/Ho_Chi_Minh";
const NOW = new Date("2026-11-16T05:00:00Z"); // 12:00 in Vietnam

const lesson: Lesson = { ...LESSONS[0], methods: ["dictation", "shadowing"], segmentCount: 10 };

function session(partial: Partial<StudySession>): StudySession {
  return {
    id: crypto.randomUUID(),
    userId: MOCK_USER.id,
    lessonId: lesson.id,
    method: "dictation",
    startedAt: NOW.toISOString(),
    durationSec: 300,
    segmentsCompleted: 4,
    score: 80,
    ...partial,
  };
}

describe("lessonProgress", () => {
  it("accumulates segments per method and caps at 100%", () => {
    const p = lessonProgress(lesson, [
      session({ segmentsCompleted: 6, score: 70 }),
      session({ segmentsCompleted: 6, score: 90 }),
      session({ method: "shadowing", segmentsCompleted: 3 }),
    ]);
    expect(p).toEqual([
      { method: "dictation", ratio: 1, completed: true, bestScore: 90 },
      { method: "shadowing", ratio: 0.3, completed: false, bestScore: 80 },
    ]);
  });
});

describe("buildDashboard", () => {
  it("is empty but valid for a new user", () => {
    const d = buildDashboard({ user: MOCK_USER, lessons: LESSONS, sessions: [], now: NOW, timeZone: TZ });
    expect(d.today).toEqual({ date: "2026-11-16", minutes: 0, goalMinutes: 20, segments: 0 });
    expect(d.streak.current).toBe(0);
    expect(d.weekly).toHaveLength(7);
    expect(d.continueLesson).toBeNull();
    expect(d.recommended.length).toBeGreaterThan(0);
    expect(d.skills.listening.score).toBeNull();
  });

  it("derives today, weekly split and skills from sessions", () => {
    const sessions = [
      session({ method: "dictation", durationSec: 600, score: 80 }),
      session({ method: "shadowing", durationSec: 300, score: 70 }),
      session({ startedAt: "2026-11-15T03:00:00Z", durationSec: 120, score: 60 }),
      // 20 days ago: counts for the previous skill window
      session({ startedAt: "2026-10-27T03:00:00Z", score: 50 }),
    ];
    const d = buildDashboard({ user: MOCK_USER, lessons: LESSONS, sessions, now: NOW, timeZone: TZ });
    expect(d.today.minutes).toBe(15);
    expect(d.weekly.at(-1)).toEqual({ date: "2026-11-16", listeningMinutes: 10, speakingMinutes: 5 });
    expect(d.weekly.at(-2)).toEqual({ date: "2026-11-15", listeningMinutes: 2, speakingMinutes: 0 });
    expect(d.streak.current).toBe(2);
    expect(d.skills.listening).toEqual({ score: 70, delta: 20, minutes: 12 });
    expect(d.skills.speaking.delta).toBeNull();
    expect(d.recent[0].lesson.id).toBe(lesson.id);
    expect(d.recommended.every((l) => l.id !== lesson.id)).toBe(true);
  });
});

describe("generated demo activity", () => {
  const sessions = generateStudySessions({ user: MOCK_USER, lessons: LESSONS, now: NOW, timeZone: TZ });
  const d = buildDashboard({ user: MOCK_USER, lessons: LESSONS, sessions, now: NOW, timeZone: TZ });

  it("is deterministic", () => {
    const again = generateStudySessions({ user: MOCK_USER, lessons: LESSONS, now: NOW, timeZone: TZ });
    expect(again).toEqual(sessions);
  });

  it("produces a believable dashboard", () => {
    expect(d.streak.current).toBe(9);
    expect(d.today.minutes).toBeGreaterThan(0);
    expect(d.continueLesson).not.toBeNull();
    expect(d.recommended).toHaveLength(4);
    expect(d.totals.lessonsCompleted).toBeGreaterThan(0);
    expect(sessions.every((s) => !LESSONS.find((l) => l.id === s.lessonId)?.isPro)).toBe(true);
  });
});
