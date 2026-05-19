# Interview Questions & Discussion Topics

Use these questions to assess depth of understanding after the coding exercise.
Not all questions apply to every candidate — choose based on what they implemented.

---

## Database & IDs

**Q: What is the difference between UUID and UUIDv7?**

> Classic UUIDs (v4) are randomly generated — they have no natural ordering.
> UUIDv7 embeds a millisecond-precision Unix timestamp in the most-significant bits,
> making them monotonically increasing. This is important for database B-tree indexes:
> random UUIDs cause page splits and index fragmentation; UUIDv7 inserts cheaply at
> the end of the index like an auto-increment integer.

---

**Q: What is the difference between offset pagination and cursor pagination?**

> **Offset** (`LIMIT n OFFSET k`): simple to implement, works well for small datasets.
> Problems: expensive on large tables (the DB must skip *k* rows), inconsistent results
> when rows are inserted/deleted between pages (rows can shift or appear twice).
>
> **Cursor**: records the last-seen value (e.g., `createdAt` + `id`) and uses a WHERE
> clause instead of OFFSET. Efficient regardless of page depth; stable under concurrent
> writes. Trade-off: you cannot jump to an arbitrary page number.

---

**Q: How would you validate `page`, `pageSize`, `minPrice`, and `maxPrice`?**

> `page` ≥ 1; `pageSize` in [1, 100]; `minPrice` ≥ 0; `maxPrice` ≥ 0;
> when both are provided, `minPrice` ≤ `maxPrice`.
> Use early returns with `BadRequest("…")` / `Problem(…)` before hitting the DB.
> A model-binding approach (FluentValidation / data annotations) is even cleaner.

---

**Q: What should the API return for invalid input?**

> HTTP `400 Bad Request` with a structured body.
> Ideally a `ProblemDetails` object (RFC 7807):
> ```json
> { "status": 400, "title": "Bad Request", "detail": "pageSize must be between 1 and 100." }
> ```
> Never return a `500` for input that the server can validate upfront.

---

**Q: What are the downsides of having too many database indexes?**

> Each index must be maintained on every `INSERT`, `UPDATE`, and `DELETE`.
> Indexes consume disk space and memory (buffer pool).
> The query planner can be confused into choosing a suboptimal index.
> For the scraper use-case (bulk inserts), too many indexes slow down ingestion
> significantly — it may be worth dropping non-critical indexes before bulk loading
> and recreating them afterwards.

---

## Scraper

**Q: What happens if the scraper inserts the same product twice?**

> Without a constraint: a duplicate row is created. Queries return the product twice;
> counts are inflated; UI shows duplicates.
> With a `UNIQUE` constraint + `INSERT … ON CONFLICT DO UPDATE` (UPSERT), the second
> run refreshes the existing row instead of duplicating it — fully idempotent.

---

**Q: Should there be a unique constraint? On which field?**

> Yes. The best candidate is the source system's identifier (the integer `Id` from Store.API)
> stored as a stable external reference. Using a scraper-generated GUID as the primary key
> means you need a *separate* unique column for the external ID to detect duplicates.
> Alternatively, a unique constraint on `Name` works for demo data but is fragile in
> production (two distinct products could share a name).

---

**Q: When would you use UPSERT / `ON CONFLICT`?**

> Whenever idempotency matters: scraping pipelines, data syncs, event-driven ingestion,
> or any job that may re-process the same record (retry on failure, re-run a pipeline).
> The alternative (SELECT then INSERT or UPDATE) introduces a race condition under
> concurrent writes and requires two round-trips.

---

**Q: If both a REST API and HTML scraping are available, which would you choose and why?**

> REST API — always. The API provides structured, typed data; no HTML parsing fragility;
> versioned contracts; often paginated cleanly.
> HTML scraping breaks silently when the layout changes, requires XPath / CSS selectors
> that are tightly coupled to presentation, and is much harder to maintain.
> HTML scraping is only a fallback when no API exists.

---

**Q: How would you parse a price string like `"₪1,299.90"`?**

> 1. Strip non-numeric characters: `price.replace(/[^0-9.]/g, '')` → `"1299.90"`
> 2. Parse to float: `parseFloat("1299.90")` → `1299.90`
> 3. Validate the result is a finite positive number before storing.
>
> Edge cases: thousands-separator vs decimal separator varies by locale
> (`"1.299,90"` is used in Germany). Identify the locale from the page before parsing.

---

## React / Frontend

**Q: What is the difference between `useQuery` and `useMutation`?**

> `useQuery` is for **reading** data. It runs automatically (on mount, on stale, on window
> focus), caches the result, and provides `isLoading`, `isError`, `data`.
>
> `useMutation` is for **writing** data (POST / PUT / DELETE). It does not run automatically;
> you call `mutate(variables)` explicitly. It provides `isPending` and an `onSuccess` /
> `onError` callback where you typically invalidate related queries.

---

**Q: What is an optimistic update?**

> Updating the UI immediately — before the server confirms the write — and rolling back
> if the request fails.
> React Query supports this via `onMutate` (update the cache), `onError` (rollback),
> and `onSettled` (re-fetch to sync with server truth).
> Benefit: snappy UX. Risk: briefly showing data the server rejected.

---

**Q: When is the Context API appropriate, and when is it not?**

> **Appropriate**: global or near-global state that many components need — theme, auth user,
> language, filter state shared across a page.
>
> **Not appropriate**: high-frequency updates (every keystroke), deeply nested data with
> complex update logic, or large apps where a state manager (Zustand, Redux Toolkit) gives
> better devtools, middleware, and selector granularity.
> Context re-renders *every* consumer when the value changes — be careful with large
> objects or frequent updates.

---

## API Design

**Q: What is the difference between `GET /products/123` and `GET /products?id=123`?**

> `GET /products/123` — resource-oriented REST. `123` is the identity of the resource;
> the path unambiguously refers to a single product. Correct semantically; better for
> caching (CDN, HTTP cache), logging, and access control.
>
> `GET /products?id=123` — filtering a collection by a query parameter. Semantically means
> "give me the products collection filtered by id=123". Technically works but is
> unconventional; not how REST is normally designed.

---

**Q: Should filtering happen in the frontend or the backend?**

> Backend — almost always.
> The database can filter millions of rows efficiently using indexes.
> Sending all rows to the client to filter in JS wastes bandwidth, memory, and is
> unusable at any meaningful data scale.
> Frontend filtering only makes sense when the full dataset is already in-memory and
> small (e.g., a dropdown list already fetched).

---

## Scalability

**Q: If the system grows from hundreds of products to millions, what architectural and performance changes would you make?**

> - **Indexes**: add indexes on `Price`, `CategoryName`, `Name` (or a full-text index).
> - **Pagination**: switch from offset to cursor-based pagination.
> - **Caching**: cache category lists and popular queries (Redis / HTTP Cache-Control).
> - **Search**: replace SQL `LIKE` with a dedicated full-text search engine (PostgreSQL FTS, Elasticsearch, Typesense).
> - **Scraper**: run as a scheduled job (cron / Hangfire) rather than a one-shot console app; add idempotency keys and retry logic.
> - **Database**: consider read replicas for the API; batch inserts in the scraper instead of row-by-row upserts.
> - **API**: add rate limiting, response compression, and consider a CDN in front of static/slow-changing data.

---

## Suggested Evaluation Criteria

| Area | What to look for |
|---|---|
| **Scraper** | Correct API calls or HTML parsing; uses `UpsertProduct`; assigns GUIDs; runs without errors |
| **Backend filtering** | Dynamic SQL built safely with parameterised queries; LIMIT/OFFSET correct |
| **Backend validation** | All four params validated; `400` returned with clear message; no `500` on bad input |
| **React Query hooks** | Correct `queryKey` (includes filter params); `enabled` flag on `useProduct`; error handled |
| **Detail page** | Route wired up; `useParams` used correctly; all fields displayed |
| **Code quality** | Consistent naming; no obvious security issues (SQL injection, XSS); no dead code |
| **Bonus: debounce** | `useRef` timeout cleared on each keystroke; search fires after delay only |
| **Bonus: context** | `createContext`, `useContext`, guard error; no prop drilling in ProductsPage |
| **Bonus: indexes** | At least one meaningful index added with justification |
| **Discussion** | Can explain *why* choices were made, not just *what* was done |
