// ---------------------------------------------------------------
// How this works:
//  - 8 "screens" are shown/hidden one at a time.
//  - Screen 1: tap the star -> go to screen 2.
//  - Screens 2-7: tap the record label (center) to spin + play a
//    10-second clip; tap the wax heart to go to the next screen.
//  - Screen 8: final note, nothing to click.
//
// TO ADD YOUR SONGS:
//  Drop 10-second (or longer) mp3 clips into the /audio folder using
//  the exact filenames already referenced in index.html, e.g.:
//    audio/02-ylang-ylang.mp3
//    audio/03-someone-who-loves-you.mp3
//    audio/04-age-of-love.mp3
//    audio/05-toter-schmetterling.mp3
//    audio/06-i-found-you.mp3
//    audio/07-yukon.mp3
//  If a clip is longer than 10s and you want it to start at the
//  chorus, set data-start="SECONDS" on that <audio> tag in
//  index.html (e.g. data-start="45" starts 45s into the file).
//  Playback always stops automatically after 10 seconds.
// ---------------------------------------------------------------

const CLIP_LENGTH = 10; // seconds

const screens = Array.from(document.querySelectorAll('.screen'));
let currentAudio = null;
let stopTimer = null;

function showScreen(index) {
  screens.forEach(s => s.classList.remove('active'));
  const target = screens.find(s => Number(s.dataset.index) === index);
  if (target) target.classList.add('active');
  stopCurrentAudio();
  resetAllVinyls();
}

function resetAllVinyls() {
  document.querySelectorAll('.vinyl-img').forEach(img => img.classList.remove('spinning'));
}

function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (stopTimer) {
    clearTimeout(stopTimer);
    stopTimer = null;
  }
}

function playClip(audioEl) {
  if (!audioEl) return;
  stopCurrentAudio();

  const start = parseFloat(audioEl.dataset.start || '0');
  audioEl.currentTime = start;

  audioEl.play().catch(() => {
    // No audio file added yet, or browser blocked playback.
    // Fails silently so the rest of the page keeps working.
  });

  currentAudio = audioEl;
  stopTimer = setTimeout(() => {
    audioEl.pause();
  }, CLIP_LENGTH * 1000);
}

// Screen 1 -> Screen 2
document.getElementById('star-btn').addEventListener('click', () => {
  showScreen(1);
});

// Screens 2-7: heart -> next screen
document.querySelectorAll('.heart-hit').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = Number(btn.dataset.next) - 1; // data-next is 1-indexed screen number
    showScreen(next);
  });
});

// Screens 2-7: number word (one, two, three...) -> previous screen
document.querySelectorAll('.label-hit').forEach(btn => {
  btn.addEventListener('click', () => {
    const prev = Number(btn.dataset.prev) - 1; // data-prev is 1-indexed screen number
    showScreen(prev);
  });
});

// Screen 8: heart -> back to previous screen
document.querySelectorAll('.final-heart-hotspot').forEach(btn => {
  btn.addEventListener('click', () => {
    const prev = Number(btn.dataset.prev) - 1;
    showScreen(prev);
  });
});

// Screens 2-7: vinyl click -> spin + play/pause that screen's clip
document.querySelectorAll('.vinyl-hit').forEach(btn => {
  btn.addEventListener('click', () => {
    const img = btn.querySelector('.vinyl-img');
    const audioEl = document.getElementById(btn.dataset.audio);
    const isSpinning = img.classList.contains('spinning');

    if (isSpinning) {
      img.classList.remove('spinning');
      stopCurrentAudio();
    } else {
      resetAllVinyls();
      img.classList.add('spinning');
      playClip(audioEl);
    }
  });
});

// Start on screen 1
showScreen(0);
