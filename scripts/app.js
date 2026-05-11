import { medicalVocab } from './data.js';
import { generalVocab } from './generalData.js';
import { knsData } from './knsData.js';


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
            data: []
        };

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
        this.modePicWrite.addEventListener('click', () => this.switchMode('picwriting'));
        this.modeKnsQuiz.addEventListener('click', () => this.switchMode('knsquiz'));

        // ---- KNS Quiz events ----
        this.knsBackToTopics.addEventListener('click', () => {
            this.knsPlayContainer.classList.add('hidden');
            this.knsTopicsContainer.classList.remove('hidden');
        });

        this.knsSubmitBtn.addEventListener('click', () => this.submitKnsAnswer());
        this.knsNextBtn.addEventListener('click', () => this.nextKnsQuestion());
        this.knsRestartTopicBtn.addEventListener('click', () => this.startKnsTopic(this.knsQuiz.topic));
        this.knsFinishBtn.addEventListener('click', () => {
            this.knsResultContainer.classList.add('hidden');
            this.knsTopicsContainer.classList.remove('hidden');
        });

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

        this.flashcardSection.classList.toggle('hidden', newMode !== 'flashcard');
        this.spellingSection.classList.toggle('hidden', newMode !== 'spelling');
        this.speakingSection.classList.toggle('hidden', newMode !== 'speaking');
        this.quizSection.classList.toggle('hidden', newMode !== 'quiz');
        this.vulinSection.classList.toggle('hidden', newMode !== 'vulin');
        this.writingSection.classList.toggle('hidden', newMode !== 'writing');
        this.picWritingSection.classList.toggle('hidden', newMode !== 'picwriting');
        this.knsQuizSection.classList.toggle('hidden', newMode !== 'knsquiz');

        if (newMode === 'knsquiz') {
            this.initKnsTopics();
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

        // Show Pic Write and KNS Quiz buttons only for General domain
        this.modePicWrite.style.display = (newDomain === 'general') ? '' : 'none';
        this.modeKnsQuiz.style.display = (newDomain === 'general') ? '' : 'none';

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
        Object.keys(knsData).forEach((topic, idx) => {
            const itemCount = knsData[topic].length;
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

            // Accordion toggle
            item.querySelector('.kns-header').addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                document.querySelectorAll('.kns-item').forEach(el => el.classList.remove('active'));
                if (!isActive) item.classList.add('active');
            });

            // Start btn
            item.querySelector('.start-topic-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.startKnsTopic(topic);
            });

            this.knsAccordion.appendChild(item);
        });
    }

    startKnsTopic(topicName) {
        this.knsQuiz.topic = topicName;
        this.knsQuiz.index = 0;
        this.knsQuiz.score = 0;
        this.knsQuiz.selected = null;
        this.knsQuiz.isAnswered = false;
        this.knsQuiz.wrongQuestions = [];
        this.knsQuiz.data = [...knsData[topicName]].sort(() => Math.random() - 0.5);

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
        this.knsPlayContainer.classList.add('hidden');
        this.knsResultContainer.classList.remove('hidden');

        const total = this.knsQuiz.data.length;
        const score = this.knsQuiz.score;
        const pct = total > 0 ? Math.round((score / total) * 100) : 0;
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
