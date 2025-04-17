document.addEventListener("DOMContentLoaded", () => {
  console.log("Page d'accueil chargée.");

  const isDev = false; // ← Active le mode développeur "true" ou "false" pour l'enlever

  const trialKey = "toxDetectTrialStart";
  const banner = document.getElementById("trial-banner");
  const payButtonContainer = document.getElementById("payment-button");
  const payButton = document.getElementById("pay-now");
  const journalButton = document.getElementById("journal-btn");
  const buttons = document.querySelectorAll("button");
  const now = new Date();

  // Initialisation de la date d'essai si absente
  let trialStart = localStorage.getItem(trialKey);
  if (!trialStart) {
    localStorage.setItem(trialKey, now.toISOString());
    banner.innerText = "🎉 Bienvenue ! Vous bénéficiez d’un essai gratuit de 7 jours.";
    banner.style.display = "block";
    setTimeout(() => banner.style.display = "none", 3000);
    return;
  }

  // Vérification expiration essai
  const startDate = new Date(trialStart);
  const diffDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
  const trialExpired = diffDays >= 7;

  // Si mode dev actif, on override trialExpired
  const effectiveTrialExpired = isDev ? false : trialExpired;

  if (effectiveTrialExpired) {
    banner.innerText = "⛔ Essai terminé. Continuez avec un paiement unique de 3,99 €.";
    banner.style.display = "block";
    if (payButtonContainer) payButtonContainer.style.display = "block";
    if (journalButton) {
      journalButton.disabled = true;
      journalButton.style.backgroundColor = "#ccc";
      journalButton.style.cursor = "not-allowed";
      journalButton.title = "Essai expiré — accès restreint";
    }
  } else {
    // Accès journal actif
    if (journalButton) {
      journalButton.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "drop.html";
      });
    }
  }

  // Bouton de paiement
  if (payButton) {
    payButton.addEventListener("click", () => {
      window.location.href = "abon.html";
    });
  }

  // Gestion de tous les boutons sauf ceux déjà traités
  buttons.forEach(button => {
    if (button.id === "journal-btn" || button.id === "pay-now") return;

    button.addEventListener("click", (event) => {
      event.preventDefault();

      if (effectiveTrialExpired) {
        alert("Essai terminé. Continuez avec un paiement unique de 3,99 €.");
        window.location.href = "abon.html";
        return;
      }

      // Animation
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
