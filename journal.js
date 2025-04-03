document.addEventListener("DOMContentLoaded", () => {
    console.log("Page Journal chargée.");

    // Affichage de la date du jour
    function afficherDate() {
        const date = new Date();
        const options = { year: "numeric", month: "long", day: "numeric" };
        document.getElementById("dateDisplay").textContent = `Date du jour : ${date.toLocaleDateString("fr-FR", options)}`;
    }

    afficherDate();

    // Configuration Dropbox
    const dropboxAppKey = "0z41GO683A6XB20"; 
    let accessToken = localStorage.getItem("dropboxToken");

    function connectToDropbox() {
        let authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${dropboxAppKey}&response_type=token&redirect_uri=${window.location.origin}/journal.html`;
        window.location.href = authUrl;
    }

    function getDropboxClient() {
        let token = localStorage.getItem("dropboxToken");
        if (!token) {
            alert("Vous devez être connecté à Dropbox !");
            return null;
        }
        try {
            return new Dropbox.Dropbox({ accessToken: token });
        } catch (error) {
            console.error("Erreur lors de la création du client Dropbox :", error);
            return null;
        }
    }

    document.getElementById("connect-dropbox").addEventListener("click", connectToDropbox);

    // Bouton pour consulter Dropbox
    const consultDropboxButton = document.createElement("button");
    consultDropboxButton.textContent = "Consulter ma Dropbox";
    consultDropboxButton.classList.add("icon-button");
    consultDropboxButton.onclick = () => {
        const dbx = getDropboxClient();
        if (dbx) {
            dbx.filesListFolder({ path: "/ToxDetect Backup" })
                .then(response => {
                    alert("Fichiers dans votre Dropbox : " + response.entries.map(entry => entry.name).join(", "));
                })
                .catch(err => alert("Erreur en consultant Dropbox : " + err.message));
        }
    };
    document.body.appendChild(consultDropboxButton);
});

// Extraction du token d'accès Dropbox
function extractAccessToken() {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const token = params.get("access_token");

    if (token) {
        localStorage.setItem("dropboxToken", token);
        console.log("Token enregistré :", token);
        alert("Connexion Dropbox réussie !");
        window.location.href = "journal.html";
    } else {
        console.error("Échec de la récupération du token d'accès.");
    }
}

window.onload = extractAccessToken;
