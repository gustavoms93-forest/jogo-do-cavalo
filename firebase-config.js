// 1. Importar as ferramentas do Firebase diretamente da web (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 2. As suas chaves do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCunrwMbJMkd_lkzyLAWn8aAL4uwo3wG7g",
  authDomain: "jogo-do-cavalo-1191a.firebaseapp.com",
  projectId: "jogo-do-cavalo-1191a",
  storageBucket: "jogo-do-cavalo-1191a.firebasestorage.app",
  messagingSenderId: "683835548077",
  appId: "1:683835548077:web:30c65ca80b6e279af38124",
  measurementId: "G-8SDECRW1HY"
};

// 3. Inicializa o Firebase e a Base de Dados (Firestore)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 4. Função para GUARDAR DADOS ONLINE
window.salvarRankingOnline = async function(dados) {
    try {
        await addDoc(collection(db, "ranking"), dados);
        console.log("Pontuação enviada para a nuvem com sucesso!");
    } catch (erro) {
        console.error("Erro ao guardar online:", erro);
    }
};

// 5. Função para CARREGAR DADOS ONLINE
window.carregarRankingOnline = async function(tabSize) {
    try {
        const consulta = query(
            collection(db, "ranking"), 
            where("size", "==", parseInt(tabSize)),
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
        console.error("Erro ao ler ranking online:", erro);
        throw erro; // Ativa o plano B (Offline) no index.html se falhar
    }
};
