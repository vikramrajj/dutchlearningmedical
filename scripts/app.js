import { medicalVocab } from './data.js';
import { generalVocab } from './generalData.js';
import { knsData } from './knsData.js';
import { oefenexamensData } from './oefenexamensData.js';
import { speakingExamData } from './speakingExamData.js';
import { derdeRondeVulinData } from './derdeRondeVulinData.js';


class FlashcardGame {
    constructor() {
        this.vocab = medicalVocab;
        this.domain = 'medical'; // 'medical' | 'general'
        this.filteredVocab = [...this.vocab].sort(() => Math.random() - 0.5);

        this.currentIndex = 0;
        this.mode = 'flashcard'; // 'flashcard' | 'spelling' | 'speaking' | 'quiz' | 'vulin' | 'writing' | 'derderonde'

        this.writingPrompts = [
            {
                title: "Afspraak verzetten",
                prompt: "U volgt een opleiding. U hebt morgen een afspraak met Amber, een andere student. U kunt niet en wilt een andere afspraak maken. U schrijft daarom een e-mail aan Amber.",
                bullets: [
                    "Schrijf dat u de afspraak wilt verzetten.",
                    "Schrijf waarom u dat wilt. Bedenk zelf waarom.",
                    "Stel een nieuwe datum voor."
                ],
                example: "Beste Amber,\n\nIk wil de afspraak van morgen verzetten.\nIk kan niet komen, want ik ben ziek. Ik heb koorts.\nZullen we volgende week donderdag afspreken? Ik kan om 13.00 uur.\n\nGroetjes,\n[Jouw naam]"
            },
            {
                title: "Feest delen",
                prompt: "U krijgt elke week een wijkkrant. Iedereen uit de buurt mag iets voor deze krant schrijven. U schrijft over een feest dat u elk jaar viert. Schrijf minimaal drie zinnen op.",
                bullets: [
                    "Waarom viert u het feest?",
                    "Wie komen er op het feest?",
                    "Wat doet u op het feest?"
                ],
                example: "Ik vier elk jaar Sinterklaas. Ik vind dit feest erg gezellig.\nMijn familie en mijn vrienden komen op het feest.\nWe eten pepernoten en we geven elkaar cadeautjes."
            },
            {
                title: "Dienst ruilen",
                prompt: "U moet zondag werken maar u wilt graag vrij. U schrijft daarom een e-mail aan uw collega Farida. U vraagt of zij met u wil ruilen.",
                bullets: [
                    "Schrijf op waarom u mailt.",
                    "Schrijf waarom u wilt ruilen. Bedenk het zelf.",
                    "Schrijf op welke dag u wel kunt werken."
                ],
                example: "Beste Farida,\n\nIk stuur je deze e-mail over werk. Ik moet zondag werken, maar ik wil ruilen.\nIk wil vrij, want mijn dochter is jarig en we geven een feest.\nIk kan volgende week dinsdag of donderdag werken. Kun jij zondag voor mij werken?\n\nGroeten,\n[Jouw naam]"
            },
            {
                title: "Inschrijven sportschool",
                prompt: "U wilt graag sporten. U gaat naar een sportschool in uw buurt. U moet een formulier invullen. Sommige gegevens moet u zelf bedenken.",
                bullets: [
                    "Kies een groepsles (Fitness, Yoga of Hardlopen) en vertel hoe vaak je wilt komen.",
                    "Waarom kiest u voor deze groepsles?",
                    "Hoe is uw gezondheid?"
                ],
                example: "Ik wil mij inschrijven voor de groepsles Yoga. Ik wil twee keer per week komen.\n\nIk kies voor yoga, want ik wil ontspannen. Mijn werk is erg druk.\n\nMijn gezondheid is goed. Ik ben fit en ik ben niet ziek."
            },
            {
                title: "Mooiste kleren",
                prompt: "U krijgt elke week een wijkkrant. Iedereen uit de buurt mag iets voor deze krant schrijven. U schrijft over de kleren die u het liefst draagt. Schrijf minimaal drie zinnen op.",
                bullets: [
                    "Wat draagt u het liefst?",
                    "Hoe zien de kleren eruit?",
                    "Wanneer draagt u deze kleren?"
                ],
                example: "Ik draag het liefst mijn spijkerbroek en een blauwe trui.\nMijn kleren zijn simpel, maar ze zitten heel lekker.\nIk draag deze kleren altijd in het weekend, want dan ben ik vrij."
            },
            {
                title: "Boek lenen",
                prompt: "Voor uw opleiding Techniek heeft u snel het boek 'Natuurkunde 1' nodig. In de bibliotheek is het boek niet. Een medestudente heeft het boek. U wilt het boek van haar lenen. U schrijft haar een e-mail.",
                bullets: [
                    "U schrijft welk boek u wilt lenen.",
                    "U schrijft waarom u het boek van haar wilt lenen.",
                    "U schrijft wanneer ze het boek terugkrijgt. Bedenk zelf wanneer."
                ],
                example: "Beste Jasmijn,\n\nIk wil graag het boek 'Natuurkunde 1' van jou lenen.\nHet boek is niet in de bibliotheek en ik heb het morgen nodig.\nJe krijgt het boek volgende week maandag terug.\n\nGroetjes,\n[Jouw naam]"
            },
            {
                title: "Schadeformulier (Ingebroken)",
                prompt: "Er is ingebroken in uw huis. Dieven hebben spullen meegenomen en er is schade. U vult een schadeformulier in van uw verzekering.",
                bullets: [
                    "Vul uw persoonsgegevens in (bedenk deze zelf).",
                    "Schrijf op wanneer er is ingebroken.",
                    "Schrijf drie dingen op die zijn gebeurd (bijv. wat is gestolen of kapot)."
                ],
                example: "Persoonsgegevens: [Jouw naam, Adres, Telefoon]\nDatum van de schade: 12 maart 2026\n\nOmschrijving:\n- Mijn laptop is gestolen.\n- De ketting van mijn vrouw is gestolen.\n- Het raam in de woonkamer is kapot."
            },
            {
                title: "Vrije dag aanvragen",
                prompt: "U wilt volgende week een dag vrij vragen. U schrijft een e-mail aan uw chef, meneer Jansen.",
                bullets: [
                    "U schrijft wanneer u vrij wilt hebben. Bedenk zelf een dag en datum.",
                    "U schrijft waarom u vrij wilt hebben. Bedenk zelf waarom."
                ],
                example: "Beste meneer Jansen,\n\nIk wil graag een vrije dag aanvragen.\nIk wil volgende week vrijdag 20 maart vrij zijn.\nIk vraag dit, want mijn zus gaat trouwen. Ik moet de hele dag helpen.\n\nMet vriendelijke groet,\n[Jouw naam]"
            },
            {
                title: "Ziek melden (Werk)",
                prompt: "U bent ziek. U kunt vandaag niet naar uw werk komen. U schrijft een e-mail aan uw manager, mevrouw De Jong.",
                bullets: [
                    "Schrijf dat u ziek bent en niet kunt werken.",
                    "Schrijf welke klachten u heeft.",
                    "Schrijf wanneer u denkt weer te komen werken."
                ],
                example: "Beste mevrouw De Jong,\n\nIk stuur deze e-mail, want ik ben ziek. Ik kan vandaag niet werken.\nIk heb koorts en ik heb keelpijn.\nIk denk dat ik maandag weer kom werken.\n\nMet vriendelijke groet,\n[Jouw naam]"
            },
            {
                title: "Een nieuw huis",
                prompt: "U bent onlangs in deze straat komen wonen. U schrijft een stukje in de wijkkrant om uzelf voor te stellen aan de nieuwe buren.",
                bullets: [
                    "Wie bent u en met wie woont u?",
                    "Waar woonde u hiervoor?",
                    "Waarom bent u hier komen wonen?"
                ],
                example: "Hallo allemaal! Mijn naam is [Jouw naam]. Ik woon nu in deze straat met mijn man en twee kinderen.\nHiervoor woonden we in Amsterdam, maar dat was te druk.\nWe wonen nu hier, want deze buurt is erg leuk en rustig."
            },
            {
                title: "Uw favoriete winkel",
                prompt: "U schrijft een stukje voor een tijdschrift. Het gaat over boodschappen doen.",
                bullets: [
                    "Naar welke supermarkt gaat u het liefst?",
                    "Waarom vindt u deze winkel leuk?",
                    "Welke dingen koopt u daar altijd?"
                ],
                example: "Ik ga het liefst naar de grote markt in het centrum.\nIk vind dit leuk, want de groenten zijn vers en goedkoop.\nIk koop daar altijd verse appels, brood en kaas."
            },
            {
                title: "Kapot product",
                prompt: "U heeft vorige week een nieuwe koffiemachine gekocht. Maar het apparaat is na twee dagen kapot gegaan. U schrijft een e-mail naar de winkel 'Elektronica Nu'.",
                bullets: [
                    "Schrijf op wat u heeft gekocht en wanneer.",
                    "Schrijf wat er precies kapot is.",
                    "Schrijf wat u wilt dat de winkel doet (bijv. repareren of een nieuwe geven)."
                ],
                example: "Beste medewerker,\n\nIk heb vorige week dinsdag een koffiemachine bij u gekocht.\nHet apparaat is nu kapot. Het water lekt en de koffie wordt niet warm.\nKunt u de koffiemachine repareren of kan ik een nieuwe krijgen?\n\nGroeten,\n[Jouw naam]"
            },
            {
                title: "Vriend uitnodigen (Film)",
                prompt: "U heeft twee kaartjes gekocht voor de bioscoop. U wilt uw vriend Ahmed uitnodigen om mee te gaan. U schrijft hem een e-mail.",
                bullets: [
                    "Welke film willen jullie bekijken en waar gaat de film over?",
                    "Wanneer gaan jullie (dag en tijd)?",
                    "Waar spreken jullie af voordat de film begint?"
                ],
                example: "Hoi Ahmed,\n\nIk heb twee kaartjes voor een nieuwe actiefilm. Het gaat over een bankoverval.\nZullen we zaterdagavond gaan? De film begint om 20:00 uur.\nLaten we afspreken voor het station om 19:30 uur. Ga je mee?\n\nGroetjes,\n[Jouw naam]"
            },
            {
                title: "Restaurant reserveren",
                prompt: "U wilt een tafel in een restaurant reserveren, omdat u uw verjaardag wilt vieren met vrienden. U schrijft een e-mail naar restaurant 'De Gouden Hond'.",
                bullets: [
                    "Voor wanneer wilt u reserveren en hoe laat?",
                    "Voor hoeveel personen is de reservering?",
                    "Noteer een speciale wens (bijvoorbeeld: iemand is allergisch of u heeft een kinderstoel nodig)."
                ],
                example: "Beste medewerker,\n\nIk wil graag een tafel reserveren voor mijn verjaardag.\nIk wil komen op zaterdag om 18:30 uur.\nDe reservering is voor vier personen.\nEén persoon is allergisch voor vis. Kunt u daar rekening mee houden?\n\nAlvast bedankt,\n[Jouw naam]"
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
                example: "Beste docent,\n\nIk stuur u een e-mail over de toets van morgen.\nIk kan helaas niet komen, want ik ben ziek en lig in bed.\nSorry voor het ongemak.\nWanneer kan ik de toets maken?\n\nMet vriendelijke groet,\n[Jouw naam]"
            },
            {
                title: "Problemen in de straat",
                prompt: "In de straat waar u woont zijn twee problemen (bijvoorbeeld: een kapotte lantaarnpaal en veel afval op straat). U meldt de problemen bij de gemeente. Vul het meldingsformulier in.",
                bullets: [
                    "Vul uw persoonsgegevens in.",
                    "In welke straat zijn er problemen?",
                    "Wat zijn de problemen? Schrijf het op."
                ],
                example: "Persoonsgegevens: [Jouw naam, Adres, Telefoon, E-mail]\n\nIn welke straat zijn er problemen?\nIn de Molenstraat.\n\nWat zijn de problemen?\nEr is een kapotte lantaarnpaal. Het is 's nachts donker. Ook ligt er veel vuilnis op straat."
            },
            {
                title: "Weekend",
                prompt: "U krijgt elke week een wijkkrant. Iedereen uit de buurt mag iets voor deze krant schrijven. U schrijft over uw weekend. Schrijf minimaal drie zinnen op.",
                bullets: [
                    "Wat doet u graag in het weekend?",
                    "Met wie doet u dat?",
                    "Waar doet u dat?"
                ],
                example: "Ik wandel graag in het weekend.\nIk doe dat samen met mijn vrouw en mijn hond.\nWe wandelen vaak in het bos of we gaan naar het strand."
            },
            {
                title: "Bericht collega",
                prompt: "U werkt in een kledingzaak. Straks komt uw collega Fariha. Zij moet een paar dingen doen (zoals de vloer vegen, nieuwe kleren ophangen en de bloemen water geven). Schrijf een briefje voor Fariha.",
                bullets: [
                    "Verwelkom haar.",
                    "Vertel wat zij moet doen. Schrijf drie dingen op.",
                    "Sluit het briefje af met uw naam."
                ],
                example: "Hallo Fariha,\n\nFijn dat je er bent! Jij moet vanavond nog een paar dingen doen.\nJe moet de vloer vegen en de nieuwe kleren ophangen. Je moet ook de planten water geven.\nSucces!\n\nGroeten,\n[Jouw naam]"
            },
            {
                title: "Kapper afspraak maken",
                prompt: "U wilt uw haar laten knippen. U schrijft een e-mail naar uw kapper.",
                bullets: [
                    "Schrijf waarom u mailt.",
                    "Geef aan wat u met uw haar wilt doen (bijv. knippen, wassen, verven).",
                    "Vraag op welke dag en tijd u kunt komen."
                ],
                example: "Beste kapper,\n\nIk stuur deze e-mail, want ik wil een afspraak maken.\nIk wil mijn haar graag laten wassen en knippen.\nHebt u tijd op donderdagmiddag of vrijdagochtend?\n\nGroeten,\n[Jouw naam]"
            },
            {
                title: "Nieuwe telefoon kopen",
                prompt: "U wilt een nieuwe mobiele telefoon kopen. U schrijft een bericht naar een elektronicawinkel met een paar vragen.",
                bullets: [
                    "Vertel wat u zoekt.",
                    "Stel een vraag over de prijs.",
                    "Vraag of de telefoon op voorraad is."
                ],
                example: "Beste meneer/mevrouw,\n\nIk zoek een nieuwe mobiele telefoon van Samsung.\nWat kost deze telefoon bij u?\nEn is de telefoon op dit moment in de winkel?\n\nAlvast bedankt,\n[Jouw naam]"
            },
            {
                title: "Verjaardag uitnodiging",
                prompt: "U bent binnenkort jarig en u geeft een feestje. U schrijft een uitnodiging aan uw buren.",
                bullets: [
                    "Vertel waarom u een feest geeft.",
                    "Geef aan wanneer het feest is (datum en tijd).",
                    "Vraag of ze willen laten weten of ze komen."
                ],
                example: "Beste buren,\n\nIk nodig jullie uit voor mijn feestje, want ik ben zaterdag jarig!\nHet feest is aanstaande zaterdag en begint om 20:00 uur.\nLaat even weten of jullie kunnen komen.\n\nGroetjes,\n[Jouw naam]"
            }
        ].sort(() => Math.random() - 0.5);
        this.currentWritingIndex = 0;
        // --- PIC WRITE PROMPTS (General domain only) ---
        this.picWritingPrompts = [
            {
                title: "Problemen in de straat",
                category: "Meldingsformulier",
                scenario: "In de straat waar u woont zijn twee problemen. Op de foto's ziet u wat de problemen zijn. U meldt de problemen bij de gemeente. Vul het formulier van de gemeente in. Sommige gegevens moet u zelf bedenken.",
                images: [
                    { src: "images/street_garbage.png" },
                    { src: "images/broken_pavement.png" }
                ],
                bullets: [
                    "Persoonsgegevens: Bedenk zelf uw naam, adres, postcode, woonplaats, telefoonnummer en e-mail.",
                    "In welke straat zijn er problemen?",
                    "Wat zijn de twee problemen? Schrijf op wat u op de foto's ziet."
                ],
                example: "Persoonsgegevens:\nNaam: Jan de Vries\nAdres: Molenstraat 8\nPostcode: 2600 AB\nWoonplaats: Delft\nTelefoon: 06-12345678\nE-mail: jan.devries@email.nl\n\nIn welke straat zijn er problemen?\nDe problemen zijn in de Molenstraat.\n\nWat zijn de problemen?\nEr ligt veel afval op de stoep en er zijn vuilniszakken op straat. Ook is de straat kapot; er zitten gaten in de weg en de stenen liggen los."
            },
            {
                title: "Bericht aan een collega",
                category: "Briefje schrijven",
                scenario: "U werkt in een kledingzaak. Straks komt uw collega Fariha. Zij moet een paar dingen doen. Kijk naar de plaatjes. Schrijf een briefje voor Fariha.",
                images: [
                    { src: "images/vacuum_cleaner.png" },
                    { src: "images/messy_clothes.png" },
                    { src: "images/clothes_rack.png" },
                    { src: "images/store_keys.png" }
                ],
                bullets: [
                    "Verwelkom Fariha.",
                    "Vertel wat zij moet doen. Schrijf drie dingen op (kijk naar de plaatjes).",
                    "Schrijf in hele zinnen.",
                    "Sluit het briefje af met uw naam."
                ],
                example: "Hallo Fariha,\n\nFijn dat je er bent! Er zijn een paar dingen die je vandaag moet doen in de winkel.\nEerst moet je de vloer stofzuigen. Daarna moet je de kleding opruimen en netjes aan het rek hangen. Als laatste moet je de winkel goed afsluiten met de sleutels.\n\nAlvast bedankt!\n\nGroeten,\n[Jouw naam]"
            },
            {
                title: "Ingebroken",
                category: "Schadeformulier inboedelverzekering",
                scenario: "Er is ingebroken in uw huis. Dieven hebben spullen meegenomen en er is schade. U vult een schadeformulier in van uw verzekering. Kijk naar de plaatjes.",
                images: [
                    { src: "images/stolen_laptop.jpg" },
                    { src: "images/stolen_watch.jpg" },
                    { src: "images/broken_window.jpg" }
                ],
                bullets: [
                    "Vul het formulier in. Bedenk zelf de gegevens (naam, adres, telefoon, e-mail).",
                    "Schrijf op wanneer er is ingebroken.",
                    "Schrijf drie dingen op die zijn gebeurd. Schrijf wat u op de plaatjes ziet."
                ],
                example: "Schadeformulier inboedelverzekering:\n\nPersoonsgegevens:\nNaam: Ahmed Yilmaz\nAdres: Kerkstraat 22\nTelefoon: 06-87654321\nE-mail: ahmed.y@email.nl\n\nDatum van de schade: 12 april 2026\n\nOmschrijving van de schade:\nEr is gisteravond ingebroken in mijn huis. De dieven hebben mijn laptop gestolen van het bureau. Ook is mijn zilveren horloge meegenomen. De inbrekers zijn binnengekomen door een raam kapot te maken."
            },
            {
                title: "Ziek melden",
                category: "E-mail aan uw manager",
                scenario: "U bent ziek. U heeft koorts en u voelt zich niet goed. U kunt vandaag niet naar uw werk komen. U schrijft een e-mail aan uw manager, mevrouw Bakker. Kijk naar de plaatjes.",
                images: [
                    { src: "images/sick_person.jpg" },
                    { src: "images/thermometer.jpg" }
                ],
                bullets: [
                    "Schrijf dat u ziek bent en niet kunt komen werken.",
                    "Schrijf welke klachten u heeft (kijk naar de plaatjes).",
                    "Schrijf wanneer u denkt weer te komen werken.",
                    "Schrijf een passende aanhef en afsluiting."
                ],
                example: "Beste mevrouw Bakker,\n\nIk schrijf u om te laten weten dat ik vandaag helaas niet kan komen werken.\n\nIk voel me erg ziek en ik heb koorts (39 graden). Ik moet daarom thuis blijven om uit te rusten.\n\nIk hoop dat ik me over twee dagen weer beter voel en weer kan komen werken. Ik houd u op de hoogte.\n\nMet vriendelijke groet,\n[Jouw naam]"
            },
            {
                title: "Kapot apparaat melden",
                category: "Klachtenbericht",
                scenario: "U heeft vorige week een nieuwe koffiemachine gekocht in een winkel. Maar het apparaat is kapot. U schrijft een e-mail naar de winkel 'Elektronica Nu' om te klagen. Kijk naar het plaatje.",
                images: [
                    { src: "images/broken_coffee_machine.jpg" }
                ],
                bullets: [
                    "Schrijf op wat u heeft gekocht en wanneer u dat heeft gedaan.",
                    "Schrijf wat er precies mis is met het apparaat (kijk naar het plaatje).",
                    "Schrijf wat u wilt dat de winkel voor u doet.",
                    "Vraag om een snelle reactie."
                ],
                example: "Geachte medewerker van Elektronica Nu,\n\nVorige week dinsdag heb ik bij u een nieuwe koffiemachine gekocht. Helaas heb ik een klacht over dit apparaat.\n\nDe machine werkt niet goed: er lekt overal water uit het apparaat en hij maakt geen koffie. Het is erg vervelend.\n\nIk zou graag willen dat u de machine repareert of dat ik een nieuw apparaat van u krijg.\n\nIk hoor graag snel van u.\n\nMet vriendelijke groet,\n[Jouw naam]"
            },
            {
                title: "Verhuisbericht buren",
                category: "Bericht schrijven",
                scenario: "U gaat binnenkort verhuizen naar een nieuw huis. U schrijft een bericht aan uw buren om het hen te vertellen. Kijk naar het plaatje.",
                images: [
                    { src: "images/moving_boxes.jpg" }
                ],
                bullets: [
                    "Vertel dat u gaat verhuizen en vertel naar welke stad of straat (bedenk zelf).",
                    "Vertel waarom u gaat verhuizen (bedenk zelf een reden).",
                    "Nodig uw buren uit voor een afscheidsfeestje of vraag hen om hulp."
                ],
                example: "Hallo buren,\n\nIk heb een nieuwtje: ik ga volgende maand verhuizen! Ik ga in een groter huis wonen in de Kerkstraat in Amsterdam.\n\nIk verhuis omdat ik daar meer ruimte heb voor mijn gezin en werk. Ik ga jullie wel missen!\n\nZaterdag 20 mei geef ik een klein afscheidsfeestje in mijn tuin. Komen jullie ook een drankje doen?\n\nGroetjes,\n[Jouw naam]"
            }
        ];
        this.currentPicWritingIndex = 0;

        // Stats
        this.stats = { correct: 0, wrong: 0 };
        this.speakingStats = { correct: 0, wrong: 0 };
        this.quizStats = { correct: 0, wrong: 0 };
        this.spellingChecked = false;
        this.speakingChecked = false;
        this.quizChecked = false;
        this.vulinChecked = false;

        // KNS Quiz state
        this.knsQuiz = {
            topic: null,
            index: 0,
            score: 0,
            selected: null,
            isAnswered: false,
            isExam: false,
            data: []
        };
        this.knsDataSource = 'current'; // 'current' | 'oefenexamens' | 'exam'
        this.knsExamSets = null; // Pre-generated unique non-overlapping exam sets for Exam Test Mode

        // Speaking Exam state
        this.speakingExam = {
            mode: null,        // 'full' | 'topic'
            topic: null,       // topic name if mode='topic'
            index: 0,
            score: 0,
            maxScore: 0,
            isRecording: false,
            isAnswered: false,
            isStarted: false,
            transcript: '',
            selectedChoice: null,
            data: [],          // flat array of questions
            wrongQuestions: [],
            scores: [],        // per-question score tracking
            timerInterval: null,
            timerSeconds: 20
        };
        this.speakingExamRecognition = null;

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
        // Vinayak <-> Siddhi visual toggle
        this.vinayakSiddhiToggle = document.getElementById('vinayakSiddhiToggle');
        this.labelVinayak = document.getElementById('labelVinayak');
        this.labelSiddhi = document.getElementById('labelSiddhi');


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

        // DOM — KNS Quiz mode
        this.knsQuizSection = document.getElementById('knsQuizSection');
        this.knsTopicsContainer = document.getElementById('knsTopicsContainer');
        this.knsAccordion = document.getElementById('knsAccordion');
        this.knsPlayContainer = document.getElementById('knsPlayContainer');
        this.knsTopicTitle = document.getElementById('knsTopicTitle');
        this.knsBackToTopics = document.getElementById('knsBackToTopics');
        this.knsProgressDots = document.getElementById('knsProgressDots');
        this.knsQuestionText = document.getElementById('knsQuestionText');
        this.knsOptionsGrid = document.getElementById('knsOptionsGrid');
        this.knsSubmitBtn = document.getElementById('knsSubmitBtn');
        this.knsFeedback = document.getElementById('knsFeedback');
        this.knsFeedbackText = document.getElementById('knsFeedbackText');
        this.knsExplanationText = document.getElementById('knsExplanationText');
        this.knsNextBtn = document.getElementById('knsNextBtn');
        this.knsResultContainer = document.getElementById('knsResultContainer');
        this.knsResultScore = document.getElementById('knsResultScore');
        this.knsResultMsg = document.getElementById('knsResultMsg');
        this.knsRestartTopicBtn = document.getElementById('knsRestartTopicBtn');
        this.knsFinishBtn = document.getElementById('knsFinishBtn');
        this.knsScoreTracker = document.getElementById('knsScoreTracker');
        this.knsScoreFill = document.getElementById('knsScoreFill');
        this.knsScoreCount = document.getElementById('knsScoreCount');
        this.knsScorePct = document.getElementById('knsScorePct');
        this.knsScoreStatus = document.getElementById('knsScoreStatus');
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

        // DOM — Derde Ronde mode
        this.modeDerdeRonde = document.getElementById('modeDerdeRonde');
        this.derdeRondeSection = document.getElementById('derdeRondeSection');
        this.drChapterLabel = document.getElementById('drChapterLabel');
        this.drSentence = document.getElementById('drSentence');
        this.drHintBtn = document.getElementById('drHintBtn');
        this.drHintText = document.getElementById('drHintText');
        this.drAnswerInput = document.getElementById('drAnswerInput');
        this.drCheckBtn = document.getElementById('drCheckBtn');
        this.drFeedback = document.getElementById('drFeedback');
        this.drFeedbackIcon = document.getElementById('drFeedbackIcon');
        this.drFeedbackMessage = document.getElementById('drFeedbackMessage');
        this.drCorrectAnswer = document.getElementById('drCorrectAnswer');
        this.drChapterButtons = document.getElementById('drChapterButtons');
        this.drPrevBtn = document.getElementById('drPrevBtn');
        this.drNextBtn = document.getElementById('drNextBtn');
        this.drShuffleBtn = document.getElementById('drShuffleBtn');
        this.drStatCorrect = document.getElementById('drStatCorrect');
        this.drStatWrong = document.getElementById('drStatWrong');
        this.drStatAccuracy = document.getElementById('drStatAccuracy');
        this.speakBtnDrSentence = document.getElementById('speakBtnDrSentence');
        this.drAnswersContainer = document.getElementById('drAnswersContainer');
        this.drInputRow = document.getElementById('drInputRow');
        this.drStats = { correct: 0, wrong: 0 };
        this.drCurrentChapter = 'chapter_8';
        this.drExercises = [];
        this.drCurrentIndex = 0;
        this.drChecked = false;
        this.drHintShown = false;
        this.drAnswerInputs = [];

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
        // New writing grammar elements
        this.writingSubmitBtn = document.getElementById('writingSubmitBtn');
        this.writingLoading = document.getElementById('writingLoading');
        this.writingGrammarFeedbackPanel = document.getElementById('writingGrammarFeedbackPanel');
        this.writingGrammarFeedbackTitle = document.getElementById('writingGrammarFeedbackTitle');
        this.writingGrammarErrorBadges = document.getElementById('writingGrammarErrorBadges');
        this.writingGrammarErrorsList = document.getElementById('writingGrammarErrorsList');
        this.writingRetryBtn = document.getElementById('writingRetryBtn');

        // DOM — pic write mode
        this.modePicWrite = document.getElementById('modePicWrite');
        this.picWritingSection = document.getElementById('picWritingSection');
        this.picWritingCategory = document.getElementById('picWritingCategory');
        this.picWritingTitle = document.getElementById('picWritingTitle');
        this.picWritingScenario = document.getElementById('picWritingScenario');
        this.picImagesGrid = document.getElementById('picImagesGrid');
        this.picWritingBullets = document.getElementById('picWritingBullets');
        this.picWritingTextarea = document.getElementById('picWritingTextarea');
        this.picWritingSubmitBtn = document.getElementById('picWritingSubmitBtn');
        this.picWritingLoading = document.getElementById('picWritingLoading');
        this.grammarFeedbackPanel = document.getElementById('grammarFeedbackPanel');
        this.grammarFeedbackTitle = document.getElementById('grammarFeedbackTitle');
        this.grammarErrorBadges = document.getElementById('grammarErrorBadges');
        this.grammarErrorsList = document.getElementById('grammarErrorsList');
        this.picWritingRetryBtn = document.getElementById('picWritingRetryBtn');
        this.picWritingExampleBox = document.getElementById('picWritingExampleBox');
        this.picWritingExampleText = document.getElementById('picWritingExampleText');
        this.picWritingPrevBtn = document.getElementById('picWritingPrevBtn');
        this.picWritingNextBtn = document.getElementById('picWritingNextBtn');

        // DOM — mode toggle
        this.modeFlashcard = document.getElementById('modeFlashcard');
        this.modeSpelling = document.getElementById('modeSpelling');
        this.modeKnsQuiz = document.getElementById('modeKnsQuiz');

        // DOM — speaking exam mode
        this.modeSpeakingExam = document.getElementById('modeSpeakingExam');
        this.speakingExamSection = document.getElementById('speakingExamSection');
        this.seTopicsContainer = document.getElementById('seTopicsContainer');
        this.seAccordion = document.getElementById('seAccordion');
        this.seStartFullExamBtn = document.getElementById('seStartFullExamBtn');
        this.sePlayContainer = document.getElementById('sePlayContainer');
        this.seTopicBadge = document.getElementById('seTopicBadge');
        this.seBackToTopics = document.getElementById('seBackToTopics');
        this.seTimer = document.getElementById('seTimer');
        this.seTimerCircle = document.getElementById('seTimerCircle');
        this.seTimerText = document.getElementById('seTimerText');
        this.seProgressDots = document.getElementById('seProgressDots');
        this.seScoreTracker = document.getElementById('seScoreTracker');
        this.seScoreFill = document.getElementById('seScoreFill');
        this.seScoreCount = document.getElementById('seScoreCount');
        this.seScorePct = document.getElementById('seScorePct');
        this.sePromptText = document.getElementById('sePromptText');
        this.seReplayPromptBtn = document.getElementById('seReplayPromptBtn');
        this.seImagesGrid = document.getElementById('seImagesGrid');
        this.seChoicePrompt = document.getElementById('seChoicePrompt');
        this.seChoiceGrid = document.getElementById('seChoiceGrid');
        this.seMicBtn = document.getElementById('seMicBtn');
        this.sePulseRing = document.getElementById('sePulseRing');
        this.seStatusText = document.getElementById('seStatusText');
        this.seLiveTranscript = document.getElementById('seLiveTranscript');
        this.seFeedback = document.getElementById('seFeedback');
        this.seFeedbackScore = document.getElementById('seFeedbackScore');
        this.seFeedbackKeywords = document.getElementById('seFeedbackKeywords');
        this.seFeedbackModel = document.getElementById('seFeedbackModel');
        this.seModelText = document.getElementById('seModelText');
        this.seListenModelBtn = document.getElementById('seListenModelBtn');
        this.seNextBtn = document.getElementById('seNextBtn');
        this.seResultContainer = document.getElementById('seResultContainer');
        this.seResultRing = document.getElementById('seResultRing');
        this.seResultPct = document.getElementById('seResultPct');
        this.seResultMsg = document.getElementById('seResultMsg');
        this.seResultBreakdown = document.getElementById('seResultBreakdown');
        this.seResultWeak = document.getElementById('seResultWeak');
        this.seWeakList = document.getElementById('seWeakList');
        this.seRestartBtn = document.getElementById('seRestartBtn');
        this.seFinishBtn = document.getElementById('seFinishBtn');


        this.init();
    }

    init() {
        this.initSpeakingRecognition();
        this.initSpeakingExamRecognition();

        // ---- Domain Toggle (Top Bar) ----
        this.domainMedical.addEventListener('click', () => this.switchDomain('medical'));
        this.domainGeneral.addEventListener('click', () => this.switchDomain('general'));

        // ---- Vinayak / Siddhi visual toggle ----
        if (this.vinayakSiddhiToggle) {
            // checked -> Siddhi (medical), unchecked -> Vinayak (general)
            this.vinayakSiddhiToggle.addEventListener('change', () => {
                const domain = this.vinayakSiddhiToggle.checked ? 'medical' : 'general';
                this.switchDomain(domain);
            });
            // initialize state to match current domain
            this.vinayakSiddhiToggle.checked = (this.domain === 'medical');
        }

        // ---- Mode toggle ----

        this.modeFlashcard.addEventListener('click', () => this.switchMode('flashcard'));
        this.modeSpelling.addEventListener('click', () => this.switchMode('spelling'));
        this.modeSpeaking.addEventListener('click', () => this.switchMode('speaking'));
        this.modeQuiz.addEventListener('click', () => this.switchMode('quiz'));
        this.modeVulIn.addEventListener('click', () => this.switchMode('vulin'));
        this.modeWriting.addEventListener('click', () => this.switchMode('writing'));
        this.modePicWrite.addEventListener('click', () => this.switchMode('picwriting'));
        this.modeKnsQuiz.addEventListener('click', () => this.switchMode('knsquiz'));

        // ---- KNS Quiz events ----
        this.knsBackToTopics.addEventListener('click', () => {
            this.clearExamTimer();
            this.hideExamTimer();
            this.knsQuiz.isExam = false;
            this.knsPlayContainer.classList.add('hidden');
            if (this.knsDataSource === 'examTest') {
                this.knsDataSource = 'exam';
                this.knsTopicsContainer.classList.remove('hidden');
                this.initKnsTopics();
            } else {
                this.knsTopicsContainer.classList.remove('hidden');
            }
        });

        this.knsSubmitBtn.addEventListener('click', () => this.submitKnsAnswer());
        this.knsNextBtn.addEventListener('click', () => this.nextKnsQuestion());
        this.knsRestartTopicBtn.addEventListener('click', () => {
            if (this.knsDataSource === 'examTest') {
                this.startKnsExamTest(this.knsQuiz.examNumber);
            } else if (this.knsQuiz.isExam) {
                this.startKnsExam(this.knsQuiz.examNumber);
            } else {
                this.startKnsTopic(this.knsQuiz.topic);
            }
        });
        this.knsFinishBtn.addEventListener('click', () => {
            this.clearExamTimer();
            this.hideExamTimer();
            this.knsQuiz.isExam = false;
            this.knsResultContainer.classList.add('hidden');
            if (this.knsDataSource === 'examTest') {
                this.knsDataSource = 'exam';
                this.knsTopicsContainer.classList.remove('hidden');
                this.initKnsTopics();
            } else {
                this.knsTopicsContainer.classList.remove('hidden');
            }
        });

        // ---- Speaking Exam events ----
        this.modeSpeakingExam.addEventListener('click', () => this.switchMode('speakingexam'));
        this.modeDerdeRonde.addEventListener('click', () => this.switchMode('derderonde'));
        this.seStartFullExamBtn.addEventListener('click', () => this.startSpeakingExam('full'));
        this.seBackToTopics.addEventListener('click', () => this.showSpeakingExamTopics());
        this.seMicBtn.addEventListener('click', () => this.toggleSpeakingExamRecording());
        this.seReplayPromptBtn.addEventListener('click', () => this.speakExamPrompt());
        this.seNextBtn.addEventListener('click', () => this.nextSpeakingExamQuestion());
        this.seRestartBtn.addEventListener('click', () => {
            if (this.speakingExam.topic) {
                this.startSpeakingExam('topic', this.speakingExam.topic);
            } else {
                this.startSpeakingExam('full');
            }
        });
        this.seFinishBtn.addEventListener('click', () => this.showSpeakingExamTopics());
        this.seListenModelBtn.addEventListener('click', () => this.speakModelAnswer());

        // ---- Pic Write mode events ----
        this.picWritingNextBtn.addEventListener('click', () => {
            this.currentPicWritingIndex = (this.currentPicWritingIndex + 1) % this.picWritingPrompts.length;
            this.resetPicWriting();
            this.updateCard();
        });
        this.picWritingPrevBtn.addEventListener('click', () => {
            this.currentPicWritingIndex = this.currentPicWritingIndex > 0
                ? this.currentPicWritingIndex - 1
                : this.picWritingPrompts.length - 1;
            this.resetPicWriting();
            this.updateCard();
        });
        this.picWritingSubmitBtn.addEventListener('click', () => this.submitPicWriting());
        this.picWritingRetryBtn.addEventListener('click', () => {
            this.picWritingTextarea.disabled = false;
            this.picWritingTextarea.focus();
            this.grammarFeedbackPanel.classList.add('hidden');
            this.picWritingExampleBox.classList.add('hidden');
            this.picWritingSubmitBtn.disabled = false;
        });

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

        // ---- Derde Ronde mode events ----
        this.drNextBtn.addEventListener('click', () => this.drNextExercise());
        this.drPrevBtn.addEventListener('click', () => this.drPrevExercise());
        this.drShuffleBtn.addEventListener('click', () => this.drShuffleExercises());
        this.drCheckBtn.addEventListener('click', () => this.checkDrAnswer());
        this.drAnswerInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.checkDrAnswer();
        });
        this.drHintBtn.addEventListener('click', () => {
            this.drHintShown = !this.drHintShown;
            this.drHintText.classList.toggle('hidden', !this.drHintShown);
            this.drHintBtn.textContent = this.drHintShown ? '🙈 Hide hint' : '💡 Show hint';
        });
        this.speakBtnDrSentence.addEventListener('click', () => this.speakDrSentence());

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

        // Writing submit events
        this.writingSubmitBtn.addEventListener('click', () => this.submitWriting());
        this.writingRetryBtn.addEventListener('click', () => {
            this.writingTextarea.disabled = false;
            this.writingTextarea.focus();
            this.writingGrammarFeedbackPanel.classList.add('hidden');
            this.writingExampleBox.classList.add('hidden');
            this.writingSubmitBtn.disabled = false;
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
        this.modePicWrite.classList.toggle('active', newMode === 'picwriting');
        this.modeKnsQuiz.classList.toggle('active', newMode === 'knsquiz');
        this.modeSpeakingExam.classList.toggle('active', newMode === 'speakingexam');

        this.flashcardSection.classList.toggle('hidden', newMode !== 'flashcard');
        this.spellingSection.classList.toggle('hidden', newMode !== 'spelling');
        this.speakingSection.classList.toggle('hidden', newMode !== 'speaking');
        this.quizSection.classList.toggle('hidden', newMode !== 'quiz');
        this.vulinSection.classList.toggle('hidden', newMode !== 'vulin');
        this.writingSection.classList.toggle('hidden', newMode !== 'writing');
        this.picWritingSection.classList.toggle('hidden', newMode !== 'picwriting');
        this.knsQuizSection.classList.toggle('hidden', newMode !== 'knsquiz');
        this.speakingExamSection.classList.toggle('hidden', newMode !== 'speakingexam');
        this.derdeRondeSection.classList.toggle('hidden', newMode !== 'derderonde');

        if (newMode === 'knsquiz') {
            this.initKnsTopics();
        }

        if (newMode === 'speakingexam') {
            this.initSpeakingExamTopics();
        }

        if (newMode === 'derderonde') {
            this.initDerdeRonde();
        }

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

        // Swap Vinayak/Siddhi label order & boldness
        if (this.labelVinayak && this.labelSiddhi) {
            const parent = this.labelVinayak.parentNode;
            if (newDomain === 'medical') {
                // Siddhi on top, bold
                parent.insertBefore(this.labelSiddhi, this.labelVinayak);
                this.labelSiddhi.style.cssText = 'font-weight:700;font-size:0.85rem;';
                this.labelVinayak.style.cssText = 'font-size:0.75rem;';
            } else {
                // Vinayak on top, bold
                parent.insertBefore(this.labelVinayak, this.labelSiddhi);
                this.labelVinayak.style.cssText = 'font-weight:700;font-size:0.85rem;';
                this.labelSiddhi.style.cssText = 'font-size:0.75rem;';
            }
        }
        // Sync visual toggle checkbox
        if (this.vinayakSiddhiToggle) {
            this.vinayakSiddhiToggle.checked = (newDomain === 'medical');
        }

        // Show Pic Write, KNS Quiz, and Speaking Exam buttons only for General domain
        this.modePicWrite.style.display = (newDomain === 'general') ? '' : 'none';
        this.modeKnsQuiz.style.display = (newDomain === 'general') ? '' : 'none';
        this.modeSpeakingExam.style.display = (newDomain === 'general') ? '' : 'none';
        // Derde Ronde is Medical-only
        this.modeDerdeRonde.style.display = (newDomain === 'medical') ? '' : 'none';

        // If switching away from General while in specialized modes, fall back to writing or flashcard
        if (newDomain === 'medical') {
            if (this.mode === 'picwriting') {
                this.switchMode('writing');
                return;
            }
            if (this.mode === 'knsquiz') {
                this.switchMode('flashcard');
                return;
            }
            if (this.mode === 'speakingexam') {
                this.switchMode('flashcard');
                return;
            }
        }

        // If switching away from Medical while in Derde Ronde, fall back to flashcard
        if (newDomain === 'general') {
            if (this.mode === 'derderonde') {
                this.switchMode('flashcard');
                return;
            }
        }

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
            this.writingTextarea.disabled = false;
            this.writingSubmitBtn.disabled = false;
            this.writingLoading.classList.add('hidden');
            this.writingGrammarFeedbackPanel.classList.add('hidden');
            this.writingExampleBox.classList.add('hidden');
            this.writingShowExampleBtn.textContent = 'Show Example Answer';
            return;
        }

        if (this.mode === 'picwriting') {
            const p = this.picWritingPrompts[this.currentPicWritingIndex];
            this.picWritingCategory.textContent = p.category;
            this.picWritingTitle.textContent = p.title;
            this.picWritingScenario.textContent = p.scenario;
            this.picWritingBullets.innerHTML = p.bullets.map(b => `<li>${b}</li>`).join('');
            this.picWritingExampleText.textContent = p.example;

            // Build image grid - labels removed as per request
            this.picImagesGrid.innerHTML = p.images.map(img => `
                <div class="pic-image-card">
                    <img src="${img.src}" alt="Taak afbeelding"
                        onerror="this.style.display='none'">
                </div>`).join('');
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

    // ============================================================
    //  DERDE RONDE MODE
    // ============================================================
    initDerdeRonde() {
        // Build chapter buttons in numerical order
        this.drChapterButtons.innerHTML = '';
        const chapters = Object.keys(derdeRondeVulinData).sort((a, b) => {
            const na = parseInt(a.split('_')[1]);
            const nb = parseInt(b.split('_')[1]);
            return na - nb;
        });
        chapters.forEach(chKey => {
            const ch = derdeRondeVulinData[chKey];
            const btn = document.createElement('button');
            btn.className = 'dr-chapter-btn';
            btn.textContent = ch.title;
            btn.dataset.chapter = chKey;
            btn.addEventListener('click', () => {
                this.drCurrentChapter = chKey;
                this.drCurrentIndex = 0;
                this.drExercises = [...ch.exercises];
                this.drStats = { correct: 0, wrong: 0 };
                this.updateDrChapterButtons();
                this.drLoadExercise();
                this.updateDrStats();
            });
            this.drChapterButtons.appendChild(btn);
        });

        // Load first chapter
        this.drCurrentChapter = chapters[0];
        const firstCh = derdeRondeVulinData[this.drCurrentChapter];
        this.drExercises = [...firstCh.exercises];
        this.drCurrentIndex = 0;
        this.drStats = { correct: 0, wrong: 0 };
        this.updateDrChapterButtons();
        this.drLoadExercise();
        this.updateDrStats();
    }

    updateDrChapterButtons() {
        this.drChapterButtons.querySelectorAll('.dr-chapter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.chapter === this.drCurrentChapter);
        });
        const ch = derdeRondeVulinData[this.drCurrentChapter];
        this.drChapterLabel.textContent = ch ? `${ch.title} — Derde Ronde` : 'Derde Ronde';
    }

    drLoadExercise() {
        if (this.drExercises.length === 0) return;
        const ex = this.drExercises[this.drCurrentIndex];
        const hints = Array.isArray(ex.hints) ? ex.hints : ex.hint ? [ex.hint] : [];

        // Show blanked paragraph or sentence
        this.drSentence.textContent = ex.blanked || ex.sentence || '';

        // Reset state
        this.drAnswerInput.value = '';
        this.drAnswerInput.className = 'dr-answer-input';
        this.drAnswerInput.disabled = false;
        this.drAnswerInputs = [];
        this.drAnswersContainer.innerHTML = '';
        this.drChecked = false;
        this.drHintShown = false;
        this.drHintText.classList.add('hidden');
        this.drHintText.textContent = hints.length > 0 ? hints.map((hint, index) => hints.length > 1 ? `${index + 1}. ${hint}` : hint).join(' ') : '(No hint available)';
        this.drHintBtn.textContent = '💡 Show hint';
        this.drFeedback.classList.add('hidden');
        this.drCorrectAnswer.classList.add('hidden');
        this.drCheckBtn.disabled = false;

        if (Array.isArray(ex.answers) && ex.answers.length > 1) {
            this.drInputRow.classList.add('hidden');
            this.drAnswersContainer.classList.remove('hidden');

            ex.answers.forEach((_, index) => {
                const item = document.createElement('div');
                item.className = 'dr-answer-item';
                const label = document.createElement('label');
                label.htmlFor = `drAnswerInput${index}`;
                label.textContent = `Woord ${index + 1}`;
                const input = document.createElement('input');
                input.type = 'text';
                input.id = `drAnswerInput${index}`;
                input.className = 'dr-answer-input';
                input.dataset.index = index;
                input.placeholder = `Typ woord ${index + 1}...`;
                input.autocomplete = 'off';
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        this.checkDrAnswer();
                    }
                });
                item.appendChild(label);
                item.appendChild(input);
                this.drAnswersContainer.appendChild(item);
                this.drAnswerInputs.push(input);
            });

            this.drAnswersContainer.firstElementChild?.querySelector('input')?.focus();
            this.drAnswerInput.disabled = true;
        } else {
            this.drInputRow.classList.remove('hidden');
            this.drAnswersContainer.classList.add('hidden');
            this.drAnswerInput.focus();
        }
    }

    checkDrAnswer() {
        if (this.drChecked || this.drExercises.length === 0) return;
        const ex = this.drExercises[this.drCurrentIndex];
        const normalize = s => s.toLowerCase().replace(/\s+/g, ' ').trim();
        const expected = Array.isArray(ex.answers) ? ex.answers : [ex.answer];
        const userAnswers = Array.isArray(ex.answers) && ex.answers.length > 1
            ? this.drAnswerInputs.map(input => input.value.trim())
            : [this.drAnswerInput.value.trim()];

        if (userAnswers.every(answer => normalize(answer) === '')) return;

        this.drChecked = true;
        this.drCheckBtn.disabled = true;

        if (Array.isArray(ex.answers) && ex.answers.length > 1) {
            this.drAnswerInputs.forEach(input => {
                input.disabled = true;
                input.classList.remove('correct-input', 'wrong-input');
            });
        } else {
            this.drAnswerInput.disabled = true;
            this.drAnswerInput.classList.remove('correct-input', 'wrong-input');
        }

        const results = expected.map((answer, index) => normalize(userAnswers[index] || '') === normalize(answer || ''));
        const isCorrect = results.every(Boolean);

        if (Array.isArray(ex.answers) && ex.answers.length > 1) {
            this.drAnswerInputs.forEach((input, index) => {
                input.classList.add(results[index] ? 'correct-input' : 'wrong-input');
            });
        } else {
            this.drAnswerInput.classList.add(isCorrect ? 'correct-input' : 'wrong-input');
        }

        this.drFeedback.classList.remove('hidden');
        if (isCorrect) {
            this.drStats.correct++;
            this.drFeedback.className = 'spelling-feedback feedback-correct';
            this.drFeedbackIcon.innerHTML = '✅';
            this.drFeedbackMessage.textContent = 'Correct! Goed gedaan!';
        } else {
            this.drStats.wrong++;
            this.drFeedback.className = 'spelling-feedback feedback-wrong';
            this.drFeedbackIcon.innerHTML = '❌';
            this.drFeedbackMessage.textContent = 'Incorrect!';
            const wrongAnswers = expected
                .map((answer, index) => results[index] ? null : `#${index + 1} = ${answer}`)
                .filter(Boolean);
            this.drCorrectAnswer.textContent = `Answer${wrongAnswers.length > 1 ? 's' : ''}: ${wrongAnswers.join(', ')}`;
            this.drCorrectAnswer.classList.remove('hidden');
        }

        this.updateDrStats();
    }

    drNextExercise() {
        if (this.drExercises.length === 0) return;
        this.drCurrentIndex = (this.drCurrentIndex + 1) % this.drExercises.length;
        this.drLoadExercise();
    }

    drPrevExercise() {
        if (this.drExercises.length === 0) return;
        this.drCurrentIndex = this.drCurrentIndex > 0 ? this.drCurrentIndex - 1 : this.drExercises.length - 1;
        this.drLoadExercise();
    }

    drShuffleExercises() {
        if (this.drExercises.length === 0) return;
        for (let i = this.drExercises.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.drExercises[i], this.drExercises[j]] = [this.drExercises[j], this.drExercises[i]];
        }
        this.drCurrentIndex = 0;
        this.drLoadExercise();
    }

    updateDrStats() {
        const total = this.drStats.correct + this.drStats.wrong;
        this.drStatCorrect.textContent = this.drStats.correct;
        this.drStatWrong.textContent = this.drStats.wrong;
        this.drStatAccuracy.textContent = total > 0
            ? `${Math.round((this.drStats.correct / total) * 100)}%` : '–';
    }

    speakDrSentence() {
        if (this.drExercises.length === 0 || !('speechSynthesis' in window)) return;
        const ex = this.drExercises[this.drCurrentIndex];
        if (!ex) return;
        window.speechSynthesis.cancel();
        // Speak the original sentence (not blanked)
        const utterance = new SpeechSynthesisUtterance(ex.sentence);
        utterance.lang = 'nl-NL';
        const voices = window.speechSynthesis.getVoices();
        const nlVoice = voices.find(v => v.lang.startsWith('nl'));
        if (nlVoice) utterance.voice = nlVoice;
        window.speechSynthesis.speak(utterance);
    }

    // ============================================================
    //  PIC WRITE MODE
    // ============================================================
    resetPicWriting() {
        this.picWritingTextarea.value = '';
        this.picWritingTextarea.disabled = false;
        this.picWritingSubmitBtn.disabled = false;
        this.picWritingLoading.classList.add('hidden');
        this.grammarFeedbackPanel.classList.add('hidden');
        this.picWritingExampleBox.classList.add('hidden');
    }
    async submitWriting() {
        const text = this.writingTextarea.value.trim();
        if (!text) { this.writingTextarea.focus(); return; }

        const prompt = this.writingPrompts[this.currentWritingIndex];
        this.writingSubmitBtn.disabled = true;
        this.writingTextarea.disabled = true;
        this.writingLoading.classList.remove('hidden');
        this.writingGrammarFeedbackPanel.classList.add('hidden');
        this.writingExampleBox.classList.add('hidden');

        // Run LanguageTool + AI feedback in parallel
        const [ltResult, aiResult] = await Promise.allSettled([
            fetch('https://api.languagetool.org/v2/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ text, language: 'nl', enabledOnly: 'false' })
            }).then(r => r.ok ? r.json() : Promise.reject(new Error('LT error'))),
            fetch('/api/writing-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userAnswer: text,
                    prompt: prompt.prompt,
                    bullets: prompt.bullets,
                    example: prompt.example
                })
            }).then(r => r.ok ? r.json() : Promise.reject(new Error('AI error')))
        ]);

        this.writingLoading.classList.add('hidden');

        const ltMatches = ltResult.status === 'fulfilled' ? ltResult.value.matches : [];
        const ltError = ltResult.status === 'rejected';
        const aiFeedback = aiResult.status === 'fulfilled' ? aiResult.value : null;

        this.displayWritingFeedback(ltMatches, aiFeedback, text, ltError);
        this.writingExampleBox.classList.remove('hidden');
        this.writingExampleBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    async submitPicWriting() {
        const text = this.picWritingTextarea.value.trim();
        if (!text) { this.picWritingTextarea.focus(); return; }

        this.picWritingSubmitBtn.disabled = true;
        this.picWritingTextarea.disabled = true;
        this.picWritingLoading.classList.remove('hidden');
        this.grammarFeedbackPanel.classList.add('hidden');
        this.picWritingExampleBox.classList.add('hidden');

        try {
            const res = await fetch('https://api.languagetool.org/v2/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ text, language: 'nl', enabledOnly: 'false' })
            });
            if (!res.ok) throw new Error('API error');
            const data = await res.json();
            this.displayGrammarFeedbackGeneric(data.matches, text, false, 'pic');
        } catch (e) {
            this.displayGrammarFeedbackGeneric([], text, true, 'pic');
        } finally {
            this.picWritingLoading.classList.add('hidden');
        }

        // Always reveal example answer after submit
        this.picWritingExampleBox.classList.remove('hidden');
        this.picWritingExampleBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    displayGrammarFeedbackGeneric(matches, text, apiError, mode) {
        const panel = mode === 'writing' ? this.writingGrammarFeedbackPanel : this.grammarFeedbackPanel;
        const title = mode === 'writing' ? this.writingGrammarFeedbackTitle : this.grammarFeedbackTitle;
        const badgesEl = mode === 'writing' ? this.writingGrammarErrorBadges : this.grammarErrorBadges;
        const errorsList = mode === 'writing' ? this.writingGrammarErrorsList : this.grammarErrorsList;

        panel.classList.remove('hidden');

        const isSpelling = m => m.rule?.issueType === 'misspelling' ||
            (m.rule?.category?.id || '').toUpperCase().includes('SPELL');
        const spellingErrors = matches.filter(isSpelling);
        const grammarErrors  = matches.filter(m => !isSpelling(m));

        // Badges
        let badges = '';
        if (!apiError && matches.length === 0) {
            title.textContent = '🎉 Uitstekend werk!';
            badges = '<span class="grammar-badge no-errors-badge">✅ Geen fouten gevonden!</span>';
        } else {
            title.textContent = '📝 Taalfeedback';
            if (spellingErrors.length)
                badges += `<span class="grammar-badge spelling-badge">🔴 ${spellingErrors.length} spellingfout${spellingErrors.length > 1 ? 'en' : ''}</span>`;
            if (grammarErrors.length)
                badges += `<span class="grammar-badge grammar-badge-orange">🟠 ${grammarErrors.length} grammaticafout${grammarErrors.length > 1 ? 'en' : ''}</span>`;
        }
        badgesEl.innerHTML = badges;

        // Error list
        if (apiError) {
            errorsList.innerHTML =
                '<p class="grammar-api-error">⚠️ Kan nu niet controleren (netwerk). Bekijk het voorbeeldantwoord hieronder.</p>';
            return;
        }
        if (matches.length === 0) {
            errorsList.innerHTML =
                '<p class="grammar-no-errors">Geweldig! Uw tekst heeft geen fouten. Bekijk het voorbeeldantwoord hieronder.</p>';
            return;
        }

        errorsList.innerHTML = matches.slice(0, 10).map(m => {
            const wrong = text.substring(m.offset, m.offset + m.length);
            const suggestion = m.replacements?.[0]?.value || '—';
            const spell = isSpelling(m);
            return `<div class="grammar-error-item ${spell ? 'error-spelling' : 'error-grammar'}">
                <span class="grammar-error-tag">${spell ? '🔴 Spelling' : '🟠 Grammatica'}</span>
                <div class="grammar-error-body">
                    <span class="grammar-error-word">"${wrong}"</span>
                    ${suggestion !== '—' ? `<span class="grammar-suggestion">→ Suggestie: "${suggestion}"</span>` : ''}
                    <span class="grammar-error-msg">${m.message || ''}</span>
                </div>
            </div>`;
        }).join('');
    }

    displayWritingFeedback(ltMatches, aiFeedback, text, ltError) {
        const panel = this.writingGrammarFeedbackPanel;
        const title = this.writingGrammarFeedbackTitle;
        const badgesEl = this.writingGrammarErrorBadges;
        const errorsList = this.writingGrammarErrorsList;

        panel.classList.remove('hidden');

        // ---- Build badges row ----
        const isSpelling = m => m.rule?.issueType === 'misspelling' ||
            (m.rule?.category?.id || '').toUpperCase().includes('SPELL');
        const ltSpelling = ltMatches.filter(isSpelling);
        const ltGrammar = ltMatches.filter(m => !isSpelling(m));

        let badges = '';
        const totalErrors = ltMatches.length + (aiFeedback?.spellingErrors?.length || 0) + (aiFeedback?.grammarErrors?.length || 0);

        if (!ltError && totalErrors === 0) {
            title.textContent = '🎉 Uitstekend werk!';
            badges = '<span class="grammar-badge no-errors-badge">✅ Geen fouten gevonden!</span>';
        } else {
            title.textContent = '📝 Taalfeedback';
            if (ltSpelling.length)
                badges += `<span class="grammar-badge spelling-badge">🔴 ${ltSpelling.length} spellingfout${ltSpelling.length > 1 ? 'en' : ''}</span>`;
            if (ltGrammar.length)
                badges += `<span class="grammar-badge grammar-badge-orange">🟠 ${ltGrammar.length} grammaticafout${ltGrammar.length > 1 ? 'en' : ''}</span>`;
            if (aiFeedback?.overallScore)
                badges += `<span class="grammar-badge score-badge">⭐ ${aiFeedback.overallScore}/10</span>`;
            if (aiFeedback?.levelAssessment)
                badges += `<span class="grammar-badge level-badge">📊 ${aiFeedback.levelAssessment}</span>`;
        }
        badgesEl.innerHTML = badges;

        // ---- Build full feedback HTML ----
        let html = '';

        // LanguageTool errors
        if (ltError) {
            html += '<p class="grammar-api-error">⚠️ LanguageTool niet beschikbaar. AI-feedback hieronder.</p>';
        } else if (ltMatches.length === 0 && !aiFeedback) {
            html += '<p class="grammar-no-errors">Geweldig! Uw tekst heeft geen fouten. Bekijk het voorbeeldantwoord hieronder.</p>';
            errorsList.innerHTML = html;
            return;
        } else if (ltMatches.length > 0) {
            html += '<div class="feedback-section"><h4>🔍 Spelling & Grammatica (LanguageTool)</h4>';
            html += ltMatches.slice(0, 8).map(m => {
                const wrong = text.substring(m.offset, m.offset + m.length);
                const suggestion = m.replacements?.[0]?.value || '—';
                const spell = isSpelling(m);
                return `<div class="grammar-error-item ${spell ? 'error-spelling' : 'error-grammar'}">
                    <span class="grammar-error-tag">${spell ? '🔴 Spelling' : '🟠 Grammatica'}</span>
                    <div class="grammar-error-body">
                        <span class="grammar-error-word">"${wrong}"</span>
                        ${suggestion !== '—' ? `<span class="grammar-suggestion">→ "${suggestion}"</span>` : ''}
                        <span class="grammar-error-msg">${m.message || ''}</span>
                    </div>
                </div>`;
            }).join('');
            html += '</div>';
        }

        // AI Content Feedback
        if (aiFeedback) {
            // Bullet coverage
            if (aiFeedback.bulletCoverage && aiFeedback.bulletCoverage.length > 0) {
                html += '<div class="feedback-section"><h4>📋 Heeft u alle punten beantwoord?</h4>';
                html += aiFeedback.bulletCoverage.map(b => {
                    const icon = b.covered ? '✅' : '❌';
                    return `<div class="grammar-error-item ${b.covered ? 'error-spelling' : 'error-grammar'}" style="border-left-color: ${b.covered ? 'var(--success)' : 'var(--danger)'}">
                        <span class="grammar-error-tag">${icon}</span>
                        <div class="grammar-error-body">
                            <span class="grammar-error-word">${b.bullet}</span>
                            ${b.comment ? `<span class="grammar-error-msg">${b.comment}</span>` : ''}
                        </div>
                    </div>`;
                }).join('');
                html += '</div>';
            }

            // AI-detected spelling
            if (aiFeedback.spellingErrors && aiFeedback.spellingErrors.length > 0) {
                html += '<div class="feedback-section"><h4>🔤 AI Spelling Suggesties</h4>';
                html += aiFeedback.spellingErrors.map(e =>
                    `<div class="grammar-error-item error-spelling">
                        <span class="grammar-error-tag">🔴 Spelling</span>
                        <div class="grammar-error-body">
                            <span class="grammar-error-word">"${e.word}"</span>
                            ${e.suggestion ? `<span class="grammar-suggestion">→ "${e.suggestion}"</span>` : ''}
                            ${e.comment ? `<span class="grammar-error-msg">${e.comment}</span>` : ''}
                        </div>
                    </div>`
                ).join('');
                html += '</div>';
            }

            // AI-detected grammar
            if (aiFeedback.grammarErrors && aiFeedback.grammarErrors.length > 0) {
                html += '<div class="feedback-section"><h4>📝 AI Grammatica Suggesties</h4>';
                html += aiFeedback.grammarErrors.map(e =>
                    `<div class="grammar-error-item error-grammar">
                        <span class="grammar-error-tag">🟠 Grammatica</span>
                        <div class="grammar-error-body">
                            <span class="grammar-error-word">"${e.error}"</span>
                            ${e.suggestion ? `<span class="grammar-suggestion">→ "${e.suggestion}"</span>` : ''}
                            ${e.comment ? `<span class="grammar-error-msg">${e.comment}</span>` : ''}
                        </div>
                    </div>`
                ).join('');
                html += '</div>';
            }

            // Strengths & Improvements
            html += '<div class="feedback-section">';
            if (aiFeedback.strengths) {
                html += `<div class="feedback-strength"><strong>💪 Wat ging goed:</strong> ${aiFeedback.strengths}</div>`;
            }
            if (aiFeedback.improvements) {
                html += `<div class="feedback-improve"><strong>📈 Wat kan beter:</strong> ${aiFeedback.improvements}</div>`;
            }
            if (aiFeedback.correctedAnswer) {
                html += `<div class="feedback-corrected"><strong>✏️ Gecorrigeerd antwoord (A2):</strong><br><em>${aiFeedback.correctedAnswer}</em></div>`;
            }
            html += '</div>';
        }

        errorsList.innerHTML = html || '<p class="grammar-no-errors">Geweldig! Uw tekst heeft geen fouten. Bekijk het voorbeeldantwoord hieronder.</p>';
    }

    // ============================================================
    //  KNS QUIZ METHODS
    // ============================================================
    initKnsTopics() {
        this.knsAccordion.innerHTML = '';

        // Build toggle bar
        const toggleBar = document.createElement('div');
        toggleBar.className = 'kns-source-toggle';
        toggleBar.innerHTML = `
            <button class="kns-source-btn ${this.knsDataSource === 'current' ? 'active' : ''}" data-source="current">
                📚 Huidige Vragen
            </button>
            <button class="kns-source-btn ${this.knsDataSource === 'oefenexamens' ? 'active' : ''}" data-source="oefenexamens">
                📝 Oefenexamens
            </button>
            <button class="kns-source-btn ${this.knsDataSource === 'exam' ? 'active' : ''}" data-source="exam">
                📋 Examens
            </button>
        `;
        this.knsAccordion.appendChild(toggleBar);

        toggleBar.querySelectorAll('.kns-source-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const newSource = btn.dataset.source;
                if (newSource !== this.knsDataSource) {
                    this.knsDataSource = newSource;
                    this.initKnsTopics();
                }
            });
        });

        // Exam mode: show exam selection grid instead of accordion
        if (this.knsDataSource === 'exam') {
            this.renderExamSelection();
            return;
        }

        const dataSource = this.knsDataSource === 'current' ? knsData : oefenexamensData;

        // Build accordion items
        Object.keys(dataSource).forEach((topic, idx) => {
            const itemCount = dataSource[topic].length;
            const item = document.createElement('div');
            item.className = 'kns-item';
            item.innerHTML = `
                <div class="kns-header">
                    <h3><span class="kns-number">${idx + 1}</span> ${topic}</h3>
                    <span class="kns-icon">▼</span>
                </div>
                <div class="kns-content">
                    <div class="topic-info">
                        <p>Oefen met ${itemCount} vragen over dit onderwerp. Dit onderdeel is essentieel voor het inburgeringsexamen.</p>
                        <button class="btn btn-primary start-topic-btn" data-topic="${topic}" style="background:#f97316; border:none; padding:1rem 2rem; font-weight:700;">
                            Start Oefening
                        </button>
                    </div>
                </div>
            `;

            item.querySelector('.kns-header').addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                document.querySelectorAll('.kns-item').forEach(el => el.classList.remove('active'));
                if (!isActive) item.classList.add('active');
            });

            item.querySelector('.start-topic-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.startKnsTopic(topic);
            });

            this.knsAccordion.appendChild(item);
        });
    }

    // ============================================================
    //  KNS EXAM MODE
    // ============================================================
    renderExamSelection() {
        const totalExams = 25;

        const container = document.createElement('div');
        container.className = 'kns-exam-selection';

        const heading = document.createElement('div');
        heading.className = 'kns-exam-heading';
        heading.innerHTML = `
            <h3>📋 KNS Proefexamens</h3>
            <p>Elk examen bevat 40 vragen — 5 uit elk van de 8 KNS onderwerpen. Tijdslimiet: 45 minuten.</p>
        `;
        container.appendChild(heading);

        const randomBtn = document.createElement('button');
        randomBtn.className = 'btn btn-primary btn-large kns-exam-random-btn';
        randomBtn.innerHTML = '🎲 Start Willekeurig Examen';
        randomBtn.addEventListener('click', () => {
            const examNum = Math.floor(Math.random() * totalExams) + 1;
            this.startKnsExam(examNum);
        });
        container.appendChild(randomBtn);

        const grid = document.createElement('div');
        grid.className = 'kns-exam-grid';

        for (let i = 1; i <= totalExams; i++) {
            const btn = document.createElement('button');
            btn.className = 'kns-exam-btn';
            btn.innerHTML = `<span class="exam-num">${i}</span><span class="exam-label">Examen ${i}</span>`;
            btn.addEventListener('click', () => this.startKnsExam(i));
            grid.appendChild(btn);
        }

        container.appendChild(grid);

        // --- Exam Test Mode section ---
        const testHeading = document.createElement('div');
        testHeading.className = 'kns-exam-heading';
        testHeading.innerHTML = `
            <h3>📝 Exam Test Mode</h3>
            <p>8 unieke examens — 5 vragen uit elk van de 8 onderwerpen. Geen herhaling van vragen tussen examens. Tijdslimiet: 45 minuten.</p>
        `;
        container.appendChild(testHeading);

        if (!this.knsExamSets) {
            this.knsExamSets = this.generateUniqueExamSets();
        }

        const testGrid = document.createElement('div');
        testGrid.className = 'kns-exam-grid';

        for (let i = 1; i <= 8; i++) {
            const btn = document.createElement('button');
            btn.className = 'kns-exam-btn kns-exam-test-btn';
            btn.innerHTML = `<span class="exam-num">${i}</span><span class="exam-label">Test ${i}</span>`;
            btn.addEventListener('click', () => this.startKnsExamTest(i));
            testGrid.appendChild(btn);
        }

        container.appendChild(testGrid);
        this.knsAccordion.appendChild(container);
    }

    generateExamSet(examNumber) {
        const topics = Object.keys(oefenexamensData);
        const questions = [];

        topics.forEach(topic => {
            const pool = [...oefenexamensData[topic]];
            const picked = this.seededShuffle(pool, examNumber * 1000 + topics.indexOf(topic)).slice(0, 5);
            questions.push(...picked);
        });

        return this.seededShuffle(questions, examNumber);
    }

    seededShuffle(arr, seed) {
        const result = [...arr];
        let s = seed;
        const mulberry32 = () => {
            s |= 0; s = s + 0x6D2B79F5 | 0;
            let t = Math.imul(s ^ s >>> 15, 1 | s);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };

        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(mulberry32() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    generateUniqueExamSets() {
        const topics = Object.keys(oefenexamensData);
        const numSets = 8;
        const questionsPerTopic = 5;
        const sets = [];

        for (let s = 0; s < numSets; s++) sets.push([]);

        topics.forEach(topic => {
            const pool = this.seededShuffle([...oefenexamensData[topic]], topic.length);
            for (let s = 0; s < numSets; s++) {
                const chunk = pool.slice(s * questionsPerTopic, (s + 1) * questionsPerTopic);
                sets[s].push(...chunk);
            }
        });

        return sets.map((set, i) => this.seededShuffle(set, i + 100));
    }

    startKnsExamTest(testNumber) {
        if (!this.knsExamSets) {
            this.knsExamSets = this.generateUniqueExamSets();
        }

        this.knsDataSource = 'examTest';
        this.knsQuiz.topic = `Exam Test ${testNumber}`;
        this.knsQuiz.index = 0;
        this.knsQuiz.score = 0;
        this.knsQuiz.selected = null;
        this.knsQuiz.isAnswered = false;
        this.knsQuiz.wrongQuestions = [];
        this.knsQuiz.data = this.knsExamSets[testNumber - 1];
        this.knsQuiz.isExam = true;
        this.knsQuiz.examNumber = testNumber;
        this.knsQuiz.examTimerSeconds = 45 * 60;
        this.knsQuiz.examTimerInterval = null;

        this.knsTopicTitle.textContent = `Exam Test ${testNumber} (40 vragen)`;
        this.knsTopicsContainer.classList.add('hidden');
        this.knsResultContainer.classList.add('hidden');
        this.knsPlayContainer.classList.remove('hidden');

        this.showExamTimer();
        this.startExamTimer();
        this.renderKnsQuestion();
    }

    startKnsExam(examNumber) {
        this.knsDataSource = 'exam';
        this.knsQuiz.topic = `Examen ${examNumber}`;
        this.knsQuiz.index = 0;
        this.knsQuiz.score = 0;
        this.knsQuiz.selected = null;
        this.knsQuiz.isAnswered = false;
        this.knsQuiz.wrongQuestions = [];
        this.knsQuiz.data = this.generateExamSet(examNumber);
        this.knsQuiz.isExam = true;
        this.knsQuiz.examNumber = examNumber;
        this.knsQuiz.examTimerSeconds = 45 * 60; // 45 minutes
        this.knsQuiz.examTimerInterval = null;

        this.knsTopicTitle.textContent = `Examen ${examNumber} (40 vragen)`;
        this.knsTopicsContainer.classList.add('hidden');
        this.knsResultContainer.classList.add('hidden');
        this.knsPlayContainer.classList.remove('hidden');

        this.showExamTimer();
        this.startExamTimer();
        this.renderKnsQuestion();
    }

    showExamTimer() {
        let timerEl = document.getElementById('knsExamTimer');
        if (!timerEl) {
            timerEl = document.createElement('div');
            timerEl.id = 'knsExamTimer';
            timerEl.className = 'kns-exam-timer';
            timerEl.innerHTML = `
                <svg width="44" height="44" viewBox="0 0 44 44" class="kns-timer-ring">
                    <circle cx="22" cy="22" r="18" fill="none" stroke="var(--bg-tertiary)" stroke-width="3"/>
                    <circle cx="22" cy="22" r="18" fill="none" stroke="var(--primary)" stroke-width="3"
                        stroke-dasharray="113.1" stroke-dashoffset="0" stroke-linecap="round"
                        transform="rotate(-90 22 22)" id="knsTimerCircle"/>
                </svg>
                <span class="kns-timer-text" id="knsTimerText">25:00</span>
            `;
            const header = this.knsPlayContainer.querySelector('.kns-quiz-header');
            header.appendChild(timerEl);
        }
        timerEl.style.display = 'flex';
    }

    hideExamTimer() {
        const timerEl = document.getElementById('knsExamTimer');
        if (timerEl) timerEl.style.display = 'none';
    }

    startExamTimer() {
        this.clearExamTimer();
        this.knsQuiz.examTimerInterval = setInterval(() => {
            this.knsQuiz.examTimerSeconds--;

            const mins = Math.floor(this.knsQuiz.examTimerSeconds / 60);
            const secs = this.knsQuiz.examTimerSeconds % 60;
            const timerText = document.getElementById('knsTimerText');
            if (timerText) {
                timerText.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            }

            const circle = document.getElementById('knsTimerCircle');
            if (circle) {
                const total = 45 * 60;
                const remaining = this.knsQuiz.examTimerSeconds;
                const circumference = 113.1;
                const offset = circumference * (1 - remaining / total);
                circle.setAttribute('stroke-dashoffset', offset);
                if (remaining <= 300) {
                    circle.setAttribute('stroke', 'var(--danger)');
                    timerText && (timerText.style.color = 'var(--danger)');
                } else if (remaining <= 600) {
                    circle.setAttribute('stroke', 'var(--warning)');
                    timerText && (timerText.style.color = 'var(--warning)');
                }
            }

            if (this.knsQuiz.examTimerSeconds <= 0) {
                this.clearExamTimer();
                this.showKnsResults(); // Auto-submit when time runs out
            }
        }, 1000);
    }

    clearExamTimer() {
        if (this.knsQuiz.examTimerInterval) {
            clearInterval(this.knsQuiz.examTimerInterval);
            this.knsQuiz.examTimerInterval = null;
        }
    }

    startKnsTopic(topicName) {
        const dataSource = this.knsDataSource === 'current' ? knsData : oefenexamensData;

        this.knsQuiz.topic = topicName;
        this.knsQuiz.index = 0;
        this.knsQuiz.score = 0;
        this.knsQuiz.selected = null;
        this.knsQuiz.isAnswered = false;
        this.knsQuiz.wrongQuestions = [];
        this.knsQuiz.data = [...dataSource[topicName]].sort(() => Math.random() - 0.5);

        this.knsTopicTitle.textContent = topicName;
        this.knsTopicsContainer.classList.add('hidden');
        this.knsResultContainer.classList.add('hidden');
        this.knsPlayContainer.classList.remove('hidden');

        this.renderKnsQuestion();
        this.updateKnsScoreTracker();
    }

    renderKnsQuestion() {
        const q = this.knsQuiz.data[this.knsQuiz.index];
        this.knsQuestionText.textContent = q.question;
        this.knsQuiz.selected = null;
        this.knsQuiz.isAnswered = false;

        // Render options with A, B, C labels
        const letters = ['A', 'B', 'C', 'D'];
        this.knsOptionsGrid.innerHTML = q.options.map((opt, i) => `
            <div class="kns-option" data-index="${i}">
                <div class="opt-letter">${letters[i]}</div>
                <div class="opt-text">${opt}</div>
            </div>
        `).join('');

        // Option selection
        this.knsOptionsGrid.querySelectorAll('.kns-option').forEach(el => {
            el.addEventListener('click', () => {
                if (this.knsQuiz.isAnswered) return;
                this.knsOptionsGrid.querySelectorAll('.kns-option').forEach(opt => opt.classList.remove('selected'));
                el.classList.add('selected');
                this.knsQuiz.selected = parseInt(el.dataset.index);
            });
        });

        // Progress dots
        this.knsProgressDots.innerHTML = this.knsQuiz.data.map((_, i) => `
            <div class="dot ${i === this.knsQuiz.index ? 'active' : (i < this.knsQuiz.index ? 'completed' : '')}" data-index="${i}">
                ${i + 1}
            </div>
        `).join('');

        // Make dots clickable
        this.knsProgressDots.querySelectorAll('.dot').forEach(dot => {
            dot.addEventListener('click', () => {
                this.knsQuiz.index = parseInt(dot.dataset.index);
                this.renderKnsQuestion();
            });
        });

        this.knsSubmitBtn.classList.remove('hidden');
        this.knsFeedback.classList.add('hidden');
        this.knsSubmitBtn.disabled = false;
        
        // Scroll to card
        this.knsPlayContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    submitKnsAnswer() {
        if (this.knsQuiz.selected === null) {
            alert('Selecteer een antwoord aub.');
            return;
        }

        const q = this.knsQuiz.data[this.knsQuiz.index];
        const isCorrect = this.knsQuiz.selected === q.correct;
        this.knsQuiz.isAnswered = true;

        if (isCorrect) {
            this.knsQuiz.score++;
        } else {
            this.knsQuiz.wrongQuestions.push(q);
        }

        this.updateKnsScoreTracker();

        // Show feedback
        this.knsFeedback.className = `kns-feedback ${isCorrect ? 'correct' : 'wrong'}`;
        this.knsFeedbackText.innerHTML = isCorrect
            ? '<strong>✅ Correct!</strong>'
            : `<strong>❌ Fout.</strong> Het juiste antwoord was: <em>${q.options[q.correct]}</em>`;
        this.knsExplanationText.textContent = q.explanation || '';

        this.knsFeedback.classList.remove('hidden');
        this.knsSubmitBtn.classList.add('hidden');
    }

    nextKnsQuestion() {
        if (this.knsQuiz.index < this.knsQuiz.data.length - 1) {
            this.knsQuiz.index++;
            this.renderKnsQuestion();
        } else {
            this.showKnsResults();
        }
    }

    showKnsResults() {
        this.clearExamTimer();
        this.hideExamTimer();

        this.knsPlayContainer.classList.add('hidden');
        this.knsResultContainer.classList.remove('hidden');

        const total = this.knsQuiz.data.length;
        const score = this.knsQuiz.score;
        const wrong = total - score;
        const pct = total > 0 ? Math.round((score / total) * 100) : 0;

        // Exam mode: show correct/incorrect counts and per-topic breakdown
        if (this.knsQuiz.isExam) {
            this.knsResultScore.textContent = `${score}/${total} (${pct}%)`;
            const passed = pct >= 60;
            this.knsResultMsg.innerHTML = passed
                ? `✅ Geslaagd! ${score} goed, ${wrong} fout.`
                : `❌ Nog niet geslaagd. ${score} goed, ${wrong} fout. Oefen verder.`;
            this.knsResultMsg.style.color = passed ? 'var(--success)' : 'var(--danger)';

            // Per-topic breakdown
            const topicStats = {};
            const topicNames = Object.keys(oefenexamensData);
            this.knsQuiz.data.forEach(q => {
                const t = q.theme || 'Onbekend';
                if (!topicStats[t]) topicStats[t] = { total: 0, correct: 0 };
                topicStats[t].total++;
            });
            this.knsQuiz.wrongQuestions.forEach(q => {
                const t = q.theme || 'Onbekend';
                if (topicStats[t]) topicStats[t].correct = topicStats[t].total -
                    this.knsQuiz.wrongQuestions.filter(w => (w.theme || 'Onbekend') === t).length;
            });
            Object.keys(topicStats).forEach(t => {
                const wc = this.knsQuiz.wrongQuestions.filter(w => (w.theme || 'Onbekend') === t).length;
                topicStats[t].correct = topicStats[t].total - wc;
            });

            const weakContainer = document.getElementById('knsWeakAreasContainer');
            const weakList = document.getElementById('knsWeakAreasList');
            weakContainer.classList.remove('hidden');
            weakList.innerHTML = `
                <div style="margin-bottom:12px;font-size:0.85rem;color:#64748b;">
                    Resultaat per onderwerp:
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:12px;">
                    ${Object.entries(topicStats).map(([t, s]) => {
                        const tpct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                        const icon = tpct >= 80 ? '✅' : (tpct >= 50 ? '⚠️' : '❌');
                        return `<div style="background:#f8fafc; padding:8px 10px; border-radius:6px; font-size:0.8rem;">
                            ${icon} <strong>${t}:</strong> ${s.correct}/${s.total}
                        </div>`;
                    }).join('')}
                </div>
                ${wrong > 0 ? `<div style="border-top:1px solid #e2e8f0; padding-top:10px; font-size:0.8rem; color:#64748b;">
                    ✅ Correct: ${score} | ❌ Incorrect: ${wrong}
                </div>` : ''}
            `;

            this.knsQuiz.isExam = false;
            return;
        }

        const passed = pct >= 80;

        this.knsResultScore.textContent = `${score}/${total} (${pct}%)`;
        
        if (score === total) {
            this.knsResultMsg.innerHTML = `${passed ? '✅' : ''} Perfect! Je kent dit onderwerp heel goed.`;
        } else if (pct >= 80) {
            this.knsResultMsg.innerHTML = '✅ Geslaagd! Je hebt de 80% norm gehaald.';
        } else if (pct >= 70) {
            this.knsResultMsg.innerHTML = '⚠️ Bijna! Je bent dicht bij de 80% norm. Blijf oefenen.';
        } else if (pct >= 50) {
            this.knsResultMsg.innerHTML = '❌ Onvoldoende. Je moet nog flink oefenen om de 80% norm te halen.';
        } else {
            this.knsResultMsg.innerHTML = '❌ Onvoldoende. Begin opnieuw en leer de stof beter.';
        }

        const weakAreasContainer = document.getElementById('knsWeakAreasContainer');
        const weakAreasList = document.getElementById('knsWeakAreasList');
        
        // Build per-subTopic breakdown from all answered questions
        const subTopicStats = {};
        this.knsQuiz.data.forEach(q => {
            const st = q.subTopic || 'Algemeen';
            if (!subTopicStats[st]) subTopicStats[st] = { total: 0, correct: 0 };
            subTopicStats[st].total++;
        });
        // Add wrong questions to track which subTopics were missed
        this.knsQuiz.wrongQuestions.forEach(q => {
            const st = q.subTopic || 'Algemeen';
            if (subTopicStats[st]) subTopicStats[st].correct = subTopicStats[st].total - 
                (this.knsQuiz.wrongQuestions.filter(w => (w.subTopic || 'Algemeen') === st).length);
        });
        // Fill correct for subTopics with no wrong answers
        Object.keys(subTopicStats).forEach(st => {
            const wrongCount = this.knsQuiz.wrongQuestions.filter(w => (w.subTopic || 'Algemeen') === st).length;
            subTopicStats[st].correct = subTopicStats[st].total - wrongCount;
        });

        if (this.knsQuiz.wrongQuestions.length > 0) {
            weakAreasContainer.classList.remove('hidden');
            
            // Show subTopic breakdown
            const breakdownHtml = Object.entries(subTopicStats).map(([st, stats]) => {
                const stPct = Math.round((stats.correct / stats.total) * 100);
                const icon = stPct >= 80 ? '✅' : (stPct >= 50 ? '⚠️' : '❌');
                const color = stPct >= 80 ? '#16a34a' : (stPct >= 50 ? '#d97706' : '#dc2626');
                return `<li style="margin-bottom:6px;color:${color}">${icon} <strong>${st}:</strong> ${stats.correct}/${stats.total} (${stPct}%) ${stPct >= 80 ? '— gehaald' : '— oefenen'}</li>`;
            }).join('');
            
            weakAreasList.innerHTML = `
                <div style="margin-bottom:12px;font-size:0.85rem;color:#64748b;">
                    Resultaat per onderdeel (80% norm):
                </div>
                <ul style="list-style:none;margin-left:0;">${breakdownHtml}</ul>
                <div style="margin-top:12px;border-top:1px solid #e2e8f0;padding-top:10px;font-size:0.8rem;color:#64748b;">
                    Gemiste vragen:
                </div>
                <ul style="list-style:disc;margin-left:20px;margin-top:6px;">
                    ${this.knsQuiz.wrongQuestions.map(q => {
                        let topicStr = q.subTopic ? `<strong>${q.subTopic}:</strong> ` : '';
                        return `<li>${topicStr}${q.question}</li>`;
                    }).join('')}
                </ul>
            `;
        } else {
            weakAreasContainer.classList.add('hidden');
        }
    }

    updateKnsScoreTracker() {
        const total = this.knsQuiz.data.length;
        const answered = this.knsQuiz.wrongQuestions.length + this.knsQuiz.score;
        const pct = answered > 0 ? Math.round((this.knsQuiz.score / answered) * 100) : 0;
        let cls, statusText;

        if (answered === 0) {
            cls = 'excellent';
            statusText = 'Start';
        } else if (pct >= 80) {
            cls = 'excellent';
            statusText = `✅ ${pct}% — Op koers`;
        } else if (pct >= 50) {
            cls = 'good';
            statusText = `⚠️ ${pct}% — Let op`;
        } else {
            cls = 'weak';
            statusText = `❌ ${pct}% — Oefenen!`;
        }

        this.knsScoreTracker.classList.remove('hidden');
        this.knsScoreFill.style.width = answered > 0 ? `${pct}%` : '0%';
        this.knsScoreFill.className = `kns-score-fill ${cls}`;
        this.knsScoreCount.textContent = `${this.knsQuiz.score}/${answered} goed`;
        this.knsScorePct.textContent = `${pct}%`;
        this.knsScorePct.className = `kns-score-pct ${cls}`;
        this.knsScoreStatus.textContent = statusText;
        this.knsScoreStatus.className = `kns-score-status ${cls}`;
    }

    // ============================================================
    //  SPEAKING EXAM — INIT & TOPICS
    // ============================================================
    initSpeakingExamRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('Speech Recognition API not supported in this browser.');
            return;
        }

        this.speakingExamRecognition = new SpeechRecognition();
        this.speakingExamRecognition.lang = 'nl-NL';
        this.speakingExamRecognition.continuous = true;
        this.speakingExamRecognition.interimResults = true;
        this.speakingExamRecognition.maxAlternatives = 1;

        this.speakingExamRecognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            this.seLiveTranscript.textContent = finalTranscript || interimTranscript;
            if (finalTranscript) {
                this.speakingExam.transcript = finalTranscript;
            }
        };

        this.speakingExamRecognition.onerror = (event) => {
            console.error('Speaking exam speech error', event.error);
            this.seStatusText.textContent = 'Fout bij spraakherkenning: ' + event.error;
            this.seMicBtn.classList.remove('listening');
        };

        this.speakingExamRecognition.onend = () => {
            if (this.speakingExam.isRecording && !this.speakingExam.isAnswered) {
                try { this.speakingExamRecognition.start(); } catch (e) { }
            } else if (!this.speakingExam.isAnswered) {
                this.seMicBtn.classList.remove('listening');
                this.seStatusText.textContent = 'Klik op de microfoon om te spreken';
            }
        };
    }

    initSpeakingExamTopics() {
        this.seTopicsContainer.classList.remove('hidden');
        this.sePlayContainer.classList.add('hidden');
        this.seResultContainer.classList.add('hidden');

        this.seAccordion.innerHTML = '';

        const topics = Object.keys(speakingExamData);
        topics.forEach(topic => {
            const qCount = speakingExamData[topic].length;
            const sampleQ = speakingExamData[topic][0];

            const item = document.createElement('div');
            item.className = 'se-accordion-item';

            const header = document.createElement('div');
            header.className = 'se-accordion-header';
            header.innerHTML = `
                <h4>${topic}</h4>
                <span class="se-qcount">${qCount} vragen</span>
                <svg class="se-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            `;
            header.addEventListener('click', () => {
                item.classList.toggle('open');
            });

            const body = document.createElement('div');
            body.className = 'se-accordion-body';
            body.innerHTML = `
                <div class="se-accordion-body-inner">
                    <p>Voorbeeld: <em>"${sampleQ.promptNLShort}"</em></p>
                    <button class="btn btn-secondary">Oefen ${topic} (${qCount} vragen)</button>
                </div>
            `;
            body.querySelector('button').addEventListener('click', (e) => {
                e.stopPropagation();
                this.startSpeakingExam('topic', topic);
            });

            item.appendChild(header);
            item.appendChild(body);
            this.seAccordion.appendChild(item);
        });
    }

    showSpeakingExamTopics() {
        if (this.speakingExam.isRecording) {
            this.stopSpeakingExamRecording();
        }
        this.clearSpeakingExamTimer();
        this.sePlayContainer.classList.add('hidden');
        this.seResultContainer.classList.add('hidden');
        this.seTopicsContainer.classList.remove('hidden');
        this.speakingExam.isStarted = false;
    }

    // ============================================================
    //  SPEAKING EXAM — START & FLOW
    // ============================================================
    startSpeakingExam(mode, topicName = null) {
        this.speakingExam.mode = mode;
        this.speakingExam.topic = topicName;
        this.speakingExam.index = 0;
        this.speakingExam.score = 0;
        this.speakingExam.maxScore = 0;
        this.speakingExam.isAnswered = false;
        this.speakingExam.isRecording = false;
        this.speakingExam.selectedChoice = null;
        this.speakingExam.transcript = '';
        this.speakingExam.wrongQuestions = [];
        this.speakingExam.scores = [];
        this.speakingExam.isStarted = true;

        this.clearSpeakingExamTimer();

        if (mode === 'topic' && topicName) {
            this.speakingExam.data = [...speakingExamData[topicName]].sort(() => Math.random() - 0.5);
        } else {
            this.speakingExam.data = [];
            const topics = Object.keys(speakingExamData);
            topics.forEach(t => {
                this.speakingExam.data.push(...speakingExamData[t]);
            });
            this.speakingExam.data.sort(() => Math.random() - 0.5);
        }

        this.seTopicsContainer.classList.add('hidden');
        this.seResultContainer.classList.add('hidden');
        this.sePlayContainer.classList.remove('hidden');
        this.seScoreTracker.classList.add('hidden');
        this.seFeedback.classList.add('hidden');

        this.seTopicBadge.textContent = topicName || 'Volledig Examen';
        this.renderSEProgressDots();
        this.renderSpeakingExamQuestion();
    }

    renderSpeakingExamQuestion() {
        const q = this.speakingExam.data[this.speakingExam.index];
        if (!q) return;

        this.speakingExam.isAnswered = false;
        this.speakingExam.isRecording = false;
        this.speakingExam.transcript = '';
        this.speakingExam.selectedChoice = null;
        this.speakingExam.timerSeconds = 20;
        this.clearSpeakingExamTimer();

        this.seMicBtn.classList.remove('listening');
        this.seStatusText.textContent = 'Klik op de microfoon om te spreken';
        this.seLiveTranscript.textContent = '';
        this.seFeedback.classList.add('hidden');
        this.seTimer.classList.remove('warning', 'danger');

        this.sePromptText.textContent = q.promptNL;

        if (q.images && q.images.length > 0) {
            this.seImagesGrid.classList.remove('hidden');
            this.seImagesGrid.innerHTML = q.images.map(img => `
                <div class="se-image-card">
                    ${this.getPlaceholderSVG(img.svg, img.alt)}
                </div>
            `).join('');
        } else {
            this.seImagesGrid.classList.add('hidden');
            this.seImagesGrid.innerHTML = '';
        }

        if (q.type === 'kiezenUitleggen') {
            this.seChoicePrompt.classList.remove('hidden');
            this.seChoicePrompt.textContent = q.choicePrompt || 'Kies één van de plaatjes:';
            this.seChoiceGrid.classList.remove('hidden');
            this.seChoiceGrid.innerHTML = q.images.map((img, i) => `
                <button class="se-choice-btn" data-choice="${i}">
                    ${this.getPlaceholderSVG(img.svg, img.alt)}
                    <span class="se-choice-label">Keuze ${i + 1}</span>
                </button>
            `).join('');

            this.seChoiceGrid.querySelectorAll('.se-choice-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.seChoiceGrid.querySelectorAll('.se-choice-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    this.speakingExam.selectedChoice = parseInt(btn.dataset.choice);
                });
            });
        } else {
            this.seChoicePrompt.classList.add('hidden');
            this.seChoiceGrid.classList.add('hidden');
            this.seChoiceGrid.innerHTML = '';
        }

        this.seNextBtn.parentElement.classList.add('hidden');

        setTimeout(() => this.speakExamPrompt(), 500);
    }

    speakExamPrompt() {
        const q = this.speakingExam.data[this.speakingExam.index];
        if (!q || !('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(q.promptNL);
        const voices = window.speechSynthesis.getVoices();
        const dutchVoice = voices.find(v => v.lang.startsWith('nl')) || voices.find(v => v.lang.startsWith('nl-NL'));
        if (dutchVoice) utterance.voice = dutchVoice;
        utterance.lang = 'nl-NL';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }

    speakModelAnswer() {
        const q = this.speakingExam.data[this.speakingExam.index];
        if (!q || !('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(q.modelAnswer);
        const voices = window.speechSynthesis.getVoices();
        const dutchVoice = voices.find(v => v.lang.startsWith('nl')) || voices.find(v => v.lang.startsWith('nl-NL'));
        if (dutchVoice) utterance.voice = dutchVoice;
        utterance.lang = 'nl-NL';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
    }

    // ============================================================
    //  SPEAKING EXAM — RECORDING & TIMER
    // ============================================================
    toggleSpeakingExamRecording() {
        if (this.speakingExam.isAnswered) return;

        if (this.speakingExam.isRecording) {
            this.stopSpeakingExamRecording();
        } else {
            this.startSpeakingExamRecording();
        }
    }

    startSpeakingExamRecording() {
        if (!this.speakingExamRecognition || this.speakingExam.isRecording || this.speakingExam.isAnswered) return;

        const q = this.speakingExam.data[this.speakingExam.index];
        if (!q) return;

        window.speechSynthesis.cancel();
        this.speakingExam.isRecording = true;
        this.speakingExam.transcript = '';
        this.seLiveTranscript.textContent = '...';
        this.seStatusText.textContent = 'Aan het luisteren... spreek Nederlands';
        this.seMicBtn.classList.add('listening');
        this.speakingExam.timerSeconds = 20;
        this.seTimer.classList.remove('warning', 'danger');
        this.updateSETimerDisplay();

        try {
            this.speakingExamRecognition.start();
        } catch (e) { }

        this.clearSpeakingExamTimer();
        this.speakingExam.timerInterval = setInterval(() => {
            this.speakingExam.timerSeconds--;
            this.updateSETimerDisplay();

            if (this.speakingExam.timerSeconds <= 0) {
                this.stopSpeakingExamRecording();
            }
        }, 1000);
    }

    stopSpeakingExamRecording() {
        if (!this.speakingExamRecognition || !this.speakingExam.isRecording) return;

        this.speakingExam.isRecording = false;
        this.clearSpeakingExamTimer();

        try { this.speakingExamRecognition.stop(); } catch (e) { }
        this.seMicBtn.classList.remove('listening');
        this.seStatusText.textContent = 'Verwerken...';

        setTimeout(() => {
            const transcript = this.speakingExam.transcript || this.seLiveTranscript.textContent || '';
            if (transcript && transcript !== '...' && !this.speakingExam.isAnswered) {
                this.evaluateSpeakingAnswer(transcript);
            } else if (!this.speakingExam.isAnswered) {
                this.seStatusText.textContent = 'Geen antwoord gehoord. Probeer opnieuw.';
            }
        }, 600);
    }

    updateSETimerDisplay() {
        const total = 20;
        const remaining = this.speakingExam.timerSeconds;
        const circle = this.seTimerCircle;
        const circumference = 131.95;
        const offset = circumference * (1 - remaining / total);
        circle.setAttribute('stroke-dashoffset', offset);

        if (remaining <= 5) {
            circle.setAttribute('stroke', 'var(--danger)');
            this.seTimer.classList.add('danger');
            this.seTimer.classList.remove('warning');
        } else if (remaining <= 10) {
            circle.setAttribute('stroke', 'var(--warning)');
            this.seTimer.classList.add('warning');
            this.seTimer.classList.remove('danger');
        }

        this.seTimerText.textContent = remaining;
    }

    clearSpeakingExamTimer() {
        if (this.speakingExam.timerInterval) {
            clearInterval(this.speakingExam.timerInterval);
            this.speakingExam.timerInterval = null;
        }
    }

    // ============================================================
    //  SPEAKING EXAM — EVALUATION
    // ============================================================
    evaluateSpeakingAnswer(transcript) {
        const q = this.speakingExam.data[this.speakingExam.index];
        if (!q) return;

        this.speakingExam.isAnswered = true;
        if (this.speakingExam.isRecording) {
            this.stopSpeakingExamRecording();
        }

        const cleaned = transcript.toLowerCase().replace(/[.,!?;:(){}[\]'"«»„""'…–—]/g, ' ').replace(/\s+/g, ' ').trim();
        const words = cleaned.split(' ').filter(w => w.length > 1);

        const matchedKeywords = q.keywords.filter(kw => cleaned.includes(kw.toLowerCase()));

        let wordWeight = 25;
        let keywordWeight = 75;
        let choiceWeight = 0;

        if (q.type === 'kiezenUitleggen') {
            wordWeight = 15;
            keywordWeight = 60;
            choiceWeight = 25;
        } else if (q.type === 'vraagAntwoord') {
            wordWeight = 25;
            keywordWeight = 75;
        } else if (q.type === 'plaatjesBeschrijven') {
            wordWeight = 20;
            keywordWeight = 80;
        } else if (q.type === 'verhaalVertellen') {
            wordWeight = 20;
            keywordWeight = 80;
        }

        const wordScore = Math.min(words.length / Math.max(q.minWords, 1), 1.0) * wordWeight;
        const keywordScore = q.keywords.length > 0
            ? (matchedKeywords.length / q.keywords.length) * keywordWeight
            : keywordWeight;
        let choiceScore = 0;
        if (choiceWeight > 0) {
            choiceScore = this.speakingExam.selectedChoice !== null ? choiceWeight : 0;
        }

        const totalScore = Math.round(wordScore + keywordScore + choiceScore);
        const passed = totalScore >= 60;

        this.speakingExam.score += totalScore;
        this.speakingExam.maxScore += 100;
        this.speakingExam.scores.push({ totalScore, passed, qId: q.id });

        if (!passed) {
            this.speakingExam.wrongQuestions.push({ question: q, score: totalScore });
        }

        this.showSpeakingExamFeedback(totalScore, passed, matchedKeywords, q, words.length);
        this.updateSEScoreTracker();
        this.updateSEProgressDots();

        this.seNextBtn.parentElement.classList.remove('hidden');
        this.seNextBtn.focus();
    }

    showSpeakingExamFeedback(score, passed, matchedKeywords, q, wordCount) {
        this.seFeedback.classList.remove('hidden');
        this.seFeedback.className = `se-feedback ${passed ? 'correct' : 'wrong'}`;
        this.seFeedbackScore.textContent = `${score}/100`;

        const foundList = matchedKeywords.map(k => `<span class="kw-found">✓${k}</span>`).join(', ');
        const missedList = q.keywords.filter(k => !matchedKeywords.includes(k)).map(k => `<span class="kw-missed">${k}</span>`).join(', ');
        this.seFeedbackKeywords.innerHTML = `
            ${foundList ? 'Gevonden: ' + foundList + '<br>' : ''}
            Gemist: ${missedList}<br>
            Woorden: ${wordCount} (min. ${q.minWords})
        `;

        this.seFeedbackModel.classList.remove('hidden');
        this.seModelText.textContent = q.modelAnswer;
        this.seListenModelBtn.style.display = 'inline-block';
    }

    // ============================================================
    //  SPEAKING EXAM — NAVIGATION & RESULTS
    // ============================================================
    nextSpeakingExamQuestion() {
        this.speakingExam.index++;

        this.seFeedback.classList.add('hidden');
        this.seListenModelBtn.style.display = 'none';

        if (this.speakingExam.index >= this.speakingExam.data.length) {
            this.showSpeakingExamResults();
        } else {
            this.seScoreTracker.classList.remove('hidden');
            this.renderSEProgressDots();
            this.renderSpeakingExamQuestion();
        }
    }

    renderSEProgressDots() {
        const total = this.speakingExam.data.length;
        this.seProgressDots.innerHTML = '';

        for (let i = 0; i < total; i++) {
            const dot = document.createElement('span');
            dot.className = 'se-dot';
            if (i === this.speakingExam.index) dot.classList.add('current');
            else if (i < this.speakingExam.index) {
                const record = this.speakingExam.scores[i];
                if (record) {
                    dot.classList.add(record.passed ? 'correct' : 'wrong');
                }
            }
            this.seProgressDots.appendChild(dot);
        }
    }

    updateSEProgressDots() {
        this.renderSEProgressDots();
    }

    updateSEScoreTracker() {
        const total = this.speakingExam.data.length;
        const answered = this.speakingExam.scores.length;
        const avgScore = answered > 0
            ? Math.round(this.speakingExam.scores.reduce((s, r) => s + r.totalScore, 0) / answered)
            : 0;

        this.seScoreTracker.classList.remove('hidden');
        this.seScoreFill.style.width = answered > 0 ? `${(answered / total) * 100}%` : '0%';
        this.seScoreCount.textContent = `${answered}/${total} beantwoord`;
        this.seScorePct.textContent = `Gem. ${avgScore}%`;
    }

    showSpeakingExamResults() {
        this.sePlayContainer.classList.add('hidden');
        this.seResultContainer.classList.remove('hidden');

        const total = this.speakingExam.scores.length;
        const avgScore = total > 0
            ? Math.round(this.speakingExam.scores.reduce((s, r) => s + r.totalScore, 0) / total)
            : 0;
        const passedCount = this.speakingExam.scores.filter(r => r.passed).length;
        const overallPassed = avgScore >= 60;

        const circumference = 364.4;
        const offset = circumference * (1 - avgScore / 100);
        this.seResultRing.setAttribute('stroke-dashoffset', offset);
        this.seResultRing.setAttribute('stroke', overallPassed ? 'var(--success)' : 'var(--danger)');
        this.seResultPct.textContent = `${avgScore}%`;

        this.seResultMsg.textContent = overallPassed
            ? `✅ Geslaagd! (${passedCount}/${total} vragen ≥60%)`
            : `❌ Nog niet geslaagd (${passedCount}/${total} vragen ≥60%)`;
        this.seResultMsg.className = `se-result-msg ${overallPassed ? 'passed' : 'failed'}`;

        const byType = {};
        this.speakingExam.data.forEach((q, i) => {
            const record = this.speakingExam.scores[i];
            if (!record) return;
            if (!byType[q.type]) byType[q.type] = { total: 0, count: 0 };
            byType[q.type].total += record.totalScore;
            byType[q.type].count++;
        });

        const typeLabels = {
            'vraagAntwoord': 'Vraag & Antwoord',
            'plaatjesBeschrijven': 'Plaatjes Beschrijven',
            'kiezenUitleggen': 'Kiezen & Uitleggen',
            'verhaalVertellen': 'Verhaal Vertellen'
        };

        this.seResultBreakdown.innerHTML = Object.entries(byType).map(([type, data]) => {
            const avg = Math.round(data.total / data.count);
            let cls = 'bad';
            if (avg >= 80) cls = 'good';
            else if (avg >= 60) cls = 'ok';
            return `<div class="se-breakdown-row">
                <span class="se-bd-label">${typeLabels[type] || type}</span>
                <span class="se-bd-score ${cls}">${avg}%</span>
            </div>`;
        }).join('');

        if (this.speakingExam.wrongQuestions.length > 0) {
            this.seResultWeak.classList.remove('hidden');
            this.seWeakList.innerHTML = this.speakingExam.wrongQuestions.map(wq =>
                `<li><strong>${wq.question.promptNLShort}</strong> — ${wq.score}%</li>`
            ).join('');
        } else {
            this.seResultWeak.classList.add('hidden');
        }
    }

    // ============================================================
    //  SPEAKING EXAM — SVG PLACEHOLDERS
    // ============================================================
    getPlaceholderSVG(type, alt) {
        const svgs = {
            // Deel 2 placeholders
            womanRunning: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="130" height="100"><rect x="10" y="10" width="180" height="130" rx="8" fill="#eef2ff"/><circle cx="100" cy="55" r="14" stroke-width="2.5"/><line x1="100" y1="69" x2="100" y2="105"/><line x1="100" y1="80" x2="80" y2="95"/><line x1="100" y1="80" x2="120" y2="95"/><line x1="100" y1="105" x2="78" y2="130"/><line x1="100" y1="105" x2="118" y2="118"/><text x="100" y="145" text-anchor="middle" font-size="9" fill="#64748b">park</text></svg>`,
            carAccident: `<svg viewBox="0 0 200 150" fill="none" stroke="#ef4444" stroke-width="3" width="130" height="100"><rect x="10" y="10" width="180" height="130" rx="8" fill="#fef2f2"/><rect x="30" y="55" width="60" height="30" rx="5" fill="#fca5a5"/><rect x="100" y="65" width="60" height="30" rx="5" fill="#fca5a5"/><circle cx="45" cy="90" r="8" stroke-width="2"/><circle cx="115" cy="95" r="8" stroke-width="2"/><text x="100" y="145" text-anchor="middle" font-size="9" fill="#64748b">ongeluk</text></svg>`,
            brokenLeg: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="130" height="100"><rect x="10" y="10" width="180" height="130" rx="8" fill="#eef2ff"/><rect x="60" y="35" width="70" height="55" rx="6" fill="#c7d2fe" stroke-width="2"/><line x1="70" y1="90" x2="50" y2="120"/><line x1="70" y1="90" x2="110" y2="130" stroke="#ef4444"/><circle cx="120" cy="110" r="3" fill="#ef4444"/><text x="100" y="145" text-anchor="middle" font-size="9" fill="#64748b">ziekenhuis</text></svg>`,
            schoolLunch: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="130" height="100"><rect x="10" y="10" width="180" height="130" rx="8" fill="#f0fdf4"/><rect x="60" y="40" width="80" height="45" rx="8" fill="#bbf7d0" stroke-width="2"/><circle cx="80" cy="62" r="5" fill="#ef4444"/><circle cx="110" cy="60" r="5" fill="#f59e0b"/><rect x="70" y="72" width="40" height="8" rx="2" fill="#d4d4d8"/><text x="100" y="145" text-anchor="middle" font-size="9" fill="#64748b">school lunch</text></svg>`,
            trafficJam: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="130" height="100"><rect x="10" y="10" width="180" height="130" rx="8" fill="#fefce8"/><rect x="20" y="55" width="50" height="25" rx="4" fill="#fcd34d" stroke-width="2"/><rect x="80" y="50" width="50" height="25" rx="4" fill="#fcd34d" stroke-width="2"/><rect x="135" y="60" width="50" height="25" rx="4" fill="#fcd34d" stroke-width="2"/><circle cx="35" cy="85" r="6"/><circle cx="95" cy="80" r="6"/><circle cx="150" cy="90" r="6"/><text x="100" y="145" text-anchor="middle" font-size="9" fill="#64748b">file</text></svg>`,
            brushingTeeth: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="130" height="100"><rect x="10" y="10" width="180" height="130" rx="8" fill="#eef2ff"/><circle cx="100" cy="55" r="14" stroke-width="2.5"/><line x1="100" y1="69" x2="100" y2="100"/><line x1="100" y1="80" x2="130" y2="60" stroke="#06b6d4" stroke-width="4"/><rect x="125" y="52" width="20" height="12" rx="3" fill="#cbd5e1" stroke-width="1.5"/><text x="100" y="145" text-anchor="middle" font-size="9" fill="#64748b">tanden poetsen</text></svg>`,
            spilledCoffee: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="130" height="100"><rect x="10" y="10" width="180" height="130" rx="8" fill="#fef2f2"/><rect x="50" y="50" width="100" height="50" rx="6" fill="#e2e8f0" stroke-width="2"/><line x1="70" y1="60" x2="130" y2="60" stroke-width="1.5"/><line x1="70" y1="70" x2="130" y2="70" stroke-width="1.5"/><line x1="70" y1="80" x2="100" y2="80" stroke-width="1.5"/><ellipse cx="130" cy="75" rx="15" ry="6" fill="#a16207" opacity="0.7"/><text x="100" y="145" text-anchor="middle" font-size="9" fill="#64748b">koffie op toetsenbord</text></svg>`,
            atCinema: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="130" height="100"><rect x="10" y="10" width="180" height="130" rx="8" fill="#1e1b4b"/><rect x="30" y="25" width="140" height="75" rx="4" fill="#312e81" stroke="#818cf8"/><circle cx="130" cy="45" r="10" fill="#818cf8"/><rect x="30" y="105" width="140" height="20" rx="3" fill="#4c1d95" stroke="#818cf8" stroke-width="1.5"/><text x="100" y="145" text-anchor="middle" font-size="9" fill="#a5b4fc">bioscoop</text></svg>`,
            bikingToWork: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="130" height="100"><rect x="10" y="10" width="180" height="130" rx="8" fill="#eef2ff"/><circle cx="80" cy="55" r="10" stroke-width="2"/><line x1="80" y1="65" x2="80" y2="95"/><line x1="80" y1="78" x2="60" y2="88"/><line x1="80" y1="78" x2="100" y2="88"/><circle cx="60" cy="108" r="10" stroke-width="2"/><circle cx="105" cy="108" r="10" stroke-width="2"/><line x1="60" y1="108" x2="105" y2="108"/><line x1="80" y1="95" x2="60" y2="108"/><text x="100" y="145" text-anchor="middle" font-size="9" fill="#64748b">fiets naar werk</text></svg>`,
            butcher: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="130" height="100"><rect x="10" y="10" width="180" height="130" rx="8" fill="#fef2f2"/><circle cx="100" cy="50" r="14" stroke-width="2.5"/><line x1="100" y1="64" x2="100" y2="95"/><line x1="100" y1="75" x2="70" y2="85"/><line x1="100" y1="75" x2="130" y2="75"/><line x1="130" y1="75" x2="150" y2="65" stroke="#94a3b8" stroke-width="4"/><text x="100" y="145" text-anchor="middle" font-size="9" fill="#64748b">slager</text></svg>`,

            // Deel 3 & 4 placeholders
            shower: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="10" y="5" width="180" height="140" rx="8" fill="#f0f9ff"/><circle cx="100" cy="55" r="14" stroke-width="2"/><line x1="100" y1="69" x2="100" y2="100"/><line x1="100" y1="80" x2="80" y2="95"/><line x1="100" y1="80" x2="120" y2="95"/><line x1="100" y1="35" x2="100" y2="25" stroke="#06b6d4"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">douche</text></svg>`,
            bathtub: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="10" y="5" width="180" height="140" rx="8" fill="#f0f9ff"/><ellipse cx="100" cy="80" rx="55" ry="25" fill="#bae6fd" stroke-width="2"/><circle cx="100" cy="55" r="10" stroke-width="2"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">bad</text></svg>`,
            modernSchool: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="30" y="20" width="140" height="100" rx="4" fill="#eef2ff"/><rect x="50" y="50" width="40" height="35" rx="2" fill="#c7d2fe"/><rect x="110" y="50" width="40" height="35" rx="2" fill="#c7d2fe"/><text x="100" y="15" text-anchor="middle" font-size="9" fill="#64748b">modern gebouw</text></svg>`,
            oldSchool: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="30" y="20" width="140" height="100" rx="4" fill="#fefce8"/><polygon points="100,10 60,45 140,45" fill="#fcd34d"/><rect x="65" y="60" width="30" height="35" fill="#fef3c7"/><rect x="105" y="60" width="30" height="35" fill="#fef3c7"/><text x="100" y="140" text-anchor="middle" font-size="9" fill="#64748b">oud gebouw</text></svg>`,
            coffee: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="10" y="5" width="180" height="140" rx="8" fill="#fefce8"/><path d="M80 30 L70 90 Q70 105 100 105 Q130 105 130 90 L120 30Z" fill="#a16207" stroke-width="2"/><path d="M120 40 Q140 40 140 60 Q140 80 120 80" fill="none" stroke-width="2"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">koffie</text></svg>`,
            milk: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="75" y="25" width="50" height="90" rx="6" fill="#e0f2fe"/><rect x="65" y="20" width="8" height="15" rx="2" fill="#bae6fd"/><line x1="70" y1="35" x2="130" y2="35" stroke="#94a3b8"/><line x1="70" y1="80" x2="130" y2="80" stroke="#94a3b8"/><text x="100" y="135" text-anchor="middle" font-size="9" fill="#64748b">melk</text></svg>`,
            dunes: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="10" y="5" width="180" height="140" rx="8" fill="#fefce8"/><path d="M10 110 Q40 60 70 105 Q100 55 130 100 Q160 70 190 105" fill="#fcd34d" stroke-width="2"/><text x="100" y="135" text-anchor="middle" font-size="9" fill="#64748b">duinen</text></svg>`,
            cityBike: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="40" y="15" width="50" height="60" rx="3" fill="#e2e8f0"/><rect x="100" y="25" width="50" height="50" rx="3" fill="#e2e8f0"/><rect x="50" y="85" width="30" height="30" rx="3" fill="#cbd5e1"/><text x="100" y="135" text-anchor="middle" font-size="9" fill="#64748b">stad</text></svg>`,
            salad: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><ellipse cx="100" cy="70" rx="50" ry="20" fill="#bbf7d0"/><circle cx="85" cy="62" r="7" fill="#ef4444" opacity="0.8"/><circle cx="115" cy="65" r="5" fill="#f59e0b" opacity="0.8"/><ellipse cx="100" cy="68" rx="25" ry="10" fill="#22c55e" opacity="0.6"/><text x="100" y="135" text-anchor="middle" font-size="9" fill="#64748b">salade</text></svg>`,
            hamburger: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><circle cx="100" cy="45" r="25" fill="#f59e0b" stroke-width="2"/><rect x="75" y="48" width="50" height="6" rx="2" fill="#a16207"/><rect x="75" y="58" width="50" height="6" rx="2" fill="#22c55e"/><rect x="78" y="68" width="44" height="6" rx="2" fill="#ef4444"/><circle cx="100" cy="80" r="22" fill="#f59e0b" stroke-width="2"/><text x="100" y="135" text-anchor="middle" font-size="9" fill="#64748b">hamburger</text></svg>`,
            train: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="30" y="40" width="140" height="55" rx="8" fill="#e0e7ff"/><rect x="50" y="35" width="30" height="15" rx="3" fill="#a5b4fc"/><rect x="110" y="35" width="30" height="15" rx="3" fill="#a5b4fc"/><circle cx="65" cy="100" r="9"/><circle cx="135" cy="100" r="9"/><text x="100" y="135" text-anchor="middle" font-size="9" fill="#64748b">trein</text></svg>`,
            car: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="35" y="50" width="130" height="40" rx="10" fill="#dbeafe"/><rect x="60" y="35" width="55" height="20" rx="5" fill="#bfdbfe"/><circle cx="65" cy="95" r="10"/><circle cx="135" cy="95" r="10"/><text x="100" y="135" text-anchor="middle" font-size="9" fill="#64748b">auto</text></svg>`,
            teacher: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><circle cx="100" cy="35" r="14"/><line x1="100" y1="50" x2="100" y2="85"/><rect x="30" y="90" width="140" height="35" rx="5" fill="#e2e8f0"/><line x1="100" y1="75" x2="50" y2="90" stroke-width="2"/><text x="100" y="135" text-anchor="middle" font-size="9" fill="#64748b">leraar</text></svg>`,
            nurse: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><circle cx="100" cy="35" r="14"/><line x1="100" y1="50" x2="100" y2="85"/><line x1="100" y1="65" x2="70" y2="80" stroke="#ef4444" stroke-width="2"/><rect x="70" y="75" width="20" height="12" rx="3" fill="#fef2f2"/><text x="100" y="135" text-anchor="middle" font-size="9" fill="#64748b">zorg</text></svg>`,
            hotAirBalloon: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="10" y="5" width="180" height="140" rx="8" fill="#f0f9ff"/><circle cx="100" cy="50" r="30" fill="#fbbf24" stroke-width="2"/><line x1="100" y1="50" x2="100" y2="15" stroke="#a16207"/><rect x="90" y="80" width="20" height="25" rx="3" fill="#a16207" stroke-width="2"/><line x1="90" y1="105" x2="75" y2="115"/><line x1="110" y1="105" x2="125" y2="115"/><text x="100" y="140" text-anchor="middle" font-size="9" fill="#64748b">heteluchtballon</text></svg>`,
            parachute: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><path d="M100 15 L40 70 L160 70Z" fill="#fca5a5" stroke-width="2"/><line x1="100" y1="15" x2="100" y2="100"/><circle cx="100" cy="95" r="6"/><line x1="100" y1="100" x2="85" y2="120"/><line x1="100" y1="100" x2="115" y2="120"/><text x="100" y="140" text-anchor="middle" font-size="9" fill="#64748b">parachute</text></svg>`,
            laptop: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="50" y="35" width="100" height="55" rx="4" fill="#e2e8f0"/><rect x="60" y="40" width="80" height="40" rx="2" fill="#cbd5e1"/><rect x="45" y="90" width="110" height="8" rx="3" fill="#94a3b8"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">laptop</text></svg>`,
            desktop: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="60" y="30" width="80" height="50" rx="4" fill="#e2e8f0"/><rect x="65" y="35" width="70" height="38" rx="2" fill="#818cf8" opacity="0.3"/><rect x="75" y="85" width="50" height="8" rx="3" fill="#94a3b8"/><rect x="85" y="93" width="30" height="18" rx="3" fill="#cbd5e1"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">desktop</text></svg>`,
            snackbar: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="30" y="50" width="140" height="70" rx="8" fill="#fef3c7"/><rect x="40" y="60" width="50" height="25" rx="4" fill="#fcd34d"/><text x="100" y="40" text-anchor="middle" font-size="12" font-weight="700" fill="#f59e0b">SNACKBAR</text><text x="100" y="135" text-anchor="middle" font-size="9" fill="#64748b">snackbar</text></svg>`,
            restaurant: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="30" y="50" width="140" height="70" rx="8" fill="#f0fdf4"/><circle cx="70" cy="75" r="12" stroke-width="2"/><circle cx="130" cy="75" r="12" stroke-width="2"/><rect x="80" y="100" width="40" height="12" rx="3" fill="#bbf7d0"/><text x="100" y="135" text-anchor="middle" font-size="9" fill="#64748b">restaurant</text></svg>`,

            // Deel 4 placeholders
            birth: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="60" y="25" width="80" height="45" rx="8" fill="#fce7f3"/><circle cx="100" cy="55" r="10" fill="#f9a8d4"/><text x="100" y="120" text-anchor="middle" font-size="9" fill="#64748b">geboorte</text></svg>`,
            wedding: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><circle cx="100" cy="50" r="12" fill="none"/><line x1="100" y1="62" x2="100" y2="80"/><path d="M100 80 L70 110 L130 110Z" fill="#ffffff" stroke-width="2"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">bruiloft</text></svg>`,
            funeral: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><cross cx="100" cy="60" size="25" stroke-width="3"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">begrafenis</text></svg>`,
            groceries: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="50" y="30" width="45" height="50" rx="5" fill="#fef3c7"/><circle cx="65" cy="50" r="6" fill="#ef4444" opacity="0.7"/><rect x="105" y="40" width="45" height="40" rx="5" fill="#fef3c7"/><ellipse cx="125" cy="55" rx="10" ry="6" fill="#22c55e" opacity="0.7"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">boodschappen</text></svg>`,
            cooking: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="60" y="35" width="80" height="45" rx="8" fill="#fef2f2"/><line x1="70" y1="50" x2="130" y2="50"/><circle cx="85" cy="60" r="10" fill="#fca5a5" stroke-width="2"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">koken</text></svg>`,
            washing: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="70" y="30" width="60" height="50" rx="8" fill="#e0f2fe"/><line x1="80" y1="45" x2="120" y2="45"/><line x1="100" y1="60" x2="100" y2="20" stroke="#06b6d4" stroke-width="2"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">afwassen</text></svg>`,
            rain: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="10" y="5" width="180" height="140" rx="8" fill="#e0f2fe"/><ellipse cx="100" cy="45" rx="40" ry="15" fill="#93c5fd" stroke-width="2"/><line x1="70" y1="60" x2="65" y2="80" stroke="#60a5fa"/><line x1="100" y1="60" x2="95" y2="80" stroke="#60a5fa"/><line x1="130" y1="60" x2="125" y2="80" stroke="#60a5fa"/><text x="100" y="135" text-anchor="middle" font-size="9" fill="#64748b">regen</text></svg>`,
            wind: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="10" y="5" width="180" height="140" rx="8" fill="#fefce8"/><path d="M30 60 Q60 45 90 60" stroke="#94a3b8"/><path d="M50 80 Q80 65 110 80" stroke="#94a3b8"/><path d="M40 100 Q70 85 100 100" stroke="#94a3b8"/><text x="100" y="135" text-anchor="middle" font-size="9" fill="#64748b">wind</text></svg>`,
            snow: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="10" y="5" width="180" height="140" rx="8" fill="#f8fafc"/><ellipse cx="100" cy="45" rx="45" ry="18" fill="#e2e8f0" stroke-width="2"/><circle cx="70" cy="75" r="3" fill="#cbd5e1"/><circle cx="100" cy="85" r="3" fill="#cbd5e1"/><circle cx="130" cy="72" r="3" fill="#cbd5e1"/><circle cx="85" cy="95" r="3" fill="#cbd5e1"/><text x="100" y="135" text-anchor="middle" font-size="9" fill="#64748b">sneeuw</text></svg>`,
            hairWash: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><circle cx="80" cy="45" r="14"/><line x1="80" y1="59" x2="80" y2="80"/><line x1="80" y1="68" x2="120" y2="55" stroke="#06b6d4"/><circle cx="120" cy="55" r="8" fill="#e0f2fe" stroke-width="2"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">haren wassen</text></svg>`,
            hairCut: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><circle cx="80" cy="45" r="14"/><line x1="80" y1="59" x2="80" y2="80"/><line x1="80" y1="60" x2="120" y2="50" stroke="#94a3b8"/><line x1="80" y1="62" x2="120" y2="55" stroke="#94a3b8"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">haren knippen</text></svg>`,
            sweep: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><line x1="130" y1="45" x2="130" y2="95" stroke="#94a3b8"/><line x1="110" y1="70" x2="60" y2="100" stroke="#cbd5e1"/><line x1="70" y1="80" x2="40" y2="95"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">vegen</text></svg>`,
            soap: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="50" y="40" width="40" height="30" rx="8" fill="#a5f3fc" stroke-width="2"/><line x1="80" y1="55" x2="120" y2="60" stroke="#67e8f9" stroke-width="3"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">zeep</text></svg>`,
            washHands: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><ellipse cx="100" cy="50" rx="30" ry="10" fill="#e0f2fe"/><line x1="100" y1="50" x2="100" y2="70" stroke="#06b6d4" stroke-width="3"/><circle cx="80" cy="45" r="5"/><circle cx="120" cy="45" r="5"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">handen wassen</text></svg>`,
            dryHands: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="50" y="45" width="100" height="35" rx="5" fill="#fef3c7"/><line x1="60" y1="55" x2="90" y2="55"/><line x1="60" y1="65" x2="90" y2="65"/><circle cx="110" cy="60" r="8"/><circle cx="130" cy="60" r="8"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">handen drogen</text></svg>`,
            laptopBag: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="45" y="30" width="110" height="65" rx="10" fill="#e2e8f0"/><rect x="55" y="40" width="90" height="40" rx="3" fill="#cbd5e1"/><path d="M45 45 Q100 30 155 45" fill="none" stroke-width="2"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">laptoptas</text></svg>`,
            toiletryBag: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="55" y="40" width="90" height="45" rx="8" fill="#fce7f3"/><rect x="65" y="50" width="20" height="25" rx="3" fill="#f9a8d4"/><circle cx="110" cy="60" r="8" fill="#d8b4fe"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">toilettas</text></svg>`,
            suitcase: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="55" y="35" width="90" height="60" rx="8" fill="#dbeafe"/><rect x="75" y="30" width="50" height="12" rx="4" fill="#bfdbfe"/><line x1="85" y1="55" x2="115" y2="55"/><line x1="85" y1="70" x2="115" y2="70"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">rolkoffer</text></svg>`,
            sandwich: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><polygon points="60,40 140,40 120,80 80,80" fill="#fcd34d"/><polygon points="65,45 135,45 118,75 82,75" fill="#22c55e" opacity="0.5"/><rect x="80" y="55" width="40" height="15" rx="2" fill="#a16207"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">broodje</text></svg>`,
            coffeeCup: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><path d="M70 35 L65 95 Q65 105 100 105 Q135 105 135 95 L130 35Z" fill="#a16207" stroke-width="2"/><path d="M130 45 Q150 45 150 65 Q150 85 130 85" fill="none" stroke-width="2"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">koffie</text></svg>`,
            atComputer: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="60" y="45" width="80" height="45" rx="4" fill="#e2e8f0"/><rect x="65" y="50" width="70" height="33" rx="2" fill="#818cf8" opacity="0.3"/><circle cx="100" cy="35" r="10"/><line x1="100" y1="45" x2="100" y2="60"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">computer</text></svg>`,
            fruit: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><circle cx="80" cy="55" r="15" fill="#ef4444" opacity="0.7"/><circle cx="120" cy="50" r="12" fill="#f59e0b" opacity="0.7"/><ellipse cx="100" cy="75" rx="18" ry="10" fill="#22c55e" opacity="0.7"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">fruit</text></svg>`,
            vegetables: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><circle cx="70" cy="55" r="15" fill="#f97316" opacity="0.7"/><ellipse cx="120" cy="50" rx="10" ry="18" fill="#ef4444" opacity="0.7"/><rect x="85" y="70" width="30" height="15" rx="4" fill="#22c55e" opacity="0.7"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">groenten</text></svg>`,
            cookies: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="60" y="40" width="80" height="50" rx="6" fill="#fcd34d"/><circle cx="80" cy="60" r="6" fill="#a16207"/><circle cx="105" cy="55" r="6" fill="#a16207"/><circle cx="120" cy="68" r="6" fill="#a16207"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">koekjes</text></svg>`,
            bricks: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="60" y="40" width="30" height="18" rx="2" fill="#f87171"/><rect x="95" y="40" width="30" height="18" rx="2" fill="#f87171"/><rect x="130" y="40" width="30" height="18" rx="2" fill="#f87171"/><rect x="70" y="62" width="30" height="18" rx="2" fill="#f87171"/><rect x="105" y="62" width="30" height="18" rx="2" fill="#f87171"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">stenen</text></svg>`,
            wall: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="50" y="35" width="100" height="65" rx="2" fill="#fecaca"/><line x1="75" y1="35" x2="75" y2="100"/><line x1="100" y1="35" x2="100" y2="100"/><line x1="125" y1="35" x2="125" y2="100"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">muur</text></svg>`,
            roof: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><polygon points="100,25 40,70 160,70" fill="#fca5a5"/><rect x="60" y="70" width="80" height="35" fill="#fecaca"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">dak</text></svg>`,
            eating: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><rect x="60" y="55" width="80" height="35" rx="6" fill="#f0fdf4"/><circle cx="85" cy="72" r="8" fill="#d4d4d8"/><line x1="110" y1="65" x2="130" y2="75"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">eten</text></svg>`,
            wine: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><path d="M85 35 L95 95 L105 95 L115 35Z" fill="#dc2626" opacity="0.6" stroke-width="2"/><line x1="85" y1="35" x2="115" y2="35"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">rode wijn</text></svg>`,
            withBrother: `<svg viewBox="0 0 200 150" fill="none" stroke="#6366f1" stroke-width="3" width="100" height="80"><circle cx="70" cy="50" r="12"/><line x1="70" y1="62" x2="70" y2="85"/><circle cx="130" cy="55" r="12"/><line x1="130" y1="67" x2="130" y2="85"/><line x1="70" y1="75" x2="130" y2="78"/><text x="100" y="130" text-anchor="middle" font-size="9" fill="#64748b">met broer</text></svg>`,
        };

        return svgs[type] || `<svg viewBox="0 0 200 150" fill="none" stroke="#94a3b8" stroke-width="2" width="100" height="80"><rect x="10" y="10" width="180" height="130" rx="8" fill="#f8fafc"/><text x="100" y="80" text-anchor="middle" font-size="12" fill="#94a3b8">${alt || type}</text></svg>`;
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
