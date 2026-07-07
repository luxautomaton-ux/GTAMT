import cityPackCatalog from './cityPackCatalog.js';
import regionalCityPackCatalog from './regionalCityPackCatalog.js';

const legalNote = 'No cheats, mod menus, stolen assets, fake coins, or exploit claims. Everything is legal strategy, templates, setup guidance, and fulfillment.';
const cityPackLegalNote = 'FiveM currently supports GTA V custom servers. GTA 6-inspired branding is marketing only; these products are original FiveM RP city identity packs with placeholders and legal setup guidance.';

const formatLabel = (value) => String(value)
  .split('_')
  .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
  .join(' ');

const regionalPayoutLines = [
  ['Owner', 30],
  ['Route Lead', 20],
  ['Driver', 20],
  ['Security', 15],
  ['Support', 10],
  ['Reserve', 5],
].map(([role, percent]) => `${role}: ${percent}%`);

const buildRegionalPolice = (id) => {
  const prefix = id.replace(/-rp$/, '').replace(/-/g, '_');

  return [
    `${prefix}_patrol_sedan`,
    `${prefix}_patrol_suv`,
    `${prefix}_interceptor`,
    `${prefix}_unmarked_unit`,
    `${prefix}_rescue_unit`,
  ];
};

const buildRegionalChannels = (id) => {
  const base = id.replace(/-rp$/, '');

  return [
    `${base}-announcements`,
    `${base}-rules`,
    `${base}-applications`,
    `${base}-business-permits`,
    `${base}-starter-jobs`,
    `${base}-support-tickets`,
  ];
};

const buildRegionalRoles = (city) => [
  'City Owner',
  'City Manager',
  'Police Command',
  'Business Owner',
  'VIP Resident',
  'New Arrival',
  ...city.starter_jobs.slice(0, 3).map((job) => `${job} Lead`),
];

const cityPackProducts = cityPackCatalog.map((city) => {
  const payoutLines = Object.entries(city.payouts).map(([role, percent]) => `${formatLabel(role)}: ${percent}%`);
  const flagship = city.id === 'vice-harbor-rp';

  return {
    id: city.id,
    category: 'City Packs',
    price: flagship ? '$149' : '$99',
    title: city.title,
    subtitle: 'FiveM RP city identity pack',
    image: `/assets/city-pack-art/${city.id}.png`,
    description: `${city.tag}. Includes city concept, districts, landmarks, factions, police placeholders, weather, payout model, Discord setup, and FiveM install notes.`,
    cardHighlights: [city.inspired_by, city.money[0], `${city.landmarks.length} landmarks + ${city.streets.length} districts`],
    includes: ['City concept README', 'city_config.lua', 'server-snippet.cfg', 'Discord template', 'Sales page copy', 'Security notes'],
    delivery: 'Instant ZIP-style city identity pack for FiveM / GTA V RP, with optional DFY install and Discord setup upsells.',
    whatItIs: `${city.title} is an original premium FiveM RP starter city identity pack. It gives server owners a ready concept, fictional factions, street grid, landmarks, weather rotation, police fleet placeholders, legal economy loops, crew payout splits, Discord setup, and install notes without cloned server assets or ripped branding.`,
    howItWorks: 'Use the city pack as your server identity blueprint, then connect licensed resources, QBCore or ESX, owned vehicle assets, MLOs, EUP, and hosting through your normal FiveM stack. The pack helps you sell a clear city concept before you spend weeks inventing lore, channels, roles, payout rules, and launch copy.',
    howToInstall: ['Download the city pack after checkout.', 'Copy city_config.lua into resources/[gmt]/gmt_city_engine/config/active_city.lua.', 'Paste server-snippet.cfg lines into your server.cfg.', 'Start or restart gmt_city_engine.', 'Test /citypack, /landmarks, /gangs, /streets, /payouts, /policefleet, and /securitycheck.', 'Replace placeholder police fleets and map assets with licensed or owned resources.'],
    howToMakeMoney: ['Sell the single city pack as a starter identity product.', 'Upsell Discord setup, txAdmin install, QBCore/ESX configuration, and launch QA.', 'Use the legal money loops as server business roles, VIP events, and member retention systems.', 'Bundle multiple city packs as the City Vault for higher-ticket buyers.', 'Offer monthly economy tuning, security hardening, and faction balancing support.'],
    content: `# ${city.title} Premium City Pack

Theme:
${city.tag}

Inspired by:
${city.inspired_by}

What it is:
An original FiveM / GTA V RP city identity pack with districts, landmarks, fictional factions, weather, payout rules, Discord setup, and installation notes.

Core landmarks:
${city.landmarks.map((item) => `- ${item}`).join('\n')}

Street grid:
${city.streets.map((item) => `- ${item}`).join('\n')}

Fictional factions:
${city.gangs.map((item) => `- ${item}`).join('\n')}

Legal money loops:
${city.money.map((item) => `- ${item}`).join('\n')}

Crew payout split:
${payoutLines.map((item) => `- ${item}`).join('\n')}

Discord channels:
${city.channels.map((item) => `- #${item}`).join('\n')}

Discord roles:
${city.roles.map((item) => `- ${item}`).join('\n')}

Spawn:
x ${city.spawn.x}, y ${city.spawn.y}, z ${city.spawn.z}, heading ${city.spawn.h}

Install:
1. Copy city_config.lua into resources/[gmt]/gmt_city_engine/config/active_city.lua.
2. Copy server-snippet.cfg lines into your server.cfg.
3. Start or restart the gmt_city_engine resource.
4. Test /citypack, /landmarks, /gangs, /streets, /payouts, /policefleet, and /securitycheck.
5. Replace placeholder police vehicles, logos, maps, and paid scripts with assets you own or license.

Money path:
Single city pack sale, DFY Discord setup, txAdmin install, custom server identity, City Vault bundle, and monthly economy tuning.

Legal note: ${cityPackLegalNote}`,
    cityPack: {
      inspiredBy: city.inspired_by,
      weather: city.weather,
      police: city.police,
      gangs: city.gangs,
      streets: city.streets,
      landmarks: city.landmarks,
      money: city.money,
      payouts: payoutLines,
      channels: city.channels,
      roles: city.roles,
      spawn: city.spawn,
    },
  };
});

const regionalCityPackProducts = regionalCityPackCatalog.map((city) => {
  const police = buildRegionalPolice(city.id);
  const channels = buildRegionalChannels(city.id);
  const roles = buildRegionalRoles(city);
  const streets = city.landmarks.map((landmark) => `${landmark} access route`);
  const moneyLoops = city.starter_jobs.map((job) => `${job} legal economy loop`);

  return {
    id: city.id,
    category: 'City Packs',
    price: `$${city.pricing.zip}`,
    title: city.premium_name,
    subtitle: `${city.region} FiveM RP city pack`,
    image: `/assets/city-pack-art/${city.id}.png`,
    description: `${city.tagline} Includes regional landmarks, fictional factions, starter jobs, weather rotation, Discord setup, pricing ladder, security notes, and FiveM install guidance.`,
    cardHighlights: [city.region, `$${city.pricing.discord} Discord setup upsell`, `${city.landmarks.length} landmarks + ${city.factions.length} factions`],
    includes: ['Regional city concept', 'city_config.lua', 'server-snippet.cfg', 'Discord template', 'Security playbook', 'Sales page copy'],
    delivery: 'Instant regional FiveM / GTA V RP city identity pack with optional Discord setup, install, custom city build, and monthly support upsells.',
    whatItIs: `${city.premium_name} is an original regional FiveM RP starter city identity pack for ${city.region}. It gives server owners a sellable city concept, regional landmarks, fictional factions, starter jobs, weather plan, Discord structure, security posture, pricing ladder, and setup notes without ripped cars, copied server files, real gang branding, or stolen police logos.`,
    howItWorks: 'Sell the ZIP as a starter city identity pack, then attach higher-ticket services: Discord setup, installed server identity, custom build work, support, security hardening, and economy tuning. The pack is the blueprint; Lux Automaton can use it to deliver a cleaner paid build for serious FiveM server customers.',
    howToInstall: ['Download the regional city pack after checkout.', 'Copy city_config.lua into resources/[gmt]/gmt_city_engine/config/active_city.lua.', 'Paste server-snippet.cfg lines into your server.cfg.', 'Start or restart gmt_city_engine.', 'Test /citypack, /landmarks, /streets, /factions, /payouts, /weatherplan, /moneyloops, and /securitycheck.', 'Replace placeholders with licensed or owned vehicles, maps, EUP, scripts, and logos before public launch.'],
    howToMakeMoney: [`Sell the single regional City Pack ZIP for $${city.pricing.zip}.`, `Upsell Discord setup for $${city.pricing.discord}.`, `Sell installed server identity setup for $${city.pricing.install}.`, `Use the pack as the base for custom city builds from $${city.pricing.custom}+.`, `Offer monthly support, security, and economy tuning at $${city.pricing.support}/mo.`, 'Bundle multiple regional packs into a higher-ticket City Vault offer.'],
    content: `# ${city.premium_name} Regional City Pack

Region:
${city.region}

Theme:
${city.tagline}

What it is:
An original regional FiveM / GTA V RP city identity pack with landmarks, fictional factions, starter jobs, weather rotation, Discord setup, pricing ladder, security notes, and installation guidance.

Pricing ladder:
- Single City Pack ZIP: $${city.pricing.zip}
- City Pack + Discord Setup: $${city.pricing.discord}
- Installed Server Identity: $${city.pricing.install}
- Full Custom City Build: $${city.pricing.custom}+
- Monthly Support / Security / Economy Tuning: $${city.pricing.support}/mo

Core landmarks:
${city.landmarks.map((item) => `- ${item}`).join('\n')}

Regional route grid:
${streets.map((item) => `- ${item}`).join('\n')}

Fictional factions:
${city.factions.map((item) => `- ${item}`).join('\n')}

Legal starter jobs:
${city.starter_jobs.map((item) => `- ${item}`).join('\n')}

Legal money loops:
${moneyLoops.map((item) => `- ${item}`).join('\n')}

Crew payout split:
${regionalPayoutLines.map((item) => `- ${item}`).join('\n')}

Discord channels:
${channels.map((item) => `- #${item}`).join('\n')}

Discord roles:
${roles.map((item) => `- ${item}`).join('\n')}

Weather rotation:
${city.weather.map((item) => `- ${item}`).join('\n')}

Police placeholders:
${police.map((item) => `- ${item}`).join('\n')}

Install:
1. Copy city_config.lua into resources/[gmt]/gmt_city_engine/config/active_city.lua.
2. Copy server-snippet.cfg lines into your server.cfg.
3. Start or restart the gmt_city_engine resource.
4. Test /citypack, /landmarks, /streets, /factions, /payouts, /weatherplan, /moneyloops, and /securitycheck.
5. Replace placeholder police vehicles, logos, maps, and paid scripts with assets you own or license.

Money path:
Single city pack sale, DFY Discord setup, installed server identity, custom city build, regional pack bundle, and monthly economy tuning.

Legal note: ${cityPackLegalNote}`,
    cityPack: {
      inspiredBy: city.region,
      weather: city.weather,
      police,
      gangs: city.factions,
      streets,
      landmarks: city.landmarks,
      money: moneyLoops,
      payouts: regionalPayoutLines,
      channels,
      roles,
      regional: true,
      pricing: city.pricing,
    },
  };
});

const coreTemplatesList = [
  {
    id: 'neon-garage-starter',
    category: 'Cars',
    price: '$39',
    title: 'Neon Garage Starter Pack',
    subtitle: 'GTA6 car meet business kit',
    image: './assets/store-art/neon-garage-starter.png',
    description: 'Launch a clean GTA6-style car meet product with event rules, VIP parking, photo prompts, sponsor slots, and a simple upsell path.',
    cardHighlights: ['GTA6-style garage event card', 'VIP parking and sponsor copy', 'Photo prompts for social proof'],
    includes: ['Garage event checklist', 'VIP parking tier copy', 'Photo prompt sheet', 'Sponsor placement map'],
    delivery: 'Instant template download after checkout, plus optional DFY customization request.',
    whatItIs: 'A ready-to-sell car meet launch kit for players, creators, and RP communities that want a premium garage event without risky game shortcuts. It gives you the event structure, rules, content angles, VIP parking language, sponsor slots, and recap prompts.',
    howItWorks: 'You choose a legal meeting location, announce the event with the included copy, assign simple staff roles, sell optional VIP parking or sponsor placements, and use the photo prompts to turn the event into content. The kit keeps the meet organized so it feels like a paid experience instead of a loose lobby hangout.',
    howToInstall: ['Download the pack after checkout.', 'Copy the event rules into Discord or your community page.', 'Paste VIP parking and sponsor copy into your checkout, Tebex, or request form.', 'Use the photo prompt sheet during the meet for thumbnails, shorts, and recap posts.', 'Save the recap notes so the next meet has proof and better pricing.'],
    howToMakeMoney: ['Sell VIP parking or featured-car slots.', 'Offer sponsor placement to crews, garages, streamers, or server brands.', 'Use the recap photos to sell the next event earlier.', 'Bundle it with a custom route, dealership, or garage economy service.', 'Turn every event into clips that push premium membership.'],
    content: `# Neon Garage Starter Pack

What it is:
A legal GTA6-style car meet launch kit with rules, VIP parking, sponsor slots, and photo prompts.

How it works:
Run a clean garage event, collect optional VIP/sponsor payments, capture content, then reuse the recap as proof for the next event.

Install:
1. Copy the event rules into Discord.
2. Add VIP parking copy to your checkout or request form.
3. Assign host, photographer, parking lead, and sponsor liaison.
4. Use the shot list during the event.

Money path:
VIP parking, sponsor slots, content recaps, premium member upsells.

Legal note: ${legalNote}`,
  },
  {
    id: 'rp-dealership-launch-kit',
    category: 'Cars',
    price: '$99',
    title: 'RP Dealership Launch Kit',
    subtitle: 'GTA6 vehicle economy product',
    image: './assets/store-art/rp-dealership-launch-kit.png',
    description: 'Build a legal RP dealership offer with showroom roles, sales scripts, finance rules, Discord channels, staff handoff tasks, and upgrade boundaries.',
    cardHighlights: ['Showroom role system', 'Sales and finance scripts', 'Staff handoff checklist'],
    includes: ['Showroom role map', 'Sales script pack', 'Finance policy template', 'Discord channel plan'],
    delivery: 'Delivered as Markdown templates and a setup checklist.',
    whatItIs: 'A dealership operations kit for RP servers and community owners who want a believable car business layer. It packages role assignments, showroom flow, legal pricing policies, finance rules, Discord channels, and staff handoffs.',
    howItWorks: 'The manager controls inventory and approvals, sales reps handle customer conversations, finance staff use the policy template, and mechanics or staff fulfill upgrades. The kit creates a repeatable customer journey from Discord inquiry to showroom visit to delivery.',
    howToInstall: ['Create dealership roles in Discord and your server staff guide.', 'Copy the showroom script into your staff handbook.', 'Add finance rules to your economy policy page.', 'Create application, sales-log, and delivery-log channels.', 'Run one test sale with staff before opening to members.'],
    howToMakeMoney: ['Sell dealership setup as a DFY server add-on.', 'Charge for premium showroom customization.', 'Create VIP vehicle delivery or featured listing tiers.', 'Use finance/admin policy as a paid audit upsell.', 'Bundle with Crew Garage Economy for a larger server build.'],
    content: `# RP Dealership Launch Kit

What it is:
A legal GTA6/RP dealership business template with showroom staff, sales scripts, finance rules, and Discord setup.

How it works:
Members move through inquiry, showroom, approval, payment, delivery, and support. Staff use scripted handoffs so the dealership feels premium.

Install:
1. Add Manager, Sales Rep, Mechanic Liaison, and Finance Desk roles.
2. Create showroom, applications, sales-log, and delivery-log channels.
3. Paste the finance rules into your economy policy.
4. Test one sale internally before launch.

Money path:
DFY dealership builds, VIP delivery, custom showroom packages, economy audits.

Legal note: ${legalNote}`,
  },
  {
    id: 'supercar-route-photo-pack',
    category: 'Cars',
    price: '$49',
    title: 'Supercar Route Photo Pack',
    subtitle: 'GTA6 creator thumbnail kit',
    image: './assets/store-art/supercar-route-photo-pack.png',
    description: 'A creator-ready card and content pack for legal supercar route videos, thumbnails, shorts, stream recaps, and premium CTA posts.',
    cardHighlights: ['Thumbnail prompt bank', 'Route recap structure', 'Shorts and stream titles'],
    includes: ['12 shot prompts', 'Thumbnail copy formulas', 'Route recap outline', 'Stream title bank'],
    delivery: 'Instant prompt pack and content outline download.',
    whatItIs: 'A visual content system for creators who want GTA6-style supercar money-route content without pretending to sell cheats. It includes shot prompts, thumbnail formulas, recap structures, stream title ideas, and CTA language.',
    howItWorks: 'You plan a legal route or event, capture the recommended shots, turn those shots into thumbnail options, then publish shorts and stream recaps that point viewers toward templates, memberships, or service requests.',
    howToInstall: ['Download the prompt pack.', 'Add the title bank to your notes app or content planner.', 'Copy the shot list into your stream checklist.', 'Create three thumbnails from one route session.', 'Link the premium store or route planner in the video description.'],
    howToMakeMoney: ['Increase click-through on route videos.', 'Sell thumbnail/photo prompt packs to creators.', 'Use the recap as a lead magnet for paid route planning.', 'Drive viewers into premium membership.', 'Upsell custom creator kits for crews or servers.'],
    content: `# Supercar Route Photo Pack

What it is:
A GTA6-style legal route content pack for thumbnails, clips, stream recaps, and creator CTAs.

How it works:
Capture high-intent shots, package them into thumbnails and shorts, then send viewers to a paid planner or member offer.

Install:
1. Add the shot prompts to your stream checklist.
2. Save the title bank in your content planner.
3. Record one route session.
4. Export thumbnails, shorts, and recap posts.

Money path:
Higher CTR, creator service upsells, route planner leads, premium membership conversions.

Legal note: ${legalNote}`,
  },
  {
    id: 'crew-garage-economy',
    category: 'Cars',
    price: '$59',
    title: 'Crew Garage Economy Blueprint',
    subtitle: 'GTA6 payout and inventory system',
    image: './assets/store-art/crew-garage-economy.png',
    description: 'A clean crew garage economy template for vehicle roles, repair pricing, inventory rules, payout splits, and weekly retention events.',
    cardHighlights: ['Repair pricing grid', 'Inventory and role rules', 'Weekly retention events'],
    includes: ['Repair price grid', 'Payout split rules', 'Inventory roles', 'Weekly event cadence'],
    delivery: 'Downloadable economy blueprint with customization notes.',
    whatItIs: 'A garage business blueprint for RP servers, crews, and community operators. It shows how to define vehicle roles, price repairs and cosmetics, assign inventory ownership, split payouts, and run weekly events.',
    howItWorks: 'Your garage becomes a repeatable service loop: members request repairs or cosmetics, staff complete the work, payouts follow a clear split, and weekly events keep customers returning. The rules help avoid staff confusion and economy abuse.',
    howToInstall: ['Copy the repair grid into your economy sheet.', 'Create owner, mechanic, inventory, and event roles.', 'Set payout percentages before launch.', 'Add weekly event cadence to Discord.', 'Review payouts after the first two events and adjust pricing.'],
    howToMakeMoney: ['Sell garage setup as a server add-on.', 'Offer VIP cosmetic packages.', 'Collect event entry or sponsor fees where allowed.', 'Use payout transparency to retain staff.', 'Upsell monthly economy tuning support.'],
    content: `# Crew Garage Economy Blueprint

What it is:
A legal GTA6-style garage economy template for repairs, cosmetics, inventory, payouts, and events.

How it works:
Players request services, garage staff fulfill them, payouts split by role, and weekly events keep demand moving.

Install:
1. Paste repair pricing into the economy sheet.
2. Create staff and inventory roles.
3. Publish payout split rules.
4. Schedule weekly garage events.

Money path:
Garage setup fees, VIP cosmetics, sponsored meets, monthly economy tuning.

Legal note: ${legalNote}`,
  },
  {
    id: 'legal-route-sprint',
    category: 'Player',
    price: '$19',
    title: 'Legal Route Sprint Planner',
    subtitle: 'GTA6 weekly route system',
    image: './assets/store-art/legal-route-sprint.png',
    description: 'A weekly planning system for legal in-game cash sessions, cooldowns, crew handoffs, session reviews, and premium coaching prompts.',
    cardHighlights: ['7-day legal route plan', 'Cooldown and payout tracker', 'Crew handoff checklist'],
    includes: ['Route timing sheet', 'Cooldown tracker', 'Crew handoff plan', '7-day review'],
    delivery: 'Instant Markdown planner download.',
    whatItIs: 'A simple weekly sprint planner for players who want organized legal money sessions. It replaces random grinding with planned routes, tracked payouts, cooldown notes, and a review loop.',
    howItWorks: 'You pick a route type, set session windows, track legal payouts, record cooldowns, and compare what actually worked at the end of the week. The planner makes the next week easier to optimize.',
    howToInstall: ['Download the planner.', 'Open it in Notion, Google Docs, Notes, or Markdown.', 'Set weekly income and time goals.', 'Log every legal route session.', 'Review the week and keep the highest-performing route.'],
    howToMakeMoney: ['Save wasted grind time.', 'Package your best routes as premium advice.', 'Use tracked results as proof for coaching.', 'Coordinate crew sessions with fewer missed payouts.', 'Upsell custom route planning for players who want a done-for-you plan.'],
    content: `# Legal Route Sprint Planner

What it is:
A GTA6-style legal route planner for weekly cash sessions, cooldowns, crew handoffs, and reviews.

How it works:
Plan routes, log payouts, track cooldowns, then repeat what performs best.

Install:
1. Copy into Notion, Docs, Notes, or Markdown.
2. Set route, goal, crew size, and session windows.
3. Log payout and cooldown after each run.
4. Review after 7 days.

Money path:
Better route efficiency, proof-backed coaching, custom route upsells.

Legal note: ${legalNote}`,
  },
  {
    id: 'crew-payout-ledger',
    category: 'Player',
    price: '$29',
    title: 'Crew Payout Ledger',
    subtitle: 'GTA6 transparent split tracker',
    image: './assets/store-art/crew-payout-ledger.png',
    description: 'Transparent payout split rules for legal RP crews and grinding teams, with role bonuses, dispute paths, and weekly recap notes.',
    cardHighlights: ['Role-based payout rules', 'Bonus and dispute path', 'Weekly recap sheet'],
    includes: ['Role ledger', 'Bonus rules', 'Dispute path', 'Weekly payout recap'],
    delivery: 'Instant ledger template download.',
    whatItIs: 'A payout ledger that helps crews avoid drama. It defines roles, base splits, bonuses, dispute rules, and recap notes so legal route teams know what everyone earned.',
    howItWorks: 'Before a session, the crew assigns roles and split rules. After the run, the host logs payouts, bonus conditions, and unresolved issues. Everyone can see the same rules before money is distributed.',
    howToInstall: ['Download the ledger.', 'Copy it into Google Sheets, Notion, or a Discord post.', 'Set base splits and bonus rules before the run.', 'Assign driver, scout, support, and host roles.', 'Publish the recap after the session.'],
    howToMakeMoney: ['Reduce crew churn and payout disputes.', 'Sell the ledger as part of a crew management package.', 'Use transparent records to attract serious players.', 'Bundle with Legal Route Sprint for a weekly team product.', 'Offer payout setup as a paid Discord/community service.'],
    content: `# Crew Payout Ledger

What it is:
A legal GTA6 crew split tracker for roles, bonuses, disputes, and weekly payout recaps.

How it works:
Assign roles before the session, log payouts after, and keep the same rules visible to the whole crew.

Install:
1. Copy the ledger to Sheets, Notion, or Discord.
2. Set base splits and bonus conditions.
3. Assign crew roles.
4. Publish the weekly recap.

Money path:
Better crew retention, paid crew management, route bundle upsells.

Legal note: ${legalNote}`,
  },
  {
    id: 'launch-week-content-map',
    category: 'Creator',
    price: '$39',
    title: 'Launch Week Content Map',
    subtitle: 'GTA6 creator schedule',
    image: './assets/store-art/launch-week-content-map.png',
    description: 'A GTA6 launch-week video plan for route guides, scam warnings, safe source checks, streams, clips, and subscriber calls to action.',
    cardHighlights: ['7-day video calendar', 'Shorts and stream prompts', 'Premium CTA map'],
    includes: ['7-day video plan', 'Shorts prompts', 'Stream CTA map', 'Premium funnel copy'],
    delivery: 'Instant content calendar download.',
    whatItIs: 'A launch-week content calendar for creators who want traffic without making risky claims. It maps videos, shorts, streams, safe-source posts, and premium CTAs into one week of publishing.',
    howItWorks: 'Each day has a content angle, a short-form prompt, a stream hook, and a CTA. You publish education and entertainment, then send viewers toward premium templates, services, or coaching.',
    howToInstall: ['Download the content map.', 'Copy the schedule into your calendar.', 'Assign one long-form, one short, and one CTA per day.', 'Add your store or Discord links.', 'Track which posts create members or service leads.'],
    howToMakeMoney: ['Turn launch traffic into premium members.', 'Sell sponsor spots in streams or recaps.', 'Use content to generate DFY service leads.', 'Package the calendar as a creator kit.', 'Reuse winning posts as evergreen funnels.'],
    content: `# Launch Week Content Map

What it is:
A GTA6 launch-week content calendar for route guides, scam warnings, streams, clips, and paid CTAs.

How it works:
Publish one focused content lane per day, then point traffic to templates, premium membership, or services.

Install:
1. Copy the 7-day map into your calendar.
2. Add stream links and CTA links.
3. Batch shorts before launch.
4. Track leads and member signups.

Money path:
Premium signups, sponsor slots, service leads, reusable content funnels.

Legal note: ${legalNote}`,
  },
  {
    id: 'obs-rp-scenes',
    category: 'Creator',
    price: '$49',
    title: 'OBS RP Scene Checklist',
    subtitle: 'GTA6 streaming scene system',
    image: './assets/store-art/obs-rp-scenes.png',
    description: 'A streaming setup checklist for Starting Soon, Live RP, BRB, Route Recap, guide recording, alerts, delay, and replay buffer.',
    cardHighlights: ['Scene collection blueprint', 'Delay and safety checklist', 'Replay buffer workflow'],
    includes: ['Scene list', 'Alert placement notes', 'Delay settings', 'Replay buffer checklist'],
    delivery: 'Instant OBS setup checklist download.',
    whatItIs: 'A professional OBS scene checklist for GTA6/RP streamers. It helps creators set up stream scenes, overlays, alerts, delay, replay buffer, and recap workflows without needing a full production team.',
    howItWorks: 'You build five core scenes, assign sources to each one, enable safety settings like delay and moderation, then use the replay buffer to capture clips that become shorts and recaps.',
    howToInstall: ['Download the checklist.', 'Open OBS and create the listed scenes.', 'Add Game Capture, webcam, alerts, chat, and audio sources.', 'Set 15-30 seconds of stream delay for RP safety.', 'Enable replay buffer and test recording before going live.'],
    howToMakeMoney: ['Improve stream quality for subscriptions and tips.', 'Sell custom scene setup as a service.', 'Turn replay clips into YouTube Shorts.', 'Bundle overlays with paid creator kits.', 'Use cleaner streams to attract sponsors or server partnerships.'],
    content: `# OBS RP Scene Checklist

What it is:
A GTA6/RP streaming setup checklist for scenes, alerts, delay, replay buffer, and recap content.

How it works:
Create the core scenes, add sources, enable safety delay, and capture clips during live sessions.

Install:
1. Create Starting Soon, Live RP, BRB, Route Recap, and Guide Recording scenes.
2. Add Game Capture, alerts, chat, webcam, and audio.
3. Set stream delay.
4. Test replay buffer and recording.

Money path:
Better streams, more clips, custom setup services, sponsor-ready content.

Legal note: ${legalNote}`,
  },
  {
    id: 'qbcore-server-starter',
    category: 'Server',
    price: '$79',
    title: 'QBCore Server Starter Pack',
    subtitle: 'GTA6/FiveM server launch system',
    image: './assets/store-art/qbcore-server-starter.png',
    description: 'A txAdmin-first starter checklist for QBCore setup, database prep, firewall, launch QA, roles, and clean server monetization planning.',
    cardHighlights: ['txAdmin setup path', 'Database and firewall checklist', 'Launch QA board'],
    includes: ['txAdmin checklist', 'Database prep', 'Firewall notes', 'Launch QA list'],
    delivery: 'Instant server starter checklist download.',
    whatItIs: 'A server launch checklist for operators building a legal RP/FiveM-style server business. It organizes hosting, artifacts, txAdmin, QBCore recipe setup, database prep, firewall, Discord, and launch QA.',
    howItWorks: 'You move through the setup sequence step by step: hosting first, txAdmin and framework next, database and firewall before public launch, then QA and monetization planning. It reduces missed setup steps.',
    howToInstall: ['Pick hosting or VPS.', 'Install recommended artifacts and start txAdmin.', 'Deploy QBCore through the recipe path.', 'Configure MariaDB/MySQL.', 'Open required ports and run launch QA before inviting players.'],
    howToMakeMoney: ['Sell starter server setup as a DFY service.', 'Create VIP/community packages through allowed monetization paths.', 'Use the checklist as a paid audit intake.', 'Bundle with Discord RP Server Template.', 'Offer monthly support after launch.'],
    content: `# QBCore Server Starter Pack

What it is:
A legal server launch checklist for txAdmin, QBCore, database, firewall, Discord, and launch QA.

How it works:
Follow a setup sequence so hosting, framework, database, ports, and QA are finished before players arrive.

Install:
1. Choose hosting or VPS.
2. Install artifacts and start txAdmin.
3. Deploy QBCore recipe.
4. Configure database and firewall.
5. Run launch QA.

Money path:
DFY server setup, audits, Discord bundle upsells, monthly support.

Legal note: ${legalNote}`,
  },
  {
    id: 'discord-rp-template',
    category: 'Server',
    price: '$49',
    title: 'Discord RP Server Template',
    subtitle: 'GTA6 community setup product',
    image: './assets/store-art/discord-rp-template.png',
    description: 'A Discord server template guide with channels, role tiers, applications, whitelist flow, support tickets, staff logs, and txAdmin status notes.',
    cardHighlights: ['Channel tree and role tiers', 'Whitelist and application flow', 'Support and staff logs'],
    includes: ['Channel tree', 'Role tiers', 'Application flow', 'Staff log plan'],
    delivery: 'Instant Discord server template guide.',
    whatItIs: 'A community operations template for GTA6/RP server owners. It gives you the channel structure, role tiers, rules, application flow, support tickets, staff logs, and status channel plan.',
    howItWorks: 'Members land in rules and announcements, apply through the application flow, get assigned roles, request support through tickets, and staff use logs to keep moderation organized.',
    howToInstall: ['Create a Discord server or duplicate your current one.', 'Build the included channel tree.', 'Create whitelist, VIP, staff, and support roles.', 'Paste rules and application copy.', 'Connect bot/status embeds only through secure token handling.'],
    howToMakeMoney: ['Sell Discord setup as a one-time product.', 'Upsell whitelist, VIP, and staff automation setup.', 'Bundle with QBCore Server Starter Pack.', 'Offer monthly community management support.', 'Use a clean Discord as proof for higher-ticket server builds.'],
    content: `# Discord RP Server Template

What it is:
A GTA6/RP Discord setup guide for channels, roles, applications, whitelist flow, support, and staff logs.

How it works:
Members follow a clear onboarding path and staff manage applications, tickets, and announcements from organized channels.

Install:
1. Create channel categories.
2. Add whitelist, VIP, member, and staff roles.
3. Paste rules and application copy.
4. Add support tickets and staff logs.
5. Connect bots with secure token handling.

Money path:
Discord setup sales, VIP role systems, server build bundles, monthly community support.

Legal note: ${legalNote}`,
  },
  {
    id: 'script-audit-report',
    category: 'Server',
    price: '$79',
    title: 'Script Audit Report Template',
    subtitle: 'GTA6 server security review',
    image: './assets/store-art/script-audit-report.png',
    description: 'A security, performance, dependency, webhook, admin command, and license review format for clean server script audits.',
    cardHighlights: ['Security and webhook review', 'Performance checklist', 'Fix-priority report'],
    includes: ['Risk worksheet', 'Webhook review', 'Admin command audit', 'Fix priority report'],
    delivery: 'Instant audit report template.',
    whatItIs: 'A professional report template for server owners who need script reviews. It structures findings around security, performance, dependencies, webhook exposure, admin commands, licenses, and recommended fixes.',
    howItWorks: 'You inspect each resource, log risks, mark severity, note evidence, and produce a prioritized fix list. The report turns technical cleanup into a paid service customers can understand.',
    howToInstall: ['Download the audit template.', 'Copy it into Docs, Notion, or your CRM.', 'Create one report per resource or script pack.', 'Fill in risk, evidence, severity, and recommended fix.', 'Export a PDF or send the report with a repair quote.'],
    howToMakeMoney: ['Sell script audits as a fixed-price service.', 'Upsell performance optimization.', 'Offer webhook and admin-command hardening.', 'Use the report as a lead-in to full server support.', 'Bundle recurring monthly audits for active servers.'],
    content: `# Script Audit Report Template

What it is:
A GTA6/RP server audit report for scripts, dependencies, webhooks, admin commands, licenses, and performance.

How it works:
Review each resource, log evidence, assign severity, and send a prioritized repair plan.

Install:
1. Copy into Docs, Notion, or CRM.
2. Create one audit per resource.
3. Fill out risk, evidence, severity, and fix.
4. Export report and quote repair work.

Money path:
Fixed-price audits, optimization upsells, hardening services, monthly support.

Legal note: ${legalNote}`,
  },
  {
    id: 'ttwo-research-log',
    category: 'Investor',
    price: '$19',
    title: 'TTWO Research Log',
    subtitle: 'GTA6 source-backed notes',
    image: './assets/store-art/ttwo-research-log.png',
    description: 'A source-backed research worksheet for Take-Two/Rockstar catalysts, risk notes, claim checks, earnings events, and scam-resistant investing habits.',
    cardHighlights: ['Catalyst tracker', 'Source and claim log', 'Risk decision journal'],
    includes: ['Catalyst tracker', 'Source log', 'Risk notes', 'Decision journal'],
    delivery: 'Instant research worksheet download.',
    whatItIs: 'A research worksheet for people tracking GTA6-related market catalysts around Take-Two without pretending to provide financial advice. It focuses on sources, dates, claims, catalysts, risks, and decision journaling.',
    howItWorks: 'You log each claim with a source, separate official information from social speculation, track catalysts like earnings or trailers, and write what would change your view. It teaches clean research habits.',
    howToInstall: ['Download the worksheet.', 'Open it in Sheets, Notion, or Markdown.', 'Add the source, date, claim, catalyst, and risk note for each item.', 'Keep social rumors separate from official sources.', 'Review the journal before making any personal decision.'],
    howToMakeMoney: ['Sell research organization as a premium education product.', 'Use clean catalyst notes for creator content.', 'Avoid fake coin and scam narratives that waste audience trust.', 'Bundle it with Investor Radar membership.', 'Use source-backed posts to attract serious subscribers.'],
    content: `# TTWO Research Log

What it is:
A GTA6-related Take-Two research worksheet for catalysts, sources, claims, risks, and decision notes. Not financial advice.

How it works:
Log every claim with a source and date, separate official news from rumors, and write what would change your view.

Install:
1. Copy into Sheets, Notion, or Markdown.
2. Add source, date, claim, catalyst, and risk.
3. Keep rumors separate.
4. Review before personal decisions.

Money path:
Premium education content, source-backed posts, Investor Radar membership, scam-resistant audience trust.

Legal note: ${legalNote}`,
  },
];

export const templatesList = [...coreTemplatesList, ...cityPackProducts, ...regionalCityPackProducts];
