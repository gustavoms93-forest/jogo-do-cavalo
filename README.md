<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Jogo do Cavalo — Elite Cognitiva v5.5</title>
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

        * { box-sizing: border-box; margin: 0; padding: 0; }

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

        details.instructions-panel {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            padding: 12px 15px;
            margin-bottom: 20px;
            width: 100%;
            text-align: left;
            border: 1px solid rgba(255,255,255,0.05);
            transition: all 0.3s ease;
        }

        details.instructions-panel summary {
            font-weight: 600;
            cursor: pointer;
            color: var(--accent);
            list-style: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 15px;
        }

        details.instructions-panel summary::-webkit-details-marker { display: none; }

        .instructions-content {
            margin-top: 15px;
            font-size: 14px;
            color: var(--text-muted);
            line-height: 1.6;
            border-top: 1px solid rgba(255,255,255,0.1);
            padding-top: 12px;
        }

        .instructions-content strong { color: var(--text); }
        .instructions-content p { margin-bottom: 8px; }

        .controls {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
            align-items: center;
            margin-bottom: 15px;
        }

        input[type="text"], select, button {
            padding: 10px 15px;
            border-radius: 8px;
            border: none;
            font-family: inherit;
            font-size: 14px;
            outline: none;
        }

        input[type="text"], select {
            background: #334155;
            color: white;
            border: 1px solid #475569;
            transition: border 0.3s;
        }

        input[type="text"]:focus, select:focus { border-color: var(--accent); }

        button {
            background: var(--accent);
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
        }

        button:hover { background: var(--accent-hover); transform: translateY(-2px); }
        button:active { transform: translateY(0); }

        .toggles-wrapper {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            margin-bottom: 15px;
        }

        .toggle-container {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: var(--text-muted);
            font-weight: 600;
        }

        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
        }

        .toggle-switch input { opacity: 0; width: 0; height: 0; }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: #475569;
            transition: .3s;
            border-radius: 24px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 18px; width: 18px;
            left: 3px; bottom: 3px;
            background-color: white;
            transition: .3s;
            border-radius: 50%;
        }

        input:checked + .slider { background-color: var(--accent); }
        input:checked + .slider:before { transform: translateX(20px); }

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
            max-width: 450px;
            aspect-ratio: 1 / 1;
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
            touch-action: manipulation;
            box-shadow: inset 0 -3px 0 rgba(0,0,0,0.1);
        }

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

        .progress-wrapper { width: 100%; max-width: 600px; margin: 10px auto 20px; }
        
        .progress-bar {
            width: 100%; height: 12px; background: #334155;
            border-radius: 6px; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0
