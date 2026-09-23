import { Service, signal } from "@angular/core";

import { StudyWeek } from "./curriculum";

const storageKey = "django-study-tracker.v1";

export interface AddedTask {
  id: string;
  weekId: string;
  title: string;
}

export interface SavedPlan {
  version: 1;
  doneIds: string[];
  notes: Record<string, string>;
  titles: Record<string, string>;
  removedIds: string[];
  added: AddedTask[];
  order: Record<string, string[]>;
}

export interface DisplayTask {
  id: string;
  title: string;
  done: boolean;
  note: string;
}

function emptyPlan(): SavedPlan {
  return {
    version: 1,
    doneIds: [],
    notes: {},
    titles: {},
    removedIds: [],
    added: [],
    order: {},
  };
}

function isSavedPlan(value: unknown): value is SavedPlan {
  if (!value || typeof value !== "object") {
    return false;
  }
  const plan = value as Partial<SavedPlan>;
  return (
    plan.version === 1 &&
    Array.isArray(plan.doneIds) &&
    !!plan.notes &&
    typeof plan.notes === "object" &&
    !!plan.titles &&
    typeof plan.titles === "object" &&
    Array.isArray(plan.removedIds) &&
    Array.isArray(plan.added) &&
    !!plan.order &&
    typeof plan.order === "object"
  );
}

function readPlan(): SavedPlan {
  if (typeof localStorage === "undefined") {
    return emptyPlan();
  }
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return emptyPlan();
    }
    const parsed: unknown = JSON.parse(raw);
    return isSavedPlan(parsed) ? parsed : emptyPlan();
  } catch {
    return emptyPlan();
  }
}

@Service()
export class StudyProgress {
  private readonly state = signal<SavedPlan>(readPlan());

  snapshot(): SavedPlan {
    return this.state();
  }

  tasksFor(week: StudyWeek): DisplayTask[] {
    const saved = this.state();
    const seedIds = week.tasks
      .map((task) => task.id)
      .filter((id) => !saved.removedIds.includes(id));
    const addedIds = saved.added
      .filter((task) => task.weekId === week.id)
      .map((task) => task.id);
    const known = new Set([...seedIds, ...addedIds]);
    const ordered = (saved.order[week.id] ?? []).filter((id) => known.has(id));
    const ids = [
      ...ordered,
      ...[...seedIds, ...addedIds].filter((id) => !ordered.includes(id)),
    ];

    return ids.map((id) => {
      const seed = week.tasks.find((task) => task.id === id);
      const added = saved.added.find((task) => task.id === id);
      return {
        id,
        title: saved.titles[id] ?? seed?.title ?? added?.title ?? "",
        done: saved.doneIds.includes(id),
        note: saved.notes[id] ?? "",
      };
    });
  }

  isWeekComplete(week: StudyWeek): boolean {
    const tasks = this.tasksFor(week);
    return tasks.length > 0 && tasks.every((task) => task.done);
  }

  setDone(id: string, done: boolean): void {
    const saved = this.state();
    const doneIds = done
      ? [...new Set([...saved.doneIds, id])]
      : saved.doneIds.filter((doneId) => doneId !== id);
    this.write({ ...saved, doneIds });
  }

  setWeekDone(week: StudyWeek, done: boolean): void {
    const ids = this.tasksFor(week).map((task) => task.id);
    const saved = this.state();
    const remaining = saved.doneIds.filter((id) => !ids.includes(id));
    this.write({
      ...saved,
      doneIds: done ? [...remaining, ...ids] : remaining,
    });
  }

  setNote(id: string, note: string): void {
    const saved = this.state();
    const notes = { ...saved.notes };
    if (note) {
      notes[id] = note;
    } else {
      delete notes[id];
    }
    this.write({ ...saved, notes });
  }

  rename(id: string, title: string): void {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    const saved = this.state();
    this.write({ ...saved, titles: { ...saved.titles, [id]: trimmed } });
  }

  addTask(week: StudyWeek, title: string): void {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    const saved = this.state();
    const id = `custom-${crypto.randomUUID()}`;
    const ids = this.tasksFor(week).map((task) => task.id);
    this.write({
      ...saved,
      added: [...saved.added, { id, weekId: week.id, title: trimmed }],
      order: { ...saved.order, [week.id]: [...ids, id] },
    });
  }

  removeTask(week: StudyWeek, id: string): void {
    const saved = this.state();
    const notes = { ...saved.notes };
    const titles = { ...saved.titles };
    delete notes[id];
    delete titles[id];
    const isAdded = saved.added.some((task) => task.id === id);
    this.write({
      ...saved,
      notes,
      titles,
      added: saved.added.filter((task) => task.id !== id),
      removedIds: isAdded ? saved.removedIds : [...saved.removedIds, id],
      doneIds: saved.doneIds.filter((doneId) => doneId !== id),
      order: {
        ...saved.order,
        [week.id]: this.tasksFor(week)
          .map((task) => task.id)
          .filter((taskId) => taskId !== id),
      },
    });
  }

  moveTask(week: StudyWeek, id: string, direction: -1 | 1): void {
    const ids = this.tasksFor(week).map((task) => task.id);
    const index = ids.indexOf(id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= ids.length) {
      return;
    }
    const next = [...ids];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    this.write({
      ...this.state(),
      order: { ...this.state().order, [week.id]: next },
    });
  }

  replace(plan: SavedPlan): void {
    this.write(plan);
  }

  private write(plan: SavedPlan): void {
    this.state.set(plan);
    if (typeof localStorage === "undefined") {
      return;
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(plan));
    } catch {
      // The change stays in memory when storage is blocked.
    }
  }
}

export function parseSavedPlan(raw: string): SavedPlan | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    return isSavedPlan(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
