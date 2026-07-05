# Farewell

Eine kleine Abschieds-Website mit Meilenstein-Timeline und einem
Bonus-Minispiel (Tourenplanungs-Rätsel).

## Struktur

| Pfad                          | Inhalt                                                        |
| ------------------------------ | -------------------------------------------------------------- |
| `index.html`                   | Hauptseite mit der Meilenstein-Timeline                        |
| `tourenplanung.html`           | Bonus-Level: Drag-&-Drop-Tourenplanungs-Rätsel                 |
| `data/`                        | Bilder und sonstige Assets                                     |
| `tests/`                       | Tests für die Spiel-Engine von `tourenplanung.html`             |
| `.github/workflows/static.yml` | GitHub-Actions-Workflow für das Deployment nach GitHub Pages    |

Beide Seiten sind eigenständiges, statisches HTML/CSS/JS ohne Build-Schritt
oder Abhängigkeiten.

## Deployment

Das Deployment läuft vollautomatisch über GitHub Actions
([`.github/workflows/static.yml`](.github/workflows/static.yml)):

1. **Trigger:** jeder Push auf `main` (oder manuell über den Reiter *Actions* → *Run workflow*).
2. **Checkout** des Repository-Inhalts.
3. **Upload** des gesamten Repos als Pages-Artifact (`actions/upload-pages-artifact`).
4. **Deploy** des Artifacts nach GitHub Pages (`actions/deploy-pages`).

Da es sich um statische Dateien handelt, ist kein separater Build-Schritt
nötig — jede Änderung an `main` ist nach Abschluss des Workflows live.

### Live-Seite

📍 https://jkloeble.github.io/Farewell/

Das Bonus-Minispiel ist direkt unter [`/tourenplanung.html`](https://jkloeble.github.io/Farewell/tourenplanung.html) erreichbar.

## Tests

Die Simulations-Engine des Tourenplanungs-Rätsels wird separat getestet;
siehe [`tests/TESTING.md`](tests/TESTING.md) für Details zu automatischen
und manuellen Tests.
