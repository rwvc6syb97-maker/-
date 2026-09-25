// Run: node scripts/fe02-check.mjs. Edge CDP emulates touch; it is not a real device.
import { spawn } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

const port = 19382
const url = 'http://127.0.0.1:5173/'
const edgePath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const profile = mkdtempSync(join(tmpdir(), 'fe02-edge-'))
const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5173', '--strictPort'], { stdio: 'ignore' })
const edge = spawn(edgePath, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=' + port, '--user-data-dir=' + profile, 'about:blank'], { stdio: 'ignore' })
let socket
let sequence = 0
const waiting = new Map()
const events = new Map()
const assert = (condition, message) => { if (!condition) throw Error(message) }
const waitUntil = async (f, attempts = 80) => {
  for (let i = 0; i < attempts; i++) {
    try { const value = await f(); if (value) return value } catch { /* startup pending */ }
    await delay(150)
  }
  throw Error('Timed out waiting for browser/server')
}
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence
  waiting.set(id, { resolve, reject })
  socket.send(JSON.stringify({ id, method, params }))
})
const evaluate = async (expression) => {
  const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  assert(!response.exceptionDetails, 'JavaScript evaluation failed: ' + expression)
  return response.result?.value
}
const key = async (type, keyName, code, keyCode, modifiers = 0) => {
  await send('Input.dispatchKeyEvent', { type, key: keyName, code, windowsVirtualKeyCode: keyCode, modifiers })
}
const pressTab = async () => { await key('rawKeyDown', 'Tab', 'Tab', 9); await key('keyUp', 'Tab', 'Tab', 9) }
const pressEnter = async () => { await key('rawKeyDown', 'Enter', 'Enter', 13); await key('keyUp', 'Enter', 'Enter', 13) }
const navigate = async () => { await send('Page.navigate', { url }); await waitUntil(async () => evaluate("document.querySelectorAll('.site-header nav a').length === 6")) }
const click = async (selector) => {
  const box = await evaluate(`(() => { const r = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return { x:r.x + r.width / 2, y:r.y + r.height / 2 } })()`)
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...box })
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...box })
}
try {
  await waitUntil(async () => (await fetch(url)).ok)
  const target = await waitUntil(async () => (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t => t.type === 'page'))
  socket = new WebSocket(target.webSocketDebuggerUrl)
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data)
    if (message.id) {
      const pending = waiting.get(message.id)
      if (pending) { waiting.delete(message.id); message.error ? pending.reject(Error(message.error.message)) : pending.resolve(message.result) }
    } else if (events.has(message.method)) events.get(message.method)(message.params)
  })
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }) })
  await send('Page.enable'); await send('Runtime.enable')
  for (const width of [320, 768, 1280]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 800, deviceScaleFactor: 1, mobile: false })
    await navigate()
    const result = await evaluate(`(() => ({ targets: [...document.querySelectorAll('a')].map(a => { const b = a.getBoundingClientRect(); return { text: a.textContent.trim(), width: b.width, height: b.height, href: a.getAttribute('href') } }), overflow: document.documentElement.scrollWidth > innerWidth, viewport: innerWidth }))()`)
    const mail = await evaluate(`(() => { const a = document.querySelector('.contact-grid a[href^="mailto:"]'); const range = document.createRange(); range.selectNodeContents(a); const rects = [...range.getClientRects()]; const box = a.getBoundingClientRect(); return { visible: box.width > 0 && box.height > 0, selectable: getComputedStyle(a).userSelect !== 'none', text: a.textContent, lines: rects.length, clipped: rects.some(r => r.left < 0 || r.right > innerWidth || r.top < box.top - 1 || r.bottom > box.bottom + 1) } })()`)
    const small = result.targets.filter(t => t.width < 44 || t.height < 44)
    console.log(JSON.stringify({ mode: 'viewport', width, viewport: result.viewport, overflow: result.overflow, nav: result.targets.filter(t => ['#top','#skills','#projects','#experience','#about-more','#contact'].includes(t.href)).slice(0, 6).map(t => ({ text: t.text, width: t.width, height: t.height })), small, mail }))
    assert(!result.overflow && !small.length && mail.visible && mail.selectable && !mail.clipped && mail.text === 'dengyifeng2003@163.com', `${width}px overflow, undersized target or clipped email`)
  }
  await send('Emulation.setDeviceMetricsOverride', { width: 320, height: 800, deviceScaleFactor: 1, mobile: false })
  await navigate()
  await pressTab()
  const skip = await evaluate("({ text: document.activeElement.textContent, visible: document.activeElement.getBoundingClientRect().top >= 0, outline: getComputedStyle(document.activeElement).outlineStyle })")
  assert(skip.text.includes('跳到主要内容') && skip.visible && skip.outline !== 'none', 'Skip link not keyboard-visible')
  await pressEnter()
  const skipped = await evaluate("({ hash: location.hash, focused: document.activeElement.id })")
  assert(skipped.hash === '#main-content' && skipped.focused === 'main-content', 'Skip link failed')
  // Once focus moves into main, Tab continues within main. Reload for the independent navigation order check.
  await navigate()
  await pressTab()
  await pressTab()
  const tab = await evaluate("({ text: document.activeElement.textContent, outline: getComputedStyle(document.activeElement).outlineStyle })")
  assert(tab.text.includes('关于') && tab.outline !== 'none', 'Nav keyboard focus failed')
  console.log(JSON.stringify({ mode: 'keyboard', skip, skipped, tab }))
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 })
  await navigate()
  const point = await evaluate("(() => { const r = document.querySelector('.site-header nav a[href=\"#contact\"]').getBoundingClientRect(); return { x: Math.round(r.x+r.width/2), y: Math.round(r.y+r.height/2) } })()")
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...point, id: 0 }] })
  await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await delay(150)
  const touched = await evaluate("({ hash: location.hash, focused: document.activeElement.id })")
  assert(touched.hash === '#contact' && touched.focused === 'contact', 'Emulated touch navigation failed')
  console.log(JSON.stringify({ mode: 'CDP emulated touch, NOT real touch', touched }))
  await send('Emulation.setTouchEmulationEnabled', { enabled: false })
  await send('Network.enable'); await send('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 })
  const offline = await evaluate("({contact: document.querySelector('#contact').closest('section').textContent, phone: document.querySelector('a[href^=\"tel:\"]').getAttribute('href'), mail: document.querySelector('a[href^=\"mailto:\"]').getAttribute('href'), external: document.querySelector('a[href^=\"https://innerquest.online/\"]').href, success: /发送成功|访问成功|拨打成功/.test(document.body.textContent)})")
  console.log(JSON.stringify({ mode: 'CDP network offline, NOT isolated external failure', offline }))
  assert(offline.contact.includes('18173959893') && offline.contact.includes('dengyifeng2003@163.com') && !offline.success, 'Offline fallback text unavailable')
  await send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 })
  await send('Fetch.enable', { patterns: [{ urlPattern: '*innerquest.online*', requestStage: 'Request' }] })
  events.set('Fetch.requestPaused', async ({ requestId, request }) => {
    if (request.url.includes('innerquest.online')) await send('Fetch.failRequest', { requestId, errorReason: 'InternetDisconnected' })
    else await send('Fetch.continueRequest', { requestId })
  })
  await evaluate("document.querySelector('#contact').scrollIntoView()")
  await click('a[href="https://innerquest.online/"]')
  const external = await waitUntil(async () => {
    const state = await evaluate("({ href: location.href, readable: document.body.textContent.includes('dengyifeng2003@163.com') })")
    return state.href.startsWith('chrome-error://') ? state : false
  })
  await send('Fetch.disable')
  await send('Page.navigateToHistoryEntry', { entryId: (await send('Page.getNavigationHistory')).entries.findLast(entry => entry.url.startsWith(url)).id })
  await waitUntil(async () => evaluate("location.origin === 'http://127.0.0.1:5173' && document.body.textContent.includes('dengyifeng2003@163.com')"))
  const recovered = await evaluate("({ href: location.href, readable: document.body.textContent.includes('dengyifeng2003@163.com') })")
  console.log(JSON.stringify({ mode: 'CDP blocked external request and browser back, not real third-party outage', external, recovered }))
  await navigate()
  console.log('FE-02 CDP checks complete; true 200% browser zoom, real touch and missing protocol app not verified.')
} catch (error) {
  console.error('FE-02 CDP check FAILED:', error)
  process.exitCode = 1
} finally {
  if (socket) socket.close()
  edge.kill(); vite.kill()
  // Edge may keep CDP sockets open after close on Windows; bound teardown after results are printed.
  setTimeout(() => process.exit(process.exitCode || 0), 1500).unref()
}