import puppeteer from 'puppeteer-core'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const url = process.argv[2] || 'http://localhost:3000'
const label = process.argv[3] || ''

// Auto-increment screenshot filename
const dir = path.join(__dirname, 'temporary screenshots')
fs.mkdirSync(dir, { recursive: true })
const existing = fs.readdirSync(dir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'))
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] ?? '0')).filter(n => !isNaN(n))
const next = nums.length ? Math.max(...nums) + 1 : 1
const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`
const outPath = path.join(dir, filename)

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
await page.screenshot({ path: outPath, fullPage: true })
await browser.close()

console.log(`Saved: ${outPath}`)
