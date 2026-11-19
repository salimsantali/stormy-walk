// stormy-pet: Stormy sits on top of your other windows while you work and
// shows what Claude is doing.
//
//   stormy-pet [--state <file>] [--open <bundle id>]
//
// Claude's Research Space mod writes the state file, a line of JSON:
//   {"state":"working","text":"Working on it…"}
// states: idle, working, needs, ready, problem, quit
//
// Drag Stormy anywhere. Click her to go back to Claude. Hover over her and
// click the little × to hide her (right-click works too).
// Any other app or script can drive her by writing that file too.

import AppKit

// ---------- arguments ----------
let home = FileManager.default.homeDirectoryForCurrentUser.path
var statePath = "\(home)/Research Space Mods/stormy-pet/state.json"
var openBundle = "com.anthropic.claudefordesktop"
var cli = Array(CommandLine.arguments.dropFirst())
while !cli.isEmpty {
    let a = cli.removeFirst()
    if a == "--state", !cli.isEmpty { statePath = cli.removeFirst() }
    if a == "--open", !cli.isEmpty { openBundle = cli.removeFirst() }
}

let here = URL(fileURLWithPath: CommandLine.arguments[0]).resolvingSymlinksInPath().deletingLastPathComponent()
func pose(_ name: String) -> NSImage? { NSImage(contentsOf: here.appendingPathComponent("poses/\(name).png")) }
let meowURL = here.appendingPathComponent("meow.wav")

// ---------- one Stormy at a time ----------
let pidPath = "\(home)/Research Space Mods/stormy-pet/.pid"
if let old = try? String(contentsOfFile: pidPath, encoding: .utf8), let pid = Int32(old.trimmingCharacters(in: .whitespacesAndNewlines)),
   pid != getpid(), kill(pid, 0) == 0 {
    exit(0)
}
try? "\(getpid())".write(toFile: pidPath, atomically: true, encoding: .utf8)
func quit() -> Never { try? FileManager.default.removeItem(atPath: pidPath); exit(0) }
signal(SIGTERM) { _ in quit() }

// ---------- what each state looks like ----------
struct Look { let pose: String; let blink: String?; let bubble: String?; let bob: Double; let speed: Double }
func look(_ state: String, _ text: String?) -> Look {
    switch state {
    case "working": return Look(pose: "working", blink: "working-blink", bubble: text ?? "Working on it…", bob: 2.2, speed: 6)
    case "needs": return Look(pose: "needs", blink: "needs-blink", bubble: text ?? "I need you!", bob: 3, speed: 5)
    case "ready": return Look(pose: "ready", blink: "ready-blink", bubble: text ?? "Done! Click me", bob: 2.5, speed: 3.5)
    case "problem": return Look(pose: "problem", blink: nil, bubble: text ?? "Something went wrong", bob: 1, speed: 2)
    case "sleep": return Look(pose: "sleep", blink: nil, bubble: "Zzz…", bob: 1.6, speed: 1.2)
    default: return Look(pose: "idle", blink: "idle-blink", bubble: nil, bob: 1.2, speed: 1.8)
    }
}

// ---------- the window ----------
let app = NSApplication.shared
app.setActivationPolicy(.accessory)

let W: CGFloat = 230, H: CGFloat = 190, CAT: CGFloat = 112
let screen = NSScreen.main ?? NSScreen.screens[0]
let vf = screen.visibleFrame
let defaults = UserDefaults.standard
let startOrigin: NSPoint = {
    if let x = defaults.object(forKey: "x") as? Double, let y = defaults.object(forKey: "y") as? Double {
        let p = NSPoint(x: x, y: y)
        if NSScreen.screens.contains(where: { $0.frame.insetBy(dx: -40, dy: -40).contains(p) }) { return p }
    }
    return NSPoint(x: vf.maxX - W - 12, y: vf.minY + 12)
}()

let panel = NSPanel(contentRect: NSRect(origin: startOrigin, size: NSSize(width: W, height: H)),
                    styleMask: [.borderless, .nonactivatingPanel], backing: .buffered, defer: false)
panel.level = .floating
panel.isOpaque = false
panel.backgroundColor = .clear
panel.hasShadow = false
panel.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary, .stationary, .ignoresCycle]

final class PetView: NSView {
    var onClick: (() -> Void)?
    var onMenu: ((NSEvent) -> Void)?
    var onHover: ((Bool) -> Void)?
    var closeRect: (() -> NSRect)?
    var onClose: (() -> Void)?
    private var downInView = NSPoint.zero
    override func updateTrackingAreas() {
        super.updateTrackingAreas()
        trackingAreas.forEach(removeTrackingArea)
        addTrackingArea(NSTrackingArea(rect: bounds, options: [.mouseEnteredAndExited, .mouseMoved, .activeAlways, .inVisibleRect], owner: self))
    }
    override func mouseEntered(with e: NSEvent) { onHover?(true) }
    override func mouseExited(with e: NSEvent) { onHover?(false) }
    private var downAt = NSPoint.zero
    private var winAt = NSPoint.zero
    private var dragged = false
    override func mouseDown(with e: NSEvent) { downAt = NSEvent.mouseLocation; downInView = convert(e.locationInWindow, from: nil); winAt = window?.frame.origin ?? .zero; dragged = false }
    override func mouseDragged(with e: NSEvent) {
        let p = NSEvent.mouseLocation
        let dx = p.x - downAt.x, dy = p.y - downAt.y
        if abs(dx) + abs(dy) > 3 { dragged = true }
        window?.setFrameOrigin(NSPoint(x: winAt.x + dx, y: winAt.y + dy))
    }
    override func mouseUp(with e: NSEvent) {
        if dragged, let o = window?.frame.origin { UserDefaults.standard.set(Double(o.x), forKey: "x"); UserDefaults.standard.set(Double(o.y), forKey: "y") }
        else if let r = closeRect?(), r.insetBy(dx: -4, dy: -4).contains(downInView) { onClose?() }
        else { onClick?() }
    }
    override func rightMouseDown(with e: NSEvent) { onMenu?(e) }
    // Only Stormy and her bubble catch the mouse; the empty corners let clicks through.
    override func hitTest(_ point: NSPoint) -> NSView? {
        let p = convert(point, from: superview)
        for v in subviews where !v.isHidden && v.frame.contains(p) { return self }
        return nil
    }
}

let view = PetView(frame: NSRect(x: 0, y: 0, width: W, height: H))
panel.contentView = view

let cat = NSImageView(frame: NSRect(x: W - CAT - 4, y: 2, width: CAT, height: CAT))
cat.imageScaling = .scaleProportionallyUpOrDown
view.addSubview(cat)

// Speech bubble above Stormy.
let bubble = NSView(frame: .zero)
bubble.wantsLayer = true
bubble.layer?.cornerRadius = 13
bubble.layer?.borderWidth = 2
let label = NSTextField(labelWithString: "")
label.font = .systemFont(ofSize: 12.5, weight: .semibold)
label.alignment = .center
label.lineBreakMode = .byTruncatingTail
bubble.addSubview(label)
view.addSubview(bubble)

// A small round "×" that appears while the pointer is over Stormy.
let closeSize: CGFloat = 22
let closeButton = NSView(frame: NSRect(x: W - CAT + 2, y: CAT - closeSize + 2, width: closeSize, height: closeSize))
closeButton.wantsLayer = true
closeButton.layer?.cornerRadius = closeSize / 2
closeButton.layer?.backgroundColor = NSColor(calibratedRed: 0.16, green: 0.12, blue: 0.10, alpha: 0.85).cgColor
closeButton.layer?.borderColor = NSColor.white.cgColor
closeButton.layer?.borderWidth = 1.5
let closeMark = NSTextField(labelWithString: "✕")
closeMark.font = .systemFont(ofSize: 11, weight: .bold)
closeMark.textColor = .white
closeMark.alignment = .center
closeMark.frame = NSRect(x: 0, y: 3, width: closeSize, height: 15)
closeButton.addSubview(closeMark)
closeButton.toolTip = "Hide Stormy"
closeButton.alphaValue = 0
view.addSubview(closeButton)

var hoverHide: DispatchWorkItem? = nil
view.onHover = { inside in
    hoverHide?.cancel()
    if inside {
        NSAnimationContext.runAnimationGroup { ctx in ctx.duration = 0.15; closeButton.animator().alphaValue = 1 }
    } else {
        let work = DispatchWorkItem {
            NSAnimationContext.runAnimationGroup { ctx in ctx.duration = 0.25; closeButton.animator().alphaValue = 0 }
        }
        hoverHide = work
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.4, execute: work)
    }
}
view.closeRect = { closeButton.alphaValue > 0.3 ? closeButton.frame : .zero }

func paintBubble(for state: String) {
    let dark = view.effectiveAppearance.bestMatch(from: [.darkAqua, .aqua]) == .darkAqua
    let edge: NSColor
    switch state {
    case "needs": edge = NSColor(calibratedRed: 0.93, green: 0.55, blue: 0.10, alpha: 1)
    case "ready": edge = NSColor(calibratedRed: 0.25, green: 0.62, blue: 0.33, alpha: 1)
    case "problem": edge = NSColor(calibratedRed: 0.80, green: 0.25, blue: 0.23, alpha: 1)
    default: edge = NSColor(calibratedRed: 0.42, green: 0.31, blue: 0.85, alpha: 1)
    }
    bubble.layer?.backgroundColor = (dark ? NSColor(calibratedWhite: 0.13, alpha: 0.96) : NSColor(calibratedWhite: 1, alpha: 0.97)).cgColor
    bubble.layer?.borderColor = edge.cgColor
    label.textColor = dark ? .white : NSColor(calibratedRed: 0.13, green: 0.11, blue: 0.19, alpha: 1)
}

func setBubble(_ text: String?, state: String) {
    guard let text, !text.isEmpty else { bubble.isHidden = true; return }
    label.stringValue = text
    let size = label.intrinsicContentSize
    let bw = min(W - 8, max(70, size.width + 26)), bh: CGFloat = 30
    bubble.frame = NSRect(x: W - bw - 6, y: CAT + 8, width: bw, height: bh)
    label.frame = NSRect(x: 10, y: (bh - size.height) / 2 - 1, width: bw - 20, height: size.height + 2)
    paintBubble(for: state)
    bubble.isHidden = false
}

// ---------- state ----------
var state = "idle"
var stateText: String? = nil
var lastFileDate: Date? = nil
var lastChange = Date()
var claudeFrontSince: Date? = nil
var current = look("idle", nil)
var meow: NSSound? = NSSound(contentsOf: meowURL, byReference: true)
meow?.volume = 0.4

func apply(_ newState: String, _ text: String?, fromFile: Bool) {
    if newState == "quit" { quit() }
    let changed = newState != state || text != stateText
    state = newState; stateText = text
    current = look(state, text)
    cat.image = pose(current.pose)
    setBubble(current.bubble, state: state)
    if changed { lastChange = Date() }
    // Sound comes from Claude itself (a meow when the work is done or it needs you), so Stormy stays quiet here.
}

func readState() {
    guard let attrs = try? FileManager.default.attributesOfItem(atPath: statePath),
          let date = attrs[.modificationDate] as? Date else { return }
    if date == lastFileDate { return }
    lastFileDate = date
    guard let data = FileManager.default.contents(atPath: statePath),
          let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
          let s = obj["state"] as? String else { return }
    apply(s, obj["text"] as? String, fromFile: true)
}

view.onClick = {
    if let url = NSWorkspace.shared.urlForApplication(withBundleIdentifier: openBundle) {
        NSWorkspace.shared.openApplication(at: url, configuration: NSWorkspace.OpenConfiguration())
    }
    if state == "ready" || state == "problem" || state == "sleep" { apply("idle", nil, fromFile: false) }
}

final class MenuTarget: NSObject {
    @objc func hide() { quit() }
    @objc func open() { view.onClick?() }
}
let menuTarget = MenuTarget()
view.onMenu = { e in
    let m = NSMenu()
    let o = NSMenuItem(title: "Open Claude", action: #selector(MenuTarget.open), keyEquivalent: ""); o.target = menuTarget; m.addItem(o)
    let h = NSMenuItem(title: "Hide Stormy", action: #selector(MenuTarget.hide), keyEquivalent: ""); h.target = menuTarget; m.addItem(h)
    NSMenu.popUpContextMenu(m, with: e, for: view)
}

view.onClose = {
    NSAnimationContext.runAnimationGroup({ ctx in
        ctx.duration = 0.3
        panel.animator().alphaValue = 0
    }, completionHandler: { quit() })
}

apply("idle", nil, fromFile: false)
readState()
panel.orderFrontRegardless()

// ---------- life: breathe, blink, watch the file ----------
let t0 = Date()
var blinkUntil = Date.distantPast
var nextBlink = Date().addingTimeInterval(3)
Timer.scheduledTimer(withTimeInterval: 1.0 / 30, repeats: true) { _ in
    let t = Date().timeIntervalSince(t0)
    var f = cat.frame
    f.origin.y = 2 + CGFloat(abs(sin(t * current.speed)) * current.bob)
    cat.frame = f
    let now = Date()
    if let b = current.blink {
        if now >= nextBlink { blinkUntil = now.addingTimeInterval(0.16); nextBlink = now.addingTimeInterval(Double.random(in: 2.5...5.5)) }
        cat.image = pose(now < blinkUntil ? b : current.pose)
    }
}

Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { _ in
    readState()
    // "Ready" means finished but not seen yet: once Claude has been in front
    // for two seconds, Stormy settles back down.
    let front = NSWorkspace.shared.frontmostApplication?.bundleIdentifier == openBundle
    if front { claudeFrontSince = claudeFrontSince ?? Date() } else { claudeFrontSince = nil }
    if state == "ready", let s = claudeFrontSince, Date().timeIntervalSince(s) > 2, Date().timeIntervalSince(lastChange) > 2 {
        apply("idle", nil, fromFile: false)
    }
    // Quiet for five minutes: a nap.
    if state == "idle", Date().timeIntervalSince(lastChange) > 300 { apply("sleep", nil, fromFile: false) }
}

app.run()
