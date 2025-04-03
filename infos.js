document.addEventListener("DOMContentLoaded", () => {
    console.log("Page Infos chargée.");

    const conseils = [
        "Écoutez votre intuition : si une situation vous met mal à l’aise, il y a une raison.",
        "Évitez de répondre aux provocations d’une personne toxique, cela peut empirer la situation.",
        "Préparez un plan de sortie si vous vous sentez en danger.",
        "Notez les comportements inquiétants pour prendre conscience du schéma toxique.",
        "Ne restez pas isolé(e), parlez à quelqu’un de confiance.",
        "Les manipulateurs utilisent souvent la culpabilisation, ne tombez pas dans ce piège.",
        "Vous avez le droit de dire NON, sans vous justifier.",
        "Un comportement toxique peut être progressif, restez attentif(ve) aux petits signaux.",
        "Ne sous-estimez pas l'impact psychologique d’une relation toxique.",
        "Les relations saines sont basées sur le respect et l’écoute mutuelle."
    ];

    const conseilElement = document.getElementById("conseil");
    const boutonAfficher = document.getElementById("btn-conseil");

    boutonAfficher.addEventListener("click", () => {
        const conseilAleatoire = conseils[Math.floor(Math.random() * conseils.length)];
        conseilElement.textContent = conseilAleatoire;
    });
});
