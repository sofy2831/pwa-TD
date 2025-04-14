document.addEventListener("DOMContentLoaded", () => {
    console.log("Page d'accueil chargée.");

    const trialKey = "toxDetectTrialStart";
    const now = new Date();
    const storedDate = localStorage.getItem(trialKey);

    let trialExpired = false;
    const banner = document.getElementById("trial-banner");

    if (!storedDate) {
        // Première ouverture, on initialise la date d’essai
        localStorage.setItem(trialKey, now.toISOString());
        banner.innerText = "🎉 Bienvenue ! Vous bénéficiez d’un essai gratuit de 7 jours.";
        banner.style.display = "block";
    } else {
        const startDate = new Date(storedDate);
        const diffTime = now - startDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 7) {
            trialExpired = true;
            banner.innerText = "⛔ Essai terminé. Continuez avec un paiement unique de 3,99 €.";
            banner.style.display = "block";
        } else {
            banner.innerText = `🎉 Il vous reste ${7 - diffDays} jour(s) d’essai gratuit.`;
            banner.style.display = "block";

            // Masquer le message après 3 secondes
            setTimeout(() => {
                banner.style.display = "none";
            }, 3000);
        }
    }

    // Gestion du bouton Journal
    const journalButton = document.getElementById("journal-btn");
    if (trialExpired && journalButton) {
        journalButton.style.display = "none";
    } else if (journalButton) {
        journalButton.addEventListener("click", (event) => {
            event.preventDefault();
            window.location.href = "drop.html"; // Connexion Dropbox
        });
    }

    // Gestion des autres boutons
    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();

            if (trialExpired) {
                alert("Essai terminé. Continuez avec un paiement unique de 3,99 €.");
                window.location.href = "abon.html";
                return;
            }

            event.target.style.transform = "scale(0.95)";
            setTimeout(() => {
                event.target.style.transform = "scale(1)";
                const link = event.target.getAttribute("onclick")?.split("'")[1];
                if (link) {
                    window.location.href = link;
                }
            }, 150);
        });
    });
});

