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
  description: string;
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
  items: readonly {
    course: CourseKind;
    title: string;
    description: string;
  }[],
): StudyTask[] {
  return items.map((item, index) => ({
    id: `week-${weekNumber}-task-${index + 1}`,
    title: item.title,
    course: item.course,
    description: item.description,
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
          {
            course: "python",
            title: "Install Python and use VS Code only",
            description:
              "Install Python 3 and do every exercise in VS Code, so the same editor is ready when Django starts.",
          },
          {
            course: "python",
            title: "Variables, types, if, and loops",
            description:
              "Bind a name to a value, branch with if, and repeat with a loop. You are done when a short script runs from the terminal without looking back at the video.",
          },
          {
            course: "python",
            title: "Strings, slicing, and f-strings",
            description:
              "Slice strings and build messages with f-strings. Django templates and logs use the same idea.",
          },
          {
            course: "backend",
            title: "Request and response: who calls whom, and what comes back",
            description:
              "Trace one request from the client to a response. A Django view is that exchange, written as a function.",
          },
        ]),
      },
      {
        id: "week-2",
        number: 2,
        title: "Collections and HTTP",
        dates: "5 Oct – 11 Oct",
        courses: [python, backend],
        tasks: tasks(2, [
          {
            course: "python",
            title: "Lists, dicts, tuples, sets, and comprehensions",
            description:
              "Store the same few records as a list, a dict, a tuple, and a set, then rebuild one of those collections with a comprehension.",
          },
          {
            course: "python",
            title: "Functions, defaults, *args, and **kwargs",
            description:
              "Write functions with defaults, *args, and **kwargs. Django views and URL confs use these patterns.",
          },
          {
            course: "python",
            title: "One small script each weeknight",
            description:
              "Write one small script each weeknight so the syntax stays in your hands, not only in the videos.",
          },
          {
            course: "backend",
            title: "HTTP methods and status codes",
            description:
              "Learn the methods and status codes, and say which status a create, a missing row, and a bad form should return.",
          },
        ]),
      },
      {
        id: "week-3",
        number: 3,
        title: "Classes and waiting",
        dates: "12 Oct – 18 Oct",
        courses: [python, backend],
        tasks: tasks(3, [
          {
            course: "python",
            title: "Classes, __init__, and inheritance",
            description:
              "Build a class with __init__ and a subclass. A Django model is that shape, plus a database table.",
          },
          {
            course: "python",
            title: "venv and pip",
            description:
              "Create a virtual environment and install a package with pip, so a Django project stays isolated.",
          },
          {
            course: "python",
            title: "try / except and reading files with with",
            description:
              "Read a file with with, and catch a missing file with try / except. Settings and uploads do both.",
          },
          {
            course: "backend",
            title: "Sync vs async, polling, long polling, SSE, and pub/sub",
            description:
              "Compare a blocking call with async, then place polling, long polling, SSE, and pub/sub on one timeline.",
          },
        ]),
      },
      {
        id: "week-4",
        number: 4,
        title: "Objects Django will use",
        dates: "19 Oct – 25 Oct",
        courses: [python],
        tasks: tasks(4, [
          {
            course: "python",
            title: "Watch decorators once so @action looks familiar",
            description:
              "Watch decorators once. After that, @action and @login_required are syntax you have already seen.",
          },
          {
            course: "python",
            title: "Weekend: User and Order in plain Python",
            description:
              "Model a User and an Order in plain Python, with no database, before those names become tables.",
          },
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
          {
            course: "django",
            title: "Learn urls.py, settings.py, and where an app lives",
            description:
              "Find urls.py, settings.py, and the app folder, and say which file runs when a request arrives.",
          },
          {
            course: "django",
            title: "One model, migrations, and the admin",
            description:
              "Create one model, generate its migration, apply it, and open the new table in the admin.",
          },
          {
            course: "django",
            title: "One view that returns JSON",
            description:
              "Return that model as JSON from one view, so Angular has an API to call.",
          },
          {
            course: "django",
            title: "Weekend: create, update, and delete that model in the admin",
            description:
              "Create, update, and delete the same row in the admin until those three writes feel routine.",
          },
          {
            course: "sql",
            title: "Create a table with a primary key, then SELECT and WHERE the same rows",
            description:
              "Create the table by hand with a primary key, then SELECT and WHERE the rows the admin just wrote.",
          },
        ]),
      },
      {
        id: "week-6",
        number: 6,
        title: "Postgres and relations",
        dates: "2 Nov – 8 Nov",
        courses: [django, sql],
        tasks: tasks(6, [
          {
            course: "django",
            title: "Project setup with Docker Compose",
            description:
              "Start the project with Docker Compose so Django and Postgres boot as one command.",
          },
          {
            course: "django",
            title: "Postgres configuration and migrations",
            description:
              "Point Django at Postgres and run the migrations against that database, not SQLite.",
          },
          {
            course: "django",
            title: "Custom user model and a superuser",
            description:
              "Replace the default user with a custom user model, then create a superuser and sign in.",
          },
          {
            course: "sql",
            title: "Foreign keys and JOIN: the SQL behind a ForeignKey",
            description:
              "Write a foreign key and the JOIN it becomes, then match that SQL to a ForeignKey field.",
          },
        ]),
      },
      {
        id: "week-7",
        number: 7,
        title: "Auth wired to Angular",
        dates: "9 Nov – 15 Nov",
        courses: [django],
        tasks: tasks(7, [
          {
            course: "django",
            title: "User API and token authentication",
            description:
              "Build a user API that checks a login and returns a token the browser can store.",
          },
          {
            course: "django",
            title: "HttpClient and an interceptor that attaches the token",
            description:
              "Send that token from an Angular interceptor on every request, without pasting it into each call.",
          },
          {
            course: "django",
            title: "Dev proxy from the Angular app to Django",
            description:
              "Proxy the Angular dev server to Django so the browser talks to one origin during development.",
          },
          {
            course: "django",
            title: "Allow the Angular origin in CORS",
            description:
              "Allow the Angular origin in Django CORS for any call the dev proxy does not cover.",
          },
        ]),
      },
      {
        id: "week-8",
        number: 8,
        title: "A screen and its filters",
        dates: "16 Nov – 22 Nov",
        courses: [django, sql],
        tasks: tasks(8, [
          {
            course: "django",
            title: "Tags, ingredients, images, and filtering",
            description:
              "Add tags, ingredients, and an image field, then filter the list endpoint by one of those fields.",
          },
          {
            course: "django",
            title: "Learn the test loop on the first endpoint",
            description:
              "Write a test for the first endpoint and run it until the failure turns into a pass.",
          },
          {
            course: "django",
            title: "Angular screen: login, list, and create",
            description:
              "Build the Angular screen that logs in, lists the rows, and creates one new row.",
          },
          {
            course: "sql",
            title: "ORDER BY and LIMIT, and name the queryset line that matches",
            description:
              "Write ORDER BY and LIMIT, then point at the queryset line that produces each clause.",
          },
        ]),
      },
      {
        id: "week-9",
        number: 9,
        title: "The SQL Django emits",
        dates: "23 Nov – 29 Nov",
        courses: [django, sql],
        tasks: tasks(9, [
          {
            course: "django",
            title: "select_related, prefetch_related, and a fixed N+1",
            description:
              "Find one N+1 query and fix it with select_related or prefetch_related. Watch the query count drop.",
          },
          {
            course: "django",
            title: "DRF pagination and an Angular list that follows next",
            description:
              "Paginate the API, then make the Angular list follow the next link instead of loading every row.",
          },
          {
            course: "django",
            title: "Permissions, including object-level access",
            description:
              "Add a permission that hides a row when the current user does not own it.",
          },
          {
            course: "django",
            title: "A transaction around a write that touches two tables",
            description:
              "Wrap a write that updates two tables in one transaction, so a failure leaves neither change.",
          },
          {
            course: "sql",
            title: "Window functions, CTEs, indexes, and the performance section",
            description:
              "Use an index, a CTE, and a window function on a table you already have, and say what each one changes in the result.",
          },
          {
            course: "sql",
            title: "Write each query, then say what the queryset would do",
            description:
              "Write the SQL first, then name the queryset that would emit it.",
          },
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
          {
            course: "backend",
            title: "TCP, TLS, HTTP/1.1, HTTP/2, and WebSockets",
            description:
              "Place TCP, TLS, HTTP/1.1, HTTP/2, and WebSockets on one diagram, from the cable up to the app.",
          },
          {
            course: "backend",
            title: "gRPC: when a Django JSON API is the wrong tool",
            description:
              "Name a case where a Django JSON API is the wrong tool and gRPC fits better.",
          },
          {
            course: "backend",
            title: "Proxy vs reverse proxy, layer 4 vs layer 7",
            description:
              "Tell a proxy from a reverse proxy, and a layer 4 hop from a layer 7 hop.",
          },
          {
            course: "backend",
            title: "Draw browser, Angular proxy, nginx, Gunicorn, Django, Postgres",
            description:
              "Draw the path from the browser through the Angular proxy, nginx, Gunicorn, Django, and Postgres.",
          },
        ]),
      },
      {
        id: "week-11",
        number: 11,
        title: "Tests, config, CI",
        dates: "7 Dec – 13 Dec",
        courses: [django],
        tasks: tasks(11, [
          {
            course: "django",
            title: "One endpoint you design, with its own test",
            description:
              "Design one endpoint yourself and ship it with a test you wrote before the view.",
          },
          {
            course: "django",
            title: "Split settings and read secrets from the environment",
            description:
              "Split settings by environment and read secrets from the environment, not from the repo.",
          },
          {
            course: "django",
            title: "Run tests in GitHub Actions",
            description:
              "Run the test suite in GitHub Actions so a push fails when the tests fail.",
          },
          {
            course: "django",
            title: "One management command",
            description:
              "Add a management command that does one job from the shell, such as seeding rows, so that job never has to live in the admin.",
          },
        ]),
      },
      {
        id: "week-12",
        number: 12,
        title: "Capstone in company shape",
        dates: "14 Dec – 20 Dec",
        courses: [django],
        tasks: tasks(12, [
          {
            course: "django",
            title: "Django app with list, filter, and create",
            description:
              "Finish a small app whose API can list rows, filter them, and create one new row.",
          },
          {
            course: "django",
            title: "Auth and one permission",
            description:
              "Keep login on that app, and add one permission that decides who is allowed to change a row.",
          },
          {
            course: "django",
            title: "Angular page and service in front of it",
            description:
              "Put an Angular page and a service in front of the API, instead of calling it from the admin.",
          },
          {
            course: "django",
            title: "One test and Docker Compose",
            description:
              "Leave one test that passes, and a Docker Compose file that starts Django and the database together.",
          },
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
