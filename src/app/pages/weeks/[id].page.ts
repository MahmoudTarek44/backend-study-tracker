import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { injectActivatedRoute } from '@analogjs/router';

import { StudyBoard } from '../../study-board';

@Component({
  selector: 'app-week-page',
  imports: [StudyBoard],
  template: `<app-study-board [weekId]="weekId()" />`,
})
export default class WeekPage {
  private readonly route = injectActivatedRoute();
  protected readonly weekId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('id') ?? '' },
  );
}
