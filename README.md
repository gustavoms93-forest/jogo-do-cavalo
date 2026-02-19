<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Jogo do Cavalo — Elite Cognitiva v5.3</title>

<style>
:root {
    --bg:#0f172a;
    --panel:#1e293b;
    --accent:#3b82f6;
    --win:#10b981;
    --lose:#ef4444;
    --cell:#cbd5e1;
}

body{
background:linear-gradient(135deg,#0f172a,#172554);
color:white;
font-family:Arial;
text-align:center;
padding:15px;
}

.panel{
background:var(--panel);
padding:15px;
border-radius:12px;
max-width:600px;
margin:auto;
margin-bottom:15px;
}

#board{
display:grid;
gap:6px;
max-width:450px;
aspect-ratio:1;
margin:auto;
padding:10px;
background:var(--panel);
border-radius:12px;
}

.cell{
background:var(--cell);
border-radius:8px;
display:flex;
align-items:center;
justify-content:center;
font-weight:bold;
font-size:20px;
cursor:pointer;
}

.cell.current{
background:var(--win);
color:white;
}

.cell.valid{
background:var(--accent);
color:white;
}

.cell.invalid{
background:var(--lose);
color:white;
}

.cell.possible{
border:3px dashed var(--accent);
}

.tabs{
display:flex;
justify-content:center;
gap:6px;
}

.tab{
background:#334155;
padding:6px 12px;
border-radius:8px;
cursor:pointer;
}

.tab.active{
background:var(--accent);
}

.rank-item{
background:#1e293b;
margin:5px;
padding:8px;
border-radius:8px;
display:flex;
justify-content:space-between;
}

.win{border-left:5px solid var(--win);}
.lose{border-left:5px solid var(--lose);}

.progress-bar{
height:10px;
background:#334155;
border-radius:6px;
margin:10px auto;
max-width:600px;
}

.progress-fill{
height:100%;
background:linear-gradient(90deg,var(--accent),var(--win));
width:0%;
}

</style>
</head>

<body>

<h2>♞ Elite Cognitiva v5.3</h2>

<div class="panel">

<input id="playerName" value="Jogador">

<select id="mode">
<option value="5">5×5</option>
<option value="6">6×6</option>
<option value="7">7×7</option>
<option value="8">8×8</option>
</select>

<select id="timeMode">
<option value="standard">Tempo Padrão</option>
<option value="unlimited">Tempo Livre</option>
</select>

<button onclick="startGame()">Iniciar</button>
<button onclick="resetGame()">Reset</button>

<div>
Tempo: <span id="time">0</span>
Erros: <span id="errors">0/0</span>
Score: <span id="score">0</span>
</div>

</div>

<div class="progress-bar">
<div class="progress-fill" id="progressFill"></div>
</div>

<div id="board"></div>

<div class="panel">

<div class="tabs">
<div class="tab" onclick="selectTab(5)" id="tab5">5×5</div>
<div class="tab" onclick="selectTab(6)" id="tab6">6×6</div>
<div class="tab" onclick="selectTab(7)" id="tab7">7×7</div>
<div class="tab" onclick="selectTab(8)" id="tab8">8×8</div>
</div>

<div id="ranking"></div>

</div>

<script>

const weights={5:1,6:1.3,7:1.7,8:2.2};
const errorLimits={5:3,6:4,7:5,8:6};
const defaultTimes={5:60,6:120,7:240,8:480};

let size=5;
let board=[];
let current=1;
let lastPos=null;
let errors=0;
let attempts=0;
let active=false;
let timer=null;
let startTime=0;
let timeLimit=60;
let timeMode="standard";

const moves=[[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2],[1,-2],[2,-1]];

const boardDiv=document.getElementById("board");

function startGame(){

size=parseInt(mode.value);
timeMode=timeModeSelect.value;
timeLimit=defaultTimes[size];

resetGame();

active=true;
startTime=Date.now();

timer=setInterval(updateTimer,1000);

}

function resetGame(){

clearInterval(timer);

board=[];
current=1;
lastPos=null;
errors=0;
attempts=0;
active=false;

timeSpan.textContent=timeLimit;

createBoard();
updateUI();

}

function createBoard(){

boardDiv.style.gridTemplateColumns=`repeat(${size},1fr)`;
boardDiv.innerHTML="";

for(let r=0;r<size;r++){

board[r]=[];

for(let c=0;c<size;c++){

board[r][c]=0;

let cell=document.createElement("div");

cell.className="cell";

cell.onclick=()=>clickCell(r,c,cell);

boardDiv.appendChild(cell);

}

}

}

function validMove(r,c){

if(!lastPos)return true;

return moves.some(m=>lastPos[0]+m[0]==r&&lastPos[1]+m[1]==c);

}

function clickCell(r,c,cell){

if(!active)return;

attempts++;

if(validMove(r,c)){

board[r][c]=current;

cell.textContent=current;

cell.classList.add("current");

lastPos=[r,c];

current++;

updateUI();

if(current>size*size)finish(true);

}else{

errors++;

cell.classList.add("invalid");

setTimeout(()=>cell.classList.remove("invalid"),300);

if(errors>=errorLimits[size])finish(false);

updateUI();

}

}

function updateTimer(){

let elapsed=Math.floor((Date.now()-startTime)/1000);

if(timeMode=="standard"){

let remain=timeLimit-elapsed;

timeSpan.textContent=remain;

if(remain<=0)finish(false);

}else{

timeSpan.textContent=elapsed;

}

}

function calcScore(win=false){

let progress=(current-1)/(size*size);
let efficiency=(current-1)/(attempts||1);

let score=(progress*500+efficiency*300+(win?300:0))*weights[size];

if(timeMode=="unlimited")score*=0.8;

return Math.round(score);

}

function updateUI(){

errorsSpan.textContent=errors+"/"+errorLimits[size];
scoreSpan.textContent=calcScore(false);

progressFill.style.width=((current-1)/(size*size)*100)+"%";

}

function finish(win){

active=false;

clearInterval(timer);

let score=calcScore(win);

saveRank(win,score);

alert(win?"Vitória":"Derrota");

}

function saveRank(win,score){

let rank=JSON.parse(localStorage.getItem("eliteRank")||"[]");

rank.push({
player:playerName.value,
size:size,
score:score,
win:win,
timeMode:timeMode
});

localStorage.setItem("eliteRank",JSON.stringify(rank));

selectTab(size);

}

function selectTab(s){

document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));

document.getElementById("tab"+s).classList.add("active");

let rank=JSON.parse(localStorage.getItem("eliteRank")||"[]");

ranking.innerHTML="";

rank.filter(r=>r.size==s)
.sort((a,b)=>b.score-a.score)
.slice(0,20)
.forEach((r,i)=>{

let div=document.createElement("div");

div.className="rank-item "+(r.win?"win":"lose");

div.innerHTML=
`<span>${i+1}º ${r.player}</span>
<span>${r.score}</span>`;

ranking.appendChild(div);

});

}

createBoard();
selectTab(5);

</script>

</body>
</html>
