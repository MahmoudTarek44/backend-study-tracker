import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { allWeeks, findWeek, isCalendarWeek, months, planRange } from './curriculum';
import { parseSavedPlan, StudyProgress, type DisplayTask } from './study-progress';
import { Theme } from './theme';

@Component({
  selector: 'app-study-board',
  imports: [RouterLink],
  template: `
    @if (week(); as current) {
      <div class="shell">
        <header class="top">
          <div>
            <p class="eyebrow">Backend study</p>
            <p class="range">{{ planRange }}</p>
          </div>
          <div class="top-end">
            <button
              type="button"
              class="theme-switch"
              role="switch"
              [attr.aria-checked]="theme.light()"
              [attr.aria-label]="theme.light() ? 'Switch to dark mode' : 'Switch to light mode'"
              (click)="theme.toggle()"
            >
              <span class="theme-track" aria-hidden="true">
                <span class="theme-stars"></span>
                <span class="theme-knob">
                  <svg class="icon-moon" viewBox="0 0 24 24">
                    <path d="M15.8 3.2a8.2 8.2 0 1 0 5.4 14.4A7.2 7.2 0 0 1 15.8 3.2z" />
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
            <p class="score">{{ weekState().done }}<span>/{{ weekState().total }}</span></p>
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
                @if (nextTask(); as task) {
                  <p class="kicker">Up next</p>
                  <h1 id="next-task">{{ task.title }}</h1>
                } @else {
                  <p class="kicker">This week</p>
                  <h1 id="next-task">Week {{ panel.number }} is finished.</h1>
                }

                <p class="meta">Week {{ panel.number }} · {{ panel.title }} · {{ panel.dates }}</p>

                @if (panel.courses.length) {
                  <p class="courses">
                    @for (course of panel.courses; track course.url; let last = $last) {
                      <a [href]="course.url" target="_blank" rel="noopener noreferrer">{{ course.title }}</a>
                      @if (!last) {
                        <span aria-hidden="true"> · </span>
                      }
                    }
                  </p>
                }

                <div class="meter" aria-hidden="true">
                  <span [style.width.%]="percent()"></span>
                </div>

                @if (nextTask() && panel.courses[0]; as course) {
                  <a class="continue" [href]="course.url" target="_blank" rel="noopener noreferrer">Continue</a>
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

              <ul>
                @for (task of tasks(); track task.id; let first = $first; let last = $last; let index = $index) {
                  <li class="task" [class.done]="task.done" [style.animation-delay]="index * 45 + 'ms'">
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
                          [value]="renameSeed"
                          [attr.aria-label]="'Rename ' + task.title"
                          (blur)="saveRename(task.id, $event)"
                          (keydown.enter)="saveRename(task.id, $event)"
                        />
                      } @else {
                        <label [for]="'task-' + task.id">{{ task.title }}</label>
                      }
                    </div>

                    @if (task.note && noteTaskId() !== task.id) {
                      <p class="note-preview">{{ task.note }}</p>
                    }

                    <div class="actions">
                      <button type="button" (click)="openNote(task)">Note</button>
                      <button type="button" (click)="openRename(task)">Rename</button>
                      <button type="button" (click)="move(task.id, -1)" [disabled]="first">Up</button>
                      <button type="button" (click)="move(task.id, 1)" [disabled]="last">Down</button>
                      <button type="button" (click)="remove(task.id)">Remove</button>
                    </div>

                    @if (noteTaskId() === task.id) {
                      <textarea
                        rows="3"
                        [attr.aria-label]="'Note for ' + task.title"
                        [value]="noteSeed"
                        (input)="onNote(task.id, $event)"
                      ></textarea>
                    }
                  </li>
                }
              </ul>

              <form class="add" (submit)="addTask($event)">
                <label class="sr" for="new-task">Add a task</label>
                <input id="new-task" name="title" placeholder="Add a task" autocomplete="off" />
                <button type="submit">Add</button>
              </form>
            </section>

            <footer>
              <button type="button" (click)="exportPlan()">Export</button>
              <label class="import">
                Import
                <input type="file" accept="application/json,.json" (change)="importPlan($event)" />
              </label>
              @if (footerMessage()) {
                <p>{{ footerMessage() }}</p>
              }
            </footer>
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
  protected readonly noteTaskId = signal<string | null>(null);
  protected readonly renameTaskId = signal<string | null>(null);
  protected readonly footerMessage = signal('');
  protected noteSeed = '';
  protected renameSeed = '';

  protected readonly week = computed(() => findWeek(this.weekId()));
  protected readonly stage = computed(() => {
    const week = this.week();
    return week ? [week] : [];
  });
  protected readonly tasks = computed(() => {
    const week = this.week();
    return week ? this.progress.tasksFor(week) : [];
  });
  protected readonly nextTask = computed(() => this.tasks().find((task) => !task.done));
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
  protected readonly nextOpenWeek = computed(() => {
    const weeks = allWeeks();
    const index = weeks.findIndex((week) => week.id === this.weekId());
    return weeks.slice(index + 1).find((week) => !this.progress.isWeekComplete(week));
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
      return '';
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
      this.progress.setWeekDone(week, (event.target as HTMLInputElement).checked);
    }
  }

  protected openNote(task: DisplayTask): void {
    this.noteSeed = task.note;
    this.renameTaskId.set(null);
    this.noteTaskId.update((current) => (current === task.id ? null : task.id));
  }

  protected openRename(task: DisplayTask): void {
    this.renameSeed = task.title;
    this.noteTaskId.set(null);
    this.renameTaskId.set(task.id);
  }

  protected onNote(taskId: string, event: Event): void {
    this.progress.setNote(taskId, (event.target as HTMLTextAreaElement).value);
  }

  protected saveRename(taskId: string, event: Event): void {
    this.progress.rename(taskId, (event.target as HTMLInputElement).value);
    this.renameTaskId.set(null);
  }

  protected move(taskId: string, direction: -1 | 1): void {
    const week = this.week();
    if (week) {
      this.progress.moveTask(week, taskId, direction);
    }
  }

  protected remove(taskId: string): void {
    const week = this.week();
    if (week) {
      this.progress.removeTask(week, taskId);
    }
  }

  protected addTask(event: Event): void {
    event.preventDefault();
    const week = this.week();
    const form = event.target as HTMLFormElement;
    if (!week) {
      return;
    }
    this.progress.addTask(week, String(new FormData(form).get('title') ?? ''));
    form.reset();
  }

  protected exportPlan(): void {
    const blob = new Blob([JSON.stringify(this.progress.snapshot(), null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'backend-study-tracker.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  protected importPlan(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }
    void file.text().then((raw) => {
      const plan = parseSavedPlan(raw);
      if (!plan) {
        this.footerMessage.set('That file could not be read.');
        return;
      }
      this.progress.replace(plan);
      this.footerMessage.set('Progress replaced from the file.');
    });
  }
}
