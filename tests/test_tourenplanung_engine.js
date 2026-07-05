const fs = require("fs");
const html = fs.readFileSync("/home/cspaete/local_projects/Farewell/tourenplanung.html", "utf8");
const script = html.match(/<script>([\s\S]*)<\/script>/)[1];

const module_ = { exports: {} };
const fn = new Function("module", "document", script);
fn(module_, undefined);
const { GAME, simulate, ALL_TASKS } = module_.exports;

const fmt = (m) => String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");

// ---------- Test 1: Musterlösung ----------
const solution = { sprinter: ["A", "E", "B", "F"], caddy: ["P", "E"] };
const sim = simulate(solution);
const errs = sim.conflicts.filter((c) => !c.info);
console.log("=== Musterlösung ===");
console.log("complete:", sim.complete, "| Fehler:", errs.length);
for (const v of ["sprinter", "caddy"]) {
  console.log(v + ":");
  sim.segments[v].forEach((s) =>
    console.log(`  ${s.type.padEnd(7)} ${fmt(s.from)}–${fmt(s.to)} ${s.at || s.a + "→" + s.b}`)
  );
}
if (!sim.complete || errs.length) { console.error("FAIL: Musterlösung wird nicht akzeptiert!"); process.exit(1); }

// Erwartete Zeiten prüfen (aus dem Aufgabentext)
const expect = [
  ["sprinter", "work", "A", 495, 525],   // 08:15–08:45
  ["sprinter", "work", "E", 570, 615],   // 09:30–10:15
  ["sprinter", "work", "B", 630, 640],   // 10:30–10:40
  ["sprinter", "work", "F", 645, 685],   // 10:45–11:25
  ["caddy",    "work", "P", 510, 515],   // 08:30–08:35
  ["caddy",    "work", "E", 570, 615],
];
for (const [v, type, at, from, to] of expect) {
  const seg = sim.segments[v].find((s) => s.type === type && s.at === at);
  if (!seg || seg.from !== from || seg.to !== to) {
    console.error(`FAIL: ${v}/${at} erwartet ${fmt(from)}–${fmt(to)}, ist ${seg ? fmt(seg.from) + "–" + fmt(seg.to) : "fehlt"}`);
    process.exit(1);
  }
}
const sprinterEnd = sim.segments.sprinter.at(-1);
const caddyEnd = sim.segments.caddy.at(-1);
console.log("Rückkehr Sprinter:", fmt(sprinterEnd.to), "(erwartet 11:50) | Caddy:", fmt(caddyEnd.to), "(erwartet 10:35)");
if (sprinterEnd.to !== 710 || caddyEnd.to !== 635) { console.error("FAIL Rückkehrzeiten"); process.exit(1); }
console.log("OK\n");

// ---------- Test 2: Brute-Force — genau eine Lösung ----------
function* permutations(arr) {
  if (arr.length <= 1) { yield arr.slice(); return; }
  for (let i = 0; i < arr.length; i++) {
    const rest = arr.slice(0, i).concat(arr.slice(i + 1));
    for (const p of permutations(rest)) yield [arr[i], ...p];
  }
}

const others = ["A", "P", "B", "F"];
let valid = [];
let total = 0;
for (let mask = 0; mask < 16; mask++) {
  const sTasks = others.filter((_, i) => mask & (1 << i));
  const cTasks = others.filter((_, i) => !(mask & (1 << i)));
  for (const sPerm of permutations(sTasks)) {
    for (const cPerm of permutations(cTasks)) {
      for (let si = 0; si <= sPerm.length; si++) {
        for (let ci = 0; ci <= cPerm.length; ci++) {
          const plan = {
            sprinter: [...sPerm.slice(0, si), "E", ...sPerm.slice(si)],
            caddy: [...cPerm.slice(0, ci), "E", ...cPerm.slice(ci)],
          };
          total++;
          const r = simulate(plan);
          if (r.complete && !r.conflicts.some((c) => !c.info)) valid.push(JSON.stringify(plan));
        }
      }
    }
  }
}
console.log(`=== Brute-Force: ${total} Pläne geprüft ===`);
console.log("Gültige Lösungen:", valid.length);
valid.forEach((v) => console.log(" ", v));
if (valid.length !== 1) { console.error("FAIL: Lösung nicht eindeutig laut Engine!"); process.exit(1); }
if (valid[0] !== JSON.stringify(solution)) { console.error("FAIL: andere Lösung als erwartet!"); process.exit(1); }
console.log("OK\n");

// ---------- Test 3: Spezifische Konflikte ----------
const cases = [
  // Azubi allein vor 2-Personen-Aufgabe
  [{ sprinter: ["E", "B", "F"], caddy: ["P", "E", "A"] }, "azubi-allein"],
  // B im Caddy (E in beiden, damit vergleichbar)
  [{ sprinter: ["A", "E", "F"], caddy: ["P", "E", "B"] }, "b-im-caddy"],
  // F ohne B im selben Fahrzeug
  [{ sprinter: ["A", "E", "F"], caddy: ["P", "E"] }, "f-ohne-b"],
  // Zu spät an der Messwarte (Sprinter macht B vor E: 08:20 an B, 10min, 15 → 08:50 ok... nimm A dann B)
  [{ sprinter: ["A", "B", "E", "F"], caddy: ["P", "E"] }, "e-zu-spaet"],
  // Weniger als 4 Personen / ohne M (P nach E)
  [{ sprinter: ["A", "E", "B", "F"], caddy: ["E", "P"] }, "e-personen"],
  [{ sprinter: ["A", "E", "B", "F"], caddy: ["E", "P"] }, "e-ohne-m"],
  // Bäckerei zu spät
  [{ sprinter: ["B", "A", "E", "F"], caddy: ["P", "E"] }, "a-zu-spaet"],
  // P&R zu früh (Info)
  [{ sprinter: ["A", "E", "B", "F"], caddy: ["P", "E"] }, "p-zu-frueh"],
  // Kranfenster gerissen (F vor E: startet spät wg. 10:30? nein — F vor E => E viel zu spät; teste F am Ende mit Verzögerung)
  [{ sprinter: ["A", "E", "F", "B"], caddy: ["P", "E"] }, "f-ohne-b"],
];
console.log("=== Spezifische Konflikte ===");
let fail = false;
for (const [plan, code] of cases) {
  const r = simulate(plan);
  const hit = r.conflicts.some((c) => c.code === code);
  console.log(`${hit ? "OK  " : "FAIL"} ${code.padEnd(14)} ${JSON.stringify(plan)}`);
  if (!hit) fail = true;
}
// f-fenster: Arbeit endet nach 12:00 — Caddy fährt nach E zu B?? B nur sprinter. Konstruiere: Sprinter A,E,B,F aber mit Umweg: E,A?? A zu spät auch ok, uns interessiert nur f-fenster:
// Sprinter: E,B,A,F → nach E(10:15) B 10:30-10:40, A: 25min → 11:05+30=11:35, dann F: 25min → 12:00 an, Start 12:00 > 10:30ok, Ende 12:40 > 12:00 → f-fenster
const r2 = simulate({ sprinter: ["E", "B", "A", "F"], caddy: ["P", "E"] });
const hit2 = r2.conflicts.some((c) => c.code === "f-fenster");
console.log(`${hit2 ? "OK  " : "FAIL"} f-fenster      Sprinter E,B,A,F`);
if (!hit2) fail = true;
if (fail) process.exit(1);
console.log("\nAlle Engine-Tests bestanden.");
