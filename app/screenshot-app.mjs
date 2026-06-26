import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 420, height: 860 } });

await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

await page.screenshot({ path: 'screenshot.png', fullPage: false });
console.log('Screenshot saved to screenshot.png');

const title = await page.title();
console.log('Page title:', title);

const text = await page.textContent('body');
console.log('Body text preview:', text?.slice(0, 300));

await browser.close();
