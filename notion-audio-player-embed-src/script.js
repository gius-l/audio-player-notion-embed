const playlist = [
  { title: "By Your Side - OMORI 3rd Anniversary Concert", artist: "OMOCAT", src: "https://cdn.commoninja.com/asset/699e0983-2073-48fd-a289-677fa626fa55.m4a", img: "https://cdn.commoninja.com/asset/7fc8e204-d834-453b-96c0-c75ca02dc6a2.jpg" },
  { title: "SM 64 - Dire,Dire Docks (J.J. “Funk on the Docks” Remix)", artist: "GameChops", src: "https://cdn.commoninja.com/asset/7d98fbff-3161-409b-b20e-d305c411ef3e.m4a", img: "https://cdn.commoninja.com/asset/2897187c-db6a-44fe-882f-a7ab45f11771.jpg" },
  { title: "Deltarune OST [Chapter 2] - My Castle Town", artist: "Toby Fox", src: "https://cdn.commoninja.com/asset/27bd871c-066f-4fea-87b4-26c7ba8181a1.mp3", img: "https://cdn.commoninja.com/asset/99b322ce-5bf8-4688-b72f-53dfe87fef04.png" },
  { title: "Undertale OST - It's Raining Somewhere Else", artist: "Toby Fox", src: "https://cdn.commoninja.com/asset/efdb0580-3a5c-4957-a96f-73e2920651e5.mp3", img: "https://cdn.commoninja.com/asset/bfa1b738-cd16-4142-8c5e-cb3f7946c8c8.jpg" },
  { title: "Hazbin Hotel OST \"Original Film Score\" [Pilot] - Hey Mom", artist: "Gooseworx", src: "https://cdn.commoninja.com/asset/5d52ca91-b7c7-4012-a52d-796b668b3e85.m4a", img: "https://cdn.commoninja.com/asset/31919a0e-d9c0-478c-9b44-461119a11a18.jpeg" }
];

let songIdx = 0;
let isDragging = false;
let isShuffle = false;
let isLoop = false;
let lastVolume = 0.3; // Memorizza l'ultimo volume prima del muto

const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const fill = document.getElementById('fill');
const handle = document.getElementById('handle');
const slider = document.getElementById('progress-area');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const volumeSlider = document.getElementById('volume-slider');
const volumeBtn = document.getElementById('volume-btn');

// Icone Volume
const volIcon = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="24px" width="24px"><path d="M264 416.19a23.92 23.92 0 01-14.21-4.69l-.66-.51-91.46-75H88a24 24 0 01-24-24V200a24 24 0 0124-24h69.65l91.46-75 .66-.51A24 24 0 01288 119.83v272.34a24 24 0 01-24 24zM352 336a16 16 0 01-14.29-23.18c9.49-18.9 14.3-38 14.3-56.82 0-19.36-4.66-37.92-14.25-56.73a16 16 0 0128.5-14.54C378.2 208.16 384 231.47 384 256c0 23.83-6 47.78-17.7 71.18A16 16 0 01352 336z"></path><path d="M400 384a16 16 0 01-13.87-24C405 327.05 416 299.45 416 256c0-44.12-10.94-71.52-29.83-103.95A16 16 0 01413.83 136C434.92 172.16 448 204.88 448 256c0 50.36-13.06 83.24-34.12 120a16 16 0 01-13.88 8z"></path></svg>`;
const muteIcon = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="24px" width="24px"><path d="M344 416a23.92 23.92 0 01-14.21-4.69c-.23-.16-.44-.33-.66-.51l-91.46-74.9H168a24 24 0 01-24-24V200.07a24 24 0 0124-24h69.65l91.46-74.9c.22-.18.43-.35.66-.51A24 24 0 01368 120v272a24 24 0 01-24 24z"></path></svg>`;

const playIcon = `<svg stroke="currentColor" fill="currentColor" viewBox="0 0 448 512"><path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg>`;
const pauseIcon = `<svg stroke="currentColor" fill="currentColor" viewBox="0 0 448 512"><path d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"></path></svg>`;

function load(i) {
  const s = playlist[i];
  document.getElementById('title').innerText = s.title;
  document.getElementById('artist').innerText = s.artist;
  document.getElementById('cover').src = s.img;
  audio.src = s.src;

  updateMediaSession(); 
}

playBtn.onclick = () => {
  if (audio.paused) { 
    audio.play(); 
    playBtn.innerHTML = pauseIcon;
    // Comunica lo stato al sistema per il background
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = "playing";
  } else { 
    audio.pause(); 
    playBtn.innerHTML = playIcon;
    // Comunica lo stato al sistema per il background
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = "paused";
  }
};

document.getElementById('next').onclick = () => {
  if (isShuffle) { songIdx = Math.floor(Math.random() * playlist.length); }
  else { songIdx = (songIdx + 1) % playlist.length; }
  load(songIdx); audio.play(); playBtn.innerHTML = pauseIcon;
};

document.getElementById('prev').onclick = () => {
  songIdx = (songIdx - 1 + playlist.length) % playlist.length;
  load(songIdx); audio.play(); playBtn.innerHTML = pauseIcon;
};

shuffleBtn.onclick = () => {
  isShuffle = !isShuffle;
  shuffleBtn.style.color = isShuffle ? "#e56458" : "#ada9a3";
};

repeatBtn.onclick = () => {
  isLoop = !isLoop;
  repeatBtn.style.color = isLoop ? "#e56458" : "#ada9a3";
};

// LOGICA VOLUME E MUTO
function updateVolBar() {
  const val = volumeSlider.value;
  const pct = val * 100;
  volumeSlider.style.background = `linear-gradient(to right, #e56458 ${pct}%, #30302e ${pct}%)`;
  
  // Cambia icona se il volume è 0
  if (val == 0) {
    volumeBtn.innerHTML = muteIcon;
  } else {
    volumeBtn.innerHTML = volIcon;
  }
}

audio.volume = volumeSlider.value;
updateVolBar();

volumeSlider.oninput = (e) => {
  audio.volume = e.target.value;
  updateVolBar();
};

volumeBtn.onclick = () => {
  if (audio.volume > 0) {
    lastVolume = audio.volume; // Salva il volume attuale
    audio.volume = 0;
    volumeSlider.value = 0;
  } else {
    audio.volume = lastVolume; // Ripristina l'ultimo volume
    volumeSlider.value = lastVolume;
  }
  updateVolBar();
};

// LOGICA SLIDER PROGRESSO
function moveSlider(e) {
  const rect = slider.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  let offsetX = clientX - rect.left;
  offsetX = Math.max(0, Math.min(offsetX, rect.width));
  const pct = (offsetX / rect.width) * 100;
  fill.style.width = pct + "%";
  handle.style.left = pct + "%";
  if (audio.duration) document.getElementById('current').innerText = fmt((pct/100)*audio.duration);
  return pct;
}

slider.onmousedown = (e) => { isDragging = true; moveSlider(e); };
window.onmousemove = (e) => { if (isDragging) moveSlider(e); };
window.onmouseup = (e) => {
  if (isDragging) {
    const pct = moveSlider(e);
    audio.currentTime = (pct / 100) * audio.duration;
    isDragging = false;
  }
};

// TOUCH EVENTS (Per il trascinamento fluido su cellulare/iPad)
slider.addEventListener('touchstart', (e) => { 
  isDragging = true; 
  moveSlider(e); 
}, { passive: false });

window.addEventListener('touchmove', (e) => { 
  if (isDragging) {
    e.preventDefault(); // Impedisce lo scroll della pagina mentre trascini il pallino
    moveSlider(e);
  }
}, { passive: false });

window.addEventListener('touchend', (e) => {
  if (isDragging) {
    isDragging = false;
    const rect = slider.getBoundingClientRect();
    const lastX = e.changedTouches[0].clientX;
    let offsetX = lastX - rect.left;
    offsetX = Math.max(0, Math.min(offsetX, rect.width));
    const pct = (offsetX / rect.width) * 100;
    audio.currentTime = (pct / 100) * audio.duration;
  }
}, { passive: false });

audio.ontimeupdate = () => {
  if (!isDragging && audio.duration) {
    const pct = (audio.currentTime / audio.duration) * 100;
    fill.style.width = pct + "%";
    handle.style.left = pct + "%";
    document.getElementById('current').innerText = fmt(audio.currentTime);
    document.getElementById('total').innerText = fmt(audio.duration);

    // AGGIUNTA: Comunica al sistema (Android/iPad) la posizione esatta della canzone
    if ('mediaSession' in navigator && audio.duration > 0) {
      navigator.mediaSession.setPositionState({
        duration: audio.duration,
        playbackRate: audio.playbackRate,
        position: audio.currentTime
      });
    }
  }
};

audio.onended = () => {
  if (isLoop) { audio.currentTime = 0; audio.play(); }
  else { document.getElementById('next').click(); }
};

function fmt(t) {
  if (isNaN(t)) return "0:00";
  const m = Math.floor(t / 60), s = Math.floor(t % 60);
  return `${m}:${s < 10 ? '0'+s : s}`;
}

function updateMediaSession() {
  if ('mediaSession' in navigator) {
    const s = playlist[songIdx];
    navigator.mediaSession.metadata = new MediaMetadata({
      title: s.title,
      artist: s.artist,
      artwork: [{ src: s.img, sizes: '512x512' }]
    });

    // Collega i tasti della schermata di blocco alle funzioni del tuo player
    navigator.mediaSession.setActionHandler('play', () => { playBtn.click(); });
    navigator.mediaSession.setActionHandler('pause', () => { playBtn.click(); });
    navigator.mediaSession.setActionHandler('previoustrack', () => { document.getElementById('prev').click(); });
    navigator.mediaSession.setActionHandler('nexttrack', () => { document.getElementById('next').click(); });

    // Abilita la barra trascinabile su Android (Samsung Music style)
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      audio.currentTime = details.seekTime;
    });
  }
}

// Gestisce la visibilità della scheda per il background
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    console.log("Il player è in background.");
  }
});


load(songIdx);