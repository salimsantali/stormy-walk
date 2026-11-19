import { atom, read, update } from 'claude-code'
import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Research Space: lavender study paper by day, a midnight study by night.
const { theme, problems } = makeColors({
  label: 'Research Space',
  roles: { accent: '#6b4fd8', danger: '#c2413a', success: '#3f8a4f', warning: '#b07a18', pro: '#c0567d' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#ebe5f4',
        'surface-1': '#f1ecf8',
        'surface-2': '#f7f4fb',
        'text-primary': '#211b30',
        'text-secondary': '#4a4060',
        'text-muted': '#615778',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#14121e',
        'surface-1': '#1b1828',
        'surface-2': '#221e31',
        'surface-3': '#29243a',
        'text-primary': '#eeeaf8',
        'text-secondary': '#cbc4de',
        'text-muted': '#a59dbb',
      },
    },
  },
})

// No frosting: the panels stay sharp and the cats behind them stay crisp.
const LOOK: ThemeSetArgs = { colors: theme, backdrop: { scene: 'research-sky', glass: { blur: 0, opacity: 0.45 } } }

// ---------- the background: a quiet starry sky, no cat ----------
const stars = [
  [120, 260, 1.6, 0], [340, 180, 1.2, 1.2], [520, 330, 1.8, 2.4], [760, 230, 1.3, 0.6], [980, 300, 1.7, 1.8],
  [1180, 210, 1.2, 3], [1380, 320, 1.6, 0.9], [1520, 250, 1.3, 2.1], [240, 520, 1.4, 1.5], [1460, 560, 1.5, 0.3],
  [80, 760, 1.2, 2.7], [1540, 820, 1.4, 1.1], [420, 900, 1.1, 2.2], [1240, 940, 1.3, 0.4],
]
  .map(([x, y, r, d]) => `<circle class="star" cx="${x}" cy="${y}" r="${r}" style="animation-delay:${d}s"/>`)
  .join('')



// ---------- the cats: drawn like the owner's cat ----------
// Cartoon style from the owner's samples: bold dark ink outlines, flat colour
// with a simple shadow side, crescent tabby stripes, little fur ticks, big round
// eyes and a soft ground shadow. Colours from the owner's cat: orange tabby back,
// head and tail; white chest, front legs, paws and muzzle; amber eyes; big
// pink-lined ears; pink collar with a silver bell.
const OR = '#f4a443'
const ORS = '#dc8530'
const STRIPE = '#c96a1f'
const WH = '#fffaf3'
const WHS = '#e6dccd'
const INK = '#2e1d14'
const LINE = `stroke="${INK}" stroke-width="1.7" stroke-linejoin="round"`

const cat = `
<ellipse cx="29" cy="40.2" rx="20" ry="2.2" fill="#000" opacity=".16"/>
<g class="bob">
  <g class="tail" style="transform-origin:10px 21px">
    <path d="M10 21 C 2 18, -1 8, 5 0.5" stroke="${INK}" stroke-width="6.4" fill="none" stroke-linecap="round"/>
    <path d="M10 21 C 2 18, -1 8, 5 0.5" stroke="${OR}" stroke-width="3.6" fill="none" stroke-linecap="round"/>
    <path d="M2.6 13 l3.2 -0.6 M2.2 7.2 l3 0.4" stroke="${STRIPE}" stroke-width="1.5" stroke-linecap="round"/>
  </g>
  <g class="lg a"><rect x="12" y="25" width="5.4" height="14" rx="2.7" fill="${ORS}" ${LINE}/><path d="M12.6 35.5 h4.2" stroke="${WHS}" stroke-width="3" stroke-linecap="round"/></g>
  <rect class="lg b" x="37" y="25" width="5.4" height="14.5" rx="2.7" fill="${WHS}" ${LINE}/>
  <ellipse cx="26" cy="23" rx="17" ry="9" fill="${OR}" ${LINE}/>
  <path d="M12 26 Q 26 33.5 40 27 L 40 29.5 Q 26 34 13 28 Z" fill="${ORS}" opacity=".55"/>
  <ellipse cx="35" cy="27" rx="8.5" ry="4.6" fill="${WH}"/>
  <path d="M16.5 15.5 q3 3 2 7.5 M22 14.4 q3 3.4 2 8.2 M27.6 14.4 q2.6 3 1.6 7" stroke="${STRIPE}" stroke-width="1.9" fill="none" stroke-linecap="round"/>
  <path d="M14.5 21.5 l1.2 1 M31 17.5 l1 1.2 M20 27 l1.1 .8" stroke="${INK}" stroke-width=".7" stroke-linecap="round" opacity=".55"/>
  <g class="lg b"><rect x="18" y="25" width="5.4" height="14" rx="2.7" fill="${OR}" ${LINE}/><path d="M18.6 35.5 h4.2" stroke="${WH}" stroke-width="3" stroke-linecap="round"/></g>
  <rect class="lg a" x="43" y="25" width="5.4" height="14.5" rx="2.7" fill="${WH}" ${LINE}/>
  <path d="M39.5 20.5 q3.5 5.5 9 5.4" stroke="${INK}" stroke-width="3.6" fill="none" stroke-linecap="round"/>
  <path d="M39.5 20.5 q3.5 5.5 9 5.4" stroke="#f592b0" stroke-width="2" fill="none" stroke-linecap="round"/>
  <circle cx="45.8" cy="27.3" r="2" fill="#dfe3ea" stroke="${INK}" stroke-width=".9"/>
  <g class="head">
    <path d="M38.5 9.5 L38.2 -3.2 L47 3.6 Z" fill="${OR}" ${LINE}/><path d="M40.2 6.2 L40 0.4 L44.4 3.8 Z" fill="#f4a1b2"/>
    <path d="M51 3 L61.5 -4.2 L61 10 Z" fill="${OR}" ${LINE}/><path d="M53.6 3.4 L59.4 -0.6 L59.2 6.2 Z" fill="#f4a1b2"/>
    <path d="M37.6 17 l-2.2 .8 l2 1.2 l-1.6 1.4 l2.4 .4" fill="${OR}" stroke="${INK}" stroke-width="1" stroke-linejoin="round"/>
    <circle cx="49.5" cy="13.2" r="11.6" fill="${OR}" ${LINE}/>
    <path d="M44.5 4.6 q.4 2 .2 3.6 M48.2 3.4 q.4 2 .2 3.8" stroke="${STRIPE}" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M50.8 4.6 q2 6 2.4 12.4 l-3.6 0 q-.6 -6.4 1.2 -12.4 z" fill="${WH}"/>
    <ellipse cx="52" cy="19.8" rx="7" ry="4.4" fill="${WH}"/>
    <g class="eye">
      <circle cx="45.6" cy="11.8" r="4.1" fill="#f6bb3c" stroke="${INK}" stroke-width="1.2"/>
      <circle cx="55.4" cy="11.8" r="4.3" fill="#f6bb3c" stroke="${INK}" stroke-width="1.2"/>
      <ellipse cx="46.3" cy="12" rx="1.3" ry="2.6" fill="${INK}"/><ellipse cx="56.2" cy="12" rx="1.35" ry="2.7" fill="${INK}"/>
      <circle cx="47" cy="10.6" r=".9" fill="#fff"/><circle cx="57" cy="10.6" r=".95" fill="#fff"/>
    </g>
    <path d="M49.6 16.2 h3 l-1.5 1.9 z" fill="#ef8f9c" stroke="${INK}" stroke-width=".6" stroke-linejoin="round"/>
    <path d="M51.1 18.1 q-1.2 1.6 -2.6 .8 M51.1 18.1 q1.2 1.6 2.6 .8" stroke="${INK}" stroke-width=".75" fill="none" stroke-linecap="round"/>
    <path d="M57.5 18.4 L66 16.8 M57.5 19.8 L66 20.6 M44.5 18.6 L36.8 17.6" stroke="${INK}" stroke-width=".55" stroke-linecap="round"/>
    <path d="M43 17.2 l.6 .6 M58 16.8 l.5 .7" stroke="${INK}" stroke-width=".6" opacity=".6"/>
  </g>
</g>`

// One walk: a path across the strip that leaves the cat off screen for the
// rest of its cycle, so the cats come by from time to time.
const walk = (from: number, to: number, y: number, scale: number, begin: number, dur: number, walkPart: number) => `
<g transform="translate(${from} ${y})">
  <animateTransform attributeName="transform" type="translate" values="${from} ${y}; ${to} ${y}; ${to} ${y}" keyTimes="0; ${walkPart}; 1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>
  <g transform="scale(${scale < 0 ? `${scale} ${-scale}` : scale})">${cat}</g>
</g>`

// The big bottom cat stops halfway, sniffs the ground, looks up, then walks on.
// While it walks, the walking pose shows; while it stops, a standing pose
// (legs still, no bob) takes over and its head dips and lifts.
const SNIFF_HEAD = `<animateTransform attributeName="transform" type="rotate" dur="22s" repeatCount="indefinite"
  values="0 44 20; 0 44 20; 24 44 20; 17 44 20; 24 44 20; 17 44 20; 24 44 20; -14 44 20; -14 44 20; 0 44 20; 0 44 20"
  keyTimes="0; .335; .355; .37; .385; .40; .42; .45; .475; .495; 1"/>`

const standingCat = cat
  .replace(/ class="lg [ab]"/g, '')
  .replace('<g class="bob">', '<g>')
  .replace('<g class="head">', `<g class="head">${SNIFF_HEAD}`)

const sniffWalk = (y: number, scale: number) => `
<g transform="translate(-70 ${y})">
  <animateTransform attributeName="transform" type="translate" dur="22s" repeatCount="indefinite"
    values="-70 ${y}; 420 ${y}; 420 ${y}; 870 ${y}; 870 ${y}" keyTimes="0; .33; .5; .78; 1"/>
  <animate attributeName="opacity" calcMode="discrete" dur="22s" repeatCount="indefinite" values="1; 0; 1" keyTimes="0; .33; .5"/>
  <g transform="scale(${scale})">${cat}</g>
</g>
<g transform="translate(420 ${y})" opacity="0">
  <animate attributeName="opacity" calcMode="discrete" dur="22s" repeatCount="indefinite" values="0; 1; 0" keyTimes="0; .33; .5"/>
  <g transform="scale(${scale})">${standingCat}</g>
</g>`


const CAT_STYLE = `
  .lg{transform-box:fill-box;transform-origin:50% 0}
  .lg.a{animation:stepA .42s ease-in-out infinite alternate}
  .lg.b{animation:stepB .42s ease-in-out infinite alternate}
  .tail{animation:swish .9s ease-in-out infinite alternate}
  .bob{animation:bob .42s ease-in-out infinite alternate}
  .eye{transform-box:fill-box;transform-origin:50% 50%;animation:blink 4.5s infinite}
  @keyframes stepA{from{transform:rotate(-24deg)}to{transform:rotate(24deg)}}
  @keyframes stepB{from{transform:rotate(24deg)}to{transform:rotate(-24deg)}}
  @keyframes swish{from{transform:rotate(-12deg)}to{transform:rotate(14deg)}}
  @keyframes bob{from{transform:translateY(0)}to{transform:translateY(-1px)}}
  @keyframes blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
  @media (prefers-reduced-motion: reduce){.lg,.tail,.bob,.eye{animation:none}}
`

const CATS = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="40" viewBox="0 0 800 40">
<style>${CAT_STYLE}</style>
${sniffWalk(8, 0.74)}
${walk(-70, 870, 15, 0.57, 1.6, 22, 0.7)}
${walk(870, -70, 10, -0.68, 11, 22, 0.7)}
</svg>`

// Cats walking down (and one up) the window, behind the chat, from time to time.
// Each lane is a nested svg whose y slides from above the top to below the bottom.
const lane = (x: string, down: boolean, scale: number, begin: number, dur: number) => {
  const turn = down
    ? `translate(${44 * scale} 0) rotate(90) scale(${scale})`
    : `translate(0 ${70 * scale}) rotate(-90) scale(${scale})`
  const ys = down ? '-12%; 112%; 112%' : '112%; -12%; -12%'

  return `<svg x="${x}" y="${down ? '-12%' : '112%'}" width="60" height="60" overflow="visible">
  <animate attributeName="y" values="${ys}" keyTimes="0; .55; 1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>
  <g transform="${turn}">${cat}</g>
</svg>`
}

const SKY_HEAD = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<style>
  .s0{stop-color:#e7e0f3}.s1{stop-color:#efe8f2}.s2{stop-color:#f6ecea}
  .star{fill:#8f7fd0;opacity:.25;animation:tw 4s ease-in-out infinite}
  @media (prefers-color-scheme: dark){.s0{stop-color:#14112a}.s1{stop-color:#1c1735}.s2{stop-color:#2a1f3d}.star{fill:#fff6d8;opacity:.6}}
  @keyframes tw{0%,100%{opacity:.15}50%{opacity:.85}}
  @media (prefers-reduced-motion: reduce){.star{animation:none}}
${CAT_STYLE}</style>
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="s0"/><stop offset=".6" class="s1"/><stop offset="1" class="s2"/></linearGradient></defs>
<rect width="100%" height="100%" fill="url(#sky)"/>
<svg width="100%" height="100%" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">${stars}</svg>
`

const SKY_LANES = `${lane('23%', true, 0.62, 0, 40)}
${lane('76%', true, 0.5, 14, 40)}
${lane('50%', false, 0.55, 27, 40)}`

const SKY = `${SKY_HEAD}${SKY_LANES}</svg>`
// The same sky with no cats in it, for when the owner hides them.
const SKY_QUIET = `${SKY_HEAD}</svg>`

// ---------- Stormy the desktop pet ----------
// The pet program (~/Research Space Mods/stormy-pet) reads this file and shows
// what Claude is doing: idle, working, needs, ready, problem, or quit.
const PET_DIR = 'Research Space Mods/stormy-pet'
const petLine = (state: string, text?: string) => JSON.stringify(text === undefined ? { state } : { state, text })
const PET_START = 'pgrep -f "stormy-pet/bin/stormy-pet" >/dev/null || nohup "$HOME/Research Space Mods/stormy-pet/bin/stormy-pet" >/dev/null 2>&1 &!'

const latestRow = atom({ plugin: 'research-space', key: 'latestRow' } as const, null)
const rowCount = atom({ plugin: 'research-space', key: 'rowCount' } as const, 0)
const catsHidden = atom({ plugin: 'research-space', key: 'catsHidden' } as const, false)

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    // Stormy the desktop pet wakes up with the session.
    petFile = `${(await $.env.get('HOME')) ?? ''}/${PET_DIR}/state.json`
    await $.fs.write(petFile, petLine('idle')).catch(() => undefined)
    $.process.run(['/bin/zsh', '-c', PET_START], { timeoutMs: 10000 }).catch(() => undefined)
    await $.command.register({ name: 'pet', description: 'Show or hide Stormy, the desktop pet' })
    await $.command.register({ name: 'cats', description: 'Show or hide the little cats in the chat' })

    const set = await $.theme.set(LOOK)
    $.ui.status(set.isDrawn ? '🐾 Research Space' : `Research Space (${set.reason})`)

    const result = await next(e)
    // Moves the cats' strip to the end of the conversation, under the newest reply.
    const n = (await read($, rowCount)) + 1
    await update($, rowCount, () => n)
    await update($, latestRow, () => `cats-${n}`)
    await $.ui.place({ id: `cats-${n}` })

    return result
  })

  // Stormy's letter: when a job took a while, she pops up on screen, over any app.
  let startedAt = 0
  let asked = ''
  let petFile = ''

  on('prompt.submit', async ($, e, next) => {
    startedAt = await $.clock.now()
    asked = e.text

    if (petFile !== '') {
      await $.fs.write(petFile, petLine('working', 'Working on it…')).catch(() => undefined)
    }

    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const result = await next(e)

    // Stormy only meows as a notification: here, when the work is done.
    if (e.reason === 'answer') {
      $.audio.play({ asset: 'sounds/meow-1.wav' }, { gain: 0.6 }).catch(() => undefined)
    }

    if (petFile !== '') {
      const line =
        e.reason === 'answer' ? petLine('ready', 'Done! Click me')
          : e.reason === 'aborted' ? petLine('idle')
            : petLine('problem', 'Something went wrong')
      await $.fs.write(petFile, line).catch(() => undefined)
    }
    const took = startedAt === 0 ? 0 : ((await $.clock.now()) - startedAt) / 1000

    if (took >= 20) {
      const job = asked.replace(/\s+/g, ' ').trim()
      const short = job.length > 70 ? `${job.slice(0, 70)}…` : job
      const minutes = took >= 90 ? `${Math.round(took / 60)} min` : `${Math.round(took)} s`
      $.process
        .run(
          [
            '/bin/zsh',
            '-c',
            'exec "$HOME/Research Space Mods/stormy-notify/bin/stormy-notify" "$@"',
            'stormy-notify',
            '--title',
            'Your work is ready',
            '--message',
            short === '' ? `Claude finished your job (${minutes}).` : `Done in ${minutes}: “${short}”`,
            '--quiet',
            '--open',
            'com.anthropic.claudefordesktop',
          ],
          { timeoutMs: 70000 },
        )
        .catch(() => undefined)
    }

    const n = (await read($, rowCount)) + 1
    await update($, rowCount, () => n)
    await update($, latestRow, () => `cats-${n}`)
    await $.ui.place({ id: `cats-${n}` })

    return result
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if (e.props.plugin !== 'research-space' || (e.surface !== 'desktop' && e.surface !== 'mobile')) {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)
    const hidden = await read($, catsHidden)

    return <Svg source={hidden ? SKY_QUIET : SKY} alt="A soft starry sky" isInteractive />
  })

  on('ui.render', { component: 'Placed' }, async ($, e, next) => {
    if (e.props.plugin !== 'research-space' || e.surface === 'terminal') {
      return next(e)
    }

    if (e.props.id !== (await read($, latestRow)) || (await read($, catsHidden))) {
      return next(e)
    }

    const { Box, Svg } = $.ui.resolve(e)

    return (
      <Box position="relative" height={2}>
        <Box position="absolute" top={-1} left={0} right={0} height={3}>
          <Svg
            source={CATS}
            alt="Three tiny cartoon cats, orange and white like the owner's cat, stroll across the chat"
            width={720}
            height={36}
            isInteractive
          />
        </Box>
      </Box>
    )
  })

  // The same cats on a thin strip just above the message box, which the app
  // always draws in front of the conversation.
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.surface === 'terminal' || e.props.hasSurvey) {
      return next(e)
    }

    const { Box, Button, Svg } = $.ui.resolve(e)

    // Hidden: only a small paw button stays, to bring the cats back.
    if (await read($, catsHidden)) {
      return (
        <Box>
          <Button key="cats-show" label="🐾 Show the cats" plain dimColor onPress={() => update($, catsHidden, () => false)} />
        </Box>
      )
    }

    return (
      <Box flexDirection="row" alignItems="center">
        <Svg
          source={CATS}
          alt="Three tiny cartoon cats, orange and white like the owner's cat, stroll across the chat"
          width={640}
          height={32}
          isInteractive
        />
        <Button key="cats-hide" label="✕ Hide cats" plain dimColor onPress={() => update($, catsHidden, () => true)} />
      </Box>
    )
  })

  // When Stormy, the research agent, is sent off: a quiet note (she meows when the work is done).
  on('tool.call', { tool: 'Agent' }, async ($, e, next) => {
    if (e.subagent_type === 'stormy') {
      $.ui.toast('🐾 Stormy is off sniffing around…')
    }

    return next(e)
  })

  // Waiting on the owner's answer: Stormy raises a paw.
  on('tool.call', async ($, e, next) => {
    const waits = e.tool === 'AskUserQuestion' || e.tool === 'ExitPlanMode'

    if (!waits || petFile === '') {
      return next(e)
    }

    await $.fs.write(petFile, petLine('needs', 'I need your answer!')).catch(() => undefined)
    $.audio.play({ asset: 'sounds/meow-2.wav' }, { gain: 0.6 }).catch(() => undefined)
    const result = await next(e)
    await $.fs.write(petFile, petLine('working', 'Working on it…')).catch(() => undefined)

    return result
  })

  // /pet shows Stormy, or tucks her away if she's already out.
  on('command.run', { command: 'pet' }, async $ => {
    const running = await $.process
      .run(['/usr/bin/pgrep', '-f', 'stormy-pet/bin/stormy-pet'], { timeoutMs: 5000 })
      .then(r => r.exitCode === 0)
      .catch(() => false)

    if (running) {
      await $.fs.write(petFile, petLine('quit')).catch(() => undefined)

      return { text: '🐾 Stormy is tucked away. Type /pet to wake her.' }
    }

    await $.fs.write(petFile, petLine('idle')).catch(() => undefined)
    await $.process.run(['/bin/zsh', '-c', PET_START], { timeoutMs: 10000 }).catch(() => undefined)

    return { text: '🐾 Stormy is awake. Drag her anywhere; click her to come back to Claude.' }
  })

  on('command.run', { command: 'cats' }, async $ => {
    const hidden = await update($, catsHidden, now => !now)

    return { text: hidden ? '🐾 The cats are napping out of sight. Type /cats or click “Show the cats” to bring them back.' : '🐾 The cats are back.' }
  })
}
