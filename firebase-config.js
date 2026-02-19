import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
query,
orderBy,
limit,
where
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {

apiKey:"AIzaSyCunrwMbJMkd_lkzyLAWn8aAL4uwo3wG7g",

authDomain:"jogo-do-cavalo-1191a.firebaseapp.com",

projectId:"jogo-do-cavalo-1191a",

storageBucket:"jogo-do-cavalo-1191a.firebasestorage.app",

messagingSenderId:"683835548077",

appId:"1:683835548077:web:30c65ca80b6e279af38124"

};

const app=initializeApp(firebaseConfig);

const db=getFirestore(app);

window.salvarRankingOnline=async function(data){

await addDoc(
collection(db,"elite-ranking"),
data
);

};

window.carregarRankingOnline=async function(size){

const q=query(
collection(db,"elite-ranking"),
where("size","==",size),
orderBy("score","desc"),
limit(10)
);

const snap=await getDocs(q);

return snap.docs.map(doc=>doc.data());

};
