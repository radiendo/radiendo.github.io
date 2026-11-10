import random, math, json
random.seed(11)
OUT = '/home/claude/radiendo_v2'
G = dict(
 T="M205 70 Q205 45 230 42 Q260 38 290 42 Q315 45 315 70 L312 150 Q310 172 305 180 Q300 250 280 310 Q270 335 260 338 Q250 335 240 310 Q220 250 215 180 Q210 172 208 150 Z",
 E_OUT="M205 70 Q205 45 230 42 Q260 38 290 42 Q315 45 315 70 L312 150 Q310 168 306 176 L214 176 Q210 168 208 150 Z",
 E_IN="M215 72 Q215 55 232 52 Q260 49 288 52 Q305 55 305 72 L302 150 L302 176 L218 176 L218 150 Z",
 CH="M245 82 Q260 76 275 82 L276 118 Q272 135 268 152 L252 152 Q248 135 244 118 Z",
 CA="M252 152 L268 152 L266 300 Q262 322 260 324 Q258 322 254 300 Z",
 PDL_A="M207 188 Q212 252 233 316 Q246 348 260 350 Q274 348 287 316 Q308 252 313 188 Z",
 PDL_B="M217 188 Q221 252 241 310 Q250 335 260 337 Q270 335 279 310 Q299 252 303 188 Z",
 LD_C="M203 188 Q207 254 229 320 Q244 353 260 355 Q276 353 291 320 Q313 254 317 188 Z",
 PDLW_A="M207 188 Q207 250 222 316 Q244 362 260 364 Q276 362 298 316 Q313 250 313 188 Z",
 LDW_C="M203 188 Q203 252 218 322 Q242 368 260 370 Q278 368 302 322 Q317 252 317 188 Z",
 CREST="M140 182 Q175 180 207 188 L203 202 Q172 198 140 202 Z M380 182 Q345 180 313 188 L317 202 Q348 198 380 202 Z",
 BONE="M0 190 H520 V390 H0 Z",
 PERI="M202 352 a58 34 0 1 0 116 0 a58 34 0 1 0 -116 0 Z",
 CARIE="M200 118 Q226 114 242 128 Q250 140 240 152 Q224 160 200 156 Z",
 REST="M213 60 Q260 50 307 60 L304 74 Q283 82 260 70 Q237 82 216 74 Z",
 LESAO="M222 346 a38 34 0 1 0 76 0 a38 34 0 1 0 -76 0 Z",
 LDEND="M210 312 a14 12 0 1 0 28 0 a14 12 0 1 0 -28 0 Z M282 312 a14 12 0 1 0 28 0 a14 12 0 1 0 -28 0 Z",
)
G['ENAMEL'] = G['E_OUT'] + ' ' + G['E_IN']
G['PDL'] = G['PDL_A'] + ' ' + G['PDL_B']
G['LD'] = G['LD_C'] + ' ' + G['PDL_A']
G['PDLW'] = G['PDLW_A'] + ' ' + G['PDL_B']
G['LDW'] = G['LDW_C'] + ' ' + G['PDLW_A']

def trab():
    s = []
    for _ in range(190):
        x = random.uniform(5, 515); y = random.uniform(205, 385)
        if 185 < x < 335 and y < 375: continue
        L = random.uniform(8, 26); a = random.uniform(-1.3, 1.3)
        col = '#a3aeb3' if random.random() < .6 else '#3b474f'
        s.append(f'<path d="M{x:.0f} {y:.0f} l{L*math.cos(a):.0f} {L*math.sin(a):.0f}" stroke="{col}" stroke-width="{random.uniform(1,2.3):.1f}" stroke-linecap="round" opacity="{random.uniform(.16,.38):.2f}"/>')
    for _ in range(14):
        x = random.uniform(20, 500); y = random.uniform(230, 380)
        if 175 < x < 345: continue
        s.append(f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="{random.uniform(6,14):.0f}" ry="{random.uniform(4,9):.0f}" fill="#2f3a42" opacity=".22"/>')
    return '\n'.join(s)
TRAB = trab()

def svg(variant):
    pdl = G['PDLW'] if variant == 'espessamento' else G['PDL']
    ld = G['LDW'] if variant == 'espessamento' else G['LD']
    clip = ' clip-path="url(#cl)"' if variant == 'lesao' else ''
    extra = ''
    if variant == 'carie':
        extra = f'<path d="{G["CARIE"]}" fill="#11181d" opacity=".9" filter="url(#bl)" clip-path="url(#ct)"/>'
    if variant == 'restauracao':
        extra = f'<path d="{G["REST"]}" fill="#fbfbf6" opacity=".97" stroke="#ffffff" stroke-width="1.5"/>'
    if variant == 'lesao':
        extra = f'<path d="{G["LESAO"]}" fill="#10171c" opacity=".88" filter="url(#bl2)"/>'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 390" role="img" aria-label="Ilustração esquemática de dente e estruturas de suporte ({variant})">
<defs>
<linearGradient id="bg" x2="0" y2="1"><stop offset="0" stop-color="#2a343b"/><stop offset=".5" stop-color="#3b474f"/><stop offset="1" stop-color="#2d383f"/></linearGradient>
<linearGradient id="bone" x2="0" y2="1"><stop offset="0" stop-color="#7d8a91"/><stop offset="1" stop-color="#5a666d"/></linearGradient>
<linearGradient id="tooth" x2="0" y2="1"><stop offset="0" stop-color="#c5cac6"/><stop offset=".6" stop-color="#a7afb0"/><stop offset="1" stop-color="#8b9598"/></linearGradient>
<filter id="bl"><feGaussianBlur stdDeviation="1.6"/></filter><filter id="bl2"><feGaussianBlur stdDeviation="4"/></filter>
<clipPath id="ct"><path d="{G['T']}"/></clipPath><clipPath id="cl"><rect x="0" y="0" width="520" height="318"/></clipPath>
</defs>
<rect width="520" height="390" fill="url(#bg)"/>
<path d="M0 190 H520 V390 H0 Z" fill="url(#bone)"/>
{TRAB}
<path d="{pdl}" fill-rule="evenodd" fill="#161f25" opacity=".88"{clip}/>
<path d="{ld}" fill-rule="evenodd" fill="#d9ded8" opacity=".8"{clip}/>
<path d="{G['CREST']}" fill="#d9ded8" opacity=".78"/>
{extra if variant=='lesao' else ''}
<path d="{G['T']}" fill="url(#tooth)"/>
<path d="{G['ENAMEL']}" fill-rule="evenodd" fill="#f1f2ea" opacity=".95"/>
<path d="{G['CH']} {G['CA']}" fill="#2c373e" opacity=".92"/>
{extra if variant!='lesao' else ''}
</svg>'''

for v in ['normal', 'carie', 'restauracao', 'espessamento', 'lesao']:
    open(f'{OUT}/assets/dente-{v}.svg', 'w', encoding='utf-8').write(svg(v))
js = '/* Gerado automaticamente por gen.py — coordenadas das regiões (viewBox 0 0 520 390) */\nwindow.RADIENDO_GEO = ' + json.dumps(G, ensure_ascii=False, indent=1) + ';\n'
open(f'{OUT}/js/geometria.js', 'w', encoding='utf-8').write(js)
print('ok', list(G))
