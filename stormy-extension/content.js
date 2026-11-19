// Stormy Walk for AI chat websites.
// Draws Stormy (a desktop-pet style cat) and a strip of tiny walking cats on the page,
// and follows the AI: typing while it writes a reply, an envelope and a meow when it's done.
(() => {
  if (window.__stormyWalk) return
  window.__stormyWalk = true

  const url = (p) => chrome.runtime.getURL(p)
  const SITE = ({
    'chatgpt.com': 'ChatGPT', 'chat.openai.com': 'ChatGPT', 'gemini.google.com': 'Gemini', 'claude.ai': 'Claude',
    'www.perplexity.ai': 'Perplexity', 'perplexity.ai': 'Perplexity', 'chat.deepseek.com': 'DeepSeek',
    'copilot.microsoft.com': 'Copilot', 'chat.mistral.ai': 'Mistral', 'grok.com': 'Grok',
  })[location.hostname] || 'The AI'

  const defaults = { cats: true, pet: true, sound: true }
  let settings = { ...defaults }

  // ---------- the overlay, in its own shadow root so the site's styles can't touch it ----------
  const host = document.createElement('div')
  host.id = 'stormy-walk-root'
  host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483000'
  const root = host.attachShadow({ mode: 'open' })
  root.innerHTML = `
<style>
  :host{all:initial}
  *{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif}
  .strip{position:fixed;left:50%;bottom:150px;transform:translateX(-50%);width:min(640px,80vw);height:32px;pointer-events:none}
  .strip img{width:100%;height:100%;display:block}
  .chip{position:fixed;pointer-events:auto;cursor:pointer;border:1px solid rgba(107,79,216,.45);background:rgba(255,255,255,.92);color:#4a4060;
        font-size:12px;font-weight:600;padding:4px 10px;border-radius:999px;box-shadow:0 2px 8px rgba(0,0,0,.12);opacity:.55;transition:opacity .2s}
  .chip:hover{opacity:1}
  .hide-cats{bottom:155px;left:calc(50% + min(320px,40vw) + 8px)}
  .show-cats{bottom:14px;left:14px}
  .pet{position:fixed;width:104px;height:104px;pointer-events:auto;cursor:grab;user-select:none}
  .pet img.cat{width:104px;height:104px;display:block;animation:bob 1.6s ease-in-out infinite;-webkit-user-drag:none}
  .pet.working img.cat{animation-duration:.5s}
  .pet.ready img.cat{animation-duration:.9s}
  @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
  .bubble{position:absolute;right:6px;bottom:104px;white-space:nowrap;padding:6px 12px;border-radius:14px;border:2px solid #6b4fd8;background:#fff;color:#211b30;
          font-size:12.5px;font-weight:700;box-shadow:0 3px 10px rgba(0,0,0,.15);display:none}
  .pet.working .bubble,.pet.ready .bubble,.pet.problem .bubble,.pet.sleep .bubble{display:block}
  .pet.ready .bubble{border-color:#3f9e54}
  .pet.problem .bubble{border-color:#cc4035}
  .x{position:absolute;left:4px;top:2px;width:22px;height:22px;border-radius:50%;background:rgba(40,30,25,.88);border:1.5px solid #fff;color:#fff;
     font-size:11px;font-weight:700;line-height:19px;text-align:center;cursor:pointer;opacity:0;transition:opacity .15s}
  .pet:hover .x{opacity:1}
  @media (prefers-color-scheme: dark){.chip{background:rgba(30,26,42,.92);color:#ddd6ee}.bubble{background:#211e2e;color:#fff}}
  @media (prefers-reduced-motion: reduce){.pet img.cat{animation:none}}
</style>
<div class="strip" id="strip"><img id="catsimg" alt="Tiny cartoon cats walking"></div>
<div class="chip hide-cats" id="hidecats" title="Hide the walking cats">✕ cats</div>
<div class="chip show-cats" id="showcats" title="Bring Stormy and the cats back">🐾</div>
<div class="pet" id="pet" title="Stormy">
  <div class="bubble" id="bubble"></div>
  <img class="cat" id="catimg" alt="Stormy the cat" draggable="false">
  <div class="x" id="x" title="Hide Stormy">✕</div>
</div>`
  const $ = (id) => root.getElementById(id)
  $('catsimg').src = url('art/cats.svg')

  // ---------- Stormy's moods ----------
  const POSES = { idle: 'idle', working: 'working', ready: 'ready', problem: 'problem', sleep: 'idle-blink' }
  const BUBBLES = { working: 'Working on it…', ready: 'Done! 🐾', problem: 'Something went wrong', sleep: 'Zzz…' }
  let mood = 'idle'
  let moodSince = Date.now()
  function setMood(next) {
    if (next === mood) return
    mood = next
    moodSince = Date.now()
    const pet = $('pet')
    pet.className = 'pet ' + mood
    $('catimg').src = url(`art/poses/${POSES[mood]}.png`)
    $('bubble').textContent = BUBBLES[mood] || ''
  }

  // A blink now and then.
  setInterval(() => {
    const blinkable = { idle: 'idle-blink', working: 'working-blink', ready: 'ready-blink' }[mood]
    if (!blinkable || !settings.pet) return
    $('catimg').src = url(`art/poses/${blinkable}.png`)
    setTimeout(() => { $('catimg').src = url(`art/poses/${POSES[mood]}.png`) }, 160)
  }, 4200)

  // ---------- sound ----------
  function meow(which = 1, volume = 0.35) {
    if (!settings.sound) return
    const a = new Audio(url(`sounds/meow-${which}.wav`))
    a.volume = volume
    a.play().catch(() => {})
  }

  // ---------- following the AI ----------
  // Every AI chat site shows a "stop" button while it's writing a reply.
  function isVisible(el) {
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'
  }
  function aiIsWorking() {
    const candidates = document.querySelectorAll(
      'button[data-testid="stop-button"], button[aria-label*="stop" i], button[title*="stop" i], [role="button"][aria-label*="stop" i]')
    for (const el of candidates) {
      const label = (el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('data-testid') || '').toLowerCase()
      if (/stop (recording|dictation|listening|voice|sharing)/.test(label)) continue
      if (isVisible(el)) return true
    }
    return false
  }
  function aiHadProblem() {
    const alerts = document.querySelectorAll('[role="alert"], .text-token-text-error, [data-testid*="error" i]')
    for (const el of alerts) {
      if (isVisible(el) && /went wrong|error|try again|failed/i.test(el.textContent || '')) return true
    }
    return false
  }

  let lastWorkingAt = 0
  let workStartedAt = 0
  setInterval(() => {
    const now = Date.now()
    if (aiIsWorking()) {
      lastWorkingAt = now
      if (mood !== 'working') { setMood('working'); workStartedAt = now }
      return
    }
    if (mood === 'working' && now - lastWorkingAt > 1200) {
      if (aiHadProblem()) {
        setMood('problem')
        return
      }
      setMood('ready')
      // The meow is a notification: only for a reply that took a while, or when you're on another tab.
      if (document.hidden || now - workStartedAt >= 20000) meow(1, 0.35)
      if (document.hidden) chrome.runtime.sendMessage({ type: 'stormy-done', site: SITE }).catch?.(() => {})
      return
    }
    // "Ready" means done but not seen yet: it settles once you're back on the page.
    if (mood === 'ready' && !document.hidden && now - moodSince > 6000) setMood('idle')
    if (mood === 'problem' && now - moodSince > 15000) setMood('idle')
    if (mood === 'idle' && now - moodSince > 5 * 60 * 1000) setMood('sleep')
  }, 400)

  for (const ev of ['keydown', 'pointerdown']) {
    document.addEventListener(ev, () => { if (mood === 'ready' || mood === 'sleep') setMood('idle') }, { capture: true, passive: true })
  }

  // ---------- dragging Stormy (she remembers her spot per site) ----------
  const posKey = 'pos:' + location.hostname
  function placePet(pos) {
    const pet = $('pet')
    const x = Math.min(Math.max(pos?.x ?? window.innerWidth - 130, 0), window.innerWidth - 104)
    const y = Math.min(Math.max(pos?.y ?? window.innerHeight - 260, 0), window.innerHeight - 104)
    pet.style.left = x + 'px'
    pet.style.top = y + 'px'
  }
  let drag = null
  $('pet').addEventListener('pointerdown', (e) => {
    if (e.target === $('x')) return
    const r = $('pet').getBoundingClientRect()
    drag = { dx: e.clientX - r.left, dy: e.clientY - r.top, moved: false }
    $('pet').setPointerCapture(e.pointerId)
  })
  $('pet').addEventListener('pointermove', (e) => {
    if (!drag) return
    drag.moved = true
    placePet({ x: e.clientX - drag.dx, y: e.clientY - drag.dy })
  })
  $('pet').addEventListener('pointerup', () => {
    if (!drag) return
    const r = $('pet').getBoundingClientRect()
    if (drag.moved) chrome.storage.local.set({ [posKey]: { x: r.left, y: r.top } })
    else if (mood === 'ready' || mood === 'problem' || mood === 'sleep') setMood('idle')
    drag = null
  })
  window.addEventListener('resize', () => chrome.storage.local.get(posKey, (v) => placePet(v[posKey])))

  // ---------- show / hide ----------
  function apply() {
    $('strip').style.display = settings.cats ? 'block' : 'none'
    $('hidecats').style.display = settings.cats ? 'block' : 'none'
    $('pet').style.display = settings.pet ? 'block' : 'none'
    $('showcats').style.display = settings.cats && settings.pet ? 'none' : 'block'
  }
  $('hidecats').addEventListener('click', () => chrome.storage.sync.set({ cats: false }))
  $('x').addEventListener('click', (e) => { e.stopPropagation(); chrome.storage.sync.set({ pet: false }) })
  $('showcats').addEventListener('click', () => chrome.storage.sync.set({ cats: true, pet: true }))
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return
    for (const k of Object.keys(changes)) if (k in defaults) settings[k] = changes[k].newValue
    apply()
  })

  chrome.storage.sync.get(defaults, (v) => {
    settings = { ...defaults, ...v }
    setMood('working'); setMood('idle')
    chrome.storage.local.get(posKey, (p) => placePet(p[posKey]))
    apply()
    ;(document.body || document.documentElement).appendChild(host)
  })
})()
