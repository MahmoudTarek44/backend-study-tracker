import { Component, computed, inject } from "@angular/core";

import { findWeek, openingWeekId } from "../curriculum";
import { StudyBoard } from "../study-board";
import { StudyProgress } from "../study-progress";

@Component({
  selector: "app-home",
  imports: [StudyBoard],
  template: `<app-study-board [weekId]="weekId()" />`,
})
export default class Home {
  private readonly progress = inject(StudyProgress);
  protected readonly weekId = computed(() =>
    openingWeekId(new Date(), (id) => {
      const week = findWeek(id);
      return week ? this.progress.isWeekComplete(week) : false;
    }),
  );
}
