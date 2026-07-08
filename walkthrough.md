# Scrolling Layout & Hybrid Navigation Walkthrough

We have integrated the exact visual scrolling layout, GSAP scroll-driven animations, video scrubbing, and custom fonts from the `AshimChoudhary/GTA-VI` repository. The codebase has been adapted to represent the **GTA Money Team** brand.

Additionally, we have split the single-page infinite scroll layout into a **hybrid architecture**:
1. **Home Landing Page (`'home'`)**: Stays exactly the same as the reference site, utilizing the cinematic scroll-masking and background video scrubs to deliver a gorgeous presentation of marketing info.
2. **Dedicated Tool Pages**: When a user clicks a nav link (or a preview call-to-action button on the landing page), they are routed to a clean, dedicated full-screen panel, letting each strategy tool and calculator shine on its own.

---

## Technical Audit & Bug Fixes

### Subpage Grid Layout Alignment
- **Root Cause:** Reusing scroll-animation classes (like `.jason`, `.jason-content`, and `.lucia-life` which have large GSAP-driven negative margins and scroll offsets) on standalone subpages pulled elements off-screen and caused layout breakdowns.
- **Solution:** Rewrote [LanaCoach.jsx](file:///Users/asaspade/Documents/Codex/2026-07-06/cr/work/lana-vice-os/src/sections/LanaCoach.jsx) and [Calculators.jsx](file:///Users/asaspade/Documents/Codex/2026-07-06/cr/work/lana-vice-os/src/sections/Calculators.jsx) to use container-safe layout grids (`grid lg:grid-cols-12 gap-8 items-start w-full`), allowing the chatbot terminal and estimators to render perfectly on standalone views.

### Black Screen Resolution
- **Root Cause:** CSS SVG mask rendering (`mask-image` and radial gradients) in the `.entrance-message` and `.mask-wrapper` containers failed to display correctly in WebKit/Blink-based browsers (such as Google Chrome, Safari, and Microsoft Edge) without the `-webkit-` vendor prefix, hiding the content and showing a solid black page.
- **Solution:** 
  - Added `-webkit-mask-image`, `-webkit-mask-repeat`, and `-webkit-mask-size` rules alongside standard mask declarations in [index.css](file:///Users/asaspade/Documents/Codex/2026-07-06/cr/work/lana-vice-os/src/index.css).
  - Configured `webkitMaskPosition` and `webkitMaskSize` keys inside [Hero.jsx](file:///Users/asaspade/Documents/Codex/2026-07-06/cr/work/lana-vice-os/src/sections/Hero.jsx) timeline animators to ensure Chrome and Safari process the GSAP scrubbed mask correctly.

---

## 🛍️ Strategy & Server Templates Shop (21 Products)

We have expanded the template products config to house **21 fully detailed digital strategy playbooks and configuration checklists** inside the database [paymentConfig.js](file:///Users/asaspade/Documents/Codex/2026-07-06/cr/work/lana-vice-os/src/data/paymentConfig.js):
- **Player Playbooks:** Launch-Week Passive Capital Speedrun, Solo Courier Operations, Crew Payout splits, Shipping Lane Checkpoints, Vending ROI spreadsheet formulas, Heli-Traversal checkpoint timings, Yacht VIP margins, Car Resale Warehouse, Nightclub popularity maintenance, and Leonida GPS Coordinates lists.
- **Server Operator Blueprints:** QBCore Starter setup, FiveM Server Discord layouts, **Discord RP Recruitment & Interview Server Template** (Xenon load key: `BeCBNxJcJaRv`), roleplay rulebook terms, mod source code audits, and Staff Moderator interview applications.
- **Creator Marketing Kit:** YouTube script hooks, TikTok clip guides, and recruiting copywriting templates.
- **Investor Radar:** Take-Two Interactive (TTWO) catalyst tracking worksheets.

### Features
- **Checkout Gates:** Integrates with Stripe/PayPal payment portals matching the active project state.
- **Visual & Edit modal:** Clicking "View & Copy" displays the raw copyable Markdown document layout directly in a CRT/neon terminal layout overlay.
- **File Downloads:** Members can click "Download Markdown" to export the playbook as a physical file instantly.
- **Clipboards Hook:** Quick clipboard copy buttons allow pasting routes directly into in-game chats or Discord logs.

---

## 🖥️ GTA VI Server Template & Interactive File Explorer

We have created a production-ready GTA VI Starter Server Template under the directory:
[gta6-server-template](file:///Users/asaspade/Documents/Codex/2026-07-06/cr/work/lana-vice-os/public/templates/gta6-server-template/)

### Included Files & Scripts:
1. **[server.cfg](file:///Users/asaspade/Documents/Codex/2026-07-06/cr/work/lana-vice-os/public/templates/gta6-server-template/config/server.cfg)** - Populated with defaults for database configs, slot limits, permissions rules, custom resources, and tags.
2. **[fxmanifest.lua](file:///Users/asaspade/Documents/Codex/2026-07-06/cr/work/lana-vice-os/public/templates/gta6-server-template/resources/%5Bcore%5D/moneyteam-core/fxmanifest.lua)** - Declares client/server loading bounds and game compatibility vectors.
3. **[player.lua](file:///Users/asaspade/Documents/Codex/2026-07-06/cr/work/lana-vice-os/public/templates/gta6-server-template/resources/%5Bcore%5D/moneyteam-core/server/player.lua)** - Handles player connection validation, session initializations, and exports role permission verification rules.
4. **[spawn.lua](file:///Users/asaspade/Documents/Codex/2026-07-06/cr/work/lana-vice-os/public/templates/gta6-server-template/resources/%5Bcore%5D/moneyteam-core/client/spawn.lua)** - Coordinates initial character loading, teleports, and custom map spawns.
5. **[README.md](file:///Users/asaspade/Documents/Codex/2026-07-06/cr/work/lana-vice-os/public/templates/gta6-server-template/README.md)** - Full step-by-step setup guides, folder navigation instructions, and marketing blueprints.

### Interactive Explorer:
We updated the **Server Lab** panel (`ServerLabPage` in `App.jsx`) to render an **interactive tree workspace browser**. Users can select files, view source code inside a CRT editor frame, copy the scripts, or download the full server package dynamically.

---

## 🎨 Premium Assets & Visual Backgrounds

We integrated custom high-resolution graphics to match the dark neon aesthetic:
* **[gta-money-team-banner.jpg](file:///Users/asaspade/Documents/Codex/2026-07-06/cr/work/lana-vice-os/src/assets/gta-money-team-banner.jpg):** A high-resolution 16:9 banner featuring illuminated pink/cyan vectors, gold lettering, silhouette palms, and oceanfront city lights.
* **Lana Profile Avatar Portrait:** Replaced the default asset file `lana-profile.png` with the user's high-quality graphic showcasing Lana holding the iPad/tablet with the "WEALTH ROUTE" display, adding instant visual polish to the chatbot desk.
* **Custom Subpage backgrounds:** Mapped the 5 newly uploaded high-resolution visuals of Lana to the active subpages using dynamic css inline background-attachments:
  * **Yacht Marina Background:** Services (`member-services`) & Launch Funnel (`launch-funnel`)
  * **Penthouse Office Background:** Calculators (`calculators`) & Server Forge (`server-forge`) & Investor Radar (`investor-radar`)
  * **Sunset Walk Beachside Background:** Templates Shop (`template-shop`) & Affiliate Stack (`affiliate-stack`)
  * **Teal Car Nightscape Background:** Scam Firewall (`scam-firewall`) & Member Access (`member-activation`)
  * **Rooftop Lounge Sunset Background:** Streaming Academy (`streaming-academy`)

---

## Verification Summary

### Production Compilation
- Run using `npm run build` and compiled successfully:
  ```bash
  vite v8.1.3 building client environment for production...
  ✓ built in 1.33s
  ```

### Syntax Validation
- Checked via `npx oxlint` and passed successfully:
  ```bash
  Found 0 warnings and 0 errors.
  Finished in 121ms on 27 files.
  ```

---

## 🚀 Brightened & Stretched Launch Board Backdrops

We have updated the background images on all Launch Board (home page) sections (including `LanaCoachPreview`, `CalculatorsPreview`, and `OutroPreview`) to stretch across the full sections and show much brighter:
- **Backdrop Stretching & Tiling Prevention:** Configured the background image scaling properties to `100% 100% !important` with `background-repeat: no-repeat !important;` on all Launch Board sections, ensuring the Vice City backdrop photo stretches to fit the full bounds of each section perfectly without repeating/tiling.
- **Overlay Brightening:** Dramatically reduced the opacity of the dark linear and radial gradient overlays, allowing the detailed background photos to shine through brightly while maintaining clean contrast and readability for the white headers and copy.
- **Drift Animation Removal:** Removed the sliding background-position keyframe drift animation to prevent any empty gaps/seams when stretching the photo.
- **Explicit CSS Properties:** Split the composite `background` shorthand property into individual, explicit declarations (`background-image`, `background-size`, `background-repeat`, `background-color`) to eliminate browser parsing quirks and ensure standard compliance across Blink/WebKit viewports.
