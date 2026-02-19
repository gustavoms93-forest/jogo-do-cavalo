<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Elite Cognitiva</title>

<style>
body{
background:#0f172a;
color:white;
font-family:Arial;
text-align:center;
}

#board{
display:grid;
gap:5px;
max-width:400px;
margin:20px auto;
}

.cell{
background:#cbd5e1;
color:black;
padding:20px;
cursor:pointer;
font-weight:bold;
}
</style>

</head>
<body>

<h1>♞ Elite Cognitiva</h1>

<button onclick="startGame()">Iniciar</button>

<div id="board"></div>

<script>

let size=5;
let board=[];
let current=1;
let lastPos=null;

const moves=[[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2],[1,-2],[2,-1]];

function startGame(){
createBoard();
}

function createBoard(){

board=[];
current=1;
lastPos=null;

const boardDiv=document.getElementById("board");

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

if(!lastPos) return true;

return moves.some(m=>
lastPos[0]+m[0]==r &&
lastPos[1]+m[1]==c
);
}

function clickCell(r,c,cell){

if(board[r][c]) return;

if(validMove(r,c)){

board[r][c]=current;

cell.innerText=current;

lastPos=[r,c];

current++;

}
else{

alert("Movimento inválido");

}

}

createBoard();

</script>

</body>
</html>
