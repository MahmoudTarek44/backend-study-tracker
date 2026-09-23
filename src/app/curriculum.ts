export interface CourseLink {
  title: string;
  url: string;
}

export interface StudyTask {
  id: string;
  title: string;
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

export const planRange = '28 Sep 2026 – 20 Dec 2026';

const python: CourseLink = {
  title: 'Learn Python with Abdul Bari',
  url: 'https://www.udemy.com/course/learn-python-with-abdul-bari/learn/lecture/30491080?start=0#overview',
};

const sql: CourseLink = {
  title: 'The Complete SQL Bootcamp',
  url: 'https://www.udemy.com/course/the-complete-sql-bootcamp-30-hours-go-from-zero-to-hero/learn/lecture/43405188?start=0#overview',
};

const protocols: CourseLink = {
  title: 'Fundamentals of Backend Communications and Protocols',
  url: 'https://www.udemy.com/course/fundamentals-of-backend-communications-and-protocols/learn/lecture/34629150?start=0#overview',
};

const django: CourseLink = {
  title: 'Django Python Advanced',
  url: 'https://www.udemy.com/course/django-python-advanced/learn/lecture/32238592?start=0#overview',
};

function tasks(weekNumber: number, titles: string[]): StudyTask[] {
  return titles.map((title, index) => ({
    id: `week-${weekNumber}-task-${index + 1}`,
    title,
  }));
}

export const months: StudyMonth[] = [
  {
    id: 'month-1',
    title: 'Month 1 — Language',
    weeks: [
      {
        id: 'week-1',
        number: 1,
        title: 'Python you will type',
        dates: '28 Sep – 4 Oct',
        courses: [python],
        tasks: tasks(1, [
          'Install Python and use VS Code only',
          'Variables, types, if, and loops',
          'Strings, slicing, and f-strings',
          'One small script each weeknight',
        ]),
      },
      {
        id: 'week-2',
        number: 2,
        title: 'Collections and functions',
        dates: '5 Oct – 11 Oct',
        courses: [python],
        tasks: tasks(2, [
          'Lists, dicts, tuples, sets, and comprehensions',
          'Functions, defaults, *args, and **kwargs',
          'try / except and reading files with with',
          'Weekend: CSV in, summary file out',
        ]),
      },
      {
        id: 'week-3',
        number: 3,
        title: 'Classes, modules, decorators',
        dates: '12 Oct – 18 Oct',
        courses: [python],
        tasks: tasks(3, [
          'Classes, __init__, and inheritance',
          'venv and pip',
          'Watch decorators once so @action looks familiar',
          'Weekend: User and Order in plain Python',
        ]),
      },
      {
        id: 'week-4',
        number: 4,
        title: 'SQL Django will generate',
        dates: '19 Oct – 25 Oct',
        courses: [sql, protocols],
        tasks: tasks(4, [
          'Window functions, CTEs, indexes, and the performance section',
          'Write each query, then say what the queryset would do',
          'Request-response, sync vs async, polling, long polling, SSE, pub/sub',
        ]),
      },
    ],
  },
  {
    id: 'month-2',
    title: 'Month 2 — Django API',
    weeks: [
      {
        id: 'week-5',
        number: 5,
        title: 'Django project shape',
        dates: '26 Oct – 1 Nov',
        courses: [django],
        tasks: tasks(5, [
          'Learn urls.py, settings.py, and where an app lives',
          'One model, migrations, and the admin',
          'One view that returns JSON',
          'Weekend: create, update, and delete that model in the admin',
        ]),
      },
      {
        id: 'week-6',
        number: 6,
        title: 'Docker, Postgres, users',
        dates: '2 Nov – 8 Nov',
        courses: [django],
        tasks: tasks(6, [
          'Project setup with Docker Compose',
          'Postgres configuration and migrations',
          'Custom user model and a superuser',
        ]),
      },
      {
        id: 'week-7',
        number: 7,
        title: 'Auth wired to Angular',
        dates: '9 Nov – 15 Nov',
        courses: [django],
        tasks: tasks(7, [
          'User API and token authentication',
          'HttpClient and an interceptor that attaches the token',
          'Dev proxy from the Angular app to Django',
          'Allow the Angular origin in CORS',
        ]),
      },
      {
        id: 'week-8',
        number: 8,
        title: 'A screen on a real API',
        dates: '16 Nov – 22 Nov',
        courses: [django],
        tasks: tasks(8, [
          'Tags, ingredients, images, and filtering',
          'Learn the test loop on the first endpoint',
          'Angular screen: login, list, and create',
        ]),
      },
    ],
  },
  {
    id: 'month-3',
    title: 'Month 3 — Production',
    weeks: [
      {
        id: 'week-9',
        number: 9,
        title: 'Queries, permissions, pages',
        dates: '23 Nov – 29 Nov',
        courses: [django],
        tasks: tasks(9, [
          'select_related, prefetch_related, and a fixed N+1',
          'DRF pagination and an Angular list that follows next',
          'Permissions, including object-level access',
          'A transaction around a write that touches two tables',
        ]),
      },
      {
        id: 'week-10',
        number: 10,
        title: 'Protocols on this stack',
        dates: '30 Nov – 6 Dec',
        courses: [protocols],
        tasks: tasks(10, [
          'TCP, TLS, HTTP/1.1, HTTP/2, and WebSockets',
          'gRPC: when a Django JSON API is the wrong tool',
          'Proxy vs reverse proxy, layer 4 vs layer 7',
          'Draw browser, Angular proxy, nginx, Gunicorn, Django, Postgres',
        ]),
      },
      {
        id: 'week-11',
        number: 11,
        title: 'Tests, config, CI',
        dates: '7 Dec – 13 Dec',
        courses: [django],
        tasks: tasks(11, [
          'One endpoint you design, with its own test',
          'Split settings and read secrets from the environment',
          'Run tests in GitHub Actions',
          'One management command',
        ]),
      },
      {
        id: 'week-12',
        number: 12,
        title: 'Capstone in company shape',
        dates: '14 Dec – 20 Dec',
        courses: [django],
        tasks: tasks(12, [
          'Django app with list, filter, and create',
          'Auth and one permission',
          'Angular page and service in front of it',
          'One test and Docker Compose',
        ]),
      },
    ],
  },
];
