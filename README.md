<!DOCTYPE html>
<html lang="pt-pt">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Elite Cognitiva v6.0</title>

<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">

<style>
body{
font-family:Poppins;
background:#0f172a;
color:white;
text-align:center;
}

#board{
display:grid;
gap:5px;
max-width:400px;
margin:auto;
}

.cell{
background:#cbd5e1;
color:black;
padding:15px;
cursor:pointer;
}

.rank-item{
background:#1e293b;
margin:5px;
padding:10px;
}
</style>
</head>

<body>

<h1>♞ Elite Cognitiva</h1>

<input id="playerName" value="Jogador">

<select id="mode">
<option value="5">5x5</option>
<option value="6">6x6</option>
<option value="7">7x7</option>
<option value="8">8x8</option>
</select>

<button onclick="startGame()">Iniciar</button>

<div id="board"></div>

<h2>Ranking Online</h2>
<div id="ranking"></div>


<script type="module" src="firebase-config.js"></script>

<script>

let size=5;
let board=[];
let current=1;
let lastPos=null;
let active=false;

const moves=[[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2],[1,-2],[2,-1]];

const boardDiv=document.getElementById("board");
const rankingDiv=document.getElementById("ranking");
const playerName=document.getElementById("playerName");

function startGame(){

size=parseInt(document.getElementById("mode").value);

createBoard();

active=true;

current=1;

lastPos=null;

}

function createBoard(){

boardDiv.style.gridTemplateColumns=`repeat(${size},1fr)`;

boardDiv.innerHTML="";

board=[];

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

return moves.some(m=>
lastPos[0]+m[0]==r && lastPos[1]+m[1]==c
);

}

function clickCell(r,c,cell){

if(!active)return;

if(board[r][c])return;

if(validMove(r,c)){

board[r][c]=current;

cell.innerText=current;

lastPos=[r,c];

current++;

if(current>size*size){

finish(true);

}

}else{

finish(false);

}

}

function calcScore(win){

return win?1000:100;

}

async function finish(win){

active=false;

let score=calcScore(win);

await saveRank(win,score);

}

async function saveRank(win,score){

let data={

player:playerName.value,

size:size,

score:score,

win:win,

date:Date.now()

};

// local
let local=JSON.parse(localStorage.getItem("eliteRank")||"[]");

local.push(data);

localStorage.setItem("eliteRank",JSON.stringify(local));


// online
if(window.salvarRankingOnline){

await salvarRankingOnline(data);

}

loadRanking(size);

}

async function loadRanking(size){

rankingDiv.innerHTML="Carregando...";

let rank=[];

if(window.carregarRankingOnline){

rank=await carregarRankingOnline(size);

}

rankingDiv.innerHTML="";

rank.forEach((r,i)=>{

let div=document.createElement("div");

div.className="rank-item";

div.innerText=

(i+1)+"º "+r.player+" Score:"+r.score;

rankingDiv.appendChild(div);

});

}

startGame();

loadRanking(5);

</script>

</body>
</html>
