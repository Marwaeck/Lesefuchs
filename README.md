# Lesefuchs 🦊

Lern-App für Kinder zum Lesenlernen einzelner Wörter. Eine einzige Datei (`index.html`), läuft ohne Server direkt im Browser – auf Tablet, Handy oder Computer.

## So funktioniert's

1. **Wörter einlesen:** Foto vom Arbeitsblatt, Bild oder PDF auswählen. Die App findet die Wörter (PDF mit Text direkt, Fotos und gescannte PDFs per Texterkennung auf Deutsch), du wählst aus, welche geübt werden sollen. Wörter lassen sich auch eintippen und in Listen (z. B. „Woche 12“) sortieren.
2. **Lesen üben:** Ein Wort erscheint groß. Das Kind liest es laut vor, ein Erwachsener tippt
   - 👍 **richtig** – das Wort wandert ein Fach weiter und kommt erst später wieder (1, 2, 4, 8, 16 Tage),
   - 👎 **nochmal üben** – das Wort kommt in die **Wiedervorlage**: in derselben Runde ein paar Wörter später nochmal und in der nächsten Runde wieder ganz vorne. Optional spricht die App das Wort danach vor.
3. **Meine Wörter:** Übersicht mit 👍/👎 je Wort, Filter für Wiedervorlage, neue und gekonnte Wörter.

Optional (Einstellungen): **Mikrofon** – die App hört beim Vorlesen zu (Spracherkennung von Chrome/Edge/Safari) und vergibt 👍/👎 selbst; mit „Korrigieren“ lässt sich jede Bewertung umdrehen. Außerdem Großbuchstaben-Anzeige, Wörter pro Runde, Hell/Dunkel.

## Gemeinsam nutzen: Firebase + Cloudflare Pages

Die App läuft als statische Seite auf **Cloudflare Pages**. Gemeinsame Wörter für beide Eltern liegen in **Google Firebase** (Firestore). Angemeldet wird mit dem Google-Konto. Ohne Firebase-Konfiguration speichert die App nur auf dem Gerät.

### 1. Firebase einrichten (einmalig, ca. 10 Minuten)

1. <https://console.firebase.google.com> → **Projekt hinzufügen**, z. B. `lesefuchs` (Google Analytics wird nicht gebraucht).
2. **Build → Authentication → Jetzt starten → Anmeldemethode: Google** aktivieren, Support-E-Mail wählen, speichern.
3. **Build → Firestore Database → Datenbank erstellen**, Standort `europe-west3 (Frankfurt)`, im **Produktionsmodus** starten.
4. Reiter **Regeln**: den Inhalt von [`firestore.rules`](firestore.rules) hineinkopieren und **Veröffentlichen**.
   (Alternativ mit der Firebase-CLI: `firebase deploy --only firestore:rules` in diesem Ordner.)
5. **Projekteinstellungen (Zahnrad) → Allgemein → Deine Apps → Web (`</>`)**, App registrieren (kein Hosting). Die angezeigte `firebaseConfig` in [`firebase-config.js`](firebase-config.js) eintragen (statt `null`) und committen. Die Werte sind nicht geheim, die Daten schützen die Regeln.

### 2. Cloudflare Pages einrichten

1. Cloudflare-Dashboard → **Workers & Pages → Erstellen → Pages → Mit Git verbinden** → dieses Repository wählen.
2. Einstellungen:
   - **Produktionszweig:** der Branch mit der App (z. B. `main`)
   - **Framework-Voreinstellung:** keine
   - **Build-Befehl:** leer lassen
   - **Build-Ausgabeverzeichnis:** `lesen`
   - (Root-Verzeichnis: leer lassen; liegt die App in einem eigenen Repo direkt im Hauptordner, als Ausgabeverzeichnis `/` angeben.)
3. **Speichern und bereitstellen.** Die App ist dann unter `https://<projektname>.pages.dev` erreichbar; jeder Push aktualisiert sie.
4. Zurück in Firebase: **Authentication → Einstellungen → Autorisierte Domains → Domain hinzufügen** → `<projektname>.pages.dev` (und ggf. eine eigene Domain).

### 3. Familie anlegen

1. Elternteil A öffnet die Seite, tippt **Anmelden** und meldet sich mit Google an. Die bisher auf dem Gerät gespeicherten Wörter werden übernommen.
2. **⚙️ Einstellungen → Familie → Weitere Person einladen:** die Google-Adresse von Elternteil B eintragen.
3. Elternteil B öffnet dieselbe Seite und meldet sich mit genau dieser Adresse an – fertig. Änderungen erscheinen bei beiden sofort, auch offline Geübtes wird nachgereicht.

Tipp: Im Browser „Zum Home-Bildschirm“ wählen – dann startet der Lesefuchs wie eine App.

### Datenmodell und Sicherheit

- `familien/<id>`: `{ emails: [...], created }` – wer mit einer bestätigten Google-Adresse aus `emails` angemeldet ist, darf lesen und schreiben, Adressen hinzufügen oder entfernen (sich selbst nicht, höchstens 10).
- `familien/<id>/woerter/<wortId>`: ein Dokument je Wort (Text, Liste, Fach, fällig, 👍/👎-Zähler, Wiedervorlage).
- Einstellungen (Großbuchstaben, Mikrofon …) bleiben pro Gerät.
- Kostenlos im Spark-Tarif von Firebase und im Free-Tarif von Cloudflare Pages.

## Technik

- Ohne Firebase bleiben die Daten nur auf dem Gerät (`localStorage`); Sicherung als JSON-Datei über die Einstellungen.
- Firebase JS SDK 10.14.1 (Module von gstatic.com), Firestore mit Offline-Speicher.
- Läuft auch als Claude-Artefakt; dann übernimmt die Datenbank der Seite die Rolle von Firestore.
- PDF: [pdf.js](https://mozilla.github.io/pdf.js/) 3.11.174, Texterkennung: [Tesseract.js](https://tesseract.projectnaptha.com/) 5.1.1 mit deutschem Sprachpaket – beide werden erst beim ersten Import aus dem CDN geladen (Internet nötig).
- Schrift: Andika (für Leseanfänger gestaltet).

Lokal starten: `index.html` im Browser öffnen, oder `python3 -m http.server` im Repo und `http://localhost:8000/lesen/` aufrufen.
