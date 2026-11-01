// Hides x.com posts/replies whose text contains any blocked keyword.

let keywords = [];
let enabled = true;
let wholeWord = false;
let matcher = null;

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildMatcher() {
  const list = keywords.map((k) => k.trim()).filter(Boolean);
  if (!list.length) {
    matcher = null;
    return;
  }
  // A keyword wrapped in "quotes" matches only as a whole word (plural s/es allowed),
  // so "cow" blocks "cows" but not "Moscow" or "coward".
  const parts = list.map((k) => {
    const quoted = /^".+"$/.test(k);
    const word = escapeRegex(quoted ? k.slice(1, -1) : k);
    return quoted || wholeWord ? `(?<![\\p{L}\\p{N}_])${word}(?:e?s)?(?![\\p{L}\\p{N}_])` : word;
  });
  matcher = new RegExp(parts.join("|"), "iu");
}

// The unit to hide: the timeline cell wrapping the tweet, so no empty gap is left.
function containerOf(article) {
  return article.closest('[data-testid="cellInnerDiv"]') || article;
}

// Post text, plus quoted posts, card titles and the author name/handle.
// Built from text nodes (not innerText) so the result is the same whether the
// post is visible or hidden; otherwise hiding a post can change its text and
// make it flip between shown and hidden every frame.
function textOf(article) {
  const parts = [];
  const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) parts.push(walker.currentNode.nodeValue);
  return parts.join(" ");
}

// Hidden via an attribute + stylesheet rule, so X's own re-renders of the
// element's inline style can't undo it.
const style = document.createElement("style");
style.textContent = '[data-xkb-hidden="1"] { display: none !important; }';
(document.head || document.documentElement).appendChild(style);

function checkArticle(article) {
  const box = containerOf(article);
  if (isBlocked(article)) {
    if (box.dataset.xkbHidden !== "1") box.dataset.xkbHidden = "1";
  } else if (box.dataset.xkbHidden === "1") {
    delete box.dataset.xkbHidden;
  }
}

function isBlocked(article) {
  return enabled && matcher && matcher.test(textOf(article));
}

// On a post's own page (/user/status/ID), the main post is the article whose
// timestamp links to that ID. If it matches, the whole conversation is hidden.
function focalArticle() {
  const m = location.pathname.match(/\/status\/(\d+)/);
  if (!m) return null;
  for (const time of document.querySelectorAll(`article a[href*="/status/${m[1]}"] time`)) {
    const href = time.closest("a").getAttribute("href");
    if (/\/status\/(\d+)\/?$/.exec(href)?.[1] === m[1]) return time.closest("article");
  }
  return null;
}

function setConversationHidden(hidden) {
  const timeline = document.querySelector('[data-testid="primaryColumn"] section');
  let notice = document.getElementById("xkb-notice");
  if (!timeline) return;
  if (hidden) {
    timeline.dataset.xkbHidden = "1";
    if (!notice) {
      notice = document.createElement("div");
      notice.id = "xkb-notice";
      notice.textContent = "This post and its replies were hidden by X Keyword Blocker.";
      notice.style.cssText = "padding:24px 16px;color:#71767b;font:15px system-ui,sans-serif;text-align:center;";
      timeline.parentNode.insertBefore(notice, timeline);
    }
  } else {
    if (timeline.dataset.xkbHidden === "1") delete timeline.dataset.xkbHidden;
    notice?.remove();
  }
}

function scan(root = document) {
  const focal = focalArticle();
  setConversationHidden(!!(focal && isBlocked(focal)));
  // Each post/reply is checked on its own: hateful replies vanish, clean ones stay.
  root.querySelectorAll('article[data-testid="tweet"], article[role="article"]').forEach(checkArticle);
  // X reuses timeline cells for other posts; un-hide a cell whose post is gone.
  root.querySelectorAll('[data-testid="cellInnerDiv"][data-xkb-hidden="1"]').forEach((cell) => {
    if (!cell.querySelector("article")) delete cell.dataset.xkbHidden;
  });
}

let pending = false;
function scheduleScan() {
  if (pending) return;
  pending = true;
  requestAnimationFrame(() => {
    pending = false;
    scan();
  });
}

new MutationObserver(scheduleScan).observe(document.documentElement, {
  childList: true,
  subtree: true,
});

function load() {
  browser.storage.local.get({ keywords: DEFAULT_KEYWORDS, enabled: true, wholeWord: false }).then((data) => {
    keywords = data.keywords;
    enabled = data.enabled;
    wholeWord = data.wholeWord;
    buildMatcher();
    scan();
  });
}

browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local") load();
});

load();
