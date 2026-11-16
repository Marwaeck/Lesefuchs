// Erstellt Screenshots der App für die README (docs/screenshots/).
// Aufruf: node .github/scripts/screenshots.mjs <URL> [Zielordner]
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";

const url = process.argv[2] || "https://marwaeck.github.io/Lesefuchs/";
const out = process.argv[3] || "docs/screenshots";
mkdirSync(out, { recursive: true });

const today = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
const mk = (text, list, box, extra = {}) => ({
  id: Math.random().toString(36).slice(2, 10), text, list, box, due: today, wv: false,
  right: box * 2, wrong: 0, last: box ? "up" : null, added: Date.now(), ...extra,
});
const words = [
  ...["Haus", "Maus", "Oma", "Opa", "Auto", "Sonne", "Mama", "Papa"].map((t, i) => mk(t, "Woche 12", i % 4)),
  mk("Blume", "Woche 12", 1, { wv: true, wrong: 2, last: "down" }),
  mk("Igel", "Woche 13", 0), mk("Nase", "Woche 13", 5, { due: today + 9 }), mk("Löwe", "Woche 13", 2, { wv: true, wrong: 1, last: "down" }),
];
const db = { words, settings: { len: 10, upper: false, say: true, mic: false, theme: "light" }, updated: Date.now() };

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 13"], locale: "de-DE", colorScheme: "light" });
await ctx.addInitScript((d) => { if (!sessionStorage.getItem("seeded")) { localStorage.setItem("lesefuchs.v1", d); sessionStorage.setItem("seeded", "1"); } }, JSON.stringify(db));
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const shot = async (name) => { await page.waitForTimeout(400); await page.screenshot({ path: `${out}/${name}.png` }); };

await shot("1-start");
await page.click("#btn-start");
await shot("2-ueben");
await page.click("#btn-yes");
await page.waitForTimeout(600);
await shot("3-richtig");
await page.click("#btn-next");
await page.click("#btn-no");
await page.waitForTimeout(600);
await shot("4-nochmal");
await page.click("#btn-next");
for (const ok of [true, true, false, true]) { await page.click(ok ? "#btn-yes" : "#btn-no"); await page.click("#btn-next"); }
await page.click("#btn-quit");
await page.waitForTimeout(400);
await shot("5-ergebnis");
await page.evaluate(() => go("words"));
await shot("6-woerter");
await page.evaluate(() => go("import"));
await shot("7-einlesen");
await browser.close();
console.log("Screenshots gespeichert in", out);
