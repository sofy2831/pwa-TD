document.addEventListener("DOMContentLoaded", () => {
  const isDev = false; // Active le mode développeur : true en dev ou false non dev
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
    trialStart = now.toISOString();
  }

  const startDate = new Date(trialStart);
  const diffDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
  const daysLeft = 7 - diffDays;
  const trialExpired = diffDays >= 7;
  const effectiveTrialExpired = isDev ? false : trialExpired;

  // --- AFFICHAGE BANNIÈRE ---
  if (banner) {
    if (trialExpired) {
      banner.innerText = "⛔ Essai terminé. Continuez avec un paiement unique de 3,99 €.";
    } else {
      banner.innerText = `🎉 Il vous reste ${daysLeft} jour${daysLeft > 1 ? "s" : ""} d’essai gratuit.`;
    }
    banner.style.display = "block";
    setTimeout(() => (banner.style.display = "none"), 5000);
  }

  // --- GESTION DU BOUTON JOURNAL ---
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

  // --- AFFICHAGE DU BOUTON DE PAIEMENT SI ESSAI EXPIRÉ ---
  if (payButtonContainer && effectiveTrialExpired) {
    payButtonContainer.style.display = "block";
  }

  if (payButton) {
    payButton.addEventListener("click", () => {
      window.location.href = "abon.html";
    });
  }

  // --- SONDAGE APRÈS 5 JOURS ---
  if (diffDays >= 5 && !localStorage.getItem("surveyShown")) {
    window.open("https://forms.gle/NwCSJRtabZgWdF5Z8", "_blank");
    localStorage.setItem("surveyShown", "true");
  }

  // --- GESTION DES AUTRES BOUTONS ---
  buttons.forEach((button) => {
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
