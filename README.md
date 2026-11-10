# Lesefuchs 🦊

Lern-App für Kinder zum Lesenlernen einzelner Wörter. Eine einzige Datei (`index.html`), läuft ohne Server direkt im Browser – auf Tablet, Handy oder Computer.

## So funktioniert's

1. **Wörter einlesen:** Foto vom Arbeitsblatt, Bild oder PDF auswählen. Die App findet die Wörter (PDF mit Text direkt, Fotos und gescannte PDFs per Texterkennung auf Deutsch), du wählst aus, welche geübt werden sollen. Wörter lassen sich auch eintippen und in Listen (z. B. „Woche 12“) sortieren.
2. **Lesen üben:** Ein Wort erscheint groß. Das Kind liest es laut vor, ein Erwachsener tippt
   - 👍 **richtig** – das Wort wandert ein Fach weiter und kommt erst später wieder (1, 2, 4, 8, 16 Tage),
   - 👎 **nochmal üben** – das Wort kommt in die **Wiedervorlage**: in derselben Runde ein paar Wörter später nochmal und in der nächsten Runde wieder ganz vorne. Optional spricht die App das Wort danach vor.
3. **Meine Wörter:** Übersicht mit 👍/👎 je Wort, Filter für Wiedervorlage, neue und gekonnte Wörter.

Optional (Einstellungen): **Mikrofon** – die App hört beim Vorlesen zu (Spracherkennung von Chrome/Edge/Safari) und vergibt 👍/👎 selbst; mit „Korrigieren“ lässt sich jede Bewertung umdrehen. Außerdem Großbuchstaben-Anzeige, Wörter pro Runde, Hell/Dunkel.

## Technik

- Daten bleiben nur auf dem Gerät (`localStorage`); Sicherung als JSON-Datei über die Einstellungen.
- PDF: [pdf.js](https://mozilla.github.io/pdf.js/) 3.11.174, Texterkennung: [Tesseract.js](https://tesseract.projectnaptha.com/) 5.1.1 mit deutschem Sprachpaket – beide werden erst beim ersten Import aus dem CDN geladen (Internet nötig).
- Schrift: Andika (für Leseanfänger gestaltet).

Lokal starten: `index.html` im Browser öffnen, oder `python3 -m http.server` im Repo und `http://localhost:8000/lesen/` aufrufen.
