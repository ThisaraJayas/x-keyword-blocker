const $ = (id) => document.getElementById(id);

$("defaults").addEventListener("click", () => {
  const current = $("keywords").value.split("\n").map((k) => k.trim()).filter(Boolean);
  $("keywords").value = [...new Set([...current, ...DEFAULT_KEYWORDS])].join("\n");
  $("status").textContent = "Defaults added — click Save";
});

browser.storage.local.get({ keywords: DEFAULT_KEYWORDS, enabled: true, wholeWord: false }).then((data) => {
  $("keywords").value = data.keywords.join("\n");
  $("enabled").checked = data.enabled;
  $("wholeWord").checked = data.wholeWord;
});

$("save").addEventListener("click", () => {
  const keywords = [...new Set(
    $("keywords").value.split("\n").map((k) => k.trim()).filter(Boolean)
  )];
  browser.storage.local
    .set({ keywords, enabled: $("enabled").checked, wholeWord: $("wholeWord").checked })
    .then(() => {
      $("keywords").value = keywords.join("\n");
      $("status").textContent = `Saved ${keywords.length} keyword(s)`;
      setTimeout(() => ($("status").textContent = ""), 2000);
    });
});
