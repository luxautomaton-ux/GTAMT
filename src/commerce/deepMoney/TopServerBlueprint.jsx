import React, { useMemo, useState } from 'react';
import { complianceRules, productOffers, serverSignals, youtubeAngles } from './researchData.js';

const tabs = ['market', 'products', 'calculator', 'youtube', 'rules'];

const productArt = {
  'priority-queue-engine': './assets/commerce-art/priority-queue-engine.png',
  'whitelist-application-machine': './assets/commerce-art/whitelist-application-machine.png',
  'discord-commerce-roles': './assets/commerce-art/discord-commerce-roles.png',
  'street-faction-identity': './assets/commerce-art/street-faction-identity.png',
  'city-business-economy': './assets/commerce-art/city-business-economy.png',
  'tebex-store-blueprint': './assets/commerce-art/tebex-store-blueprint.png',
  'security-anti-abuse-audit': './assets/commerce-art/security-anti-abuse-audit.png',
  'creator-server-launch': './assets/commerce-art/creator-server-launch.png',
  'premium-city-identity': './assets/commerce-art/premium-city-identity.png',
  'monthly-ops-retainer': './assets/commerce-art/monthly-ops-retainer.png',
  'roleplay-staff-academy': './assets/commerce-art/roleplay-staff-academy.png',
  'city-launch-funnel': './assets/commerce-art/city-launch-funnel.png',
};

function money(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export default function TopServerBlueprint({ onRequest = () => {} }) {
  const [activeTab, setActiveTab] = useState('market');
  const [query, setQuery] = useState('');
  const [calc, setCalc] = useState({
    activePlayers: 500,
    subscriberConversion: 6,
    subscriptionPrice: 25,
    oneTimeOrders: 25,
    oneTimePrice: 149,
    serviceOrders: 4,
    servicePrice: 499,
  });

  const filteredServers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return serverSignals;
    return serverSignals.filter((item) => {
      const haystack = [item.server, item.public_signal, item.build_for_gmt, ...(item.visible_products || [])]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  const totals = useMemo(() => {
    const subscribers = Math.round(calc.activePlayers * (calc.subscriberConversion / 100));
    const subscriptionMrr = subscribers * calc.subscriptionPrice;
    const oneTimeRevenue = calc.oneTimeOrders * calc.oneTimePrice;
    const serviceRevenue = calc.serviceOrders * calc.servicePrice;
    const monthlyTotal = subscriptionMrr + oneTimeRevenue + serviceRevenue;
    return { subscribers, subscriptionMrr, oneTimeRevenue, serviceRevenue, monthlyTotal };
  }, [calc]);

  const updateCalc = (key) => (event) => {
    setCalc((current) => ({ ...current, [key]: Number(event.target.value) }));
  };

  return (
    <section className="gmt-deep-scan">
      <div className="gmt-deep-hero">
        <p className="eyebrow">GTA Money Team Intelligence Desk</p>
        <h1>Top Server Money Scan</h1>
        <p>
          Study public monetization patterns from major RP stores, then turn the patterns into original,
          legal templates you can sell: queue systems, whitelist flows, Discord roles, Tebex stores,
          city identities, faction packs, security audits, and monthly ops retainers.
        </p>
        <div className="hero-actions">
          <button onClick={() => setActiveTab('products')}>Build Product Stack</button>
          <button className="ghost" onClick={() => setActiveTab('calculator')}>Open Revenue Calculator</button>
        </div>
      </div>

      <nav className="gmt-tabs" aria-label="Money intel tabs">
        {tabs.map((tab) => (
          <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
            {tab === 'market' && 'Market Scan'}
            {tab === 'products' && 'Template Products'}
            {tab === 'calculator' && 'Revenue Calculator'}
            {tab === 'youtube' && 'YouTube Angles'}
            {tab === 'rules' && 'Legal Rules'}
          </button>
        ))}
      </nav>

      {activeTab === 'market' && (
        <div className="panel-stack">
          <div className="gmt-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Public signal ranking</p>
                <h2>10 monetization models to learn from</h2>
              </div>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search priority, gang, Discord, business..."
              />
            </div>
            <p className="notice">
              Revenue is private, so this page ranks public monetization signals — not verified income.
              Use this for inspiration only. Do not copy names, assets, scripts, logos, or exact packages.
            </p>
            <div className="signal-grid">
              {filteredServers.map((server) => (
                <article className="deep-signal-card" key={server.server}>
                  <div className="rank">#{server.rank}</div>
                  <h3>{server.server}</h3>
                  <p>{server.public_signal}</p>
                  <div className="pill-row">
                    {server.visible_products.slice(0, 5).map((product) => <span key={product}>{product}</span>)}
                  </div>
                  <strong>GMT product angle:</strong>
                  <p>{server.build_for_gmt}</p>
                  <small>{server.do_not_copy}</small>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="deep-product-grid">
          {productOffers.map((offer) => (
            <article className="deep-product-card" key={offer.id}>
              <img src={productArt[offer.id] || './assets/commerce-art/source-commerce-board.png'} alt={`${offer.name} product artwork`} />
              <div className="deep-product-card-body">
              <p className="eyebrow">{offer.price}</p>
              <h3>{offer.name}</h3>
              <p>{offer.buyer}</p>
              <h4>Deliverables</h4>
              <ul>
                {offer.sellable_deliverables.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <h4>Money levers</h4>
              <div className="pill-row">
                {offer.money_levers.map((lever) => <span key={lever}>{lever}</span>)}
              </div>
              <p className="compliance-note">{offer.compliance}</p>
              <button onClick={() => onRequest(offer.name)}>Request Service Setup</button>
              </div>
            </article>
          ))}
        </div>
      )}

      {activeTab === 'calculator' && (
        <div className="gmt-panel calculator-panel">
          <div>
            <p className="eyebrow">Forecast before you sell</p>
            <h2>Template + server commerce revenue estimator</h2>
            <p>
              Estimate legal revenue from subscriptions, one-time template sales, and DFY services.
              These are planning numbers, not guaranteed results.
            </p>
          </div>
          <div className="calc-grid">
            <label>Active community size<input type="number" value={calc.activePlayers} onChange={updateCalc('activePlayers')} /></label>
            <label>Subscriber conversion %<input type="number" value={calc.subscriberConversion} onChange={updateCalc('subscriberConversion')} /></label>
            <label>Monthly sub price<input type="number" value={calc.subscriptionPrice} onChange={updateCalc('subscriptionPrice')} /></label>
            <label>One-time orders/mo<input type="number" value={calc.oneTimeOrders} onChange={updateCalc('oneTimeOrders')} /></label>
            <label>One-time pack price<input type="number" value={calc.oneTimePrice} onChange={updateCalc('oneTimePrice')} /></label>
            <label>Service orders/mo<input type="number" value={calc.serviceOrders} onChange={updateCalc('serviceOrders')} /></label>
            <label>Avg service price<input type="number" value={calc.servicePrice} onChange={updateCalc('servicePrice')} /></label>
          </div>
          <div className="metric-grid">
            <div><span>Estimated subscribers</span><strong>{totals.subscribers}</strong></div>
            <div><span>Subscription MRR</span><strong>{money(totals.subscriptionMrr)}</strong></div>
            <div><span>Template revenue</span><strong>{money(totals.oneTimeRevenue)}</strong></div>
            <div><span>Service revenue</span><strong>{money(totals.serviceRevenue)}</strong></div>
            <div className="total"><span>Total monthly target</span><strong>{money(totals.monthlyTotal)}</strong></div>
          </div>
        </div>
      )}

      {activeTab === 'youtube' && (
        <div className="deep-product-grid">
          {youtubeAngles.map((angle) => (
            <article className="deep-product-card deep-content-card" key={angle.angle}>
              <p className="eyebrow">Faceless content angle</p>
              <h3>{angle.angle}</h3>
              <p>{angle.lesson}</p>
              <ul>
                {angle.scripts.map((script) => <li key={script}>{script}</li>)}
              </ul>
            </article>
          ))}
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="gmt-panel">
          <p className="eyebrow">Keep the money clean</p>
          <h2>Legal-safe selling rules</h2>
          <div className="rules-list">
            {complianceRules.map((rule, index) => (
              <div key={rule} className="rule-item"><strong>{index + 1}</strong><span>{rule}</span></div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
