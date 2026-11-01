// On install/update, merge any new default keywords into the saved list,
// so updating the extension never needs a manual "Restore defaults".
browser.runtime.onInstalled.addListener(async () => {
  const { keywords } = await browser.storage.local.get("keywords");
  if (!Array.isArray(keywords)) return; // never saved: content.js already uses the defaults
  const merged = [...new Set([...keywords, ...DEFAULT_KEYWORDS])];
  if (merged.length !== keywords.length) await browser.storage.local.set({ keywords: merged });
});
