# Stormy Walk

A Claude Code mod that gives a session the Research Space look: a soft lavender theme (midnight purple in dark mode) with a starry sky, tiny cartoon cats that stroll across the chat, and Stormy, a desktop pet who shows what Claude is doing.

## What's in it

**The walking cats.** Orange tabbies with white chests and paws, big amber eyes, a pink collar and a little silver bell, drawn in a bold-outline cartoon style. A few walk across a thin strip just above the message box; the big one stops halfway to sniff the ground and look up before walking on. Others walk down (and one up) the window behind the chat. They sit still if your computer is set to reduce motion.

**The meow is a notification.** Stormy meows once when Claude finishes your job and once when Claude needs your answer. Nothing else makes a sound.

**Stormy, the desktop pet (macOS).** She sits on top of your other windows and shows Claude's state: typing on a laptop while Claude works, a paw up when Claude needs your answer, an envelope in her mouth when the work is ready, a worried face when something failed, and a nap when nothing's happening. Drag her anywhere, click her to go back to Claude, or point at her and click the little ✕ to hide her. Type `/pet` to bring her back. In the chat, click "✕ Hide cats" (or type `/cats`) to hide the walking cats, and "🐾 Show the cats" to bring them back.

**Stormy's letter (macOS).** After a job longer than 20 seconds, a card slides in at the top-right corner of the screen, over any app, with Stormy holding an envelope. Click it to open Claude.

**Stormy in your browser: ChatGPT, Gemini and more.** The `stormy-extension` folder is a browser extension for Chrome, Edge, Opera and Brave. On ChatGPT, Gemini, Claude, Perplexity, DeepSeek, Copilot, Mistral and Grok, Stormy sits on the page, types while the AI writes, and says "Done!" with a meow when the reply is finished (with a notification if you're on another tab). The tiny cats walk across the chat there too.

## Install the browser version (ChatGPT, Gemini and more)

1. On this page, click **Code → Download ZIP**, then unzip it.
2. Open `chrome://extensions` (in Opera: `opera://extensions`).
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and choose the **stormy-extension** folder.
5. Open ChatGPT or Gemini and say hi to Stormy. The toolbar icon has switches for Stormy, the cats and the meows.

The extension only reads the page to spot the AI's "stop" button. It sends nothing anywhere.

## Install the Claude mod

At the prompt of a Claude Code terminal session:

```
/plugin install research-space --marketplace salimsantali/stormy-walk
```

From a shell:

```
claude plugin install research-space --marketplace salimsantali/stormy-walk
```

Answer `y` to add the marketplace, then pick a scope.

In the Claude desktop app, where `/plugin` doesn't run: click + next to the prompt box, then Plugins, Add marketplace with `salimsantali/stormy-walk`, then Add plugin.

The look and the cats draw in the desktop and mobile apps. A plain terminal doesn't draw them.

## Set up the desktop pet and the letter (macOS, optional)

The mod looks for the two small programs in `~/Research Space Mods/`. Without them, the cats still walk; Stormy just doesn't appear on the desktop. To build them you need Apple's command line tools (`xcode-select --install`). Clone this repository, then from its folder:

```
mkdir -p "$HOME/Research Space Mods"
cp -R desktop/stormy-pet desktop/stormy-notify "$HOME/Research Space Mods/"
cd "$HOME/Research Space Mods/stormy-pet" && swiftc -O -swift-version 5 Sources/main.swift -o bin/stormy-pet
cd "$HOME/Research Space Mods/stormy-notify" && swiftc -O -swift-version 5 Sources/main.swift -o bin/stormy-notify
```

Each folder's README says how other apps and scripts can use Stormy too.

## Credits

The meows are cut from "Meow of a pleading cat" on Wikimedia Commons, which its author released into the public domain (see `sounds/CREDITS.txt`). All the cat drawings are original.
