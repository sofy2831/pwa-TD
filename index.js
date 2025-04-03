// index.js

document.addEventListener("DOMContentLoaded", () => {
    console.log("Page d'accueil chargée.");

    // Sélection des boutons
    const buttons = document.querySelectorAll("button");

    // Ajout d'un effet de clic avec animation
    buttons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.target.style.transform = "scale(0.9)";
            setTimeout(() => {
                event.target.style.transform = "scale(1)";
                window.location.href = event.target.getAttribute("onclick").split("'")[1];
            }, 150);
        });
    });
});
