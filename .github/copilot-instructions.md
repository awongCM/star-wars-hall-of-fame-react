# Star Wars Hall of Fame React - AI Agent Instructions

## Architecture Overview

This is a React 16.8+ single-page application using **react-router v3** (legacy) for navigation. The app displays Star Wars characters from SWAPI with voting, comments, and detail views. Key architectural points:

- **No build tooling exposed**: Uses `react-scripts` (Create React App). Run `npm start` on port 9090.
- **Dual persistence**: LocalStorage for client data (votes, comments) + SWAPI for character data.
- **ID workaround**: SWAPI doesn't provide IDs—they're manually generated from array indices in `Home.jsx` (`item.id = i`).

## Project Structure

```
src/
├── App.jsx                    # Router setup (react-router v3 with browserHistory)
├── component/
│   ├── MainApp/              # Wrapper component (minimal)
│   ├── Home/                 # Main grid view with pagination
│   ├── Grid/                 # Renders Item components in 4-column layout
│   ├── Item/                 # Character card with voting + trivia fetching
│   ├── Form/                 # Search filter (dropdown commented out)
│   ├── Pagination/           # Page navigation for SWAPI results
│   ├── Detail*/              # Detail pages for people/planets/films
├── services/
│   ├── api.js                # SWAPI fetch wrappers (async/await)
│   ├── localStorage.js       # Client data persistence
└── util/
    └── stringUtil.js         # String utilities
```

## Key Patterns & Conventions

### 1. Data Flow & State Management

- **No Redux/Context**: State lives in individual components using hooks (`useState`, `useEffect`).
- **Props drilling**: `Home.jsx` → `Grid.jsx` → `Item.jsx` for data and callbacks.
- **LocalStorage keys**: Use `pathname` (e.g., `/people/3`) as storage key. See `Detail.jsx` line 20.

### 2. SWAPI Integration Quirks

- **Base URLs**: Defined in `src/services/api.js` (people, planets, films, starships).
- **ID generation**: Since SWAPI lacks IDs, `Home.jsx` assigns `item.id = i` from array index (line 47).
- **Pagination**: SWAPI returns `next`/`previous` URLs. Parse page numbers from query strings (`?page=2`). See `Pagination.jsx` line 5-29.
- **Format param**: Use `?format=json` explicitly in fetch calls (e.g., `Detail.jsx` line 36).

### 3. Voting System

- **Votes stored in state**: `Item.jsx` tracks `up_vote`, `down_vote`, `overall_vote` locally.
- **Reordering**: After voting, `Item.jsx` calls `reorderItemsByOverallPopularity` to update `Grid.jsx` state, triggering a re-sort (descending by `overall_vote`).
- **Not persisted**: Votes reset on page reload (no localStorage for votes).

### 4. Trivia/Detail Fetching

- **Async pattern**: `Item.jsx` fetches related data (homeworld, films) via `Promise.all` and caches in localStorage using `pathname` as key (lines 79-114).
- **Loading state**: Shows `<LoadingIcon>` while fetching (line 14-18).
- **Data shape**: Trivia stored as `{ item_id, homePlanet, films }` array per pathname.

### 5. Comments Persistence

- **Detail pages**: Comments saved to localStorage on every update (`useEffect` watching `characterComments` array in `Detail.jsx` line 77).
- **Storage format**: `{ characterData, characterComments }` object keyed by pathname.
- **Clear data**: Instruct users to clear browser cookies/localStorage to reset.

## Development Workflow

### Running the App

```bash
npm install
npm start  # Runs on http://localhost:9090
```

### Testing

```bash
npm test  # react-scripts test runner (not heavily used)
```

### Common Tasks

**Adding a new route:**

1. Create component in `src/component/NewPage/`
2. Add route in `App.jsx` (use react-router v3 syntax: `<Route path="/new" component={NewPage} />`)
3. Ensure component receives `location` prop for pathname-based storage

**Extending dropdown filters:**

- Uncomment select in `Form.jsx` (line 20-30)
- Wire `onHandleDropdownQueryType` to fetch different SWAPI endpoints via `api.fetchURLBy()`

**Fixing ID navigation issues:**

- Current limitation: IDs are array-index-based, breaking on paginated results
- TODO in `Home.jsx` line 43: Consider scraping SWAPI resource URLs for unique IDs

## Known Limitations & TODOs

- **Pagination breaks detail links**: Navigating to characters on page 2+ uses incorrect IDs (index-based).
- **Detail components not DRY**: `Detail.jsx`, `DetailPlanet.jsx`, `DetailFilm.jsx` have duplicate logic (TODO line 1 in each).
- **Incomplete trivia**: Dynamic trivia creation for planets/films not fully implemented (`Item.jsx` line 60-70).
- **No backend**: Comments/votes stored client-side only (localStorage).

## Code Style Notes

- **CSS methodology**: SMACSS-based organization (Grid.css, Item.css, etc.)
- **Component pattern**: Migrated from class components to functional hooks (React 16.8+).
- **useEffect caveats**: Some components have `didMount` flags to separate mount/update logic—not best practice (see `Item.jsx` line 74).
- **Console logging**: Extensive `console.log` statements for debugging (retain for now).

## External Dependencies

- **SWAPI**: `https://swapi.dev/api/` (formerly `swapi.co`)
- **Font Awesome**: Used for loading spinner (`fa-refresh fa-spin` in `Item.jsx`)
- **react-router v3**: Legacy routing (not v4+). Use `browserHistory` and `<Link to={...}>`.

---

When working on this codebase, prioritize understanding the ID generation workaround and localStorage patterns before modifying data flows.
