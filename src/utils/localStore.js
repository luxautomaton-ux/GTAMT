const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
};

export const loadLeads = () => readJson('gtaMoneyTeamRequests', []);

export const saveLead = (lead) => {
  const next = [lead, ...loadLeads()].slice(0, 100);
  localStorage.setItem('gtaMoneyTeamRequests', JSON.stringify(next));
  return next;
};

export const loadMembership = () => readJson('gtaMoneyTeamMembership', { tier: 'Free' });

export const saveMembership = (tier) => {
  const membership = { tier, updatedAt: new Date().toISOString() };
  localStorage.setItem('gtaMoneyTeamMembership', JSON.stringify(membership));
  return membership;
};

const csvCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

export const leadsToCsv = (leads) => {
  const headers = ['createdAt', 'service', 'contact', 'budget', 'details', 'status'];
  const rows = leads.map((lead) => headers.map((key) => csvCell(lead[key])).join(','));
  return [headers.join(','), ...rows].join('\n');
};
