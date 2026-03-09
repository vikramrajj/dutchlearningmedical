import { medicalVocab } from './data.js';
import { generalVocab } from './generalData.js';


class FlashcardGame {
    constructor() {
        this.vocab = medicalVocab;
        this.domain = 'medical'; // 'medical' | 'general'
        this.filteredVocab = [...this.vocab].sort(() => Math.random() - 0.5);

        this.currentIndex = 0;
        this.mode = 'flashcard'; // 'flashcard' | 'spelling' | 'speaking' | 'quiz' | 'vulin' | 'writing'

        this.writingPrompts = [
            {
                title: "Afspraak verzetten",
                prompt: "U volgt een opleiding. U hebt morgen een afspraak met Amber, een andere student. U kunt niet en wilt een andere afspraak maken. U schrijft daarom een e-mail aan Amber.",
                bullets: [
                    "Schrijf dat u de afspraak wilt verzetten.",
                    "Schrijf waarom u dat wilt. Bedenk zelf waarom.",
                    "Stel een nieuwe datum voor."
                ],
                example: "Beste Amber,\n\nIk schrijf je omdat ik onze afspraak van morgen wil verzetten.\nIk kan helaas niet komen, want ik ben ziek. Ik heb last van hoofdpijn en koorts.\nZullen we volgende week donderdag afspreken? Ik kan om 13.00 uur. Laat me even weten of dat voor jou ook goed is.\n\nGroetjes,\n[Jouw naam]"
            },
            {
                title: "Feest delen",
                prompt: "U krijgt elke week een wijkkrant. Iedereen uit de buurt mag iets voor deze krant schrijven. U schrijft over een feest dat u elk jaar viert. Schrijf minimaal drie zinnen op.",
                bullets: [
                    "Waarom viert u het feest?",
                    "Wie komen er op het feest?",
                    "Wat doet u op het feest?"
                ],
                example: "Ik vier elk jaar op 5 december Sinterklaas. Ik vier dit feest, omdat het heel gezellig is.\nMijn hele familie en mijn vrienden komen op het feest.\nWe eten pepernoten, we zingen liedjes en we geven elkaar cadeautjes."
            },
            {
                title: "Dienst ruilen",
                prompt: "U moet zondag werken maar u wilt graag vrij. U schrijft daarom een e-mail aan uw collega Farida. U vraagt of zij met u wil ruilen.",
                bullets: [
                    "Schrijf op waarom u mailt.",
                    "Schrijf waarom u wilt ruilen. Bedenk het zelf.",
                    "Schrijf op welke dag u wel kunt werken."
                ],
                example: "Beste Farida,\n\nIk stuur je deze e-mail, omdat ik aanstaande zondag moet werken.\nMaar ik wil graag vrij, want mijn dochter is jarig en we geven een feest.\nZou jij mijn dienst willen overnemen of met mij willen ruilen?\nIk kan volgende week dinsdag of donderdag werken. Ik hoor graag van je.\n\nGroeten,\n[Jouw naam]"
            },
            {
                title: "Inschrijven sportschool",
                prompt: "U wilt graag sporten. U gaat naar een sportschool in uw buurt. U moet een formulier invullen. Sommige gegevens moet u zelf bedenken.",
                bullets: [
                    "Kies een groepsles (Fitness, Yoga of Hardlopen) en vertel hoe vaak je wilt komen.",
                    "Waarom kiest u voor deze groepsles?",
                    "Hoe is uw gezondheid?"
                ],
                example: "Ik wil graag inschrijven voor de groepsles Yoga. Ik wil graag twee keer per week komen.\n\nIk kies voor deze groepsles omdat ik wil ontspannen en flexibeler wil worden. Mijn werk is erg druk en yoga helpt mij om rustig te worden.\n\nMijn gezondheid is over het algemeen heel goed. Ik ben fit en heb geen medische problemen."
            },
            {
                title: "Mooiste kleren",
                prompt: "U krijgt elke week een wijkkrant. Iedereen uit de buurt mag iets voor deze krant schrijven. U schrijft over de kleren die u het liefst draagt. Schrijf minimaal drie zinnen op.",
                bullets: [
                    "Wat draagt u het liefst?",
                    "Hoe zien de kleren eruit?",
                    "Wanneer draagt u deze kleren?"
                ],
                example: "Ik draag het liefst mijn spijkerbroek en een warme, blauwe trui.\nMijn kleren zien er simpel maar heel comfortabel uit.\nIk draag deze kleren altijd in het weekend of als ik thuis ben, omdat ik dan lekker wil ontspannen."
            },
            {
                title: "Boek lenen",
                prompt: "Voor uw opleiding Techniek heeft u snel het boek 'Natuurkunde 1' nodig. In de bibliotheek is het boek niet. Een medestudente heeft het boek. U wilt het boek van haar lenen. U schrijft haar een e-mail.",
                bullets: [
                    "U schrijft welk boek u wilt lenen.",
                    "U schrijft waarom u het boek van haar wilt lenen.",
                    "U schrijft wanneer ze het boek terugkrijgt. Bedenk zelf wanneer."
                ],
                example: "Beste Jasmijn, \n\nIk zou heel graag het boek 'Natuurkunde 1' van jou willen lenen.\nIn de bibliotheek kan ik het niet vinden, en ik heb het morgen nodig voor de opdracht.\nAls dat mag, breng ik het volgende week maandag meteen weer terug naar school.\n\nBedankt alvast!\n\nGroetjes,\n[Jouw naam]"
            },
            {
                title: "Schadeformulier (Ingebroken)",
                prompt: "Er is ingebroken in uw huis. Dieven hebben spullen meegenomen en er is schade. U vult een schadeformulier in van uw verzekering.",
                bullets: [
                    "Vul uw persoonsgegevens in (bedenk deze zelf).",
                    "Schrijf op wanneer er is ingebroken.",
                    "Schrijf drie dingen op die zijn gebeurd (bijv. wat is gestolen of kapot)."
                ],
                example: "Persoonsgegevens: [Jouw naam, Adres, Telefoon]\nDatum van de schade: [Bedenk een datum, bijv: 12 maart 2026]\n\nOmschrijving gestolen spullen en schade:\n- Mijn laptop is gestolen van het bureau.\n- De gouden ketting van mijn vrouw is ook gestolen uit de slaapkamer.\n- Het raam in de woonkamer is helemaal kapot, daar zijn de dieven naar binnen gekomen."
            },
            {
                title: "Vrije dag aanvragen",
                prompt: "U wilt volgende week een dag vrij vragen. U schrijft een e-mail aan uw chef, meneer Jansen.",
                bullets: [
                    "U schrijft wanneer u vrij wilt hebben. Bedenk zelf een dag en datum.",
                    "U schrijft waarom u vrij wilt hebben. Bedenk zelf waarom."
                ],
                example: "Beste meneer Jansen,\n\nIk schrijf deze e-mail, omdat ik graag een vrije dag wil aanvragen.\nZou ik volgende week vrijdag 20 maart vrij mogen zijn?\nMijn verzoek is omdat mijn zus gaat trouwen, en ik moet de hele dag helpen met de voorbereidingen.\nIk hoor graag of dit mogelijk is.\n\nMet vriendelijke groet,\n[Jouw naam]"
            },
            {
                title: "Ziek melden (Werk)",
                prompt: "U bent ziek. U kunt vandaag niet naar uw werk komen. U schrijft een e-mail aan uw manager, mevrouw De Jong.",
                bullets: [
                    "Schrijf dat u ziek bent en niet kunt werken.",
                    "Schrijf welke klachten u heeft.",
                    "Schrijf wanneer u denkt weer te komen werken."
                ],
                example: "Beste mevrouw De Jong,\n\nIk stuur een bericht, omdat ik helaas ziek ben.\nIk heb koorts en heel veel last van mijn keel, dus ik kan vandaag niet komen werken.\nIk hoop me snel beter te voelen en ik blijf de komende dagen in bed.\nIk denk dat ik me maandag weer kom melden.\n\nMet vriendelijke groet,\n[Jouw naam]"
            },
            {
                title: "Een nieuw huis",
                prompt: "U bent onlangs in deze straat komen wonen. U schrijft een stukje in de wijkkrant om uzelf voor te stellen aan de nieuwe buren.",
                bullets: [
                    "Wie bent u en met wie woont u?",
                    "Waar woonde u hiervoor?",
                    "Waarom bent u hier komen wonen?"
                ],
                example: "Hallo allemaal, mijn naam is [Jouw naam] en ik woon vanaf deze week in jullie straat. Ik woon hier samen met mijn man en onze twee kinderen.\nHiervoor woonden we in Amsterdam, maar dat vonden we te druk.\nWe zijn hier komen wonen omdat dit een leuke en rustige buurt is voor de kinderen. We hebben veel zin om jullie te leren kennen!"
            },
            {
                title: "Uw favoriete winkel",
                prompt: "U schrijft een stukje voor een tijdschrift. Het gaat over boodschappen doen.",
                bullets: [
                    "Naar welke supermarkt gaat u het liefst?",
                    "Waarom vindt u deze winkel leuk?",
                    "Welke dingen koopt u daar altijd?"
                ],
                example: "Ik ga het liefst naar de grote markt in het centrum. De supermarkt vind ik soms saai.\nIk vind dit een leuke plek omdat de groenten erg vers en goedkoop zijn. Ook staan er veel vriendelijke mensen.\nIk koop daar altijd verse appels, brood en een groot stuk kaas."
            },
            {
                title: "Kapot product",
                prompt: "U heeft vorige week een nieuwe koffiemachine gekocht. Maar het apparaat is na twee dagen kapot gegaan. U schrijft een e-mail naar de winkel 'Elektronica Nu'.",
                bullets: [
                    "Schrijf op wat u heeft gekocht en wanneer.",
                    "Schrijf wat er precies kapot is.",
                    "Schrijf wat u wilt dat de winkel doet (bijv. repareren of een nieuwe geven)."
                ],
                example: "Geachte heer/mevrouw,\n\nVorige week dinsdag heb ik in uw winkel een koffiemachine gekocht.\nHelaas is het apparaat nu al kapot: de machine wordt niet meer warm en het water lekt op de tafel.\nIk wil u vragen of u de koffiemachine kunt repareren of dat ik een nieuw apparaat mag krijgen.\nIk hoor graag van u.\n\nBeste groeten,\n[Jouw naam]"
            },
            {
                title: "Vriend uitnodigen (Film)",
                prompt: "U heeft twee kaartjes gekocht voor de bioscoop. U wilt uw vriend Ahmed uitnodigen om mee te gaan. U schrijft hem een e-mail.",
                bullets: [
                    "Welke film willen jullie bekijken en waar gaat de film over?",
                    "Wanneer gaan jullie (dag en tijd)?",
                    "Waar spreken jullie af voordat de film begint?"
                ],
                example: "Hoi Ahmed!\n\nIk heb twee kaartjes gekocht voor de nieuwe actiefilm, het gaat over een spannende bankoverval.\nZullen we aanstaande zaterdagavond samen gaan? De film begint om 20:00 uur.\nLaten we voor het station afspreken om kwart voor acht, dan fietsen we samen naar de bioscoop. Heb je zin?\n\nGroetjes,\n[Jouw naam]"
            },
            {
                title: "Restaurant reserveren",
                prompt: "U wilt een tafel in een restaurant reserveren, omdat u uw verjaardag wilt vieren met vrienden. U schrijft een e-mail naar restaurant 'De Gouden Hond'.",
                bullets: [
                    "Voor wanneer wilt u reserveren en hoe laat?",
                    "Voor hoeveel personen is de reservering?",
                    "Noteer een speciale wens (bijvoorbeeld: iemand is allergisch of u heeft een kinderstoel nodig)."
                ],
                example: "Beste medewerker,\n\nIk wil graag een tafel reserveren om mijn verjaardag te vieren.\nIs er een tafel beschikbaar voor komende zaterdag om 18:30 uur?\nDe reservering is voor vier personen.\nDaarnaast heb ik een speciale vraag: eén persoon is allergisch voor vis, kunt u hier rekening mee houden in de keuken?\n\nAlvast bedankt voor uw reactie,\n\n[Jouw naam]"
            },
            {
                title: "E-mail aan docent",
                prompt: "U doet een computercursus. Morgen moet u een toets maken, maar u kunt niet naar school komen. U schrijft een e-mail aan uw docent.",
                bullets: [
                    "Schrijf waarom u de e-mail stuurt.",
                    "Schrijf waarom u niet kunt komen. Bedenk het zelf.",
                    "Bied uw excuses aan.",
                    "Vraag wanneer u de toets kunt maken."
                ],
                example: "Beste docent,\n\nIk stuur u deze e-mail omdat ik morgen niet naar de les kan komen voor de toets.\nIk ben helaas erg ziek geworden en moet thuis in bed blijven.\nSorry voor het ongemak.\nKunt u mij alstublieft vertellen wanneer ik de toets kan inhalen?\n\nMet vriendelijke groet,\n[Jouw naam]"
            },
            {
                title: "Problemen in de straat",
                prompt: "In de straat waar u woont zijn twee problemen (bijvoorbeeld: een kapotte lantaarnpaal en veel afval op straat). U meldt de problemen bij de gemeente. Vul het meldingsformulier in.",
                bullets: [
                    "Vul uw persoonsgegevens in.",
                    "In welke straat zijn er problemen?",
                    "Wat zijn de problemen? Schrijf het op."
                ],
                example: "Persoonsgegevens: [Jouw naam, Adres, Postcode, Woonplaats, Telefoon, E-mail]\n\nIn welke straat zijn er problemen?\nDe problemen zijn in de Molenstraat.\n\nWat zijn de problemen?\nEr zijn twee grote problemen. Ten eerste is de lantaarnpaal voor nummer 12 kapot, dus het is 's nachts erg donker. Ten tweede ligt er heel veel afval en vuilnis op de stoep."
            },
            {
                title: "Weekend",
                prompt: "U krijgt elke week een wijkkrant. Iedereen uit de buurt mag iets voor deze krant schrijven. U schrijft over uw weekend. Schrijf minimaal drie zinnen op.",
                bullets: [
                    "Wat doet u graag in het weekend?",
                    "Met wie doet u dat?",
                    "Waar doet u dat?"
                ],
                example: "In het weekend ga ik heel graag wandelen en fietsen in de natuur.\nMeestal doe ik dat samen met mijn partner en onze hond.\nWe gaan dan vaak naar het bos hier in de buurt, of we fietsen naar het strand."
            },
            {
                title: "Bericht collega",
                prompt: "U werkt in een kledingzaak. Straks komt uw collega Fariha. Zij moet een paar dingen doen (zoals de vloer vegen, nieuwe kleren ophangen en de bloemen water geven). Schrijf een briefje voor Fariha.",
                bullets: [
                    "Verwelkom haar.",
                    "Vertel wat zij moet doen. Schrijf drie dingen op.",
                    "Sluit het briefje af met uw naam."
                ],
                example: "Hallo Fariha,\n\nIk ga zo naar huis, maar er zijn nog een paar dingen die jij moet doen vanavond.\nZou jij de vloer willen vegen en de nieuwe kleren netjes in het rek willen hangen? Vergeet ook niet om de planten een beetje water te geven.\nAlvast bedankt voor je hulp!\n\nGroeten,\n[Jouw naam]"
            }
        ].sort(() => Math.random() - 0.5);
        this.currentWritingIndex = 0;

        // Stats
        this.stats = { correct: 0, wrong: 0 };
        this.speakingStats = { correct: 0, wrong: 0 };
        this.quizStats = { correct: 0, wrong: 0 };
        this.spellingChecked = false;
        this.speakingChecked = false;
        this.quizChecked = false;
        this.vulinChecked = false;

        // Speech Recog for speaking test
        this.speakingRecognition = null;
        this.isSpeakingListening = false;

        // DOM — common
        this.levelSelect = document.getElementById('levelSelect');
        this.currentLevelDisplay = document.getElementById('currentLevelDisplay');
        this.progressFill = document.getElementById('progressFill');
        this.progressCount = document.getElementById('progressCount');
        this.domainMedical = document.getElementById('domainMedical');
        this.domainGeneral = document.getElementById('domainGeneral');
        this.appLogo = document.getElementById('appLogo');


        // DOM — flashcard mode
        this.flashcardSection = document.getElementById('flashcardSection');
        this.flashcard = document.getElementById('flashcard');
        this.dutchWord = document.getElementById('dutchWord');
        this.englishWord = document.getElementById('englishWord');
        this.cardCategory = document.getElementById('cardCategory');
        this.englishExplanation = document.getElementById('englishExplanation');
        this.exampleSentence = document.getElementById('exampleSentence');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.speakBtnFront = document.getElementById('speakBtnFront');

        // DOM — spelling mode
        this.spellingSection = document.getElementById('spellingSection');
        this.spellingEnglish = document.getElementById('spellingEnglish');
        this.spellingCategory = document.getElementById('spellingCategory');
        this.spellingInput = document.getElementById('spellingInput');
        this.checkSpellingBtn = document.getElementById('checkSpellingBtn');
        this.spellingFeedback = document.getElementById('spellingFeedback');
        this.feedbackIcon = document.getElementById('feedbackIcon');
        this.feedbackMessage = document.getElementById('feedbackMessage');
        this.correctAnswer = document.getElementById('correctAnswer');
        this.hintLetters = document.getElementById('hintLetters');
        this.spellingHints = document.getElementById('spellingHints');
        this.hintToggleBtn = document.getElementById('hintToggleBtn');
        this.hintShown = false;
        this.spellingPrevBtn = document.getElementById('spellingPrevBtn');
        this.spellingNextBtn = document.getElementById('spellingNextBtn');
        this.spellingShuffleBtn = document.getElementById('spellingShuffleBtn');
        this.speakBtnSpelling = document.getElementById('speakBtnSpelling');
        this.statCorrect = document.getElementById('statCorrect');
        this.statWrong = document.getElementById('statWrong');
        this.statAccuracy = document.getElementById('statAccuracy');
        this.challengeBadge = document.getElementById('challengeBadge');

        // DOM — speaking mode
        this.modeSpeaking = document.getElementById('modeSpeaking');
        this.speakingSection = document.getElementById('speakingSection');
        this.speakingEnglish = document.getElementById('speakingEnglish');
        this.speakingCategory = document.getElementById('speakingCategory');
        this.speakingExplanation = document.getElementById('speakingExplanation');
        this.speakingMicBtn = document.getElementById('speakingMicBtn');
        this.speakingStatusText = document.getElementById('speakingStatusText');
        this.speakingLiveTranscript = document.getElementById('speakingLiveTranscript');
        this.speakingFeedback = document.getElementById('speakingFeedback');
        this.speakingFeedbackIcon = document.getElementById('speakingFeedbackIcon');
        this.speakingFeedbackMessage = document.getElementById('speakingFeedbackMessage');
        this.speakingCorrectAnswer = document.getElementById('speakingCorrectAnswer');
        this.speakingPrevBtn = document.getElementById('speakingPrevBtn');
        this.speakingNextBtn = document.getElementById('speakingNextBtn');
        this.speakingStatCorrect = document.getElementById('speakingStatCorrect');
        this.speakingStatWrong = document.getElementById('speakingStatWrong');
        this.speakBtnSpeakingHint = document.getElementById('speakBtnSpeakingHint');
        this.playbackDutchVoice = document.getElementById('playbackDutchVoice');
        this.retrySpeakingBtn = document.getElementById('retrySpeakingBtn');

        // DOM — quiz mode
        this.modeQuiz = document.getElementById('modeQuiz');
        this.quizSection = document.getElementById('quizSection');
        this.quizCategory = document.getElementById('quizCategory');
        this.quizSentence = document.getElementById('quizSentence');
        this.quizOptionsGrid = document.getElementById('quizOptionsGrid');
        this.quizFeedback = document.getElementById('quizFeedback');
        this.quizFeedbackIcon = document.getElementById('quizFeedbackIcon');
        this.quizFeedbackMessage = document.getElementById('quizFeedbackMessage');
        this.playbackQuizVoice = document.getElementById('playbackQuizVoice');
        this.speakBtnQuizHint = document.getElementById('speakBtnQuizHint');
        this.quizStatCorrect = document.getElementById('quizStatCorrect');
        this.quizStatWrong = document.getElementById('quizStatWrong');
        this.quizStatAccuracy = document.getElementById('quizStatAccuracy');
        this.quizPrevBtn = document.getElementById('quizPrevBtn');
        this.quizNextBtn = document.getElementById('quizNextBtn');
        this.quizShuffleBtn = document.getElementById('quizShuffleBtn');

        // DOM — vul in mode
        this.modeVulIn = document.getElementById('modeVulIn');
        this.vulinSection = document.getElementById('vulinSection');
        this.vulinCategory = document.getElementById('vulinCategory');
        this.vulinSentence = document.getElementById('vulinSentence');
        this.vulinOptionsGrid = document.getElementById('vulinOptionsGrid');
        this.vulinFeedback = document.getElementById('vulinFeedback');
        this.vulinFeedbackIcon = document.getElementById('vulinFeedbackIcon');
        this.vulinFeedbackMessage = document.getElementById('vulinFeedbackMessage');
        this.vulinCorrectAnswer = document.getElementById('vulinCorrectAnswer');
        this.vulinHintBtn = document.getElementById('vulinHintBtn');
        this.vulinHintText = document.getElementById('vulinHintText');
        this.vulinStatCorrect = document.getElementById('vulinStatCorrect');
        this.vulinStatWrong = document.getElementById('vulinStatWrong');
        this.vulinStatAccuracy = document.getElementById('vulinStatAccuracy');
        this.vulinPrevBtn = document.getElementById('vulinPrevBtn');
        this.vulinNextBtn = document.getElementById('vulinNextBtn');
        this.vulinShuffleBtn = document.getElementById('vulinShuffleBtn');
        this.speakBtnVulinSentence = document.getElementById('speakBtnVulinSentence');
        this.vulinStats = { correct: 0, wrong: 0 };

        // DOM — writing mode
        this.modeWriting = document.getElementById('modeWriting');
        this.writingSection = document.getElementById('writingSection');
        this.writingTitle = document.getElementById('writingTitle');
        this.writingPrompt = document.getElementById('writingPrompt');
        this.writingBullets = document.getElementById('writingBullets');
        this.writingTextarea = document.getElementById('writingTextarea');
        this.writingShowExampleBtn = document.getElementById('writingShowExampleBtn');
        this.writingExampleBox = document.getElementById('writingExampleBox');
        this.writingExampleText = document.getElementById('writingExampleText');
        this.writingPrevBtn = document.getElementById('writingPrevBtn');
        this.writingNextBtn = document.getElementById('writingNextBtn');

        // DOM — mode toggle
        this.modeFlashcard = document.getElementById('modeFlashcard');
        this.modeSpelling = document.getElementById('modeSpelling');


        this.init();
    }

    init() {
        this.initSpeakingRecognition();

        // ---- Domain Toggle (Top Bar) ----
        this.domainMedical.addEventListener('click', () => this.switchDomain('medical'));
        this.domainGeneral.addEventListener('click', () => this.switchDomain('general'));

        // ---- Mode toggle ----

        this.modeFlashcard.addEventListener('click', () => this.switchMode('flashcard'));
        this.modeSpelling.addEventListener('click', () => this.switchMode('spelling'));
        this.modeSpeaking.addEventListener('click', () => this.switchMode('speaking'));
        this.modeQuiz.addEventListener('click', () => this.switchMode('quiz'));
        this.modeVulIn.addEventListener('click', () => this.switchMode('vulin'));
        this.modeWriting.addEventListener('click', () => this.switchMode('writing'));

        // ---- Level filter ----
        this.levelSelect.addEventListener('change', (e) => this.filterByLevel(e.target.value));

        // ---- Flashcard mode events ----
        this.flashcard.addEventListener('click', () => this.flipCard());
        this.nextBtn.addEventListener('click', (e) => { e.stopPropagation(); this.nextCard(); });
        this.prevBtn.addEventListener('click', (e) => { e.stopPropagation(); this.prevCard(); });
        this.shuffleBtn.addEventListener('click', (e) => { e.stopPropagation(); this.shuffleCards(); });
        this.speakBtnFront.addEventListener('click', (e) => { e.stopPropagation(); this.speakCurrentWord(); });

        // ---- Spelling mode events ----
        this.checkSpellingBtn.addEventListener('click', () => this.checkSpelling());
        this.spellingInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.checkSpelling();
        });
        this.hintToggleBtn.addEventListener('click', () => this.toggleHint());
        this.spellingNextBtn.addEventListener('click', () => this.nextCard());
        this.spellingPrevBtn.addEventListener('click', () => this.prevCard());
        this.spellingShuffleBtn.addEventListener('click', () => this.shuffleCards());
        this.speakBtnSpelling.addEventListener('click', () => this.speakCurrentWord());

        // ---- Speaking mode events ----
        this.speakingNextBtn.addEventListener('click', () => this.nextCard());
        this.speakingPrevBtn.addEventListener('click', () => this.prevCard());
        this.speakingMicBtn.addEventListener('click', () => this.toggleSpeakingTest());
        this.speakBtnSpeakingHint.addEventListener('click', () => this.speakCurrentWordEnglish());
        this.playbackDutchVoice.addEventListener('click', () => this.speakCurrentWord());
        this.retrySpeakingBtn.addEventListener('click', () => this.retrySpeakingTest());

        // ---- Quiz mode events ----
        this.quizNextBtn.addEventListener('click', () => this.nextCard());
        this.quizPrevBtn.addEventListener('click', () => this.prevCard());
        this.quizShuffleBtn.addEventListener('click', () => this.shuffleCards());
        this.speakBtnQuizHint.addEventListener('click', () => this.speakCurrentWordEnglish());
        this.playbackQuizVoice.addEventListener('click', () => this.speakCurrentWord());

        // ---- Vul In mode events ----
        this.vulinNextBtn.addEventListener('click', () => this.nextCard());
        this.vulinPrevBtn.addEventListener('click', () => this.prevCard());
        this.vulinShuffleBtn.addEventListener('click', () => this.shuffleCards());
        this.speakBtnVulinSentence.addEventListener('click', () => this.speakVulinSentence());
        this.vulinHintBtn.addEventListener('click', () => {
            const isHidden = this.vulinHintText.classList.toggle('hidden');
            this.vulinHintBtn.textContent = isHidden ? '💡 Show English hint' : '🙈 Hide hint';
        });

        // ---- Writing mode events ----
        this.writingNextBtn.addEventListener('click', () => {
            this.currentWritingIndex = (this.currentWritingIndex + 1) % this.writingPrompts.length;
            this.updateCard();
        });
        this.writingPrevBtn.addEventListener('click', () => {
            this.currentWritingIndex = (this.currentWritingIndex > 0) ? this.currentWritingIndex - 1 : this.writingPrompts.length - 1;
            this.updateCard();
        });
        this.writingShowExampleBtn.addEventListener('click', () => {
            const isHidden = this.writingExampleBox.classList.toggle('hidden');
            this.writingShowExampleBtn.textContent = isHidden ? 'Show Example Answer' : 'Hide Example Answer';
        });

        // ---- Keyboard shortcuts ----
        document.addEventListener('keydown', (e) => {
            if (this.mode === 'flashcard') {
                if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
                    e.preventDefault();
                    this.flipCard();
                } else if (e.code === 'ArrowRight') {
                    this.nextCard();
                } else if (e.code === 'ArrowLeft') {
                    this.prevCard();
                } else if (e.code === 'KeyP') {
                    this.speakCurrentWord();
                }
            }
        });

        this.updateCard();
    }

    // ============================================================
    //  MODE SWITCHING
    // ============================================================
    switchMode(newMode) {
        this.mode = newMode;

        this.modeFlashcard.classList.toggle('active', newMode === 'flashcard');
        this.modeSpelling.classList.toggle('active', newMode === 'spelling');
        this.modeSpeaking.classList.toggle('active', newMode === 'speaking');
        this.modeQuiz.classList.toggle('active', newMode === 'quiz');
        this.modeVulIn.classList.toggle('active', newMode === 'vulin');
        this.modeWriting.classList.toggle('active', newMode === 'writing');

        this.flashcardSection.classList.toggle('hidden', newMode !== 'flashcard');
        this.spellingSection.classList.toggle('hidden', newMode !== 'spelling');
        this.speakingSection.classList.toggle('hidden', newMode !== 'speaking');
        this.quizSection.classList.toggle('hidden', newMode !== 'quiz');
        this.vulinSection.classList.toggle('hidden', newMode !== 'vulin');
        this.writingSection.classList.toggle('hidden', newMode !== 'writing');

        // Reset state for new mode
        this.currentIndex = 0;
        this.isFlipped = false;
        this.flashcard.classList.remove('is-flipped');
        this.spellingChecked = false;
        this.speakingChecked = false;
        this.quizChecked = false;
        this.vulinChecked = false;
        this.hintShown = false;
        if (this.speakingRecognition && this.isSpeakingListening) {
            this.stopSpeakingTest();
        }
        this.updateCard();
    }

    // ============================================================
    //  DOMAIN SWITCHING
    // ============================================================
    switchDomain(newDomain) {
        if (this.domain === newDomain) return;
        this.domain = newDomain;

        // Switch vocab and update UI
        this.vocab = (newDomain === 'medical') ? medicalVocab : generalVocab;
        this.appLogo.innerHTML = (newDomain === 'medical')
            ? 'Medisch<span>Nederlands</span>'
            : 'Algemeen<span>Nederlands</span>';

        this.domainMedical.classList.toggle('active', newDomain === 'medical');
        this.domainGeneral.classList.toggle('active', newDomain === 'general');

        // Fully reset for the new domain
        this.filterByLevel(this.levelSelect.value);
    }

    // ============================================================
    //  FILTERING / SHUFFLING
    // ============================================================
    filterByLevel(level) {
        if (level === 'all') {
            this.filteredVocab = [...this.vocab].sort(() => Math.random() - 0.5);
        } else {
            this.filteredVocab = this.vocab.filter(item => item.level === level).sort(() => Math.random() - 0.5);
        }
        this.currentIndex = 0;
        this.isFlipped = false;
        this.flashcard.classList.remove('is-flipped');
        this.spellingChecked = false;
        this.hintShown = false;
        this.updateCard();
        const levelText = level === 'all' ? 'All Levels' : `Level: ${level}`;
        this.currentLevelDisplay.textContent = levelText;
    }

    shuffleCards() {
        if (this.mode === 'writing') {
            for (let i = this.writingPrompts.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.writingPrompts[i], this.writingPrompts[j]] = [this.writingPrompts[j], this.writingPrompts[i]];
            }
            this.currentWritingIndex = 0;
            this.updateCard();
            return;
        }

        for (let i = this.filteredVocab.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.filteredVocab[i], this.filteredVocab[j]] = [this.filteredVocab[j], this.filteredVocab[i]];
        }
        this.currentIndex = 0;
        this.isFlipped = false;
        this.flashcard.classList.remove('is-flipped');
        this.spellingChecked = false;
        this.speakingChecked = false;
        this.quizChecked = false;
        this.vulinChecked = false;
        this.hintShown = false;
        this.updateCard();
    }

    // ============================================================
    //  NAVIGATION
    // ============================================================
    nextCard() {
        this.currentIndex = (this.currentIndex < this.filteredVocab.length - 1)
            ? this.currentIndex + 1 : 0;
        this.isFlipped = false;
        this.flashcard.classList.remove('is-flipped');
        this.spellingChecked = false;
        this.speakingChecked = false;
        this.quizChecked = false;
        this.vulinChecked = false;
        this.hintShown = false;
        this.updateCard();
    }

    prevCard() {
        this.currentIndex = (this.currentIndex > 0)
            ? this.currentIndex - 1 : this.filteredVocab.length - 1;
        this.isFlipped = false;
        this.flashcard.classList.remove('is-flipped');
        this.spellingChecked = false;
        this.speakingChecked = false;
        this.quizChecked = false;
        this.vulinChecked = false;
        this.hintShown = false;
        this.updateCard();
    }

    // ============================================================
    //  FLASHCARD MODE — flip
    // ============================================================
    flipCard() {
        this.isFlipped = !this.isFlipped;
        this.flashcard.classList.toggle('is-flipped');
    }

    // ============================================================
    //  UPDATE CARD CONTENT
    // ============================================================
    updateCard() {
        if (this.mode === 'writing') {
            const wItem = this.writingPrompts[this.currentWritingIndex];
            this.writingTitle.textContent = wItem.title;
            this.writingPrompt.textContent = wItem.prompt;
            this.writingBullets.innerHTML = wItem.bullets.map(b => `<li>${b}</li>`).join('');
            this.writingExampleText.textContent = wItem.example;

            // Reset state
            this.writingTextarea.value = '';
            this.writingExampleBox.classList.add('hidden');
            this.writingShowExampleBtn.textContent = 'Show Example Answer';
            return;
        }

        const item = this.filteredVocab[this.currentIndex];

        if (!item && this.mode !== 'writing') {
            this.dutchWord.textContent = 'No words found';
            this.englishWord.textContent = 'Select another level';
            this.spellingEnglish.textContent = 'No words found';
            this.speakingEnglish.textContent = 'No words found';
            this.quizSentence.textContent = 'No words found';
            this.vulinSentence.textContent = 'No words found';
            this.progressCount.textContent = '0/0';
            this.progressFill.style.width = '0%';
            return;
        }

        // Flashcard mode
        this.dutchWord.textContent = item.dutch;
        this.englishWord.textContent = item.english;
        this.cardCategory.textContent = item.category;
        this.englishExplanation.textContent = item.explanation || 'No explanation available.';
        this.exampleSentence.textContent = item.example || 'No example available.';

        // Speaking mode
        this.speakingEnglish.textContent = item.english;
        this.speakingCategory.textContent = item.category;
        this.speakingExplanation.textContent = item.explanation || 'No explanation available.';
        this.speakingStatusText.textContent = 'Tap to test speaking';
        this.speakingLiveTranscript.textContent = '';
        this.speakingFeedback.classList.add('hidden');
        this.speakingCorrectAnswer.classList.add('hidden');
        this.playbackDutchVoice.style.display = 'none';
        this.retrySpeakingBtn.style.display = 'none';

        // Spelling mode
        this.spellingEnglish.textContent = item.english;
        this.spellingCategory.textContent = item.category;
        this.spellingInput.value = '';
        this.spellingInput.disabled = false;
        this.spellingInput.classList.remove('input-correct', 'input-wrong');
        this.spellingFeedback.classList.add('hidden');
        this.correctAnswer.classList.add('hidden');
        this.hintLetters.innerHTML = '';
        this.checkSpellingBtn.textContent = 'Check';
        this.checkSpellingBtn.disabled = false;

        // 35% chance of a "Challenge" round — no hint available at all
        const isChallenge = Math.random() < 0.35;
        if (isChallenge) {
            this.hintShown = false;
            this.spellingHints.classList.add('hidden');
            this.hintToggleBtn.style.display = 'none';       // hide button entirely
            this.challengeBadge && (this.challengeBadge.style.display = '');
        } else {
            this.hintShown = true;
            this.spellingHints.classList.remove('hidden');
            this.hintToggleBtn.style.display = '';            // show toggle button
            this.hintToggleBtn.textContent = 'Hide hint';
            this.renderHintLetters(item.dutch);
            this.challengeBadge && (this.challengeBadge.style.display = 'none');
        }

        // Auto-focus the input in spelling mode so user can type immediately
        if (this.mode === 'spelling') {
            setTimeout(() => this.spellingInput.focus(), 50);
        }

        // Quiz mode
        this.quizCategory.textContent = item.category;
        this.quizFeedback.classList.add('hidden');
        this.playbackQuizVoice.style.display = 'none';

        // === QUIZ MODE ===
        // Prompt = the full Dutch example sentence (no English hints — that's the challenge!)
        this.quizSentence.textContent = item.example || item.dutch;

        // Build options: each is a Dutch word + its English explanation
        // Correct answer is the word that belongs to the sentence above
        this.quizOptionsGrid.innerHTML = '';

        const buildOptionHTML = (vocabItem) => {
            let engDesc = vocabItem.english;
            if (vocabItem.explanation && vocabItem.explanation.length > 5 && vocabItem.explanation !== 'No explanation available.') {
                engDesc = vocabItem.explanation;
            }
            return `<strong style="display:block; font-size:1.05em; font-weight:700; margin-bottom:5px;">${vocabItem.dutch}</strong>` +
                `<span style="font-size:0.88em; font-weight:400; opacity:0.85; line-height:1.3;">${engDesc}</span>`;
        };

        const optionsItems = [item];
        let attempts = 0;
        while (optionsItems.length < 4 && attempts < 60) {
            attempts++;
            const r = this.filteredVocab[Math.floor(Math.random() * this.filteredVocab.length)];
            if (!optionsItems.find(o => o.dutch === r.dutch)) {
                optionsItems.push(r);
            }
        }
        optionsItems.sort(() => Math.random() - 0.5);

        optionsItems.forEach(optItem => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.innerHTML = buildOptionHTML(optItem);
            btn.dataset.dutch = optItem.dutch;
            btn.addEventListener('click', () => this.checkQuizAnswer(optItem.dutch, btn));
            this.quizOptionsGrid.appendChild(btn);
        });

        // === VUL IN MODE ===
        this.vulinCategory.textContent = item.category;
        this.vulinFeedback.classList.add('hidden');
        this.vulinCorrectAnswer.classList.add('hidden');
        // Reset hint to hidden state
        this.vulinHintText.classList.add('hidden');
        this.vulinHintBtn.textContent = '💡 Show English hint';
        // Set hint text (English word + explanation)
        let hintContent = item.english;
        if (item.explanation && item.explanation.length > 5 && item.explanation !== 'No explanation available.') {
            hintContent += ` — ${item.explanation}`;
        }
        this.vulinHintText.textContent = hintContent;

        // Build sentence with blank: replace the Dutch key word with a blank
        const escapedKey = item.dutch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const blankRegex = new RegExp(`\\b${escapedKey}\\b`, 'i');
        const looseRegex = new RegExp(escapedKey, 'i');
        let sentenceWithBlank = item.example || item.dutch;
        const hasExample = !!item.example;
        if (hasExample && blankRegex.test(item.example)) {
            sentenceWithBlank = item.example.replace(blankRegex,
                `<span class="blank-space"> _____ </span>`);
        } else if (hasExample && looseRegex.test(item.example)) {
            sentenceWithBlank = item.example.replace(looseRegex,
                `<span class="blank-space"> _____ </span>`);
        } else {
            // fallback: show word at start as blank
            sentenceWithBlank = `<span class="blank-space"> _____ </span>: ${item.example || item.dutch}`;
        }
        this.vulinSentence.innerHTML = sentenceWithBlank;

        // Build Dutch-only word options
        this.vulinOptionsGrid.innerHTML = '';
        const vulinItems = [item];
        let vAttempts = 0;
        while (vulinItems.length < 4 && vAttempts < 60) {
            vAttempts++;
            const r = this.filteredVocab[Math.floor(Math.random() * this.filteredVocab.length)];
            if (!vulinItems.find(o => o.dutch === r.dutch)) {
                vulinItems.push(r);
            }
        }
        vulinItems.sort(() => Math.random() - 0.5);
        vulinItems.forEach(optItem => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = optItem.dutch;
            btn.dataset.dutch = optItem.dutch;
            btn.addEventListener('click', () => this.checkVulinAnswer(optItem.dutch, btn));
            this.vulinOptionsGrid.appendChild(btn);
        });

        // Progress
        const total = this.filteredVocab.length;
        const current = this.currentIndex + 1;
        this.progressCount.textContent = `${current}/${total}`;
        this.progressFill.style.width = `${(current / total) * 100}%`;
    }

    // ============================================================
    //  SPELLING MODE — check
    // ============================================================
    checkSpelling() {
        if (this.spellingChecked) {
            // Already checked — move to next
            this.nextCard();
            return;
        }

        const item = this.filteredVocab[this.currentIndex];
        if (!item) return;

        const userAnswer = this.spellingInput.value.trim();
        if (!userAnswer) {
            this.spellingInput.focus();
            return;
        }

        const correct = item.dutch.toLowerCase().trim();
        const isCorrect = userAnswer.toLowerCase() === correct;

        this.spellingChecked = true;
        this.spellingFeedback.classList.remove('hidden');

        if (isCorrect) {
            this.stats.correct++;
            this.feedbackIcon.textContent = '✅';
            this.feedbackMessage.textContent = 'Correct! Well done!';
            this.feedbackMessage.className = 'feedback-message feedback-correct';
            this.spellingInput.classList.add('input-correct');
            this.correctAnswer.classList.add('hidden');
            // Auto-speak correct word
            this.speakCurrentWord();
        } else {
            this.stats.wrong++;
            this.feedbackIcon.textContent = '❌';
            this.feedbackMessage.textContent = 'Not quite — the correct spelling is:';
            this.feedbackMessage.className = 'feedback-message feedback-wrong';
            this.spellingInput.classList.add('input-wrong');
            this.correctAnswer.textContent = item.dutch;
            this.correctAnswer.classList.remove('hidden');
        }

        this.updateStats();
        this.checkSpellingBtn.textContent = 'Next Word →';
        this.spellingInput.disabled = true;
    }

    toggleHint() {
        const item = this.filteredVocab[this.currentIndex];
        if (!item) return;

        // Allow hiding even after answer checked; only block *showing* after check
        if (this.spellingChecked && !this.hintShown) return;

        this.hintShown = !this.hintShown;

        if (this.hintShown) {
            this.spellingHints.classList.remove('hidden');
            this.hintToggleBtn.textContent = 'Hide hint';
            this.renderHintLetters(item.dutch);
        } else {
            this.spellingHints.classList.add('hidden');
            this.hintToggleBtn.textContent = 'Show hint letters';
        }
    }

    renderHintLetters(word) {
        this.hintLetters.innerHTML = '';
        const letters = word.split('');
        const last = letters.length - 1;

        letters.forEach((char, i) => {
            const span = document.createElement('span');

            if (char === ' ') {
                // Word separator — always show as a gap
                span.className = 'hint-letter hint-space';
                span.textContent = ' ';
            } else if (char === '-' || char === '/' || char === '.') {
                // Punctuation — always reveal
                span.className = 'hint-letter revealed';
                span.textContent = char;
            } else {
                span.className = 'hint-letter';
                // Reveal: first letter, every 3rd letter, and last letter
                // e.g. "Fractuur" → F r _ _ t _ _ r  (positions 0, 3, 6, 7)
                const shouldReveal = (i === 0) || (i === last) || (i % 3 === 0);
                if (shouldReveal) {
                    span.textContent = char;
                    span.classList.add('revealed');
                } else {
                    span.textContent = '_';
                }
            }
            this.hintLetters.appendChild(span);
        });

        // Word length badge
        const lengthBadge = document.createElement('span');
        lengthBadge.className = 'hint-length';
        lengthBadge.textContent = `${word.length} letters`;
        this.hintLetters.appendChild(lengthBadge);
    }

    updateStats() {
        const total = this.stats.correct + this.stats.wrong;
        this.statCorrect.textContent = this.stats.correct;
        this.statWrong.textContent = this.stats.wrong;
        this.statAccuracy.textContent = total > 0
            ? `${Math.round((this.stats.correct / total) * 100)}%` : '–';
    }

    // ============================================================
    //  TEXT-TO-SPEECH — Best available Dutch voice
    // ============================================================

    /**
     * Score all available voices and return the most natural Dutch one.
     * Priority (highest wins):
     *   10 – "Google Nederlands"           (Chrome neural, very natural)
     *    9 – Any other Google nl voice
     *    8 – Microsoft nl-NL Online        (Edge neural, very natural)
     *    7 – Any other Microsoft nl voice
     *    5 – System nl-NL voice
     *    2 – Any nl-* voice
     */
    getBestDutchVoice() {
        const voices = window.speechSynthesis.getVoices();
        if (!voices.length) return null;

        let best = null;
        let bestScore = -1;

        voices.forEach(v => {
            const name = v.name.toLowerCase();
            const lang = v.lang.toLowerCase();
            if (!lang.startsWith('nl')) return;

            let score = 0;
            if (name.includes('google') && name.includes('nederland')) score = 10;
            else if (name.includes('google')) score = 9;
            else if (name.includes('microsoft') && lang === 'nl-nl' && name.includes('online')) score = 8;
            else if (name.includes('microsoft')) score = 7;
            else if (lang === 'nl-nl') score = 5;
            else score = 2;

            if (score > bestScore) { bestScore = score; best = v; }
        });

        return best;
    }

    speakCurrentWord() {
        const item = this.filteredVocab[this.currentIndex];
        if (!item) return;
        if (!('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel();

        let activeBtn = this.speakBtnFront;
        if (this.mode === 'spelling') activeBtn = this.speakBtnSpelling;
        if (this.mode === 'speaking') activeBtn = this.playbackDutchVoice;

        const doSpeak = () => {
            const utterance = new SpeechSynthesisUtterance(item.dutch);
            utterance.lang = 'nl-NL';
            utterance.rate = 0.82;   // Slightly slower — better for learners
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            const voice = this.getBestDutchVoice();
            if (voice) {
                utterance.voice = voice;
                // Show which voice is active in the tooltip
                activeBtn.title = `\uD83D\uDD0A ${voice.name}`;
            }

            activeBtn.classList.add('speaking');
            utterance.onend = () => activeBtn.classList.remove('speaking');
            utterance.onerror = () => activeBtn.classList.remove('speaking');
            window.speechSynthesis.speak(utterance);
        };

        // Voices may not be loaded yet on first visit — wait if needed
        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true });
        } else {
            doSpeak();
        }
    }

    // ============================================================
    //  SPEAKING TEST MODE
    // ============================================================
    initSpeakingRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('Speech Recognition API not supported in this browser.');
            return;
        }

        this.speakingRecognition = new SpeechRecognition();
        this.speakingRecognition.lang = 'nl-NL';
        this.speakingRecognition.continuous = true;
        this.speakingRecognition.interimResults = true;

        this.speakingRecognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            this.speakingLiveTranscript.textContent = finalTranscript || interimTranscript;

            if (finalTranscript) {
                this.checkSpeakingFormat(finalTranscript);
            }
        };

        this.speakingRecognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            this.speakingStatusText.textContent = 'Error: ' + event.error;
            this.speakingMicBtn.classList.remove('listening');
        };

        this.speakingRecognition.onend = () => {
            if (this.isSpeakingListening && !this.speakingChecked) {
                // If we are still supposed to be listening but it ended, restart
                try {
                    this.speakingRecognition.start();
                } catch (e) {
                    console.log('Already started');
                }
            } else if (!this.speakingChecked) {
                this.speakingMicBtn.classList.remove('listening');
                this.speakingStatusText.textContent = 'Tap to test speaking';
            }
        };
    }

    toggleSpeakingTest() {
        if (this.isSpeakingListening) {
            this.stopSpeakingTest();
        } else {
            this.startSpeakingTest();
        }
    }

    startSpeakingTest() {
        if (!this.speakingRecognition) {
            alert("Your browser does not support Speech Recognition. Please try Chrome.");
            return;
        }

        const item = this.filteredVocab[this.currentIndex];
        if (!item || this.speakingChecked) return;

        this.speakingFeedback.classList.add('hidden');
        this.speakingCorrectAnswer.classList.add('hidden');
        this.playbackDutchVoice.style.display = 'none';
        this.retrySpeakingBtn.style.display = 'none';

        this.isSpeakingListening = true;
        this.speakingLiveTranscript.textContent = '...';
        this.speakingStatusText.textContent = 'Listening... (speak Dutch)';
        this.speakingMicBtn.classList.add('listening');

        // Stop TTS if it's currently speaking
        window.speechSynthesis.cancel();

        try {
            this.speakingRecognition.start();
        } catch (e) {
            // Already started
        }
    }

    stopSpeakingTest() {
        if (!this.speakingRecognition || !this.isSpeakingListening) return;
        this.isSpeakingListening = false;
        this.speakingRecognition.stop();
        this.speakingMicBtn.classList.remove('listening');
        this.speakingStatusText.textContent = 'Processing...';

        // Give it a short delay to see if parsing caught the final result
        setTimeout(() => {
            if (!this.speakingChecked) {
                const text = this.speakingLiveTranscript.textContent;
                if (text && text !== '...') {
                    this.checkSpeakingFormat(text);
                } else {
                    this.speakingStatusText.textContent = 'Tap to test speaking';
                }
            }
        }, 800);
    }

    checkSpeakingFormat(transcript) {
        if (this.speakingChecked) return;

        const item = this.filteredVocab[this.currentIndex];
        if (!item) return;

        // Clean both strings: lower case, remove punctuation
        const cleanStr = (s) => s.toLowerCase().replace(/[^a-z0-9àáâäçèéêëìíîïñòóôöùúûüýÿ]/gi, '').trim();

        const transcriptClean = cleanStr(transcript);
        const dutchClean = cleanStr(item.dutch);

        // Simple fuzzy match: does transcript contain the correct word, or does the correct word contain the transcript (if long enough)
        const isCorrect = transcriptClean.includes(dutchClean) || (transcriptClean.length > 3 && dutchClean.includes(transcriptClean));

        // Mark as checked so it doesn't trigger multiple times per word
        if (isCorrect || !this.isSpeakingListening) {
            this.speakingChecked = true;
            this.isSpeakingListening = false;
            try { this.speakingRecognition.stop(); } catch (e) { }
            this.speakingMicBtn.classList.remove('listening');

            this.speakingFeedback.classList.remove('hidden');
            this.speakingStatusText.textContent = 'Test Complete';

            if (isCorrect) {
                this.speakingStats.correct++;
                this.speakingFeedback.className = 'spelling-feedback feedback-correct';
                this.speakingFeedbackIcon.innerHTML = '✅';
                this.speakingFeedbackMessage.textContent = 'Excellent pronunciation!';
            } else {
                this.speakingStats.wrong++;
                this.speakingFeedback.className = 'spelling-feedback feedback-wrong';
                this.speakingFeedbackIcon.innerHTML = '❌';
                this.speakingFeedbackMessage.textContent = 'Keep practicing!';
                this.speakingCorrectAnswer.textContent = `It should sound like: ${item.dutch}`;
                this.speakingCorrectAnswer.classList.remove('hidden');
                this.playbackDutchVoice.style.display = 'block';
                this.retrySpeakingBtn.style.display = 'block';
            }

            this.updateSpeakingStats();
        }
    }

    retrySpeakingTest() {
        // Only allow retry if they failed the most recent test
        if (!this.speakingChecked) return;

        // Remove the wrong stat so they can try again
        if (this.speakingStats.wrong > 0) {
            this.speakingStats.wrong--;
        }
        this.updateSpeakingStats();

        // Reset state for the current card
        this.speakingChecked = false;
        this.speakingLiveTranscript.textContent = '';
        this.speakingFeedback.classList.add('hidden');
        this.speakingCorrectAnswer.classList.add('hidden');
        this.playbackDutchVoice.style.display = 'none';
        this.retrySpeakingBtn.style.display = 'none';

        // Immediately start listening again
        this.startSpeakingTest();
    }

    updateSpeakingStats() {
        const total = this.speakingStats.correct + this.speakingStats.wrong;
        this.speakingStatCorrect.textContent = this.speakingStats.correct;
        this.speakingStatWrong.textContent = this.speakingStats.wrong;
        this.speakingStatAccuracy.textContent = total > 0
            ? `${Math.round((this.speakingStats.correct / total) * 100)}%` : '–';
    }

    speakCurrentWordEnglish() {
        const item = this.filteredVocab[this.currentIndex];
        if (!item) return;
        if (!('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel();
        this.speakBtnSpeakingHint.classList.add('speaking');

        const utterance = new SpeechSynthesisUtterance(item.english);
        utterance.lang = 'en-US';
        utterance.onend = () => this.speakBtnSpeakingHint.classList.remove('speaking');
        utterance.onerror = () => this.speakBtnSpeakingHint.classList.remove('speaking');

        window.speechSynthesis.speak(utterance);
    }

    // ============================================================
    //  QUIZ MODE — LOGIC
    // ============================================================
    checkQuizAnswer(selectedDutch, btn) {
        if (this.quizChecked) return;

        const item = this.filteredVocab[this.currentIndex];
        if (!item) return;

        this.quizChecked = true;

        // Disable all buttons in the grid
        const allBtns = this.quizOptionsGrid.querySelectorAll('button');
        allBtns.forEach(b => b.disabled = true);

        const isCorrect = selectedDutch === item.dutch;

        this.quizFeedback.classList.remove('hidden');
        this.playbackQuizVoice.style.display = 'block';

        if (isCorrect) {
            this.quizStats.correct++;
            btn.classList.add('correct');
            this.quizFeedback.className = 'spelling-feedback feedback-correct';
            this.quizFeedbackIcon.innerHTML = '✅';
            this.quizFeedbackMessage.textContent = 'Correct!';
        } else {
            this.quizStats.wrong++;
            btn.classList.add('wrong');

            // Highlight the correct one
            allBtns.forEach(b => {
                if (b.dataset.dutch === item.dutch) {
                    b.classList.add('correct');
                }
            });

            this.quizFeedback.className = 'spelling-feedback feedback-wrong';
            this.quizFeedbackIcon.innerHTML = '❌';
            this.quizFeedbackMessage.textContent = 'Incorrect!';
        }

        this.updateQuizStats();
    }

    updateQuizStats() {
        const total = this.quizStats.correct + this.quizStats.wrong;
        this.quizStatCorrect.textContent = this.quizStats.correct;
        this.quizStatWrong.textContent = this.quizStats.wrong;
        this.quizStatAccuracy.textContent = total > 0
            ? `${Math.round((this.quizStats.correct / total) * 100)}%` : '–';
    }

    // ============================================================
    //  VUL IN MODE — LOGIC
    // ============================================================
    checkVulinAnswer(selectedDutch, btn) {
        if (this.vulinChecked) return;

        const item = this.filteredVocab[this.currentIndex];
        if (!item) return;

        this.vulinChecked = true;

        const allBtns = this.vulinOptionsGrid.querySelectorAll('button');
        allBtns.forEach(b => b.disabled = true);

        const isCorrect = selectedDutch === item.dutch;

        // Fill the blank visually with the selected word
        const blankEl = this.vulinSentence.querySelector('.blank-space');
        if (blankEl) {
            blankEl.textContent = ` ${selectedDutch} `;
            blankEl.style.borderColor = isCorrect ? 'var(--success)' : 'var(--danger)';
            blankEl.style.color = isCorrect ? 'var(--success)' : 'var(--danger)';
        }

        // If wrong, also highlight the correct button green
        if (!isCorrect) {
            allBtns.forEach(b => {
                if (b.dataset.dutch === item.dutch) b.classList.add('correct');
            });
        }

        this.vulinFeedback.classList.remove('hidden');

        if (isCorrect) {
            this.vulinStats.correct++;
            btn.classList.add('correct');
            this.vulinFeedback.className = 'spelling-feedback feedback-correct';
            this.vulinFeedbackIcon.innerHTML = '✅';
            this.vulinFeedbackMessage.textContent = 'Correct! Goed gedaan!';
        } else {
            this.vulinStats.wrong++;
            btn.classList.add('wrong');
            this.vulinFeedback.className = 'spelling-feedback feedback-wrong';
            this.vulinFeedbackIcon.innerHTML = '❌';
            this.vulinFeedbackMessage.textContent = `Incorrect! The answer is: ${item.dutch}`;
        }

        this.updateVulinStats();
    }

    updateVulinStats() {
        const total = this.vulinStats.correct + this.vulinStats.wrong;
        this.vulinStatCorrect.textContent = this.vulinStats.correct;
        this.vulinStatWrong.textContent = this.vulinStats.wrong;
        this.vulinStatAccuracy.textContent = total > 0
            ? `${Math.round((this.vulinStats.correct / total) * 100)}%` : '–';
    }

    speakVulinSentence() {
        const item = this.filteredVocab[this.currentIndex];
        if (!item || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(item.example || item.dutch);
        utterance.lang = 'nl-NL';
        const voices = window.speechSynthesis.getVoices();
        const nlVoice = voices.find(v => v.lang.startsWith('nl'));
        if (nlVoice) utterance.voice = nlVoice;
        window.speechSynthesis.speak(utterance);
    }
}

// Warm-up: trigger voice list load as early as possible so the
// first speaker-button click has no delay.
if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener('voiceschanged', () => { });
}

// Initialize game on load
document.addEventListener('DOMContentLoaded', () => {
    new FlashcardGame();
});
