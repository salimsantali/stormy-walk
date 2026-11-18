# Stormy Pet

Stormy, the orange-and-white tabby, sits on top of your other windows while you work and shows what Claude is doing:

| Stormy | Means |
|---|---|
| Typing on a little laptop, "Working on it…" | Claude is working |
| Paw up, "I need your answer!" (with a soft meow) | Claude is waiting for you |
| Envelope in her mouth, "Done! Click me" | Claude finished and you haven't looked yet |
| Worried, "Something went wrong" | The job failed or hit an error |
| Sitting and blinking | Nothing going on |
| Eyes closed, "Zzz…" | Nothing for five minutes |

- **Drag** her anywhere; she remembers the spot.
- **Click** her to go back to Claude.
- **Hover** over her and a little ✕ appears by her ear: click it to make her disappear. (Right-click also has Open Claude and Hide Stormy.)
- In Claude's Research Space, type **/pet** to show or hide her.

## Use her from other apps

Stormy reads one file, `~/Research Space Mods/stormy-pet/state.json`. Any app, script or Shortcut can write to it:

```
echo '{"state":"working","text":"Rendering video…"}' > "$HOME/Research Space Mods/stormy-pet/state.json"
```

States: `idle`, `working`, `needs`, `ready`, `problem`, and `quit` (closes her). `text` is optional.

Start her by hand:

```
"$HOME/Research Space Mods/stormy-pet/bin/stormy-pet" &
```

## Files

- `Sources/main.swift` the program
- `art/make-poses.mjs` draws her poses (`art/svg/`), rendered to `bin/poses/`
- `bin/` the program, her poses and the meow

Rebuild after a change:

```
cd "$HOME/Research Space Mods/stormy-pet" && swiftc -O -swift-version 5 Sources/main.swift -o bin/stormy-pet
```

The meow is cut from "Meow of a pleading cat" on Wikimedia Commons, which its author released into the public domain.
