// When an AI chat finishes while you're in another tab, Stormy brings you a letter.
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg?.type !== 'stormy-done') return
  const tabId = sender.tab?.id
  chrome.notifications.create(`stormy-${tabId ?? Date.now()}`, {
    type: 'basic',
    iconUrl: 'art/stormy-envelope.png',
    title: 'Your work is ready',
    message: `${msg.site} finished replying. Stormy brought you a letter.`,
    priority: 0,
  })
})

chrome.notifications.onClicked.addListener((id) => {
  const tabId = Number(id.replace('stormy-', ''))
  if (Number.isFinite(tabId)) {
    chrome.tabs.update(tabId, { active: true }, (tab) => {
      if (tab?.windowId !== undefined) chrome.windows.update(tab.windowId, { focused: true })
    })
  }
  chrome.notifications.clear(id)
})
