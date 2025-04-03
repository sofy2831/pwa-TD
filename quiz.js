// quiz.js

document.addEventListener("DOMContentLoaded", () => {
    console.log("Page du quiz chargée.");

    const quizForm = document.getElementById("quizForm");
    const resultElement = document.getElementById("result");

    document.querySelector("button[type='button']").addEventListener("click", () => {
        let score = 0;
        let totalQuestions = 7;
        let answeredQuestions = 0;

        for (let i = 1; i <= totalQuestions; i++) {
            let selectedAnswer = document.querySelector(`input[name="q${i}"]:checked`);
            if (selectedAnswer) {
                answeredQuestions++;
                if (selectedAnswer.value === "yes") {
                    score++;
                }
            }
        }

        if (answeredQuestions < totalQuestions) {
            alert("Veuillez répondre à toutes les questions.");
            return;
        }

        let resultMessage = "";
        let resultClass = "";
        let icon = "";

        if (score >= 5) {
            resultMessage = "🚨 Des signes évidents de manipulation semblent affecter votre situation. N’hésitez pas à en parler autour de vous et à accepter l’aide qui pourrait vous être apportée.";
            resultClass = "eleve";
        } else if (score >= 3) {
            resultMessage = "⚠️ Des signes de manipulation modérée sont présents. Il est essentiel de demeurer vigilant et d'agir vite pour éviter que la situation ne s’aggrave.";
            resultClass = "modere";
        } else {
            resultMessage = "✅ Votre situation semble saine et équilibrée, mais continuez à être attentif aux signaux.";
            resultClass = "faible";
        }

        resultElement.innerHTML = resultMessage;
        resultElement.className = resultClass;
    });
});
