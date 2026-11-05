# StartTechPro Platform 🌿

**Цифровая фабрика будущего** — экосистема AI-агентов для создания, запуска и сопровождения цифровых продуктов.

## Архитектура

Платформа состоит из трёх зон:

### 🔹 Зона A — Публичная (Marketing & Entry)
Публичный сайт-витрина: лендинг, экосистема, продукты, тарифы, блог.
- **Технологии:** Next.js 15, SSR, Tailwind CSS 4
- **Цель:** максимальная скорость, SEO, конверсия

### 🔹 Зона B — Клиентская (Customer Portal)
Личный кабинет клиента: дашборд, проекты, чат с оркестратором, документы, оплата.
- **Технологии:** Next.js 15, Supabase Auth, RLS, Realtime
- **Цель:** управление цифровыми продуктами

### 🔹 Зона C — Операционная (Internal Workspace)
Внутренняя рабочая зона: оркестратор агентов, админ-панель, QA, финансы, DevOps.
- **Технологии:** Next.js 15, RBAC, 2FA, audit log
- **Цель:** управление производством

## Технологический стек

| Компонент | Технология |
|---|---|
| Фреймворк | Next.js 15 (App Router) |
| Язык | TypeScript (strict mode) |
| Стилизация | Tailwind CSS 4 + glassmorphism |
| UI-компоненты | shadcn/ui (кастомные) |
| Бэкенд | Supabase (PostgreSQL, Auth, Realtime, Storage) |
| Оркестрация AI | LangGraph + LangChain |
| LLM | OpenAI / YandexGPT |
| Векторная БД | pgvector (Supabase) |
| Хостинг | Vercel (front) + Supabase Cloud (back) |
| CI/CD | GitHub Actions |
| Мониторинг | Sentry + Axiom + Langfuse |
| Платежи | YooKassa (54-ФЗ, Split Payments) |

## Структура monorepo

```
starttechpro-platform/
├── apps/
│   ├── web/              # Зона A — публичный сайт
│   │   └── src/app/
│   │       ├── api/      # API-роуты (contacts)
│   │       ├── blog/     # Блог (статический)
│   │       ├── projects/ # Страницы проектов
│   │       └── ...       # Прочие страницы
│   ├── portal/           # Зона B — клиентский портал
│   │   └── src/app/
│   │       ├── api/      # API-роуты (wallet, projects, support, analytics, live-editor)
│   │       ├── dashboard/ # Дашборд, биллинг, проекты
│   │       └── register/ # Регистрация
│   └── internal/         # Зона C — внутренняя рабочая зона
│       └── src/app/
│           ├── api/      # API-роуты (admin: tasks, agents, audit-logs)
│           ├── analytics/ # Аналитика
│           ├── kanban/   # Канбан-доска
│           └── ...       # Прочие страницы
├── packages/
│   ├── orchestrator/     # AI-оркестратор (billing, provisioner, domain, hosting, live-editor)
│   ├── ui/               # Дизайн-система (компоненты)
│   └── config/           # Общие конфиги (tsconfig, eslint)
├── supabase/
│   └── migrations/       # Миграции БД (001–007)
├── legal/                # Юридические документы
├── turbo.json
└── package.json
```

## Быстрый старт

### 1. Клонирование и установка

```bash
git clone <repo-url>
cd starttechpro-platform
npm install
```

### 2. Настройка окружения

Скопируйте `.env.example` в `.env.local` в каждом приложении:

```bash
cp .env.example apps/web/.env.local
cp .env.example apps/portal/.env.local
cp .env.example apps/internal/.env.local
```

### 3. Переменные окружения

#### Общие (все приложения)

| Переменная | Описание |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase проекта |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Публичный anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Сервисный ключ (только сервер) |

#### Платежи (YooKassa)

| Переменная | Описание |
|---|---|
| `YOOKASSA_SHOP_ID` | ID магазина в YooKassa |
| `YOOKASSA_SECRET_KEY` | Секретный ключ YooKassa |
| `YOOKASSA_PLATFORM_ACCOUNT` | ID счёта платформы (Split Payments) |

#### Хостинг (Vercel)

| Переменная | Описание |
|---|---|
| `VERCEL_TOKEN` | Токен Vercel API |
| `VERCEL_ORG_ID` | ID организации Vercel |

#### Домены (Reg.ru / Cloudflare)

| Переменная | Описание |
|---|---|
| `DOMAIN_REGISTRAR_PROVIDER` | `regru` или `cloudflare` |
| `DOMAIN_REGISTRAR_API_KEY` | API-ключ регистратора |
| `CLOUDFLARE_ZONE_ID` | ID зоны Cloudflare |

### 4. Запуск миграций БД

```bash
# Примените миграции через Supabase CLI или SQL-редактор
# Файлы миграций: supabase/migrations/001_*.sql ... 007_*.sql
```

Миграции применяются последовательно:
1. `001_financial_architecture.sql` — кошельки, транзакции, партнёры, инвестиции
2. `002_legal_compliance.sql` — профили, согласия (152-ФЗ)
3. `003_payments_subscriptions.sql` — платежи, подписки
4. `004_project_versions.sql` — версионирование проектов
5. `005_analytics.sql` — аналитика
6. `006_admin_tables.sql` — задачи, агенты, аудит
7. `007_support_tickets.sql` — тикеты поддержки

### 5. Запуск в режиме разработки

```bash
# Все приложения одновременно
npm run dev

# Или отдельно
cd apps/web && npm run dev
cd apps/portal && npm run dev
cd apps/internal && npm run dev
```

## Деплой

### Vercel

Каждое приложение деплоится отдельно:

```bash
# Публичный сайт
cd apps/web && vercel --prod

# Клиентский портал
cd apps/portal && vercel --prod

# Внутренняя панель
cd apps/internal && vercel --prod
```

### Переменные окружения на Vercel

Установите все переменные из `.env.example` в дашборде Vercel для каждого приложения.

## API-документация

### Публичный сайт (`apps/web`)

| Метод | Путь | Описание |
|---|---|---|
| POST | `/api/contacts` | Отправка контактной формы |

### Клиентский портал (`apps/portal`)

| Метод | Путь | Описание |
|---|---|---|
| GET | `/api/wallet/balance` | Баланс кошелька |
| GET | `/api/wallet/transactions` | История транзакций |
| POST | `/api/wallet/topup` | Пополнение кошелька |
| POST | `/api/yookassa/create-payment` | Создание платежа YooKassa |
| POST | `/api/yookassa/webhook` | Webhook YooKassa |
| POST | `/api/projects/create` | Создание проекта |
| GET | `/api/projects/[id]` | Статус проекта |
| GET | `/api/projects/list` | Список проектов |
| GET | `/api/live-editor/versions` | История версий |
| GET | `/api/analytics/[id]` | Метрики аналитики |
| POST | `/api/support` | Создание тикета |
| GET | `/api/support` | Список тикетов |
| GET | `/api/partner/stats` | Статистика партнёра |
| GET | `/api/investor/stats` | Статистика инвестора |
| GET | `/api/white-label/stats` | Статистика White-Label |

### Внутренняя панель (`apps/internal`)

| Метод | Путь | Описание |
|---|---|---|
| GET | `/api/admin/tasks` | Список задач |
| POST | `/api/admin/tasks` | Создание задачи |
| GET | `/api/admin/agents` | Выполнения агентов |
| GET | `/api/admin/audit-logs` | Журнал аудита |

## База данных

### Таблицы

| Таблица | Миграция | Описание |
|---|---|---|
| `user_wallets` | 001 | Кошельки пользователей |
| `wallet_transactions` | 001 | Транзакции |
| `projects` | 001 | Проекты |
| `partner_referrals` | 001 | Партнёрские рефералы |
| `project_investments` | 001 | Инвестиции в проекты |
| `platform_investors` | 001 | Инвесторы платформы |
| `white_label_licenses` | 001 | White-Label лицензии |
| `subscription_history` | 001 | История подписок |
| `profiles` | 002 | Профили с согласиями |
| `payments` | 003 | Платежи YooKassa |
| `subscriptions` | 003 | Подписки |
| `project_versions` | 004 | Версии проектов |
| `analytics_events` | 005 | События аналитики |
| `analytics_snapshots` | 005 | Снимки метрик |
| `tasks` | 006 | Задачи админ-панели |
| `agent_executions` | 006 | Выполнения AI-агентов |
| `audit_logs` | 006 | Журнал аудита |
| `support_tickets` | 007 | Тикеты поддержки |
| `contact_requests` | 007 | Запросы с сайта |

### RLS-политики

Все таблицы защищены Row Level Security:
- Пользователи видят только свои данные
- Service role имеет полный доступ
- Публичные таблицы (contact_requests) разрешают INSERT всем

## Пакет orchestrator

### Модули

| Модуль | Описание |
|---|---|
| `billing.ts` | Финансовая логика (15 функций) |
| `provisioner.ts` | Провижининг инфраструктуры (9 шагов + rollback) |
| `domain.ts` | Управление доменами (Reg.ru / Cloudflare) |
| `hosting.ts` | Управление хостингом (Vercel / Cloudflare Pages) |
| `live-editor.ts` | Версионирование проектов |
| `maintainer.ts` | Мониторинг и восстановление |
| `orchestrator.ts` | Оркестрация AI-агентов |
| `agents.ts` | Определения AI-агентов |
| `logger.ts` | Структурированное логирование |
| `cache.ts` | In-memory кэширование |
| `interfaces.ts` | Интерфейсы внешних API |
| `mock-apis.ts` | Mock-реализации для разработки |
| `supabase.ts` | Supabase service client |

### Режимы работы

- **Development (`NODE_ENV=development`):** все внешние API — mock
- **Production (`NODE_ENV=production` + `USE_REAL_APIS=true`):** реальные API

## Юридические документы

Все документы в папке `/legal`:
- `offer.md` — Публичная оферта (13 разделов)
- `privacy.md` — Политика обработки ПДн (11 разделов, 152-ФЗ)
- `consent.md` — Согласие на обработку ПДн
- `newsletter.md` — Согласие на рассылку

**Внимание:** Замените плейсхолдеры `[ФИО]`, `[номер]`, `[адрес]` перед публикацией.

## Чек-лист перед публикацией

### База данных
- [ ] Применить все миграции (001–007)
- [ ] Проверить RLS-политики
- [ ] Проверить триггеры (автосоздание кошелька, профиля, подписки)

### API
- [ ] Нет рекурсивных вызовов
- [ ] Все endpoints возвращают корректные ответы
- [ ] Rate limiting настроен

### Функционал
- [ ] Регистрация и логин работают
- [ ] Пополнение кошелька работает (YooKassa)
- [ ] Создание проекта работает
- [ ] Live Editor работает (версионирование)
- [ ] Аналитика показывает реальные данные
- [ ] Формы контактов и поддержки отправляются
- [ ] Все страницы открываются без 404

### Безопасность
- [ ] Service Role Key не утекает в клиентский код
- [ ] Все формы валидируются на сервере
- [ ] SQL-инъекции защищены (параметризованные запросы)
- [ ] XSS защищён (экранирование вывода)

### Юридическое
- [ ] Заменить плейсхолдеры в legal/*.md
- [ ] Проверить соответствие 152-ФЗ
- [ ] Проверить соответствие 54-ФЗ (чеки YooKassa)

---

© 2025 StartTechPro. Все права защищены.