import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import './App.css';
import './styles/deep-server-money-scan.css';
import { paymentLinks } from './data/paymentConfig';
import { rockstarMediaCatalog } from './data/rockstarMediaCatalog';
import { leadsToCsv, loadLeads, loadMembership, saveLead, saveMembership } from './utils/localStore';
import { activateMember, loadCampaigns, loadOrders, loadTasks, recordCheckoutReturn, saveCampaign, saveTask, toCsv } from './utils/phase3Store';

// Sections & Previews for Home page
import Hero from './sections/Hero';
import Navbar from './sections/Navbar';
import FirstVideo from './sections/FirstVideo';
import SecondVideo from './sections/SecondVideo';
import Final from './sections/Final';

import LanaCoachPreview from './sections/LanaCoachPreview';
import CalculatorsPreview from './sections/CalculatorsPreview';
import CreatorKitPreview from './sections/CreatorKitPreview';
import OutroPreview from './sections/OutroPreview';

// Standalone interactive subpages
import LanaCoach from './sections/LanaCoach';
import Calculators from './sections/Calculators';
import TemplatesShop from './sections/TemplatesShop';
import TopServerBlueprint from './commerce/deepMoney/TopServerBlueprint';
import marinaBg from './assets/gta-money-team-lana-marina-bg.jpg';
import officeBg from './assets/gta-money-team-lana-office-bg.jpg';
import sunsetwalkBg from './assets/gta-money-team-lana-sunsetwalk-bg.jpg';
import nightcarBg from './assets/gta-money-team-lana-nightcar-bg.jpg';
import rooftopBg from './assets/gta-money-team-lana-rooftop-bg.jpg';
import mediaBg from './assets/gta-money-team-media-bg.png';

const brandBackdrop = './images/gta-money-team-city-billboard-backdrop.png';
const luxAutomatonLogo = './images/lux-automaton-logo.png';
const luxAgentLogo = './images/lux-agent-logo.png';
const gtaMoneyTeamLogo = './images/gta-money-team-logo.png';
const gmtTeamDayMarina = './assets/gmt-brand/gmt-team-day-marina.png';

const lanaDayShots = [
  { id: 'marina', title: 'Marina Money Coach', src: './assets/gmt-brand/lana-day-marina.png', page: 'HOME', note: 'Daytime marina strategy scene for member onboarding.' },
  { id: 'street', title: 'Coastal Route Scout', src: './assets/gmt-brand/lana-day-street.png', page: 'Money Intel', note: 'Sunny city research and legal money planning.' },
  { id: 'rooftop', title: 'Workshop Director', src: './assets/gmt-brand/lana-day-rooftop.png', page: 'Workshop', note: 'Premium course and training hub energy.' },
  { id: 'studio', title: 'Studio Host', src: './assets/gmt-brand/lana-day-studio.png', page: 'Media Vault', note: 'Content, media, and offer-building visual.' },
  { id: 'route', title: 'Causeway Planner', src: './assets/gmt-brand/lana-day-route.png', page: 'Calculators', note: 'Route math, legal cash-flow planning, and launch prep.' },
  { id: 'investor', title: 'Investor Radar Host', src: './assets/gmt-brand/lana-day-investor.png', page: 'Investor Radar', note: 'Market literacy without financial-advice claims.' },
];

const customerPageLinks = [
  ['home', 'HOME', 'Start here and see the core subscriber value.'],
  ['gta-news', 'GTA News', 'Latest GTA/Rockstar briefings and money angles.'],
  ['money-intel', 'Money Intel', 'Public server monetization signals and clean offer ideas.'],
  ['template-shop', 'Store', 'Digital products, city packs, and workshop vault offers.'],
  ['training-workshop', 'Workshop', 'Paid training hub, lessons, quizzes, and downloadable paths.'],
  ['calculators', 'Calculators', 'Model member, server, creator, and template revenue.'],
  ['server-lab', 'Server Forge', 'FiveM setup education, snippets, and pack planning.'],
  ['investor-radar', 'Investor Radar', 'TTWO market literacy and scam-aware research.'],
  ['launch-funnel', 'Launch Funnel', 'Turn traffic into members, downloads, and clean offers.'],
  ['media-vault', 'Media Vault', 'Official media study, videos, screenshots, and artwork.'],
  ['lana-coach', 'Lana Coach', 'Lux Agent coach for planning, strategy, and scripts.'],
  ['about', 'About', 'Brand story, team visuals, and Lux Automaton positioning.'],
  ['profile', 'Profile', 'Member dashboard and all-page command map.'],
  ['member-activation', 'Access', 'Membership status, workshop unlocks, and subscriber tools.'],
];

gsap.registerPlugin(ScrollTrigger);

const pageBackgrounds = {
  profile:              './assets/gmt-brand/lana-day-studio.png',
  about:                gmtTeamDayMarina,
  'launch-funnel':      marinaBg,
  'calculators':        officeBg,
  'server-lab':         officeBg,
  'gta-news':           mediaBg,
  'money-intel':        officeBg,
  'media-vault':        marinaBg,
  'investor-radar':     officeBg,
  'template-shop':      sunsetwalkBg,
  'member-activation':  nightcarBg,
  'training-workshop':  rooftopBg,
  'lana-coach':         marinaBg,
  'lux-ops':            officeBg,
};

const marketSnapshot = {
  ticker: 'TTWO',
  price: '$258.41',
  change: '+$3.34',
  checked: 'July 6, 2026, 21:59 UTC',
};

const pageProfiles = {
  profile: {
    label: 'Profile',
    title: 'Member command profile',
    description: 'A customer dashboard that shows subscription status, saved activity, and every GTA Money Team page from one place.',
    signal: 'Account map',
    accent: '#5dffb1',
    accent2: '#43e7ff',
    stats: [['17', 'pages'], ['$25/mo', 'workshop'], ['Lana', 'coach']],
    rail: ['Access status', 'Page map', 'Recent activity', 'Downloads path'],
  },
  about: {
    label: 'About',
    title: 'Built by Lux Automaton',
    description: 'GTA Money Team is a premium, legal, subscriber-focused training app powered by Lana from Lux Agent and created by Lux Automaton.',
    signal: 'Brand story',
    accent: '#ff6f91',
    accent2: '#ffd166',
    stats: [['Legal', 'strategy'], ['GTA', 'inspired'], ['Lux', 'built']],
    rail: ['Lana host', 'Founder visuals', 'Clean money focus', 'Subscriber value'],
  },
  'template-shop': {
    label: 'Store',
    title: 'Digital vault storefront',
    description: 'Sell legal route kits, Discord packs, OBS scenes, server templates, creator worksheets, and premium FiveM RP city and regional packs from one member store.',
    signal: 'Vault commerce',
    accent: '#f4a23a',
    accent2: '#ff6f91',
    stats: [['35', 'product SKUs'], ['23', 'city packs'], ['ZIP', 'delivery ready']],
    rail: ['City pack vault', 'Regional packs', 'Secure checkout', 'Related offers'],
  },
  calculators: {
    label: 'Calculators',
    title: 'Show them the money',
    description: 'Interactive calculators for legal in-game routes, subscriptions, server VIPs, template sales, streaming, and DFY pipelines.',
    signal: 'Revenue math',
    accent: '#5dffb1',
    accent2: '#ffd166',
    stats: [['6', 'calculators'], ['$25', 'member model'], ['4-week', 'route forecast']],
    rail: ['Route profit', 'MRR model', 'Server revenue', 'Creator income'],
  },
  'training-workshop': {
    label: 'Workshop',
    title: 'Premium Training Workshop',
    description: 'A paid-member training studio for legal GTA money routes, FiveM server businesses, creator systems, course drafts, quizzes, exports, and Lana-backed workshop planning.',
    signal: 'Workshop Sequence',
    accent: '#5dffb1',
    accent2: '#ff6f91',
    stats: [['6', 'courses'], ['24+', 'lessons'], ['XP', 'quiz engine']],
    rail: ['Route labs', 'Server money', 'Creator systems', 'Course exports'],
  },
  'member-activation': {
    label: 'Member Access',
    title: 'Workshop access center',
    description: 'Manage GTA Money Team Workshop access, unlock subscriber downloads, and return to your training path.',
    signal: 'Member access',
    accent: '#ff6f91',
    accent2: '#5dffb1',
    stats: [['Premium', 'tier'], ['GMT', 'access code'], ['$25/mo', 'workshop']],
    rail: ['Access code', 'Workshop vault', 'Member perks', 'Download path'],
  },
  'launch-funnel': {
    label: 'Launch Funnel',
    title: 'Traffic into paid members',
    description: 'Turn free guides, Discord traffic, YouTube tutorials, and launch checklists into premium members and custom service requests.',
    signal: 'Funnel builder',
    accent: '#ffd166',
    accent2: '#ff8a59',
    stats: [['3-step', 'offer map'], ['Lead', 'magnet ready'], ['CSV', 'campaign export']],
    rail: ['Lead magnet', 'Audience match', 'CTA design', 'Campaign storage'],
  },
  'investor-radar': {
    label: 'Investor Radar',
    title: 'Market literacy hub',
    description: 'Teach members how to track Take-Two/Rockstar catalysts, source claims, earnings events, and scam narratives without giving financial advice.',
    signal: 'Research only',
    accent: '#ffd166',
    accent2: '#5dffb1',
    stats: [[marketSnapshot.ticker, 'ticker'], [marketSnapshot.price, 'snapshot'], ['No', 'buy/sell calls']],
    rail: ['TTWO watch', 'Catalyst notes', 'Source habits', 'Scam warnings'],
  },
  'money-intel': {
    label: 'Money Intel',
    title: 'Server money intelligence',
    description: 'Study public RP monetization signals, turn them into original legal template offers, forecast revenue, and request clean setup services.',
    signal: 'Public signals only',
    accent: '#43e7ff',
    accent2: '#ff6f91',
    stats: [['10', 'market signals'], ['12', 'sellable offers'], ['No', 'copied assets']],
    rail: ['Queue systems', 'Whitelist flows', 'Tebex ladders', 'Ops retainers'],
  },
  'lana-coach': {
    label: 'Lana Coach',
    title: 'Lux Automaton AI host',
    description: 'Lana stays inside GTA Money Team as the branded Lux Agent coach for routes, funnels, servers, content, and member strategy.',
    signal: 'Coach online',
    accent: '#ff6f91',
    accent2: '#43e7ff',
    stats: [['4', 'starter prompts'], ['Fast', 'coach reply'], ['Lux', 'agent host']],
    rail: ['Route coaching', 'Crew payouts', 'Server hosting', 'Creator strategy'],
  },
  'money-courses': {
    label: 'Money Courses',
    title: 'Subscriber money academy',
    description: 'Structured courses for launch-week capital, route stacking, crew economy, creator income, and legal advantage systems.',
    signal: 'Training hub',
    accent: '#43e7ff',
    accent2: '#ffd166',
    stats: [['4', 'tracks'], ['Legal', 'strategy only'], ['Crew', 'team systems']],
    rail: ['Launch capital', 'Route stacking', 'Crew economy', 'Creator income'],
  },
  'route-planner': {
    label: 'Route Planner',
    title: 'Legal route playbooks',
    description: 'Plan solo, crew, and launch-week routes around legal cash flow, cooldown timing, and safe member execution.',
    signal: 'Routes mapped',
    accent: '#ffd166',
    accent2: '#43e7ff',
    stats: [['3', 'route modes'], ['Solo', 'starter lane'], ['Crew', 'split logic']],
    rail: ['Solo loops', 'Crew logistics', 'Launch week', 'Request build'],
  },
  'server-lab': {
    label: 'Server Forge',
    title: 'Paid server setup workspace',
    description: 'Build clean FiveM server offers, member access tiers, security systems, launch files, and monthly support paths.',
    signal: 'Forge live',
    accent: '#43e7ff',
    accent2: '#b46cff',
    stats: [['5', 'files'], ['Lua', 'core scripts'], ['CFG', 'server config']],
    rail: ['server.cfg', 'fxmanifest', 'player core', 'spawn script'],
  },
  'creator-kit': {
    label: 'Creator Kit',
    title: 'Content product lab',
    description: 'Package guides, PDFs, scripts, content batches, and lead magnets that turn gameplay knowledge into audience value.',
    signal: 'Content desk',
    accent: '#b46cff',
    accent2: '#ff6f91',
    stats: [['3', 'content lanes'], ['PDF', 'guide asset'], ['CTA', 'premium path']],
    rail: ['Video outlines', 'Viewer funnel', 'Content batching', 'PDF handoff'],
  },
  'media-vault': {
    label: 'Media Vault',
    title: 'Rockstar media command center',
    description: 'Browse official GTA VI videos, screenshots, artwork, and download packs for legal planning, content angles, launch research, and member education.',
    signal: 'Official media desk',
    accent: '#43e7ff',
    accent2: '#ff6f91',
    stats: [[rockstarMediaCatalog.counts.videos, 'videos'], [rockstarMediaCatalog.counts.screenshots, 'screens'], [rockstarMediaCatalog.counts.artworkWallpapers, 'artworks']],
    rail: ['Playable videos', 'Shot study', 'Download packs', 'Content angles'],
  },
  'gta-news': {
    label: 'GTA News',
    title: 'Newswire money desk',
    description: 'Latest GTA VI, Rockstar, Take-Two, creator, server, and scam-watch headlines converted into clean subscriber action plans.',
    signal: 'News desk live',
    accent: '#5dffb1',
    accent2: '#ff6f91',
    stats: [['8h', 'auto refresh'], ['RSS', 'source feed'], ['Legal', 'money angles']],
    rail: ['Official signals', 'Creator hooks', 'Investor notes', 'Scam checks'],
  },
  'lux-ops': {
    label: 'Lux Ops',
    title: 'Internal fulfillment desk',
    description: 'Operator-only local desk for leads, orders, tasks, campaign drafts, and export handoffs.',
    signal: 'Internal only',
    accent: '#43e7ff',
    accent2: '#5dffb1',
    stats: [['CSV', 'exports'], ['Local', 'storage'], ['Locked', 'operator desk']],
    rail: ['Leads', 'Orders', 'Tasks', 'Campaigns'],
  },
};

const defaultPageProfile = {
  label: 'GTA Money Team',
  title: 'Revenue workspace',
  description: 'A premium legal money-training workspace for players, creators, and server owners.',
  signal: 'Workspace ready',
  accent: '#43e7ff',
  accent2: '#ff6f91',
  stats: [['Legal', 'strategy'], ['Lana', 'coach'], ['Lux', 'automaton']],
  rail: ['Plan', 'Build', 'Track', 'Launch'],
};

const featuredNewsVideos = [
  rockstarMediaCatalog.videos.find((video) => video.title === 'Grand Theft Auto VI Trailer 2'),
  rockstarMediaCatalog.videos.find((video) => video.title === 'Grand Theft Auto VI Trailer 1'),
  rockstarMediaCatalog.videos.find((video) => video.title === 'Official Cover Art Animation'),
  ...rockstarMediaCatalog.videos.filter((video) => !video.title.includes('Trailer') && video.title !== 'Official Cover Art Animation'),
].filter(Boolean).slice(0, 5);

function PageHero({ profile }) {
  return (
    <section className="revenue-page-hero">
      <div className="revenue-hero-copy">
        <span className="revenue-page-label">{profile.label}</span>
        <h1>{profile.title}</h1>
        <p>{profile.description}</p>
        <div className="revenue-brand-strip">
          <span>Powered by Lana from Lux Agent</span>
          <span>Created by Lux Automaton</span>
        </div>
      </div>
      <BrandBackdropPanel />
      <div className="revenue-quick-stats">
        {profile.stats.map(([value, label]) => (
          <article key={`${value}-${label}`}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function BrandBackdropPanel() {
  const brandMarks = [
    { label: 'Lux Automaton', src: luxAutomatonLogo, className: 'lux-auto-mark' },
    { label: 'Lux Agent', src: luxAgentLogo, className: 'lux-agent-mark' },
    { label: 'GTA Money Team', src: gtaMoneyTeamLogo, className: 'gta-money-mark' },
  ];

  return (
    <aside className="revenue-hero-art brand-backdrop-panel" aria-label="Lux Automaton, Lux Agent, and GTA Money Team branded backdrop">
      <img src={brandBackdrop} alt="" className="brand-backdrop-image" />
      <div className="brand-backdrop-glass">
        {brandMarks.map((mark) => (
          <div className={`brand-mark-card ${mark.className}`} key={mark.label}>
            <img src={mark.src} alt={mark.label} />
          </div>
        ))}
      </div>
      <div className="brand-backdrop-ad">
        <span>GTA Money Team Advertisement Backdrop</span>
        <strong>Lux Automaton x Lux Agent</strong>
      </div>
      <div className="brand-motion-line brand-motion-line-one" />
      <div className="brand-motion-line brand-motion-line-two" />
      <div className="brand-pulse-dot brand-pulse-dot-one" />
      <div className="brand-pulse-dot brand-pulse-dot-two" />
    </aside>
  );
}

function PageRail({ profile }) {
  return (
    <aside className="revenue-command-rail">
      <div className="rail-card rail-focus">
        <span>Current focus</span>
        <strong>{profile.signal}</strong>
        <p>{profile.description}</p>
      </div>
      <div className="rail-card">
        <span>Money team stack</span>
        <div className="rail-meters">
          <div><i style={{ width: '92%' }} />Legal strategy</div>
          <div><i style={{ width: '78%' }} />Subscriber value</div>
          <div><i style={{ width: '84%' }} />Service upside</div>
        </div>
      </div>
      <div className="rail-card">
        <span>Page tools</span>
        <ul>
          {profile.rail.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

// Data constants for subpage layouts
const plannerRoutes = {
  Solo: [
    {
      name: 'Starter Courier Flow',
      yield: 'Low Risk / Fast Cash',
      desc: 'Optimized batch delivery routes across Vice City. Minimizes travel time by stacking deliveries chronologically.',
      steps: ['Purchase basic utility motorcycle', 'Map the delivery hubs', 'Cycle routes during cooldowns'],
    },
    {
      name: 'Legal Cargo Batching',
      yield: 'Medium Risk / High Yield',
      desc: 'Secure contracts for legal warehouses. Run supply operations using optimal highway splits.',
      steps: ['Invest in cargo truck', 'Acquire warehouse licenses', 'Stack route contracts to reduce dry runs'],
    },
  ],
  Crew: [
    {
      name: 'Organized Shipments',
      yield: 'Coordinated Logistics',
      desc: 'Form a transport line with multiple crew trucks. Protect shipments without relying on aggressive exploits.',
      steps: ['Designate lead security scouts', 'Run double-cargo transports', 'Divide cuts evenly based on progression rules'],
    },
    {
      name: 'Leonida Keys Logistics',
      yield: 'Passive Team Wealth',
      desc: 'Establish multi-business shipping lanes. Coordinate routes so cargo trucks arrive sequentially, bypassing backup delays.',
      steps: ['Establish active shipping lanes', 'Stack vehicle classes', 'Run team checkpoints'],
    },
  ],
  'Launch Week': [
    {
      name: 'Story Speedrun Progression',
      yield: 'Maximizing Basic Capital',
      desc: 'Prioritize story missions to unlock the map and basic purchasing options as fast as possible.',
      steps: ['Avoid early supercar purchases', 'Redirect 60% of capital to basic assets', 'Unlock passive properties by hour 15'],
    },
    {
      name: 'Utility Helicopter Acquisition',
      yield: 'Efficiency Multiplier',
      desc: 'Save all starter capital to buy a legal helicopter to bypass Vice City traffic and cut mission times by 50%.',
      steps: ['Save starter funds', 'Acquire flight license early', 'Coordinate helicopter pick-ups'],
    },
  ],
};

const serverForgeImages = {
  hero: './assets/server-forge/server-forge-hero.png',
  monetization: './assets/server-forge/server-forge-monetization.png',
  community: './assets/server-forge/server-forge-community.png',
  security: './assets/server-forge/server-forge-security.png',
};

const serverMonetizationOffers = [
  {
    id: 'founder-pass',
    name: 'Founder Pass',
    price: '$25-$75/mo',
    type: 'Access',
    image: serverForgeImages.monetization,
    description: 'Early supporter status, private launch announcements, founder events, and a visible community role.',
    delivery: 'Discord role, welcome message, founder channel, event access, and member badge.',
    setup: ['Create the Founder Pass package.', 'Connect the purchase to a Discord role.', 'Publish founder rules and refund notes.', 'Schedule founder preview night.'],
    avoid: 'Do not promise wins, cash-outs, or unfair gameplay power.',
  },
  {
    id: 'priority-review',
    name: 'Priority Review',
    price: '$10-$25',
    type: 'Workflow',
    image: serverForgeImages.community,
    description: 'Fast application processing for serious players without guaranteeing acceptance.',
    delivery: 'Application queue lane, review SLA, Discord ticket routing, and acceptance/rejection templates.',
    setup: ['Create the review package.', 'Add a clear no-guarantee disclaimer.', 'Route orders to the application channel.', 'Assign staff review owners.'],
    avoid: 'Do not sell automatic whitelist approval.',
  },
  {
    id: 'priority-queue',
    name: 'Priority Queue',
    price: '$15-$50/mo',
    type: 'Access',
    image: serverForgeImages.monetization,
    description: 'Monthly convenience access for supporters who want faster entry during busy sessions.',
    delivery: 'Queue tier, Discord role sync, renewal reminder, and support channel access.',
    setup: ['Create monthly queue tiers.', 'Name each tier clearly.', 'Sync roles through the store flow.', 'Test access before public launch.'],
    avoid: 'Do not attach gameplay advantage to queue status.',
  },
  {
    id: 'creator-pass',
    name: 'Creator Partner',
    price: '$25-$99/mo',
    type: 'Creator',
    image: serverForgeImages.community,
    description: 'A media-friendly lane for streamers, editors, and short-form creators who can drive server attention.',
    delivery: 'Creator role, media kit, event calendar, clip prompts, and partner intake form.',
    setup: ['Create creator application form.', 'Build a media kit folder.', 'Schedule weekly events.', 'Track creator clips and Discord joins.'],
    avoid: 'Do not guarantee creator income or paid view counts.',
  },
  {
    id: 'cosmetic-pack',
    name: 'Cosmetic Supporter Pack',
    price: '$9-$49',
    type: 'Cosmetic',
    image: serverForgeImages.monetization,
    description: 'Original visual identity perks that support the server without changing gameplay balance.',
    delivery: 'Supporter tag, cosmetic concepts, role badge, non-advantage vehicle wrap ideas, and usage notes.',
    setup: ['List cosmetic-only perks.', 'Confirm assets are original or licensed.', 'Add delivery notes.', 'QA each cosmetic in staging.'],
    avoid: 'Do not use real brands, real police marks, or stolen assets.',
  },
  {
    id: 'business-license',
    name: 'Business RP License',
    price: '$15-$79',
    type: 'RP Identity',
    image: serverForgeImages.community,
    description: 'Paid application and setup packet for players who want a structured in-character business.',
    delivery: 'Business application, staff review flow, signage notes, Discord category, and RP rules.',
    setup: ['Create business application form.', 'Define allowed business types.', 'Add staff approval workflow.', 'Publish payout and abuse rules.'],
    avoid: 'Do not sell monopolies, unfair economy control, or guaranteed profit.',
  },
  {
    id: 'event-night',
    name: 'Event Night Pass',
    price: '$5-$25',
    type: 'Event',
    image: serverForgeImages.community,
    description: 'Ticketed creator nights, city showcases, launch parties, car meets, and community events.',
    delivery: 'Event role, calendar invite, attendance cap, event rules, and recap content workflow.',
    setup: ['Create event package.', 'Set attendance limits.', 'Publish event rules.', 'Prepare post-event clips and recap.'],
    avoid: 'Do not run gambling, cash prizes, or chance-based rewards.',
  },
  {
    id: 'staff-training',
    name: 'Staff Training Pack',
    price: '$49-$199',
    type: 'B2B',
    image: serverForgeImages.security,
    description: 'Training system for moderators, reviewers, police leads, support staff, and event operators.',
    delivery: 'Staff SOP, role matrix, escalation map, review scripts, and weekly ops checklist.',
    setup: ['Write role responsibilities.', 'Create onboarding checklist.', 'Set staff permissions.', 'Run a pre-launch staff drill.'],
    avoid: 'Do not copy manuals or private rules from top servers.',
  },
  {
    id: 'security-audit',
    name: 'Security Audit',
    price: '$79-$299',
    type: 'Defense',
    image: serverForgeImages.security,
    description: 'Anti-abuse review covering permissions, admin commands, logs, backups, staff access, and risky resources.',
    delivery: 'Audit checklist, risk report, fix priorities, permission matrix, and backup plan.',
    setup: ['Review ACE permissions.', 'Audit admin commands.', 'Check resource licenses.', 'Test backups and rollback.'],
    avoid: 'Defensive review only. No bypasses, exploits, malware, or account theft.',
  },
  {
    id: 'full-launch-vault',
    name: 'Full Launch Vault',
    price: '$199-$499',
    type: 'Bundle',
    image: serverForgeImages.hero,
    description: 'Complete creator-led RP launch blueprint with configs, Discord, store products, scripts, content, and safety rules.',
    delivery: 'Server config pack, Discord map, product ladder, launch checklist, creator scripts, and security SOP.',
    setup: ['Download the vault.', 'Pick the offer ladder.', 'Build Discord and store pages.', 'Run soft launch and QA.'],
    avoid: 'Do not claim official affiliation or sell GTA 6 server access before support exists.',
  },
];

const serverLaunchPhases = [
  ['01', 'Foundation', 'Pick an original server name, create Discord, set staff roles, prepare txAdmin/FiveM hosting, and test the resource pack.'],
  ['02', 'Store Setup', 'Create the product ladder, add clear delivery notes, connect roles, write refund terms, and test checkout delivery.'],
  ['03', 'Community Machine', 'Build applications, creator intake, event calendar, announcements, ticket categories, and member onboarding.'],
  ['04', 'Security Pass', 'Lock admin permissions, audit resources, add logs, back up the database, and publish staff conduct rules.'],
  ['05', 'Soft Launch', 'Open to staff first, then founders, then creator preview night, then public applications.'],
];

const serverGuardrails = [
  ['No pay-to-win', 'Sell access, cosmetics, support, education, and community value. Do not sell weapons, boosted stats, or in-game cash.'],
  ['No cash-out claims', 'Keep the server economy separate from real-world income, crypto, gambling, or play-to-earn promises.'],
  ['Use original assets', 'Use licensed or original maps, clothing, logos, liveries, and server identity.'],
  ['Clear delivery', 'Every paid option needs a delivery promise, support owner, refund note, and renewal policy.'],
  ['Test before launch', 'Run every role, queue, package, and resource in staging before opening paid access.'],
  ['Keep records', 'Track orders, staff actions, support tickets, changelogs, and incident notes.'],
];

const serverTemplateFiles = [
  {
    path: 'products/tebex_product_blueprint.csv',
    name: 'Product Blueprint',
    lang: 'csv',
    content: `name,price,type,delivery,safe_angle
Founder Pass,$25-$75/mo,Access,Discord role + founder event access,Community status
Priority Application Review,$10-$25,Workflow,Faster review SLA,Administrative processing
Priority Queue Membership,$15-$50/mo,Access,Queue role + renewal reminder,Convenience access
Creator Partner Pass,$25-$99/mo,Creator,Media kit + event calendar,Creator support
Supporter Cosmetic Pack,$9-$49,Cosmetic,Original visual/status perks,No gameplay advantage
Business RP License,$15-$79,RP Identity,Application packet + staff review,Structured roleplay
Event Night Pass,$5-$25,Event,Event role + recap workflow,Community events
Staff Training Pack,$49-$199,B2B,SOP + role matrix,Operational education
Security + Anti-Abuse Audit,$79-$299,Defense,Risk report + fix plan,Server hardening
Creator City Full Launch Vault,$199-$499,Bundle,Configs + Discord + store + launch checklist,Complete launch system`
  },
  {
    path: 'server-core/server.cfg.sample',
    name: 'server.cfg',
    lang: 'cfg',
    content: `# GTA Money Team Creator Empire RP sample config
endpoint_add_tcp "0.0.0.0:30120"
endpoint_add_udp "0.0.0.0:30120"

sv_hostname "Creator Empire RP | Original Paid RP Community"
sets sv_projectName "Creator Empire RP"
sets sv_projectDesc "Legal RP community built around access, events, cosmetics, creator systems, and fair play."
sets tags "roleplay, fivem, creator, legal, economy, whitelist"

set mysql_connection_string "mysql://user:password@localhost/creator_empire?charset=utf8mb4"
set sv_enforceGameBuild 3095
sv_maxclients 128

ensure mapmanager
ensure chat
ensure spawnmanager
ensure sessionmanager
ensure hardcap
ensure gmt_streamer_city

add_ace group.admin command allow
add_ace group.admin command.quit deny`
  },
  {
    path: 'resources/[gmt]/gmt_streamer_city/config.lua',
    name: 'gmt_streamer_city',
    lang: 'lua',
    content: `GMTStreamerCity = {
  brand = "Creator Empire RP",
  moneyRules = {
    "No paid weapons, boosted stats, or in-game cash.",
    "Paid offers must be cosmetic, access, support, education, or community value.",
    "Priority review is faster review, not guaranteed acceptance."
  },
  creatorJobs = {
    "Clip Reporter",
    "Event Host",
    "Business Promoter",
    "City Photographer",
    "Whitelist Interviewer"
  },
  safeProducts = {
    "Founder Pass",
    "Priority Review",
    "Priority Queue",
    "Creator Partner",
    "Cosmetic Supporter Pack",
    "Business RP License",
    "Event Night Pass",
    "Staff Training Pack",
    "Security Audit",
    "Full Launch Vault"
  }
}`
  },
  {
    path: 'docs/PAID_SERVER_LAUNCH_CHECKLIST.md',
    name: 'Launch Checklist',
    lang: 'md',
    content: `# Paid RP Server Launch Checklist

## Foundation
- Pick original server name.
- Create Discord and staff roles.
- Prepare txAdmin/FiveM host.
- Test resource pack.

## Monetization
- Create store products.
- Add delivery notes and disclaimers.
- Connect Discord roles.
- Test every purchase path.

## Content
- Create launch trailer.
- Prepare 10 short-form clips.
- Publish creator application post.
- Schedule first event night.

## Security
- Lock admin permissions.
- Audit resources.
- Add logs and backups.
- Create ban appeal process.

## Launch
- Staff-only soft open.
- Founder access window.
- Creator preview night.
- Public application window.`
  },
  {
    path: 'docs/SECURITY_SOP.md',
    name: 'Security SOP',
    lang: 'md',
    content: `# Security SOP

- Use least-privilege admin permissions.
- Keep database, bot, and store secrets off public frontend code.
- Review every resource source and license.
- Back up database before installing new resource packs.
- Log staff actions and admin commands.
- Do not install leaked scripts or unknown executables.
- Publish staff conduct, appeal, and incident response rules.`
  },
];

const investorCards = [
  ['TTWO exposure', 'Rockstar Games is owned by Take-Two Interactive. Track TTWO, earnings calls, guidance, and launch timing.'],
  ['Catalyst watch', 'Monitor official trailers, pre-orders, platform news, delays, reviews, sales data, and post-launch monetization.'],
  ['Crypto firewall', 'There is no official GTA token. Treat beta coins, wallet links, early-access NFTs, and free-money offers as hostile.'],
  ['Education only', 'Investor Radar teaches research habits and scam defense. It is not financial advice or a buy/sell signal.'],
];

const structuralResearchHabits = [
  'Read official Take-Two investor relations pages before social posts.',
  'Separate product excitement from valuation and risk.',
  'Track earnings dates, guidance, pre-order news, reviews, and delay language.',
  'Write a source link beside every claim before sharing it.',
  'Avoid crypto, beta key, free coin, and wallet narratives entirely.',
];

const courseTracks = [
  {
    title: 'Launch Week Capital',
    level: 'Starter track',
    text: 'First-session training for clean cash flow, smart unlock order, and early asset decisions.',
    lessons: ['0 to 10 hour route plan', 'Starter cash protection', 'First property timing'],
  },
  {
    title: 'Route Stacking',
    level: 'Operator track',
    text: 'Build reliable legal loops across delivery, cargo, business, and cooldown windows.',
    lessons: ['Cooldown math', 'Solo versus crew routing', 'Risk-free session planning'],
  },
  {
    title: 'Crew Economy',
    level: 'Team track',
    text: 'Train members with fair payout rules, progression roles, and retention systems.',
    lessons: ['Payout ledgers', 'Crew scheduling', 'Trust and escalation rules'],
  },
  {
    title: 'Creator Income',
    level: 'Business track',
    text: 'Turn legal gameplay knowledge into guides, scripts, member funnels, and affiliate offers.',
    lessons: ['Guide content system', 'Subscriber funnel map', 'Trusted offer planning'],
  },
];

const hasPremiumAccess = (membership) => {
  const tier = String(membership?.tier || '').toLowerCase();
  return membership?.status === 'active' || tier === 'premium' || tier === 'launch-ready';
};

function SubscriptionPreviewBar({ membership, onCheckout, setPage }) {
  if (hasPremiumAccess(membership)) {
    return null;
  }

  return (
    <section className="subscription-status-bar" aria-label="Workshop subscription">
      <div>
        <strong>Explore the Workshop</strong>
        <span>Every page is open to browse. Join the GTA Money Team Workshop to unlock downloads, member drops, calculators, city packs, server templates, and Lana playbooks.</span>
      </div>
      <div className="subscription-status-actions">
        <button type="button" onClick={() => onCheckout('premiumMonthly')}>Join $25/mo</button>
        <button type="button" className="ghost" onClick={() => setPage('member-activation')}>I Have Access</button>
      </div>
    </section>
  );
}

function CheckoutModal({ paymentKey, onClose, onDemoCheckout, setPage }) {
  const link = paymentLinks[paymentKey] || paymentLinks.premiumMonthly;

  if (!paymentKey || !link) {
    return null;
  }

  const hasHostedCheckout = /^https?:\/\//i.test(link.url);

  return (
    <div className="request-modal-backdrop" role="presentation">
      <div className="request-modal checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <button onClick={onClose} className="request-close" aria-label="Close checkout">x</button>
        <span className="font-mono text-pink text-xs uppercase block mb-3">// GTA Money Team Checkout</span>
        <h2 id="checkout-title" className="font-round-bold text-3xl uppercase text-white mb-3">{link.label}</h2>
        <div className="checkout-price-lockup">
          <strong>{link.price}</strong>
          <span>Member checkout</span>
        </div>
        <p className="text-white/65 text-xs leading-relaxed mb-5">
          Members keep browsing the full app, then unlock downloadable vault packs, member-only drops, calculators, server templates, and workshop access after checkout verification.
        </p>
        <div className="checkout-feature-grid">
          {['Full workshop vault', 'Server and city packs', 'Revenue calculators', 'Lana coaching prompts'].map((feature) => (
            <span key={feature}>{feature}</span>
          ))}
        </div>
        <div className="checkout-actions">
          {hasHostedCheckout ? (
            <a href={link.url} target="_blank" rel="noreferrer" className="checkout-primary">
              Continue Secure Checkout
            </a>
          ) : (
            <button type="button" className="checkout-primary" onClick={onDemoCheckout}>
              Start Workshop Access
            </button>
          )}
          <button
            type="button"
            className="checkout-secondary"
            onClick={() => {
              onClose();
              setPage('member-activation');
            }}
          >
            Activate Existing Access
          </button>
        </div>
        {!hasHostedCheckout && <p className="checkout-note">You can activate access here and continue into the member workshop.</p>}
      </div>
    </div>
  );
}

function LiveStockChart() {
  const chartUrl = 'https://s.tradingview.com/widgetembed/?symbol=NASDAQ%3ATTWO&interval=D&hidesidetoolbar=1&symboledit=1&saveimage=0&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=America%2FLos_Angeles&withdateranges=1&hideideas=1';

  return (
    <section className="live-stock-chart-panel" aria-label="Live TTWO stock chart">
      <div className="live-stock-chart-head">
        <div>
          <span>Live Stock Chart</span>
          <strong>Take-Two Interactive Software Inc. (TTWO)</strong>
        </div>
        <small>Powered by TradingView market data. Research only, not financial advice.</small>
      </div>
      <iframe
        title="Live TTWO stock chart"
        src={chartUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </section>
  );
}

function getYoutubeEmbedUrl(video) {
  if (video?.youtubeEmbed) return video.youtubeEmbed;
  if (!video?.youtubeUrl) return null;

  try {
    const url = new URL(video.youtubeUrl);
    const id = url.hostname.includes('youtu.be')
      ? url.pathname.slice(1)
      : url.searchParams.get('v');
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

function MediaPlayer({ video, title }) {
  const youtubeEmbed = getYoutubeEmbedUrl(video);

  if (youtubeEmbed) {
    return (
      <iframe
        key={youtubeEmbed}
        src={`${youtubeEmbed}?rel=0&modestbranding=1`}
        title={title || video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    );
  }

  return (
    <video
      key={video.video}
      src={video.video}
      poster={video.poster}
      controls
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}

// Helper page render functions
function MoneyCoursesPage() {
  return (
    <div className="text-left w-full">
      <span className="font-mono text-pink text-xs uppercase block mb-3">// Money Courses</span>
      <h1 className="font-round-bold text-4xl md:text-5xl uppercase text-white mb-6">Subscriber Money Academy</h1>
      <p className="text-white/70 text-sm mb-8 max-w-2xl">
        Structured training for players, creators, and server owners who want legal routes, clean systems, and repeatable launch-week advantage.
      </p>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        {courseTracks.map((track) => (
          <article key={track.title} className="visual-card p-6">
            <small className="font-mono text-yellow text-[10px] uppercase block mb-2">{track.level}</small>
            <strong className="block text-xl text-white uppercase mb-3">{track.title}</strong>
            <p className="text-white/60 text-xs leading-relaxed mb-5">{track.text}</p>
            <ul className="list-disc pl-4 space-y-1 text-white/50 text-xs">
              {track.lessons.map((lesson) => (
                <li key={lesson}>{lesson}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="visual-ribbon mt-8">
        <strong>Clean promise:</strong>
        <span>No cheats, no mod menus, no exploits, no scam tokens. Every lesson is strategy, planning, safety, content, or business education.</span>
      </div>
    </div>
  );
}

function RoutePlannerPage({ onRequest }) {
  const [plannerMode, setPlannerMode] = useState('Solo');
  return (
    <div className="text-left w-full">
      <span className="font-mono text-pink text-xs uppercase block mb-3">// Route Planner</span>
      <h1 className="font-round-bold text-4xl md:text-5xl uppercase text-white mb-6">Money Routes & Playbooks</h1>
      <p className="text-white/70 text-sm mb-8 max-w-2xl">
        Pick your style and study routes built to stack in-game currency without account bans or risks.
      </p>
      <div className="flex gap-2 mb-8">
        {['Solo', 'Crew', 'Launch Week'].map((mode) => (
          <button
            key={mode}
            onClick={() => setPlannerMode(mode)}
            className={`px-4 py-2 border rounded font-semibold text-xs uppercase transition duration-300 ${plannerMode === mode ? 'bg-yellow text-black border-yellow' : 'bg-black border-white/20 text-white hover:bg-white/5'}`}
          >
            {mode} Mode
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {plannerRoutes[plannerMode].map((route) => (
          <div key={route.name} className="p-6 border border-white/10 rounded-lg bg-white/5">
            <small className="font-mono text-yellow text-[10px] uppercase block mb-2">{route.yield}</small>
            <strong className="block text-2xl text-white uppercase mb-2">{route.name}</strong>
            <p className="text-white/60 text-xs mb-4">{route.desc}</p>
            <ul className="list-disc pl-4 space-y-1 text-white/50 text-xs">
              {route.steps.map((step, idx) => (
                <li key={idx}>Step {idx + 1}: {step}</li>
              ))}
            </ul>
            <button
              onClick={() => onRequest('Custom Money Routes')}
              className="mt-5 px-4 py-2 bg-transparent border border-cyan/40 rounded text-cyan text-xs font-semibold uppercase hover:bg-cyan/10 hover:border-cyan transition duration-300"
            >
              Request Route Build
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServerLabPage({ onRequest }) {
  const [selectedFile, setSelectedFile] = useState(0);
  const [selectedOfferId, setSelectedOfferId] = useState('founder-pass');
  const [selectedOfferIds, setSelectedOfferIds] = useState(['founder-pass', 'priority-review', 'priority-queue', 'creator-pass']);
  const [discordLeads, setDiscordLeads] = useState(420);
  const [conversionRate, setConversionRate] = useState(18);
  const [averagePrice, setAveragePrice] = useState(25);
  const [addonRevenue, setAddonRevenue] = useState(1200);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const currentFile = serverTemplateFiles[selectedFile];
  const selectedOffer = serverMonetizationOffers.find((offer) => offer.id === selectedOfferId) || serverMonetizationOffers[0];
  const selectedOffers = serverMonetizationOffers.filter((offer) => selectedOfferIds.includes(offer.id));
  const estimatedMembers = Math.round((Number(discordLeads) || 0) * ((Number(conversionRate) || 0) / 100));
  const estimatedMonthly = estimatedMembers * (Number(averagePrice) || 0) + (Number(addonRevenue) || 0);
  const selectedSetupSteps = selectedOffers.reduce((total, offer) => total + offer.setup.length, 0);
  const blueprintDownload = './downloads/gta-money-team-streamer-rp-paid-server-blueprint.zip';
  const completePackage = serverTemplateFiles.map((file) => `// ==========================================\n// FILE: ${file.path}\n// ==========================================\n\n${file.content}`).join('\n\n');

  const toggleOffer = (offerId) => {
    setSelectedOfferIds((current) => (
      current.includes(offerId)
        ? current.filter((id) => id !== offerId)
        : [...current, offerId]
    ));
    setSelectedOfferId(offerId);
  };

  return (
    <div className="server-forge-page text-left w-full">
      <section className="server-forge-hero">
        <img src={serverForgeImages.hero} alt="Server Forge command center" />
        <div className="server-forge-hero-copy">
          <span>Premium RP Server Setup</span>
          <h1>Server Forge</h1>
          <p>
            Build a legal streamer-style FiveM RP server business around access, Discord, queue tiers, creator events,
            cosmetics, staff training, security, and launch vault downloads.
          </p>
          <div className="server-forge-actions">
            <a href={blueprintDownload} download>Download Blueprint</a>
            <button type="button" onClick={() => onRequest('Creator Empire RP Server Build')}>Request Build Help</button>
          </div>
          <div className="server-forge-proof">
            <article><strong>{serverMonetizationOffers.length}</strong><span>safe offer ideas</span></article>
            <article><strong>{selectedSetupSteps}</strong><span>setup actions selected</span></article>
            <article><strong>Fair</strong><span>no pay-to-win lane</span></article>
          </div>
        </div>
        <aside className="server-forge-builder">
          <span>Launch Model Builder</span>
          <strong>${estimatedMonthly.toLocaleString()}/mo</strong>
          <p>Estimated gross from selected audience, conversion, monthly pass price, and add-ons.</p>
          <label>
            Discord leads
            <input type="number" min="0" value={discordLeads} onChange={(event) => setDiscordLeads(Number(event.target.value))} />
          </label>
          <label>
            Conversion rate
            <input type="number" min="0" max="100" value={conversionRate} onChange={(event) => setConversionRate(Number(event.target.value))} />
          </label>
          <label>
            Average monthly pass
            <input type="number" min="0" value={averagePrice} onChange={(event) => setAveragePrice(Number(event.target.value))} />
          </label>
          <label>
            Add-ons per month
            <input type="number" min="0" value={addonRevenue} onChange={(event) => setAddonRevenue(Number(event.target.value))} />
          </label>
        </aside>
      </section>

      <section className="server-forge-photo-strip">
        {[
          ['Monetization Setup', serverForgeImages.monetization, 'Build founder passes, queue memberships, cosmetics, events, and launch vault bundles.'],
          ['Community Machine', serverForgeImages.community, 'Turn Discord, creators, events, and applications into a clean paid community funnel.'],
          ['Security Ops', serverForgeImages.security, 'Protect permissions, logs, backups, staff actions, and resource quality before launch.'],
        ].map(([title, image, text]) => (
          <article key={title}>
            <img src={image} alt={`${title} visual`} />
            <div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="server-forge-section-head">
        <div>
          <span>Revenue and access products</span>
          <h2>Pick what the server sells</h2>
        </div>
        <p>Members can browse every option, select the packages that fit their server, and use Lana to turn the selected stack into a setup checklist.</p>
      </section>

      <section className="server-offer-grid">
        {serverMonetizationOffers.map((offer) => {
          const active = selectedOfferIds.includes(offer.id);
          return (
            <article key={offer.id} className={active ? 'active' : ''}>
              <button type="button" onClick={() => setSelectedOfferId(offer.id)} className="server-offer-photo">
                <img src={offer.image} alt={`${offer.name} setup visual`} />
              </button>
              <div>
                <span>{offer.type}</span>
                <strong>{offer.name}</strong>
                <p>{offer.description}</p>
              </div>
              <footer>
                <small>{offer.price}</small>
                <button type="button" onClick={() => toggleOffer(offer.id)}>{active ? 'In Plan' : 'Add'}</button>
              </footer>
            </article>
          );
        })}
      </section>

      <section className="server-forge-workbench">
        <div className="server-selected-offer">
          <img src={selectedOffer.image} alt={`${selectedOffer.name} selected setup`} />
          <div>
            <span>{selectedOffer.type} setup</span>
            <h2>{selectedOffer.name}</h2>
            <p>{selectedOffer.delivery}</p>
            <strong>Easy setup path</strong>
            <ol>
              {selectedOffer.setup.map((step) => <li key={step}>{step}</li>)}
            </ol>
            <div className="server-avoid-box">{selectedOffer.avoid}</div>
          </div>
        </div>

        <div className="server-revenue-panel">
          <span>Selected launch stack</span>
          <strong>{selectedOffers.length} products</strong>
          <p>{estimatedMembers.toLocaleString()} estimated paying members from {discordLeads.toLocaleString()} leads at {conversionRate}% conversion.</p>
          <div className="server-selected-tags">
            {selectedOffers.map((offer) => <button type="button" key={offer.id} onClick={() => setSelectedOfferId(offer.id)}>{offer.name}</button>)}
          </div>
          <a href={blueprintDownload} download>Download Creator Empire RP Blueprint</a>
        </div>
      </section>

      <section className="server-forge-checklist">
        <div className="server-forge-section-head">
          <div>
            <span>Launch checklist</span>
            <h2>From idea to paid server</h2>
          </div>
          <p>Use this as the customer-facing path. It shows what to do first, what can be sold, and where the safety checks happen.</p>
        </div>
        <div className="server-phase-grid">
          {serverLaunchPhases.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="server-guardrail-grid">
        <div className="server-forge-section-head">
          <div>
            <span>Compliance guardrails</span>
            <h2>Keep the money clean</h2>
          </div>
          <p>Server Forge is built for legal community monetization, not cheats, unfair advantage, stolen assets, fake crypto, or account-risk shortcuts.</p>
        </div>
        {serverGuardrails.map(([title, text]) => (
          <article key={title}>
            <span />
            <strong>{title}</strong>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="server-resource-explorer">
        <div className="server-resource-tree">
          <span>Resource explorer</span>
          <strong>Blueprint files</strong>
          <nav>
            {serverTemplateFiles.map((file, idx) => (
              <button
                key={file.path}
                type="button"
                onClick={() => setSelectedFile(idx)}
                className={selectedFile === idx ? 'active' : ''}
              >
                <span>{file.path}</span>
                <small>{file.lang}</small>
              </button>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => {
              const blob = new Blob([completePackage], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'gta-money-team-server-forge-preview.txt';
              link.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export Preview Notes
          </button>
        </div>
        <div className="server-code-viewer">
          <header>
            <div>
              <span>{currentFile.path}</span>
              <strong>{currentFile.name}</strong>
            </div>
            <button type="button" onClick={() => handleCopy(currentFile.content)}>{copied ? 'Copied' : 'Copy'}</button>
          </header>
          <pre><code>{currentFile.content}</code></pre>
        </div>
      </section>
    </div>
  );
}

function CreatorKitPage() {
  return (
    <div className="text-left w-full">
      <span className="font-mono text-pink text-xs uppercase block mb-3">// Creator Kit</span>
      <h1 className="font-round-bold text-4xl md:text-5xl uppercase text-white mb-6">GTA 6 Content outlines</h1>
      <p className="text-white/70 text-sm mb-8 max-w-2xl">
        Grow your viewing audience by scripting guides based on gameplay data, map item coordinates, and progression runs.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 border border-white/10 rounded-lg bg-white/5">
          <strong className="block text-lg text-white uppercase mb-3">Video Outline Checklists</strong>
          <p className="text-white/60 text-xs mb-4">Structure your videos to hook audience attention in the first 5 seconds:</p>
          <ul className="list-disc pl-4 space-y-1 text-white/50 text-xs">
            <li>Launch week start guides (0 to 10 hours runs)</li>
            <li>Clean item map location speedruns</li>
            <li>Best legal properties buying strategy</li>
          </ul>
        </div>
        <div className="p-6 border border-white/10 rounded-lg bg-white/5">
          <strong className="block text-lg text-white uppercase mb-3">Viewer Pipeline Funnel</strong>
          <p className="text-white/60 text-xs mb-4">Map views into subscriber leads ethically:</p>
          <ul className="list-disc pl-4 space-y-1 text-white/50 text-xs">
            <li>Give out planning guides as lead magnets</li>
            <li>Invite viewers to crew sessions</li>
            <li>Deliver exclusive route playbooks to subscribers</li>
          </ul>
        </div>
        <div className="p-6 border border-white/10 rounded-lg bg-white/5">
          <strong className="block text-lg text-white uppercase mb-3">Content Batching Ops</strong>
          <p className="text-white/60 text-xs mb-4">Minimize fatigue by keeping operations linear:</p>
          <ul className="list-disc pl-4 space-y-1 text-white/50 text-xs">
            <li>Record gameplay clips in batches</li>
            <li>Apply search-optimized guide titles</li>
            <li>Promote premium setups in descriptions</li>
          </ul>
        </div>
      </div>

      <div className="visual-card mt-8 p-6 bg-pink/5 border border-pink/20 rounded-lg flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="font-mono text-pink text-[10px] uppercase block mb-1">// Document & Script Vault</span>
          <strong className="block text-white text-xl uppercase mb-2">NotebookLM & Marketing Video Assets</strong>
          <p className="text-white/60 text-xs max-w-xl">
            Download the comprehensive project overview PDF optimized for indexing inside Google NotebookLM, alongside our pre-written cinematic video script styled for GTA VI trailer vibes.
          </p>
        </div>
        <div className="flex gap-4">
          <a
            href="./gta_money_team_overview.pdf"
            download
            className="px-5 py-3 bg-pink text-black font-semibold text-xs uppercase rounded hover:bg-white transition duration-300 whitespace-nowrap"
          >
            Download Overview PDF
          </a>
          <button
            onClick={() => {
              alert("GTA VI Styled Cinematic Video Script is fully included inside the PDF on Page 4! Run: python scratch/generate_pdf.py to rebuild.");
            }}
            className="px-5 py-3 bg-transparent border border-white/20 text-white font-semibold text-xs uppercase rounded hover:bg-white/10 transition duration-300 whitespace-nowrap"
          >
            View Video Script
          </button>
        </div>
      </div>
    </div>
  );
}

function MediaVaultPage() {
  const [activeTab, setActiveTab] = useState('videos');
  const [activeVideo, setActiveVideo] = useState(rockstarMediaCatalog.videos[1] || rockstarMediaCatalog.videos[0]);

  const mediaTabs = [
    ['videos', 'Videos', rockstarMediaCatalog.videos],
    ['screenshots', 'Screenshots', rockstarMediaCatalog.screenshots],
    ['ultimate', 'Ultimate Edition', rockstarMediaCatalog.ultimateEdition],
    ['vintage', 'Vintage Vice City', rockstarMediaCatalog.vintageViceCity],
    ['artwork', 'Artwork', rockstarMediaCatalog.artwork],
  ];
  const activeMedia = mediaTabs.find(([id]) => id === activeTab)?.[2] || [];
  const mediaFallbacks = [
    './assets/gmt-brand/lana-day-marina.png',
    './assets/gmt-brand/lana-day-route.png',
    './assets/server-forge/server-forge-community.png',
    './images/gta-money-team-url-preview.png',
  ];
  const getMediaImage = (item, index) => item.poster || item.image || item.thumbnail || (/\.(png|jpe?g|webp)(\?|$)/i.test(item.url || '') ? item.url : mediaFallbacks[index % mediaFallbacks.length]);
  const handleMediaImageFallback = (event, index = 0) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = mediaFallbacks[index % mediaFallbacks.length];
  };
  const mediaStrategies = [
    ['Trailer Clip Factory', 'Turn each official video into a legal breakdown, short-form hook, thumbnail idea, and Discord discussion prompt.'],
    ['Screenshot SEO Board', 'Group screenshots by character, district, vehicle, and business angle so posts answer specific search intent.'],
    ['Launch Week Calendar', 'Use official-only media to schedule daily posts without fake leaks, stolen assets, or risky claims.'],
    ['Member Study Vault', 'Pair each card with a note: what it shows, what players may ask, and what product/service it can ethically support.'],
  ];

  return (
    <div className="media-vault-page text-left w-full">
      <div className="media-vault-hero">
        <div>
          <span className="font-mono text-pink text-xs uppercase block mb-3">// Official Media Vault</span>
          <h1 className="font-round-bold text-4xl md:text-5xl uppercase text-white mb-6">GTA VI Media Command Center</h1>
          <p className="text-white/70 text-sm mb-8 max-w-3xl">
            Browse official Rockstar videos, screenshots, artwork, and download packs from the GTA VI media hub. Use it for clean trailer study, launch-week content planning, thumbnail research, and member education.
          </p>
          <div className="media-vault-actions">
            <a href={rockstarMediaCatalog.source} target="_blank" rel="noreferrer">Open Rockstar Media</a>
            <a href={rockstarMediaCatalog.downloadPacks[0].url} target="_blank" rel="noreferrer">Download Video Pack</a>
          </div>
        </div>
        <div className="media-feature-player">
          <MediaPlayer video={activeVideo} title={activeVideo.title} />
          <div>
            <span>{activeVideo.category}</span>
            <strong>{activeVideo.title}</strong>
            <p>{activeVideo.description}</p>
          </div>
        </div>
      </div>

      <div className="media-count-grid">
        <article><strong>{rockstarMediaCatalog.counts.videos}</strong><span>Official videos</span></article>
        <article><strong>{rockstarMediaCatalog.counts.screenshots}</strong><span>Screenshots</span></article>
        <article><strong>{rockstarMediaCatalog.counts.ultimateEditionBenefits}</strong><span>Ultimate Edition images</span></article>
        <article><strong>{rockstarMediaCatalog.counts.vintageViceCityPack}</strong><span>Vintage Vice City images</span></article>
        <article><strong>{rockstarMediaCatalog.counts.artworkWallpapers}</strong><span>Artwork & wallpapers</span></article>
      </div>

      <section className="media-section-block">
        <div className="media-section-heading">
          <span>Playable official video cards</span>
          <h2>All {rockstarMediaCatalog.counts.videos} Videos</h2>
        </div>
        <div className="rockstar-video-grid">
          {rockstarMediaCatalog.videos.map((video) => (
            <button type="button" key={video.title} className="rockstar-video-card" onClick={() => setActiveVideo(video)}>
              <img src={video.poster || mediaFallbacks[0]} alt={video.title} loading="lazy" onError={(event) => handleMediaImageFallback(event, 0)} />
              <span>{video.category}</span>
              <strong>{video.title}</strong>
              <p>{video.description}</p>
              <i>Play official video</i>
            </button>
          ))}
        </div>
      </section>

      <section className="media-section-block">
        <div className="media-section-heading">
          <span>Official download packs</span>
          <h2>Bulk Media Packs</h2>
        </div>
        <div className="media-download-grid">
          {rockstarMediaCatalog.downloadPacks.map((pack) => (
            <a key={pack.id} href={pack.url} target="_blank" rel="noreferrer">
              <strong>{pack.title}</strong>
              <span>{pack.count} items / {pack.type}</span>
              <small>Official Rockstar download</small>
            </a>
          ))}
        </div>
      </section>

      <section className="media-section-block">
        <div className="media-section-heading">
          <span>Screenshot and artwork boards</span>
          <h2>Official Image Library</h2>
        </div>
        <div className="media-tab-row" role="tablist" aria-label="Official media categories">
          {mediaTabs.map(([id, label, items]) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              key={id}
              onClick={() => setActiveTab(id)}
              className={activeTab === id ? 'active' : ''}
            >
              {label}
              <span>{items.length}</span>
            </button>
          ))}
        </div>
        <div className="rockstar-image-grid">
          {activeMedia.map((item, index) => (
            <a href={item.url} target="_blank" rel="noreferrer" key={`${item.group}-${item.title}`} className="rockstar-image-card">
              <img src={getMediaImage(item, index)} alt={item.title} loading="lazy" onError={(event) => handleMediaImageFallback(event, index)} />
              <span>{item.group}</span>
              <strong>{item.title}</strong>
            </a>
          ))}
        </div>
      </section>

      <section className="media-section-block">
        <div className="media-section-heading">
          <span>Money Team media workflow</span>
          <h2>How To Turn Official Media Into Revenue</h2>
        </div>
        <div className="media-strategy-grid">
          {mediaStrategies.map(([title, text]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <p className="media-rights-note">{rockstarMediaCatalog.rightsNote}</p>
      </section>
    </div>
  );
}

const fallbackNewsFeed = {
  generatedAt: new Date().toISOString(),
  rightsNote: 'Official-source briefing desk. GTA Money Team tracks public updates and turns them into clean member action plans.',
  sources: [
    { id: 'rockstar-vi-hub', name: 'Rockstar Games', url: 'https://www.rockstargames.com/VI', type: 'official' },
    { id: 'take-two-ir', name: 'Take-Two Investor Relations', url: 'https://ir.take2games.com/rss/news-releases.xml', type: 'official' },
  ],
  officialWatchlist: [
    {
      id: 'rockstar-vi-hub',
      title: 'Grand Theft Auto VI Official Hub',
      source: 'Rockstar Games',
      url: 'https://www.rockstargames.com/VI',
      image: rockstarMediaCatalog.videos[1]?.poster || './images/gta-money-team-city-billboard-backdrop.png',
      note: 'Use as the first source before teaching release, edition, platform, or story claims.',
    },
    {
      id: 'rockstar-media-hub',
      title: 'Official GTA VI Media Hub',
      source: 'Rockstar Games',
      url: rockstarMediaCatalog.source,
      image: rockstarMediaCatalog.videos[0]?.poster || './images/gta-money-team-brand-backdrop.png',
      note: 'Approved public videos, screenshots, artwork, and download packs for media study.',
    },
  ],
  items: [
    {
      id: 'fallback-official-hub',
      title: 'Grand Theft Auto VI Official Source Desk',
      excerpt: 'Track Rockstar source links, official media, platform pages, editions, and launch claims before converting them into training updates.',
      url: 'https://www.rockstargames.com/VI',
      source: 'Rockstar Games',
      sourceUrl: 'https://www.rockstargames.com',
      sourceType: 'official',
      publishedAt: new Date().toISOString(),
      image: rockstarMediaCatalog.videos[1]?.poster || './images/gta-money-team-city-billboard-backdrop.png',
      category: 'Official',
      moneyAngle: 'Turn this into a member source-of-truth brief before building routes, preorder explainers, or course updates.',
    },
  ],
  videos: featuredNewsVideos,
};

const newsFilters = ['All', 'Official', 'Launch Commerce', 'Media Watch', 'Investor Radar', 'Verify First', 'Server Ops'];

function formatNewsDate(value) {
  if (!value) return 'Source date pending';

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(value));
  } catch {
    return 'Source date pending';
  }
}

function NewsRoomPage() {
  const [feed, setFeed] = useState(fallbackNewsFeed);
  const [activeFilter, setActiveFilter] = useState('All');
  const [feedState, setFeedState] = useState('loading');

  useEffect(() => {
    let mounted = true;

    fetch('./data/gta-news.json', { cache: 'no-cache' })
      .then((response) => {
        if (!response.ok) throw new Error('News feed unavailable');
        return response.json();
      })
      .then((payload) => {
        if (!mounted) return;
        setFeed({
          ...fallbackNewsFeed,
          ...payload,
          items: payload.items?.length ? payload.items : fallbackNewsFeed.items,
          videos: payload.videos?.length ? payload.videos : fallbackNewsFeed.videos,
          officialWatchlist: payload.officialWatchlist?.length ? payload.officialWatchlist : fallbackNewsFeed.officialWatchlist,
        });
        setFeedState('live');
      })
      .catch(() => {
        if (!mounted) return;
        setFeed(fallbackNewsFeed);
        setFeedState('fallback');
      });

    return () => {
      mounted = false;
    };
  }, []);

  const items = feed.items || [];
  const filteredItems = activeFilter === 'All' ? items : items.filter((item) => item.category === activeFilter);
  const featureStory = filteredItems[0] || items[0] || fallbackNewsFeed.items[0];
  const storyCards = (filteredItems.length ? filteredItems : items).slice(0, 12);
  const videos = (feed.videos?.length ? feed.videos : rockstarMediaCatalog.videos).slice(0, 5);
  const sourceCount = new Set(items.map((item) => item.source)).size || feed.sources?.length || 0;
  const generatedDate = formatNewsDate(feed.generatedAt);

  const handleImageFallback = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = './images/gta-money-team-city-billboard-backdrop.png';
  };

  return (
    <div className="news-room-page text-left w-full">
      <section className="news-room-hero">
        <article className="news-feature-card">
          <img src={featureStory.image} alt={featureStory.title} onError={handleImageFallback} />
          <div className="news-feature-overlay">
            <span>{featureStory.category}</span>
            <h1>{featureStory.title}</h1>
            <p>{featureStory.excerpt}</p>
            <a href={featureStory.url} target="_blank" rel="noreferrer">Open source</a>
          </div>
        </article>
        <aside className="news-scanner-panel">
          <span className="font-mono text-pink text-xs uppercase">// GTA Money Team briefing desk</span>
          <h2>Latest GTA News Into Paid Member Value</h2>
          <p>
            Track GTA VI, Rockstar, Take-Two, FiveM, creator, and scam-watch stories, then turn the important updates into useful member briefings, content ideas, and legal money plans.
          </p>
          <div className="news-signal-grid">
            <article><strong>{items.length}</strong><span>stories</span></article>
            <article><strong>{sourceCount}</strong><span>sources</span></article>
            <article><strong>{feedState === 'live' ? 'Live' : 'Local'}</strong><span>feed</span></article>
            <article><strong>{generatedDate}</strong><span>updated</span></article>
          </div>
        </aside>
      </section>

      <section className="news-watchlist">
        <div className="media-section-heading">
          <span>Trusted official anchors</span>
          <h2>Source Watch</h2>
        </div>
        <div className="news-watch-grid">
          {(feed.officialWatchlist || fallbackNewsFeed.officialWatchlist).map((source, index) => (
            <a href={source.url} target="_blank" rel="noreferrer" key={`${source.id || source.url}-${index}`}>
              <img src={source.image} alt={source.title} onError={handleImageFallback} />
              <span>{source.source}</span>
              <strong>{source.title}</strong>
              <p>{source.note}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="media-section-block">
        <div className="media-section-heading">
          <span>Headline desk</span>
          <h2>Latest GTA Briefings</h2>
        </div>
        <div className="news-filter-row" role="tablist" aria-label="GTA news filters">
          {newsFilters.map((filter) => (
            <button
              type="button"
              key={filter}
              className={activeFilter === filter ? 'active' : ''}
              aria-selected={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="news-card-grid">
          {storyCards.map((story, index) => (
            <article key={`${story.id || story.url || story.title}-${index}`} className={`news-story-card ${story.riskFlag ? 'news-risk-card' : ''}`}>
              <a href={story.url} target="_blank" rel="noreferrer" className="news-story-image">
                <img src={story.image} alt={story.title} loading="lazy" onError={handleImageFallback} />
              </a>
              <div className="news-story-body">
                <div className="news-story-meta">
                  <span>{story.category}</span>
                  <small>{formatNewsDate(story.publishedAt)}</small>
                </div>
                <strong>{story.title}</strong>
                <p>{story.excerpt}</p>
                <div className="news-money-angle">
                  <span>Lana angle</span>
                  <p>{story.moneyAngle}</p>
                </div>
                <div className="news-story-footer">
                  <a href={story.sourceUrl || story.url} target="_blank" rel="noreferrer">{story.source}</a>
                  <a href={story.url} target="_blank" rel="noreferrer">Read source</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="media-section-block news-video-desk">
        <div className="media-section-heading">
          <span>Photos and videos</span>
          <h2>Official Media For News Context</h2>
        </div>
        <div className="news-video-grid">
          {videos.map((video) => (
            <article key={video.id || video.title}>
              <MediaPlayer video={video} title={video.title} />
              <div>
                <span>{video.category}</span>
                <strong>{video.title}</strong>
                <p>{video.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="news-money-system">
        <div>
          <span>Subscriber playbook</span>
          <h2>How News Becomes Money Team Value</h2>
          <p>{feed.rightsNote}</p>
        </div>
        <div className="news-system-grid">
          {[
            ['Verify', 'Check official Rockstar, Take-Two, platform, or publisher source links before posting.'],
            ['Brief', 'Have Lana turn each story into a plain-English member update with date, source, and risk notes.'],
            ['Create', 'Convert safe stories into shorts, thumbnails, email updates, Discord posts, and course add-ons.'],
            ['Sell', 'Tie the briefing to legal training products: route planners, city packs, server audits, and creator kits.'],
          ].map(([title, text]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function InvestorRadarPage() {
  return (
    <div className="text-left w-full">
      <span className="font-mono text-pink text-xs uppercase block mb-3">// Investor Radar</span>
      <h1 className="font-round-bold text-4xl md:text-5xl uppercase text-white mb-6">Take-Two Interactive Catalysts</h1>
      <p className="text-white/70 text-sm mb-8 max-w-2xl">
        Monitor Take-Two stock, earnings timelines, and official releases while keeping a strict firewall against crypto scammers.
      </p>
      <LiveStockChart />
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="grid grid-cols-2 gap-4">
          {investorCards.map(([title, text]) => (
            <div key={title} className="p-5 border border-white/10 rounded bg-white/5">
              <strong className="block text-yellow text-sm uppercase mb-2">{title}</strong>
              <p className="text-white/60 text-xs leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-center p-6 border border-green/30 rounded bg-green/5">
          <strong className="block text-green text-lg uppercase mb-3">Scam Defense Warnings</strong>
          <p className="text-white/70 text-xs leading-relaxed">
            If it says GTA VI beta, early access, crypto payment, secret token, free money, or downloadable PC/mobile build before official release, treat it as hostile. GTA Money Team teaches source checks, account safety, and legal advantage systems.
          </p>
        </div>
      </div>
      <div className="mt-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
        <div className="p-6 border border-cyan/25 rounded-lg bg-cyan/5">
          <span className="font-mono text-cyan text-xs uppercase block mb-3">// TTWO data hook</span>
          <strong className="block text-white text-2xl uppercase mb-2">{marketSnapshot.ticker} Snapshot</strong>
          <div className="market-ticker">
            <strong>{marketSnapshot.price}</strong>
            <span>{marketSnapshot.change}</span>
          </div>
          <p className="text-white/60 text-xs leading-relaxed mb-4">
            Finance feed checked {marketSnapshot.checked}. Connect a public market endpoint or manual admin update to keep price, daily move, earnings date, and source timestamp fresh.
          </p>
          <a href="https://www.take2games.com/ir/stock" target="_blank" rel="noreferrer" className="inline-flex px-4 py-2 border border-cyan/40 rounded text-cyan text-xs font-semibold uppercase hover:bg-cyan/10">
            Open Take-Two IR
          </a>
        </div>
        <div className="p-6 border border-yellow/25 rounded-lg bg-yellow/5">
          <span className="font-mono text-yellow text-xs uppercase block mb-3">// Structural Research Habits</span>
          <div className="grid sm:grid-cols-2 gap-3">
            {structuralResearchHabits.map((habit) => (
              <label key={habit} className="flex items-start gap-3 text-white/70 text-xs leading-relaxed">
                <input type="checkbox" className="mt-1 accent-yellow" />
                <span>{habit}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MemberActivationPage({ membership, setMembership, latestOrder }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="text-left w-full">
      <span className="font-mono text-pink text-xs uppercase block mb-3">// Member Activation</span>
      <h1 className="font-round-bold text-4xl md:text-5xl uppercase text-white mb-6">Checkout Success & Access</h1>
      <p className="text-white/70 text-sm mb-8 max-w-3xl">
        Activate your GTA Money Team Workshop access, confirm your membership status, and continue into the subscriber vault.
      </p>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="premium-gate">
          <strong>{membership?.tier || 'Free'} Member</strong>
          <p>Enter your member access code from your receipt or welcome message to unlock the workshop vault.</p>
          <div className="service-form">
            <label>
              Member code
              <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Enter access code" />
            </label>
            <button
              type="button"
              onClick={() => {
                const activated = activateMember(code);
                if (activated) {
                  setMembership(activated);
                  setError('');
                } else {
                  setError('We could not verify that access code.');
                }
              }}
            >
              Activate Access
            </button>
          </div>
          {error && <p className="text-pink text-xs mt-3">{error}</p>}
        </div>
        <div className="p-6 border border-green/25 rounded-lg bg-green/5">
          <strong className="block text-green text-2xl uppercase mb-3">Recent Access Activity</strong>
          <p className="text-white/65 text-xs leading-relaxed">
            {latestOrder ? `${latestOrder.product} access is active for this workshop session.` : 'Your workshop access activity will appear here after checkout or member-code activation.'}
          </p>
        </div>
      </div>
    </div>
  );
}

function LaunchFunnelPage({ onCampaignSaved }) {
  const [offer, setOffer] = useState('Free Server Launch Checklist');
  const [audience, setAudience] = useState('FiveM server owners');
  const [channel, setChannel] = useState('Discord + YouTube');
  const campaign = {
    id: `CAM-${Date.now()}`,
    offer,
    audience,
    channel,
    headline: `${offer} for ${audience}`,
    cta: 'Join Premium or request a DFY build',
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="text-left w-full">
      <span className="font-mono text-pink text-xs uppercase block mb-3">// Launch Funnel</span>
      <h1 className="font-round-bold text-4xl md:text-5xl uppercase text-white mb-6">Traffic To Paid Product</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="service-form p-6 border border-white/10 rounded-lg bg-white/5">
          <label>Lead magnet<input value={offer} onChange={(event) => setOffer(event.target.value)} /></label>
          <label>Audience<input value={audience} onChange={(event) => setAudience(event.target.value)} /></label>
          <label>Channel<input value={channel} onChange={(event) => setChannel(event.target.value)} /></label>
          <button type="button" onClick={() => onCampaignSaved(campaign)}>Save Campaign Draft</button>
        </div>
        <div className="premium-gate">
          <strong>{campaign.headline}</strong>
          <p>Traffic source: {campaign.channel}</p>
          <p>{'Funnel: free lead magnet -> premium membership -> service upsell -> retention support.'}</p>
          <div className="locked-download">{campaign.cta}</div>
        </div>
      </div>
    </div>
  );
}

function LuxOpsDeskPage({ leads, orders, tasks, campaigns }) {
  const [passcode, setPasscode] = useState('');
  const unlocked = passcode === 'lux-ops-2026' || passcode === 'LUX';

  const exportCsv = (name, csv) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="text-left w-full">
      <span className="font-mono text-pink text-xs uppercase block mb-3">// Internal Only</span>
      <h1 className="font-round-bold text-4xl md:text-5xl uppercase text-white mb-6">Lux Ops Desk</h1>
      <p className="text-white/70 text-sm mb-8 max-w-3xl">
        Private fulfillment workspace for authorized Lux Automaton team members.
      </p>
      {!unlocked ? (
        <div className="premium-gate">
          <strong>Ops desk locked</strong>
          <p>This area is reserved for authorized team members.</p>
          <input
            value={passcode}
            onChange={(event) => setPasscode(event.target.value)}
            placeholder="Access code"
            className="ops-passcode"
          />
        </div>
      ) : (
        <div className="ops-desk">
          <div className="ops-toolbar">
            <div>
              <strong>{leads.length}</strong>
              <span>leads captured</span>
            </div>
            <button onClick={() => exportCsv('gta-money-team-leads.csv', leadsToCsv(leads))}>Export Leads CSV</button>
            <button onClick={() => exportCsv('gta-money-team-orders.csv', toCsv(orders, ['id', 'product', 'provider', 'status', 'createdAt']))}>Export Orders CSV</button>
            <button onClick={() => exportCsv('gta-money-team-tasks.csv', toCsv(tasks, ['id', 'service', 'taskType', 'status', 'createdAt']))}>Export Tasks CSV</button>
          </div>
          <div className="ops-summary-grid">
            <article><strong>{orders.length}</strong><span>orders tracked</span></article>
            <article><strong>{tasks.length}</strong><span>fulfillment tasks</span></article>
            <article><strong>{campaigns.length}</strong><span>campaign drafts</span></article>
          </div>
          <div className="ops-table">
            <div className="ops-row head">
              <span>Date</span>
              <span>Service</span>
              <span>Contact</span>
              <span>Budget</span>
              <span>Status</span>
            </div>
            {leads.length === 0 ? (
              <div className="ops-empty">No leads yet. Submit a service request to populate this desk.</div>
            ) : (
              leads.map((lead) => (
                <div className="ops-row" key={`${lead.createdAt}-${lead.service}`}>
                  <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                  <span>{lead.service}</span>
                  <span>{lead.contact}</span>
                  <span>{lead.budget}</span>
                  <span>{lead.status || 'New'}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function RequestServiceModal({ service, onClose, onLeadSaved, onTaskSaved }) {
  const [submitted, setSubmitted] = useState(null);

  if (!service) {
    return null;
  }

  const emailBody = submitted
    ? encodeURIComponent(`Build: ${submitted.service}\nContact: ${submitted.contact}\nBudget: ${submitted.budget}\nDetails:\n${submitted.details}`)
    : '';

  return (
    <div className="request-modal-backdrop" role="presentation">
      <div className="request-modal" role="dialog" aria-modal="true" aria-labelledby="request-title">
        <button onClick={onClose} className="request-close" aria-label="Close request form">x</button>
        <span className="font-mono text-pink text-xs uppercase block mb-3">// Build Request</span>
        <h2 id="request-title" className="font-round-bold text-3xl uppercase text-white mb-3">{service}</h2>
        {submitted ? (
          <div className="p-5 border border-green/30 rounded bg-green/10">
            <strong className="block text-green text-xl uppercase mb-2">Build Request Received</strong>
            <p className="text-white/65 text-xs leading-relaxed">
              Your build request is ready for review. Send it to Lux Automaton so the team can follow up with next steps.
            </p>
            <a
              href={`mailto:luxautomaton@gmail.com?subject=${encodeURIComponent(`GTA Money Team Build Request: ${submitted.service}`)}&body=${emailBody}`}
              className="request-mail-link"
            >
              Send Build Request
            </a>
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const payload = {
                service,
                contact: formData.get('contact'),
                budget: formData.get('budget'),
                details: formData.get('details'),
                status: 'New',
                createdAt: new Date().toISOString(),
              };
              onLeadSaved(payload);
              onTaskSaved({
                id: `TASK-${Date.now()}`,
                service,
                taskType: service.includes('Audit') ? 'audit' : service.includes('OBS') ? 'stream-kit' : service.includes('Route') ? 'route-plan' : 'fulfillment',
                status: 'queued',
                createdAt: new Date().toISOString(),
              });
              setSubmitted(payload);
            }}
            className="service-form"
          >
            <label>
              Contact
              <input name="contact" required placeholder="email or Discord username" />
            </label>
            <label>
              Budget range
              <select name="budget" defaultValue="" required>
                <option value="" disabled>Select budget</option>
                <option>$49-$99</option>
                <option>$100-$299</option>
                <option>$299-$999</option>
                <option>Custom retainer</option>
              </select>
            </label>
            <label>
              Project details
              <textarea name="details" required placeholder="Tell us what you want to build, sell, improve, or learn first." />
            </label>
            <button type="submit">Submit Build Request</button>
          </form>
        )}
      </div>
    </div>
  );
}

const lesson = ({ title, xp, objective, content, steps, checklist, keyAnswers, worksheet, quiz }) => ({
  title,
  xp,
  objective,
  content,
  steps,
  checklist,
  keyAnswers,
  worksheet,
  quiz,
});

const fullWorkshopUpgrades = {
  gta_server_guide: {
    title: 'GTA 6 Server Business Plan: Host & Monetize Legally',
    category: 'Server Business',
    difficulty: 'Advanced',
    yieldEst: '$5k-$25k/mo service potential',
    description: 'A complete compliant RP server workshop covering hosting, txAdmin, framework setup, Discord onboarding, allowed monetization, launch QA, and traffic systems.',
    outcomes: ['Choose hosting without overbuying', 'Install a txAdmin-first server stack', 'Create legal monetization offers', 'Launch with QA and moderation controls'],
    prerequisites: ['Basic Discord admin comfort', 'A VPS or hosted server budget', 'A Cfx.re account', 'No stolen/leaked asset packs'],
    deliverables: ['Server launch checklist', 'Discord onboarding map', 'Allowed offer menu', 'Launch QA scorecard'],
    workshopPrompt: 'Ask Lana: build me a 30-day legal RP server launch plan for my budget, city theme, staff size, and Discord audience.',
    lessons: ['Server Business Model & Compliance', 'Hosting, txAdmin, Database Setup', 'Framework, Resources & QA', 'Discord Whitelist Funnel', 'Allowed Monetization Menu', 'Launch Traffic & Retention'],
    details: [
      lesson({
        title: 'Server Business Model & Compliance',
        xp: 180,
        objective: 'Understand what a legal server business sells and what it must never sell.',
        content: 'A profitable RP server is not built by selling power. It is built by selling organization, identity, cosmetics, priority access where allowed, community quality, and support. Your first job is to define the server promise: city theme, roleplay quality, moderation standard, content tone, and customer outcome. If an offer changes competitive power, gives unfair gameplay advantage, uses stolen assets, or bypasses platform rules, remove it. If an offer saves time, improves identity, upgrades cosmetics, funds moderation, or supports community operations without harming fairness, it belongs on the legal offer board.',
        steps: ['Write a one-sentence city promise.', 'List every planned paid offer.', 'Mark each offer as cosmetic, access, service, or unfair advantage.', 'Delete anything that looks pay-to-win or stolen.', 'Turn the remaining offers into a pricing ladder.'],
        checklist: ['City promise is clear', 'Paid offers are cosmetic/access/service only', 'Staff rules mention no leaked assets', 'Refund/support policy exists'],
        keyAnswers: ['Legal value comes from quality, support, identity, cosmetics, queue/access workflows, and service.', 'Do not sell weapons, boosted stats, exploit scripts, or stolen resources.', 'A server needs rules, moderation, QA, and customer support before it needs ads.'],
        worksheet: 'Fill in: Theme, audience, allowed offers, banned offers, launch date, staff owner, support channel.',
        quiz: {
          question: 'Which offer is safest for a compliant server store?',
          options: ['A boosted weapon with extra damage', 'A cosmetic supporter tag and priority application review', 'A leaked paid script bundle'],
          answer: 1,
          explanation: 'Cosmetic identity and application/support workflows are safer than pay-to-win or stolen-resource offers.'
        }
      }),
      lesson({
        title: 'Hosting, txAdmin, Database Setup',
        xp: 220,
        objective: 'Set up the technical foundation in the right order.',
        content: 'The reliable setup order is hosting first, txAdmin second, framework third, database fourth, firewall fifth, QA last. Start with modest resources and upgrade after player demand proves itself. Keep database credentials private, create backups before adding resource packs, and document every port, admin, token, and dependency. Never paste bot tokens, database passwords, or payment secrets into public client files.',
        steps: ['Choose VPS or game hosting near your target players.', 'Install recommended artifacts or use host panel support.', 'Start txAdmin and link the correct Cfx.re account.', 'Create MariaDB/MySQL and store credentials privately.', 'Open required game ports and test connection from outside your network.'],
        checklist: ['txAdmin reachable', 'Database login works', 'Firewall ports documented', 'Backups scheduled', 'Secrets stored outside frontend code'],
        keyAnswers: ['MariaDB/MySQL is the normal relational database path for common RP frameworks.', 'txAdmin is the operational panel for server monitoring and recipes.', 'Secrets belong on the server/backend, not in React or public docs.'],
        worksheet: 'Record host, region, server IP, txAdmin owner, DB name, backup cadence, firewall ports, and rollback plan.',
        quiz: {
          question: 'Why should database credentials never be placed in the public React app?',
          options: ['They make CSS slower', 'Anyone can inspect frontend code and steal them', 'React cannot display text with secrets'],
          answer: 1,
          explanation: 'Frontend bundles are public. Database, payment, bot, and webhook secrets must stay server-side.'
        }
      }),
      lesson({
        title: 'Framework, Resources & QA',
        xp: 260,
        objective: 'Install a framework and test resources without breaking the server economy.',
        content: 'A framework such as QBCore or ESX gives structure for jobs, inventory, vehicles, housing, and permissions. Add resources slowly. After every resource, run a smoke test: login, character load, inventory, vehicle spawn, job action, database write, restart, and console errors. Keep a resource ledger with source, license, owner, version, risk, and rollback notes. Most server failures come from adding too much at once.',
        steps: ['Deploy the framework recipe.', 'Add one resource category at a time.', 'Run the smoke test after each change.', 'Log source/license/version for every resource.', 'Back up before economy or inventory changes.'],
        checklist: ['Character loads', 'Inventory persists', 'Vehicle ownership persists', 'Console has no critical errors', 'Rollback file exists'],
        keyAnswers: ['Install slowly, test often.', 'A resource ledger prevents mystery bugs and licensing problems.', 'QA protects revenue because broken servers refund customers and lose staff trust.'],
        worksheet: 'Create columns: resource, purpose, source, license, version, risk, test result, rollback note.',
        quiz: {
          question: 'What is the safest way to install new server resources?',
          options: ['Install 40 at once and hope', 'Add one category at a time and smoke test', 'Skip testing until launch day'],
          answer: 1,
          explanation: 'Small batches make bugs traceable and reduce launch-day failure.'
        }
      }),
      lesson({
        title: 'Discord Whitelist Funnel',
        xp: 240,
        objective: 'Build an onboarding funnel that filters serious players and creates service leads.',
        content: 'A good Discord is not just channels. It is a funnel: rules, application, interview or review, whitelist decision, onboarding, support, announcements, and retention events. Use clear role names, staff-only logs, support tickets, and status updates. If you charge for faster review or premium support, explain exactly what is being sold and avoid implying gameplay advantage.',
        steps: ['Create rules, announcements, applications, support, and staff-log channels.', 'Write application questions that test RP intent.', 'Create member, applicant, whitelist, VIP/supporter, and staff roles.', 'Publish review timeline and support expectations.', 'Track applications, approvals, denials, and reasons.'],
        checklist: ['Application questions exist', 'Staff log is private', 'Support tickets are available', 'Review timeline is published', 'Paid review language is transparent'],
        keyAnswers: ['Discord turns traffic into organized members.', 'Whitelist quality protects community culture.', 'Paid support must be clear service/access, not unfair advantage.'],
        worksheet: 'Write five application questions and define approval, denial, and appeal rules.',
        quiz: {
          question: 'What is the main purpose of a whitelist funnel?',
          options: ['Filter for serious players and protect community quality', 'Hide all server rules', 'Promise unfair gameplay advantages'],
          answer: 0,
          explanation: 'A whitelist funnel improves quality, moderation, and retention.'
        }
      }),
      lesson({
        title: 'Allowed Monetization Menu',
        xp: 300,
        objective: 'Create a paid offer ladder that funds the server without damaging fairness.',
        content: 'Your legal offer ladder should have three levels: entry support, premium identity, and done-for-you service. Entry support can include application review, supporter Discord roles, or cosmetic-only perks. Premium identity can include custom lore pages, non-advantage cosmetics, or community spotlight features. DFY services include setup, audit, Discord buildout, economy planning, or stream overlays. Every item needs delivery promise, refund policy, and support owner.',
        steps: ['Create 3 entry offers under $25.', 'Create 2 premium identity offers.', 'Create 1 high-ticket service offer.', 'Write delivery timeline for each offer.', 'Assign support owner and refund rules.'],
        checklist: ['No pay-to-win', 'Delivery timeline visible', 'Refund/support rules visible', 'Offer ladder has low and high ticket items'],
        keyAnswers: ['A good store sells support, cosmetics, identity, services, and community experiences.', 'A bad store sells power, cheats, stolen assets, or unclear promises.', 'Every paid offer needs fulfillment workflow.'],
        worksheet: 'Draft: offer name, price, buyer outcome, delivery step, support owner, legal note.',
        quiz: {
          question: 'Which offer belongs in a legal server monetization menu?',
          options: ['Priority support and cosmetic supporter identity', 'Invincible player package', 'Exploit money script'],
          answer: 0,
          explanation: 'Support and cosmetic identity can fund the server without unfair gameplay power.'
        }
      }),
      lesson({
        title: 'Launch Traffic & Retention',
        xp: 260,
        objective: 'Turn content into applications, applications into players, and players into retained community members.',
        content: 'Traffic only matters if it lands in a clear next step. Use clips, launch posts, creator partnerships, and community events to send people to the application channel. Retention comes from weekly events, patch notes, staff visibility, support response speed, and a reason to return. Track four numbers weekly: new Discord members, applications, approved players, and returning players.',
        steps: ['Publish one launch trailer, three clips, and one application CTA.', 'Invite creators with a clean server pitch.', 'Schedule the first three weekly events.', 'Track the four launch metrics.', 'Use feedback to tune onboarding and event cadence.'],
        checklist: ['Application CTA visible', 'Creator pitch ready', 'Event calendar ready', 'Weekly metrics tracked'],
        keyAnswers: ['Clips create attention; Discord captures attention; events retain attention.', 'Retention is an operating habit, not a one-time launch event.', 'Metrics reveal where the funnel leaks.'],
        worksheet: 'Track weekly: visitors, Discord joins, applications, approvals, returning players, support tickets, refunds.',
        quiz: {
          question: 'Which metric set best shows whether launch traffic is converting?',
          options: ['Only total video views', 'Discord joins, applications, approvals, returning players', 'How many random channels exist'],
          answer: 1,
          explanation: 'The full funnel shows whether attention becomes community value.'
        }
      }),
    ],
  },
  gta_real_money_guide: {
    title: 'GTA 6 Real Wealth: 5 Legitimate Income Pathways',
    category: 'Business Paths',
    difficulty: 'Intermediate',
    yieldEst: '$2k-$10k/mo service potential',
    description: 'A full legal business workshop for creators, designers, editors, server operators, and community builders who want to monetize GTA demand without scams or risky claims.',
    outcomes: ['Pick a legal money lane', 'Package a real offer', 'Price service work', 'Build a traffic-to-offer funnel'],
    prerequisites: ['Basic content or service skill', 'A Discord or landing page', 'Willingness to document delivery', 'No scam coin or cheat positioning'],
    deliverables: ['Income-path scorecard', 'Offer ladder', 'Delivery checklist', '30-day action plan'],
    workshopPrompt: 'Ask Lana: choose the best legal GTA business path for my skills, available hours, audience size, and budget.',
    lessons: ['Choose Your Legal Money Lane', 'Asset & Design Services', 'Content Clips & Affiliate Funnels', 'Server Setup Services', 'Templates, Memberships & Retainers', '30-Day Execution Plan'],
    details: [
      lesson({
        title: 'Choose Your Legal Money Lane',
        xp: 160,
        objective: 'Match your skills to a legal offer instead of chasing every trend.',
        content: 'There are five clean business paths around GTA demand: content, service, templates, server operations, and education. Content earns through ads, sponsors, affiliate links, memberships, and lead generation. Services earn through setup, audits, editing, Discord buildouts, or design. Templates earn through reusable downloads. Server operations earn through compliant community offers. Education earns through workshops, coaching, and research products. Pick one primary lane and one support lane.',
        steps: ['List your strongest skill.', 'Choose one buyer: player, creator, server owner, or investor-education audience.', 'Pick one paid outcome you can deliver.', 'Define a 7-day minimum product.', 'Write a one-sentence offer.'],
        checklist: ['Buyer is specific', 'Outcome is concrete', 'Delivery is legal', 'Offer can be delivered in 7 days'],
        keyAnswers: ['Money comes from outcomes, not hype.', 'A focused buyer beats a vague audience.', 'Legal offers sell time saved, quality, organization, content, support, and setup.'],
        worksheet: 'My buyer is __. Their problem is __. My paid outcome is __. Delivery takes __. Price starts at __.',
        quiz: {
          question: 'What is the safest first step when choosing a GTA business lane?',
          options: ['Sell every trend at once', 'Pick one buyer and one legal outcome', 'Promise free GTA coins'],
          answer: 1,
          explanation: 'Specific buyer plus legal outcome creates a product you can actually deliver.'
        }
      }),
      lesson({
        title: 'Asset & Design Services',
        xp: 220,
        objective: 'Understand how legal creative services become sellable packages.',
        content: 'Creative services can include original liveries, thumbnails, stream overlays, Discord graphics, server branding, map concepts, or lore documents. The rule is simple: make original work, use licensed assets, and document what is included. Sell packages by outcome: starter brand kit, 10-thumbnail pack, Discord refresh, content overlay kit, or city-pack concept board.',
        steps: ['Choose one creative deliverable.', 'Create a before/after sample.', 'Write exact included files.', 'Set revision limit.', 'Create delivery folder and invoice template.'],
        checklist: ['Original or licensed assets only', 'File list is clear', 'Revision policy exists', 'Portfolio sample exists'],
        keyAnswers: ['Buyers pay for finished deliverables, not vague creativity.', 'Revision limits protect profit.', 'Original work avoids takedowns and reputation damage.'],
        worksheet: 'Package: name, files included, delivery time, revisions, price, upsell.',
        quiz: {
          question: 'What protects a creative GTA service from disputes?',
          options: ['No written scope', 'Exact file list, revision limit, and delivery timeline', 'Using stolen art'],
          answer: 1,
          explanation: 'Scope, revisions, and timelines make delivery measurable.'
        }
      }),
      lesson({
        title: 'Content Clips & Affiliate Funnels',
        xp: 220,
        objective: 'Turn attention into trackable revenue without deceptive claims.',
        content: 'A content funnel has four parts: hook, value, trust, and CTA. Hook with a clear promise, deliver useful or entertaining information, cite safe sources when making claims, then send viewers to Discord, templates, services, or affiliate offers. Track click-through, Discord joins, email signups, and sales. Do not promote fake coins, fake beta keys, or suspicious downloads.',
        steps: ['Write five hooks.', 'Record or edit one short per day.', 'Add a consistent CTA.', 'Link to one clean landing page or Discord channel.', 'Track clicks and conversions weekly.'],
        checklist: ['CTA points to one destination', 'Claims are source-backed', 'No fake beta/coin links', 'Metrics are tracked'],
        keyAnswers: ['Views are not revenue until they move to a CTA.', 'Trust compounds when claims are source-backed.', 'Shorts can feed services, templates, and memberships.'],
        worksheet: 'Hook, value point, proof/source, CTA, destination, conversion metric.',
        quiz: {
          question: 'What turns content traffic into business value?',
          options: ['A clear CTA and tracked destination', 'No link anywhere', 'Fake download promises'],
          answer: 0,
          explanation: 'Traffic needs a destination and measurement to become revenue.'
        }
      }),
      lesson({
        title: 'Server Setup Services',
        xp: 260,
        objective: 'Package technical help into a priced service offer.',
        content: 'Server owners often need help with hosting setup, txAdmin, framework install, database connection, Discord, QA, and documentation. Package the work into tiers: starter setup, launch-ready setup, audit, and support retainer. Never promise platform approval or unrealistic income. Sell the setup, documentation, and support time you can control.',
        steps: ['Create intake questions.', 'Define starter and full-build scope.', 'List what is excluded.', 'Set milestone payments.', 'Deliver a launch checklist and handoff video.'],
        checklist: ['Scope and exclusions written', 'Payment milestone defined', 'Handoff docs included', 'No impossible guarantee'],
        keyAnswers: ['Services should sell controllable work.', 'Intake prevents bad-fit clients.', 'Documentation makes support cheaper.'],
        worksheet: 'Client intake: framework, host, Discord size, assets, deadline, budget, risks.',
        quiz: {
          question: 'What should a server setup service promise?',
          options: ['A clear setup deliverable and handoff docs', 'Guaranteed viral fame', 'A secret exploit economy'],
          answer: 0,
          explanation: 'Promise work you control: setup, documentation, QA, and support.'
        }
      }),
      lesson({
        title: 'Templates, Memberships & Retainers',
        xp: 240,
        objective: 'Build recurring revenue around repeatable knowledge.',
        content: 'Templates scale because the same product can sell many times. Memberships scale when members get fresh value, priority support, updates, and community access. Retainers work when customers need ongoing changes. The easiest ladder is template first, membership second, service third, retainer fourth.',
        steps: ['Pick one template to sell.', 'Add update schedule or support benefit.', 'Create a service upsell from the template.', 'Offer retainer only after successful delivery.', 'Track churn and support time.'],
        checklist: ['Template solves one problem', 'Membership has ongoing value', 'Service upsell is obvious', 'Retainer has monthly scope'],
        keyAnswers: ['Templates create leverage.', 'Memberships need ongoing value.', 'Retainers require clear monthly boundaries.'],
        worksheet: 'Template -> membership benefit -> service upsell -> retainer scope.',
        quiz: {
          question: 'What is the healthiest offer ladder?',
          options: ['Template, membership, service, retainer', 'Retainer before proof', 'No delivery scope'],
          answer: 0,
          explanation: 'The ladder starts easy and builds trust before high-ticket recurring work.'
        }
      }),
      lesson({
        title: '30-Day Execution Plan',
        xp: 280,
        objective: 'Convert the business path into a weekly operating plan.',
        content: 'A simple 30-day plan beats a complicated idea board. Week 1: pick buyer and build the first offer. Week 2: create proof and publish content. Week 3: collect leads and close first customers. Week 4: deliver, improve, and ask for testimonials. Every week needs one measurable output.',
        steps: ['Week 1 offer sheet.', 'Week 2 proof assets.', 'Week 3 lead outreach.', 'Week 4 delivery and testimonial.', 'Review pricing and repeat.'],
        checklist: ['Offer published', 'Proof asset exists', 'Leads tracked', 'First delivery completed', 'Testimonial requested'],
        keyAnswers: ['Execution is weekly output.', 'Proof sells better than claims.', 'Delivery quality creates repeat customers.'],
        worksheet: 'Write one output per week and one metric per output.',
        quiz: {
          question: 'What should Week 1 produce?',
          options: ['A clear buyer and first offer', 'A year of random ideas', 'A fake coin page'],
          answer: 0,
          explanation: 'The first week should create a sellable offer and buyer clarity.'
        }
      }),
    ],
  },
  gta_faceless_content_guide: {
    title: 'Faceless GTA 6 Content Strategy: Step-by-Step Channels',
    category: 'Content Creation',
    difficulty: 'Beginner',
    yieldEst: '$3k-$8.5k/mo channel potential',
    description: 'A full faceless content workshop for choosing a niche, scripting, editing, packaging clips, publishing consistently, and converting traffic legally.',
    outcomes: ['Choose a channel angle', 'Write retention scripts', 'Build a repeatable edit system', 'Create CTAs that convert'],
    prerequisites: ['Basic editing app', 'Official/source-safe media plan', 'One publishing platform', 'A CTA destination'],
    deliverables: ['Channel positioning sheet', 'Script template', 'Editing checklist', '30-day upload calendar'],
    workshopPrompt: 'Ask Lana: create a 30-day faceless GTA content calendar with hooks, video titles, shorts ideas, and store CTAs.',
    lessons: ['Niche & Positioning', 'Research Without Rumor Traps', 'Hook and Script Formula', 'Editing System', 'Publishing Calendar', 'Traffic to Revenue'],
    details: [
      lesson({
        title: 'Niche & Positioning',
        xp: 140,
        objective: 'Pick a channel lane narrow enough to own.',
        content: 'Faceless channels grow faster when viewers know exactly why to subscribe. Pick one lane: official news explained, trailer breakdowns, RP/server business education, legal money strategy, scam warnings, or creator tutorials. Avoid mixing every gaming topic at once. Your channel promise should tell viewers what answer they get every time.',
        steps: ['Choose one audience.', 'Choose one repeatable video promise.', 'Write five titles in that lane.', 'Check if you can publish 30 videos without running out.', 'Create a visual style rule.'],
        checklist: ['Audience is specific', 'Promise repeats', '30 topic ideas possible', 'Visual style is consistent'],
        keyAnswers: ['Narrow channels are easier to remember.', 'A promise beats random uploads.', 'Every title should answer one clear question.'],
        worksheet: 'Channel lane, audience, promise, recurring series, visual style.',
        quiz: {
          question: 'Which channel angle is easiest to position clearly?',
          options: ['Everything about every game', 'Official GTA news explained for RP creators', 'Random uploads with no theme'],
          answer: 1,
          explanation: 'A specific audience and promise make the channel easier to subscribe to.'
        }
      }),
      lesson({
        title: 'Research Without Rumor Traps',
        xp: 180,
        objective: 'Make content that stays trustworthy.',
        content: 'GTA content gets attention, but rumors can damage trust. Separate official sources, credible reporting, speculation, and entertainment. Label speculation clearly. Never send viewers to fake beta keys, fake coins, suspicious downloads, or leaked files. A good research workflow makes your channel brand safer and more sponsor-friendly.',
        steps: ['Create a source log.', 'Tag each source as official, reporting, speculation, or opinion.', 'Write claims in your own words.', 'Add disclaimers for speculation.', 'Remove unsafe links.'],
        checklist: ['Source log exists', 'Speculation is labeled', 'No scam links', 'No leaked files'],
        keyAnswers: ['Trust is a monetization asset.', 'Official and speculative claims must be separated.', 'Safety content can become a recurring series.'],
        worksheet: 'Source, date, claim, category, confidence, safe wording.',
        quiz: {
          question: 'What should you do with speculation?',
          options: ['Label it clearly', 'Pretend it is official', 'Attach suspicious downloads'],
          answer: 0,
          explanation: 'Clear labeling protects audience trust and creator reputation.'
        }
      }),
      lesson({
        title: 'Hook and Script Formula',
        xp: 220,
        objective: 'Write scripts that answer questions instead of rambling.',
        content: 'A strong script has a five-part structure: hook, context, proof, answer, CTA. The hook gives the viewer a reason to stay. Context explains why it matters. Proof shows the source or example. Answer gives the lesson. CTA sends the viewer to the next step. Keep each sentence short and cut anything that does not move the answer forward.',
        steps: ['Write one-sentence hook.', 'Add two context lines.', 'Add proof/source line.', 'Give three answer points.', 'Close with one CTA.'],
        checklist: ['Hook under 10 seconds', 'No long intro', 'Proof included', 'CTA is specific'],
        keyAnswers: ['The hook sells the next 10 seconds.', 'Short sentences improve retention.', 'A CTA should match the video topic.'],
        worksheet: 'Hook, context, proof, answer 1, answer 2, answer 3, CTA.',
        quiz: {
          question: 'What should a short-form hook do?',
          options: ['Make viewers stay for the answer', 'List your entire bio', 'Hide the topic'],
          answer: 0,
          explanation: 'The hook creates an open loop that the video answers quickly.'
        }
      }),
      lesson({
        title: 'Editing System',
        xp: 220,
        objective: 'Create a repeatable edit workflow that does not take all day.',
        content: 'Your editing system should use templates: intro motion, subtitle style, source card, B-roll rhythm, sound effects, and CTA end screen. Change the content, not the whole system. For shorts, vary the frame every two to four seconds using zooms, screenshots, text callouts, or safe B-roll. Keep audio clear before adding effects.',
        steps: ['Create one project template.', 'Save subtitle style.', 'Create source-card style.', 'Make three CTA end cards.', 'Batch edit 3-5 videos at a time.'],
        checklist: ['Audio is clear', 'Subtitles readable', 'Source cards consistent', 'CTA end screen exists'],
        keyAnswers: ['Templates create speed.', 'Audio clarity matters more than effects.', 'Visual changes keep attention without chaos.'],
        worksheet: 'Template assets: intro, subtitle, source card, SFX, CTA, export settings.',
        quiz: {
          question: 'What makes faceless editing sustainable?',
          options: ['Reusable templates and batching', 'Starting from scratch every time', 'Unreadable subtitles'],
          answer: 0,
          explanation: 'Templates and batching reduce editing time while keeping the brand consistent.'
        }
      }),
      lesson({
        title: 'Publishing Calendar',
        xp: 200,
        objective: 'Turn content into a repeatable operating schedule.',
        content: 'A calendar removes guesswork. Use weekly pillars: news explainers, route education, scam warnings, creator tools, server builds, and member offers. Batch research one day, scripts the next, recording/editing the next, scheduling after that. Track retention, clicks, comments, and conversions.',
        steps: ['Pick four weekly pillars.', 'Batch 10 hooks.', 'Write 5 scripts.', 'Edit 5 shorts.', 'Schedule and review metrics.'],
        checklist: ['Pillars chosen', 'Hooks batched', 'Uploads scheduled', 'Metrics reviewed'],
        keyAnswers: ['Consistency is easier when topics are pre-decided.', 'Metrics tell you which pillar deserves more output.', 'A calendar turns content into a business process.'],
        worksheet: 'Monday research, Tuesday script, Wednesday edit, Thursday schedule, Friday review.',
        quiz: {
          question: 'Why use content pillars?',
          options: ['They make ideas repeatable', 'They make uploads random', 'They replace editing'],
          answer: 0,
          explanation: 'Pillars keep content consistent and easier to batch.'
        }
      }),
      lesson({
        title: 'Traffic to Revenue',
        xp: 260,
        objective: 'Connect views to legal offers.',
        content: 'Revenue comes from connecting content to a fitting offer. A safety-warning video can point to membership or a trust checklist. A route video can point to a route planner. A server video can point to DFY setup or city packs. A creator tutorial can point to OBS templates. The CTA must be specific to the viewer problem.',
        steps: ['Match each content pillar to one product.', 'Create one landing destination.', 'Add CTA line to scripts.', 'Track link clicks.', 'Review conversions weekly.'],
        checklist: ['Every video has one CTA', 'CTA matches topic', 'Links tracked', 'Offer page explains outcome'],
        keyAnswers: ['Revenue is topic-match plus trust plus CTA.', 'One CTA usually converts better than five.', 'Content should pre-sell the product page.'],
        worksheet: 'Video topic -> viewer problem -> product -> CTA -> metric.',
        quiz: {
          question: 'Which CTA is strongest?',
          options: ['Click five random links', 'Get the matching route planner below', 'No next step'],
          answer: 1,
          explanation: 'A specific CTA tied to the viewer problem is more likely to convert.'
        }
      }),
    ],
  },
  gta_agency_solo_guide: {
    title: 'Agency Empire: Make Millions Solo — The Complete Blueprint',
    category: 'Gameplay Route',
    difficulty: 'Intermediate',
    yieldEst: 'High legal in-game route yield',
    description: 'A legal GTA Online-style solo Agency route workshop focused on planning, time management, mission selection, safety, and clean payout tracking.',
    outcomes: ['Understand Agency setup decisions', 'Prioritize efficient legal mission loops', 'Track payout per hour', 'Avoid risky shortcut advice'],
    prerequisites: ['Agency access in supported game mode', 'Basic mission comfort', 'Timer or tracking sheet', 'No exploit/session manipulation'],
    deliverables: ['Solo route checklist', 'Payout tracker', 'Mission priority matrix', 'Weekly review sheet'],
    workshopPrompt: 'Ask Lana: build a legal solo Agency route plan with mission priority, cooldown timers, payout tracking, and safety notes.',
    lessons: ['Agency Setup Decisions', 'Security Contract Loop', 'VIP/Dre-Style Mission Planning', 'Payphone/Side Mission Timing', 'Safety and Clean Session Rules', 'Payout Review and Optimization'],
    details: [
      lesson({
        title: 'Agency Setup Decisions',
        xp: 120,
        objective: 'Choose upgrades and setup order without wasting early cash.',
        content: 'The Agency route starts with cost discipline. Buy only what supports your route goal first. Cosmetic upgrades can wait until the business pays for them. Choose a location that reduces travel time for the missions you run most. Write down purchase cost, setup cost, and target payback sessions so you know when the route becomes profitable.',
        steps: ['Record purchase cost.', 'Choose location based on route access.', 'Delay nonessential cosmetics.', 'Set a payback target.', 'Track the first ten sessions.'],
        checklist: ['Cost logged', 'Route travel time considered', 'Cosmetics delayed', 'Payback target written'],
        keyAnswers: ['A route is profitable after payback, not after purchase.', 'Location matters because travel time reduces hourly return.', 'Early cash should support efficiency first.'],
        worksheet: 'Purchase cost, upgrades, route time, target sessions, payback point.',
        quiz: {
          question: 'What should guide Agency setup spending?',
          options: ['Efficiency and payback plan', 'Buying every cosmetic first', 'Ignoring travel time'],
          answer: 0,
          explanation: 'Efficient setup protects early capital and shortens payback time.'
        }
      }),
      lesson({
        title: 'Security Contract Loop',
        xp: 180,
        objective: 'Prioritize mission types by time, payout, and consistency.',
        content: 'A good route measures payout per minute, not just payout per mission. Fast missions with consistent completion can beat high-paying slow missions. Track start time, end time, payout, travel time, and failure risk. After ten runs, rank mission types and keep the top two.',
        steps: ['Run ten legal contracts.', 'Time each one.', 'Log payout and notes.', 'Rank by payout per minute.', 'Focus on the top two reliable types.'],
        checklist: ['Timer used', 'Payout logged', 'Failed runs recorded', 'Top mission types selected'],
        keyAnswers: ['Payout per minute is the useful metric.', 'Consistency beats theoretical max payout.', 'Logs reveal what actually works for your route.'],
        worksheet: 'Mission, start, finish, payout, travel time, fail reason, payout/minute.',
        quiz: {
          question: 'Which metric best compares mission efficiency?',
          options: ['Payout per minute', 'Mission name length', 'Random preference only'],
          answer: 0,
          explanation: 'Payout per minute includes both money and time cost.'
        }
      }),
      lesson({
        title: 'VIP/Dre-Style Mission Planning',
        xp: 220,
        objective: 'Plan larger mission chains without losing time.',
        content: 'Longer mission chains need preparation: supplies, vehicle choice, armor/snacks where available, route notes, and interruption plan. Treat big chains like scheduled work blocks. Do not start them if you only have a few minutes. Use a checklist before launch and a recap after completion.',
        steps: ['Block enough time.', 'Prepare vehicle and supplies.', 'Check mission requirements.', 'Run chain without side distractions.', 'Record total time and payout.'],
        checklist: ['Time block available', 'Supplies ready', 'Vehicle ready', 'Payout/time logged'],
        keyAnswers: ['Long chains need uninterrupted time.', 'Preparation reduces failed runs.', 'Total chain time matters more than individual mission feeling.'],
        worksheet: 'Chain name, prep items, start time, finish time, payout, mistakes.',
        quiz: {
          question: 'When should you start a long mission chain?',
          options: ['When you have enough uninterrupted time', 'When you have one minute left', 'Without supplies or route plan'],
          answer: 0,
          explanation: 'Long missions are most efficient when prepared and uninterrupted.'
        }
      }),
      lesson({
        title: 'Payphone/Side Mission Timing',
        xp: 180,
        objective: 'Use side missions as fillers instead of distractions.',
        content: 'Side missions are useful when they fill cooldown windows or short play sessions. They become inefficient when they interrupt your best route. Put side activities into a timer list, then run them only when they fit the route schedule.',
        steps: ['List cooldown windows.', 'List side mission average time.', 'Match side missions to dead time.', 'Avoid interrupting high-yield loops.', 'Track total hourly return.'],
        checklist: ['Cooldowns known', 'Side mission time known', 'Filler schedule written', 'Hourly return reviewed'],
        keyAnswers: ['Side missions should fill gaps.', 'Interruptions reduce route efficiency.', 'Timers make routes cleaner.'],
        worksheet: 'Cooldown, filler option, expected time, expected payout, run/skip decision.',
        quiz: {
          question: 'When should a side mission be used?',
          options: ['When it fills dead time without breaking the main route', 'Whenever it appears no matter what', 'Never record it'],
          answer: 0,
          explanation: 'Side missions are best as planned fillers.'
        }
      }),
      lesson({
        title: 'Safety and Clean Session Rules',
        xp: 220,
        objective: 'Avoid risky advice and keep the route account-safe.',
        content: 'This workshop does not teach exploit sessions, glitches, mod menus, or account-risk shortcuts. Use legitimate session types and game settings available to you. Protect time with planning, not manipulation. If a tactic depends on breaking platform rules, skip it and focus on legal route efficiency, private/invite options where allowed, or crew scheduling.',
        steps: ['Remove exploit-based tactics from your plan.', 'Use allowed session options.', 'Keep route notes clean.', 'Avoid suspicious downloads.', 'Report scam tools to your community.'],
        checklist: ['No exploit steps', 'No third-party cheat tools', 'No suspicious downloads', 'Allowed session settings only'],
        keyAnswers: ['Account safety is part of profit.', 'Legal efficiency beats risky shortcuts long-term.', 'Community trust matters more than one high payout.'],
        worksheet: 'Risky tactic, why it is risky, legal replacement, note to crew.',
        quiz: {
          question: 'What should replace exploit-based route advice?',
          options: ['Legal planning, allowed settings, and better timing', 'A mod menu', 'Suspicious downloads'],
          answer: 0,
          explanation: 'Legal planning improves efficiency without account or community risk.'
        }
      }),
      lesson({
        title: 'Payout Review and Optimization',
        xp: 240,
        objective: 'Use data to improve the route week by week.',
        content: 'At the end of the week, review total time, total payout, average payout per hour, failure points, and best mission types. Keep what works, cut what wastes time, and write one improvement for next week. This is how casual grinding becomes a system.',
        steps: ['Add total time.', 'Add total payout.', 'Calculate average payout per hour.', 'Identify top mission type.', 'Write one next-week improvement.'],
        checklist: ['Weekly totals calculated', 'Best loop chosen', 'Worst time sink removed', 'Next action written'],
        keyAnswers: ['Optimization needs records.', 'One improvement per week compounds.', 'The best route is the one you can repeat safely.'],
        worksheet: 'Week, hours, payout, payout/hour, best loop, worst waste, next improvement.',
        quiz: {
          question: 'What makes a route improve over time?',
          options: ['Weekly measurement and one change', 'Guessing forever', 'Deleting notes'],
          answer: 0,
          explanation: 'Review plus one change creates compounding route improvement.'
        }
      }),
    ],
  },
  '1': {
    title: 'Leonida Transport Logistics: $1M Launch Week Run',
    category: 'Gameplay Route',
    difficulty: 'Beginner',
    yieldEst: 'Launch-week legal route plan',
    description: 'A beginner workshop for planning legal courier-style routes, timing stops, protecting cash, and reviewing payout data.',
    outcomes: ['Plan a route loop', 'Track legal payout windows', 'Avoid risky shortcuts', 'Review route performance'],
    prerequisites: ['Starter vehicle', 'Timer', 'Route notes', 'Legal session only'],
    deliverables: ['Route map worksheet', 'Cooldown tracker', 'Cash protection checklist'],
    workshopPrompt: 'Ask Lana: build me a beginner legal transport route with stops, timers, payout notes, and safety rules.',
    lessons: ['Route Objective', 'Vehicle and Stop Planning', 'Timer and Cooldown Tracking', 'Cash Protection', 'Weekly Review'],
    details: [
      lesson({
        title: 'Route Objective',
        xp: 100,
        objective: 'Define what the route should accomplish.',
        content: 'A launch-week route needs one objective: earn clean starter cash without wasting time or risking the account. Decide whether the run is solo practice, crew coordination, or content capture. That decision changes the route length and checklist.',
        steps: ['Choose solo, crew, or content mode.', 'Set time limit.', 'Set payout target.', 'Write stop list.', 'Choose review metric.'],
        checklist: ['Mode selected', 'Time limit set', 'Target written', 'Stops listed'],
        keyAnswers: ['Routes need an objective.', 'Shorter beginner routes are easier to improve.', 'Clean data beats guesswork.'],
        worksheet: 'Mode, time limit, payout target, stops, review metric.',
        quiz: {
          question: 'What is the first decision in route planning?',
          options: ['Route objective', 'Random driving', 'Downloading cheats'],
          answer: 0,
          explanation: 'The objective sets every route decision after it.'
        }
      }),
      lesson({
        title: 'Vehicle and Stop Planning',
        xp: 120,
        objective: 'Choose route pieces that reduce wasted travel time.',
        content: 'Plan stops in a clean loop. Avoid crossing the map for tiny payouts. Pick a vehicle that is reliable, easy to control, and cheap to replace. A lower payout route can win if it finishes faster and fails less often.',
        steps: ['Mark start point.', 'Choose 3-5 stops.', 'Remove distant low-value stops.', 'Pick reliable vehicle.', 'Run one test loop.'],
        checklist: ['Stops form a loop', 'Vehicle is reliable', 'Low-value detours removed', 'Test run complete'],
        keyAnswers: ['Travel time is hidden cost.', 'Reliability matters.', 'Test loops expose bad stops.'],
        worksheet: 'Stop, expected payout, travel time, risk, keep/remove.',
        quiz: {
          question: 'Why remove distant low-value stops?',
          options: ['They reduce payout per minute', 'They improve every route', 'They are always mandatory'],
          answer: 0,
          explanation: 'Long travel for low payout hurts efficiency.'
        }
      }),
      lesson({
        title: 'Timer and Cooldown Tracking',
        xp: 140,
        objective: 'Use timers to stop losing money to waiting.',
        content: 'Cooldowns are not dead time if you plan around them. Track when a route starts, when it pays, and when it can repeat. Fill gaps with legal side tasks or content capture only if they do not break the main route.',
        steps: ['Start timer at route launch.', 'Record payout time.', 'Record cooldown window.', 'Add filler only if useful.', 'Review total cycle time.'],
        checklist: ['Timer used', 'Payout time logged', 'Cooldown logged', 'Filler planned'],
        keyAnswers: ['Cooldowns can be planned.', 'Cycle time matters.', 'Fillers should support the route.'],
        worksheet: 'Run start, payout, cooldown, filler, next start.',
        quiz: {
          question: 'What turns cooldowns into productive time?',
          options: ['A planned filler task', 'Waiting with no notes', 'Risky exploit tools'],
          answer: 0,
          explanation: 'Planned fillers keep the route moving legally.'
        }
      }),
      lesson({
        title: 'Cash Protection',
        xp: 140,
        objective: 'Keep early earnings from disappearing into bad purchases.',
        content: 'Early route money should build the route, not vanity. Create a simple split: save, upgrade, operating cash, and fun money. Do not buy expensive cosmetic items before the route pays consistently.',
        steps: ['Set savings percentage.', 'Set upgrade budget.', 'Keep operating cash.', 'Delay vanity purchases.', 'Review after five runs.'],
        checklist: ['Savings split written', 'Upgrade budget written', 'Vanity delay rule set', 'Review scheduled'],
        keyAnswers: ['Money management is part of route strategy.', 'Early vanity spending delays growth.', 'A split prevents impulse buying.'],
        worksheet: 'Income, save %, upgrade %, operating %, fun %.',
        quiz: {
          question: 'What should early route cash fund first?',
          options: ['Route efficiency and savings', 'Only vanity purchases', 'Suspicious shortcuts'],
          answer: 0,
          explanation: 'Early cash should strengthen the route and protect progress.'
        }
      }),
      lesson({
        title: 'Weekly Review',
        xp: 160,
        objective: 'Turn a beginner route into a repeatable system.',
        content: 'A weekly review asks five questions: How much did I earn? How long did it take? Where did time leak? What failed? What will I change? One route improvement per week compounds quickly.',
        steps: ['Total payouts.', 'Total time.', 'Find worst stop.', 'Find best stop.', 'Change one thing.'],
        checklist: ['Payout/hour calculated', 'Worst stop identified', 'Best stop identified', 'One change chosen'],
        keyAnswers: ['Reviews create learning.', 'One small change is enough.', 'Repeatable beats random.'],
        worksheet: 'Week, payout, hours, best stop, worst stop, next change.',
        quiz: {
          question: 'What should every weekly review produce?',
          options: ['One route improvement', 'No notes', 'A fake coin link'],
          answer: 0,
          explanation: 'One clear improvement makes the next week better.'
        }
      }),
    ],
  },
  '2': {
    title: 'Branded Content Funnel: Converting Gameplay to Passive Cash',
    category: 'Content Creation',
    difficulty: 'Intermediate',
    yieldEst: '$3.4k/mo funnel potential',
    description: 'A full workshop for turning gameplay, tutorials, and server clips into a legal content funnel that sells templates, services, and memberships.',
    outcomes: ['Write stronger hooks', 'Build a lead capture path', 'Connect content to offers', 'Track conversion data'],
    prerequisites: ['One content platform', 'A Discord or landing page', 'One paid offer', 'Basic editing workflow'],
    deliverables: ['Hook bank', 'CTA map', 'Lead form checklist', 'Weekly conversion tracker'],
    workshopPrompt: 'Ask Lana: map my next 10 GTA clips into hooks, CTAs, store products, and Discord lead capture.',
    lessons: ['Funnel Map', 'Five-Second Hook Pattern', 'Lead Capture', 'Offer Match', 'Follow-Up System', 'Metrics Review'],
    details: [
      lesson({
        title: 'Funnel Map',
        xp: 120,
        objective: 'Understand how attention becomes a sale.',
        content: 'A content funnel is a path: clip, CTA, landing page or Discord, lead capture, offer, follow-up, delivery. If one step is missing, views leak away. Your first map should be simple enough to explain in one sentence.',
        steps: ['Choose one clip topic.', 'Choose one CTA.', 'Choose one destination.', 'Choose one offer.', 'Write follow-up message.'],
        checklist: ['Clip topic chosen', 'CTA chosen', 'Destination exists', 'Offer matches topic'],
        keyAnswers: ['Views need a path.', 'One clear CTA beats clutter.', 'Offer must match viewer intent.'],
        worksheet: 'Clip -> CTA -> destination -> offer -> follow-up.',
        quiz: {
          question: 'What is the job of a funnel?',
          options: ['Move attention toward a specific next step', 'Hide the offer', 'Confuse viewers with five unrelated links'],
          answer: 0,
          explanation: 'A funnel turns attention into a measurable action.'
        }
      }),
      lesson({
        title: 'Five-Second Hook Pattern',
        xp: 160,
        objective: 'Write hooks that make viewers stay.',
        content: 'The hook should make a viewer ask, “what happens next?” Use result hooks, mistake hooks, comparison hooks, or warning hooks. Good examples: “This server launch mistake costs owners their first 100 players,” or “I tested three legal route loops so you do not waste launch week.”',
        steps: ['Pick result, mistake, comparison, or warning.', 'Write 10 hooks.', 'Cut each below 12 words if possible.', 'Read them out loud.', 'Use the clearest one first.'],
        checklist: ['Hook type selected', '10 hooks written', 'Best hook chosen', 'No fake claims'],
        keyAnswers: ['Hooks create curiosity.', 'Specific beats hype.', 'Warnings must be honest.'],
        worksheet: 'Topic, hook type, hook, proof point, CTA.',
        quiz: {
          question: 'Which hook is strongest?',
          options: ['“Stuff happened”', '“This server launch mistake costs owners their first 100 players”', '“Watch maybe”'],
          answer: 1,
          explanation: 'It is specific, stakes-driven, and relevant to a buyer.'
        }
      }),
      lesson({
        title: 'Lead Capture',
        xp: 180,
        objective: 'Collect interested people without making the funnel complicated.',
        content: 'Lead capture can be a Discord channel, form, email signup, or checkout request. Ask only for what you need: contact, goal, budget, deadline, and current blocker. Too many questions reduce completion; too few questions create bad leads.',
        steps: ['Create lead destination.', 'Ask five intake questions.', 'Add confirmation message.', 'Tag leads by offer type.', 'Follow up within 24 hours.'],
        checklist: ['Contact field exists', 'Goal field exists', 'Budget field exists', 'Follow-up script ready'],
        keyAnswers: ['Lead capture must be short.', 'Follow-up speed matters.', 'Lead tags help prioritize.'],
        worksheet: 'Contact, goal, blocker, budget, deadline, offer tag.',
        quiz: {
          question: 'What should a lead form collect first?',
          options: ['Contact and goal', 'Thirty unrelated questions', 'Nothing at all'],
          answer: 0,
          explanation: 'Contact and goal are enough to start a useful follow-up.'
        }
      }),
      lesson({
        title: 'Offer Match',
        xp: 180,
        objective: 'Connect each clip topic to the product that solves the problem.',
        content: 'A route clip should sell route planners or coaching. A server clip should sell setup, audits, or city packs. A creator clip should sell OBS scenes or content maps. A scam clip should sell safety education or premium membership. Matching matters more than pushing the same product everywhere.',
        steps: ['List content pillars.', 'Assign one product to each pillar.', 'Write CTA for each product.', 'Test for one week.', 'Keep highest converter.'],
        checklist: ['Pillars mapped', 'Products matched', 'CTA written', 'Conversion tracked'],
        keyAnswers: ['Match product to viewer problem.', 'One week of data beats assumptions.', 'CTA copy should sound like the video topic.'],
        worksheet: 'Pillar, problem, product, CTA, conversion metric.',
        quiz: {
          question: 'What should a server-build clip sell?',
          options: ['Server setup, audits, or city packs', 'Unrelated fashion tips', 'Fake beta keys'],
          answer: 0,
          explanation: 'The offer should match the viewer problem.'
        }
      }),
      lesson({
        title: 'Follow-Up System',
        xp: 200,
        objective: 'Turn leads into customers with clear next steps.',
        content: 'Follow-up should be useful, short, and specific. Confirm the problem, recommend the smallest paid step, explain delivery, and ask for yes/no. Do not send giant walls of text. Create three scripts: warm lead, budget lead, and not-ready lead.',
        steps: ['Create three follow-up scripts.', 'Respond within 24 hours.', 'Recommend one paid next step.', 'Send delivery timeline.', 'Track outcome.'],
        checklist: ['Warm script ready', 'Budget script ready', 'Not-ready script ready', 'Outcome tracked'],
        keyAnswers: ['Follow-up closes the loop.', 'One recommendation reduces confusion.', 'Not-ready leads can join membership or free list.'],
        worksheet: 'Lead type, response, offer, delivery, next follow-up date.',
        quiz: {
          question: 'What should follow-up recommend?',
          options: ['One clear next step', 'Ten random products', 'No action'],
          answer: 0,
          explanation: 'One clear recommendation makes buying easier.'
        }
      }),
      lesson({
        title: 'Metrics Review',
        xp: 220,
        objective: 'Improve the funnel from numbers, not vibes.',
        content: 'Track five metrics weekly: views, clicks, leads, sales, and delivery time. If views are high but clicks are low, fix CTA. If clicks are high but leads are low, fix landing page. If leads are high but sales are low, fix offer or follow-up. If sales are high but delivery is slow, fix operations.',
        steps: ['Record weekly views.', 'Record clicks.', 'Record leads.', 'Record sales.', 'Write the bottleneck and fix.'],
        checklist: ['Metrics logged', 'Bottleneck named', 'One fix chosen', 'Next review scheduled'],
        keyAnswers: ['Each metric points to a different fix.', 'Do not change everything at once.', 'Operations matter after sales start.'],
        worksheet: 'Views, clicks, leads, sales, delivery time, bottleneck, fix.',
        quiz: {
          question: 'If views are high but clicks are low, what should you fix first?',
          options: ['CTA', 'Database engine', 'Random unrelated product'],
          answer: 0,
          explanation: 'Low clicks mean the next step is not compelling or clear enough.'
        }
      }),
    ],
  },
};

const enrichTrainingWorkshops = (workshops) => workshops.map((training) => {
  const upgrade = fullWorkshopUpgrades[training.id];
  return upgrade ? { ...training, ...upgrade } : training;
});

const buildDraftDetails = (lessonsList, title, category, difficulty) => (
  (lessonsList.length ? lessonsList : ['Introduction', 'Setup', 'Money Path', 'Launch Checklist']).map((name, index) => lesson({
    title: name.replace(/^Lesson\s*\d+\s*:\s*/i, ''),
    xp: 100 + (index * 40),
    objective: `Teach the learner how to complete ${name.replace(/^Lesson\s*\d+\s*:\s*/i, '').toLowerCase()} with a legal, repeatable workflow.`,
    content: `This draft lesson belongs to ${title}. Explain the concept, why it matters, what the learner should do first, what evidence proves it worked, and which legal monetization path it supports. Keep the advice specific to ${category} and avoid cheats, exploits, stolen assets, fake coins, or risky shortcuts.`,
    steps: ['Define the learner outcome.', 'Show the setup or preparation step.', 'Run the workflow once.', 'Record the result.', 'Choose the next improvement.'],
    checklist: ['Outcome written', 'Setup completed', 'Result recorded', 'Legal risk checked'],
    keyAnswers: ['A complete workshop teaches why, what, how, and how to verify.', 'Money comes from legal value, delivery, content, support, or service.', `Difficulty: ${difficulty}. Adjust support and assumptions to match that level.`],
    worksheet: 'Learner outcome, required setup, action steps, proof metric, monetization path.',
    quiz: {
      question: 'What should every complete workshop lesson include?',
      options: ['Only a title', 'Objective, steps, checklist, answer key, and legal money path', 'A cheat download'],
      answer: 1,
      explanation: 'A full lesson needs enough context and answers for the learner to act safely.'
    }
  }))
);

function TrainingWorkshopPage() {
  const [trainings, setTrainings] = useState(() => {
    const saved = localStorage.getItem('gta_money_team_trainings');
    if (saved) return enrichTrainingWorkshops(JSON.parse(saved));
    return enrichTrainingWorkshops([
      {
        id: 'gta_server_guide',
        title: 'GTA 6 Server Business Plan: Host & Monetize Legally',
        category: 'Wealth Strategy',
        difficulty: 'Advanced',
        yieldEst: '$5,000 - $25,000/mo',
        description: 'Step-by-step gamified guide to launching, hosting, marketing, and monetizing a compliant Roleplay server.',
        image: './images/gta-server-training.jpg',
        lessons: [
          'txAdmin Environment & DB Setup',
          'Tebex Gateway & Rockstar Compliance',
          'Whitelist Application Monetization Flow',
          'Viral Clip Traffic Engine & Streamer Outreach'
        ],
        details: [
          {
            title: 'txAdmin Environment & DB Setup',
            xp: 150,
            content: `🖥️ STEP 1 — Choose Your Server Hardware\n\nDo NOT use shared hosting or cheap game server panels. You need a dedicated VPS (Virtual Private Server) with at minimum: 4 CPU cores, 8GB RAM, 100GB SSD NVMe, and a 1Gbps network port. Providers like Contabo, OVH, and Vultr offer plans starting at $10–$30/mo that handle 50–128 players easily.\n\n🖥️ STEP 2 — Install txAdmin on Linux\n\ntxAdmin is the official FiveM server management interface. On a fresh Ubuntu 22.04 VPS, run:\n  1. sudo apt update && sudo apt install -y git curl wget unzip\n  2. Download the FiveM artifact from https://runtime.fivem.net/artifacts/fivem/build_proot_linux/master/\n  3. Extract and place in /home/fivem/server/\n  4. Run it once to get the txAdmin PIN — open http://YOUR.SERVER.IP:40120 in a browser and enter the PIN\n  5. Use txAdmin to scaffold a new server with QBCore (the most popular and well-documented base framework)\n\n🗄️ STEP 3 — Set Up MariaDB (Your Player Database)\n\n  1. Run: sudo apt install mariadb-server\n  2. Secure it: sudo mysql_secure_installation\n  3. Create a dedicated database: CREATE DATABASE gtarp; CREATE USER 'rp_admin'@'localhost' IDENTIFIED BY 'StrongPass123!'; GRANT ALL ON gtarp.* TO 'rp_admin'@'localhost';\n  4. In your server.cfg, add: set mysql_connection_string "mysql://rp_admin:StrongPass123!@localhost/gtarp"\n\n⚡ PRO TIP — Optimize for Lag\n\nAlways run your DB on the same physical machine as the server. Network hops between a remote DB and your game server add 50–200ms of lag per query, making the game feel broken. Local SQL = buttery smooth inventory and vehicle saves.\n\n🔐 STEP 4 — Configure Your server.cfg Properly\n\nCritical settings you must have:\n  • sv_maxclients 64 (start small — a laggy 128-slot server kills reputation)\n  • sv_licenseKey YOUR_KEY_HERE (get from https://keymaster.fivem.net)\n  • sv_hostname "YourServerName | GTA Money Team"\n  • set sv_enforceGameBuild 3095 (locks game build to prevent mismatches)\n  • Add steam, discord, and fivem identifiers for bans and logging\n\n💡 KEY INSIGHT: Most beginners skip proper server.cfg setup and wonder why their server crashes or lags. The database and hardware foundation is what separates $500/mo servers from dead ones.`,
            quiz: {
              question: 'What is the minimum recommended RAM for a FiveM/GTA RP server hosting 50–64 players smoothly?',
              options: ['2GB RAM — enough for any game server', '8GB RAM — handles scripts, DB queries, and player connections', '32GB RAM — always go maximum'],
              answer: 1,
              explanation: '8GB RAM is the practical minimum for 50-64 players with QBCore. Less causes script timeouts and crash loops. 32GB is overkill unless you exceed 100 concurrent players.'
            }
          },
          {
            title: 'Tebex Gateway & Rockstar Compliance',
            xp: 250,
            content: `💳 WHAT IS TEBEX?\n\nTebex (formerly Buycraft) is the ONLY payment processor officially sanctioned by Cfx.re (the organization behind FiveM/RedM). This means it is the only legal way to accept real money for your GTA RP server. Any server using PayPal, Stripe direct, or Cash App for server perks risks permanent server blacklisting.\n\n✅ STEP 1 — Create Your Tebex Store\n\n  1. Go to https://creator.tebex.io and register\n  2. Set your store name (e.g. "Vice City Elite Store")\n  3. Connect your Cfx.re server by adding your Tebex Secret Key to your server.cfg: set tebex_secret YOUR_SECRET_KEY\n  4. Verify the connection in the Tebex dashboard under "Server Connections"\n\n📦 STEP 2 — What You CAN Legally Sell\n\nUnder Rockstar's Creator Program and Cfx.re rules, you are ALLOWED to sell:\n  ✅ Priority Queue slots (VIP queue bypass)\n  ✅ Cosmetic clothing, tattoos, and visual-only vehicle wraps\n  ✅ Discord role assignments (whitelist, VIP tag)\n  ✅ Whitelist application processing fees ($5–$15)\n  ✅ Custom character slots beyond the default\n  ✅ In-character business starter packs (cosmetic-only)\n\n🚫 STEP 3 — What You CANNOT Sell (Platform Ban Risk)\n\n  ❌ Modded weapons with enhanced stats or unlimited ammo\n  ❌ Pre-loaded in-game cash/money (pay-to-win)\n  ❌ Leaked or stolen paid scripts from other servers\n  ❌ "God mode" or other gameplay advantages\n  ❌ Real cash converted to in-game currency directly\n\n💰 STEP 4 — Structure Your Store for Maximum Revenue\n\nHere is a proven store tier structure:\n  🥉 Bronze VIP ($4.99/mo): Priority queue + Bronze Discord tag\n  🥈 Silver VIP ($9.99/mo): Priority queue + Silver tag + 1 cosmetic vehicle wrap/mo\n  🥇 Gold VIP ($19.99/mo): All above + custom character slot + early access events\n  💎 Founder ($49.99 one-time): Permanent founder tag, custom server office, beta tester role\n\n⚡ PRO TIP: Tebex handles VAT/GST automatically for international buyers. Set your payment currency to USD and Tebex will convert for buyers worldwide. Enable Tebex Checkout for the cleanest purchase experience.`,
            quiz: {
              question: 'Which of the following Tebex store items would get your server blacklisted by Cfx.re?',
              options: ['Priority queue bypass subscription at $9.99/mo', 'Pre-loaded GTA cash given directly to player accounts', 'Cosmetic Discord role and character visual pack'],
              answer: 1,
              explanation: 'Selling pre-loaded in-game currency is direct pay-to-win and violates Rockstar\'s monetization policy. Your server gets blacklisted and your Tebex account suspended. Sell cosmetics and access, never gameplay advantages.'
            }
          },
          {
            title: 'Whitelist Application Monetization Flow',
            xp: 350,
            content: `🎯 WHY WHITELIST YOUR SERVER?\n\nOpen servers attract griefers, trolls, and low-quality players who destroy roleplay immersion and drive paying members away. A whitelist creates a quality barrier that:\n  • Filters serious players from time-wasters\n  • Generates immediate revenue from day one (before you even have 10 players)\n  • Creates a perceived scarcity and exclusivity that raises the server's social value\n  • Covers your monthly VPS bill ($20–$50/mo) automatically\n\n📋 STEP 1 — Build Your Whitelist Application Form\n\nUse Google Forms or a custom Discord bot (like Wickbot or Carlbot) to collect:\n  • GTA Username & Discord ID\n  • Roleplay experience (hours played on other servers)\n  • Why they want to join your server specifically\n  • A short scenario response: "You witness a robbery. What do you do in character?"\n  • Agreement to server rules\n\n💵 STEP 2 — Set Up the Payment Gate\n\n  1. Create a Tebex package called "Whitelist Application Processing Fee" at $9.99\n  2. Set it to deliver a webhook to your Discord server confirming payment\n  3. After payment, redirect them to your Google Form application\n  4. Staff review within 24 hours — this turnaround time is a KEY selling point\n\n📣 STEP 3 — Market the Exclusivity\n\nYour Discord announcements and TikTok clips should always mention:\n  "Limited whitelist spots open — apply before we close applications this weekend"\n  "Only 12 spots remaining this week"\n  "We review every application personally within 24 hours"\n\nScarcity and personal touch convert browsers into applicants.\n\n📊 STEP 4 — Monthly Whitelist Revenue Math\n\nLet's say you process 30 applications/month at $9.99 each:\n  30 × $9.99 = $299.70/mo in whitelist fees alone\n  + VIP subscriptions from accepted players\n  + Tebex store purchases from active members\n\nWhitelist revenue typically covers your VPS and operational costs entirely, making everything else pure profit.\n\n⚡ PRO TIP — Automate Rejections Too\n\nHave a polite, templated rejection message that offers a re-application path in 30 days. This keeps rejected applicants engaged with your community and many will reapply — especially if you post a "what we look for" guide. Some of the best players are ones who improved after rejection.`,
            quiz: {
              question: 'If you charge $9.99 per whitelist application and process 30 applications per month, what is your whitelist revenue?',
              options: ['$99.90/mo', '$299.70/mo', '$999.00/mo'],
              answer: 1,
              explanation: '30 × $9.99 = $299.70/mo in application fees. This covers a quality VPS (~$30–50/mo) plus leaves profit. As your server grows, this compounds with VIP subscriptions on top.'
            }
          },
          {
            title: 'Viral Clip Traffic Engine & Streamer Outreach',
            xp: 400,
            content: `🎥 THE TRAFFIC FLYWHEEL THAT FILLS YOUR SERVER\n\nNo server survives on the server browser alone. The #1 growth engine for RP servers in 2024–2026 is short-form viral content. Here is the full system:\n\n📱 STEP 1 — Set Up Your Recording Stack\n\n  • Use NVIDIA ShadowPlay or AMD ReLive for zero-lag background recording (always-on)\n  • Hotkey: Alt+F10 saves the last 3 minutes of gameplay automatically\n  • Store clips in a dedicated "Viral Clips" folder sorted by date\n  • Record at 1080p 60fps minimum — quality matters for algorithm push\n\n✂️ STEP 2 — The 15-Second Clip Formula\n\nEvery clip must follow this structure:\n  [0:00–0:02] The Hook: Start MID-action. Never show loading screens or walking.\n  [0:02–0:10] The Escalation: The funny, dramatic, or shocking part of the scene\n  [0:10–0:14] The Punchline/Reaction: The moment that makes people rewatch\n  [0:14–0:15] CTA: "Join us — link in bio" with your server name on screen\n\nEdit in CapCut (free, mobile and desktop) or DaVinci Resolve for more control.\n\n📅 STEP 3 — The Daily Upload Schedule\n\n  Monday–Friday: 1 TikTok clip + post to Instagram Reels + YouTube Shorts\n  Saturday: "Server highlight reel" (60-second compilation)\n  Sunday: "This week on our server" teaser with upcoming server events\n\nConsistency > viral hits. Posting 5 clips/week for 8 weeks will grow an audience faster than posting 1 perfect clip once.\n\n🎮 STEP 4 — Streamer Outreach Script\n\nTarget streamers with 500–5,000 Twitch/Kick viewers (they're reachable and hungry for content):\n\nDM Template:\n"Hey [Name]! Big fan of your content. We're running a high-quality GTA RP server and noticed your roleplay style would be a perfect fit. We'd love to offer you a custom character slot, priority VIP access, and even a custom in-game business named after your brand — totally free. Would you be open to trying a session this week? No obligations, just good RP."\n\nOffer value: Custom in-game vehicle wrap, branded business location, and early access to new updates.\n\n📈 STEP 5 — Track & Double Down\n\nCheck TikTok analytics after 2 weeks:\n  • Which clips got the most "Profile Visits"? Make more of those.\n  • Which clips drove Discord joins? That's your conversion content — prioritize it.\n  • Turn your best-performing clip style into a repeatable template\n\n⚡ PRO TIP: Pin your Discord invite link in your TikTok bio. One viral clip (even at 50K views, not millions) can flood your Discord with 200+ applications overnight. Have your whitelist application bot ready BEFORE you post viral content.`,
            quiz: {
              question: 'What is the most critical element to include in the first 2 seconds of a short-form server clip?',
              options: ['Your server name and logo for brand recognition', 'Mid-action footage that immediately grabs attention without any intro', 'A full walkthrough of your server rules'],
              answer: 1,
              explanation: 'The first 2 seconds determine if someone scrolls past or keeps watching. Starting mid-action — in the middle of a chase, funny moment, or dramatic scene — forces the algorithm to show it to more people because early retention is highest.'
            }
          }
        ]
      },
      {
        id: 'gta_real_money_guide',
        title: 'GTA 6 Real Wealth: 5 Legitimate Income Pathways',
        category: 'Wealth Strategy',
        difficulty: 'Intermediate',
        yieldEst: '$2,000 - $10,000/mo',
        description: 'Comprehensive guide to monetizing the GTA 6 release via asset creation, content clipping, and premium community hosting.',
        image: './images/gta-real-money-training.jpg',
        lessons: [
          'The Modding & Asset Economy',
          'TikTok & Shorts Traffic Farming',
          'Server Setup & Custom Integrations',
          'Tebex Merchandising & Subscriptions'
        ],
        details: [
          {
            title: 'The Modding & Asset Economy',
            xp: 150,
            content: 'As GTA 6 nears launch, server owners are desperate for custom content. Legitimate money is made by creating custom high-quality models (such as custom clothing, car liveries, and 3D maps) using Blender and 3ds Max. These are packaged and sold directly on asset platforms like Tebex, Patreon, and Fiverr.',
            quiz: {
              question: 'Which software tools are most commonly used to design custom 3D vehicle liveries and character clothing for GTA servers?',
              options: ['OBS Studio & Audacity', 'Blender & Photoshop / paint tools', 'Database managers'],
              answer: 1,
              explanation: 'Blender is used for 3D mesh modeling and Photoshop/texture tools are used to design custom liveries and skins.'
            }
          },
          {
            title: 'TikTok & Shorts Traffic Farming',
            xp: 200,
            content: 'Traffic is the lifeblood of any gaming business. Capture highlights, updates, and news surrounding GTA 6. Use the GTA Money Team five-second hook pattern to clip viral shorts, post them daily, and link viewers to your Discord or affiliate setup deals to generate commissions.',
            quiz: {
              question: 'What is the key to monetizing short-form video content without direct brand sponsorships?',
              options: ['Leaving the caption blank', 'Driving traffic to an affiliate link, store, or Discord server', 'Only uploading long-form videos'],
              answer: 1,
              explanation: 'Farming traffic to high-converting affiliate links, custom landing pages, or Discord memberships is the most effective monetizing strategy.'
            }
          },
          {
            title: 'Server Setup & Custom Integrations',
            xp: 250,
            content: 'Many server owners want a customized experience but do not know how to write code. You can charge one-time setup and integration fees ($300 to $1,500) to configure databases, install frameworks, set up secure VPS instances, and link Tebex checkouts for client server launches.',
            quiz: {
              question: 'What is a typical service-fee range for a custom roleplay server installation and database linkage?',
              options: ['$0 - $10', '$300 - $1,500', '$10,000+'],
              answer: 1,
              explanation: 'Professional installation and database configuration usually commands $300 to $1,500 depending on script customization.'
            }
          },
          {
            title: 'Tebex Merchandising & Subscriptions',
            xp: 300,
            content: 'The ultimate passive route is setting up subscription-based memberships. Create a Tebex-enabled custom web store where player groups can buy monthly server queue priorities or custom cosmetic tags. Maintain continuous server updates to keep subscriber retention high.',
            quiz: {
              question: 'How do you sustain monthly recurring revenue (MRR) from a GTA server?',
              options: ['Charge once and never update the server', 'Leverage recurring Tebex tiers for cosmetics and queue priority', 'Increase server slots indefinitely'],
              answer: 1,
              explanation: 'Offering recurring Tebex subscription tiers for cosmetics, whitelists, and priority queues builds sustainable monthly revenue.'
            }
          }
        ]
      },
      {
        id: 'gta_faceless_content_guide',
        title: 'Faceless GTA 6 Content Strategy: Step-by-Step Channels',
        category: 'Content Creation',
        difficulty: 'Beginner',
        yieldEst: '$3,000 - $8,500/mo',
        description: 'Comprehensive workflow to script, edit, automate, and monetize faceless YouTube & TikTok channels targeting the GTA 6 hype.',
        image: './images/gta-faceless-content-training.jpg',
        lessons: [
          'Hype Sub-Niche Selection',
          'High-Retention Script Writing',
          'Automated Voice & Soundscapes',
          'Visual Editing & Hook Loops'
        ],
        details: [
          {
            title: 'Hype Sub-Niche Selection',
            xp: 150,
            content: 'GTA 6 is the most anticipated game ever. Select a specific niche to dominate: Leaks & Rumor Roundups, Trailer Hidden Details, Map Speculation, or Lore Connections. Narrowing down builds authority fast and commands higher display ad CPMs.',
            quiz: {
              question: 'Which sub-niche is best for starting a channel quickly before the game launches?',
              options: ['Detailed gameplay tutorials of leaked test files', 'Trailer breakdown analysis, easter eggs, and rumor roundups', 'Generic gaming news from 10 years ago'],
              answer: 1,
              explanation: 'Analyzing official trailers and dissecting rumors/easter eggs generates massive traffic from speculation before release.'
            }
          },
          {
            title: 'High-Retention Script Writing',
            xp: 200,
            content: 'Retention determines if YouTube recommends your video. Start with a 5-second dynamic hook showing the end result or a massive reveal. Keep sentences short, avoid filler words, and ask questions that promise answers at the end of the video.',
            quiz: {
              question: 'What is the primary purpose of a video script hook?',
              options: ['To list sponsors immediately', 'To keep the viewer watching past the critical first 5-10 seconds', 'To introduce yourself for 3 minutes'],
              answer: 1,
              explanation: 'A hook must immediately grab attention and establish a reason to watch, preventing viewer drop-off in the first seconds.'
            }
          },
          {
            title: 'Automated Voice & Soundscapes',
            xp: 250,
            content: 'If you do not want to record your own voice, use high-quality AI speech synthesis tools (like ElevenLabs) using custom vocal profiles. Add dramatic, copyright-free background music and micro-sound effects (swooshes, pops, digital keyboard clicks) to keep the audio layer engaging.',
            quiz: {
              question: 'What is a best practice for clean audio on faceless gaming videos?',
              options: ['Loud music that covers the voice', 'AI voice paired with micro-sound effects and clear volume level splits', 'No background music at all'],
              answer: 1,
              explanation: 'A clean voice track mixed with low, dramatic background tracks and clean SFX keeps the audience engaged without ear fatigue.'
            }
          },
          {
            title: 'Visual Editing & Hook Loops',
            xp: 300,
            content: 'A faceless video requires visuals every 2 to 3 seconds. Use 4K B-roll gameplay, zoom animations, dynamic title cards, and highlight overlays. Sync visual cuts to the beats of the music to make the video feel polished and premium.',
            quiz: {
              question: 'How often should the visual frame change to maintain high retention on TikTok/Shorts?',
              options: ['Every 2 to 3 seconds', 'Every 30 seconds', 'Never change the frame'],
              answer: 0,
              explanation: 'Fast-paced edits changing the screen framing or visual focus every 2-3 seconds keeps viewers from scrolling away.'
            }
          }
        ]
      },
      {
        id: 'gta_agency_solo_guide',
        title: 'Agency Empire: Make Millions Solo — The Complete Blueprint',
        category: 'Gameplay Route',
        difficulty: 'Intermediate',
        yieldEst: '$1,500,000 - $4,000,000/hr',
        description: 'Full solo Agency business operation guide: how to buy, set up, optimize, and chain Security Contracts and Dr. Dre missions for maximum hourly payout without a crew.',
        image: './images/gta-agency-business-training.jpg',
        lessons: [
          'Agency Location & Setup Costs',
          'Security Contracts: The Core Loop',
          'Dr. Dre Mission Chain Unlocks',
          'Payphone Hits & Passive Salary Stack',
          'Solo Efficiency & Anti-Grief Tactics'
        ],
        details: [
          {
            title: 'Agency Location & Setup Costs',
            xp: 100,
            content: 'The Agency requires an upfront purchase ranging from $2,010,000 to $2,830,000 depending on location and customization. Choose the Rockford Hills location for the best mission routing. You only need the basic setup — skip the armory and staff upgrades until the Agency is profitable.',
            quiz: {
              question: 'Which Agency location offers the best mission routing for solo play?',
              options: ['LSIA — close to airport missions', 'Rockford Hills — central to most Security Contract spawns', 'Vespucci Beach — good for the vibe'],
              answer: 1,
              explanation: 'Rockford Hills places you centrally relative to most Security Contract start points and the Dre mission chain, cutting travel time significantly.'
            }
          },
          {
            title: 'Security Contracts: The Core Loop',
            xp: 200,
            content: 'Security Contracts pay between $20,000 and $40,000 each and can be chained endlessly. The fastest types are Rescue Contracts and Recover Contracts — avoid Document Forgery since it requires stationary waiting. Always accept from the Agency office computer, not the phone.',
            quiz: {
              question: 'Which Security Contract types should you prioritize for maximum hourly income?',
              options: ['Document Forgery — highest base pay', 'Rescue and Recovery Contracts — fastest completion time', 'Gang Attack contracts only'],
              answer: 1,
              explanation: 'Rescue and Recovery Contracts complete in 3-5 minutes each and stack efficiently without long wait timers.'
            }
          },
          {
            title: 'Dr. Dre Mission Chain Unlocks',
            xp: 300,
            content: 'After completing 50 Security Contracts, you unlock the Dr. Dre Payphone mission which pays $1,000,000 per completion. This mission is fully soloable and takes 20-30 minutes. Running it once per day alongside Security Contracts transforms your hourly yield dramatically.',
            quiz: {
              question: 'How many Security Contracts must you complete before unlocking the Dr. Dre mission chain?',
              options: ['5 contracts', '50 contracts', '100 contracts'],
              answer: 1,
              explanation: 'Completing exactly 50 Security Contracts unlocks the Franklin & Lamar Dr. Dre contact mission which pays $1,000,000.'
            }
          },
          {
            title: 'Payphone Hits & Passive Salary Stack',
            xp: 350,
            content: 'Agency Payphone Hits pay $15,000 base, but completing the bonus objective pays $85,000 total. They respawn every 20 minutes in public sessions. Stack these between Security Contracts for pure passive top-up income. Your Agency also generates a $20,000/in-game-hour salary automatically.',
            quiz: {
              question: 'What is the maximum payout for a single Payphone Hit including the bonus objective?',
              options: ['$15,000 base only', '$85,000 with bonus objective completion', '$200,000 per hit'],
              answer: 1,
              explanation: 'Payphone Hits pay $15K base plus a $70K bonus for completing the bonus kill condition, totaling $85,000 per hit.'
            }
          },
          {
            title: 'Solo Efficiency & Anti-Grief Tactics',
            xp: 400,
            content: 'Run a solo public session using the Solo Public Session method: open your console settings, go to GTA Online, and limit bandwidth in your network adapter to force a private-lobby lobby. This lets you run Agency missions without griefer interference while still counting as a public session for payouts.',
            quiz: {
              question: 'What is the safest way to run Agency missions at full public-session payout without griefers?',
              options: ['Invite-only session — same payout as public', 'Solo Public Session via bandwidth limiting — full payout, no griefers', 'Private Server — max payout automatically'],
              answer: 1,
              explanation: 'A Solo Public Session trick forces a solo lobby while retaining full public-session bonus payouts unavailable in private or invite-only sessions.'
            }
          }
        ]
      },
      {
        id: '1',
        title: 'Leonida Transport Logistics: $1M Launch Week Run',
        category: 'Gameplay Route',
        difficulty: 'Beginner',
        yieldEst: '$1,200,000/hr',
        description: 'Speedrun routes to maximize early courier payout limits and solo contracts.',
        lessons: [
          'Vehicle Procurement & Upgrades',
          'Leonida Highway Choke Point Mapping',
          'Cooldown Window Stacking Methods',
          'Avoid Account Flags & Exploit Risks'
        ]
      },
      {
        id: '2',
        title: 'Branded Content Funnel: Converting Gameplay to Passive Cash',
        category: 'Content Creation',
        difficulty: 'Intermediate',
        yieldEst: '$3,400/mo passive',
        description: 'Learn how to script short TikToks/Shorts, gather viewer leads, and upsell premium setups.',
        lessons: [
          'The 5-Second Hook Pattern',
          'Setting up Lead Capture Forms',
          'Deploying Custom Store Checkouts',
          'Compliance & Legal Handoff Specs'
        ]
      }
    ]);
  });

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Gameplay Route');
  const [newDifficulty, setNewDifficulty] = useState('Beginner');
  const [newYield, setNewYield] = useState('$500,000/hr');
  const [newDesc, setNewDesc] = useState('');
  const [newLessons, setNewLessons] = useState('');

  // Active lesson/quiz states
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [scoreXP, setScoreXP] = useState(() => {
    return parseInt(localStorage.getItem('gta_money_team_xp') || '0');
  });

  const handlePublish = (e) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    const lessonsList = newLessons
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const newTraining = {
      id: String(Date.now()),
      title: newTitle,
      category: newCategory,
      difficulty: newDifficulty,
      yieldEst: newYield,
      description: newDesc,
      outcomes: ['Understand the topic', 'Build a legal workflow', 'Create a monetization path'],
      prerequisites: ['Basic GTA Money Team account', 'Legal-only positioning', 'A place to save notes'],
      deliverables: ['Workshop notes', 'Action checklist', 'Money path worksheet'],
      workshopPrompt: `Ask Lana: turn ${newTitle} into a complete legal workshop with examples, exercises, and buyer outcomes.`,
      lessons: lessonsList.length ? lessonsList : ['Introduction', 'Setup', 'Money Path', 'Launch Checklist'],
      details: buildDraftDetails(lessonsList, newTitle, newCategory, newDifficulty)
    };

    const updated = [...trainings, newTraining];
    setTrainings(updated);
    localStorage.setItem('gta_money_team_trainings', JSON.stringify(updated));

    setNewTitle('');
    setNewDesc('');
    setNewLessons('');
  };

  const handleDelete = (id) => {
    const updated = trainings.filter(t => t.id !== id);
    setTrainings(updated);
    localStorage.setItem('gta_money_team_trainings', JSON.stringify(updated));
  };

  const handleExport = (training) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(training, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${training.title.replace(/\s+/g, '_')}_outline.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleOptionSelect = (optionIdx) => {
    if (quizChecked) return;
    setSelectedOption(optionIdx);
  };

  const checkAnswer = (quiz) => {
    if (selectedOption === null || quizChecked) return;
    setQuizChecked(true);
    if (selectedOption === quiz.answer) {
      const newXp = scoreXP + 150;
      setScoreXP(newXp);
      localStorage.setItem('gta_money_team_xp', String(newXp));
    }
  };

  const nextLesson = (details) => {
    setSelectedOption(null);
    setQuizChecked(false);
    if (activeLessonIndex < details.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    } else {
      // Completed last lesson
      setActiveCourse(null);
      setActiveLessonIndex(0);
    }
  };

  const startCourse = (training) => {
    if (!training.details) return;
    setActiveCourse(training);
    setActiveLessonIndex(0);
    setSelectedOption(null);
    setQuizChecked(false);
  };

  const seededCourseIds = new Set([
    'gta_server_guide',
    'gta_real_money_guide',
    'gta_faceless_content_guide',
    'gta_agency_solo_guide',
    '1',
    '2',
  ]);

  const fallbackImages = [
    './images/gta-real-money-training.jpg',
    './images/gta-server-training.jpg',
    './images/gta-faceless-content-training.jpg',
    './assets/gmt-brand/lana-day-rooftop.png',
  ];

  const getCourseImage = (training, index = 0) => {
    if (training.image) return training.image.startsWith('/') ? `.${training.image}` : training.image;
    return fallbackImages[index % fallbackImages.length];
  };

  const totalLessons = trainings.reduce((sum, training) => sum + training.lessons.length, 0);
  const interactiveCount = trainings.filter((training) => training.details).length;
  const heroCourse = trainings.find((training) => training.id === 'gta_real_money_guide') || trainings[0];

  const workshopMetrics = [
    { value: trainings.length, label: 'workshop products', detail: 'member-ready modules' },
    { value: totalLessons, label: 'lesson blocks', detail: 'routes, scripts, server forge' },
    { value: interactiveCount, label: 'quiz labs', detail: 'XP assessments live' },
    { value: scoreXP, label: 'member XP', detail: 'training score' },
  ];

  const workshopTracks = [
    {
      title: 'Player Money Lab',
      kicker: 'Gameplay route lab',
      image: './images/gta-real-money-training.jpg',
      bullets: ['Route stacking', 'Cooldown planning', 'Clean risk checks'],
    },
    {
      title: 'Server Owner Studio',
      kicker: 'FiveM business lab',
      image: './images/gta-server-training.jpg',
      bullets: ['txAdmin flow', 'Tebex offers', 'Whitelist revenue'],
    },
    {
      title: 'Creator Revenue Room',
      kicker: 'Faceless content lab',
      image: './images/gta-faceless-content-training.jpg',
      bullets: ['Shorts hooks', 'Affiliate funnels', 'Clip batching'],
    },
    {
      title: 'Lana Coaching Desk',
      kicker: 'Lux AI host',
      image: './assets/gmt-brand/lana-day-rooftop.png',
      bullets: ['Course prompts', 'Launch review', 'Offer polish'],
    },
  ];

  const sprintSteps = [
    ['01', 'Offer Map', 'Choose the buyer, promise, price, and legal boundary before building lessons.'],
    ['02', 'Route Lab', 'Turn money methods into repeatable steps with timers, requirements, and safety notes.'],
    ['03', 'Creator Engine', 'Package hooks, captions, thumbnails, Discord CTAs, and affiliate paths.'],
    ['04', 'Server Product', 'Convert setup knowledge into installable service tiers and monthly support.'],
    ['05', 'Lana Review', 'Export the outline, test the quiz, and prep the member launch script.'],
  ];

  const categoryMeta = {
    'Gameplay Route': { className: 'route', label: 'Route Lab' },
    'Server Management': { className: 'server', label: 'Server Forge' },
    'Server Business': { className: 'server', label: 'Server Forge' },
    'Content Creation': { className: 'creator', label: 'Creator Lab' },
    'Wealth Strategy': { className: 'wealth', label: 'Wealth Lab' },
    'Business Paths': { className: 'wealth', label: 'Business Lab' },
  };

  return (
    <div className="workshop-page text-left w-full">
      <section className="workshop-hero-panel">
        <div className="workshop-hero-copy">
          <span className="workshop-eyebrow">Paid Member Workshop</span>
          <h1>Build the money skill stack before launch week.</h1>
          <p>
            Train players, creators, and server owners with legal route labs, interactive lessons, exportable outlines,
            and Lana-backed planning systems that turn GTA Money Team into a premium learning product.
          </p>
          <div className="workshop-hero-actions">
            <button type="button" onClick={() => startCourse(heroCourse)} disabled={!heroCourse?.details}>
              Start Featured Course
            </button>
            <button
              type="button"
              onClick={() => document.getElementById('workshop-builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              Create Course Draft
            </button>
          </div>
        </div>

        <div className="workshop-command-screen">
          <img src="./assets/gmt-brand/lana-day-rooftop.png" alt="Lana hosting a daytime GTA Money Team workshop" />
          <div className="workshop-screen-glass">
            <span>Lana Coach Signal</span>
            <strong>{scoreXP} XP</strong>
            <p>Workshop vault, calculators, Server Forge, Media Vault, Money Intel, and safety firewall connected.</p>
          </div>
        </div>
      </section>

      <section className="workshop-metrics-strip" aria-label="Workshop metrics">
        {workshopMetrics.map((metric) => (
          <article key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
            <p>{metric.detail}</p>
          </article>
        ))}
      </section>

      <section className="workshop-track-grid" aria-label="Training tracks">
        {workshopTracks.map((track) => (
          <article key={track.title} className="workshop-track-card">
            <img src={track.image} alt="" />
            <div>
              <span>{track.kicker}</span>
              <h2>{track.title}</h2>
              <ul>
                {track.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      <div className="workshop-main-grid">
        <section className="workshop-catalog">
          <div className="workshop-section-heading">
            <div>
              <span>Active Training Catalog</span>
              <h2>Subscriber-ready course products</h2>
            </div>
            <p>{trainings.length} workshop modules live in the vault.</p>
          </div>

          <div className="workshop-course-grid">
            {trainings.map((training, index) => {
              const meta = categoryMeta[training.category] || categoryMeta['Wealth Strategy'];
              const progress = Math.min(100, training.lessons.length * 18 + (training.details ? 18 : 0));
              return (
                <article key={training.id} className={`workshop-course-card ${meta.className}`}>
                  <div className="workshop-course-media">
                    <img src={getCourseImage(training, index)} alt="" />
                    <span>{meta.label}</span>
                    <strong>{training.yieldEst}</strong>
                  </div>

                  <div className="workshop-course-body">
                    <div className="workshop-course-topline">
                      <span>{training.category}</span>
                      <small>{training.difficulty}</small>
                    </div>
                    <h3>{training.title}</h3>
                    <p>{training.description}</p>

                    {(training.outcomes || training.deliverables || training.prerequisites) && (
                      <div className="workshop-card-brief">
                        {training.outcomes && (
                          <section>
                            <span>What you learn</span>
                            <ul>
                              {training.outcomes.slice(0, 3).map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </section>
                        )}
                        {training.deliverables && (
                          <section>
                            <span>Take-home assets</span>
                            <ul>
                              {training.deliverables.slice(0, 3).map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </section>
                        )}
                        {training.prerequisites && (
                          <section>
                            <span>Before you start</span>
                            <ul>
                              {training.prerequisites.slice(0, 3).map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </section>
                        )}
                      </div>
                    )}

                    <div className="workshop-course-stats">
                      <div>
                        <strong>{training.lessons.length}</strong>
                        <span>Lessons</span>
                      </div>
                      <div>
                        <strong>{training.details ? 'Live' : 'Draft'}</strong>
                        <span>Quiz Mode</span>
                      </div>
                      <div>
                        <strong>{progress}%</strong>
                        <span>Package</span>
                      </div>
                    </div>

                    <div className="workshop-progress-bar" aria-hidden="true">
                      <i style={{ width: `${progress}%` }} />
                    </div>

                    <ul className="workshop-lesson-list">
                      {training.lessons.slice(0, 4).map((lesson, lessonIndex) => (
                        <li key={lesson}>
                          <span>{String(lessonIndex + 1).padStart(2, '0')}</span>
                          {lesson}
                        </li>
                      ))}
                    </ul>

                    {training.workshopPrompt && (
                      <div className="workshop-lana-prompt">
                        <span>// Lana study prompt</span>
                        <p>{training.workshopPrompt}</p>
                      </div>
                    )}

                    <div className="workshop-card-actions">
                      {training.details && (
                        <button type="button" onClick={() => startCourse(training)}>
                          Start Course
                        </button>
                      )}
                      <button type="button" onClick={() => handleExport(training)}>
                        Export
                      </button>
                      {!seededCourseIds.has(training.id) && (
                        <button type="button" onClick={() => handleDelete(training.id)}>
                          Delete Draft
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside id="workshop-builder" className="workshop-builder-panel">
          <div className="workshop-builder-header">
            <span>Workshop Console</span>
            <h2>Create a course outline</h2>
            <p>Package a legal route, creator system, or server offer into a clean subscriber product.</p>
          </div>

          <form onSubmit={handlePublish} className="workshop-builder-form">
            <label>
              <span>Training title</span>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Leonida transport cargo routes"
                required
              />
            </label>

            <div className="workshop-form-split">
              <label>
                <span>Category</span>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                  <option>Gameplay Route</option>
                  <option>Server Management</option>
                  <option>Content Creation</option>
                  <option>Wealth Strategy</option>
                </select>
              </label>
              <label>
                <span>Difficulty</span>
                <select value={newDifficulty} onChange={(e) => setNewDifficulty(e.target.value)}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </label>
            </div>

            <label>
              <span>Yield potential estimate</span>
              <input
                type="text"
                value={newYield}
                onChange={(e) => setNewYield(e.target.value)}
                placeholder="$2,500/mo creator funnel"
              />
            </label>

            <label>
              <span>Course summary</span>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Explain the legal profit path, audience, outcome, and member value."
                required
              />
            </label>

            <label>
              <span>Lessons list</span>
              <textarea
                value={newLessons}
                onChange={(e) => setNewLessons(e.target.value)}
                placeholder={'Offer map\nRoute steps\nSafety notes\nLaunch checklist'}
                className="workshop-mono-input"
              />
            </label>

            <button type="submit">Publish Training Draft</button>
          </form>

          <div className="workshop-lana-card">
            <img src="./images/lana-group-hud.jpg" alt="" />
            <div>
              <span>Lana Review Stack</span>
              <strong>Legal, clean, premium.</strong>
              <p>No cheating, no exploits, no account theft, no scam crypto. Smart strategy only.</p>
            </div>
          </div>
        </aside>
      </div>

      <section className="workshop-sprint-band">
        <div className="workshop-section-heading">
          <div>
            <span>Workshop Sprint</span>
            <h2>From idea to paid lesson package</h2>
          </div>
          <p>Use this cadence to turn subscriber knowledge into sellable training, templates, services, and creator funnels.</p>
        </div>
        <div className="workshop-sprint-grid">
          {sprintSteps.map(([step, title, body]) => (
            <article key={step}>
              <span>{step}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Gamified Active Lesson Portal Modal */}
      {activeCourse && activeCourse.details && (
        <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl border border-white/10 rounded-2xl bg-black overflow-hidden shadow-[0_0_100px_rgba(255,20,147,0.25)] flex flex-col my-8">

            {/* Modal Header */}
            <div className="bg-white/5 border-b border-white/10 p-5 flex justify-between items-center">
              <div>
                <span className="font-mono text-yellow text-[9px] uppercase tracking-wider bg-yellow/10 px-2 py-0.5 rounded border border-yellow/20">
                  {activeCourse.category} • Lesson {activeLessonIndex + 1}/{activeCourse.details.length}
                </span>
                <h2 className="text-white font-round-bold text-lg uppercase mt-1.5">{activeCourse.title}</h2>
              </div>
              <button
                onClick={() => setActiveCourse(null)}
                className="text-white/60 hover:text-white text-2xl font-bold cursor-pointer transition-colors px-3 py-1 bg-white/5 rounded"
              >
                &times;
              </button>
            </div>

            {/* Course Illustration Header */}
            {activeCourse.image && (
              <div className="h-56 relative w-full overflow-hidden border-b border-white/10">
                <img src={getCourseImage(activeCourse)} alt="course visual" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-6 flex items-center gap-3">
                  <span className="px-3 py-1 bg-pink text-black text-xs font-round-bold uppercase rounded shadow">
                    Active Lesson: {activeCourse.details[activeLessonIndex].title}
                  </span>
                  <span className="px-2.5 py-1 bg-black/60 border border-cyan/45 text-cyan text-xs font-mono rounded">
                    ⚡ {activeCourse.details[activeLessonIndex].xp} XP
                  </span>
                </div>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6 flex-1">
              <div className="space-y-4">
                <h3 className="text-white font-round-bold text-xl uppercase">{activeCourse.details[activeLessonIndex].title}</h3>
                {activeCourse.details[activeLessonIndex].objective && (
                  <div className="workshop-objective">
                    <span>// Learning Objective</span>
                    <strong>{activeCourse.details[activeLessonIndex].objective}</strong>
                  </div>
                )}
                <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line bg-white/5 border border-white/10 p-5 rounded-xl">
                  {activeCourse.details[activeLessonIndex].content}
                </p>
              </div>

              <div className="workshop-lesson-grid">
                {activeCourse.details[activeLessonIndex].steps && (
                  <section>
                    <span>// Action Steps</span>
                    <ol>
                      {activeCourse.details[activeLessonIndex].steps.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  </section>
                )}
                {activeCourse.details[activeLessonIndex].checklist && (
                  <section>
                    <span>// Completion Checklist</span>
                    <ul>
                      {activeCourse.details[activeLessonIndex].checklist.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                )}
                {activeCourse.details[activeLessonIndex].keyAnswers && (
                  <section>
                    <span>// Key Answers</span>
                    <ul>
                      {activeCourse.details[activeLessonIndex].keyAnswers.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                )}
                {activeCourse.details[activeLessonIndex].worksheet && (
                  <section>
                    <span>// Worksheet</span>
                    <p>{activeCourse.details[activeLessonIndex].worksheet}</p>
                  </section>
                )}
              </div>

              {/* Gamified Interactive Quiz Block */}
              {activeCourse.details[activeLessonIndex].quiz && (
                <div className="border border-white/15 rounded-xl p-6 bg-black/60 space-y-4 shadow-inner">
                  <span className="font-mono text-cyan text-[10px] uppercase block">// Level Assessment</span>
                  <strong className="block text-white text-md">{activeCourse.details[activeLessonIndex].quiz.question}</strong>

                  <div className="space-y-3">
                    {activeCourse.details[activeLessonIndex].quiz.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === activeCourse.details[activeLessonIndex].quiz.answer;
                      let btnStyle = "border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/20";

                      if (isSelected) {
                        btnStyle = "border-yellow bg-yellow/10 text-yellow shadow-[0_0_15px_rgba(244,162,58,0.2)]";
                      }
                      if (quizChecked) {
                        if (isCorrect) {
                          btnStyle = "border-green bg-green/10 text-green shadow-[0_0_15px_rgba(93,255,177,0.2)]";
                        } else if (isSelected) {
                          btnStyle = "border-pink bg-pink/10 text-pink shadow-[0_0_15px_rgba(255,20,147,0.2)]";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleOptionSelect(idx)}
                          disabled={quizChecked}
                          className={`w-full text-left p-3.5 rounded-lg border text-xs cursor-pointer transition-all duration-300 flex justify-between items-center ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizChecked && isCorrect && <span className="text-green text-xs font-round-bold font-semibold uppercase">Correct</span>}
                          {quizChecked && isSelected && !isCorrect && <span className="text-pink text-xs font-round-bold font-semibold uppercase">Incorrect</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Submit / Next Step Controller */}
                  <div className="pt-2 flex justify-between items-center gap-4">
                    {!quizChecked ? (
                      <button
                        onClick={() => checkAnswer(activeCourse.details[activeLessonIndex].quiz)}
                        disabled={selectedOption === null}
                        className="px-6 py-3 bg-cyan text-black font-round-bold text-xs uppercase rounded hover:bg-white disabled:bg-white/10 disabled:text-white/40 disabled:border-white/5 disabled:cursor-not-allowed transition duration-300"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <p className="text-white/60 text-xs leading-relaxed max-w-md">
                          <strong className="text-yellow uppercase block mb-1">Explanation:</strong>
                          {activeCourse.details[activeLessonIndex].quiz.explanation}
                        </p>
                        <button
                          onClick={() => nextLesson(activeCourse.details)}
                          className="px-6 py-3 bg-yellow text-black font-round-bold text-xs uppercase rounded hover:bg-white transition duration-300"
                        >
                          {activeLessonIndex < activeCourse.details.length - 1 ? 'Next Lesson' : 'Complete Training'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function UserProfilePage({ membership, leads, orders, campaigns, setPage, onCheckout }) {
  const active = hasPremiumAccess(membership);
  const recentActivity = [
    ...orders.map((order) => ({ type: 'Order', title: order.product, meta: order.status })),
    ...leads.map((lead) => ({ type: 'Lead', title: lead.service, meta: lead.status })),
    ...campaigns.map((campaign) => ({ type: 'Campaign', title: campaign.headline, meta: campaign.channel })),
  ].slice(0, 5);

  return (
    <div className="user-profile-page text-left w-full">
      <section className="profile-hero-card">
        <div>
          <span className="font-mono text-green text-xs uppercase block mb-3">// Member Profile</span>
          <h1>GTA Money Team Account</h1>
          <p>
            Your customer command profile keeps every training page, store page, research page, and Lana coaching page one click away. Browse everything in preview mode, then unlock the workshop vault when the subscription is active.
          </p>
          <div className="profile-actions">
            <button type="button" onClick={() => onCheckout('premiumMonthly')}>{active ? 'Review Checkout' : 'Join Workshop $25/mo'}</button>
            <button type="button" className="ghost" onClick={() => setPage('training-workshop')}>Open Workshop</button>
          </div>
        </div>
        <img src="./assets/gmt-brand/lana-day-studio.png" alt="Lana hosting the GTA Money Team creator studio" />
      </section>

      <section className="profile-status-grid">
        <article>
          <span>Status</span>
          <strong>{active ? `${membership?.tier || 'Premium'} Active` : 'Preview Visitor'}</strong>
          <p>{active ? 'Downloads and member paths are ready for your account.' : 'All pages are visible, with upgrade prompts for paid downloads and vault access.'}</p>
        </article>
        <article>
          <span>Workshop</span>
          <strong>$25/mo</strong>
          <p>Workshop lessons, downloads, city packs, calculators, Server Forge, and Lana playbooks.</p>
        </article>
        <article>
          <span>Activity</span>
          <strong>{recentActivity.length}</strong>
          <p>Recent orders, campaigns, and saved actions from your GTA Money Team journey.</p>
        </article>
      </section>

      <section className="profile-page-map">
        <div className="profile-section-head">
          <span>All Pages</span>
          <strong>Customer Command Map</strong>
        </div>
        <div className="profile-page-grid">
          {customerPageLinks.map(([id, label, detail]) => (
            <button key={id} type="button" onClick={() => setPage(id)}>
              <strong>{label}</strong>
              <span>{detail}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="profile-activity-panel">
        <div className="profile-section-head">
          <span>Account Activity</span>
          <strong>Recent Activity</strong>
        </div>
        {recentActivity.length ? (
          <div className="profile-activity-list">
            {recentActivity.map((item, index) => (
              <article key={`${item.type}-${item.title}-${index}`}>
                <span>{item.type}</span>
                <strong>{item.title || 'GTA Money Team action'}</strong>
                <small>{item.meta || 'Saved'}</small>
              </article>
            ))}
          </div>
        ) : (
          <div className="profile-empty-state">
            <strong>No activity yet</strong>
            <p>Open the Store, Workshop, Launch Funnel, or Member Access pages to start building your member profile.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function AboutPage({ setPage, onCheckout }) {
  return (
    <div className="about-page text-left w-full">
      <section className="about-team-hero">
        <img src={gmtTeamDayMarina} alt="GTA Money Team founders and Lana in a GTA-inspired daytime marina scene" />
        <div>
          <span className="font-mono text-pink text-xs uppercase block mb-3">// About GTA Money Team</span>
          <h1>Learn How To Make Money The Legit Way.</h1>
          <p>
            GTA Money Team is built for players, creators, and server owners who want the clean path: training, planning, calculators, content systems, server education, market literacy, and launch-week advantage without cheats, stolen assets, scams, or exploit culture.
          </p>
          <div className="about-cta-row">
            <button type="button" onClick={() => setPage('profile')}>Open Profile</button>
            <button type="button" className="ghost" onClick={() => onCheckout('premiumMonthly')}>Join Workshop</button>
          </div>
        </div>
      </section>

      <section className="about-brand-grid">
        {[
          ['Powered by Lana from Lux Agent', 'Lana stays inside the app as the branded AI host for route strategy, server planning, creator systems, and member coaching.'],
          ['Created by Lux Automaton', 'Lux Automaton builds the app, workshop vault, visual system, research workflow, and customer-facing subscription experience.'],
          ['Legal Money Strategy', 'The word hack means smarter planning: routes, calculators, templates, education, media research, and launch systems.'],
        ].map(([title, text]) => (
          <article key={title}>
            <strong>{title}</strong>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="lana-photo-gallery">
        <div className="profile-section-head">
          <span>New Lana Daytime Shots</span>
          <strong>Brand Gallery</strong>
        </div>
        <div className="lana-gallery-grid">
          {lanaDayShots.map((shot) => (
            <article key={shot.id}>
              <img src={shot.src} alt={`${shot.title} GTA Money Team artwork`} />
              <div>
                <span>{shot.page}</span>
                <strong>{shot.title}</strong>
                <p>{shot.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

// Router switcher helper
function renderSubpage(page, helpers) {
  switch (page) {
    case 'profile':
      return <UserProfilePage membership={helpers.membership} leads={helpers.leads} orders={helpers.orders} campaigns={helpers.campaigns} setPage={helpers.setPage} onCheckout={helpers.onCheckout} />;
    case 'about':
      return <AboutPage setPage={helpers.setPage} onCheckout={helpers.onCheckout} />;
    case 'lana-coach':
      return <LanaCoach />;
    case 'money-courses':
      return <TrainingWorkshopPage />;
    case 'calculators':
      return <Calculators />;
    case 'route-planner':
      return <TopServerBlueprint onRequest={helpers.onRequest} />;
    case 'server-lab':
      return <ServerLabPage onRequest={helpers.onRequest} />;
    case 'creator-kit':
      return <MediaVaultPage />;
    case 'template-shop':
      return <TemplatesShop />;
    case 'training-workshop':
      return <TrainingWorkshopPage />;
    case 'member-activation':
      return <MemberActivationPage membership={helpers.membership} setMembership={helpers.setMembership} latestOrder={helpers.orders[0]} />;
    case 'launch-funnel':
      return <LaunchFunnelPage onCampaignSaved={helpers.onCampaignSaved} />;
    case 'media-vault':
      return <MediaVaultPage />;
    case 'gta-news':
      return <NewsRoomPage />;
    case 'money-intel':
      return <TopServerBlueprint onRequest={helpers.onRequest} />;
    case 'investor-radar':
      return <InvestorRadarPage />;
    case 'lux-ops':
      return <LuxOpsDeskPage leads={helpers.leads} orders={helpers.orders} tasks={helpers.tasks} campaigns={helpers.campaigns} />;
    default:
      return null;
  }
}

const App = () => {
  const [page, setPage] = useState('home');
  const [requestedService, setRequestedService] = useState(null);
  const [checkoutOffer, setCheckoutOffer] = useState(null);
  const [membership, setMembership] = useState(() => loadMembership());
  const [leads, setLeads] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    setLeads(loadLeads());
    setOrders(loadOrders());
    setTasks(loadTasks());
    setCampaigns(loadCampaigns());

    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
      const order = recordCheckoutReturn({ product: params.get('product') || 'Premium Membership', provider: params.get('provider') || 'Hosted Link' });
      setOrders(loadOrders());
      setPage('member-activation');
      window.history.replaceState({}, '', window.location.pathname);
      if (params.get('activate') === 'premium') {
        setMembership({ ...saveMembership('Premium'), status: 'active', orderId: order.id });
      }
    }
  }, []);

  useEffect(() => {
    const handleCheckoutIntent = (event) => {
      setCheckoutOffer(event.detail?.paymentKey || 'premiumMonthly');
    };

    window.addEventListener('gmt:checkout', handleCheckoutIntent);
    return () => window.removeEventListener('gmt:checkout', handleCheckoutIntent);
  }, []);

  const openRequest = (service) => setRequestedService(service);
  const openCheckout = (paymentKey = 'premiumMonthly') => setCheckoutOffer(paymentKey);
  const closeCheckout = () => setCheckoutOffer(null);
  const completeDemoCheckout = () => {
    const link = paymentLinks[checkoutOffer] || paymentLinks.premiumMonthly;
    recordCheckoutReturn({ product: link.label, provider: link.provider });
    setOrders(loadOrders());
    const activated = activateMember('GMT-PREMIUM-LUX');
    setMembership(activated);
    setCheckoutOffer(null);
    setPage('member-activation');
  };
  const handleLeadSaved = (lead) => setLeads(saveLead(lead));
  const handleTaskSaved = (task) => setTasks(saveTask(task));
  const handleCampaignSaved = (campaign) => setCampaigns(saveCampaign(campaign));

  if (page === 'home') {
    return (
      <main className="home-app-shell w-dvw overflow-x-hidden" id="hero">
        <Navbar page={page} setPage={setPage} />
        <SubscriptionPreviewBar membership={membership} onCheckout={openCheckout} setPage={setPage} />
        <Hero />
        <FirstVideo />
        <LanaCoachPreview setPage={setPage} />
        <SecondVideo />
        <CalculatorsPreview setPage={setPage} />
        <CreatorKitPreview setPage={setPage} />
        <Final />
        <OutroPreview setPage={setPage} />
        <RequestServiceModal service={requestedService} onClose={() => setRequestedService(null)} onLeadSaved={handleLeadSaved} onTaskSaved={handleTaskSaved} />
        <CheckoutModal paymentKey={checkoutOffer} onClose={closeCheckout} onDemoCheckout={completeDemoCheckout} setPage={setPage} />
      </main>
    );
  }

  const pageProfile = pageProfiles[page] || defaultPageProfile;
  const bgImage = pageBackgrounds[page] || marinaBg;

  return (
    <main
      className={`premium-app-shell page-${page} w-dvw overflow-x-hidden min-h-dvh flex flex-col justify-between relative bg-black`}
      style={{
        '--page-bg': `url(${bgImage})`,
        '--brand-backdrop': `url(${brandBackdrop})`,
        '--page-accent': pageProfile.accent,
        '--page-accent-2': pageProfile.accent2,
      }}
    >
      <Navbar page={page} setPage={setPage} />
      <SubscriptionPreviewBar membership={membership} onCheckout={openCheckout} setPage={setPage} />

      <div className="premium-page-wrap flex-1">
        <PageHero profile={pageProfile} />
        <div className="premium-subpage-layout">
          <PageRail profile={pageProfile} />
          <section className="revenue-workspace">
            {renderSubpage(page, { onRequest: openRequest, onCheckout: openCheckout, setPage, membership, setMembership, leads, orders, tasks, campaigns, onCampaignSaved: handleCampaignSaved })}
          </section>
        </div>
      </div>

      <footer className="premium-footer py-10 border-t border-white/10 text-center text-white/40 text-[11px] uppercase tracking-wider bg-black w-full">
        Powered by Lana from Lux Agent | Created by Lux Automaton
      </footer>
      <RequestServiceModal service={requestedService} onClose={() => setRequestedService(null)} onLeadSaved={handleLeadSaved} onTaskSaved={handleTaskSaved} />
      <CheckoutModal paymentKey={checkoutOffer} onClose={closeCheckout} onDemoCheckout={completeDemoCheckout} setPage={setPage} />
    </main>
  );
};

export default App;
