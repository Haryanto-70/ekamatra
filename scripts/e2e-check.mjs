import { chromium } from "playwright";

const results = [];
function log(name, ok, extra = "") {
  results.push({ name, ok, extra });
  console.log(`${ok ? "PASS" : "FAIL"} - ${name} ${extra}`);
}

async function clickAndWaitUrl(page, selector, urlPattern) {
  await Promise.all([
    page.waitForURL(urlPattern, { timeout: 8000 }),
    page.click(selector),
  ]);
}

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage();
const base = "http://localhost:3000";

try {
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  const title = await page.title();
  log("Homepage loads", title.includes("Ekamatra"), title);

  await clickAndWaitUrl(page, 'a[href^="/cari?category="]', /\/cari\?category=/);
  log("Category filter navigates to /cari", page.url().includes("/cari?category="), page.url());
  await page.waitForLoadState("networkidle");

  const cardCount = await page.locator('a[href^="/tukang/"]').count();
  log("Search results show mitra cards", cardCount > 0, `count=${cardCount}`);

  const mitraHref = await page.locator('a[href^="/tukang/"]').first().getAttribute("href");
  await clickAndWaitUrl(page, 'a[href^="/tukang/"]', new RegExp(mitraHref));
  await page.waitForLoadState("networkidle");
  log("Mitra profile page loads", page.url().includes("/tukang/"), page.url());

  const waButton = page.locator('a:has-text("Chat WhatsApp")').first();
  const waHref = await waButton.getAttribute("href");
  log("WhatsApp CTA present with wa.me link", !!waHref && waHref.includes("wa.me"), waHref ?? "");

  const bookingHref = await page.locator('a:has-text("Booking Sekarang")').first().getAttribute("href");
  await clickAndWaitUrl(page, 'a:has-text("Booking Sekarang")', new RegExp(bookingHref));
  await page.waitForLoadState("networkidle");
  log("Booking page loads", page.url().includes("/booking/"), page.url());

  await page.fill('input[name="customerName"]', "E2E Test User");
  await page.fill('input[name="customerPhone"]', "081211112222");
  const dt = new Date(Date.now() + 86400000).toISOString().slice(0, 16);
  await page.fill('input[name="scheduledAt"]', dt);
  await page.fill('textarea[name="address"]', "Jl. Testing No. 1, Jakarta");
  await page.click('button:has-text("Konfirmasi Booking")');
  await page.waitForSelector("text=Booking berhasil dibuat", { timeout: 8000 });
  log("Booking submit shows success message", true);

  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.fill('form:has(button:has-text("Hubungi via WhatsApp")) input[name="name"]', "Lead Test");
  await page.fill('form:has(button:has-text("Hubungi via WhatsApp")) input[name="phone"]', "081233334444");
  await page.click('button:has-text("Hubungi via WhatsApp")');
  await page.waitForSelector("text=Permintaan Anda terkirim", { timeout: 8000 });
  log("Quick contact lead form success", true);

  await page.goto(`${base}/admin`, { waitUntil: "networkidle" });
  log("Unauthenticated /admin redirects to login", page.url().includes("/admin/login"), page.url());

  await page.fill('input[name="phone"]', "080000000000");
  await page.fill('input[name="password"]', "admin123");
  await Promise.all([
    page.waitForURL(/\/admin$/, { timeout: 8000 }),
    page.click('button:has-text("Masuk")'),
  ]);
  log("Admin login succeeds and lands on dashboard", page.url().endsWith("/admin"), page.url());

  await page.goto(`${base}/admin/leads`, { waitUntil: "networkidle" });
  const leadRowCount = await page.locator("table tbody tr").count();
  log("Admin leads table shows leads", leadRowCount > 0, `rows=${leadRowCount}`);

  await page.goto(`${base}/admin/bookings`, { waitUntil: "networkidle" });
  const bookingRowCount = await page.locator("table tbody tr").count();
  log("Admin bookings table shows bookings", bookingRowCount > 0, `rows=${bookingRowCount}`);

  await page.goto(`${base}/admin/mitra`, { waitUntil: "networkidle" });
  const mitraRowCount = await page.locator("table tbody tr").count();
  log("Admin mitra table shows mitra", mitraRowCount > 0, `rows=${mitraRowCount}`);

  // Update a lead status via the dashboard and confirm it persists.
  await page.goto(`${base}/admin/leads`, { waitUntil: "networkidle" });
  const firstSelect = page.locator("table tbody tr").first().locator("select");
  await firstSelect.selectOption("CONTACTED");
  await page.waitForTimeout(1000);
  await page.reload({ waitUntil: "networkidle" });
  const persistedValue = await page.locator("table tbody tr").first().locator("select").inputValue();
  log("Lead status update persists", persistedValue === "CONTACTED", persistedValue);
} catch (err) {
  console.error("ERROR during e2e run:", err);
  results.push({ name: "unexpected error", ok: false, extra: String(err) });
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (failed.length > 0) {
  process.exit(1);
}
