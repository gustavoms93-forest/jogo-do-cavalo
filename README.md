[index.html.html](https://github.com/user-attachments/files/25397334/index.html.html)
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jogo do Cavalo — Sistema Cognitivo Elite</title>
    <style>
        :root {
            --bg-color: #0f172a;
            --panel-bg: #1e293b;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --accent: #3b82f6;
            --accent-hover: #2563eb;
            --success: #10b981;
            --error: #ef4444;
            --board-5: #64748b;
            --board-6: #16a34a;
            --board-7: #2563eb;
            --board-8: #9333ea;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-main);
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        /* Container & Layout */
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            flex: 1;
            display: flex;
            flex-direction: column;
            width: 100%;
        }

        header {
            text-align: center;
            margin-bottom: 20px;
            animation: fadeIn 1s ease-out;
        }

        header h1 {
            font-size: 2rem;
            color: var(--text-main);
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            margin-bottom: 5px;
        }

        header p {
            color: var(--text-muted);
            font-size: 0.9rem;
        }

        /* Views */
        .view { display: none; animation: fadeIn 0.4s ease-out; }
        .view.active { display: block; }

        /* Menu & Instructions */
        .menu-card, .instructions {
            background: var(--panel-bg);
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
        }

        .input-group {
            margin-bottom: 15px;
        }

        .input-group label {
            display: block;
            margin-bottom: 8px;
            color: var(--text-muted);
            font-weight: 600;
        }

        input[type="text"], select {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #334155;
            background: #0f172a;
            color: white;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.3s;
        }

        input[type="text"]:focus, select:focus {
            border-color: var(--accent);
        }

        button {
            background: var(--accent);
            color: white;
            border: none;
            padding: 14px 24px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            width: 100%;
            transition: background 0.3s, transform 0.1s;
        }

        button:hover { background: var(--accent-hover); }
        button:active { transform: scale(0.98); }
        
        button.danger { background: #b91c1c; margin-top: 15px; }
        button.danger:hover { background: #991b1b; }

        .instructions h2 { margin-bottom: 10px; font-size: 1.3rem; border-bottom: 1px solid #334155; padding-bottom: 5px; }
        .instructions ul { margin-left: 20px; margin-top: 10px; color: var(--text-muted); line-height: 1.6; }

        /* Game Panel */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 10px;
            background: var(--panel-bg);
            padding: 15px;
            border-radius: 12px;
            margin-bottom: 20px;
            text-align: center;
        }

        .stat-item {
            display: flex;
            flex-direction: column;
        }

        .stat-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-val { font-size: 1.2rem; font-weight: bold; margin-top: 4px; }
        
        .val-error { color: var(--error); }
        .val-success { color: var(--success); }

        /* Board */
        .board-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 20px 0;
        }

        .board {
            display: grid;
            gap: 4px;
            background: #334155;
            padding: 4px;
            border-radius: 8px;
            width: 95vw;
            max-width: 450px;
            aspect-ratio: 1 / 1;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }

        .cell {
            background: #1e293b;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            color: rgba(255,255,255,0.2);
            font-size: 1.2rem;
            transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
        }

        .cell:hover { background: #334155; }
        
        .cell.visited {
            background: var(--accent);
            color: white;
            cursor: default;
        }

        .cell.current {
            background: var(--success);
            color: white;
            box-shadow: 0 0 15px var(--success);
            z-index: 2;
            transform: scale(1.05);
        }

        .cell.error-anim { animation: shake 0.4s ease-in-out; background: var(--error) !important; color: white; }
        .cell.success-anim { animation: pop 0.3s ease-out; }

        /* Ranking Table */
        .ranking-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 20px;
            max-height: 60vh;
            overflow-y: auto;
        }

        .ranking-item {
            background: #1e293b;
            padding: 15px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-left: 5px solid transparent;
        }

        .rank-win { border-color: #064e3b; background: rgba(6, 78, 59, 0.2); }
        .rank-loss { border-color: #7f1d1d; background: rgba(127, 29, 29, 0.2); }

        .rank-info h4 { margin-bottom: 4px; }
        .rank-info p { font-size: 0.85rem; color: var(--text-muted); }
        
        .rank-score { text-align: right; }
        .rank-score h3 { color: var(--accent); }
        .rank-score p { font-size: 0.8rem; font-weight: bold; }

        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.7rem;
            margin-left: 5px;
            color: white;
        }

        /* Footer */
        footer {
            text-align: center;
            padding: 20px;
            color: var(--text-muted);
            font-size: 0.9rem;
            line-height: 1.5;
            background: #0b1120;
            margin-top: auto;
        }

        /* Animations */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        @keyframes pop { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
        
        /* Modals */
        .modal-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex; justify-content: center; align-items: center;
            z-index: 100;
            visibility: hidden; opacity: 0;
            transition: all 0.3s;
        }
        .modal-overlay.active { visibility: visible; opacity: 1; }
        .modal-content {
            background: var(--panel-bg); padding: 30px; border-radius: 12px;
            text-align: center; max-width: 400px; width: 90%;
            transform: scale(0.9); transition: all 0.3s;
        }
        .modal-overlay.active .modal-content { transform: scale(1); }
        .modal-content h2 { margin-bottom: 15px; font-size: 1.8rem; }
        .modal-content p { color: var(--text-muted); margin-bottom: 10px; }
        .modal-content .score-display { font-size: 2.5rem; color: var(--accent); font-weight: bold; margin: 15px 0; }
        .modal-content .class-display { font-size: 1.2rem; margin-bottom: 25px; padding: 5px; border-radius: 4px; background: rgba(255,255,255,0.05); }

    </style>
</head>
<body>

    <div class="container">
        <header>
            <h1>Jogo do Cavalo</h1>
            <p>Sistema Cognitivo Elite</p>
        </header>

        <div id="view-menu" class="view active">
            <div class="menu-card">
                <div class="input-group">
                    <label for="playerName">Nome do Jogador</label>
                    <input type="text" id="playerName" placeholder="Digite seu nome" maxlength="20">
                </div>
                <div class="input-group">
                    <label for="difficulty">Dificuldade e Peso Cognitivo</label>
                    <select id="difficulty">
                        <option value="5">5×5 — Iniciante (Peso: 1.0)</option>
                        <option value="6">6×6 — Intermediário (Peso: 1.3)</option>
                        <option value="7">7×7 — Avançado (Peso: 1.7)</option>
                        <option value="8">8×8 — Elite (Peso: 2.2)</option>
                    </select>
                </div>
                <button onclick="startGame()">INICIAR AVALIAÇÃO</button>
                <button onclick="showRanking()" style="background: #334155; margin-top: 10px;">VER RANKING</button>
            </div>

            <div class="instructions">
                <h2>Como Jogar</h2>
                <ul>
                    <li><strong>Objetivo:</strong> Preencha todo o tabuleiro movendo-se exatamente como o Cavalo do Xadrez (em "L").</li>
                    <li><strong>Regra:</strong> Duas casas numa direção, uma casa na perpendicular. Cada célula só pode ser usada uma vez.</li>
                    <li><strong>Início:</strong> O primeiro clique no tabuleiro define sua posição inicial.</li>
                    <li><strong>Fim de Jogo:</strong> Ocorre ao preencher o tabuleiro (Vitória), ficar sem movimentos válidos, o tempo acabar, ou atingir o limite de 3 erros (Derrota).</li>
                    <li><strong>Sistema Cognitivo:</strong> Sua pontuação avaliará seu progresso, eficiência (precisão dos cliques), velocidade de decisão e erros.</li>
                </ul>
            </div>
        </div>

        <div id="view-game" class="view">
            <div class="stats-grid" id="stats-panel">
                <div class="stat-item"><span class="stat-label">Tempo Rest.</span><span class="stat-val" id="st-time">00:00</span></div>
                <div class="stat-item"><span class="stat-label">Erros</span><span class="stat-val val-error" id="st-errors">0/3</span></div>
                <div class="stat-item"><span class="stat-label">Progresso</span><span class="stat-val" id="st-prog">0%</span></div>
                <div class="stat-item"><span class="stat-label">Eficiência</span><span class="stat-val" id="st-eff">100%</span></div>
                <div class="stat-item"><span class="stat-label">Score Atual</span><span class="stat-val val-success" id="st-score">0</span></div>
            </div>

            <div class="board-container">
                <div id="game-board" class="board"></div>
            </div>

            <button class="danger" onclick="giveUp()">Desistir da Partida</button>
        </div>

        <div id="view-ranking" class="view">
            <div class="menu-card">
                <h2>Ranking Cognitivo (Top 20)</h2>
                <div id="ranking-container" class="ranking-list">
                    </div>
                <button onclick="showMenu()" style="margin-top: 20px;">Voltar ao Menu</button>
            </div>
        </div>
    </div>

    <div id="result-modal" class="modal-overlay">
        <div class="modal-content">
            <h2 id="res-title">Fim de Jogo</h2>
            <p id="res-reason">Você ficou sem movimentos.</p>
            <div class="score-display" id="res-score">1250</div>
            <div class="class-display" id="res-class">Nível: Excelente</div>
            <button onclick="closeModalAndMenu()">Voltar ao Menu Principal</button>
            <button onclick="showRankingFromModal()" style="background: #334155; margin-top: 10px;">Ver Ranking</button>
        </div>
    </div>

    <footer>
        Jogo do Cavalo<br>
        Criado por Gustavo Moreira Saraiva<br>
        Manoel Emídio-PI, 2026
    </footer>

    <script>
        // --- CONFIGURAÇÕES DO JOGO ---
        const MODES = {
            '5': { size: 5, weight: 1.0, timeLimit: 60, color: 'var(--board-5)', maxErrors: 3 },
            '6': { size: 6, weight: 1.3, timeLimit: 120, color: 'var(--board-6)', maxErrors: 3 },
            '7': { size: 7, weight: 1.7, timeLimit: 240, color: 'var(--board-7)', maxErrors: 3 },
            '8': { size: 8, weight: 2.2, timeLimit: 480, color: 'var(--board-8)', maxErrors: 3 }
        };

        const MOVES = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];

        // --- ESTADO GLOBAL ---
        let state = {
            player: '',
            size: 5,
            mode: null,
            board: [],
            visitedCount: 0,
            totalCells: 25,
            currentRow: null,
            currentCol: null,
            errors: 0,
            totalClicks: 0,
            timeLeft: 0,
            timeElapsed: 0,
            timerInterval: null,
            active: false,
            score: 0,
            classif: ''
        };

        // --- NAVEGAÇÃO ---
        function switchView(viewId) {
            document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
            document.getElementById(viewId).classList.add('active');
        }

        function showMenu() { switchView('view-menu'); }
        function showRanking() { loadRanking(); switchView('view-ranking'); }
        function showRankingFromModal() {
            document.getElementById('result-modal').classList.remove('active');
            showRanking();
        }
        function closeModalAndMenu() {
            document.getElementById('result-modal').classList.remove('active');
            showMenu();
        }

        // --- INICIALIZAÇÃO DO JOGO ---
        function startGame() {
            const nameInput = document.getElementById('playerName').value.trim();
            state.player = nameInput || 'Jogador Desconhecido';
            state.size = parseInt(document.getElementById('difficulty').value);
            state.mode = MODES[state.size];
            
            state.totalCells = state.size * state.size;
            state.visitedCount = 0;
            state.errors = 0;
            state.totalClicks = 0;
            state.timeLeft = state.mode.timeLimit;
            state.timeElapsed = 0;
            state.currentRow = null;
            state.currentCol = null;
            state.active = true;
            state.score = 0;

            // Limpa tabuleiro lógico
            state.board = Array(state.size).fill().map(() => Array(state.size).fill(false));

            renderBoard();
            updatePanel();
            switchView('view-game');

            clearInterval(state.timerInterval);
            state.timerInterval = setInterval(gameTick, 1000);
        }

        function renderBoard() {
            const boardEl = document.getElementById('game-board');
            boardEl.style.gridTemplateColumns = `repeat(${state.size}, 1fr)`;
            boardEl.innerHTML = '';

            for (let r = 0; r < state.size; r++) {
                for (let c = 0; c < state.size; c++) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';
                    cell.id = `cell-${r}-${c}`;
                    cell.onclick = () => handleCellClick(r, c);
                    boardEl.appendChild(cell);
                }
            }
        }

        // --- LÓGICA PRINCIPAL ---
        function handleCellClick(r, c) {
            if (!state.active) return;
            state.totalClicks++;

            // Primeiro movimento (Escolhe onde começar)
            if (state.currentRow === null) {
                moveTo(r, c);
                return;
            }

            if (isValidMove(r, c)) {
                moveTo(r, c);
            } else {
                registerError(r, c);
            }
        }

        function isValidMove(r, c) {
            if (state.board[r][c]) return false; // Já visitado
            const dr = Math.abs(state.currentRow - r);
            const dc = Math.abs(state.currentCol - c);
            return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
        }

        function moveTo(r, c) {
            // Remove estado 'current' da anterior
            if (state.currentRow !== null) {
                const prevCell = document.getElementById(`cell-${state.currentRow}-${state.currentCol}`);
                prevCell.classList.remove('current');
                prevCell.innerHTML = '';
            }

            state.currentRow = r;
            state.currentCol = c;
            state.board[r][c] = true;
            state.visitedCount++;

            const cell = document.getElementById(`cell-${r}-${c}`);
            cell.classList.add('visited', 'current', 'success-anim');
            cell.innerText = state.visitedCount;
            setTimeout(() => cell.classList.remove('success-anim'), 300);

            updatePanel();

            // Checa Vitória
            if (state.visitedCount === state.totalCells) {
                endGame(true, "Você preencheu todo o tabuleiro!");
                return;
            }

            // Checa se há movimentos disponíveis
            if (!hasAvailableMoves(r, c)) {
                endGame(false, "Não há mais movimentos válidos possíveis.");
            }
        }

        function registerError(r, c) {
            state.errors++;
            const cell = document.getElementById(`cell-${r}-${c}`);
            cell.classList.add('error-anim');
            setTimeout(() => cell.classList.remove('error-anim'), 400);
            
            updatePanel();

            if (state.errors >= state.mode.maxErrors) {
                endGame(false, "Limite de erros atingido.");
            }
        }

        function hasAvailableMoves(r, c) {
            for (let m of MOVES) {
                let nr = r + m[0];
                let nc = c + m[1];
                if (nr >= 0 && nr < state.size && nc >= 0 && nc < state.size && !state.board[nr][nc]) {
                    return true;
                }
            }
            return false;
        }

        // --- LOOP DE TEMPO ---
        function gameTick() {
            if (!state.active) return;
            state.timeLeft--;
            state.timeElapsed++;
            
            updatePanel();

            if (state.timeLeft <= 0) {
                endGame(false, "Tempo esgotado!");
            }
        }

        // --- PAINEL E MATEMÁTICA COGNITIVA ---
        function calculateCurrentScore(isWin = false) {
            if (state.visitedCount === 0) return 0;

            const progress = state.visitedCount / state.totalCells;
            const validClicks = state.visitedCount;
            const efficiency = validClicks / Math.max(1, state.totalClicks);

            const scoreBase = (progress * 500) + (efficiency * 300);
            const bonusTempo = (state.timeLeft / state.mode.timeLimit) * 200;
            const bonusErros = Math.max(0, 200 - (state.errors * 20));
            const bonusVitoria = isWin ? 300 : 0;

            const scoreFinal = (scoreBase + bonusTempo + bonusErros + bonusVitoria) * state.mode.weight;
            return Math.floor(scoreFinal);
        }

        function getCognitiveClass(score) {
            if (score < 200) return "Muito baixo";
            if (score < 400) return "Abaixo da média";
            if (score < 600) return "Médio";
            if (score < 800) return "Acima da média";
            if (score < 1000) return "Superior";
            if (score < 1300) return "Excelente";
            if (score < 1600) return "Elite";
            return "Nível Gênio";
        }

        function formatTime(secs) {
            const m = Math.floor(secs / 60).toString().padStart(2, '0');
            const s = (secs % 60).toString().padStart(2, '0');
            return `${m}:${s}`;
        }

        function updatePanel() {
            const progress = ((state.visitedCount / state.totalCells) * 100).toFixed(1);
            const efficiency = state.totalClicks > 0 ? ((state.visitedCount / state.totalClicks) * 100).toFixed(1) : 100;
            state.score = calculateCurrentScore(false); // Estima sem bônus de vitória no meio da partida

            document.getElementById('st-time').innerText = formatTime(Math.max(0, state.timeLeft));
            document.getElementById('st-errors').innerText = `${state.errors}/${state.mode.maxErrors}`;
            document.getElementById('st-prog').innerText = `${progress}%`;
            document.getElementById('st-eff').innerText = `${efficiency}%`;
            document.getElementById('st-score').innerText = state.score;
        }

        // --- FIM DE JOGO ---
        function giveUp() {
            if(confirm("Tem certeza que deseja desistir?")) {
                endGame(false, "Você desistiu da partida.");
            }
        }

        function endGame(isWin, reason) {
            state.active = false;
            clearInterval(state.timerInterval);
            
            // Recalcula score final aplicando bônus de vitória se houver
            state.score = calculateCurrentScore(isWin);
            state.classif = getCognitiveClass(state.score);

            // Interface do Modal
            const modal = document.getElementById('result-modal');
            const title = document.getElementById('res-title');
            
            title.innerText = isWin ? "Vitória!" : "Fim de Jogo";
            title.style.color = isWin ? varSuccess() : varError();
            
            document.getElementById('res-reason').innerText = reason;
            document.getElementById('res-score').innerText = `${state.score} PTS`;
            document.getElementById('res-class').innerText = `Classificação: ${state.classif}`;

            saveToRanking(isWin);
            modal.classList.add('active');
        }

        function varSuccess() { return getComputedStyle(document.documentElement).getPropertyValue('--success').trim(); }
        function varError() { return getComputedStyle(document.documentElement).getPropertyValue('--error').trim(); }

        // --- RANKING (PERSISTÊNCIA) ---
        function saveToRanking(isWin) {
            const record = {
                name: state.player,
                score: state.score,
                classif: state.classif,
                board: `${state.size}×${state.size}`,
                boardColor: MODES[state.size].color,
                result: isWin ? 'Vitória' : 'Derrota',
                time: state.timeElapsed,
                errors: state.errors,
                date: new Date().toLocaleDateString()
            };

            let ranking = JSON.parse(localStorage.getItem('cavaloEliteRanking')) || [];
            ranking.push(record);
            
            // Ordena decrescente pelo Score
            ranking.sort((a, b) => b.score - a.score);
            
            // Mantém apenas o Top 20
            if (ranking.length > 20) ranking = ranking.slice(0, 20);

            localStorage.setItem('cavaloEliteRanking', JSON.stringify(ranking));
        }

        function loadRanking() {
            const container = document.getElementById('ranking-container');
            const ranking = JSON.parse(localStorage.getItem('cavaloEliteRanking')) || [];

            container.innerHTML = '';

            if (ranking.length === 0) {
                container.innerHTML = '<p style="text-align:center; color:#94a3b8;">Nenhum registro encontrado ainda.</p>';
                return;
            }

            ranking.forEach((r, index) => {
                const item = document.createElement('div');
                item.className = `ranking-item ${r.result === 'Vitória' ? 'rank-win' : 'rank-loss'}`;
                
                item.innerHTML = `
                    <div class="rank-info">
                        <h4>${index + 1}. ${r.name} 
                            <span class="badge" style="background:${r.boardColor}">${r.board}</span>
                            <span class="badge" style="background:${r.result === 'Vitória' ? '#064e3b' : '#7f1d1d'}">${r.result}</span>
                        </h4>
                        <p>${r.classif} | Tempo: ${formatTime(r.time)} | Erros: ${r.errors}</p>
                    </div>
                    <div class="rank-score">
                        <h3>${r.score}</h3>
                        <p>PTS</p>
                    </div>
                `;
                container.appendChild(item);
            });
        }
    </script>

<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCunrwMbJMkd_lkzyLAWn8aAL4uwo3wG7g",
  authDomain: "jogo-do-cavalo-1191a.firebaseapp.com",
  projectId: "jogo-do-cavalo-1191a",
  storageBucket: "jogo-do-cavalo-1191a.firebasestorage.app",
  messagingSenderId: "683835548077",
  appId: "1:683835548077:web:30c65ca80b6e279af38124",
  measurementId: "G-8SDECRW1HY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.saveToRanking = async function(isWin) {
    const record = {
        name: state.player,
        score: state.score,
        classif: state.classif,
        board: `${state.size}×${state.size}`,
        result: isWin ? 'Vitória' : 'Derrota',
        time: state.timeElapsed,
        errors: state.errors,
        date: new Date().toLocaleDateString()
    };
    await addDoc(collection(db, "ranking"), record);
};

window.loadRanking = async function() {
    const container = document.getElementById('ranking-container');
    container.innerHTML = "Carregando ranking global...";

    const q = query(collection(db, "ranking"), orderBy("score", "desc"), limit(20));
    const querySnapshot = await getDocs(q);

    container.innerHTML = "";

    if (querySnapshot.empty) {
        container.innerHTML = "Nenhum registro encontrado.";
        return;
    }

    let index = 1;
    querySnapshot.forEach((doc) => {
        const r = doc.data();
        const item = document.createElement('div');
        item.className = "ranking-item";

        item.innerHTML = `
            <div class="rank-info">
                <h4>${index}. ${r.name}</h4>
                <p>${r.classif} | Tempo: ${formatTime(r.time)} | Erros: ${r.errors}</p>
            </div>
            <div class="rank-score">
                <h3>${r.score}</h3>
                <p>PTS</p>
            </div>
        `;

        container.appendChild(item);
        index++;
    });
};
</script>

</body>
</html>
