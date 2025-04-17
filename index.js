document.addEventListener("DOMContentLoaded", () => {
  console.log("Page d'accueil chargée.");

  const isDev = false; // ← Active le mode développeur "true" ou "false" pour l'enlever

  if (isDev) {
    const resetButton = document.createElement("button");
    resetButton.textContent = "🔄 Réinitialiser l’essai";
    resetButton.style.position = "fixed";
    resetButton.style.top = "10px";
    resetButton.style.left = "10px";
    resetButton.style.zIndex = "1000";
    resetButton.style.padding = "8px 12px";
    resetButton.style.backgroundColor = "#4caf50";
    resetButton.style.color = "#fff";
    resetButton.style.border = "none";
    resetButton.style.borderRadius = "6px";
    resetButton.style.cursor = "pointer";
    resetButton.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
    
    resetButton.addEventListener("click", () => {
      localStorage.setItem("toxDetectTrialStart", new Date().toISOString());
      alert("Date d’essai réinitialisée ! Recharge la page 🎉");
    });

    document.body.appendChild(resetButton);
  }

  const trialKey = "toxDetectTrialStart";
  const banner = document.getElementById("trial-banner");
  const payButtonContainer = document.getElementById("payment-button");
  const payButton = document.getElementById("pay-now");
  const journalButton = document.getElementById("journal-btn");
  const buttons = document.querySelectorAll("button");
  const now = new Date();

  // Récupérer la date d'essai
  let trialStart = localStorage.getItem(trialKey);

  // Si la date n'existe pas, on initialise l'essai
  if (!trialStart) {
    localStorage.setItem(trialKey, now.toISOString());
    trialStart = now.toISOString(); // On met la date actuelle
    banner.innerText = "🎉 Bienvenue ! Vous bénéficiez d’un essai gratuit de 7 jours.";
    banner.style.display = "block";
    setTimeout(() => banner.style.display = "none", 3000);
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
