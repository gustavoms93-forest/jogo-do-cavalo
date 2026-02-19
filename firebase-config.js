// Importar funções do Firebase diretamente da web (Módulos CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// SUAS CREDENCIAIS DO FIREBASE (Copie do painel do Firebase > Project Settings)
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJETO",
    storageBucket: "SEU_PROJETO.appspot.com",
    messagingSenderId: "NUMERO_AQUI",
    appId: "APP_ID_AQUI"
};

// 1. Inicializar o Firebase e a Base de Dados (Firestore)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. Exportar função para GUARDAR o ranking
window.salvarRankingOnline = async function(dados) {
    try {
        await addDoc(collection(db, "ranking"), dados);
        console.log("Pontuação enviada para a nuvem com sucesso!");
    } catch (erro) {
        console.error("Erro ao tentar guardar online:", erro);
    }
};

// 3. Exportar função para CARREGAR o ranking
window.carregarRankingOnline = async function(tabSize) {
    try {
        // Pedir à base de dados os melhores scores para o tamanho do tabuleiro atual
        const consulta = query(
            collection(db, "ranking"), 
            where("size", "==", tabSize),
            orderBy("score", "desc"),
            limit(10)
        );
        
        const resultados = await getDocs(consulta);
        let listaRanking = [];
        
        resultados.forEach((doc) => {
            listaRanking.push(doc.data());
        });
        
        return listaRanking;

    } catch (erro) {
        console.error("Erro ao descarregar ranking online:", erro);
        return []; // Retorna uma lista vazia para evitar que o ecrã bloqueie
    }
};
