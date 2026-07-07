import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import './App.css';
import { paymentLinks } from './data/paymentConfig';
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
import gtaBanner from './assets/gta-money-team-banner.jpg';
import marinaBg from './assets/gta-money-team-lana-marina-bg.jpg';
import officeBg from './assets/gta-money-team-lana-office-bg.jpg';
import sunsetwalkBg from './assets/gta-money-team-lana-sunsetwalk-bg.jpg';
import nightcarBg from './assets/gta-money-team-lana-nightcar-bg.jpg';
import rooftopBg from './assets/gta-money-team-lana-rooftop-bg.jpg';

const lanaGroupHud = './images/lana-group-hud.jpg';
const lanaHeli = './images/lana-marina-heli.jpg';
const lanaCommandCenter = './images/lana-command-center.png';
const lanaRooftopTablet = './images/lana-rooftop-tablet.jpg';
const lanaNightCar = './images/lana-night-car.jpg';

gsap.registerPlugin(ScrollTrigger);

const pageBackgrounds = {
  'member-services':    marinaBg,
  'money-courses':      rooftopBg,
  'route-planner':      sunsetwalkBg,
  'launch-funnel':      marinaBg,
  'calculators':        officeBg,
  'server-lab':         officeBg,
  'server-forge':       officeBg,
  'creator-kit':        rooftopBg,
  'media-vault':        marinaBg,
  'investor-radar':     officeBg,
  'template-shop':      sunsetwalkBg,
  'affiliate-stack':    sunsetwalkBg,
  'scam-firewall':      nightcarBg,
  'member-activation':  nightcarBg,
  'streaming-academy':  rooftopBg,
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
  'member-services': {
    label: 'Services',
    title: 'Services that sell',
    description: 'Premium DFY offers, audits, route playbooks, member upsells, and support products designed for clean GTA Money Team revenue.',
    signal: 'Offer desk live',
    accent: '#ff6f91',
    accent2: '#44e8ff',
    stats: [['4', 'paid offers'], ['$49+', 'entry product'], ['24h', 'lead follow-up']],
    rail: ['DFY server builds', 'Script audits', 'Route playbooks', 'Template vault upsells'],
  },
  'template-shop': {
    label: 'Store',
    title: 'Digital vault storefront',
    description: 'Sell legal route kits, Discord packs, OBS scenes, server templates, creator worksheets, and premium FiveM RP city and regional packs from one member store.',
    signal: 'Vault commerce',
    accent: '#f4a23a',
    accent2: '#ff6f91',
    stats: [['35', 'product SKUs'], ['23', 'city packs'], ['ZIP', 'delivery ready']],
    rail: ['City pack vault', 'Regional packs', 'Checkout placeholders', 'Related offers'],
  },
  'server-forge': {
    label: 'Server Forge',
    title: 'Build the server business',
    description: 'A txAdmin-first build lab for hosting, frameworks, Discord, database safety, server products, and launchable operator workflows.',
    signal: 'Forge sequence',
    accent: '#43e7ff',
    accent2: '#5dffb1',
    stats: [['7', 'build steps'], ['QBCore', 'starter path'], ['30120', 'port plan']],
    rail: ['Hosting path', 'Framework choice', 'Discord pack', 'Server productization'],
  },
  calculators: {
    label: 'Calculators',
    title: 'Show them the money',
    description: 'Interactive calculators for legal in-game routes, subscriptions, server VIPs, template sales, streaming, and DFY pipelines.',
    signal: 'Revenue math',
    accent: '#5dffb1',
    accent2: '#ffd166',
    stats: [['6', 'calculators'], ['$19', 'member model'], ['4-week', 'route forecast']],
    rail: ['Route profit', 'MRR model', 'Server revenue', 'Creator income'],
  },
  'streaming-academy': {
    label: 'Streaming Academy',
    title: 'Creator money studio',
    description: 'Help members package streams, clips, overlays, delays, scene collections, and safe content funnels around GTA RP.',
    signal: 'Creator stack',
    accent: '#b46cff',
    accent2: '#43e7ff',
    stats: [['6', 'OBS lessons'], ['15-30s', 'RP delay'], ['5', 'scene products']],
    rail: ['OBS setup', 'Overlay product', 'Clip batching', 'Audience funnel'],
  },
  'scam-firewall': {
    label: 'Scam Firewall',
    title: 'Protect the member base',
    description: 'A red-flag checker and safety rule system for fake beta keys, malicious downloads, fake coins, leaked assets, and wallet scams.',
    signal: 'Threat filter',
    accent: '#ff4f5f',
    accent2: '#ffd166',
    stats: [['10', 'risk flags'], ['0', 'fake tokens'], ['100%', 'source checks']],
    rail: ['Claim scanner', 'Safe source rules', 'Crypto firewall', 'Member education'],
  },
  'member-activation': {
    label: 'Member Access',
    title: 'Premium access control',
    description: 'A front-end member unlock flow for checkout returns, local activation, gated benefits, and future Stripe or Tebex webhook verification.',
    signal: 'Access desk',
    accent: '#ff6f91',
    accent2: '#5dffb1',
    stats: [['Premium', 'demo tier'], ['GMT', 'access code'], ['Webhook', 'next backend']],
    rail: ['Code unlock', 'Checkout return', 'Premium gate', 'Backend handoff'],
  },
  'affiliate-stack': {
    label: 'Affiliate Stack',
    title: 'Trusted partner revenue',
    description: 'Map approved hosting, Tebex, overlays, editing, and creator tools into member offers without pushing risky or fake products.',
    signal: 'Partner layer',
    accent: '#5dffb1',
    accent2: '#43e7ff',
    stats: [['4', 'partner lanes'], ['Clean', 'offer policy'], ['Upsell', 'service attach']],
    rail: ['Hosting offers', 'Tebex path', 'Creator tools', 'Service attach'],
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
  'lana-coach': {
    label: 'Lana Coach',
    title: 'Lux Automaton AI host',
    description: 'Lana stays inside GTA Money Team as the branded Lux Agent coach for routes, funnels, servers, content, and member strategy.',
    signal: 'Coach online',
    accent: '#ff6f91',
    accent2: '#43e7ff',
    stats: [['4', 'starter prompts'], ['800ms', 'demo reply'], ['Lux', 'agent host']],
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
    label: 'Server Lab',
    title: 'Template code workspace',
    description: 'Browse starter server files, copy setup snippets, download pack notes, and request a custom server build.',
    signal: 'Code lab',
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
    title: 'Official media study room',
    description: 'Study official trailers and screenshots for legal planning, content angles, launch research, and member education.',
    signal: 'Trailer desk',
    accent: '#43e7ff',
    accent2: '#ff6f91',
    stats: [['4', 'shot cards'], ['Trailer', 'study mode'], ['Official', 'source habit']],
    rail: ['Trailer notes', 'Shot study', 'Official links', 'Content angles'],
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
      <div className="revenue-hero-art" aria-label={`${profile.title} visual panel`}>
        <div className="hero-scan-card">
          <strong>{profile.signal}</strong>
          <span>Legal money systems only</span>
        </div>
      </div>
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

const serverSteps = [
  {
    title: 'Server Basics',
    text: 'Plan Linux hosting, automated backups, centralized logging, moderator roles, database ownership, and maintenance windows.',
  },
  {
    title: 'Roleplay Rules',
    text: 'Write clear behavior rules, staff escalation pathways, appeal forms, and user privacy guidelines before public applications.',
  },
  {
    title: 'Resource Stack',
    text: 'Audit every script, license, external dependency, webhook, and admin command in a staging environment prior to server release.',
  },
  {
    title: 'Ops Rhythm',
    text: 'Schedule restarts, snapshots, changelog posts, server performance reviews, and direct community feedback loops.',
  },
];

const mediaShots = [
  {
    title: 'Vice City Sign',
    url: 'https://www.rockstargames.com/VI/_next/static/media/Vice_City_01.135x56yoeu.6t.jpg?akim=1&imdensity=1&imwidth=1920',
  },
  {
    title: 'Ocean View',
    url: 'https://www.rockstargames.com/VI/_next/static/media/Vice_City_02.0c5.7qx17u9kl.jpg?akim=1&imdensity=1&imwidth=1920',
  },
  {
    title: 'Downtown Systems',
    url: 'https://www.rockstargames.com/VI/_next/static/media/Vice_City_03.0nqz~lrqdmlze.jpg?akim=1&imdensity=1&imwidth=1920',
  },
  {
    title: 'Leonida Keys',
    url: 'https://www.rockstargames.com/VI/_next/static/media/Leonida_Keys_01.0zgz7tveur6y8.jpg?akim=1&imdensity=1&imwidth=1920',
  },
];

const investorCards = [
  ['TTWO exposure', 'Rockstar Games is owned by Take-Two Interactive. Track TTWO, earnings calls, guidance, and launch timing.'],
  ['Catalyst watch', 'Monitor official trailers, pre-orders, platform news, delays, reviews, sales data, and post-launch monetization.'],
  ['Crypto firewall', 'There is no official GTA token. Treat beta coins, wallet links, early-access NFTs, and free-money offers as hostile.'],
  ['Education only', 'Investor Radar teaches research habits and scam defense. It is not financial advice or a buy/sell signal.'],
];

const serviceCards = [
  {
    title: 'Basic DFY Template',
    price: '$49-$99',
    cadence: 'one-time',
    accent: 'cyan',
    text: 'QBCore or ESX starter pack with txAdmin notes, essential scripts, Discord roles, and launch checklist.',
    bullets: ['Pre-configured starter recipe', 'Basic branding pass', 'Install video checklist'],
  },
  {
    title: 'Full Custom Server Build',
    price: '$299+',
    cadence: 'one-time',
    accent: 'pink',
    text: 'Launch-ready economy, jobs, maps, legal donation structure, staff workflow, and performance pass.',
    bullets: ['Custom economy and jobs', 'Maps and resources plan', 'One month support upsell'],
  },
  {
    title: 'Script Audit',
    price: '$79',
    cadence: 'per audit',
    accent: 'yellow',
    text: 'Security, optimization, license, webhook, admin-command, and dependency review for existing servers.',
    bullets: ['Risk report', 'Performance notes', 'Fix-priority roadmap'],
  },
  {
    title: 'Custom Money Routes',
    price: '$149+',
    cadence: 'per playbook',
    accent: 'green',
    text: 'Legal route plans, payout splits, crew roles, RP economy rules, and retention schedule for operators.',
    bullets: ['Route and payout matrix', 'Crew role map', 'Economy tuning notes'],
  },
];

const memberTiers = [
  ['Free', '$0', 'Basic guides, scam warnings, public launch boards, and starter calculators.'],
  ['Premium', '$9-$19/mo', 'All tools, template vault access, Discord setup pack, OBS templates, and priority requests.'],
  ['Launch-Ready', '$299+', 'DFY server pack, custom economy, support month, and operator handoff call.'],
];

const serverForgeSteps = [
  ['VPS / Hosting', 'Choose ZAP-Hosting, Hetzner, or a managed FiveM host. Add affiliate links only after approval.'],
  ['Artifacts', 'Download the recommended FiveM server artifacts from runtime.fivem.net and pin the version in your changelog.'],
  ['txAdmin', 'Start the server, open txAdmin, link your Cfx.re account, and create a staging profile first.'],
  ['Framework', 'Deploy QBCore for modern defaults or ESX when your community already knows that ecosystem.'],
  ['Database', 'Create a MariaDB/MySQL database, separate admin credentials, and automatic backups.'],
  ['Firewall', 'Open port 30120 on TCP and UDP, lock down database access, and document restart windows.'],
  ['Discord', 'Create a bot, invite it, add Bot Token and Guild ID in txAdmin, then enable status embeds or whitelisting.'],
];

const discordTemplate = [
  '#rules',
  '#announcements',
  '#general',
  '#applications',
  '#support-tickets',
  '#staff-log',
  '#vip-lounge',
  '#txadmin-status',
];

const streamingChecklist = [
  ['Capture', 'Use OBS Game Capture for the FiveM window and keep a Browser Source scene for alerts.'],
  ['Encoding', 'Use NVENC on NVIDIA or x264 when CPU headroom allows. Start at 6000-8000 kbps for 1080p60.'],
  ['Overlays', 'StreamElements or Streamlabs alerts, chat box, clean webcam frame, and no clutter over minimaps.'],
  ['Delay', 'Add 15-30 seconds for RP streams to reduce sniping and metagaming.'],
  ['Platforms', 'Twitch for RP discovery, YouTube for evergreen guides, Kick only if your audience is already there.'],
  ['Clips', 'Use Rockstar Editor and OBS replay buffer for cinematic route recaps.'],
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

function PaymentLinkButton({ paymentKey, className = '' }) {
  const link = paymentLinks[paymentKey];

  if (!link) {
    return null;
  }

  return (
    <a
      href={link.url}
      className={`payment-link ${className}`}
      onClick={(event) => {
        if (link.url.startsWith('#')) {
          event.preventDefault();
          alert(`${link.provider} placeholder: paste the live hosted payment link into src/data/paymentConfig.js.`);
        }
      }}
    >
      <span>{link.label}</span>
      <strong>{link.price}</strong>
      <small>{link.provider} ready</small>
    </a>
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
  const [copied, setCopied] = useState(false);

  const serverTemplateFiles = [
    {
      path: 'config/server.cfg',
      name: 'server.cfg',
      lang: 'cfg',
      content: `# =========================================================================
#                     GTA VI / LEONIDA STATE SERVER CONFIG
#               Template Powered by GTA Money Team & Lux Automaton
# =========================================================================

# Only change the IP if you are running on a multi-homed server setup.
endpoint_add_tcp "0.0.0.0:30120"
endpoint_add_udp "0.0.0.0:30120"

# --- Database Integration Configuration ---
set mysql_connection_string "mysql://db_user:REPLACE_WITH_DB_PASSWORD@localhost/gtavi_server?charset=utf8mb4"

# --- Core Resource Group Loads ---
ensure mapmanager
ensure chat
ensure spawnmanager
ensure sessionmanager
ensure basic-gamemode
ensure hardcap
ensure rconlog

# --- Custom GTA Money Team Core Scripts ---
ensure moneyteam-core

# --- Server Security & Performance Parameters ---
sv_maxclients 48
set steam_webApiKey "YOUR_STEAM_API_KEY_HERE"
sv_licenseKey "YOUR_LICENSE_KEY_HERE"

# --- Server Identity & Custom Branding ---
sets tags "gta6, rp, legal, vice-city, money-team, legit"
sets locale "en-US"
sv_hostname "GTA Money Team Roleplay | Legit Progression | Powered by Lux Automaton"
sets sv_projectName "GTA Money Team Server"
sets sv_projectDesc "Learn how to make money the legit way through advanced custom legal routes and playbooks."

# --- Administrative Permissions Configuration ---
add_ace group.admin command allow
add_ace group.admin command.quit deny
add_principal identifier.fivem:12345 group.admin`
    },
    {
      path: 'resources/[core]/moneyteam-core/fxmanifest.lua',
      name: 'fxmanifest.lua',
      lang: 'lua',
      content: `# =========================================================================
#                    GTA VI / LEONIDA RESOURCE MANIFEST
#               Template Powered by GTA Money Team & Lux Automaton
# =========================================================================

fx_version 'cerulean'
game 'gta5'

author 'Lux Automaton'
description 'Core Player Management, Spawn Points, and Permissions Engine for GTA VI Servers.'
version '1.0.0'

server_scripts {
    'server/player.lua'
}

client_scripts {
    'client/spawn.lua'
}`
    },
    {
      path: 'resources/[core]/moneyteam-core/server/player.lua',
      name: 'player.lua',
      lang: 'lua',
      content: `-- =========================================================================
--                    GTA VI / LEONIDA SERVER PLAYER CORE
--               Template Powered by GTA Money Team & Lux Automaton
-- =========================================================================

local ActivePlayers = {}
local PermissionRoles = {
    ['admin'] = 3,
    ['moderator'] = 2,
    ['user'] = 1
}

AddEventHandler('playerConnecting', function(playerName, setKickReason, deferrals)
    local src = source
    local identifiers = GetPlayerIdentifiers(src)
    local hasLicense = false

    deferrals.defer()
    deferrals.update(string.format("Welcome %s. Auditing connection permissions...", playerName))
    Wait(1000)

    for _, identifier in ipairs(identifiers) do
        if string.find(identifier, "license:") then
            hasLicense = true
            break
        end
    end

    if not hasLicense then
        deferrals.done("Connection rejected: Valid license key not found.")
    else
        deferrals.done()
    end
end)

RegisterNetEvent('playerDropped')
AddEventHandler('playerDropped', function(reason)
    local src = source
    ActivePlayers[src] = nil
end)

RegisterNetEvent('moneyteam:playerLoaded')
AddEventHandler('moneyteam:playerLoaded', function()
    local src = source
    local playerName = GetPlayerName(src)
    local licenseId = GetPlayerIdentifier(src, 0)

    ActivePlayers[src] = {
        name = playerName,
        license = licenseId,
        cash = 5000,
        bank = 25000,
        role = 'user'
    }

    if IsPlayerAceAllowed(src, "command") then
        ActivePlayers[src].role = 'admin'
    end

    TriggerClientEvent('moneyteam:syncPlayer', src, ActivePlayers[src])
end)`
    },
    {
      path: 'resources/[core]/moneyteam-core/client/spawn.lua',
      name: 'spawn.lua',
      lang: 'lua',
      content: `-- =========================================================================
--                    GTA VI / LEONIDA CLIENT SPAWN CORE
--               Template Powered by GTA Money Team & Lux Automaton
-- =========================================================================

local PlayerState = {}
local FirstSpawn = true

local SpawnsCatalog = {
    ['Vice City Airport'] = { x = -1035.42, y = -2732.18, z = 13.75, heading = 328.5 },
    ['Ocean Drive Motel'] = { x = 245.12, y = -1450.45, z = 29.15, heading = 110.2 },
    ['Leonida Keys Marina'] = { x = 852.34, y = 145.89, z = 5.24, heading = 45.0 }
}

RegisterNetEvent('moneyteam:syncPlayer')
AddEventHandler('moneyteam:syncPlayer', function(data)
    PlayerState = data
end)

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        if NetworkIsSessionActive() and FirstSpawn then
            FirstSpawn = false
            Citizen.Wait(2000)
            TriggerServerEvent('moneyteam:playerLoaded')
            break
        end
    end
end)

function ExecuteSpawn(spawnKey)
    local coords = SpawnsCatalog[spawnKey]
    if not coords then return end
    local ped = PlayerPedId()
    SetEntityCoords(ped, coords.x, coords.y, coords.z, false, false, false, true)
end`
    },
    {
      path: 'README.md',
      name: 'README.md',
      lang: 'md',
      content: `# GTA VI / Leonida State Starter Server Template
*Powered by GTA Money Team & Created by Lux Automaton*

This template serves as a comprehensive starting point for deploying roleplay servers centered around legal career pathways.

## Folder Hierarchy
\`\`\`text
[gta6-server-root]/
├── config/
│   └── server.cfg                # Main config, endpoints, loads, licenses
├── resources/
│   └── [core]/
│       └── moneyteam-core/
│           ├── fxmanifest.lua     # Resource manifest declaration
│           ├── server/
│           │   └── player.lua     # Server-side player auth & permissions
│           └── client/
│               └── spawn.lua      # Client-side spawner & teleports
└── README.md                      # Setup & Customization guide
\`\`\`

## Deployment Steps
1. Create database 'gtavi_server' and paste SQL files.
2. Edit database connection string in 'server.cfg'.
3. Paste sv_licenseKey and steam_webApiKey.
4. Execute: './FXServer +exec config/server.cfg'.`
    }
  ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const currentFile = serverTemplateFiles[selectedFile];

  return (
    <div className="text-left w-full">
      <span className="font-mono text-pink text-xs uppercase block mb-3">// Server Lab</span>
      <h1 className="font-round-bold text-4xl md:text-5xl uppercase text-white mb-6">GTA VI Server Template</h1>
      <p className="text-white/70 text-sm mb-8 max-w-3xl">
        Deploy your own legal Leonida State roleplay server. Navigate the codebase, customize settings, copy scripts, or download the full server pack files directly.
      </p>

      {/* Explorer Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch w-full mb-10">
        
        {/* Left Side: Directory Tree */}
        <div className="lg:col-span-4 border border-white/10 bg-white/5 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <strong className="block text-white uppercase text-xs font-mono tracking-wider mb-4">// Project Workspace</strong>
            <nav className="flex flex-col gap-1.5">
              {serverTemplateFiles.map((file, idx) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(idx)}
                  className={`w-full text-left px-3 py-2 rounded text-xs font-mono transition cursor-pointer flex justify-between items-center ${selectedFile === idx ? 'bg-pink/20 text-pink border-l-2 border-pink' : 'text-white/60 hover:bg-white/5'}`}
                >
                  <span className="truncate">{file.path}</span>
                  <span className="text-[10px] text-white/30 uppercase ml-2">{file.lang}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8 pt-5 border-t border-white/10 space-y-3">
            <button
              onClick={() => {
                // Trigger download of complete server package in Markdown format
                const completePackage = serverTemplateFiles.map(f => `// ==========================================\n// FILE: ${f.path}\n// ==========================================\n\n${f.content}`).join('\n\n');
                const blob = new Blob([completePackage], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'gta6_server_complete_template.txt';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="w-full py-2.5 bg-cyan text-black font-semibold text-xs uppercase rounded hover:bg-white transition duration-300 cursor-pointer text-center"
            >
              Download Server Pack
            </button>
            <button
              onClick={() => onRequest('Custom Server Build')}
              className="w-full py-2.5 bg-transparent border border-white/20 text-white font-semibold text-xs uppercase rounded hover:bg-white/10 transition duration-300 cursor-pointer text-center"
            >
              Request Custom Server Setup
            </button>
          </div>
        </div>

        {/* Right Side: Code Viewer */}
        <div className="lg:col-span-8 border border-white/10 bg-[#090b11] rounded-lg flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="bg-black/40 px-5 py-3 border-b border-white/10 flex justify-between items-center">
            <div>
              <span className="font-mono text-white/40 text-[10px] uppercase block">// Active Code Buffer</span>
              <strong className="text-white text-xs font-mono">{currentFile.name}</strong>
            </div>
            <button
              onClick={() => handleCopy(currentFile.content)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 text-white hover:bg-white/10 text-[10px] uppercase font-semibold rounded transition cursor-pointer"
            >
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>

          {/* Editor Body */}
          <div className="p-5 font-mono text-xs text-white/80 bg-black/90 flex-1 overflow-x-auto whitespace-pre leading-relaxed select-all max-h-[450px]">
            <code>{currentFile.content}</code>
          </div>

          {/* Footer */}
          <div className="bg-black/20 px-5 py-2.5 border-t border-white/10 flex justify-between items-center text-[10px] text-white/40 font-mono">
            <span>Size: {currentFile.content.length} characters</span>
            <span className="uppercase">Language: {currentFile.lang}</span>
          </div>

        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {serverSteps.map((step) => (
          <div key={step.title} className="p-6 border border-white/10 rounded-lg bg-white/5">
            <strong className="block text-xl text-yellow uppercase mb-2">{step.title}</strong>
            <p className="text-white/70 text-xs leading-relaxed">{step.text}</p>
          </div>
        ))}
      </div>
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
  return (
    <div className="text-left w-full">
      <span className="font-mono text-pink text-xs uppercase block mb-3">// Media Vault</span>
      <h1 className="font-round-bold text-4xl md:text-5xl uppercase text-white mb-6">Rockstar trailer Studies</h1>
      <p className="text-white/70 text-sm mb-8 max-w-2xl">
        Study locations, vehicles, and assets from official Rockstar material to plan launch week strategies.
      </p>
      <div className="border border-cyan/20 rounded-lg p-6 bg-white/5 mb-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <strong className="block text-2xl uppercase text-white mb-3">Trailer Study Lessons</strong>
            <p className="text-white/60 text-xs leading-relaxed mb-4">
              Our strategy experts break trailer clips down into structured lessons. Track possible business architectures, map sectors, vehicle performance stats, and secure official source listings.
            </p>
            <a
              href="https://www.rockstargames.com/VI/media/screenshots"
              target="_blank"
              rel="noreferrer"
              className="inline-block px-4 py-2 border border-white/20 rounded text-cyan text-xs font-semibold hover:border-cyan transition duration-300"
            >
              Open Official Screenshots
            </a>
          </div>
          <div className="aspect-video w-full rounded overflow-hidden">
            <iframe
              title="Grand Theft Auto VI Trailer 2"
              src="https://www.youtube.com/embed/VQRLujxTm3c"
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mediaShots.map((shot) => (
          <a href={shot.url} target="_blank" rel="noreferrer" key={shot.title} className="block group border border-white/10 rounded overflow-hidden bg-white/5">
            <img src={shot.url} alt={shot.title} className="w-full aspect-video object-cover group-hover:scale-105 transition duration-500" />
            <span className="block p-3 text-[10px] text-white/50 uppercase">{shot.title}</span>
          </a>
        ))}
      </div>
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

function MemberServicesPage({ onRequest, setPage }) {
  return (
    <div className="text-left w-full">
      <span className="font-mono text-pink text-xs uppercase block mb-3">// Member Services</span>
      <h1 className="font-round-bold text-4xl md:text-5xl uppercase text-white mb-6">Services That Sell</h1>
      <p className="text-white/70 text-sm mb-8 max-w-2xl">
        Member-only DFY server packs, audits, legal money-route playbooks, template vault access, and premium support. No cheats, no exploits, no account-risk shortcuts.
      </p>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
        {serviceCards.map((card) => (
          <div key={card.title} className={`service-price-card ${card.accent}`}>
            <div>
              <span className="font-mono text-[10px] uppercase block mb-3">member-only</span>
              <strong className="block text-lg text-white uppercase mb-2">{card.title}</strong>
              <p className="text-white/60 text-xs leading-relaxed mb-5">{card.text}</p>
              <ul className="space-y-2 text-white/55 text-xs">
                {card.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong className="service-price">{card.price}</strong>
              <span className="block text-white/45 text-[10px] uppercase mb-4">{card.cadence}</span>
              <button onClick={() => onRequest(card.title)} className="w-full py-2 bg-transparent border border-current rounded text-xs font-semibold uppercase hover:bg-white/10 transition duration-300">
                Request Service
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {memberTiers.map(([tier, price, text]) => (
          <div key={tier} className="p-6 border border-white/10 rounded-lg bg-white/5">
            <span className="font-mono text-cyan text-[10px] uppercase">pricing tier</span>
            <strong className="block text-white text-xl uppercase my-2">{tier}</strong>
            <strong className="block text-green text-3xl uppercase mb-3">{price}</strong>
            <p className="text-white/60 text-xs leading-relaxed">{text}</p>
            {tier === 'Premium' && <PaymentLinkButton paymentKey="premiumMonthly" className="mt-5" />}
            {tier === 'Launch-Ready' && <PaymentLinkButton paymentKey="customServer" className="mt-5" />}
          </div>
        ))}
      </div>
      <div className="mt-8 p-6 border border-green/25 rounded-lg bg-green/5 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
        <div>
          <strong className="block text-green text-lg uppercase mb-2">Template Vault Upsell</strong>
          <p className="text-white/65 text-xs leading-relaxed max-w-3xl">
            Sell downloadable ZIPs for QBCore/ESX starter packs, Discord setup templates, OBS scene collections, and setup videos. Buyer delivery can start as a protected member page, then move to Stripe/PayPal fulfillment when checkout credentials are ready.
          </p>
        </div>
        <button onClick={() => setPage('server-forge')} className="px-5 py-3 bg-green text-black text-xs font-semibold uppercase rounded hover:bg-white transition duration-300">
          Open Server Forge
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={() => setPage('template-shop')} className="px-4 py-2 border border-cyan/40 text-cyan text-xs font-semibold uppercase rounded hover:bg-cyan/10">
          Open Template Shop
        </button>
        <button onClick={() => setPage('lux-ops')} className="px-4 py-2 border border-white/15 text-white/50 text-xs font-semibold uppercase rounded hover:text-white hover:border-white/30">
          Internal Ops Desk
        </button>
      </div>
    </div>
  );
}

function ServerForgePage({ onRequest }) {
  return (
    <div className="text-left w-full">
      <span className="font-mono text-pink text-xs uppercase block mb-3">// Server Forge</span>
      <h1 className="font-round-bold text-4xl md:text-5xl uppercase text-white mb-6">FiveM Server Creation Guide</h1>
      <p className="text-white/70 text-sm mb-8 max-w-3xl">
        A txAdmin-first build path for legal RP communities: hosting, artifacts, frameworks, database, firewall, Discord, and sellable templates. Rockstar currently lists GTA VI for November 19, 2026, so this is the pre-launch build window.
      </p>
      <div className="server-stepper">
        {serverForgeSteps.map(([title, text], index) => (
          <article key={title}>
            <span>{index + 1}</span>
            <strong>{title}</strong>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <div className="p-6 border border-cyan/25 rounded-lg bg-cyan/5">
          <strong className="block text-cyan text-2xl uppercase mb-3">Discord Setup Template</strong>
          <p className="text-white/65 text-xs leading-relaxed mb-5">
            Productize a ready Discord server with whitelist roles, VIP access, staff roles, support tickets, txAdmin status embeds, rules, and applications.
          </p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {discordTemplate.map((channel) => (
              <span key={channel} className="px-3 py-2 rounded border border-white/10 bg-black/50 text-white/60 text-xs">{channel}</span>
            ))}
          </div>
          <button onClick={() => onRequest('Discord Setup Template')} className="px-5 py-3 border border-cyan/40 text-cyan text-xs font-semibold uppercase rounded hover:bg-cyan/10">
            Request Discord Pack
          </button>
        </div>
        <div className="p-6 border border-pink/25 rounded-lg bg-pink/5">
          <strong className="block text-pink text-2xl uppercase mb-3">Sellable Server Pack</strong>
          <p className="text-white/65 text-xs leading-relaxed mb-5">
            Package a branded QBCore/ESX ZIP with environment checklist, import SQL, resource manifest, Discord template, txAdmin config notes, and setup video.
          </p>
          <div className="space-y-3 text-white/60 text-xs">
            <p>Affiliate slots: ZAP-Hosting, Tebex, managed VPS hosts, and OBS plugin bundles.</p>
            <p>Lana handoff: "Vice OS says: build small, test daily, and never install a script you cannot explain."</p>
          </div>
          <button onClick={() => onRequest('Basic DFY Template')} className="mt-5 px-5 py-3 bg-pink text-black text-xs font-semibold uppercase rounded hover:bg-white transition duration-300">
            Request Template Build
          </button>
        </div>
      </div>
    </div>
  );
}

function StreamingAcademyPage({ onRequest }) {
  return (
    <div className="text-left w-full">
      <span className="font-mono text-pink text-xs uppercase block mb-3">// Streaming Academy</span>
      <h1 className="font-round-bold text-4xl md:text-5xl uppercase text-white mb-6">OBS Setup For GTA RP</h1>
      <p className="text-white/70 text-sm mb-8 max-w-3xl">
        Build a subscriber-ready streaming workflow with OBS Studio, clean overlays, safe delays, and reusable scene collections for members.
      </p>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {streamingChecklist.map(([title, text]) => (
          <article key={title} className="p-6 border border-white/10 rounded-lg bg-white/5">
            <span className="font-mono text-yellow text-[10px] uppercase">streaming setup</span>
            <strong className="block text-white text-xl uppercase my-2">{title}</strong>
            <p className="text-white/60 text-xs leading-relaxed">{text}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 p-6 border border-cyan/25 rounded-lg bg-cyan/5">
        <strong className="block text-cyan text-2xl uppercase mb-3">Subscriber Product: OBS Scene Collection</strong>
        <p className="text-white/65 text-xs leading-relaxed mb-5">
          Offer "Starting Soon", "Live RP", "BRB", "Route Recap", and "YouTube Guide Recording" scenes with alerts, chat box, webcam, and audio routing notes.
        </p>
        <button onClick={() => onRequest('OBS Scene Collection')} className="px-5 py-3 bg-cyan text-black text-xs font-semibold uppercase rounded hover:bg-white transition duration-300">
          Request OBS Pack
        </button>
      </div>
    </div>
  );
}

function ScamFirewallPage() {
  const [claim, setClaim] = useState('free GTA coins beta key download');
  const redFlags = ['beta', 'coin', 'crypto', 'wallet', 'free', 'download', 'leak', 'key', 'nft', 'airdrop'];
  const hits = redFlags.filter((flag) => claim.toLowerCase().includes(flag));
  const risk = hits.length >= 3 ? 'Critical' : hits.length >= 1 ? 'Review Required' : 'Low Signal';

  return (
    <div className="text-left w-full">
      <span className="font-mono text-pink text-xs uppercase block mb-3">// Scam Firewall</span>
      <h1 className="font-round-bold text-4xl md:text-5xl uppercase text-white mb-6">Red-Flag Checker</h1>
      <p className="text-white/70 text-sm mb-8 max-w-3xl">
        Check beta keys, fake GTA coins, malicious downloads, leaked resources, wallet links, and too-good-to-be-true server offers before your members touch them.
      </p>
      <div className="grid lg:grid-cols-[1fr_0.8fr] gap-6">
        <div className="p-6 border border-red-400/30 rounded-lg bg-red-400/5">
          <label className="block text-white/60 text-xs uppercase font-semibold mb-3" htmlFor="scam-claim">Paste offer or claim</label>
          <textarea
            id="scam-claim"
            value={claim}
            onChange={(event) => setClaim(event.target.value)}
            className="w-full min-h-36 bg-black border border-white/15 rounded p-4 text-white text-sm"
          />
          <div className="mt-5 p-5 border border-white/10 rounded bg-black/60">
            <span className="font-mono text-red-300 text-[10px] uppercase">risk result</span>
            <strong className="block text-3xl text-red-300 uppercase my-2">{risk}</strong>
            <p className="text-white/60 text-xs leading-relaxed">
              Matched flags: {hits.length ? hits.join(', ') : 'none'}. Always verify against Rockstar, Cfx.re, Tebex, and official publisher channels before paying or downloading.
            </p>
          </div>
        </div>
        <div className="p-6 border border-green/25 rounded-lg bg-green/5">
          <strong className="block text-green text-2xl uppercase mb-4">Safe Source Rules</strong>
          <ul className="space-y-3 text-white/65 text-xs leading-relaxed">
            <li>No official GTA token, wallet drop, or beta coin.</li>
            <li>No random executable, "early build", or passworded archive.</li>
            <li>No seller gets paid before ownership, terms, and support path are clear.</li>
            <li>No leaked assets or stolen paid scripts in server packs.</li>
            <li>No claims without dated source links.</li>
          </ul>
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
        Frontend-only demo for payment returns and membership activation. Real launch should verify Stripe, PayPal, or Tebex webhooks on the backend.
      </p>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="premium-gate">
          <strong>{membership?.tier || 'Free'} Member</strong>
          <p>Use test member code GMT-PREMIUM-LUX to unlock premium locally.</p>
          <div className="service-form">
            <label>
              Member code
              <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="GMT-PREMIUM-LUX" />
            </label>
            <button
              type="button"
              onClick={() => {
                const activated = activateMember(code);
                if (activated) {
                  setMembership(activated);
                  setError('');
                } else {
                  setError('Invalid demo code');
                }
              }}
            >
              Activate Access
            </button>
          </div>
          {error && <p className="text-pink text-xs mt-3">{error}</p>}
        </div>
        <div className="p-6 border border-green/25 rounded-lg bg-green/5">
          <strong className="block text-green text-2xl uppercase mb-3">Latest Checkout Return</strong>
          <p className="text-white/65 text-xs leading-relaxed">
            {latestOrder ? `${latestOrder.product} via ${latestOrder.provider} is recorded as ${latestOrder.status}.` : 'No checkout return recorded yet. Add ?checkout=success&product=Premium to the URL to test.'}
          </p>
        </div>
      </div>
    </div>
  );
}

function AffiliateStackPage() {
  const partners = [
    ['Hosting', 'ZAP-Hosting / VPS hosts', 'Server Forge affiliate CTA for managed FiveM hosting.'],
    ['Tebex', 'Authorized FiveM monetization direction', 'Route server store products through a backend or Tebex Headless API later.'],
    ['Streaming', 'OBS plugins / overlays', 'Offer setup kits and creator tools from Streaming Academy.'],
    ['Creator Tools', 'Editing, thumbnails, assets', 'Bundle legal guide templates with content production offers.'],
  ];

  return (
    <div className="text-left w-full">
      <span className="font-mono text-pink text-xs uppercase block mb-3">// Affiliate Stack</span>
      <h1 className="font-round-bold text-4xl md:text-5xl uppercase text-white mb-6">Partner Revenue Layer</h1>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {partners.map(([title, partner, text]) => (
          <article key={title} className="template-card">
            <span className="font-mono text-cyan text-[10px] uppercase">{title}</span>
            <strong>{partner}</strong>
            <p>{text}</p>
          </article>
        ))}
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
        Local lead tracker for service requests, template interest, and handoff exports. This is stored in browser localStorage until a real CRM, email, or Discord webhook is connected.
      </p>
      {!unlocked ? (
        <div className="premium-gate">
          <strong>Ops desk locked</strong>
          <p>Enter the local operator passcode to view leads, orders, tasks, and campaigns. Demo passcode: lux-ops-2026.</p>
          <input
            value={passcode}
            onChange={(event) => setPasscode(event.target.value)}
            placeholder="Operator passcode"
            className="ops-passcode"
          />
        </div>
      ) : (
        <div className="ops-desk">
          <div className="ops-toolbar">
            <div>
              <strong>{leads.length}</strong>
              <span>local leads captured</span>
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
    ? encodeURIComponent(`Service: ${submitted.service}\nContact: ${submitted.contact}\nBudget: ${submitted.budget}\nDetails:\n${submitted.details}`)
    : '';

  return (
    <div className="request-modal-backdrop" role="presentation">
      <div className="request-modal" role="dialog" aria-modal="true" aria-labelledby="request-title">
        <button onClick={onClose} className="request-close" aria-label="Close request form">x</button>
        <span className="font-mono text-pink text-xs uppercase block mb-3">// Request Service</span>
        <h2 id="request-title" className="font-round-bold text-3xl uppercase text-white mb-3">{service}</h2>
        {submitted ? (
          <div className="p-5 border border-green/30 rounded bg-green/10">
            <strong className="block text-green text-xl uppercase mb-2">Request staged</strong>
            <p className="text-white/65 text-xs leading-relaxed">
              Lana saved a local backup and prepared the email handoff. Stripe Checkout, PayPal, or Discord webhook can replace this once credentials are approved.
            </p>
            <a
              href={`mailto:luxautomaton@gmail.com?subject=${encodeURIComponent(`GTA Money Team Request: ${submitted.service}`)}&body=${emailBody}`}
              className="request-mail-link"
            >
              Send to Lux Automaton
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
              Discord or email
              <input name="contact" required placeholder="username#0000 or email@domain.com" />
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
              <textarea name="details" required placeholder="Server framework, route goals, Discord size, audit needs, deadline..." />
            </label>
            <button type="submit">Submit Request</button>
          </form>
        )}
      </div>
    </div>
  );
}

// Router switcher helper
function renderSubpage(page, helpers) {
  switch (page) {
    case 'lana-coach':
      return <LanaCoach />;
    case 'money-courses':
      return <MoneyCoursesPage />;
    case 'calculators':
      return <Calculators />;
    case 'route-planner':
      return <RoutePlannerPage onRequest={helpers.onRequest} />;
    case 'server-lab':
      return <ServerLabPage onRequest={helpers.onRequest} />;
    case 'creator-kit':
      return <CreatorKitPage />;
    case 'template-shop':
      return <TemplatesShop />;
    case 'server-forge':
      return <ServerForgePage onRequest={helpers.onRequest} />;
    case 'streaming-academy':
      return <StreamingAcademyPage onRequest={helpers.onRequest} />;
    case 'scam-firewall':
      return <ScamFirewallPage />;
    case 'member-activation':
      return <MemberActivationPage membership={helpers.membership} setMembership={helpers.setMembership} latestOrder={helpers.orders[0]} />;
    case 'affiliate-stack':
      return <AffiliateStackPage />;
    case 'launch-funnel':
      return <LaunchFunnelPage onCampaignSaved={helpers.onCampaignSaved} />;
    case 'media-vault':
      return <MediaVaultPage />;
    case 'investor-radar':
      return <InvestorRadarPage />;
    case 'member-services':
      return <MemberServicesPage onRequest={helpers.onRequest} setPage={helpers.setPage} />;
    case 'lux-ops':
      return <LuxOpsDeskPage leads={helpers.leads} orders={helpers.orders} tasks={helpers.tasks} campaigns={helpers.campaigns} />;
    default:
      return null;
  }
}

const App = () => {
  const [page, setPage] = useState('home');
  const [requestedService, setRequestedService] = useState(null);
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

  const openRequest = (service) => setRequestedService(service);
  const handleLeadSaved = (lead) => setLeads(saveLead(lead));
  const handleTaskSaved = (task) => setTasks(saveTask(task));
  const handleCampaignSaved = (campaign) => setCampaigns(saveCampaign(campaign));

  if (page === 'home') {
    return (
      <main className="home-app-shell w-dvw overflow-x-hidden" id="hero">
        <Navbar page={page} setPage={setPage} />
        <Hero />
        <FirstVideo />
        <LanaCoachPreview setPage={setPage} />
        <SecondVideo />
        <CalculatorsPreview setPage={setPage} />
        <CreatorKitPreview setPage={setPage} />
        <Final />
        <OutroPreview setPage={setPage} />
        <RequestServiceModal service={requestedService} onClose={() => setRequestedService(null)} onLeadSaved={handleLeadSaved} onTaskSaved={handleTaskSaved} />
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
        '--page-accent': pageProfile.accent,
        '--page-accent-2': pageProfile.accent2,
      }}
    >
      <Navbar page={page} setPage={setPage} />
      
      <div className="premium-page-wrap flex-1">
        <PageHero profile={pageProfile} />
        <div className="premium-subpage-layout">
          <PageRail profile={pageProfile} />
          <section className="revenue-workspace">
            {renderSubpage(page, { onRequest: openRequest, setPage, membership, setMembership, leads, orders, tasks, campaigns, onCampaignSaved: handleCampaignSaved })}
          </section>
        </div>
      </div>

      <footer className="premium-footer py-10 border-t border-white/10 text-center text-white/40 text-[11px] uppercase tracking-wider bg-black w-full">
        Powered by Lana from Lux Agent | Created by Lux Automaton
      </footer>
      <RequestServiceModal service={requestedService} onClose={() => setRequestedService(null)} onLeadSaved={handleLeadSaved} onTaskSaved={handleTaskSaved} />
    </main>
  );
};

export default App;
