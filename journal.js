document.querySelectorAll('[data-save]').forEach(input => {
  const key = 'siucjeju2026:' + input.dataset.save;
  try { input.checked = localStorage.getItem(key) === 'true'; } catch {}
  input.addEventListener('change', () => { try { localStorage.setItem(key, String(input.checked)); } catch {} });
});
