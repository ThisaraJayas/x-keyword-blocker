# X Keyword Blocker: mute words and hide posts on X (Twitter) in Firefox

**A free, open-source Firefox extension that hides posts and replies on X (formerly Twitter) containing words you choose.** It gives you a cleaner, calmer timeline without leaving the site.

![Firefox](https://img.shields.io/badge/Firefox-109%2B-FF7139?logo=firefoxbrowser&logoColor=white)
![Manifest](https://img.shields.io/badge/WebExtension-MV2-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![No tracking](https://img.shields.io/badge/tracking-none-brightgreen)

---

## 💡 Use it to hide

- 🛑 **Hate speech, slurs and abusive replies**
- 🤬 **Toxic comment sections and trolls**
- 📢 **Spam, scams and crypto shilling**
- 🎬 **Spoilers** for shows, films, sports and games
- 🗳 **Politics or any topic** you need a break from

## ✨ Features

- 🚫 **Hides matching posts on X / Twitter.** Works in the home feed, search, profiles, notifications and post pages.
- 💬 **Comment filtering.** On a normal post, only the matching replies disappear and the rest of the conversation stays visible.
- 🧹 **Whole-thread hiding.** If the post itself matches, the post **and all of its replies** are hidden.
- 📝 **Custom keyword list.** Add or remove words and phrases from the toolbar popup.
- 🎯 **Whole-word matching.** Write `"cat"` (with quotes) to block "cat" and "cats" but not "category".
- ⚡ **Live updates.** New posts are checked as you scroll, and keyword changes apply instantly.
- 🔒 **100% private.** No servers, no analytics, no tracking. Everything stays in your browser.
- 🪶 **Tiny.** A few kilobytes of plain JavaScript with no dependencies.

## 📥 Install

### Option 1: Load from source (quickest)

1. [Download this repository as a ZIP](../../archive/refs/heads/main.zip) and unzip it, or `git clone` it.
2. In Firefox, open `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on…** and choose `manifest.json` in the unzipped folder.
4. Open [x.com](https://x.com). Posts matching your keywords are now hidden.

> ℹ️ Firefox removes temporary add-ons when it restarts, so repeat step 3 after restarting.

### Option 2: Permanent install

Regular Firefox only installs signed extensions permanently. You can either:
- use **Firefox Developer Edition** or **Nightly**, set `xpinstall.signatures.required` to `false` in `about:config`, then open the `.xpi` from the [Releases](../../releases) page, or
- sign it yourself for free as an *unlisted* add-on at [addons.mozilla.org](https://addons.mozilla.org/developers/).

## 🛠 Usage

Click the extension icon in the Firefox toolbar:

| Control | What it does |
|---|---|
| **Blocking enabled** | Turns filtering on or off |
| **Match whole words only** | Treats every keyword as a whole word |
| **Keyword box** | One keyword or phrase per line, case-insensitive |
| **Save** | Applies the list immediately to open X tabs |
| **Restore defaults** | Adds the built-in list back to your current list |

### Keyword syntax

| You type | Blocks | Doesn't block |
|---|---|---|
| `spoiler` | spoiler, spoilers, SPOILER | |
| `"cat"` | cat, cats, Cat | category, concatenate |
| `free giveaway` | the exact phrase anywhere in a post | |

## 📋 Default block list

The extension ships with a starter list in [`defaults.js`](defaults.js). You can edit or remove any of it from the popup, or replace it with your own list.

**Want a word added?** [Open an issue](../../issues/new) or send a pull request that adds it to `defaults.js`. When you update the extension, new defaults are merged into your saved list automatically.

## 🔍 How it works

A content script watches the X page for new posts with a `MutationObserver`. It reads each post's text, including quoted posts, and checks it against your keywords with a single compiled regular expression. Posts that match are hidden with CSS, so nothing is deleted, reported or sent anywhere. On a post's own page, if the main post matches, the whole conversation is replaced by a short notice.

```
manifest.json   extension manifest (Firefox, Manifest V2)
content.js      finds and hides matching posts on x.com
defaults.js     built-in keyword list
background.js   merges new defaults into your list on update
popup.html/js   toolbar settings popup
```

## ❓ FAQ

**Does it work on the X phone app?** No, it only works in Firefox on desktop. On mobile, use X's built-in *Settings → Privacy and safety → Mute and block → Muted words*.

**Does it block words inside images or videos?** No, it only checks text.

**Does it report or block accounts?** No. It only hides content on your screen.

**Chrome support?** Not yet. Pull requests are welcome.

## 🤝 Contributing

Issues and pull requests are welcome, especially:
- new keywords for the default list
- fixes when X changes its page layout
- translations and Chrome/Edge support

## 📄 License

[MIT](LICENSE). Free to use, change and share.

---

*If this extension helps you, please ⭐ star the repo so more people can find it.*

**Keywords:** X keyword blocker, Twitter mute words, Firefox extension, hide tweets, hate speech filter, block replies on X, spoiler blocker, spam filter, Twitter content filter, clean timeline, Firefox add-on.
