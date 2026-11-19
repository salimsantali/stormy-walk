// Draws Stormy's poses for the desktop pet as SVG files.
//   node make-poses.mjs <out folder>
// Stormy: orange tabby, white chest, front legs, paws and muzzle, amber eyes,
// pink-lined ears, pink collar with a silver bell. Bold ink outlines.
import fs from 'node:fs'
import path from 'node:path'

const out = process.argv[2] ?? '.'
const OR = '#f4a443', ORS = '#dc8530', ST = '#c96a1f', WH = '#fffaf3', INK = '#2e1d14'
const ink = (w) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`

const shadow = `<ellipse cx="120" cy="226" rx="72" ry="8" fill="#000" opacity=".16"/>`
const tail = `<path d="M158 206 C 205 206, 216 160, 190 138" ${ink(15)} fill="none"/>
<path d="M158 206 C 205 206, 216 160, 190 138" stroke="${OR}" stroke-width="9" fill="none" stroke-linecap="round"/>
<path d="M199 176 l9 2 M196 155 l8 -1" stroke="${ST}" stroke-width="3.5" stroke-linecap="round"/>`
const body = `<path d="M78 214 C 70 160, 90 122, 120 122 C 150 122, 170 160, 162 214 Z" fill="${OR}" ${ink(3.5)}/>
<path d="M82 196 Q 120 222 158 196 L 160 212 Q 120 220 80 212 Z" fill="${ORS}" opacity=".5"/>
<path d="M101 130 C 94 160, 100 192, 120 202 C 140 192, 146 160, 139 130 Z" fill="${WH}"/>
<path d="M84 168 q9 4 11 13 M87 148 q8 3 9 10 M156 168 q-9 4 -11 13 M153 148 q-8 3 -9 10" stroke="${ST}" stroke-width="4" fill="none" stroke-linecap="round"/>`
const legL = `<rect x="97" y="170" width="19" height="47" rx="9.5" fill="${WH}" ${ink(3.5)}/><path d="M103 212 v4 M110 212 v4" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`
const legR = `<rect x="124" y="170" width="19" height="47" rx="9.5" fill="${WH}" ${ink(3.5)}/><path d="M130 212 v4 M137 212 v4" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`
// Right front paw raised up beside the face: "I need you".
const legRaised = `<g transform="rotate(-150 133 172)"><rect x="124" y="170" width="19" height="47" rx="9.5" fill="${WH}" ${ink(3.5)}/><path d="M130 212 v4 M137 212 v4" stroke="${INK}" stroke-width="2" stroke-linecap="round"/></g>`
const collar = `<path d="M86 122 Q 120 144 154 122" ${ink(10)} fill="none"/>
<path d="M86 122 Q 120 144 154 122" stroke="#f592b0" stroke-width="6" fill="none" stroke-linecap="round"/>
<circle cx="120" cy="140" r="7" fill="#dfe3ea" ${ink(2.5)}/><path d="M116 142 h8" stroke="${INK}" stroke-width="1.5"/>`
const ears = (back = false) => back
  ? `<path d="M72 78 L52 40 L100 52 Z" fill="${OR}" ${ink(3.5)}/><path d="M76 70 L62 48 L92 54 Z" fill="#f4a1b2"/>
<path d="M140 52 L188 40 L168 78 Z" fill="${OR}" ${ink(3.5)}/><path d="M148 54 L178 48 L164 70 Z" fill="#f4a1b2"/>`
  : `<path d="M75 72 L68 16 L110 46 Z" fill="${OR}" ${ink(3.5)}/><path d="M80 58 L76 28 L100 46 Z" fill="#f4a1b2"/>
<path d="M130 46 L172 16 L165 72 Z" fill="${OR}" ${ink(3.5)}/><path d="M140 46 L164 28 L160 58 Z" fill="#f4a1b2"/>`
const head = `<circle cx="120" cy="82" r="51" fill="${OR}" ${ink(3.5)}/>
<path d="M108 37 v12 M120 34 v15 M132 37 v12" stroke="${ST}" stroke-width="4" stroke-linecap="round"/>
<path d="M120 44 C 113 62, 111 80, 108 96 L 132 96 C 129 80, 127 62, 120 44 Z" fill="${WH}"/>
<ellipse cx="120" cy="106" rx="30" ry="19" fill="${WH}"/>
<ellipse cx="84" cy="98" rx="8" ry="4.5" fill="#f58fa5" opacity=".55"/><ellipse cx="156" cy="98" rx="8" ry="4.5" fill="#f58fa5" opacity=".55"/>
<path d="M113.5 94 h13 l-6.5 7.5 z" fill="#ef8f9c" ${ink(1.8)}/>
<path d="M92 101 L50 93 M92 107 L48 111 M148 101 L190 93 M148 107 L192 111" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`
const eyesOpen = (look = 0) => `<circle cx="97" cy="77" r="13.5" fill="#f6bb3c" ${ink(2.8)}/><circle cx="143" cy="77" r="13.5" fill="#f6bb3c" ${ink(2.8)}/>
<ellipse cx="${98.5 + look}" cy="78" rx="4.6" ry="9" fill="${INK}"/><ellipse cx="${144.5 + look}" cy="78" rx="4.6" ry="9" fill="${INK}"/>
<circle cx="${101.5 + look}" cy="72" r="3.6" fill="#fff"/><circle cx="${147.5 + look}" cy="72" r="3.6" fill="#fff"/>`
const eyesClosed = `<path d="M85 79 q12 9 24 0 M131 79 q12 9 24 0" ${ink(3.5)} fill="none"/>`
const eyesWorried = `<circle cx="97" cy="79" r="12" fill="#f6bb3c" ${ink(2.8)}/><circle cx="143" cy="79" r="12" fill="#f6bb3c" ${ink(2.8)}/>
<circle cx="98" cy="80" r="3.4" fill="${INK}"/><circle cx="142" cy="80" r="3.4" fill="${INK}"/>
<path d="M84 64 L106 56 M156 64 L134 56" ${ink(3.5)} fill="none"/>`
const mouthSmile = `<path d="M120 102 q-6 7 -12 2 M120 102 q6 7 12 2" ${ink(2.2)} fill="none"/>`
const mouthOpen = `<path d="M112 104 q8 12 16 0 z" fill="#d9566e" ${ink(2.2)}/>`
const mouthFrown = `<path d="M110 110 q10 -7 20 0" ${ink(2.4)} fill="none"/>`
const sweat = `<path d="M170 52 c -6 9 -6 15 0 17 c 6 -2 6 -8 0 -17 z" fill="#8fd0f5" ${ink(2)}/>`
const envelope = `<g transform="rotate(-7 120 124)">
<rect x="84" y="106" width="72" height="44" rx="4" fill="#fffdf8" ${ink(3.2)}/>
<path d="M86 109 L120 132 L154 109" ${ink(2.6)} fill="none"/>
<path d="M86 148 L110 128 M154 148 L130 128" stroke="${INK}" stroke-width="1.6" opacity=".45"/>
<path d="M120 128 c -3 -5 -10 -3 -9 2 c 1 4 9 8 9 8 c 0 0 8 -4 9 -8 c 1 -5 -6 -7 -9 -2 z" fill="#e8506a" ${ink(1.6)}/></g>
<path d="M100 104 q 10 8 20 2 q 10 6 20 -2" fill="${WH}" ${ink(2.4)}/>
<path d="M112 108 l2 5 l2 -4 M124 109 l2 4 l2 -5" fill="#fff" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/>`
// Just a keyboard in front of Stormy (no screen), an old-style white one, with both paws on the keys: "working".
const keys = (() => {
  let k = ''
  const rows = [[193, 64, 176, 11], [199.5, 60, 180, 12], [206, 56, 184, 12]]
  for (const [y, x0, x1, n] of rows) {
    const w = (x1 - x0 - (n - 1) * 2.4) / n
    for (let i = 0; i < n; i++) k += `<rect x="${(x0 + i * (w + 2.4)).toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="4.6" rx="1.2" fill="#ffffff" stroke="#b9b1a4" stroke-width=".8"/>`
  }
  return k + `<rect x="92" y="212.5" width="56" height="3.6" rx="1.2" fill="#ffffff" stroke="#b9b1a4" stroke-width=".8"/>`
})()
const laptop = `<path d="M60 186 L180 186 L194 219 L46 219 Z" fill="#efeae0" ${ink(3.2)}/>
<path d="M50 214 L190 214" stroke="#d6cfc2" stroke-width="2"/>
${keys}
<ellipse cx="100" cy="196" rx="11.5" ry="7.5" fill="${WH}" ${ink(3)}/><ellipse cx="140" cy="196" rx="11.5" ry="7.5" fill="${WH}" ${ink(3)}/>
<path d="M96 199 v3 M104 199 v3 M136 199 v3 M144 199 v3" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`

const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">${inner}</svg>`
const front = (opts) => svg([
  shadow, tail, body,
  opts.laptop ? '' : legL,
  opts.laptop ? '' : (opts.raised ? legRaised : legR),
  collar, ears(opts.earsBack), head,
  opts.eyes, opts.mouth ?? mouthSmile, opts.extra ?? '',
  opts.laptop ? laptop : '',
].join('\n'))

const poses = {
  'idle': front({ eyes: eyesOpen() }),
  'idle-blink': front({ eyes: eyesClosed }),
  'sleep': front({ eyes: eyesClosed, mouth: `<path d="M114 104 q6 4 12 0" ${ink(2)} fill="none"/>` }),
  'working': front({ eyes: eyesOpen(), laptop: true }),
  'working-blink': front({ eyes: eyesClosed, laptop: true }),
  'needs': front({ eyes: eyesOpen(2), raised: true, mouth: mouthOpen }),
  'needs-blink': front({ eyes: eyesClosed, raised: true, mouth: mouthOpen }),
  'ready': front({ eyes: eyesOpen(), mouth: '', extra: envelope }),
  'ready-blink': front({ eyes: eyesClosed, mouth: '', extra: envelope }),
  'problem': front({ eyes: eyesWorried, earsBack: true, mouth: mouthFrown, extra: sweat }),
}

fs.mkdirSync(out, { recursive: true })
for (const [name, text] of Object.entries(poses)) fs.writeFileSync(path.join(out, `${name}.svg`), text)
console.log(Object.keys(poses).join(' '))
