import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
} from "@angular/cdk/drag-drop";
import { Component, computed, effect, inject, input, signal } from "@angular/core";
import { RouterLink } from "@angular/router";

import {
  allWeeks,
  courseLabel,
  findWeek,
  isCalendarWeek,
  months,
  planRange,
  type CourseKind,
  type CourseLink,
} from "./curriculum";
import { StudyProgress, type DisplayTask } from "./study-progress";
import { Theme } from "./theme";

let studyBoardHasOpened = false;

function scrollWeekDetailIntoView(): void {
  if (!window.matchMedia("(max-width: 59.999rem)").matches) {
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });
}

@Component({
  selector: "app-study-board",
  imports: [RouterLink, CdkDropList, CdkDrag, CdkDragHandle],
  template: `
    @if (week(); as current) {
      <div class="shell">
        <header class="top">
          <div class="masthead">
            <p class="brand">Backend study</p>
            <p class="range">{{ planRange }}</p>
          </div>
          <div class="top-end">
            <button
              type="button"
              class="theme-switch"
              role="switch"
              [attr.aria-checked]="theme.light()"
              [attr.aria-label]="
                theme.light() ? 'Switch to dark mode' : 'Switch to light mode'
              "
              (click)="theme.toggle()"
            >
              <span class="theme-track" aria-hidden="true">
                <span class="theme-stars"></span>
                <span class="theme-knob">
                  <svg class="icon-moon" viewBox="0 0 24 24">
                    <path
                      d="M15.8 3.2a8.2 8.2 0 1 0 5.4 14.4A7.2 7.2 0 0 1 15.8 3.2z"
                    />
                  </svg>
                  <svg class="icon-sun" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3.1" />
                    <path
                      d="M12 3.1v2M12 18.9v2M3.1 12h2M18.9 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"
                    />
                  </svg>
                </span>
              </span>
            </button>
          </div>
        </header>

        <div class="layout">
          <nav class="weeks" aria-label="Weeks">
            <h2>The plan</h2>
            @for (month of months; track month.id) {
              <p class="month">{{ month.title }}</p>
              @for (item of month.weeks; track item.id) {
                <a
                  class="chip"
                  [routerLink]="['/weeks', item.id]"
                  [class.selected]="item.id === current.id"
                  [attr.aria-current]="item.id === current.id ? 'page' : null"
                >
                  <span class="chip-num">{{ item.number }}</span>
                  <span class="chip-title">{{ item.title }}</span>
                  <span class="chip-tags">
                    @for (course of item.courses; track course.kind) {
                      <span
                        class="course-tag"
                        [attr.data-course]="course.kind"
                        >{{ courseLabel[course.kind] }}</span
                      >
                    }
                  </span>
                  <span class="fraction">
                    @if (calendarWeek(item.id)) {
                      <span class="now-mark">Now </span>
                    }
                    {{ fraction(item.id) }}
                  </span>
                </a>
              }
            }
          </nav>

          <div class="main">
            @for (panel of stage(); track panel.id) {
              <section class="hero" aria-labelledby="next-task">
                <div class="hero-title">
                  <div>
                    @if (nextTask(); as task) {
                      <p class="kicker">Up next</p>
                      <h1 id="next-task">{{ task.title }}</h1>
                    } @else {
                      <p class="kicker">This week</p>
                      <h1 id="next-task">Week {{ panel.number }} is finished.</h1>
                    }
                  </div>
                  <p
                    class="score"
                    [attr.aria-label]="
                      weekState().done +
                      ' of ' +
                      weekState().total +
                      ' tasks done'
                    "
                  >
                    {{ weekState().done }}<span>/{{ weekState().total }}</span>
                  </p>
                </div>

                <p class="meta">
                  Week {{ panel.number }} · {{ panel.title }} ·
                  {{ panel.dates }}
                </p>

                @if (panel.courses.length) {
                  <p class="courses">
                    @for (course of panel.courses; track course.kind) {
                      <span class="course-line">
                        <span
                          class="course-tag"
                          [attr.data-course]="course.kind"
                          >{{ courseLabel[course.kind] }}</span
                        >
                        <a
                          [href]="course.url"
                          target="_blank"
                          rel="noopener noreferrer"
                          >{{ course.title }}</a
                        >
                      </span>
                    }
                  </p>
                }

                <div class="meter" aria-hidden="true">
                  <span [style.width.%]="percent()"></span>
                </div>

                @if (continueCourse(); as course) {
                  <a
                    class="continue"
                    [href]="course.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Continue</a
                  >
                } @else if (nextOpenWeek(); as upcoming) {
                  <a class="continue" [routerLink]="['/weeks', upcoming.id]">
                    Continue with week {{ upcoming.number }}
                  </a>
                }
              </section>
            }

            <section class="checklist" aria-labelledby="week-heading">
              <div class="week-head">
                <label class="check">
                  <input
                    type="checkbox"
                    [checked]="weekState().all"
                    [indeterminate]="weekState().some"
                    (change)="onWeekToggle($event)"
                  />
                  <span id="week-heading">Week {{ current.number }}</span>
                </label>
              </div>

              <ul class="tasks" cdkDropList (cdkDropListDropped)="drop($event)">
                @for (task of tasks(); track task.id; let index = $index) {
                  <li
                    class="task"
                    cdkDrag
                    cdkDragBoundary=".tasks"
                    [class.done]="task.done"
                    [style.animation-delay]="index * 45 + 'ms'"
                  >
                    <div class="task-top">
                      <button
                        type="button"
                        class="grip"
                        cdkDragHandle
                        aria-label="Drag to reorder"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <circle cx="9" cy="7" r="1.7" />
                          <circle cx="15" cy="7" r="1.7" />
                          <circle cx="9" cy="12" r="1.7" />
                          <circle cx="15" cy="12" r="1.7" />
                          <circle cx="9" cy="17" r="1.7" />
                          <circle cx="15" cy="17" r="1.7" />
                        </svg>
                      </button>
                      <div class="task-main">
                        <div class="check">
                          <input
                            type="checkbox"
                            [id]="'task-' + task.id"
                            [checked]="task.done"
                            (change)="onTaskToggle(task.id, $event)"
                          />
                          @if (renameTaskId() === task.id) {
                            <input
                              class="rename"
                              [value]="renameDraft()"
                              [attr.aria-label]="'Rename ' + task.title"
                              (input)="onRenameDraft($event)"
                              (keydown.enter)="saveRename(task.id)"
                              (keydown.escape)="cancelRename()"
                            />
                          } @else {
                            <label [for]="'task-' + task.id">{{
                              task.title
                            }}</label>
                          }
                        </div>

                        <div class="actions">
                          @if (task.description) {
                            <button
                              type="button"
                              class="about"
                              [attr.aria-expanded]="detailId() === task.id"
                              [attr.aria-controls]="'detail-' + task.id"
                              (click)="toggleDetail(task.id)"
                            >
                              About
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M6 9l6 6 6-6" />
                              </svg>
                            </button>
                          }
                          @if (renameTaskId() === task.id) {
                            <button
                              type="button"
                              (mousedown)="$event.preventDefault()"
                              (click)="saveRename(task.id)"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              (mousedown)="$event.preventDefault()"
                              (click)="cancelRename()"
                            >
                              Cancel
                            </button>
                          } @else {
                            <button
                              type="button"
                              (click)="openRename(task)"
                            >
                              Rename
                            </button>
                          }
                        </div>

                        @if (task.description) {
                          <div
                            class="detail"
                            [class.open]="detailId() === task.id"
                            [id]="'detail-' + task.id"
                            [attr.aria-hidden]="detailId() === task.id ? null : true"
                          >
                            <div class="detail-body">
                              <p>{{ task.description }}</p>
                            </div>
                          </div>
                        }
                      </div>

                      <div class="task-side">
                        @if (task.course) {
                          <span
                            class="course-tag"
                            [attr.data-course]="task.course"
                            >{{ courseLabel[task.course] }}</span
                          >
                        }
                        <button
                          type="button"
                          class="remove"
                          [attr.aria-label]="'Remove ' + task.title"
                          (click)="remove(task.id)"
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M4 7h16" />
                            <path d="M9 7V5h6v2" />
                            <path d="M8 7l1 13h6l1-13" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                }
              </ul>

              <form class="add" (submit)="addTask($event)">
                <div
                  class="add-courses"
                  role="radiogroup"
                  aria-label="Course for the new task"
                >
                  @for (kind of addCourses(); track kind) {
                    <label
                      class="course-tag course-pick"
                      [class.picked]="addCourse() === kind"
                      [attr.data-course]="kind"
                    >
                      <input
                        type="radio"
                        name="new-course"
                        [value]="kind"
                        [checked]="addCourse() === kind"
                        (change)="draftCourse.set(kind)"
                      />
                      {{ courseLabel[kind] }}
                    </label>
                  }
                </div>
                <label class="sr" for="new-task">Add a task</label>
                <input
                  id="new-task"
                  class="add-title"
                  name="title"
                  placeholder="Add a task for this week"
                  autocomplete="off"
                  (input)="onDraft($event)"
                />
                <button type="submit" [disabled]="!draftTitle().trim()">
                  Add
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    } @else {
      <div class="shell">
        <h1>That week is not in the plan.</h1>
        <a class="continue" routerLink="/">Back to this week</a>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class StudyBoard {
  readonly weekId = input.required<string>();

  private readonly progress = inject(StudyProgress);
  protected readonly theme = inject(Theme);

  protected readonly months = months;
  protected readonly planRange = planRange;
  protected readonly courseLabel = courseLabel;
  protected readonly detailId = signal<string | null>(null);
  protected readonly renameTaskId = signal<string | null>(null);
  protected readonly renameDraft = signal("");
  protected readonly draftTitle = signal("");
  protected readonly draftCourse = signal<CourseKind | null>(null);

  constructor() {
    effect(() => {
      const id = this.weekId();
      if (!id || typeof window === "undefined") {
        return;
      }
      const opened = studyBoardHasOpened;
      studyBoardHasOpened = true;
      if (!opened) {
        return;
      }
      scrollWeekDetailIntoView();
    });
  }

  protected readonly week = computed(() => findWeek(this.weekId()));
  protected readonly stage = computed(() => {
    const week = this.week();
    return week ? [week] : [];
  });
  protected readonly tasks = computed(() => {
    const week = this.week();
    return week ? this.progress.tasksFor(week) : [];
  });
  protected readonly nextTask = computed(() =>
    this.tasks().find((task) => !task.done),
  );
  protected readonly weekState = computed(() => {
    const tasks = this.tasks();
    const done = tasks.filter((task) => task.done).length;
    return {
      done,
      total: tasks.length,
      all: tasks.length > 0 && done === tasks.length,
      some: done > 0 && done < tasks.length,
    };
  });
  protected readonly continueCourse = computed((): CourseLink | undefined => {
    const week = this.week();
    const task = this.nextTask();
    if (!week || !task) {
      return undefined;
    }
    return (
      week.courses.find((course) => course.kind === task.course) ??
      week.courses[0]
    );
  });
  protected readonly addCourses = computed(() => {
    const week = this.week();
    return week?.courses.map((course) => course.kind) ?? [];
  });
  protected readonly addCourse = computed(() => {
    const choices = this.addCourses();
    const picked = this.draftCourse();
    if (picked && choices.includes(picked)) {
      return picked;
    }
    return choices[0];
  });
  protected readonly nextOpenWeek = computed(() => {
    const weeks = allWeeks();
    const index = weeks.findIndex((week) => week.id === this.weekId());
    return weeks
      .slice(index + 1)
      .find((week) => !this.progress.isWeekComplete(week));
  });

  protected percent(): number {
    const state = this.weekState();
    return state.total === 0 ? 0 : (state.done / state.total) * 100;
  }

  protected calendarWeek(weekId: string): boolean {
    return isCalendarWeek(weekId, new Date());
  }

  protected fraction(weekId: string): string {
    const week = findWeek(weekId);
    if (!week) {
      return "";
    }
    const tasks = this.progress.tasksFor(week);
    const done = tasks.filter((task) => task.done).length;
    return `${done}/${tasks.length}`;
  }

  protected onTaskToggle(taskId: string, event: Event): void {
    this.progress.setDone(taskId, (event.target as HTMLInputElement).checked);
  }

  protected onWeekToggle(event: Event): void {
    const week = this.week();
    if (week) {
      this.progress.setWeekDone(
        week,
        (event.target as HTMLInputElement).checked,
      );
    }
  }

  protected toggleDetail(taskId: string): void {
    this.detailId.update((current) => (current === taskId ? null : taskId));
  }

  protected openRename(task: DisplayTask): void {
    this.renameDraft.set(task.title);
    this.renameTaskId.set(task.id);
  }

  protected onRenameDraft(event: Event): void {
    this.renameDraft.set((event.target as HTMLInputElement).value);
  }

  protected saveRename(taskId: string): void {
    const title = this.renameDraft().trim();
    if (!title) {
      return;
    }
    this.progress.rename(taskId, title);
    this.renameTaskId.set(null);
  }

  protected cancelRename(): void {
    this.renameTaskId.set(null);
  }

  protected remove(taskId: string): void {
    const week = this.week();
    if (!week) {
      return;
    }
    if (this.detailId() === taskId) {
      this.detailId.set(null);
    }
    if (this.renameTaskId() === taskId) {
      this.renameTaskId.set(null);
    }
    this.progress.removeTask(week, taskId);
  }

  protected drop(event: CdkDragDrop<DisplayTask[]>): void {
    const week = this.week();
    const task = this.tasks()[event.previousIndex];
    if (!week || !task || event.previousIndex === event.currentIndex) {
      return;
    }
    this.progress.reorder(week, task.id, event.currentIndex);
  }

  protected onDraft(event: Event): void {
    this.draftTitle.set((event.target as HTMLInputElement).value);
  }

  protected addTask(event: Event): void {
    event.preventDefault();
    const week = this.week();
    const course = this.addCourse();
    const form = event.target as HTMLFormElement;
    const title = this.draftTitle().trim();
    if (!week || !course || !title) {
      return;
    }
    this.progress.addTask(week, title, course);
    const titleInput = form.querySelector<HTMLInputElement>(".add-title");
    if (titleInput) {
      titleInput.value = "";
    }
    this.draftTitle.set("");
  }
}
