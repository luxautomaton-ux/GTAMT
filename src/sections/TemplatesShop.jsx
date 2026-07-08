import { useState } from 'react';
import { templatesList } from '../constants/templatesData';
import { paymentLinks } from '../data/paymentConfig';

function PaymentLinkButton({ paymentKey, variant = 'default' }) {
  const link = paymentLinks[paymentKey];

  if (!link) return null;

  const compact = variant === 'compact';

  return (
    <a
      href={link.url}
      className={`payment-link ${compact ? 'payment-link-compact' : 'mt-3'}`}
      onClick={(event) => {
        if (link.url.startsWith('#')) {
          event.preventDefault();
          window.dispatchEvent(new CustomEvent('gmt:checkout', { detail: { paymentKey } }));
        }
      }}
    >
      <span>{compact ? 'Add to Cart' : link.label}</span>
      {!compact && <strong>{link.price}</strong>}
      <small>{compact ? '+' : 'Member access'}</small>
    </a>
  );
}

const categoryPaymentKeys = {
  Cars: 'carPack',
  Server: 'basicTemplate',
  Creator: 'obsPack',
  Player: 'premiumMonthly',
  Investor: 'premiumMonthly',
  'City Packs': 'cityPack',
};

const storeFeatures = [
  ['Legal & Ethical', '100% compliant'],
  ['Instant Access', 'Download & use'],
  ['Expert Built', 'Proven strategies'],
  ['Member Pricing', 'Exclusive discounts'],
];

const productLabels = {
  'neon-garage-starter': 'Starter Pack',
  'rp-dealership-launch-kit': 'Launch Kit',
  'supercar-route-photo-pack': 'Photo Pack',
  'crew-garage-economy': 'Blueprint',
  'legal-route-sprint': 'Planner',
  'crew-payout-ledger': 'Template',
  'launch-week-content-map': 'Content Map',
  'obs-rp-scenes': 'Checklist',
  'qbcore-server-starter': 'Server Pack',
  'discord-rp-template': 'Community Kit',
  'script-audit-report': 'Audit Report',
  'ttwo-research-log': 'Investor Log',
};

const productPaymentKey = (template) => (
  template.paymentKey || (template.id === 'rp-dealership-launch-kit' ? 'dealershipKit' : categoryPaymentKeys[template.category])
);

const productLabel = (template) => template.commerceLabel || productLabels[template.id] || (template.cityPack ? 'City Pack' : template.category);

const cleanStorePhotos = {
  Cars: './images/lana-night-car2.jpg',
  Player: './assets/gmt-brand/lana-day-route.png',
  Creator: './assets/gmt-brand/lana-day-studio.png',
  Server: './assets/server-forge/server-forge-security.png',
  Investor: './assets/gmt-brand/lana-day-investor.png',
};

const cleanCommercePhotos = [
  './assets/server-forge/server-forge-hero.png',
  './assets/server-forge/server-forge-monetization.png',
  './assets/server-forge/server-forge-community.png',
  './assets/server-forge/server-forge-security.png',
];

const cleanCityPackPhotos = [
  './images/lana-marina-heli.jpg',
  './assets/gmt-brand/gmt-team-day-marina.png',
  './assets/gmt-brand/lana-day-marina.png',
  './images/lana-night-car3.jpg',
  './assets/server-forge/server-forge-community.png',
  './assets/server-forge/server-forge-hero.png',
];

const photoIndexFor = (id, total) => [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % total;

const cleanProductPhoto = (template) => {
  if (template.cityPack) return cleanCityPackPhotos[photoIndexFor(template.id, cleanCityPackPhotos.length)];
  if (template.commerceKit) {
    return cleanCommercePhotos[photoIndexFor(template.id, cleanCommercePhotos.length)];
  }
  return cleanStorePhotos[template.category] || template.image;
};

const handleProductImageError = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = './assets/server-forge/server-forge-hero.png';
};

const categoryBlueprints = {
  Cars: {
    bestFor: 'Car meet hosts, garage brands, RP vehicle businesses',
    setupTime: '45-120 min',
    outcome: 'Turn vehicle culture into a clean offer people understand and pay for.',
    skillLevel: 'Beginner friendly',
    serviceUpsell: 'Lux can build the flyer, Discord channels, checkout copy, and launch posts.',
    lanaPrompt: 'Ask Lana to price my car offer and write the launch announcement.',
  },
  Player: {
    bestFor: 'Players, crews, route leaders, weekly grind teams',
    setupTime: '20-60 min',
    outcome: 'Replace random sessions with a repeatable legal money plan and tracked results.',
    skillLevel: 'Fast setup',
    serviceUpsell: 'Lux can customize your weekly route plan, payout rules, and crew dashboard.',
    lanaPrompt: 'Ask Lana to build my weekly route schedule and crew payout rules.',
  },
  Creator: {
    bestFor: 'Streamers, Shorts creators, YouTube channels, clip editors',
    setupTime: '60-90 min',
    outcome: 'Turn GTA 6 attention into content, subscribers, product clicks, and service leads.',
    skillLevel: 'Creator ready',
    serviceUpsell: 'Lux can create branded overlays, thumbnails, post captions, and funnel pages.',
    lanaPrompt: 'Ask Lana to turn this into a 7-day content plan with CTAs.',
  },
  Server: {
    bestFor: 'Server owners, RP admins, community operators, Discord teams',
    setupTime: '2-6 hours',
    outcome: 'Launch cleaner server systems with roles, setup steps, docs, and support flows.',
    skillLevel: 'Operator level',
    serviceUpsell: 'Lux can configure the Discord/server docs, audit risks, and package the offer.',
    lanaPrompt: 'Ask Lana to turn this product into a server launch checklist.',
  },
  Investor: {
    bestFor: 'Market watchers, creators covering TTWO, business-minded members',
    setupTime: '30-45 min',
    outcome: 'Study public information clearly without hype, scam coins, or fake investment claims.',
    skillLevel: 'Research focused',
    serviceUpsell: 'Lux can build a watchlist dashboard, news brief, and affiliate-safe research page.',
    lanaPrompt: 'Ask Lana to summarize the latest public signals and risks.',
  },
  'City Packs': {
    bestFor: 'FiveM RP server owners, Discord operators, custom city builders',
    setupTime: '2-8 hours',
    outcome: 'Launch a sellable FiveM city identity without inventing every district, role, payout, and sales page from zero.',
    skillLevel: 'Server operator',
    serviceUpsell: 'Lux can install the city pack, build the Discord, connect txAdmin notes, and package a higher-ticket city offer.',
    lanaPrompt: 'Ask Lana to turn this city pack into a launch plan, Discord rollout, and paid setup offer.',
  },
};

const TemplatesShop = () => {
  const [filter, setFilter] = useState('All');
  const [activeProduct, setActiveProduct] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [premium, setPremium] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('gtaMoneyTeamMembership') || '{}').tier === 'Premium';
    } catch {
      return false;
    }
  });

  const categories = ['All', 'Commerce Kit', 'City Packs', 'Cars', 'Player', 'Creator', 'Server', 'Investor'];
  const filteredTemplates = filter === 'All'
    ? templatesList
    : filter === 'Commerce Kit'
      ? templatesList.filter((template) => template.commerceKit)
      : templatesList.filter((template) => template.category === filter);
  const relatedProducts = activeProduct
    ? templatesList.filter((template) => template.category === activeProduct.category && template.id !== activeProduct.id).slice(0, 3)
    : [];

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1500);
  };

  const openProduct = (product) => {
    setActiveProduct(product);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  };

  const unlockPremium = () => {
    localStorage.setItem('gtaMoneyTeamMembership', JSON.stringify({ tier: 'Premium', updatedAt: new Date().toISOString() }));
    setPremium(true);
  };

  if (activeProduct) {
    const blueprint = categoryBlueprints[activeProduct.category] || categoryBlueprints.Player;
    const launchStack = [
      ['Audience', blueprint.bestFor],
      ['Setup Time', blueprint.setupTime],
      ['Skill Level', blueprint.skillLevel],
      ['Delivery', activeProduct.delivery],
    ];
    const valueCards = [
      ['Buyer Outcome', blueprint.outcome],
      ['What You Receive', activeProduct.includes?.slice(0, 3).join(' + ')],
      ['Lux Service Upsell', blueprint.serviceUpsell],
      ['Lana Coach Prompt', blueprint.lanaPrompt],
    ];
    const cityPackSections = activeProduct.cityPack
      ? [
        ['City Landmarks', activeProduct.cityPack.landmarks],
        ['Districts / Streets', activeProduct.cityPack.streets],
        ['Fictional Factions', activeProduct.cityPack.gangs],
        ['Legal Money Loops', activeProduct.cityPack.money],
        ['Crew Payout Split', activeProduct.cityPack.payouts],
        ['Discord Channels', activeProduct.cityPack.channels.map((channel) => `#${channel}`)],
        ['Discord Roles', activeProduct.cityPack.roles],
        ['Weather Rotation', activeProduct.cityPack.weather],
        ['Police Fleet Planning', activeProduct.cityPack.police],
      ]
      : [];
    const commerceSections = activeProduct.commerceKit
      ? [
        ['Buyer', [activeProduct.buyer]],
        ['Premium Deliverables', activeProduct.deliverables],
        ['Money Levers', activeProduct.moneyLevers],
        ['Security / Trust Guardrails', activeProduct.security],
        ['Upsells', activeProduct.upsells],
        ['Compliance Note', [activeProduct.legalNotes]],
      ]
      : [];

    return (
      <div className="templates-shop-page product-detail-view w-full text-left">
        <button onClick={() => setActiveProduct(null)} className="store-back-button">Back To Store</button>
        <div className="product-page">
          <div className="product-hero-photo">
            <img src={cleanProductPhoto(activeProduct)} alt={`${activeProduct.title} product photo`} onError={handleProductImageError} />
          </div>
          <div className="product-detail-panel">
            <span className="product-kicker">{activeProduct.category} product / GTA Money Team</span>
            <h1 className="font-round-bold uppercase text-white">{activeProduct.title}</h1>
            <strong className="product-subtitle">{activeProduct.subtitle}</strong>
            <p className="product-lede">{activeProduct.description}</p>
            <div className="product-launch-stack">
              {launchStack.map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <div className="product-price-row">
              <span>{activeProduct.price}</span>
              <PaymentLinkButton paymentKey={productPaymentKey(activeProduct)} />
            </div>
            <div className="product-detail-actions">
              <button
                onClick={() => handleCopy(activeProduct.content, activeProduct.id)}
                className="product-copy-button"
              >
                {copiedId === activeProduct.id ? 'Copied Notes' : 'Copy Product Notes'}
              </button>
              <span>Instant member access after checkout. No cheats, no exploits, no account-risk shortcuts.</span>
            </div>
          </div>
        </div>

        <div className="product-value-grid">
          {valueCards.map(([title, text]) => (
            <section key={title}>
              <span>{title}</span>
              <p>{text}</p>
            </section>
          ))}
        </div>

        <div className="product-section-grid">
          {[
            ['What It Is', activeProduct.whatItIs],
            ['How It Works', activeProduct.howItWorks],
          ].map(([title, text]) => (
            <section key={title} className="product-guide-panel product-guide-panel-wide">
              <span className="font-mono text-cyan text-[10px] uppercase">{title}</span>
              <p>{text}</p>
            </section>
          ))}
          <section className="product-guide-panel">
            <span className="font-mono text-cyan text-[10px] uppercase">How To Install</span>
            <ol>
              {(activeProduct.howToInstall || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>
          <section className="product-guide-panel">
            <span className="font-mono text-cyan text-[10px] uppercase">How To Make Money With It</span>
            <ul>
              {(activeProduct.howToMakeMoney || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          {cityPackSections.map(([title, items]) => (
            <section key={title}>
              <span className="font-mono text-cyan text-[10px] uppercase">{title}</span>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
          {commerceSections.map(([title, items]) => (
            <section key={title}>
              <span className="font-mono text-cyan text-[10px] uppercase">{title}</span>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
          <section>
            <span className="font-mono text-cyan text-[10px] uppercase">Best Use Cases</span>
            <ul>
              {(activeProduct.cardHighlights || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <span className="font-mono text-cyan text-[10px] uppercase">Included</span>
            <ul>
              {(activeProduct.includes || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <span className="font-mono text-cyan text-[10px] uppercase">Delivery</span>
            <p>{activeProduct.delivery}</p>
          </section>
          <section>
            <span className="font-mono text-cyan text-[10px] uppercase">Legal Promise</span>
            <p>No cheats, exploit tools, stolen assets, fake coins, or account-risk shortcuts. This is strategy, templates, and fulfillment.</p>
          </section>
          <section>
            <span className="font-mono text-cyan text-[10px] uppercase">Member Next Step</span>
            <p>Open Lana Coach after checkout and paste this product name. Lana will help turn it into a weekly action plan, launch post, route checklist, or service offer.</p>
          </section>
        </div>

        <div className="product-preview">
          <span className="font-mono text-yellow text-[10px] uppercase">Product Preview</span>
          <pre>{activeProduct.content}</pre>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-10">
            <span className="font-mono text-pink text-xs uppercase block mb-4">Related {activeProduct.category} Products</span>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map((product) => (
                <button key={product.id} onClick={() => openProduct(product)} className="related-product-card">
                  <img src={cleanProductPhoto(product)} alt={`${product.title} product photo`} onError={handleProductImageError} />
                  <strong>{product.title}</strong>
                  <span>{product.price}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="templates-shop-page w-full text-left">
      <div className="store-front-header">
        <div className="store-title-lockup">
          <div className="store-bag-mark" aria-hidden="true" />
          <div>
            <h1 className="font-round-bold uppercase text-white">GTA Money Team <span>Store</span></h1>
            <p>Premium tools, templates, and systems to build, automate, and scale your legal money empire.</p>
          </div>
        </div>
        <div className="store-feature-strip">
          {storeFeatures.map(([title, copy]) => (
            <div key={title} className="store-feature-pill">
              <i aria-hidden="true" />
              <strong>{title}</strong>
              <span>{copy}</span>
            </div>
          ))}
        </div>
        <div className="store-credit-card">
          <span>Member Balance</span>
          <strong>2,480</strong>
          <small>Credits</small>
        </div>
      </div>

      {!premium && (
        <div className="premium-gate mb-8">
          <span className="font-mono text-pink text-xs uppercase block mb-3">// Workshop Access</span>
          <strong>Unlock the template vault</strong>
          <p>Browse the products now. Join the workshop to unlock downloads, member pricing, premium build guides, and Lana-powered action plans.</p>
          <div className="gate-actions">
            <PaymentLinkButton paymentKey="premiumMonthly" />
            <button onClick={unlockPremium}>Activate Member Access</button>
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 border rounded font-semibold text-xs uppercase transition duration-300 cursor-pointer ${filter === category ? 'bg-yellow text-black border-yellow' : 'bg-black border-white/20 text-white hover:bg-white/5'}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="store-grid">
        {filteredTemplates.map((template) => {
          const features = (template.includes?.length ? template.includes : template.cardHighlights).slice(0, 4);
          return (
            <div
              key={template.id}
              className="store-product-card hover-glow"
              data-category={template.commerceKit ? 'commerce kit' : template.category.toLowerCase()}
            >
              <button onClick={() => openProduct(template)} className="store-photo-button">
                <img src={cleanProductPhoto(template)} alt={`${template.title} product photo`} onError={handleProductImageError} />
              </button>
              <div className="store-product-body">
                <div className="store-title-row">
                  <button onClick={() => openProduct(template)} className="store-title-button">
                    {template.title}
                  </button>
                  <strong>{template.price}</strong>
                </div>
                <p>{template.description}</p>
                <div className="store-card-feature-row">
                  {features.map((feature) => (
                    <span key={feature}>{feature}</span>
                  ))}
                </div>
                <div className="store-card-actions">
                  <button
                    onClick={() => openProduct(template)}
                    className="product-view-button"
                  >
                    View Details
                  </button>
                  <PaymentLinkButton paymentKey={productPaymentKey(template)} variant="compact" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="store-value-footer">
        <div><strong>Built By Experts</strong><span>Systems used by top legal money makers.</span></div>
        <div><strong>Save Time</strong><span>Plug-and-play templates and systems.</span></div>
        <div><strong>Grow Faster</strong><span>Proven tools to scale your brand and income.</span></div>
        <div><strong>New products added weekly</strong><span>Stay ahead, compliant, and ready.</span></div>
      </div>
    </div>
  );
};

export default TemplatesShop;
