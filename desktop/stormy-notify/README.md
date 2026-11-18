# Stormy Notify

Stormy, the orange-and-white tabby, pops up in the top-right corner of your Mac's screen, over any app, holding an envelope in her mouth, with a soft meow. Click the card to jump to the app the job came from. It goes away by itself after a few seconds.

Claude's Research Space mod calls it whenever a job takes longer than 20 seconds. Any other app, script or Shortcut can call it too.

## Use it from anywhere

In Terminal or any script:

```
"$HOME/Research Space Mods/stormy-notify/bin/stormy-notify" --title "Render finished" --message "Dr Gabby Episode 13 is ready"
```

Options:

- `--title` the bold line
- `--message` the line under it (up to 3 lines)
- `--open <bundle id>` the app to open when you click the card, for example `com.anthropic.claudefordesktop` for Claude
- `--seconds <n>` how long the card stays (default 8)
- `--quiet` no meow

### From the Shortcuts app

Add a **Run Shell Script** action with the line above, and Stormy will pop up whenever that shortcut runs (for example at the end of an automation).

## Files

- `Sources/main.swift` the program
- `art/stormy-envelope.svg` Stormy's drawing (and the PNG made from it)
- `bin/` the built program, the picture and the meow it uses

To rebuild after a change:

```
cd "$HOME/Research Space Mods/stormy-notify" && swiftc -O -swift-version 5 Sources/main.swift -o bin/stormy-notify
```

The meow is cut from "Meow of a pleading cat" on Wikimedia Commons, which its author released into the public domain.
