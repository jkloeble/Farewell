# Testanleitung: Tourenplanungs-Rätsel (`tourenplanung.html`)

## 1. Automatischer Engine-Test (Node)

Testet die Simulations-Engine direkt aus `tourenplanung.html`:
Musterlösung, erwartete Zeiten, Brute-Force-Eindeutigkeit (840 Pläne)
und alle spezifischen Konfliktmeldungen.

```bash
# Falls Node fehlt (WSL):
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
. "$HOME/.nvm/nvm.sh"
nvm install --lts

# Test ausführen:
node tests/test_tourenplanung_engine.js
```

Erwartete Ausgabe endet mit `Alle Engine-Tests bestanden.`

Hinweis: Der Test liest `tourenplanung.html` über den absoluten Pfad
`/home/cspaete/local_projects/Farewell/...` — bei anderem Checkout-Pfad
die erste Zeile im Test anpassen.

## 2. Unabhängiger Regel-Check (Python) — bereits ausgeführt ✔

Nachimplementierung der Regeln unabhängig vom JS-Code. Wurde bereits
erfolgreich ausgeführt: 840 Pläne, exakt **eine** gültige Lösung
(Sprinter A→E→B→F, Caddy P→E).

```bash
python3 tests/crosscheck_tourenplanung.py
```

## 3. Manueller Browser-Test

Seite lokal öffnen (z. B. `python3 -m http.server` im Repo-Root, dann
`http://localhost:8000/tourenplanung.html`) und prüfen:

### Drag & Drop
- [ ] Karte aus dem Pool in eine Tour ziehen (Maus) — Einfüge-Platzhalter erscheint
      (in Kartengröße).
- [ ] Gleiches am Handy / im Device-Mode per Touch (Karten haben `touch-action: none`).
- [ ] Karten innerhalb einer Lane umsortieren.
- [ ] Karte zurück in den Pool ziehen.
- [ ] Kachelbreite wächst mit der Auftragsdauer: P (5 min) ist die schmalste,
      E (45 min) die breiteste Karte.
- [ ] **E (Wasserwerk)** in eine Lane ziehen → erscheint automatisch in **beiden** Lanes
      (andere Lane: letzte Position), beide pulsieren cyan mit „🔗 Treffpunkt".
- [ ] E innerhalb einer Lane verschieben geht; E in die *andere* Lane ziehen geht nicht;
      E in den Pool ziehen entfernt es aus beiden Lanes.

### Timeline / Live-Feedback
- [ ] Timeline rechnet bei jedem Drop live mit (Fahrt schraffiert, Warten gepunktet,
      Arbeit farbig, Konflikte rot pulsierend mit ⚠).
- [ ] Personenzähler: Caddy zeigt „👥 1 → 2 (mit M.)" sobald P in der Caddy-Tour liegt.
- [ ] Treffpunkt-Fenster (09:30–10:15) als cyanfarbenes Band in beiden Spuren.
- [ ] Konfliktliste unter der Timeline nennt konkrete Gründe mit Uhrzeiten.

### Tourenplanergremium
- [ ] Gremium-Panel (drei Köpfe + Sprechblase, Label „Das Tourenplanergremium")
      liegt **im Seitenfluss** direkt unter den beiden Touren.
- [ ] Ist das Panel beim Drop **nicht** im Sichtfeld (z. B. hochgescrollt bei den
      Swimlanes), erscheint der Kommentar zusätzlich als schwebende Einblendung
      unten im Viewport; sie bleibt 5 Minuten (Konstante `GREMIUM_TOAST_MS`),
      ist per ✕ schließbar, verschwindet beim Ziehen einer Karte und sobald das
      Panel ins Bild scrollt.
- [ ] Kommentiert jeden Drop; richtige Platzierung → bestätigender Kommentar
      (grüner Rand), falsche → skeptischer (pinker Rand).
- [ ] Die ersten 2 falschen Züge bekommen nur generische Kommentare
      („Hmm. Da stimmt was nicht." / „Ich wusste schon immer, dass das nichts wird.").
- [ ] **Ab dem 3. falschen Zug** haben konkrete Verletzungen Vorrang, z. B.:
      - B in den Caddy → „500 Kilo im Caddy…"
      - A in den Caddy (allein) → „Der Azubi schaut den Werkzeugkoffer an…"
      - F ohne B davor → „Zähler tauschen ohne Austauschzähler…"
- [ ] P in den Caddy (korrekt) → Bahn-Witz („Der Zug kommt 08:30…"), unabhängig vom Zähler.
- [ ] Kein Kommentar erscheint zweimal direkt hintereinander.

### Tour starten / Hints / Erfolg
- [ ] „Tour starten" mit Karten im Pool → Hinweis „Der Pool fährt nicht mit."
      (zählt nicht als Versuch).
- [ ] 3 vollständige, aber falsche Versuche → Hint 1 (Azubi), 6 Versuche → Hint 2 (Prüfgewichte).
- [ ] Korrekte Lösung (Sprinter A→E→B→F, Caddy P→E) → Konfetti-Overlay,
      finale Doppel-Timeline, Gremium einstimmig „Genehmigt. Einstimmig. Das gab es hier noch nie.",
      Abschiedstext mit Name.
- [ ] Gewonnen ist auch nach Schließen des Overlays klar erkennbar:
      grüner Banner „✅ Tour genehmigt — einstimmig!", Start-Button wird
      „🎉 Ergebnis ansehen" (öffnet das Overlay erneut).
- [ ] **Prank im Erfolgs-Popup:** „🚛 Zurück zur Tour." öffnet in Wahrheit die
      Bewerbungs-PDF in neuem Tab. Nach Rückkehr in den Spiel-Tab (oder nach
      ~8 s Fallback) erscheint zusätzlich „Ohne Bewerbung zurück zur Tour."
      → führt wirklich zu `index.html`.
- [ ] Name ändern: Konstante `FAREWELL_NAME` ganz oben im `<script>`-Block von
      `tourenplanung.html`.

### Einbettung
- [ ] `index.html`: Meilenstein „Tourenplanung — A new player enters the game" zeigt
      den Button „🧩 Bonus-Level: Plan die Tour!".
- [ ] `index.html`: Abschluss-Screen (nach dem Gutschein) verlinkt ebenfalls aufs Spiel.
- [ ] „← Zurück zur Abschiedstour" führt zurück zu `index.html`.

### Mobil
- [ ] Seite bei ~375 px Breite: Lanes scrollen horizontal, Briefing einspaltig,
      Gremium-Panel stapelt sich (Köpfe oben, Sprechblase darunter).
