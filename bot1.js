// Globális változók
let isVisuallyImpaired = false;
let recognition;
let recognitionActive = false;

// Az oldal betöltése után indul
window.onload = function () {
    speak("Üdvözöljük a weboldalon! Amennyiben Ön látássérült, mondja be hangosan az 'Igen' szót.");
    startSpeechRecognition();
};

// Felolvasás funkció
function speak(text) {
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hu-HU';
    speechSynthesis.speak(utterance);
}

// Beszédfelismerés indítása
function startSpeechRecognition() {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
        speak("Sajnálom, a böngésző nem támogatja a beszédfelismerést.");
        return;
    }

    if (!recognition) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'hu-HU';
        recognition.interimResults = false;
        recognition.continuous = false;

        recognition.onresult = function (event) {
            const command = event.results[0][0].transcript.toLowerCase();
            handleSpeechCommand(command);
        };

        recognition.onerror = function (event) {
            console.log("Hiba történt a beszédfelismerés során:", event.error);
        };
    }

    recognition.start();
}

// A beszédfelismerés által kapott parancs feldolgozása
function handleSpeechCommand(command) {
    if (command.includes('igen')) {
        isVisuallyImpaired = true;
        speak("Ön látássérült. Az oldalunkon segítünk Önnek a napi feladatok elvégzésében, mint például a bevásárlás.");
        setTimeout(() => {
            speak("Kérem válasszon az alábbi menüpontok közül: Számla kifizetés, Orvosi időpont foglalás, Bevásárlás.");
            listenForMenuSelection();
        }, 3000);
    }
}

// Beszédfelismerés a menüpont választásához
function listenForMenuSelection() {
    setTimeout(() => {
        recognition.start();
        recognition.onresult = function (event) {
            const choice = event.results[0][0].transcript.toLowerCase();
            processMenuChoice(choice);
        };
    }, 15000);
}

// A menüpont választásának feldolgozása
function processMenuChoice(choice) {
    if (choice.includes('számla')) {
        speak("Ön a Számla kifizetése menüpontot választotta.");
        window.location.href = "szamlafizetes.html";
    } else if (choice.includes('orvosi')) {
        speak("Ön az Orvosi időpont foglalás menüpontot választotta.");
        window.location.href = "orvosi_idopont.html";
    } else if (choice.includes('bevásárlás')) {
        speak("Ön a Bevásárlás menüpontot választotta.");
        setTimeout(() => {
            speak("Hol szeretne vásárolni? Mondja be az üzlet nevét: Tesco, Auchan, Spar, Lidl, Aldi.");
            listenForStoreSelection();
        }, 3000);
    } else {
        speak("Ezt nem értem. Kérem ismételje meg a választását.");
        listenForMenuSelection();
    }
}

// Beszédfelismerés az üzletek választásához
function listenForStoreSelection() {
    recognition.start();
    recognition.onresult = function (event) {
        const storeChoice = event.results[0][0].transcript.toLowerCase();
        processStoreChoice(storeChoice);
    };
}

// Üzlet választásának feldolgozása
function processStoreChoice(storeChoice) {
    if (storeChoice.includes('tesco')) {
        speak("Ön a Tesco-t választotta.");
        window.location.href = "tesco.html";
    } else if (storeChoice.includes('auchan')) {
        speak("Ön az Auchan-t választotta.");
        window.location.href = "auchan.html";
    } else if (storeChoice.includes('spar')) {
        speak("Ön a Spar-t választotta.");
        window.location.href = "spar.html";
    } else if (storeChoice.includes('lidl')) {
        speak("Ön a Lidl-t választotta.");
        window.location.href = "lidl.html";
    } else if (storeChoice.includes('aldi')) {
        speak("Ön az Aldi-t választotta.");
        window.location.href = "aldi.html";
    } else {
        speak("Ezt az üzletet nem értem. Kérem ismételje meg a választását.");
        listenForStoreSelection();
    }
}
