const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
};

export const loadOrders = () => readJson('gtaMoneyTeamOrders', []);
export const loadTasks = () => readJson('gtaMoneyTeamTasks', []);
export const loadCampaigns = () => readJson('gtaMoneyTeamCampaigns', []);

export const saveOrder = (order) => writeJson('gtaMoneyTeamOrders', [order, ...loadOrders()].slice(0, 100));
export const saveTask = (task) => writeJson('gtaMoneyTeamTasks', [task, ...loadTasks()].slice(0, 100));
export const saveCampaign = (campaign) => writeJson('gtaMoneyTeamCampaigns', [campaign, ...loadCampaigns()].slice(0, 50));

export const activateMember = (code) => {
  const normalized = code.trim().toUpperCase();
  const tier = normalized === 'GMT-PREMIUM-LUX' ? 'Premium' : normalized === 'GMT-LAUNCH-LUX' ? 'Launch-Ready' : null;

  if (!tier) return null;

  const membership = {
    tier,
    code: normalized,
    status: 'active',
    activatedAt: new Date().toISOString(),
  };
  localStorage.setItem('gtaMoneyTeamMembership', JSON.stringify(membership));
  return membership;
};

export const recordCheckoutReturn = ({ product, provider = 'Hosted Link' }) => {
  const order = {
    id: `GMT-${Date.now()}`,
    product,
    provider,
    status: 'paid-demo',
    createdAt: new Date().toISOString(),
  };
  saveOrder(order);
  return order;
};

const csvCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

export const toCsv = (rows, headers) => [headers.join(','), ...rows.map((row) => headers.map((key) => csvCell(row[key])).join(','))].join('\n');
