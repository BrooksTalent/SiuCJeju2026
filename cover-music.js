const music = document.getElementById('cover-music');
const toggle = document.querySelector('.music-toggle');
const label = document.getElementById('music-label');
if (music && toggle && label) {
  toggle.hidden = false;
  music.volume = 0.5;
  const sync = () => {
    toggle.setAttribute('aria-pressed', String(!music.paused));
    label.textContent = music.paused ? '播放封面音樂' : '暫停封面音樂';
  };
  const stop = () => { music.pause(); music.currentTime = 0; };
  toggle.addEventListener('click', async () => {
    if (!music.paused) return music.pause();
    try { await music.play(); } catch { label.textContent = '未能播放，點此重試'; }
  });
  music.addEventListener('play', sync);
  music.addEventListener('pause', sync);
  music.addEventListener('error', () => { label.textContent = '未能播放，請重新整理'; });
  document.querySelector('.cover-nav a').addEventListener('click', stop);
  window.addEventListener('pagehide', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) music.pause(); });
}
