export const paymentLinks = {
  premiumMonthly: {
    label: 'Join Premium',
    price: '$19/mo',
    provider: 'Stripe',
    url: '#stripe-premium-monthly',
  },
  basicTemplate: {
    label: 'Buy Template Pack',
    price: '$79',
    provider: 'Stripe',
    url: '#stripe-basic-template',
  },
  discordPack: {
    label: 'Buy Discord Pack',
    price: '$49',
    provider: 'PayPal',
    url: '#paypal-discord-pack',
  },
  obsPack: {
    label: 'Buy OBS Pack',
    price: '$49',
    provider: 'Stripe',
    url: '#stripe-obs-pack',
  },
  scriptAudit: {
    label: 'Book Script Audit',
    price: '$79',
    provider: 'Stripe',
    url: '#stripe-script-audit',
  },
  customServer: {
    label: 'Start Custom Build',
    price: '$299+',
    provider: 'Invoice',
    url: '#invoice-custom-server',
  },
  carPack: {
    label: 'Buy Car Pack',
    price: '$49',
    provider: 'Stripe',
    url: '#stripe-car-pack',
  },
  dealershipKit: {
    label: 'Buy Dealership Kit',
    price: '$99',
    provider: 'Stripe',
    url: '#stripe-dealership-kit',
  },
  cityPack: {
    label: 'Buy City Pack',
    price: '$99+',
    provider: 'Stripe',
    url: '#stripe-city-pack',
  },
  cityVault: {
    label: 'Buy City Vault',
    price: '$499+',
    provider: 'Invoice',
    url: '#invoice-city-vault',
  },
};

export const templateProducts = [
  {
    id: 'qbcore-starter',
    title: 'QBCore Starter Server ZIP',
    price: '$79',
    tier: 'Premium',
    paymentKey: 'basicTemplate',
    description: 'txAdmin recipe notes, starter resource manifest, SQL checklist, and launch video outline.',
    content: `# QBCore Starter Server Setup Guide
*Version 1.1 — FiveM Server Creation Desk*

### 1. Database Setup:
- Import raw SQL structure from database template.
- Establish txAdmin configurations.

### 2. Server Configuration:
\`\`\`cfg
ensure qb-core
ensure qb-vehicleshop
ensure qb-weapons
\`\`\``
  },
  {
    id: 'discord-template',
    title: 'Discord RP Server Template',
    price: '$49',
    tier: 'Premium',
    paymentKey: 'discordPack',
    description: 'Rules, applications, whitelist, VIP, staff, tickets, and txAdmin status channel structure.',
    content: `# Discord RP Server Channel Structure
*Pre-configured server outline*

### Channels:
- #rules-and-safety
- #announcements
- #whitelist-apply
- #vip-perks`
  },
  {
    id: 'discord-rp-recruitment',
    title: 'GTA VI Roleplay Recruitment & Interview Server Template',
    price: '$29.99',
    tier: 'Premium',
    paymentKey: 'discordPack',
    description: 'Xenon-compatible layout featuring interview queues, whitelist status logs, and full department ten-codes references.',
    content: `# GTA VI Roleplay Recruitment & Interview Server Template
*Xenon Template Config — Code: BeCBNxJcJaRv*

### 1. Discord Channel Architecture
\`\`\`text
👋 ── WELCOME & INFO
│   ├── #rules-and-safety
│   ├── #announcements
│   └── #server-status
📝 ── REGISTRATION
│   ├── #how-to-apply
│   ├── #whitelist-apps
│   └── #application-status
🎤 ── INTERVIEW HUB
│   ├── #interview-queue (Join to request voice interview)
│   ├── 🔊 | Waiting Room
│   ├── 🔊 | Interview Room 1
│   └── 🔊 | Interview Room 2
👮 ── LEO ACADEMY
│   ├── #ten-codes-reference
│   ├── #dispatch-logs
│   └── 🔊 | Dispatch Comm Room
\`\`\`

### 2. Essential Ten-Codes Reference
| Code | Meaning | Usage |
|---|---|---|
| **10-4** | Acknowledged / Message Received | General Comm |
| **10-8** | In Service / Active Duty | Shift Start |
| **10-10** | Fight in Progress | Tactical Alert |
| **10-19** | Return to Police Station | Post-Shift |
| **10-20** | State Your Current Location | Coordinate Check |
| **10-99** | Officer Needs Immediate Assistance | Critical Panic |

### 3. How to Deploy via Xenon Bot
1. Invite Xenon Bot to your Discord server.
2. Run the command: \`/template load name_or_id:BeCBNxJcJaRv\` in your moderation channel.
3. Allow the bot 60 seconds to configure and structure the channels.`
  },
  {
    id: 'obs-scene-collection',
    title: 'OBS GTA RP Scene Collection',
    price: '$49',
    tier: 'Premium',
    paymentKey: 'obsPack',
    description: 'Starting soon, live RP, route recap, BRB, alerts, chat, webcam, and replay-buffer setup.',
    content: `# OBS Studio Scene Collection
*Scene Layouts configuration*

### Scene 1: Starting Soon
- Video background: Oceanic drive loop.
- Overlay text: "Stream starting shortly..."`
  },
  {
    id: 'launch-week-playbook',
    title: 'GTA 6 Launch-Week Passive Capital Speedrun Playbook',
    price: '$19.99',
    tier: 'Premium',
    paymentKey: 'basicTemplate',
    description: 'Hourly action log and yield checklist to unlock passive businesses in the first 15 hours of GTA 6 launch week.',
    content: `# GTA 6 Launch-Week Passive Capital Speedrun Playbook
*Version 1.0 — GTA Money Team Strategy Desk*

### Phase 1: Fast Story Sprint (Hours 0 – 6)
- **Goal:** Unlock eastern Leonida highways, weapon licenses, and entry-level courier contracts.
- [ ] **Hour 1-2:** Skip non-essential side conversations; focus entirely on main story checkpoints.
- [ ] **Hour 3:** Buy the utility motorcycle (approx. $15,000) to cut cross-city travel times.
- [ ] **Hour 4-5:** Establish contact with local cargo warehouse logistics bosses.
- [ ] **Hour 6:** Store starter money in the bank. Do not purchase supercars.

### Phase 2: Active Courier Cycling (Hours 7 – 10)
- **Goal:** Accumulate $120,000 in liquid capital.
- [ ] **Hour 7:** Cycle the courier runs during story cooldowns (Yield: $8,000/run).
- [ ] **Hour 8:** Complete the cargo warehouse logistics onboarding contract.
- [ ] **Hour 9-10:** Coordinate 3 cargo warehouse shipment runs.

### Phase 3: Passive Purchase Phase (Hours 11 – 15)
- **Goal:** Acquire 3 passive revenue-generating properties.
- [ ] **Hour 12:** Purchase the Downtown Vice City Vending Chain (Cost: $80,000; Yield: $4,500/hr passive).
- [ ] **Hour 14:** Acquire the Leonida Keys Marina Dock license (Cost: $35,000; Yield: $2,000/hr passive).
- [ ] **Hour 15:** Purchase the Ocean Drive Newspaper Box Route (Cost: $10,000; Yield: $800/hr passive).`
  },
  {
    id: 'courier-operations-journal',
    title: 'GTA 6 Solo Courier Operations Journal',
    price: '$9.99',
    tier: 'Basic',
    paymentKey: 'basicTemplate',
    description: 'A daily tracker spreadsheet layout to log travel-time cuts, vehicle classes, and route cycles.',
    content: `# GTA 6 Solo Courier Operations Journal
*Tracking template for solo grinders*

### Daily Logistics Tracker:
| Shift ID | Route taken | Travel Time (Mins) | Cargo Class | Repairs Incurred | Total Payout |
|---|---|---|---|---|---|
| [Shift-01] | Vice City North -> Keys | 8.2 mins | Legal Cargo A | $0 | $12,500 |
| [Shift-02] | Ocean Drive Loop | 4.1 mins | Courier B | $150 | $8,200 |

### Travel-Time Cut Rules:
- Bypassing downtown highway blockades saves 1.5 minutes per run.
- Avoid using trucks during rain storms; swap to utility bikes.`
  },
  {
    id: 'crew-payout-ledger',
    title: 'GTA 6 Crew Payout Ledger Agreement',
    price: '$14.99',
    tier: 'Premium',
    paymentKey: 'basicTemplate',
    description: 'Structure crew percentage splits fairly. Defines cuts for heist leads, drivers, scouts, and pilots.',
    content: `# GTA 6 Crew Payout Ledger Agreement
*Standard crew payout splits for team operations*

### Role Splits Configuration:
- **Heist Organizer (Lead):** 40% (Covers setup fees, scouting planning, and logistics spec costs).
- **Specialist Driver (Getaway):** 20% (Responsible for vehicle mods, route escape execution).
- **Specialist Gunner (Security):** 20% (Responsible for fire coverage, weapon license supply).
- **Backup Support / Scout:** 20% (Responsible for bypass tool operations).

### Crew Payout Terms:
1. Payout logs must be posted publicly to the Crew Discord within 24 hours of operation.
2. Trial crewmates receive a flat 10% cut, with the remaining 10% redirected to the crew asset stash.`
  },
  {
    id: 'rp-server-rules',
    title: 'GTA 6 Roleplay Server Rulebook Template',
    price: '$24.99',
    tier: 'Premium',
    paymentKey: 'basicTemplate',
    description: 'Comprehensive guidelines and behavior terms for hosting compliant GTA roleplay servers.',
    content: `# GTA 6 RP Server Rulebook
*Standard Server Rules Template for Community Operators*

### 1. Behavior & Metagaming rules:
- **Metagaming:** Using out-of-character (OOC) knowledge to make in-game decisions is strictly prohibited.
- **Powergaming:** Actions that force a specific outcome on another player without giving them a fair chance to react are forbidden.

### 2. Moderation Escalation Grid:
- **First Offense:** Verbal Warning & OOC log notation.
- **Second Offense:** 24-hour server ban & appeal ticket required.
- **Third Offense:** Permanent server ban.`
  },
  {
    id: 'mod-resource-audit',
    title: 'GTA 6 Mod Resource Security Audit Checklist',
    price: '$29.99',
    tier: 'Premium',
    paymentKey: 'scriptAudit',
    description: 'Audit scripts, database triggers, and moderation hooks to prevent malware and DMCA issues.',
    content: `# GTA 6 Mod Resource Security Audit Checklist
*Security review checklist for custom RP server mods*

### 1. SQL injection & Trigger check:
- [ ] Review all inputs to confirm parameters are parameterized.
- [ ] Check server database loops to prevent nested memory leak issues.

### 2. DMCA & License audit:
- [ ] Verify that no copyrighted vehicle shapes or brand names exist in the resource directory.
- [ ] Check license keys for third-party scripts to avoid server shutdown.`
  },
  {
    id: 'youtube-guide-script',
    title: 'GTA 6 YouTube Guide Outline & Script Skeleton',
    price: '$12.99',
    tier: 'Basic',
    paymentKey: 'basicTemplate',
    description: 'Pre-written scripts and hook outlines to convert viewers into premium community subscribers.',
    content: `# GTA 6 YouTube Guide Outline
*YouTube Video Script Structure — High Conversion Yield*

### 1. The Hook (0 - 15 Seconds):
- **Visual:** High-speed courier bike maneuver.
- **Script:** "If you are playing GTA 6 and still grinding delivery jobs in traffic, you are wasting hours. Here is how I cut my travel times in half and bought a passive vending line in launch week. No exploits, no account risk. Let's roll."

### 2. The Conversion (Outro):
- **Script:** "If you want my custom speedrun checklist, click the link in the description to join the GTA Money Team. Grab the templates and let's stack."`
  },
  {
    id: 'tiktok-clip-planner',
    title: 'GTA 6 TikTok Hook & Clip Guide Planner',
    price: '$9.99',
    tier: 'Basic',
    paymentKey: 'basicTemplate',
    description: 'Outlines and checklists to batch 15-second mobile clips showing collectible coordinates.',
    content: `# GTA 6 TikTok Hook & Clip Guide Planner
*Short-form Video Operations Board*

### TikTok Clip Checklist:
- [ ] **Frame Size:** 9:16 layout, keep text inside safe zone margins.
- [ ] **Video length:** Under 25 seconds for maximum loops.
- [ ] **Caption tags:** #GTAVI #GTAMoney #GTATips

### Clip Template:
1. **0-3 Seconds:** Show a map screenshot with a flashing neon target ring.
2. **4-15 Seconds:** Rapid cut showing the exact path to find the asset.
3. **16-20 Seconds:** Flashing CTA: "Templates inside bio."`
  },
  {
    id: 'shipping-lane-logistics',
    title: 'GTA 6 Cargo Shipping Lane Logistics Sheet',
    price: '$14.99',
    tier: 'Premium',
    paymentKey: 'basicTemplate',
    description: 'Coordinated checkpoint guidelines for running multiple team cargo shipments securely.',
    content: `# GTA 6 Cargo Shipping Lane Logistics Sheet
*Team logistics coordination playbook*

### Checkpoint Schedule:
- **Checkpoint A (Ocean View):** Lead scout clears toll gates.
- **Checkpoint B (Marina Docks):** Cargo vehicle swaps drivers to reset cargo timer.
- **Checkpoint C (Key Highway):** Escort vehicle monitors highway merges.

### Security Protocol:
- If a hostile player approaches, deploy spikes at Checkpoint B and re-route shipment cargo via Key Highway exit 4.`
  },
  {
    id: 'vending-roi-calculator',
    title: 'GTA 6 Vending Business Acquisition Calculator',
    price: '$9.99',
    tier: 'Basic',
    paymentKey: 'basicTemplate',
    description: 'Formulas and ledger to input asset prices, hourly yields, and project break-even runs.',
    content: `# GTA 6 Vending Business Acquisition Calculator
*Asset ROI and Break-Even Planning Ledger*

### Calculator Logic:
- **Break-Even Hours** = Purchase Price / Hourly Passive Yield
- **Weekly Yield** = Hourly Passive Yield * 24 * 7

### Setup Variables:
- Vending Chain: Cost $80k, Yield $4,500/hr -> Break-Even: 17.7 hours of gameplay.
- Dock license: Cost $35k, Yield $2,000/hr -> Break-Even: 17.5 hours of gameplay.`
  },
  {
    id: 'discord-server-structure',
    title: 'GTA 6 Discord Server Structure Template',
    price: '$19.99',
    tier: 'Premium',
    paymentKey: 'discordPack',
    description: 'A layout checklist to organize channels, staff role configurations, and auto-moderator rules.',
    content: `# GTA 6 Discord Server Structure Template
*Discord Server Architecture Specs*

### 1. Channels list:
- #rules-and-safety (Public read-only)
- #announcements (Staff-only broadcasts)
- #solo-routes (Grinder discussions)
- #crew-recruiting (LFG portal)
- #ticket-support (Moderator assistance logs)

### 2. Role hierarchies:
- **Server Operator:** Full admin control.
- **Moderator Staff:** Timeout, kick, ban commands.
- **Verified Grinder:** Access to strategy rooms.`
  },
  {
    id: 'ttwo-stock-tracker',
    title: 'Take-Two (TTWO) Stock Tracker Worksheet',
    price: '$24.99',
    tier: 'Premium',
    paymentKey: 'basicTemplate',
    description: 'Investor tracking worksheet to log TTWO earnings calls, trailer counts, and catalyst watches.',
    content: `# Take-Two (TTWO) Stock Tracker Worksheet
*Investor research ledger - Educational Only*

### Catalyst Milestones list:
- [ ] **Trailer 2 Release:** Monitor global view counts and pre-order metrics.
- [ ] **Quarterly Earnings Call:** Check guidance revisions and sales forecasts.
- [ ] **Launch Day Payouts:** Track Take-Two stock reactions in first week.

### Watchlist variables:
- Record Take-Two (TTWO) opening price weekly to track launch momentum.`
  },
  {
    id: 'heli-traversal-schedule',
    title: 'GTA 6 Heli-Traversal Efficiency Schedule',
    price: '$9.99',
    tier: 'Basic',
    paymentKey: 'basicTemplate',
    description: 'Helicopter flight checkpoint schedule to bypass Vice City traffic and cut traversal time.',
    content: `# GTA 6 Heli-Traversal Efficiency Schedule
*Flight Checkpoint Strategy*

### Traverse coordinates:
- **Takeoff Port:** Marina Docks Helipad.
- **Merge Point:** Keys Bridge Highway.
- **Landing zone:** North Vice City Warehouse.

### Time savings:
- Car Traversal: 8.5 minutes in heavy traffic.
- Flight Traversal: 3.2 minutes flat (saves 5.3 minutes per cargo run).`
  },
  {
    id: 'private-lobby-checklist',
    title: 'GTA 6 Private Lobby Safety Checklist',
    price: '$7.99',
    tier: 'Basic',
    paymentKey: 'basicTemplate',
    description: 'A checklist to safely configure private sessions and run cargo without player disruptions.',
    content: `# GTA 6 Private Lobby Safety Checklist
*Grinder Safety Operations*

- [ ] Select **Invite-Only Session** from the main startup screen.
- [ ] Verify that matchmaking is set to **Disabled** in game settings.
- [ ] Invite crewmates using direct console IDs.
- [ ] Block random user queries to prevent server tracing.`
  },
  {
    id: 'yacht-operations-ledger',
    title: 'GTA 6 Yacht Operations Cost Ledger',
    price: '$14.99',
    tier: 'Premium',
    paymentKey: 'basicTemplate',
    description: 'Asset tracker to log yacht maintenance fees, VIP mission cycles, and hourly yield margins.',
    content: `# GTA 6 Yacht Operations Cost Ledger
*High-End Yacht Business Metrics*

### Cost factors:
- Crew Salary: $1,200/day.
- Port Maintenance: $500/day.

### VIP Mission cycles:
- **Mission A:** Payout $25,000; Cooldown 30 minutes.
- **Mission B:** Payout $18,000; Cooldown 20 minutes.
- **Hourly Margins:** approx. $38,000 after crew deductions.`
  },
  {
    id: 'car-export-logbook',
    title: 'GTA 6 Car Export Warehouse Logbook',
    price: '$11.99',
    tier: 'Basic',
    paymentKey: 'basicTemplate',
    description: 'Vehicle logbook listing collection classes, target resale prices, and repair budgets.',
    content: `# GTA 6 Car Export Warehouse Logbook
*Vehicle Export resales ledger*

### Class resales grid:
- **Supercar Class A:** Target Payout $100,000; Repair buffer $10,000.
- **Sportscar Class B:** Target Payout $75,000; Repair buffer $5,000.
- **SUV Class C:** Target Payout $50,000; Repair buffer $2,500.

### Rules:
- If cargo damage exceeds the repair buffer, scrap the vehicle immediately.`
  },
  {
    id: 'nightclub-shifts-agreement',
    title: 'GTA 6 Nightclub Staff Shifts & Operations Agreement',
    price: '$12.99',
    tier: 'Basic',
    paymentKey: 'basicTemplate',
    description: 'Nightclub popularity checklists, staff wage logs, and safe deposit deposit schedules.',
    content: `# GTA 6 Nightclub Staff Shifts Agreement
*Nightclub Operations checklist*

- [ ] **Shift Start:** Check safe deposit balance (Cap: $250,000).
- [ ] **Hourly Task:** Run a 2-minute VIP transport to maintain popularity.
- [ ] **Staff Pay:** Log bartender and security wages ($800/day).
- [ ] **Safe Deposit:** Empty safe every 4 gameplay hours.`
  },
  {
    id: 'leonida-gps-coordinates',
    title: 'GTA 6 Leonida Keys GPS Mapping Points',
    price: '$14.99',
    tier: 'Premium',
    paymentKey: 'basicTemplate',
    description: 'GPS path checklist featuring optimal coordinate sectors to retrieve cargo collections.',
    content: `# GTA 6 Leonida Keys GPS Mapping Points
*Collectible Cargo Coordinates checklist*

- [ ] Sector 1 (Keys Bridge): Under the main highway archway.
- [ ] Sector 2 (Marina Marina): Next to the fuel station pier.
- [ ] Sector 3 (South Cove): Beach cave entrance.
- [ ] Sector 4 (Key Highway): Behind the roadside motel sign.`
  },
];
