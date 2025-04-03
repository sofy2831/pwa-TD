document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("predefinedMessage").addEventListener("change", updateSelectedMessage);
    document.getElementById("customMessage").addEventListener("input", updateSelectedMessage);
});

function addContact() {
    let contactsSelect = document.getElementById("contacts");
    let selectedContactsDiv = document.getElementById("selectedContacts");

    let selectedValue = contactsSelect.value;
    let selectedText = contactsSelect.options[contactsSelect.selectedIndex].text;

    if (selectedValue !== "") {
        if ([...selectedContactsDiv.children].some(contact => contact.dataset.value === selectedValue)) {
            return; // Contact déjà ajouté
        }

        let contactBadge = document.createElement("div");
        contactBadge.classList.add("contact-badge");
        contactBadge.dataset.value = selectedValue;
        contactBadge.innerHTML = `${selectedText} (${selectedValue}) 
            <button class="remove-btn" onclick="removeContact(this)">X</button>`;

        selectedContactsDiv.appendChild(contactBadge);
    }
    contactsSelect.value = "";
}

function removeContact(button) {
    button.parentElement.remove();
}

function getFinalMessage() {
    let predefinedMessage = document.getElementById("predefinedMessage").value;
    let customMessage = document.getElementById("customMessage").value.trim();
    return predefinedMessage === "other" ? customMessage : predefinedMessage;
}

function updateSelectedMessage() {
    let message = getFinalMessage();
    let selectedMessageDiv = document.getElementById("selectedMessage");
    
    if (message) {
        selectedMessageDiv.innerText = "Message sélectionné : " + message;
    } else {
        selectedMessageDiv.innerText = "";
    }

    document.getElementById("customMessage").style.display = 
        (document.getElementById("predefinedMessage").value === "other") ? "block" : "none";
}

function sendAlert() {
    let contacts = document.querySelectorAll(".contact-badge");
    let finalMessage = getFinalMessage();

    if (!finalMessage) {
        alert("Veuillez sélectionner ou saisir un message.");
        return;
    }

    if (contacts.length === 0) {
        alert("Veuillez ajouter au moins un contact.");
        return;
    }

    let contactNumbers = Array.from(contacts).map(contact => contact.dataset.value);

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                let locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

                let alertMessage = `🚨 Alerte envoyée à : ${contactNumbers.join(", ")}\n📩 Message : ${finalMessage}\n📍 Localisation : ${locationUrl}`;
                
                alert(alertMessage);
                console.log(alertMessage);
                
                // Simuler un envoi via un SMS ou autre API
                // sendSMS(contactNumbers, finalMessage, locationUrl);
            },
            function (error) {
                alert("Erreur de localisation : " + error.message);
            }
        );
    } else {
        alert("La géolocalisation n'est pas prise en charge par votre navigateur.");
    }
}

function sendEmergency() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                let locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                
                alert(`🚑 Appel aux services d'urgence en cours...\n📍 Localisation : ${locationUrl}`);
                console.log(`Appel d'urgence avec localisation : ${locationUrl}`);
                
                // Ici, possibilité d'intégrer un appel automatique
                // window.location.href = "tel:112"; 
            },
            function (error) {
                alert("Impossible d'obtenir la localisation : " + error.message);
            }
        );
    } else {
        alert("Votre navigateur ne supporte pas la géolocalisation.");
    }
}
