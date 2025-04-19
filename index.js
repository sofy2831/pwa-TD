document.addEventListener("DOMContentLoaded", () => {
  const isDev = false;// ← Active le mode développeur "true" ou "false" pour l'enlever
  const trialKey = "toxDetectTrialStart";
  const banner = document.getElementById("trial-banner");
  const payButtonContainer = document.getElementById("payment-button");
  const payButton = document.getElementById("pay-now");
  const journalButton = document.getElementById("journal-btn");
  const buttons = document.querySelectorAll("button");
  const now = new Date();

  let trialStart = localStorage.getItem(trialKey);

  // Si aucune date d’essai, on initialise
  if (!trialStart) {
    localStorage.setItem(trialKey, now.toISOString());
    localStorage.setItem("trialBannerShown", "true");
    trialStart = now.toISOString();
    banner.innerText = "🎉 Bienvenue ! Vous bénéficiez d’un essai gratuit de 7 jours.";
    banner.style.display = "block";
    setTimeout(() => banner.style.display = "none", 5000);
  } else {
    // Bannière déjà affichée ? Non ? Alors on la montre une fois
    const alreadyShown = localStorage.getItem("trialBannerShown");
    if (!alreadyShown) {
      banner.innerText = "🎉 Vous bénéficiez d’un essai gratuit de 7 jours.";
      banner.style.display = "block";
      setTimeout(() => banner.style.display = "none", 5000);
      localStorage.setItem("trialBannerShown", "true");
    }
  }

  const startDate = new Date(trialStart);
  const diffDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
  const trialExpired = diffDays >= 7;
  const effectiveTrialExpired = isDev ? false : trialExpired;

  // Gérer l’état du bouton Journal
  if (journalButton) {
    if (effectiveTrialExpired) {
      journalButton.disabled = true;
      journalButton.style.backgroundColor = "#ccc";
      journalButton.style.cursor = "not-allowed";
      journalButton.title = "Essai expiré — accès restreint";
    } else {
      journalButton.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "drop.html";
      });
    }
  }

  // Affichage paiement
  if (effectiveTrialExpired) {
    banner.innerText = "⛔ Essai terminé. Continuez avec un paiement unique de 3,99 €.";
    banner.style.display = "block";
    if (payButtonContainer) payButtonContainer.style.display = "block";
  }

  // Lien vers page de paiement
  if (payButton) {
    payButton.addEventListener("click", () => {
      window.location.href = "abon.html";
    });
  }

  // Sondage après 5 jours
  if (diffDays >= 5 && !localStorage.getItem("surveyShown")) {
    window.open('https://forms.gle/NwCSJRtabZgWdF5Z8', '_blank');
    localStorage.setItem("surveyShown", "true");
  }

  // Gestion des autres boutons
  buttons.forEach(button => {
    if (["journal-btn", "pay-now"].includes(button.id)) return;

    button.addEventListener("click", (event) => {
      event.preventDefault();
      if (effectiveTrialExpired) {
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

 
