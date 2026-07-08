import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';
import Parser from 'rss-parser';
import { rockstarMediaCatalog } from '../src/data/rockstarMediaCatalog.js';

const OUT_FILE = path.resolve('public/data/gta-news.json');
const USER_AGENT = 'GTA Money Team News Scraper/1.0 (+https://github.com/luxautomaton-ux/GTAMT)';

const SOURCE_FEEDS = [
  {
    id: 'take-two-ir',
    name: 'Take-Two Investor Relations',
    url: 'https://ir.take2games.com/rss/news-releases.xml',
    type: 'official',
  },
  {
    id: 'the-verge-games',
    name: 'The Verge Gaming',
    url: 'https://www.theverge.com/rss/games/index.xml',
    type: 'publisher',
  },
  {
    id: 'pc-gamer',
    name: 'PC Gamer',
    url: 'https://www.pcgamer.com/rss/',
    type: 'publisher',
  },
  {
    id: 'gamesradar',
    name: 'GamesRadar+',
    url: 'https://www.gamesradar.com/rss/',
    type: 'publisher',
  },
  {
    id: 'eurogamer',
    name: 'Eurogamer',
    url: 'https://www.eurogamer.net/feed',
    type: 'publisher',
  },
  {
    id: 'vg247',
    name: 'VG247',
    url: 'https://www.vg247.com/feed',
    type: 'publisher',
  },
];

const KEYWORDS = [
  'gta 6',
  'gta vi',
  'grand theft auto vi',
  'grand theft auto 6',
  'grand theft auto six',
  'rockstar games',
  'rockstar',
  'take-two',
  'take two',
  'fivem',
  'cfx.re',
];

const fallbackImages = [
  rockstarMediaCatalog.videos[1]?.poster,
  rockstarMediaCatalog.videos[0]?.poster,
  rockstarMediaCatalog.videos[10]?.poster,
  ...rockstarMediaCatalog.screenshots.slice(0, 10).map((item) => item.url),
  './images/gta-money-team-city-billboard-backdrop.png',
  './images/gta-money-team-brand-backdrop.png',
].filter(Boolean);

const featuredVideos = [
  rockstarMediaCatalog.videos.find((video) => video.title === 'Grand Theft Auto VI Trailer 2'),
  rockstarMediaCatalog.videos.find((video) => video.title === 'Grand Theft Auto VI Trailer 1'),
  rockstarMediaCatalog.videos.find((video) => video.title === 'Official Cover Art Animation'),
  ...rockstarMediaCatalog.videos.filter((video) => !video.title.includes('Trailer') && video.title !== 'Official Cover Art Animation'),
].filter(Boolean).slice(0, 5);

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: true }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: true }],
      ['dc:creator', 'creator'],
      ['content:encoded', 'encodedContent'],
    ],
  },
});

function cleanText(value = '') {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&rsquo;/gi, "'")
    .replace(/&lsquo;/gi, "'")
    .replace(/&ldquo;/gi, '"')
    .replace(/&rdquo;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalized(value = '') {
  return cleanText(value).toLowerCase();
}

function isRelevant(itemText) {
  const text = normalized(itemText);
  return KEYWORDS.some((keyword) => text.includes(keyword));
}

function classifyItem(title, excerpt, source) {
  const text = normalized(`${title} ${excerpt}`);
  if (source.type === 'official' || text.includes('rockstar games announces')) return 'Official';
  if (text.includes('pre-order') || text.includes('preorder') || text.includes('price') || text.includes('edition')) return 'Launch Commerce';
  if (text.includes('trailer') || text.includes('screenshot') || text.includes('cover art') || text.includes('media')) return 'Media Watch';
  if (text.includes('scam') || text.includes('fake') || text.includes('leak') || text.includes('rumour') || text.includes('rumor')) return 'Verify First';
  if (text.includes('take-two') || text.includes('investor') || text.includes('earnings') || text.includes('stock')) return 'Investor Radar';
  if (text.includes('fivem') || text.includes('cfx')) return 'Server Ops';
  return 'News';
}

function moneyAngleFor(category) {
  const angles = {
    Official: 'Turn this into a member source-of-truth brief before building routes, preorder explainers, or course updates.',
    'Launch Commerce': 'Use this for legal preorder guides, affiliate shopping comparisons, and launch-week buyer education.',
    'Media Watch': 'Convert the media beat into trailer breakdowns, thumbnails, short-form hooks, and Media Vault study notes.',
    'Verify First': 'Use this as a scam/firewall lesson: verify the claim, avoid leaks, and teach members source discipline.',
    'Investor Radar': 'Add it to the TTWO catalyst log as education only: source, date, market context, and no buy/sell signal.',
    'Server Ops': 'Turn the update into FiveM/server-owner education around legal setup, safety, and monetization rules.',
    News: 'Brief the crew on what changed, what is official, and what content or training update should ship next.',
  };

  return angles[category] || angles.News;
}

function imageFromItem(item) {
  const mediaContent = Array.isArray(item.mediaContent) ? item.mediaContent[0] : item.mediaContent;
  const mediaThumbnail = Array.isArray(item.mediaThumbnail) ? item.mediaThumbnail[0] : item.mediaThumbnail;
  const enclosure = item.enclosure || {};
  const html = item.encodedContent || item.content || item['content:encoded'] || item.description || '';
  const imgMatch = String(html).match(/<img[^>]+src=["']([^"']+)["']/i);
  const candidates = [
    mediaContent?.$?.url,
    mediaContent?.url,
    mediaThumbnail?.$?.url,
    mediaThumbnail?.url,
    enclosure.type?.startsWith('image/') ? enclosure.url : null,
    imgMatch?.[1],
  ];

  return candidates.find(Boolean)?.replace(/&amp;/g, '&') || null;
}

async function fetchText(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        accept: 'application/rss+xml, application/atom+xml, text/xml, text/html;q=0.8, */*;q=0.5',
        'user-agent': USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

function sourceUrlFor(item, feedSource) {
  if (item.link) {
    try {
      const parsed = new URL(item.link);
      return parsed.origin;
    } catch {
      return feedSource.url;
    }
  }

  return feedSource.url;
}

function itemId(sourceId, title, link) {
  const digest = crypto.createHash('sha1').update(`${title}-${link}`).digest('hex').slice(0, 14);
  return `${sourceId}-${digest}`;
}

async function parseFeed(feedSource, imageOffset = 0) {
  const xml = await fetchText(feedSource.url);
  const feed = await parser.parseString(xml);
  const items = [];

  for (const [index, item] of (feed.items || []).entries()) {
    const title = cleanText(item.title);
    const rawExcerpt = item.contentSnippet || item.description || item.content || item.encodedContent || '';
    const excerpt = cleanText(rawExcerpt).replace(/\s*Read more\s*$/i, '').slice(0, 260);
    const categories = Array.isArray(item.categories) ? item.categories.join(' ') : '';
    const searchText = `${title} ${excerpt} ${categories}`;

    if (!title || !isRelevant(searchText)) continue;

    const category = classifyItem(title, excerpt, feedSource);
    const publishedAt = new Date(item.isoDate || item.pubDate || Date.now()).toISOString();
    const image = imageFromItem(item) || fallbackImages[(imageOffset + index) % fallbackImages.length];
    const link = item.link || item.guid || feedSource.url;

    items.push({
      id: itemId(feedSource.id, title, link),
      title,
      excerpt,
      url: link,
      source: feedSource.name,
      sourceUrl: sourceUrlFor(item, feedSource),
      sourceType: feedSource.type,
      publishedAt,
      image,
      category,
      riskFlag: category === 'Verify First',
      moneyAngle: moneyAngleFor(category),
    });
  }

  return items;
}

function officialWatchlist() {
  const trailer = rockstarMediaCatalog.videos.find((item) => item.title.includes('Trailer 2')) || rockstarMediaCatalog.videos[0];

  return [
    {
      id: 'rockstar-vi-hub',
      title: 'Grand Theft Auto VI Official Hub',
      source: 'Rockstar Games',
      url: 'https://www.rockstargames.com/VI',
      image: 'https://www.rockstargames.com/VI/-/opengraph-image.jpg?opengraph-image.0t8ty~nlmxq2s.jpg',
      note: 'Use as the first source before teaching release, edition, platform, or story claims.',
    },
    {
      id: 'rockstar-media-hub',
      title: 'Official GTA VI Media Hub',
      source: 'Rockstar Games',
      url: rockstarMediaCatalog.source,
      image: trailer.poster,
      note: 'Approved public videos, screenshots, artwork, and download packs for media study.',
    },
    {
      id: 'take-two-ir-feed',
      title: 'Take-Two News Releases',
      source: 'Take-Two Interactive',
      url: SOURCE_FEEDS[0].url,
      image: rockstarMediaCatalog.screenshots[3]?.url || fallbackImages[0],
      note: 'Use for investor literacy, earnings catalysts, and official corporate announcements.',
    },
  ];
}

function fallbackItems() {
  return officialWatchlist().map((item, index) => {
    const category = index === 2 ? 'Investor Radar' : 'Official';
    return {
      id: `${item.id}-fallback`,
      title: item.title,
      excerpt: item.note,
      url: item.url,
      source: item.source,
      sourceUrl: item.url,
      sourceType: 'official',
      publishedAt: new Date().toISOString(),
      image: item.image,
      category,
      riskFlag: false,
      moneyAngle: moneyAngleFor(category),
    };
  });
}

async function main() {
  const settled = await Promise.allSettled(
    SOURCE_FEEDS.map((source, index) => parseFeed(source, index * 3)),
  );

  const feedErrors = settled
    .map((result, index) => (result.status === 'rejected' ? {
      source: SOURCE_FEEDS[index].name,
      message: result.reason?.message || 'Unknown feed error',
    } : null))
    .filter(Boolean);

  const deduped = new Map();
  for (const item of settled.flatMap((result) => (result.status === 'fulfilled' ? result.value : []))) {
    const key = normalized(item.url || item.title);
    if (!deduped.has(key)) deduped.set(key, item);
  }

  const items = [...deduped.values()]
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 28);

  const payload = {
    generatedAt: new Date().toISOString(),
    sourceMode: 'Build-time RSS scraper for static GitHub Pages.',
    rightsNote: 'Attribution-only feed: titles, short excerpts, source labels, links, and available media thumbnails. GTA Money Team does not republish full articles.',
    sources: SOURCE_FEEDS,
    feedErrors,
    officialWatchlist: officialWatchlist(),
    items: items.length ? items : fallbackItems(),
    videos: featuredVideos.map((video) => ({
      id: video.id,
      title: video.title,
      category: video.category,
      poster: video.poster,
      video: video.video,
      youtubeUrl: video.youtubeUrl,
      youtubeEmbed: video.youtubeEmbed,
      description: video.description,
      sourcePage: video.sourcePage,
    })),
  };

  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  await fs.writeFile(OUT_FILE, `${JSON.stringify(payload, null, 2)}\n`);

  console.log(`Wrote ${payload.items.length} GTA news items to ${OUT_FILE}`);
  if (feedErrors.length) {
    console.warn('Feed warnings:', feedErrors);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
