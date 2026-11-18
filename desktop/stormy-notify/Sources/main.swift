// stormy-notify: Stormy the cat pops up in the top-right corner of the screen,
// over every app, holding an envelope, to say a job is done.
//
//   stormy-notify --title "Work is ready" --message "Claude finished your job" \
//                 [--open com.anthropic.claudefordesktop] [--seconds 8] [--quiet]
//
// Clicking the card opens the app named by --open (if any) and closes the card.
// Any app, script or Shortcut can run it.

import AppKit

// ---------- arguments ----------
var title = "Your work is ready"
var message = "Stormy brought you a letter."
var openBundle: String? = nil
var seconds: Double = 8
var quiet = false

var args = Array(CommandLine.arguments.dropFirst())
while !args.isEmpty {
    let a = args.removeFirst()
    switch a {
    case "--title": if !args.isEmpty { title = args.removeFirst() }
    case "--message": if !args.isEmpty { message = args.removeFirst() }
    case "--open": if !args.isEmpty { openBundle = args.removeFirst() }
    case "--seconds": if !args.isEmpty { seconds = max(2, Double(args.removeFirst()) ?? 8) }
    case "--quiet": quiet = true
    case "-h", "--help":
        print("usage: stormy-notify [--title T] [--message M] [--open BUNDLE_ID] [--seconds N] [--quiet]")
        exit(0)
    default: break
    }
}

// Files sit next to the program.
let here = URL(fileURLWithPath: CommandLine.arguments[0]).resolvingSymlinksInPath().deletingLastPathComponent()
let art = NSImage(contentsOf: here.appendingPathComponent("stormy-envelope.png"))
let meowURL = here.appendingPathComponent("meow.wav")

// ---------- the card ----------
final class CardView: NSView {
    var onClick: (() -> Void)?
    override func mouseDown(with event: NSEvent) { onClick?() }
    override func resetCursorRects() { addCursorRect(bounds, cursor: .pointingHand) }
}

let app = NSApplication.shared
app.setActivationPolicy(.accessory)

let cardW: CGFloat = 380, cardH: CGFloat = 118, catSize: CGFloat = 112
let screen = NSScreen.main ?? NSScreen.screens[0]
let vf = screen.visibleFrame
let finalOrigin = NSPoint(x: vf.maxX - cardW - 16, y: vf.maxY - cardH - 14)

let panel = NSPanel(contentRect: NSRect(x: finalOrigin.x + 40, y: finalOrigin.y, width: cardW, height: cardH),
                    styleMask: [.borderless, .nonactivatingPanel], backing: .buffered, defer: false)
panel.level = .statusBar
panel.isOpaque = false
panel.backgroundColor = .clear
panel.hasShadow = true
panel.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary, .stationary, .ignoresCycle]
panel.alphaValue = 0

let card = CardView(frame: NSRect(x: 0, y: 0, width: cardW, height: cardH))
card.wantsLayer = true

// Frosted card that follows light and dark mode, with a lavender edge.
let blur = NSVisualEffectView(frame: card.bounds)
blur.material = .popover
blur.blendingMode = .behindWindow
blur.state = .active
blur.wantsLayer = true
blur.layer?.cornerRadius = 18
blur.layer?.masksToBounds = true
blur.layer?.borderWidth = 1.5
blur.layer?.borderColor = NSColor(calibratedRed: 0.42, green: 0.31, blue: 0.85, alpha: 0.55).cgColor
card.addSubview(blur)

let catView = NSImageView(frame: NSRect(x: 6, y: (cardH - catSize) / 2 - 18, width: catSize, height: catSize))
catView.image = art
catView.imageScaling = .scaleProportionallyUpOrDown
catView.wantsLayer = true
card.addSubview(catView)

let titleLabel = NSTextField(labelWithString: title)
titleLabel.font = .systemFont(ofSize: 15, weight: .semibold)
titleLabel.textColor = .labelColor
titleLabel.lineBreakMode = .byTruncatingTail
titleLabel.frame = NSRect(x: 124, y: cardH - 44, width: cardW - 140, height: 20)
card.addSubview(titleLabel)

let messageLabel = NSTextField(wrappingLabelWithString: message)
messageLabel.font = .systemFont(ofSize: 12.5)
messageLabel.textColor = .secondaryLabelColor
messageLabel.maximumNumberOfLines = 3
messageLabel.frame = NSRect(x: 124, y: 16, width: cardW - 140, height: cardH - 64)
card.addSubview(messageLabel)

let paw = NSTextField(labelWithString: "🐾 Stormy")
paw.font = .systemFont(ofSize: 10.5, weight: .medium)
paw.textColor = .tertiaryLabelColor
paw.frame = NSRect(x: cardW - 86, y: cardH - 22, width: 76, height: 14)
paw.alignment = .right
card.addSubview(paw)

panel.contentView = card

// ---------- show, wait, leave ----------
var leaving = false
func leave() {
    if leaving { return }
    leaving = true
    NSAnimationContext.runAnimationGroup({ ctx in
        ctx.duration = 0.35
        panel.animator().alphaValue = 0
        panel.animator().setFrameOrigin(NSPoint(x: finalOrigin.x + 40, y: finalOrigin.y))
    }, completionHandler: { exit(0) })
}

card.onClick = {
    if let id = openBundle, let url = NSWorkspace.shared.urlForApplication(withBundleIdentifier: id) {
        NSWorkspace.shared.openApplication(at: url, configuration: NSWorkspace.OpenConfiguration())
    }
    leave()
}

panel.orderFrontRegardless()
NSAnimationContext.runAnimationGroup { ctx in
    ctx.duration = 0.45
    ctx.timingFunction = CAMediaTimingFunction(name: .easeOut)
    panel.animator().alphaValue = 1
    panel.animator().setFrameOrigin(finalOrigin)
}

// Stormy hops up into the card, with a small bounce.
DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
    let start = catView.frame
    var up = start; up.origin.y += 22
    NSAnimationContext.runAnimationGroup({ ctx in
        ctx.duration = 0.28
        ctx.timingFunction = CAMediaTimingFunction(name: .easeOut)
        catView.animator().frame = up
    }, completionHandler: {
        var settle = start; settle.origin.y += 16
        NSAnimationContext.runAnimationGroup { ctx in
            ctx.duration = 0.22
            ctx.timingFunction = CAMediaTimingFunction(name: .easeIn)
            catView.animator().frame = settle
        }
    })
}

var meow: NSSound? = nil
if !quiet, let s = NSSound(contentsOf: meowURL, byReference: true) {
    s.volume = 0.45
    meow = s
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.35) { _ = meow?.play() }
}

DispatchQueue.main.asyncAfter(deadline: .now() + seconds) { leave() }
// Never stay around longer than a minute, whatever happens.
DispatchQueue.main.asyncAfter(deadline: .now() + 60) { exit(0) }

app.run()
