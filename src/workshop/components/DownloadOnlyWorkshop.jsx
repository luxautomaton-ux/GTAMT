import { useEffect, useMemo, useState } from 'react';
import { workshopBrand, workshopDownloads, workshopModules } from '../data/workshopCatalog.js';
import { subscriptionConfig } from '../data/subscriptionConfig.js';
import {
  activateWorkshopMember,
  buildDownloadUrl,
  clearWorkshopAccess,
  exportDownloadManifest,
  isWorkshopMember,
  loadMemberProfile,
} from '../utils/downloadAccess.js';
import '../../styles/gmt-download-workshop.css';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

const tabs = [
  ['start', 'Start Here'],
  ['vault', 'Workshop Vault'],
  ['downloads', 'Downloads'],
  ['calculator', 'Calculators'],
  ['server-packs', 'Server Packs'],
  ['creator-academy', 'Creator Academy'],
  ['scam-firewall', 'Scam Firewall'],
  ['lana-coach', 'Lana Coach'],
];

const serverCategories = new Set(['Server Templates', 'City Packs', 'Community', 'Monetization', 'Security', 'Market Research', 'App Monetization']);
const creatorCategories = new Set(['Marketing']);

const scamRules = [
  'No cheats, mod menus, money drops, malware, account theft, fake beta keys, or exploit claims.',
  'Do not sell in-game cash, weapons, randomized rewards, fake crypto, NFTs, or pay-to-win shortcuts.',
  'Use original server identities, fictional factions, licensed assets, and legal-safe templates.',
  'Keep GitHub tooling, scripts, and research internal to Lux Automaton. Customers get finished downloads.',
  'Use Stripe or backend verification for workshop access. Do not trust localStorage for production membership.',
  'For FiveM/RedM server perks, follow Cfx.re and Tebex platform rules before selling any server benefits.',
];

const lanaPrompts = [
  'Turn this city pack into a 7-day launch plan with Discord posts, safe monetization ideas, and a download checklist.',
  'Review this server offer for scams, copied assets, pay-to-win risk, and unclear buyer promises.',
  'Create a faceless YouTube Shorts plan that sells the workshop without fake GTA 6 access claims.',
  'Build a $25/month member retention plan using weekly downloads, calculators, and legal server education.',
];

function DownloadCard({ item, member, onDownload }) {
  return (
    <article className="gmt-download-card">
      <span>{item.category}</span>
      <h3>{item.title}</h3>
      <p>{item.promise}</p>
      <ul>
        {item.contents.map((content) => <li key={content}>{content}</li>)}
      </ul>
      <div className="gmt-download-card__foot">
        <small>{item.minutes} min setup</small>
        <button className="gmt-btn gmt-btn--primary" onClick={() => onDownload(item)}>
          {member ? 'Download ZIP' : 'Unlock'}
        </button>
      </div>
    </article>
  );
}

function DownloadGrid({ downloads, member, onDownload }) {
  return (
    <div className="gmt-download-grid">
      {downloads.map((item) => (
        <DownloadCard key={item.id} item={item} member={member} onDownload={onDownload} />
      ))}
    </div>
  );
}

export default function DownloadOnlyWorkshop() {
  const [activeTab, setActiveTab] = useState('start');
  const [member, setMember] = useState(() => isWorkshopMember());
  const [profile, setProfile] = useState(() => loadMemberProfile());
  const [unlockCode, setUnlockCode] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [toast, setToast] = useState('');
  const [calc, setCalc] = useState({ members: 100, churn: 7, downloads: 650, upsells: 12, upsellPrice: 299 });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true' || params.get('paid') === '1') {
      const activated = activateWorkshopMember('checkout-return');
      setMember(true);
      setProfile(activated);
      setActiveTab('downloads');
      showToast('Workshop access unlocked in demo mode. Connect Stripe webhooks before real launch.');
    }
  }, []);

  const categories = useMemo(() => ['All', ...Array.from(new Set(workshopDownloads.map((item) => item.category)))], []);
  const visibleDownloads = useMemo(() => workshopDownloads.filter((item) => {
    const matchesCategory = category === 'All' || item.category === category;
    const text = `${item.title} ${item.promise} ${item.category}`.toLowerCase();
    return matchesCategory && text.includes(query.toLowerCase());
  }), [category, query]);

  const serverDownloads = useMemo(() => workshopDownloads.filter((item) => serverCategories.has(item.category)), []);
  const creatorDownloads = useMemo(() => workshopDownloads.filter((item) => creatorCategories.has(item.category)), []);

  const mrr = calc.members * 25;
  const annualRunRate = mrr * 12;
  const churnLoss = mrr * (calc.churn / 100);
  const upsellRevenue = calc.upsells * calc.upsellPrice;
  const blendedMonthly = mrr + upsellRevenue;

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 3200);
  }

  function unlock() {
    const activated = activateWorkshopMember(unlockCode);
    if (!activated) {
      showToast(`Use ${subscriptionConfig.demoUnlockCode} for local testing, then replace this with real payment verification.`);
      return;
    }
    setMember(true);
    setProfile(activated);
    setActiveTab('downloads');
    showToast('Workshop member vault unlocked.');
  }

  function resetAccess() {
    clearWorkshopAccess();
    setMember(false);
    setProfile({ active: false, tier: 'Preview', source: 'reset' });
    showToast('Local workshop access reset.');
  }

  function goCheckout() {
    const url = subscriptionConfig.stripePaymentLink;
    if (!url || url.includes('REPLACE')) {
      showToast('Add your live $25/mo Stripe Payment Link in subscriptionConfig.js.');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function downloadItem(item) {
    if (!member) {
      setActiveTab('vault');
      showToast('Join the $25/mo workshop to unlock downloads.');
      return;
    }
    window.location.href = buildDownloadUrl(item.file);
  }

  return (
    <div className="gmt-workshop-shell">
      <section className="gmt-hero">
        <div className="gmt-hero__media" aria-hidden="true" />
        <div className="gmt-hero__copy">
          <h1>{workshopBrand.name} Workshop</h1>
          <h2>{workshopBrand.tagline}</h2>
          <p>{workshopBrand.subline}</p>
          <div className="gmt-hero__actions">
            <button onClick={() => setActiveTab(member ? 'downloads' : 'vault')} className="gmt-btn gmt-btn--primary">
              {member ? 'Open Downloads' : 'Join the Workshop - $25/mo'}
            </button>
            <button onClick={() => setActiveTab('downloads')} className="gmt-btn gmt-btn--ghost">Preview Downloads</button>
          </div>
          <div className="gmt-proof-strip">
            <span>All downloadable</span>
            <span>No public request forms</span>
            <span>No public GitHub links</span>
            <span>Legal strategy only</span>
          </div>
        </div>
        <aside className="gmt-member-card">
          <span className={member ? 'gmt-status gmt-status--on' : 'gmt-status'} />
          <strong>{member ? 'Workshop Active' : 'Preview Mode'}</strong>
          <small>{member ? `${profile.tier} access · ${profile.price}` : 'Locked download vault'}</small>
          <button onClick={goCheckout} className="gmt-btn gmt-btn--small">Stripe $25/mo</button>
        </aside>
      </section>

      <nav className="gmt-tabs" aria-label="Workshop navigation">
        {tabs.map(([id, label]) => (
          <button key={id} className={activeTab === id ? 'active' : ''} onClick={() => setActiveTab(id)}>
            {label}
          </button>
        ))}
      </nav>

      {activeTab === 'start' && (
        <div className="gmt-grid gmt-grid--two">
          <section className="gmt-panel">
            <h2>Let us help you make money on GTA 6.</h2>
            <p>GTA Money Team is now a download-only workshop. Members pay {subscriptionConfig.priceLabel}, unlock the vault, and download the templates, city packs, calculators, scripts, and legal money systems without public contact forms or manual back-and-forth.</p>
            <div className="gmt-offer-box">
              <strong>{subscriptionConfig.priceLabel}</strong>
              <span>All current downloads, future drops, server packs, creator scripts, security playbooks, and Lana strategy prompts.</span>
            </div>
          </section>
          <section className="gmt-panel">
            <h2>What Members Get</h2>
            <div className="gmt-module-list">
              {workshopModules.slice(0, 5).map((module) => (
                <article key={module.title}>
                  <strong>{module.title}</strong>
                  <p>{module.lesson}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'vault' && (
        <section className="gmt-panel gmt-join-panel">
          <h2>Join the Workshop for $25/month.</h2>
          <p>Use Stripe or backend checkout to verify paid members. This local demo unlock code is only for testing the frontend before connecting real payment verification.</p>
          <div className="gmt-price-card">
            <strong>{subscriptionConfig.priceLabel}</strong>
            <ul>
              <li>All workshop downloads</li>
              <li>Server templates and city packs</li>
              <li>Faceless promotion scripts</li>
              <li>Revenue calculators</li>
              <li>Future pack drops</li>
            </ul>
            <button className="gmt-btn gmt-btn--primary" onClick={goCheckout}>Open Stripe Checkout</button>
          </div>
          <div className="gmt-unlock-row">
            <input value={unlockCode} onChange={(event) => setUnlockCode(event.target.value)} placeholder="Local test code" />
            <button className="gmt-btn" onClick={unlock}>Activate Test Access</button>
            <button className="gmt-btn gmt-btn--ghost" onClick={resetAccess}>Reset</button>
          </div>
          <small>Local test code: {subscriptionConfig.demoUnlockCode}</small>
        </section>
      )}

      {activeTab === 'downloads' && (
        <section className="gmt-panel">
          <div className="gmt-panel-head">
            <div>
              <h2>{member ? 'Member Downloads' : 'Locked Workshop Downloads'}</h2>
              <p>{member ? 'Everything is downloadable. No request forms, no public comments, no manual back-and-forth.' : 'Preview the vault. Join for $25/mo to unlock every ZIP.'}</p>
            </div>
            {member && <button className="gmt-btn gmt-btn--ghost" onClick={() => exportDownloadManifest(workshopDownloads)}>Export Manifest CSV</button>}
          </div>
          <div className="gmt-filter-row">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search downloads..." />
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((cat) => <option key={cat}>{cat}</option>)}
            </select>
          </div>
          <DownloadGrid downloads={visibleDownloads} member={member} onDownload={downloadItem} />
        </section>
      )}

      {activeTab === 'calculator' && (
        <section className="gmt-panel">
          <h2>See the workshop money before launch.</h2>
          <div className="gmt-calc-grid">
            <label>Members<input type="number" value={calc.members} onChange={(event) => setCalc({ ...calc, members: Number(event.target.value) })} /></label>
            <label>Monthly churn %<input type="number" value={calc.churn} onChange={(event) => setCalc({ ...calc, churn: Number(event.target.value) })} /></label>
            <label>Monthly downloads<input type="number" value={calc.downloads} onChange={(event) => setCalc({ ...calc, downloads: Number(event.target.value) })} /></label>
            <label>Upsells sold<input type="number" value={calc.upsells} onChange={(event) => setCalc({ ...calc, upsells: Number(event.target.value) })} /></label>
            <label>Avg upsell price<input type="number" value={calc.upsellPrice} onChange={(event) => setCalc({ ...calc, upsellPrice: Number(event.target.value) })} /></label>
          </div>
          <div className="gmt-metrics">
            <div><span>Workshop MRR</span><strong>{money.format(mrr)}</strong></div>
            <div><span>Annual Run Rate</span><strong>{money.format(annualRunRate)}</strong></div>
            <div><span>Churn Risk</span><strong>{money.format(churnLoss)}</strong></div>
            <div><span>Upsell Revenue</span><strong>{money.format(upsellRevenue)}</strong></div>
            <div><span>Total Monthly</span><strong>{money.format(blendedMonthly)}</strong></div>
            <div><span>Downloads / Member</span><strong>{number.format(calc.downloads / Math.max(calc.members, 1))}</strong></div>
          </div>
        </section>
      )}

      {activeTab === 'server-packs' && (
        <section className="gmt-panel">
          <h2>Server Packs</h2>
          <p>FiveM templates, city identities, Discord launch systems, Tebex blueprints, security SOPs, and money-pattern research for legal server education.</p>
          <DownloadGrid downloads={serverDownloads} member={member} onDownload={downloadItem} />
        </section>
      )}

      {activeTab === 'creator-academy' && (
        <section className="gmt-panel">
          <h2>Creator Academy</h2>
          <p>Download faceless promotion scripts, short-form hooks, captions, and campaign ideas that sell the workshop without fake access claims.</p>
          <DownloadGrid downloads={creatorDownloads} member={member} onDownload={downloadItem} />
        </section>
      )}

      {activeTab === 'scam-firewall' && (
        <section className="gmt-panel">
          <h2>Scam Firewall</h2>
          <p>Trust is the product. GTA Money Team teaches legal strategy, downloadable systems, and clean server education only.</p>
          <div className="gmt-module-list">
            {scamRules.map((rule) => (
              <article key={rule}>
                <strong>Safety Rule</strong>
                <p>{rule}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'lana-coach' && (
        <section className="gmt-panel">
          <h2>Lana Coach</h2>
          <p>Lana stays inside GTA Money Team as the branded Lux Agent coach. The public app gives members downloadable prompt packs and strategy scripts, not live public support forms.</p>
          <div className="gmt-module-list">
            {lanaPrompts.map((prompt) => (
              <article key={prompt}>
                <strong>Lana Prompt</strong>
                <p>{prompt}</p>
              </article>
            ))}
          </div>
          <div className="gmt-offer-box">
            <strong>Prompt Pack</strong>
            <span>Open Downloads and grab the Start Here playbook plus creator/server packs for Lana-ready scripts.</span>
          </div>
        </section>
      )}

      <footer className="gmt-footer-note">
        Powered by {workshopBrand.poweredBy}. Created by {workshopBrand.createdBy}. {workshopBrand.legal}
      </footer>
      {toast && <div className="gmt-toast">{toast}</div>}
    </div>
  );
}
