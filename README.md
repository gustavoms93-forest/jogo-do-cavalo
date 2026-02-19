<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Jogo do Cavalo — Elite Cognitiva v5.2</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --bg: #0f172a;
            --panel: #1e293b;
            --accent: #3b82f6;
            --accent-hover: #2563eb;
            --text: #f8fafc;
            --text-muted: #94a3b8;
            --win: #10b981;
            --lose: #ef4444;
            --cell-empty: #cbd5e1;
            --cell-text: #0f172a;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background: linear-gradient(135deg, var(--bg), #172554);
            color: var(--text);
            font-family: 'Poppins', sans-serif;
            text-align: center;
            min-height: 100vh;
            padding: 20px 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        h1 {
            font-size: clamp(1.5rem, 4vw, 2.2rem);
            margin-bottom: 20px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .panel {
            background: var(--panel);
            padding: 20px;
            border-radius: 16px;
            width: 100%;
            max-width: 600px;
            margin-bottom: 20px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.05);
        }

        .controls {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
            align-items: center;
            margin-bottom: 15px;
        }

        input, select, button {
            padding: 10px 15px;
            border-radius: 8px;
            border: none;
            font-family: inherit;
            font-size: 14px;
            outline: none;
        }

        input, select {
            background: #334155;
            color: white;
            border: 1px solid #475569;
            transition: border 0.3s;
        }

        input:focus, select:focus {
            border-color: var(--accent);
        }

        button {
            background: var(--accent);
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
        }

        button:hover {
            background: var(--accent-hover);
            transform: translateY(-2px);
        }

        button:active {
            transform: translateY(0);
        }

        .instructions {
            text-align: left;
            font-size: 14px;
            color: var(--text-muted);
            line-height: 1.6;
            display: none; /* Escondido por padrão para não poluir, pode adicionar botão para mostrar */
        }

        .stats-bar {
            display: flex;
            justify-content: space-between;
            background: #0f172a;
            padding: 12px 20px;
            border-radius: 10px;
            font-weight: 600;
            margin-top: 15px;
            font-size: clamp(12px, 3vw, 16px);
        }

        .stats-bar span { color: var(--accent); }

        #board {
            display: grid;
            gap: 6px;
            width: 100%;
            max-width: 450px; /* Tamanho máximo no PC */
            aspect-ratio: 1 / 1; /* Mantém sempre quadrado */
            margin: 20px auto;
            background: var(--panel);
            padding: 10px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }

        .cell {
            background: var(--cell-empty);
            color: var(--cell-text);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-weight: 700;
            font-size: clamp(16px, 4vw, 24px);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            user-select: none;
            touch-action: manipulation; /* Evita zoom duplo no celular */
            box-shadow: inset 0 -3px 0 rgba(0,0,0,0.1);
        }

        /* Estados das Células */
        .cell:active { transform: scale(0.92); box-shadow: inset 0 0 0 rgba(0,0,0,0.1); }
        .cell.valid { background: var(--accent); color: white; }
        .cell.current { 
            background: var(--win); 
            color: white; 
            box-shadow: 0 0 15px rgba(16, 185, 129, 0.6);
            transform: scale(1.05);
            z-index: 2;
        }
        .cell.possible {
            background: #e2e8f0;
            border: 3px dashed var(--accent);
            opacity: 0.8;
        }
        .cell.invalid {
            background: var(--lose) !important;
            color: white;
            animation: shake 0.3s ease-in-out;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
        }

        /* Barra de Progresso */
        .progress-wrapper {
            width: 100%;
            max-width: 600px;
            margin: 10px auto 20px;
        }
        
        .progress-bar {
            width: 100%;
            height: 12px;
            background: #334155;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
        }

        .progress-fill {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, var(--accent), var(--win));
            transition: width 0.3s ease;
        }

        /* Abas e Ranking */
        .tabs {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 10px;
            flex-wrap: wrap;
        }

        .tab {
            padding: 8px 16px;
            background: #334155;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s;
        }

        .tab:hover { background: #475569; }
        .tab.active { background: var(--accent); box-shadow: 0 4px 10px rgba(59, 130, 246, 0.4); }

        .rank-item {
            background: rgba(255,255,255,0.05);
            margin: 8px auto;
            padding: 12px;
            width: 100%;
            max-width: 400px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            border: 1px solid rgba(255,255,255,0.05);
        }

        .rank-item.win { border-left: 6px solid var(--win); }
        .rank-item.lose { border-left: 6px solid var(--lose); }

        .tag {
            font-size: 11px;
            padding: 3px 8px;
            border-radius: 12px;
            background: #0f172a;
            margin-left: 8px;
            font-weight: 600;
            text-transform: uppercase;
        }

        footer {
            margin-top: 40px;
            color: var(--text-muted);
            font-size: 12px;
            line-height: 1.5;
        }
    </style>
</head>

<body>

<h1>♞ Elite Cognitiva</h1>

<div class="panel">
    <div class="controls">
        <input id="playerName" value="Jogador" placeholder="Seu Nome">
        <select id="mode">
            <option value="5">Tabuleiro 5×5</option>
            <option value="6">Tabuleiro 6×6</option>
            <option value="7">Tabuleiro 7×7</option>
            <option value="8">Tabuleiro 8×8</option>
        </select>
        <select id="timeMode">
            <option value="standard">Tempo Padrão</option>
            <option value="unlimited">Tempo Ilimitado</option>
        </select>
    </div>
    
    <div class="controls">
        <button onclick="startGame()">Iniciar Jogo</button>
        <button onclick="resetGame()" style="background: #475569;">Zerar Tabuleiro</button>
    </div>

    <div class="stats-bar">
        <div>Tempo: <span id="time">0</span>s</div>
        <div>Erros: <span id="errors" style="color: var(--lose)">0/0</span></div>
        <div>Score: <span id="score" style="color: var(--win)">0</span></div>
    </div>
</div>

<div class="progress-wrapper">
    <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
    </div>
</div>

<div id="board"></div>

<div class="panel" style="margin-top: 20px;">
    <h3>🏆 Ranking Global Local</h3>
    <div class="tabs">
        <div class="tab" onclick="selectTab(5)" id="tab5">5×5</div>
        <div class="tab" onclick="selectTab(6)" id="tab6">6×6</div>
        <div class="tab" onclick="selectTab(7)" id="tab7">7×7</div>
        <div class="tab" onclick="selectTab(8)" id="tab8">8×8</div>
    </div>
    <div id="ranking" style="margin-top: 15px;"></div>
</div>

<footer>
    Jogo do Cavalo v5.2<br>
    Criado por Gustavo Moreira Saraiva<br>
    Manoel Emídio-PI, 2026
</footer>

<script>
    const weights = {5:1, 6:1.3, 7:1.7, 8:2.2};
    const errorLimits = {5:3, 6:4, 7:5, 8:6};
    const defaultTimes = {5:60, 6:120, 7:240, 8:480};

    let size = 5, board = [], current = 1, lastPos = null;
    let startTime = 0, errors = 0, totalAttempts = 0;
    let active = false, timer = null, timeLimit = 60;
    let timeMode = "standard";

    let currentTab = localStorage.getItem("lastMode") || 5;
    const moves = [[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2],[1,-2],[2,-1]];

    // DOM Elements
    const boardDiv = document.getElementById("board");
    const playerName = document.getElementById("playerName");
    const modeSelect = document.getElementById("mode");
    const timeModeSelect = document.getElementById("timeMode");
    const timeSpan = document.getElementById("time");
    const errorsSpan = document.getElementById("errors");
    const scoreSpan = document.getElementById("score");
    const progressFill = document.getElementById("progressFill");
    const rankingDiv = document.getElementById("ranking");

    function startGame() {
        size = parseInt(modeSelect.value);
        timeMode = timeModeSelect.value;
        timeLimit = defaultTimes[size];
        localStorage.setItem("lastMode", size);

        resetGame();
        active = true;
        startTime = Date.now();
        timer = setInterval(updateTimer, 1000);
    }

    function resetGame() {
        clearInterval(timer);
        board = [];
        current = 1;
        lastPos = null;
        errors = 0;
        totalAttempts = 0;
        active = false;
        
        timeSpan.textContent = timeMode === "standard" ? defaultTimes[parseInt(modeSelect.value)] : "0";
        createBoard();
        updateUI();
    }

    function createBoard() {
        // Usa frações (fr) para criar colunas perfeitamente simétricas dependendo do tamanho (5, 6, 7 ou 8)
        boardDiv.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        boardDiv.innerHTML = "";

        for(let r=0; r<size; r++) {
            board[r] = [];
            for(let c=0; c<size; c++) {
                board[r][c] = 0;
                let cell = document.createElement("div");
                cell.className = "cell";
                cell.id = `cell-${r}-${c}`;
                cell.onclick = () => clickCell(r, c, cell);
                boardDiv.appendChild(cell);
            }
        }
        highlightPossibleMoves();
    }

    function validMove(r, c) {
        if(!lastPos) return true; // Primeiro clique é livre
        return moves.some(m => lastPos[0] + m[0] === r && lastPos[1] + m[1] === c);
    }

    function highlightPossibleMoves() {
        // Remove destaques anteriores
        document.querySelectorAll('.cell').forEach(c => c.classList.remove('possible'));
        
        if (!active || !lastPos) return;

        // Adiciona destaque para as próximas jogadas válidas
        moves.forEach(m => {
            let nr = lastPos[0] + m[0];
            let nc = lastPos[1] + m[1];
            if (nr >= 0 && nr < size && nc >= 0 && nc < size && board[nr][nc] === 0) {
                document.getElementById(`cell-${nr}-${nc}`).classList.add('possible');
            }
        });
    }

    function clickCell(r, c, cell) {
        if(!active || board[r][c]) return;

        totalAttempts++;

        if(validMove(r, c)) {
            // Remove a marcação "current" da célula anterior
            if(lastPos) {
                let prevCell = document.getElementById(`cell-${lastPos[0]}-${lastPos[1]}`);
                if(prevCell) prevCell.classList.remove("current");
            }

            board[r][c] = current;
            cell.textContent = current;
            cell.classList.add("valid");
            cell.classList.add("current");
            lastPos = [r, c];
            current++;
            updateUI();
            
            if(current > size * size) {
                finish(true);
            } else {
                highlightPossibleMoves();
            }
        } else {
            errors++;
            cell.classList.add("invalid");
            setTimeout(() => cell.classList.remove("invalid"), 300);
            updateUI();
            
            if(errors >= errorLimits[size]) finish(false);
        }
    }

    function updateTimer() {
        let elapsed = Math.floor((Date.now() - startTime) / 1000);

        if(timeMode === "standard") {
            let remaining = timeLimit - elapsed;
            timeSpan.textContent = remaining;
            if(remaining <= 0) finish(false);
        } else {
            timeSpan.textContent = elapsed;
        }
    }

    function calcScore(win = false) {
        let progress = (current - 1) / (size * size);
        let efficiency = (current - 1) / (totalAttempts || 1);
        let base = progress * 500 + efficiency * 300;
        let score = (base + (win ? 300 : 0)) * weights[size];

        if(timeMode === "unlimited") score *= 0.8;
        return Math.round(score);
    }

    function updateUI() {
        scoreSpan.textContent = calcScore(false);
        errorsSpan.textContent = errors + "/" + errorLimits[size];
        progressFill.style.width = ((current - 1) / (size * size) * 100) + "%";
    }

    function finish(win) {
        active = false;
        clearInterval(timer);
        document.querySelectorAll('.cell').forEach(c => c.classList.remove('possible')); // Limpa visualização
        
        let score = calcScore(win);
        saveRank(win, score);
        
        setTimeout(() => {
            alert((win ? "🏆 VITÓRIA!" : "💀 DERROTA!") + "\nSeu Score: " + score);
        }, 100);
    }

    function saveRank(win, score) {
        let rank = JSON.parse(localStorage.getItem("eliteRank") || "[]");
        rank.push({
            player: playerName.value || "Anônimo",
            size: size,
            score: score,
            win: win,
            timeMode: timeMode
        });
        localStorage.setItem("eliteRank", JSON.stringify(rank));
        selectTab(size);
    }

    function selectTab(tabSize) {
        currentTab = tabSize;
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        
        let activeTab = document.getElementById("tab" + tabSize);
        if(activeTab) activeTab.classList.add("active");

        let rank = JSON.parse(localStorage.getItem("eliteRank") || "[]");
        let filtered = rank.filter(r => r.size == tabSize).sort((a, b) => b.score - a.score).slice(0, 10);

        rankingDiv.innerHTML = "";

        if (filtered.length === 0) {
            rankingDiv.innerHTML = "<p style='color: var(--text-muted); font-size: 14px;'>Nenhuma partida registrada neste tamanho ainda.</p>";
            return;
        }

        filtered.forEach((r, i) => {
            let div = document.createElement("div");
            div.className = "rank-item " + (r.win ? "win" : "lose");
            
            let playerInfo = `<strong>${i + 1}º ${r.player}</strong> <span class="tag">${r.timeMode == "standard" ? "Padrão" : "Livre"}</span>`;
            let scoreInfo = `<span style="font-weight: 700;">Score: ${r.score}</span>`;
            
            div.innerHTML = `<div>${playerInfo}</div> <div>${scoreInfo}</div>`;
            rankingDiv.appendChild(div);
        });
    }

    // Inicialização
    modeSelect.value = currentTab;
    createBoard();
    selectTab(currentTab);
    updateUI();
</script>

</body>
</html>
