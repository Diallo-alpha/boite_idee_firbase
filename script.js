// Importation des modules Firebase nécessaires pour l'application
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, set, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

// Configuration de Firebase avec les informations spécifiques au projet
const firebaseConfig = {
    apiKey: "AIzaSyACm4exmZXBX3CnNTTCDH_HCEdfFVMp8iU",
    authDomain: "boite-a-idee-723e3.firebaseapp.com",
    databaseURL: "https://boite-a-idee-723e3-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "boite-a-idee-723e3",
    storageBucket: "boite-a-idee-723e3.appspot.com",
    messagingSenderId: "257187446013",
    appId: "1:257187446013:web:337420cf6a3c8dad631294"
};

// Initialisation de l'application Firebase
const app = initializeApp(firebaseConfig);

// Initialisation de la base de données Firebase Realtime Database
const db = getDatabase(app);

// Référence aux éléments HTML pour le formulaire d'idées, les cartes d'idées, et les messages
const ideaForm = document.getElementById("ideaForm");
const ideasCards = document.getElementById("ideasCards");
const messageDiv = document.getElementById("message");

// Fonction pour afficher un message temporaire
function showMessage(message, type) {
    messageDiv.textContent = message;  // Définir le texte du message
    messageDiv.className = `alert alert-${type}`;  // Définir la classe CSS pour le type d'alerte
    setTimeout(() => {
        messageDiv.textContent = "";  // Effacer le message après 2 secondes
        messageDiv.className = "";  // Réinitialiser la classe CSS
    }, 2000);
}

// Fonction pour ajouter une idée dans la base de données
async function addIdea(idea) {
    try {
        const newIdeaRef = push(ref(db, 'ideas'));  // Créer une nouvelle référence unique pour l'idée
        await set(newIdeaRef, idea);  // Ajouter l'idée dans la base de données
        renderIdeas();  // Recharger les idées pour afficher la nouvelle
        showMessage("Idée ajoutée avec succès", "success");  // Afficher un message de succès
    } catch (error) {
        console.error("Erreur d'ajout d'idée :", error);
        showMessage(`Erreur: ${error.message}`, "danger");  // Afficher un message d'erreur
    }
}

// Fonction pour récupérer et afficher les idées depuis la base de données
async function renderIdeas() {
    try {
        const ideasRef = ref(db, 'ideas');  // Référence à la collection 'ideas' dans la base de données
        onValue(ideasRef, (snapshot) => {
            ideasCards.innerHTML = "";  // Réinitialiser le contenu des cartes d'idées
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const idea = childSnapshot.val();  // Obtenir les données de l'idée
                    const ideaId = childSnapshot.key;  // Obtenir l'ID de l'idée
                    const card = document.createElement("div");
                    card.className = `col-md-3 idee`;

                    // Créer le contenu HTML de la carte pour l'idée
                    card.innerHTML = `
                        <div class="card h-100 ${idea.approved ? 'approved' : 'disapproved'}">
                            <div class="card-body">
                                <h5 class="card-title">${idea.title}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">${idea.categorie}</h6>
                                <p class="card-text">${idea.description}</p>
                                <button class="btn btn-success btn-sm" onclick="approveIdea('${ideaId}')">Approuver</button>
                                <button class="btn btn-warning btn-sm" onclick="disapproveIdea('${ideaId}')">Désapprouver</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteIdea('${ideaId}')">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `;
                    ideasCards.appendChild(card);  // Ajouter la carte au conteneur des cartes
                });
            }
        });
    } catch (error) {
        console.error("Erreur de récupération des idées :", error);
        showMessage(`Erreur: ${error.message}`, "danger");  // Afficher un message d'erreur
    }
}

// Fonction pour approuver une idée
async function approveIdea(id) {
    try {
        await update(ref(db, `ideas/${id}`), { approved: true });  // Mettre à jour le statut de l'idée à approuvé
        renderIdeas();  // Recharger les idées pour refléter la modification
    } catch (error) {
        console.error("Erreur d'approbation de l'idée :", error);
        showMessage(`Erreur: ${error.message}`, "danger");  // Afficher un message d'erreur
    }
}

// Fonction pour désapprouver une idée
async function disapproveIdea(id) {
    try {
        await update(ref(db, `ideas/${id}`), { approved: false });  // Mettre à jour le statut de l'idée à désapprouvé
        renderIdeas();  // Recharger les idées pour refléter la modification
    } catch (error) {
        console.error("Erreur de désapprobation de l'idée :", error);
        showMessage(`Erreur: ${error.message}`, "danger");  // Afficher un message d'erreur
    }
}

// Fonction pour supprimer une idée
async function deleteIdea(id) {
    try {
        await remove(ref(db, `ideas/${id}`));  // Supprimer l'idée de la base de données
        renderIdeas();  // Recharger les idées pour refléter la suppression
    } catch (error) {
        console.error("Erreur de suppression de l'idée :", error);
        showMessage(`Erreur: ${error.message}`, "danger");  // Afficher un message d'erreur
    }
}

// Attacher les fonctions au global scope pour qu'elles puissent être appelées dans le HTML
window.approveIdea = approveIdea;
window.disapproveIdea = disapproveIdea;
window.deleteIdea = deleteIdea;

// Gestion de l'envoi du formulaire pour ajouter une nouvelle idée
ideaForm.addEventListener("submit", async (e) => {
    e.preventDefault();  // Empêcher le rechargement de la page
    const newIdea = {
        title: ideaForm.title.value,  // Obtenir la valeur du titre
        categorie: ideaForm.categorie.value,  // Obtenir la valeur de la catégorie
        description: ideaForm.description.value,  // Obtenir la valeur de la description
        approved: false  // Initialiser le statut de l'idée à non approuvé
    };
    await addIdea(newIdea);  // Ajouter l'idée dans la base de données
    ideaForm.reset();  // Réinitialiser le formulaire
});

// Charger les idées à l'initialisation de la page
renderIdeas();
