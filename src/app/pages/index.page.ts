import { Component } from '@angular/core';

import { months, planRange } from '../curriculum';

@Component({
  selector: 'app-home',
  template: `
    <main>
      <h1>Angular + Django</h1>
      <p>{{ planRange }}</p>

      @for (month of months; track month.id) {
        <section>
          <h2>{{ month.title }}</h2>

          @for (week of month.weeks; track week.id) {
            <article>
              <h3>Week {{ week.number }} · {{ week.title }}</h3>
              <p>{{ week.dates }}</p>

              @if (week.courses.length) {
                <ul>
                  @for (course of week.courses; track course.url) {
                    <li>
                      <a [href]="course.url" target="_blank" rel="noopener noreferrer">
                        {{ course.title }}
                      </a>
                    </li>
                  }
                </ul>
              }

              <ul>
                @for (task of week.tasks; track task.id) {
                  <li>{{ task.title }}</li>
                }
              </ul>
            </article>
          }
        </section>
      }
    </main>
  `,
  styles: `
    main {
      max-width: 42rem;
      margin: 0 auto;
      padding: 2rem 1.25rem 4rem;
      text-align: left;
    }

    h1,
    h2,
    h3,
    p {
      margin: 0;
    }

    h1 {
      font-size: 1.75rem;
      line-height: 1.2;
    }

    h2 {
      margin-top: 2rem;
      font-size: 1.25rem;
    }

    article {
      margin-top: 1.25rem;
    }

    h3 {
      font-size: 1rem;
    }

    p,
    li {
      line-height: 1.5;
    }

    a {
      color: #1d4ed8;
    }
  `,
})
export default class Home {
  protected readonly months = months;
  protected readonly planRange = planRange;
}
