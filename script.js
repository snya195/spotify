const songs = [
  {title:"Midnight Drive", artist:"Nova Lane", color:"gradient-one", src:""},
  {title:"Electric Dreams", artist:"The Signals", color:"gradient-two", src:""},
  {title:"Ocean Lights", artist:"Mira", color:"gradient-three", src:""},
  {title:"City After Dark", artist:"Neon Avenue", color:"gradient-one", src:""},
  {title:"Golden Hour", artist:"Aria Bloom", color:"gradient-two", src:""},
  {title:"Weekend Energy", artist:"Pulse Club", color:"gradient-three", src:""}
];

let current = -1;
let liked = new Set();
let playlists = ["My Playlist"];
const audio = document.getElementById("audio");

const trackGrid = document.getElementById("trackGrid");
const searchResults = document.getElementById("searchResults");
const searchInput = document.getElementById("searchInput");

function renderSongs(list, target=trackGrid){
  target.innerHTML = list.map((s,i)=>`
    <article class="track" onclick="playTrack(${songs.indexOf(s)})">
      <div class="cover ${s.color}">${s.title.split(" ")[0]}<br>♪</div>
      <h3>${s.title}</h3><p>${s.artist}</p>
    </article>`).join("");
}
renderSongs(songs);

function playTrack(index){
  current=index;
  const s=songs[index];
  document.getElementById("nowTitle").textContent=s.title;
  document.getElementById("nowArtist").textContent=s.artist;
  document.getElementById("miniCover").className="mini-cover "+s.color;
  document.getElementById("miniCover").textContent="♫";
  // Add your own audio file path in songs[].src to enable real audio playback.
  if(s.src){audio.src=s.src; audio.play(); document.getElementById("playBtn").textContent="Ⅱ";}
  else {document.getElementById("playBtn").textContent="▶"; showMessage("Demo track selected — add an audio file path in script.js");}
}
function togglePlay(){
  if(current<0){playTrack(0);return}
  if(!songs[current].src){showMessage("Add an audio file path to play this track.");return}
  if(audio.paused){audio.play();document.getElementById("playBtn").textContent="Ⅱ";}
  else{audio.pause();document.getElementById("playBtn").textContent="▶";}
}
function nextTrack(){playTrack((current+1)%songs.length)}
function previousTrack(){playTrack((current-1+songs.length)%songs.length)}
function shuffleAll(){playTrack(Math.floor(Math.random()*songs.length))}
function toggleLike(){
  if(current<0)return showMessage("Choose a song first");
  if(liked.has(current)){liked.delete(current);showMessage("Removed from Liked Songs")}
  else{liked.add(current);showMessage("Added to Liked Songs")}
  renderLibrary();
}
function createPlaylist(){
  const name=prompt("Playlist name:");
  if(name){playlists.push(name);renderLibrary();showMessage("Playlist created")}
}
function renderLibrary(){
  const list=document.getElementById("libraryList");
  list.innerHTML=playlists.map(p=>`<div class="library-item"><span>♫ ${p}</span><span>Playlist</span></div>`).join("");
  if(liked.size) list.innerHTML+=`<div class="library-item"><span>♥ Liked Songs</span><span>${liked.size} songs</span></div>`;
}
renderLibrary();

function showView(name){
  ["home","search","library"].forEach(v=>document.getElementById(v+"View").classList.toggle("hidden",v!==name));
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
}
document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));

searchInput.addEventListener("input",()=>{
  const q=searchInput.value.toLowerCase().trim();
  showView("search");
  renderSongs(q?songs.filter(s=>(s.title+" "+s.artist).toLowerCase().includes(q)):songs,searchResults);
});

document.getElementById("volume").addEventListener("input",e=>audio.volume=e.target.value/100);
audio.addEventListener("timeupdate",()=>{
  if(audio.duration){
    document.getElementById("progress").value=(audio.currentTime/audio.duration)*100;
    document.getElementById("currentTime").textContent=formatTime(audio.currentTime);
    document.getElementById("duration").textContent=formatTime(audio.duration);
  }
});
document.getElementById("progress").addEventListener("input",e=>{
  if(audio.duration)audio.currentTime=(e.target.value/100)*audio.duration;
});
audio.addEventListener("ended",nextTrack);

function formatTime(sec){if(!Number.isFinite(sec))return"0:00";return Math.floor(sec/60)+":"+String(Math.floor(sec%60)).padStart(2,"0")}
function showMessage(msg){
  let el=document.getElementById("toast");
  if(!el){el=document.createElement("div");el.id="toast";Object.assign(el.style,{position:"fixed",right:"20px",bottom:"110px",background:"#fff",color:"#111",padding:"12px 18px",borderRadius:"8px",zIndex:"99",fontWeight:"bold"});document.body.appendChild(el)}
  el.textContent=msg;clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.remove(),2200);
}
