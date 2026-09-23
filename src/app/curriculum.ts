export type CourseKind = "python" | "backend" | "django" | "sql";

export const courseLabel: Record<CourseKind, string> = {
  python: "Python",
  backend: "Backend",
  django: "Django",
  sql: "Sql",
};

export interface CourseLink {
  kind: CourseKind;
  title: string;
  url: string;
}

export interface StudyTask {
  id: string;
  title: string;
  course: CourseKind;
}

export interface StudyWeek {
  id: string;
  number: number;
  title: string;
  dates: string;
  tasks: StudyTask[];
  courses: CourseLink[];
}

export interface StudyMonth {
  id: string;
  title: string;
  weeks: StudyWeek[];
}

export const planRange = "28 Sep 2026 – 20 Dec 2026";

const python: CourseLink = {
  kind: "python",
  title: "Learn Python with Abdul Bari",
  url: "https://www.udemy.com/course/learn-python-with-abdul-bari/learn/lecture/30491080?start=0#overview",
};

const sql: CourseLink = {
  kind: "sql",
  title: "The Complete SQL Bootcamp",
  url: "https://www.udemy.com/course/the-complete-sql-bootcamp-30-hours-go-from-zero-to-hero/learn/lecture/43405188?start=0#overview",
};

const backend: CourseLink = {
  kind: "backend",
  title: "Fundamentals of Backend Communications and Protocols",
  url: "https://www.udemy.com/course/fundamentals-of-backend-communications-and-protocols/learn/lecture/34629150?start=0#overview",
};

const django: CourseLink = {
  kind: "django",
  title: "Django Python Advanced",
  url: "https://www.udemy.com/course/django-python-advanced/learn/lecture/32238592?start=0#overview",
};

function tasks(
  weekNumber: number,
  items: readonly { course: CourseKind; title: string }[],
): StudyTask[] {
  return items.map((item, index) => ({
    id: `week-${weekNumber}-task-${index + 1}`,
    title: item.title,
    course: item.course,
  }));
}

export const months: StudyMonth[] = [
  {
    id: "month-1",
    title: "Month 1 — Python + backend",
    weeks: [
      {
        id: "week-1",
        number: 1,
        title: "Syntax and a request",
        dates: "28 Sep – 4 Oct",
        courses: [python, backend],
        tasks: tasks(1, [
          { course: "python", title: "Install Python and use VS Code only" },
          { course: "python", title: "Variables, types, if, and loops" },
          { course: "python", title: "Strings, slicing, and f-strings" },
          { course: "backend", title: "Request and response: who calls whom, and what comes back" },
        ]),
      },
      {
        id: "week-2",
        number: 2,
        title: "Collections and HTTP",
        dates: "5 Oct – 11 Oct",
        courses: [python, backend],
        tasks: tasks(2, [
          { course: "python", title: "Lists, dicts, tuples, sets, and comprehensions" },
          { course: "python", title: "Functions, defaults, *args, and **kwargs" },
          { course: "python", title: "One small script each weeknight" },
          { course: "backend", title: "HTTP methods and status codes" },
        ]),
      },
      {
        id: "week-3",
        number: 3,
        title: "Classes and waiting",
        dates: "12 Oct – 18 Oct",
        courses: [python, backend],
        tasks: tasks(3, [
          { course: "python", title: "Classes, __init__, and inheritance" },
          { course: "python", title: "venv and pip" },
          { course: "python", title: "try / except and reading files with with" },
          { course: "backend", title: "Sync vs async, polling, long polling, SSE, and pub/sub" },
        ]),
      },
      {
        id: "week-4",
        number: 4,
        title: "Objects Django will use",
        dates: "19 Oct – 25 Oct",
        courses: [python],
        tasks: tasks(4, [
          { course: "python", title: "Watch decorators once so @action looks familiar" },
          { course: "python", title: "Weekend: User and Order in plain Python" },
        ]),
      },
    ],
  },
  {
    id: "month-2",
    title: "Month 2 — Django + SQL",
    weeks: [
      {
        id: "week-5",
        number: 5,
        title: "A model is a table",
        dates: "26 Oct – 1 Nov",
        courses: [django, sql],
        tasks: tasks(5, [
          { course: "django", title: "Learn urls.py, settings.py, and where an app lives" },
          { course: "django", title: "One model, migrations, and the admin" },
          { course: "django", title: "One view that returns JSON" },
          { course: "django", title: "Weekend: create, update, and delete that model in the admin" },
          { course: "sql", title: "Create a table with a primary key, then SELECT and WHERE the same rows" },
        ]),
      },
      {
        id: "week-6",
        number: 6,
        title: "Postgres and relations",
        dates: "2 Nov – 8 Nov",
        courses: [django, sql],
        tasks: tasks(6, [
          { course: "django", title: "Project setup with Docker Compose" },
          { course: "django", title: "Postgres configuration and migrations" },
          { course: "django", title: "Custom user model and a superuser" },
          { course: "sql", title: "Foreign keys and JOIN: the SQL behind a ForeignKey" },
        ]),
      },
      {
        id: "week-7",
        number: 7,
        title: "Auth wired to Angular",
        dates: "9 Nov – 15 Nov",
        courses: [django],
        tasks: tasks(7, [
          { course: "django", title: "User API and token authentication" },
          { course: "django", title: "HttpClient and an interceptor that attaches the token" },
          { course: "django", title: "Dev proxy from the Angular app to Django" },
          { course: "django", title: "Allow the Angular origin in CORS" },
        ]),
      },
      {
        id: "week-8",
        number: 8,
        title: "A screen and its filters",
        dates: "16 Nov – 22 Nov",
        courses: [django, sql],
        tasks: tasks(8, [
          { course: "django", title: "Tags, ingredients, images, and filtering" },
          { course: "django", title: "Learn the test loop on the first endpoint" },
          { course: "django", title: "Angular screen: login, list, and create" },
          { course: "sql", title: "ORDER BY and LIMIT, and name the queryset line that matches" },
        ]),
      },
      {
        id: "week-9",
        number: 9,
        title: "The SQL Django emits",
        dates: "23 Nov – 29 Nov",
        courses: [django, sql],
        tasks: tasks(9, [
          { course: "django", title: "select_related, prefetch_related, and a fixed N+1" },
          { course: "django", title: "DRF pagination and an Angular list that follows next" },
          { course: "django", title: "Permissions, including object-level access" },
          { course: "django", title: "A transaction around a write that touches two tables" },
          { course: "sql", title: "Window functions, CTEs, indexes, and the performance section" },
          { course: "sql", title: "Write each query, then say what the queryset would do" },
        ]),
      },
    ],
  },
  {
    id: "month-3",
    title: "Month 3 — The running system",
    weeks: [
      {
        id: "week-10",
        number: 10,
        title: "Protocols on this stack",
        dates: "30 Nov – 6 Dec",
        courses: [backend],
        tasks: tasks(10, [
          { course: "backend", title: "TCP, TLS, HTTP/1.1, HTTP/2, and WebSockets" },
          { course: "backend", title: "gRPC: when a Django JSON API is the wrong tool" },
          { course: "backend", title: "Proxy vs reverse proxy, layer 4 vs layer 7" },
          { course: "backend", title: "Draw browser, Angular proxy, nginx, Gunicorn, Django, Postgres" },
        ]),
      },
      {
        id: "week-11",
        number: 11,
        title: "Tests, config, CI",
        dates: "7 Dec – 13 Dec",
        courses: [django],
        tasks: tasks(11, [
          { course: "django", title: "One endpoint you design, with its own test" },
          { course: "django", title: "Split settings and read secrets from the environment" },
          { course: "django", title: "Run tests in GitHub Actions" },
          { course: "django", title: "One management command" },
        ]),
      },
      {
        id: "week-12",
        number: 12,
        title: "Capstone in company shape",
        dates: "14 Dec – 20 Dec",
        courses: [django],
        tasks: tasks(12, [
          { course: "django", title: "Django app with list, filter, and create" },
          { course: "django", title: "Auth and one permission" },
          { course: "django", title: "Angular page and service in front of it" },
          { course: "django", title: "One test and Docker Compose" },
        ]),
      },
    ],
  },
];

export const weekBounds: Record<string, { start: string; end: string }> = {
  "week-1": { start: "2026-09-28", end: "2026-10-04" },
  "week-2": { start: "2026-10-05", end: "2026-10-11" },
  "week-3": { start: "2026-10-12", end: "2026-10-18" },
  "week-4": { start: "2026-10-19", end: "2026-10-25" },
  "week-5": { start: "2026-10-26", end: "2026-11-01" },
  "week-6": { start: "2026-11-02", end: "2026-11-08" },
  "week-7": { start: "2026-11-09", end: "2026-11-15" },
  "week-8": { start: "2026-11-16", end: "2026-11-22" },
  "week-9": { start: "2026-11-23", end: "2026-11-29" },
  "week-10": { start: "2026-11-30", end: "2026-12-06" },
  "week-11": { start: "2026-12-07", end: "2026-12-13" },
  "week-12": { start: "2026-12-14", end: "2026-12-20" },
};

export function allWeeks(): StudyWeek[] {
  return months.flatMap((month) => month.weeks);
}

export function findWeek(id: string): StudyWeek | undefined {
  return allWeeks().find((week) => week.id === id);
}

export function monthTitleFor(weekId: string): string {
  return (
    months.find((month) => month.weeks.some((week) => week.id === weekId))
      ?.title ?? ""
  );
}

export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function isCalendarWeek(weekId: string, date: Date): boolean {
  const bounds = weekBounds[weekId];
  if (!bounds) {
    return false;
  }
  const iso = toIsoDate(date);
  return iso >= bounds.start && iso <= bounds.end;
}

export function openingWeekId(
  today: Date,
  isComplete: (weekId: string) => boolean,
): string {
  const weeks = allWeeks();
  const first = weeks[0];
  const last = weeks[weeks.length - 1];
  const calendar = weeks.find((week) => isCalendarWeek(week.id, today));

  if (toIsoDate(today) < weekBounds[first.id].start) {
    return weeks.find((week) => !isComplete(week.id))?.id ?? first.id;
  }

  if (calendar && !isComplete(calendar.id)) {
    return calendar.id;
  }

  const startAt = calendar ? weeks.indexOf(calendar) : weeks.length;
  return (
    weeks.slice(startAt).find((week) => !isComplete(week.id))?.id ??
    weeks.find((week) => !isComplete(week.id))?.id ??
    last.id
  );
}
