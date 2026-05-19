# UItraStore — Full-Stack Assignment

A realistic full-stack exercise covering a React frontend, a .NET Web API, and a data-scraping service.
The system has three parts that work together:

```
Store.API  ──(HTTP)──►  Scraper  ──(SQLite)──►  UItraStore.API  ──(HTTP)──►  ultrastore-client
(source data)           (collects & saves)       (serves products)            (React UI)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, React Query, Axios, React Router |
| Backend | .NET 8 Web API, Dapper, SQLite |
| Scraper | .NET 8 Console App **or** Node.js / TypeScript |
| Source data | .NET 8 Web API, Entity Framework Core, PostgreSQL |

---

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [PostgreSQL](https://www.postgresql.org/) 14+ (for the Store.API source data)

---

## Quick Start

### 1 — Start the source data API (Store.API)

This API serves the products the scraper will collect.

```bash
cd Store/Store.API
dotnet run
```

> Runs on **http://localhost:5000**.  
> On first start, it auto-migrates the database and seeds **1 000 products** across 5 categories.  
> PostgreSQL connection: `Host=localhost;Port=5432;Database=StoreDb;Username=postgres;Password=postgres`  
> (Override in `appsettings.json` if needed.)

### 2 — Run the scraper

**Option A — C# scraper (recommended, writes to SQLite)**

```bash
cd Scraper/Store.Scraper
dotnet run
```

The scraper writes to `scraper.db` (SQLite) in the working directory.  
Implement `ScrapeAsync()` in `Services/ScraperService.cs`.

**Option B — TypeScript scraper (writes to PostgreSQL)**

```bash
cd Scraper/store-scraper
npm install
npm run dev
```

Implement `scrape()` in `src/scraperService.ts`.

### 3 — Start UItraStore.API

```bash
cd UItraStore/UItraStore.API
dotnet run
```

> Reads from `scraper.db` and serves products on **http://localhost:5100**.  
> Run after the scraper so the database contains data.

### 4 — Start the React frontend

```bash
cd UItraStore/ultrastore-client
npm install
npm run dev
```

> Opens at **http://localhost:5173**. Vite proxies `/api` → `http://localhost:5100`.

---

## Project Structure

```
FullstackAssessment/
│
├── Store/                        # Source-data system (do not modify)
│   ├── Store.API/                # .NET 8 API — seeds 1 000 products
│   └── store-client/             # Reference React client (plain JS)
│
├── Scraper/
│   ├── Store.Scraper/            # C# scraper → scraper.db (SQLite)
│   │   └── Services/ScraperService.cs   ← implement ScrapeAsync()
│   └── store-scraper/            # TypeScript scraper → PostgreSQL
│       └── src/scraperService.ts        ← implement scrape()
│
└── UItraStore/
    ├── UItraStore.API/           # .NET 8 API reading from scraper.db
    │   ├── Controllers/ProductsController.cs  ← add validation
    │   └── Data/ProductRepository.cs          ← implement filtering & pagination
    └── ultrastore-client/        # React + TypeScript frontend
        └── src/
            ├── api/
            │   ├── client.ts     # Axios instance (ready to use)
            │   └── products.ts   ← implement React Query hooks
            ├── context/
            │   └── ProductContext.tsx  ← (bonus) Context API scaffold
            └── pages/
                ├── ProductsPage.tsx    ← implement filters & product list
                └── ProductDetailPage.tsx ← implement detail view
```

---

## Assignment Tasks

Complete the following tasks in the order that makes sense to you.  
You may skip the scraper section if you run out of time — the database can be pre-populated.

### Scraper

1. Implement `ScrapeAsync()` (C#) **or** `scrape()` (TypeScript).
   - Collect product data from the Store.API at `http://localhost:5000/api/products`
   - You may call the REST API directly or scrape the HTML — your choice
   - Save each product using the repository's `UpsertProduct` method (already implemented)
   - Generate a new `Guid` for each product's `Id`

2. **Bonus** — Implement duplicate prevention:
   - The `UPSERT / ON CONFLICT` logic is already present in the repository
   - Add a unique constraint on the `Name` column (or another suitable field) as a database index
   - Running the scraper twice should not create duplicate rows

### Backend (UItraStore.API)

1. Implement `GetProductsAsync` in `ProductRepository.cs`:
   - Build a dynamic `WHERE` clause supporting `search`, `category`, `minPrice`, `maxPrice`
   - Add `LIMIT` / `OFFSET` pagination

2. Add query-parameter validation in `ProductsController.cs`:
   - `page` ≥ 1
   - `pageSize` between 1 and 100
   - `minPrice` and `maxPrice` ≥ 0 when provided
   - `minPrice` must not exceed `maxPrice` when both are present
   - Return `400 Bad Request` with a descriptive message for invalid input

3. **Bonus** — Add a database index on the `Name` column in the SQLite `Products` table to improve search performance.

### Frontend (ultrastore-client)

1. Implement the three React Query hooks in `src/api/products.ts`:
   - `useProducts(filters)` — calls `GET /api/products` with filter params
   - `useProduct(id)` — calls `GET /api/products/:id`
   - `useCategories()` — calls `GET /api/categories`

2. Wire up `ProductsPage.tsx`:
   - Filters: search, category, min/max price
   - On card click, navigate to `/products/:id`

3. Implement `ProductDetailPage.tsx`:
   - Display product image, name, category, price, stock status, description, and dates

4. **Bonus — Debounce**: Prevent a new API request on every keystroke in the search field.
   Use `useRef` + `setTimeout` with a ~350 ms delay.

5. **Bonus — Context API**: Refactor to eliminate prop drilling.
   Implement `ProductProvider` and `useProductFilters` in `src/context/ProductContext.tsx`,
   then wrap the app in `<ProductProvider>` in `App.tsx`.

---

## API Reference

### Store.API (source — `http://localhost:5000`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/products` | Paginated products. Query: `page`, `pageSize`, `search`, `category` |
| `GET` | `/api/products/{id}` | Single product by integer ID |
| `GET` | `/api/categories` | All categories |

### UItraStore.API (`http://localhost:5100`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/products` | Paginated products. Query: `page`, `pageSize`, `search`, `category`, `minPrice`, `maxPrice` |
| `GET` | `/api/products/{id}` | Single product by GUID |
| `GET` | `/api/categories` | Distinct category names from the scraper database |

---

## Expected Deliverables

- Working scraper that populates `scraper.db` with products from Store.API
- `GET /api/products` with pagination, filtering, and input validation
- React frontend with:
  - Products list page with search, category, and price-range filters
  - Product detail page (`/products/:id`)
  - Routing between pages
- Code that is clean, consistently named, and production-oriented

---

## Time Expectations

| Task | Estimate |
|---|---|
| Scraper (basic) | 30–45 min |
| Backend filtering + validation | 30–45 min |
| Frontend hooks + products page | 45–60 min |
| Frontend detail page | 20–30 min |
| Bonuses (debounce, context, indexes) | 30–45 min |
| **Total** | **~3–4 hours** |

If you run short on time, prioritise the backend and frontend over the scraper.

---

## Notes

- The artificial delays in Store.API (`Task.Delay`) are intentional — they simulate a real network.
- `scraper.db` is auto-created when you run the scraper for the first time.
- If you prefer to skip the scraper, you can copy an existing `scraper.db` or seed the SQLite database manually.
- Both the C# and TypeScript scrapers share the same SQLite schema — pick whichever you are more comfortable with.
