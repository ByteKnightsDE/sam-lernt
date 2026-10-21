/* Sam lernt – die Figuren: BluppBlupp (das blaue Nilpferd), Herr Zinn (sein Onkel mit der Laterne),
   Roboter Klonk, Hexe Holunder, Kaninchen Hoppel – und Rosi (fliegendes Schwein), Bobo (Affe), Klapper (Skelett),
   Pirat Paul, Krebs Kasimir und Hummer Hubert.
   Gezeichnet nach Marcs Vorlage in bilder/zauberwald.jpg. Ohne Verläufe/Filter mit IDs, damit beliebig viele
   Figuren gleichzeitig auf dem Bildschirm sein können. */

const FIG={
blupp:`<path class="tail" d="M71 74 q8 1 7 7" fill="none" stroke="#6fb2bf" stroke-width="3" stroke-linecap="round"/>
<rect x="35" y="80" width="12" height="15" rx="6" fill="#74b7c4"/><rect x="53" y="80" width="12" height="15" rx="6" fill="#74b7c4"/>
<ellipse cx="41" cy="94" rx="6.5" ry="2.6" fill="#5f9fad"/><ellipse cx="59" cy="94" rx="6.5" ry="2.6" fill="#5f9fad"/>
<ellipse cx="50" cy="67" rx="23" ry="21" fill="#86c6d2"/>
<ellipse cx="50" cy="72" rx="14" ry="13" fill="#a3d6df"/>
<g class="arm al"><ellipse cx="29" cy="66" rx="5.5" ry="9" transform="rotate(18 29 66)" fill="#7dbfcb"/></g>
<g class="arm ar"><ellipse cx="71" cy="66" rx="5.5" ry="9" transform="rotate(-18 71 66)" fill="#7dbfcb"/></g>
<g class="ear el"><circle cx="34" cy="21" r="5.5" fill="#74b7c4"/><circle cx="34" cy="21.5" r="2.8" fill="#f2b8b4"/></g>
<g class="ear er"><circle cx="66" cy="21" r="5.5" fill="#74b7c4"/><circle cx="66" cy="21.5" r="2.8" fill="#f2b8b4"/></g>
<ellipse cx="50" cy="35" rx="21" ry="17" fill="#86c6d2"/>
<ellipse cx="50" cy="44.5" rx="20" ry="12.5" fill="#a3d6df"/>
<circle cx="31.5" cy="42" r="4.2" fill="#f4a3a3" opacity=".55"/><circle cx="68.5" cy="42" r="4.2" fill="#f4a3a3" opacity=".55"/>
<g class="eyes"><circle cx="41" cy="30.5" r="3" fill="#2f3340"/><circle cx="59" cy="30.5" r="3" fill="#2f3340"/>
<circle cx="42.1" cy="29.3" r="1" fill="#fff"/><circle cx="60.1" cy="29.3" r="1" fill="#fff"/></g>
<ellipse cx="44.5" cy="41" rx="1.7" ry="2.3" fill="#4f8792"/><ellipse cx="55.5" cy="41" rx="1.7" ry="2.3" fill="#4f8792"/>
<path class="mouth" d="M43 49.5 q7 5 14 0" fill="none" stroke="#4f8792" stroke-width="2.2" stroke-linecap="round"/>`,

zinn:`<ellipse cx="41" cy="96" rx="7.5" ry="3" fill="#6b4a33"/><ellipse cx="59" cy="96" rx="7.5" ry="3" fill="#6b4a33"/>
<rect x="38" y="80" width="6.5" height="15" rx="2" fill="#7c5c45"/><rect x="55.5" y="80" width="6.5" height="15" rx="2" fill="#7c5c45"/>
<path d="M39 83h5.5M39 87h5.5M39 91h5.5M55.5 83h6.5M55.5 87h6.5M55.5 91h6.5" stroke="#a1826a" stroke-width="1.2"/>
<path d="M30 50 Q50 42 70 50 L75 85 Q50 90 25 85Z" fill="#5f9e8a"/>
<path d="M50 49 L50 87" stroke="#4b8573" stroke-width="1.6"/>
<path d="M50 50 L43 62 M50 50 L57 62" stroke="#4b8573" stroke-width="1.4" fill="none"/>
<rect x="31" y="70" width="10" height="8" rx="2" fill="#568f7c" stroke="#4b8573" stroke-width="1"/>
<rect x="59" y="70" width="10" height="8" rx="2" fill="#568f7c" stroke="#4b8573" stroke-width="1"/>
<circle cx="52.5" cy="66" r="1.2" fill="#e9d9b8"/><circle cx="52.5" cy="74" r="1.2" fill="#e9d9b8"/>
<g class="arm al"><path d="M31 52 Q25 64 29 76" stroke="#5f9e8a" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="29.5" cy="77" r="3.3" fill="#f3c9ae"/></g>
<g class="lantern">
  <circle class="glow g1" cx="80" cy="76" r="17" fill="#ffd77e" opacity=".16"/>
  <circle class="glow g2" cx="80" cy="76" r="11" fill="#ffd77e" opacity=".28"/>
  <path d="M75 66 q5 -6 10 0" stroke="#6b4a33" stroke-width="1.6" fill="none"/>
  <rect x="74.5" y="67" width="11" height="3" rx="1" fill="#7a4e33"/>
  <rect x="75.5" y="70" width="9" height="12" rx="2" fill="#ffe2a0" stroke="#7a4e33" stroke-width="1.6"/>
  <path class="flame" d="M80 79 q-2.5 -3 0 -6.5 q2.5 3.5 0 6.5z" fill="#ff9d3c"/>
  <rect x="74.5" y="82" width="11" height="2.6" rx="1" fill="#7a4e33"/>
</g>
<g class="arm ar"><path d="M69 52 Q76 58 79 66" stroke="#5f9e8a" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="79.5" cy="66" r="3.3" fill="#f3c9ae"/></g>
<ellipse cx="37" cy="36" rx="4" ry="5" fill="#ece7dd"/><ellipse cx="63" cy="36" rx="4" ry="5" fill="#ece7dd"/>
<circle cx="50" cy="35" r="12.5" fill="#f3c9ae"/>
<path d="M37 39 Q37 58 50 61 Q63 58 63 39 Q58 46 50 46 Q42 46 37 39Z" fill="#f4f1ea"/>
<path d="M42 50 q2 3 0 6 M50 52 q2 3 0 6 M58 50 q-2 3 0 6" stroke="#ddd6c8" stroke-width="1.1" fill="none"/>
<circle cx="42" cy="40" r="2.6" fill="#f0a2a0" opacity=".6"/><circle cx="58" cy="40" r="2.6" fill="#f0a2a0" opacity=".6"/>
<g class="eyes"><circle cx="45" cy="33.5" r="1.5" fill="#3b2a2a"/><circle cx="55" cy="33.5" r="1.5" fill="#3b2a2a"/></g>
<path d="M42.5 30.5 q2.5 -1.6 5 0 M52.5 30.5 q2.5 -1.6 5 0" stroke="#ece7dd" stroke-width="1.6" fill="none" stroke-linecap="round"/>
<path class="mouth" d="M46.5 45 q3.5 2.2 7 0" stroke="#b57d72" stroke-width="1.4" fill="none" stroke-linecap="round"/>
<circle cx="50" cy="39.5" r="4.4" fill="#ec8a82"/><circle cx="48.7" cy="38.2" r="1.2" fill="#fff" opacity=".7"/>
<ellipse cx="50" cy="26" rx="21" ry="5" fill="#86603f"/>
<path d="M35 25 Q37 7 54 3 Q68 1 77 13 Q69 9 64 12 Q65 19 65 25 Q50 28 35 25Z" fill="#9c7049"/>
<path d="M36 24 Q50 27 64.5 24" stroke="#7a5536" stroke-width="2.2" fill="none"/>
<path d="M46 12 l1.2 2.4 2.6 .3 -1.9 1.8 .5 2.6 -2.4 -1.3 -2.4 1.3 .5 -2.6 -1.9 -1.8 2.6 -.3z" fill="#e7c46a" opacity=".9"/>`,

klonk:`<rect x="47.5" y="4" width="5" height="10" rx="2" fill="#8a9bb0"/>
<circle class="led" cx="50" cy="5" r="4.2" fill="#ff8c69"/>
<rect x="30" y="14" width="40" height="30" rx="10" fill="#c9d6e3" stroke="#7d8fa6" stroke-width="2"/>
<rect x="35" y="20" width="30" height="17" rx="7" fill="#2f3b52"/>
<g class="eyes"><circle cx="43" cy="28.5" r="4" fill="#7ef2e6"/><circle cx="57" cy="28.5" r="4" fill="#7ef2e6"/>
<circle cx="44.3" cy="27.2" r="1.3" fill="#fff"/><circle cx="58.3" cy="27.2" r="1.3" fill="#fff"/></g>
<rect class="mouth" x="44" y="38.5" width="12" height="2.6" rx="1.3" fill="#7d8fa6"/>
<circle cx="27" cy="29" r="4" fill="#9fb2c6"/><circle cx="73" cy="29" r="4" fill="#9fb2c6"/>
<rect x="46" y="44" width="8" height="5" fill="#7d8fa6"/>
<g class="arm al"><path d="M28 56 Q17 62 18 74" stroke="#9fb2c6" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="18" cy="76" r="5" fill="none" stroke="#7d8fa6" stroke-width="3"/></g>
<g class="arm ar"><path d="M72 56 Q83 62 82 74" stroke="#9fb2c6" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="82" cy="76" r="5" fill="none" stroke="#7d8fa6" stroke-width="3"/></g>
<rect x="27" y="48" width="46" height="34" rx="9" fill="#d9e3ed" stroke="#7d8fa6" stroke-width="2"/>
<rect x="35" y="54" width="30" height="15" rx="4" fill="#eef3f8" stroke="#b6c4d3" stroke-width="1.5"/>
<circle class="led l1" cx="42" cy="61.5" r="2.6" fill="#ffd54f"/><circle class="led l2" cx="50" cy="61.5" r="2.6" fill="#81c784"/><circle class="led l3" cx="58" cy="61.5" r="2.6" fill="#64b5f6"/>
<circle cx="50" cy="75" r="3" fill="#ffb199"/>
<rect x="33" y="82" width="12" height="9" rx="3" fill="#9fb2c6"/><rect x="55" y="82" width="12" height="9" rx="3" fill="#9fb2c6"/>
<rect x="30" y="90" width="18" height="6" rx="3" fill="#7d8fa6"/><rect x="52" y="90" width="18" height="6" rx="3" fill="#7d8fa6"/>`,

holunder:`<path d="M24 97 Q30 60 50 52 Q70 60 76 97Z" fill="#7d5ba6"/>
<path d="M30 92 Q50 98 70 92" stroke="#5f4387" stroke-width="2" fill="none"/>
<circle cx="38" cy="80" r="1.6" fill="#ffd77e"/><circle cx="60" cy="70" r="1.4" fill="#ffd77e"/><circle cx="64" cy="86" r="1.6" fill="#ffd77e"/>
<g class="arm al"><path d="M33 62 Q22 70 24 80" stroke="#7d5ba6" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="24" cy="81" r="3.3" fill="#c6e3b4"/></g>
<g class="broom"><path d="M80 40 L72 96" stroke="#8d6748" stroke-width="2.6" stroke-linecap="round"/><path d="M71 88 Q64 98 66 99 L78 99 Q80 97 74 88Z" fill="#d8b56a"/></g>
<g class="arm ar"><path d="M67 62 Q76 64 78 54" stroke="#7d5ba6" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="78" cy="53" r="3.3" fill="#c6e3b4"/></g>
<path d="M34 34 Q30 54 38 60 L62 60 Q70 54 66 34Z" fill="#e8743c"/>
<circle cx="50" cy="40" r="13" fill="#c6e3b4"/>
<circle cx="43" cy="44" r="2.6" fill="#f0a2a0" opacity=".6"/><circle cx="57" cy="44" r="2.6" fill="#f0a2a0" opacity=".6"/>
<g class="eyes"><circle cx="45" cy="38" r="2" fill="#3b2a3a"/><circle cx="55" cy="38" r="2" fill="#3b2a3a"/><circle cx="45.7" cy="37.3" r=".7" fill="#fff"/><circle cx="55.7" cy="37.3" r=".7" fill="#fff"/></g>
<path d="M50 39 q4 4 1 7" stroke="#9cc48a" stroke-width="2.2" fill="none" stroke-linecap="round"/>
<path class="mouth" d="M45 47.5 q5 3.4 10 0" stroke="#7a4b5a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
<path d="M33 33 Q33 28 50 28 Q67 28 67 33 Q50 37 33 33Z" fill="#4b3463"/>
<path class="hat" d="M38 31 L52 2 Q55 8 58 10 L62 31Z" fill="#5c3f7a"/>
<path d="M39 28 L61 28 L62 31 L38 31Z" fill="#e8b84a"/>
<path d="M53 15 l1 2 2.2 .2 -1.6 1.5 .4 2.2 -2 -1.1 -2 1.1 .4 -2.2 -1.6 -1.5 2.2 -.2z" fill="#ffd77e"/>`,

hoppel:`<ellipse cx="50" cy="94" rx="20" ry="3" fill="#000" opacity=".08"/>
<g class="ear el"><ellipse cx="41" cy="20" rx="6" ry="17" transform="rotate(-10 41 20)" fill="#f2ece4"/><ellipse cx="41" cy="21" rx="3" ry="12" transform="rotate(-10 41 21)" fill="#f6c3c6"/></g>
<g class="ear er"><ellipse cx="59" cy="20" rx="6" ry="17" transform="rotate(12 59 20)" fill="#f2ece4"/><ellipse cx="59" cy="21" rx="3" ry="12" transform="rotate(12 59 21)" fill="#f6c3c6"/></g>
<circle class="tail" cx="71" cy="80" r="6" fill="#fff"/>
<ellipse cx="50" cy="74" rx="21" ry="19" fill="#e9e1d6"/>
<ellipse cx="50" cy="78" rx="12" ry="12" fill="#f8f4ee"/>
<ellipse cx="40" cy="92" rx="8" ry="4" fill="#f2ece4"/><ellipse cx="60" cy="92" rx="8" ry="4" fill="#f2ece4"/>
<g class="arm al"><ellipse cx="38" cy="70" rx="4" ry="7" fill="#e3d9cb"/></g>
<g class="arm ar"><ellipse cx="62" cy="70" rx="4" ry="7" fill="#e3d9cb"/></g>
<circle cx="50" cy="46" r="17" fill="#f2ece4"/>
<circle cx="39" cy="51" r="3.6" fill="#f4a3a3" opacity=".55"/><circle cx="61" cy="51" r="3.6" fill="#f4a3a3" opacity=".55"/>
<g class="eyes"><circle cx="43" cy="44" r="2.8" fill="#3b2a2a"/><circle cx="57" cy="44" r="2.8" fill="#3b2a2a"/><circle cx="44" cy="43" r="1" fill="#fff"/><circle cx="58" cy="43" r="1" fill="#fff"/></g>
<path d="M47.5 50 h5 l-2.5 3z" fill="#e88a9a"/>
<path class="mouth" d="M50 53 v2.5 M46 55.5 q4 3 8 0" stroke="#a87c74" stroke-width="1.4" fill="none" stroke-linecap="round"/>
<path d="M45 52 l-10 -2 M45 54 l-10 1 M55 52 l10 -2 M55 54 l10 1" stroke="#cfc4b6" stroke-width=".8"/>
<path d="M46 57 h3.5 v3 h-3.5z M50.5 57 h3.5 v3 h-3.5z" fill="#fff" stroke="#e0d6c8" stroke-width=".5"/>`,
pig:`<g class="wing wl"><path d="M32 52 Q8 26 3 42 Q12 44 9 53 Q18 51 32 60Z" fill="#fff" stroke="#9fb3d6" stroke-width="2.5" stroke-linejoin="round"/></g>
<g class="wing wr"><path d="M68 52 Q92 26 97 42 Q88 44 91 53 Q82 51 68 60Z" fill="#fff" stroke="#9fb3d6" stroke-width="2.5" stroke-linejoin="round"/></g>
<path class="tail" d="M77 66 q11 -1 9 -10 q-2 -6 -7 -2" fill="none" stroke="#e57fa0" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="50" cy="67" rx="28" ry="21" fill="#f7a8c4"/>
<rect x="33" y="80" width="8" height="13" rx="3" fill="#e88aac"/><rect x="59" y="80" width="8" height="13" rx="3" fill="#e88aac"/>
<path d="M31 32 L25 13 L44 24Z" fill="#e88aac"/><path d="M69 32 L75 13 L56 24Z" fill="#e88aac"/>
<circle cx="50" cy="41" r="22" fill="#f9b6cd"/>
<circle cx="35" cy="46" r="4" fill="#ff8fb0" opacity=".6"/><circle cx="65" cy="46" r="4" fill="#ff8fb0" opacity=".6"/>
<circle cx="41" cy="36" r="3.6" fill="#3b2a2a"/><circle cx="59" cy="36" r="3.6" fill="#3b2a2a"/>
<circle cx="42.3" cy="34.7" r="1.2" fill="#fff"/><circle cx="60.3" cy="34.7" r="1.2" fill="#fff"/>
<ellipse cx="50" cy="48" rx="10" ry="7" fill="#f28db2" stroke="#e07aa0" stroke-width="1.5"/>
<ellipse cx="46.5" cy="48" rx="2" ry="3" fill="#b85a7c"/><ellipse cx="53.5" cy="48" rx="2" ry="3" fill="#b85a7c"/>`,

monkey:`<path class="tail" d="M68 80 q24 4 20 -17 q-3 -10 -10 -4" fill="none" stroke="#8d5a3b" stroke-width="5" stroke-linecap="round"/>
<ellipse cx="50" cy="78" rx="20" ry="17" fill="#8d5a3b"/><ellipse cx="50" cy="81" rx="12" ry="10" fill="#e8c39e"/>
<circle cx="24" cy="40" r="10" fill="#8d5a3b"/><circle cx="24" cy="40" r="6" fill="#e8c39e"/>
<circle cx="76" cy="40" r="10" fill="#8d5a3b"/><circle cx="76" cy="40" r="6" fill="#e8c39e"/>
<path d="M44 18 q6 -12 12 0" fill="#8d5a3b"/>
<circle cx="50" cy="41" r="25" fill="#8d5a3b"/>
<path d="M50 27 c-12 -6 -22 2 -20 12 c-4 6 -2 18 20 20 c22 -2 24 -14 20 -20 c2 -10 -8 -18 -20 -12z" fill="#e8c39e"/>
<circle cx="42" cy="37" r="3.6" fill="#3b2a2a"/><circle cx="58" cy="37" r="3.6" fill="#3b2a2a"/>
<circle cx="43.3" cy="35.7" r="1.2" fill="#fff"/><circle cx="59.3" cy="35.7" r="1.2" fill="#fff"/>
<circle cx="47" cy="46" r="1.4" fill="#5a3522"/><circle cx="53" cy="46" r="1.4" fill="#5a3522"/>
<path class="mouth" d="M40 51 q10 9 20 0" fill="none" stroke="#5a3522" stroke-width="2.6" stroke-linecap="round"/>`,

skel:`<g class="arm al"><path d="M39 59 L23 73" stroke="#fafafa" stroke-width="5" stroke-linecap="round"/><circle cx="22" cy="74" r="4.5" fill="#fafafa"/></g>
<g class="arm ar"><path d="M61 59 L77 73" stroke="#fafafa" stroke-width="5" stroke-linecap="round"/><circle cx="78" cy="74" r="4.5" fill="#fafafa"/></g>
<path d="M50 52 V84" stroke="#fafafa" stroke-width="5"/>
<path d="M38 59 q12 6 24 0 M39 66 q11 5 22 0 M41 73 q9 4 18 0" fill="none" stroke="#fafafa" stroke-width="4" stroke-linecap="round"/>
<path d="M40 83 q10 8 20 0" stroke="#fafafa" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M43 86 L38 97 M57 86 L62 97" stroke="#fafafa" stroke-width="5" stroke-linecap="round"/>
<path d="M30 30 a20 20 0 0 1 40 0 v8 q0 6 -6 8 v4 h-28 v-4 q-6 -2 -6 -8z" fill="#fafafa"/>
<circle cx="42" cy="32" r="6.5" fill="#333"/><circle cx="58" cy="32" r="6.5" fill="#333"/>
<circle cx="43.6" cy="30.8" r="2" fill="#fff"/><circle cx="59.6" cy="30.8" r="2" fill="#fff"/>
<path d="M50 38 l-3 5 h6z" fill="#333"/>
<g class="jaw"><rect x="38" y="46" width="24" height="8" rx="3" fill="#fafafa"/><path d="M44 46v8M50 46v8M56 46v8" stroke="#9e9e9e" stroke-width="1.5"/></g>`,

pirate:`<path d="M24 99 q2 -27 26 -29 q24 2 26 29z" fill="#4f8fb5"/>
<path d="M29 86h42M26 94h48" stroke="#fff" stroke-width="4"/>
<circle cx="50" cy="48" r="22" fill="#f6c9a0"/>
<path d="M30 52 q2 22 20 24 q18 -2 20 -24 q-6 8 -20 8 q-14 0 -20 -8z" fill="#6d3f1f"/>
<path class="mouth" d="M43 61 q7 5 14 0" stroke="#3b2a2a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<path d="M37 57 q7 -6 13 0 q6 -6 13 0 q-7 3 -13 0 q-6 3 -13 0z" fill="#5a3218"/>
<circle cx="50" cy="51" r="3.6" fill="#eaa77f"/>
<circle cx="58" cy="43" r="3.5" fill="#3b2a2a"/><circle cx="59.2" cy="41.8" r="1.2" fill="#fff"/>
<path d="M30 35 L70 46" stroke="#222" stroke-width="2"/><ellipse cx="42" cy="43" rx="6.5" ry="5.5" fill="#222"/>
<path d="M27 42 q2 -22 23 -22 q21 0 23 22 q-23 -8 -46 0z" fill="#d9675a"/>
<circle cx="41" cy="30" r="2" fill="#fff"/><circle cx="55" cy="27" r="2" fill="#fff"/><circle cx="64" cy="34" r="2" fill="#fff"/>
<path d="M72 36 l13 -5 l-4 11z M72 39 l11 8 l-13 1z" fill="#b8564a"/>
<circle cx="28" cy="53" r="3.2" fill="none" stroke="#e7c46a" stroke-width="2.2"/>`,

krebs:`<g class="arm al"><path d="M30 60 Q14 52 16 38" stroke="#e0705a" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M16 40 q-9 -6 -6 -16 q7 2 9 9 q2 -9 9 -10 q3 9 -6 17z" fill="#e8806a"/></g>
<g class="arm ar"><path d="M70 60 Q86 52 84 38" stroke="#e0705a" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M84 40 q9 -6 6 -16 q-7 2 -9 9 q-2 -9 -9 -10 q-3 9 6 17z" fill="#e8806a"/></g>
<path d="M30 72 l-12 8 M32 78 l-10 10 M70 72 l12 8 M68 78 l10 10" stroke="#d0644f" stroke-width="3.5" stroke-linecap="round"/>
<ellipse cx="50" cy="70" rx="24" ry="17" fill="#ee8a72"/><ellipse cx="50" cy="74" rx="15" ry="9" fill="#f6b2a0"/>
<path d="M42 54 V44 M58 54 V44" stroke="#d0644f" stroke-width="3" stroke-linecap="round"/>
<g class="eyes"><circle cx="42" cy="42" r="5" fill="#fff"/><circle cx="58" cy="42" r="5" fill="#fff"/><circle cx="43" cy="43" r="2.4" fill="#2f3340"/><circle cx="57" cy="43" r="2.4" fill="#2f3340"/></g>
<circle cx="38" cy="72" r="3" fill="#f4a3a3" opacity=".6"/><circle cx="62" cy="72" r="3" fill="#f4a3a3" opacity=".6"/>
<path class="mouth" d="M44 66 q6 5 12 0" stroke="#a5473a" stroke-width="2" fill="none" stroke-linecap="round"/>`,

hummer:`<path d="M50 70 L50 96 M50 88 l-10 8 M50 88 l10 8" stroke="#b8453a" stroke-width="5" stroke-linecap="round"/>
<path d="M38 92 L50 99 L62 92 L50 86Z" fill="#c9503f"/>
<g class="arm al"><path d="M36 50 Q20 46 18 32" stroke="#c9503f" stroke-width="5" fill="none" stroke-linecap="round"/>
<ellipse cx="17" cy="24" rx="8" ry="12" fill="#d65c48"/><path d="M13 14 L17 26 L22 14" stroke="#fbe9e4" stroke-width="2.4" fill="none"/></g>
<g class="arm ar"><path d="M64 50 Q80 46 82 32" stroke="#c9503f" stroke-width="5" fill="none" stroke-linecap="round"/>
<ellipse cx="83" cy="24" rx="8" ry="12" fill="#d65c48"/><path d="M78 14 L83 26 L87 14" stroke="#fbe9e4" stroke-width="2.4" fill="none"/></g>
<path d="M36 64 l-12 4 M36 70 l-11 8 M64 64 l12 4 M64 70 l11 8" stroke="#b8453a" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="50" cy="60" rx="16" ry="20" fill="#d65c48"/><path d="M38 66 h24 M39 73 h22 M42 79 h16" stroke="#b8453a" stroke-width="2"/>
<path class="fuehler" d="M44 30 Q30 10 12 6 M56 30 Q70 10 88 6" stroke="#b8453a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
<ellipse cx="50" cy="40" rx="15" ry="13" fill="#e06a55"/>
<g class="eyes"><circle cx="44" cy="35" r="4.5" fill="#fff"/><circle cx="56" cy="35" r="4.5" fill="#fff"/><circle cx="45" cy="36" r="2.2" fill="#2f3340"/><circle cx="55" cy="36" r="2.2" fill="#2f3340"/></g>
<path class="mouth" d="M43 45 q7 7 14 0 q-7 3 -14 0z" fill="#7a2a24"/>
<circle cx="38" cy="43" r="2.6" fill="#f4a3a3" opacity=".7"/><circle cx="62" cy="43" r="2.6" fill="#f4a3a3" opacity=".7"/>`
};

// Wie die Figuren heißen und klingen. count:false – Herr Zinn wird nicht abgezählt („drei Herr Zinns“ klingt schief)
const CHAR={
  blupp:{name:'BluppBlupp',sg:'ein blaues Nilpferd',pl:'blaue Nilpferde',who:'das blaue Nilpferd',sound:()=>sfx.blubb()},
  zinn:{name:'Herr Zinn',sg:'Herr Zinn',pl:'Herr Zinn',who:'BluppBlupps Onkel mit der Laterne',count:false,sound:()=>sfx.zinn()},
  klonk:{name:'Klonk',sg:'ein Roboter',pl:'Roboter',who:'der Roboter aus der Bergwerkstatt',sound:()=>sfx.klonk()},
  holunder:{name:'Hexe Holunder',sg:'Hexe Holunder',pl:'Hexe Holunder',who:'die freundliche Hexe aus dem Hexenhaus',count:false,sound:()=>sfx.hexe()},
  hoppel:{name:'Hoppel',sg:'ein Kaninchen',pl:'Kaninchen',who:'das Kaninchen von der Wiese',sound:()=>sfx.hoppel()},
  pig:{name:'Rosi',sg:'ein fliegendes Schwein',pl:'fliegende Schweine',who:'das fliegende Schwein',sound:()=>sfx.oink()},
  monkey:{name:'Bobo',sg:'ein Affe',pl:'Affen',who:'der Affe',sound:()=>sfx.monkey()},
  skel:{name:'Klapper',sg:'ein Skelett',pl:'Skelette',who:'das Skelett aus der Klapperhöhle',sound:()=>sfx.rattle()},
  pirate:{name:'Pirat Paul',sg:'ein Pirat',pl:'Piraten',who:'der Pirat aus der Piratenbucht',sound:()=>sfx.arr()},
  krebs:{name:'Kasimir',sg:'ein Krebs',pl:'Krebse',who:'der Krebs aus der Piratenbucht',sound:()=>sfx.zwick()},
  hummer:{name:'Hubert',sg:'ein Hummer',pl:'Hummer',who:'der Hummer, der immer Witze erzählt',count:false,sound:()=>sfx.hummer()}
};
// Wer mit welcher Stimme spricht (siehe ki-server/src/stimmen.js)
const STIMME_VON={blupp:'blupp',zinn:'zinn',klonk:'klonk',holunder:'holunder',hoppel:'hoppel',pig:'rosi',monkey:'bobo',skel:'klapper',pirate:'paul',krebs:'kasimir',hummer:'hubert'};

function fig(name,cls=''){return `<svg class="fig ${name} ${cls}" viewBox="0 0 100 100" aria-hidden="true">${FIG[name]}</svg>`}

// Ab und zu zieht eine Figur sanft durchs Bild – BluppBlupp schwebt an Seifenblasen, Herr Zinn spaziert mit der Laterne
function flyBy(name=rnd(Object.keys(FIG)),withSound=true){
  const d=document.createElement('div');
  d.className='flyer fly-'+name;
  d.innerHTML=fig(name,['blupp','klonk','skel'].includes(name)?'dance':'');
  if(name==='blupp')d.style.top=10+Math.random()*40+'vh';
  if(name==='zinn'||name==='klonk'||name==='hoppel')d.style.bottom=3+Math.random()*12+'vh';
  if(name==='holunder'||name==='pig')d.style.top=8+Math.random()*40+'vh';
  if(name==='monkey')d.style.left=15+Math.random()*60+'vw';
  if(name==='skel')d.style.left=10+Math.random()*70+'vw';
  if(name==='pirate'||name==='krebs'||name==='hummer')d.style.bottom=4+Math.random()*20+'vh';
  document.body.appendChild(d);
  if(withSound)setTimeout(()=>CHAR[name].sound(),600);
  setTimeout(()=>d.remove(),6200);
}
