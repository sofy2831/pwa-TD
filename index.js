document.addEventListener("DOMContentLoaded", () => {
    console.log("Page d'accueil chargée.");

    const trialKey = "toxDetectTrialStart";
    const now = new Date();
    const storedDate = localStorage.getItem(trialKey);
    const banner = document.getElementById("trial-banner");
    const premiumLink = document.querySelector(".premium-link");

    let trialExpired = false;

    if (!storedDate) {
        localStorage.setItem(trialKey, now.toISOString());
        banner.innerText = "🎉 Bienvenue ! Vous bénéficiez d’un essai gratuit de 7 jours.";
        banner.style.display = "block";
        setTimeout(() => banner.style.display = "none", 3000);
    } else {
        const startDate = new Date(storedDate);
        const diffTime = now - startDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 7) {
            trialExpired = true;
            banner.innerText = "⛔ Votre essai gratuit est terminé. Veuillez acheter l’application pour continuer.";
            banner.style.display = "block";

            premiumLink.textContent = "✨ Accès Illimité — 3,99€";
            premiumLink.style.display = "inline-block";

            const infoMsg = document.createElement('p');
            infoMsg.textContent = "Pour continuer à utiliser votre journal en illimité, un paiement unique de 3,99 € est nécessaire.";
            infoMsg.style.color = "#333";
            infoMsg.style.fontSize = "14px";
            infoMsg.style.marginTop = "10px";
            infoMsg.style.maxWidth = "300px";
            infoMsg.style.marginLeft = "auto";
            infoMsg.style.marginRight = "auto";
            document.querySelector('.container').after(infoMsg);
        } else {
            const remaining = 7 - diffDays;
            banner.innerText = `🎉 Il vous reste ${remaining} jour${remaining > 1 ? 's' : ''} d’essai gratuit. À la fin de la période d’essai, un paiement unique de 3,99 € vous permettra de continuer à utiliser l’application sans limites.`;
            banner.style.display = "block";
            setTimeout(() => banner.style.display = "none", 3000);
        }
    }

    // Gestion des boutons
    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            if (trialExpired) {
                alert("Votre essai est terminé. Merci d’acheter l’application pour continuer.");
                window.location.href = "abon.html";
                return;
            }

            event.target.style.transform = "scale(0.95)";
            setTimeout(() => {
                event.target.style.transform = "scale(1)";
                const link = event.target.getAttribute("onclick").split("'")[1];
                window.location.href = link;
            }, 150);
        });
    });
});

