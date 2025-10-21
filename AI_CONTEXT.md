## AI_CONTEXT

This document gives an at-a-glance overview of the Chrome extension in this repo so a smart assistant can reason about the codebase quickly.

### What this project is
- **Name**: AI Search Router (Chrome Extension, Manifest V3)
- **Purpose**: Turn the browser omnibox into a universal AI launcher. Type the keyword `chat`, then your query or a service prefix (e.g., `g:` for ChatGPT) to open/search the chosen AI.

### Primary user flows
- **Omnibox**
  - Keyword: `chat` (see `manifest.json > omnibox.keyword`).
  - User types: `chat <query>` or `chat <alias>: <query>`.
  - Background script parses text, suggests completions, and opens the right AI with the query.
- **Context menu**
  - Right-click selection → "Search [Default AI] for '%s'".
- **Extension icon and popup**
  - Clicking the icon opens the default AI base URL.
  - Popup shows current default service, shortcuts, recent searches, and a settings button.

### Key files
- `manifest.json`
  - Declares MV3 extension, background service worker (`background.js`), omnibox keyword `chat`, action popup (`popup.html`), and permissions (`contextMenus`, `storage`).
- `background.js`
  - Core router logic. Holds `AI_SERVICES` with URL templates, parses omnibox input, generates suggestions, tracks usage in `chrome.storage.sync`, updates context menu and badge, opens tabs.
- `popup.html` + `popup.js`
  - Visual summary of the selected AI, shortcuts, recent searches, and tips. Opens default AI or the options page.
- `index.html`
  - Marketing/landing page for the project (not part of the extension runtime). Includes demo typing animation and links.
- `options.html` + `options.js`
  - Options UI (not inspected here), referenced by the manifest.

### Services and routing
- Services (as defined in `background.js > AI_SERVICES`): `chatgpt`, `copilot`, `claude`, `perplexity`.
  - Each service has: `name`, `url` (with `%s` placeholder), `baseUrl`, `icon`, `keywords`, `aliases`, `enabled`, `color`, `description`.
  - Example: ChatGPT uses `https://chatgpt.com/?q=%s` (background).
- Parsing rules (`parseOmniboxInput`):
  - Checks for `<keyword or alias>:` prefix (e.g., `gpt:`, `c:`, `ppl:`) → route to that service.
  - If no prefix: defaults to `defaultAI` (stored in sync storage; falls back to `chatgpt`).
  - Also detects space-separated hints like `gpt <query>`.
- Opening behavior:
  - On Enter, constructs `searchUrl` by replacing `%s` with `encodeURIComponent(query)`, opens in current/new tab per `disposition`.

### Suggestions and UX (omnibox)
- Shows a main suggestion for the detected/default service plus other services as alias suggestions (limited to 6).
- Quick switching suggestions if user typed ≤ 2 chars and matches an alias prefix.
- Recent search surfaced if it includes the current text.

### Storage schema (sync)
- Keys used in `background.js`:
  - `defaultAI`: string service id, e.g., `chatgpt`.
  - `userStats`: object
    - `totalSearches`: number
    - `serviceUsage`: map of serviceId → number
    - `recentSearches`: array of `{ service, query, timestamp }` (last 10)
    - `favoriteServices`: array of top 3 serviceIds
- Keys referenced in `popup.js` (UI data): `aiServices`, `statistics`, `recentSearches`, `defaultAI`.
  - `popup.js` also has a `getDefaultAIServices()` fallback with URLs using `{query}` placeholder.

### Known inconsistencies to be aware of
- `background.js` vs `popup.js` service catalogs differ:
  - Background uses `https://chatgpt.com/?q=%s`. Popup references `https://chat.openai.com/` base URL, and a separate default map with `{query}` placeholders.
  - Popup references a `gemini` service and colors; background does not define `gemini` in `AI_SERVICES` (though it references a `gemini` badge mapping).
  - Popup’s `populateShortcutsList` expects `services.find(...)` items (array) whereas earlier it constructs `allServices` from a map; ensure data shapes match when wiring settings.
- Consider consolidating service definitions to a single source of truth shared by background, popup, and options for consistency.

### Permissions
- `contextMenus`, `storage` (sync).

### Options/settings
- `manifest.json` → `options_page`: `options.html` (code not inspected here). Background and popup both listen/read `defaultAI` and related data from `chrome.storage.sync`.

### Badges and titles
- Badge text shows short code for current default service (`GPT`, `CLD`, `COP`, `PPX`).
- Badge background color and action title adapt to the default AI.

### Build/deploy
- This is a plain MV3 extension. To load unpacked: `chrome://extensions` → Enable Developer Mode → Load unpacked → select this folder.

### Privacy
- No network calls from the extension code itself; it only opens AI provider pages. User metrics are stored locally in `chrome.storage.sync`.

### Fast-start for a chatbot
- Default entry points: `background.js` for logic, `popup.js`/`popup.html` for UI, `manifest.json` for wiring.
- If asked to add a new AI provider:
  - Update `AI_SERVICES` in `background.js` with `url` and `baseUrl`.
  - Add `badge` short code in `updateExtensionTitle` if desired.
  - Align `popup.js` `getDefaultAIServices()` and any options UI to the same definition.
  - Ensure aliases and keywords are included for omnibox parsing.

### Potential next steps
- Unify service definitions into a shared module consumed by background, popup, and options.
- Add `gemini` to `background.js` or remove it from popup to avoid confusion.
- Make popup consume background-provided services via `chrome.runtime.sendMessage` or shared storage key to avoid schema drift.



