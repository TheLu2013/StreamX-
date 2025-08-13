const recent = [
  {title:"Regular Show - Season 1 Episode 1 - The Power",thumb:"https://archive.org/download/regshow/regshow.thumbs/The%20Regular%20Show%20S01-S08%20%2B%20Movie%20%2B%20Shorts%20%5B1080p%20BluRay%20x265%20HEVC%2010bit%5D/Season%201/Regular%20Show%20S01E01%20The%20Power%20%5B%2BCommentary%5D_000001.jpg",src:"https://dn720303.ca.archive.org/0/items/regshow/The%20Regular%20Show%20S01-S08%20%2B%20Movie%20%2B%20Shorts%20%5B1080p%20BluRay%20x265%20HEVC%2010bit%5D/Season%201/Regular%20Show%20S01E01%20The%20Power%20%5B%2BCommentary%5D.mp4",cat:"cartoon"},
  {title:"Gumball - Short",thumb:"assets/images/gumball1.jpg",src:"assets/videos/gumball1.mp4",cat:"cartoon"},
  {title:"SpongeBob - Clip",thumb:"assets/images/sb1.jpg",src:"assets/videos/sb1.mp4",cat:"nick"},
];

const row = document.getElementById('recentRow');
const video = document.getElementById('mainVideo');
const screenBug = document.getElementById('screenBug');
const autoplayToggle = document.getElementById('autoplayToggle');
const skipBtn = document.getElementById('skipIntro');

// load saved autoplay
autoplayToggle.checked = localStorage.getItem('streamx_autoplay') === 'true';
autoplayToggle.addEventListener('change', e=>{
  localStorage.setItem('streamx_autoplay', e.target.checked);
});

// populate thumbnails
recent.forEach((r, i)=>{
  const el = document.createElement('div');
  el.className='thumb';
  el.innerHTML = `
    <img src="${r.thumb}" alt="${r.title}" />
    <div class="meta">${r.title}</div>
  `;
  el.addEventListener('click', ()=> {
    setVideo(r);
  });
  row.appendChild(el);
});

function setVideo(item){
  // set source safely
  const src = item.src;
  // update screen bug by category
  if(item.cat === 'cartoon') screenBug.textContent = 'Cartoon Network';
  else if(item.cat === 'nick') screenBug.textContent = 'Nickelodeon';
  else screenBug.textContent = 'YouTube';

  // load
  video.pause();
  video.querySelectorAll('source').forEach(s=> s.src = src);
  video.load();
  if(autoplayToggle.checked) video.play().catch(()=>{});
}

// Skip intro (example: jump 90s)
skipBtn.addEventListener('click', ()=> {
  const jump = 90;
  if(video.duration) video.currentTime = Math.min(video.duration - 1, jump);
});

// basic autoplay next when video ends (plays next in list)
video.addEventListener('ended', ()=>{
  if(!autoplayToggle.checked) return;
  // find current src in list
  const current = video.querySelector('source').src.split('/').pop();
  let idx = recent.findIndex(r=> r.src.split('/').pop() === current);
  idx = (idx + 1) % recent.length;
  setVideo(recent[idx]);
  video.play().catch(()=>{});
});

// initial load: set first video
setVideo(recent[0]);
