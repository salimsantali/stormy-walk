const defaults = { cats: true, pet: true, sound: true }
chrome.storage.sync.get(defaults, (v) => {
  for (const k of Object.keys(defaults)) {
    const box = document.getElementById(k)
    box.checked = v[k]
    box.addEventListener('change', () => chrome.storage.sync.set({ [k]: box.checked }))
  }
})
