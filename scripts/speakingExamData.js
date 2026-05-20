// ============================================================
//  SPEAKING EXAM DATA — A2 Spreken Examen Vraagbank
//  Based on official DUO A2 speaking exam formats (2021-2025)
//  Four question types matching the real exam structure
// ============================================================

export const speakingExamData = {

  // ============================================================
  //  DEEL 1: VRAGEN MET EEN VIDEO / PERSOONLIJKE VRAGEN
  //  User hears a short spoken question, gives personal answer
  //  Model: 2-4 sentences, ~20 seconds speaking time
  // ============================================================
  "Vraag & Antwoord": [
    {
      id: "va-1",
      type: "vraagAntwoord",
      promptNL: "Ik douche me elke dag. Hoe vaak doucht u zich? Vertel ook wanneer u zich doucht.",
      promptNLShort: "Hoe vaak doucht u zich?",
      modelAnswer: "Ik douche me ook elke dag. Ik douche meestal in de ochtend.",
      keywords: ["douche", "elke dag", "ochtend", "avond", "soms", "vaak"],
      minWords: 6,
      minSentences: 2,
      images: []
    },
    {
      id: "va-2",
      type: "vraagAntwoord",
      promptNL: "Ik maak graag huiswerk op mijn slaapkamer. Waar maakt u graag huiswerk? Vertel ook waarom.",
      promptNLShort: "Waar maakt u graag huiswerk?",
      modelAnswer: "Ik maak ook graag mijn huiswerk in mijn slaapkamer. Dan kan ik rustig werken.",
      keywords: ["slaapkamer", "rustig", "werken", "tafel", "bibliotheek", "thuis", "stil", "concentreren"],
      minWords: 6,
      minSentences: 2,
      images: []
    },
    {
      id: "va-3",
      type: "vraagAntwoord",
      promptNL: "Ik neem elke dag twee keer pauze op mijn werk. Hoe vaak neemt u pauze? Vertel ook wat u dan doet.",
      promptNLShort: "Hoe vaak neemt u pauze?",
      modelAnswer: "Ik neem ook elke dag twee keer pauze op mijn werk. Dan eet ik een broodje en drink ik een glas water.",
      keywords: ["pauze", "twee keer", "broodje", "water", "koffie", "thee", "eten", "drinken", "rusten"],
      minWords: 8,
      minSentences: 2,
      images: []
    },
    {
      id: "va-4",
      type: "vraagAntwoord",
      promptNL: "Ik doe meestal op vrijdag de boodschappen. Wat vindt u een fijne dag om boodschappen te doen? Vertel ook waarom u dat vindt.",
      promptNLShort: "Fijne dag voor boodschappen?",
      modelAnswer: "Ik vind het ook fijn om op vrijdag boodschappen te doen. Op zaterdag vind ik het te druk.",
      keywords: ["vrijdag", "zaterdag", "zondag", "druk", "rustig", "ochtend", "middag", "supermarkt"],
      minWords: 8,
      minSentences: 2,
      images: []
    },
    {
      id: "va-5",
      type: "vraagAntwoord",
      promptNL: "Ik praat elke dag met mijn buren. Hoe vaak praat u met uw buren? Vertel ook wat u van uw buren vindt.",
      promptNLShort: "Hoe vaak praat u met uw buren?",
      modelAnswer: "Ik praat ook elke dag met mijn buren. Mijn buren zijn heel aardig.",
      keywords: ["buren", "elke dag", "soms", "aardig", "vriendelijk", "helpen", "praten", "contact"],
      minWords: 6,
      minSentences: 2,
      images: []
    },
    {
      id: "va-6",
      type: "vraagAntwoord",
      promptNL: "Ik eet mijn ontbijt altijd om 8 uur. Hoe laat eet u uw ontbijt? Vertel ook wat u meestal eet bij uw ontbijt.",
      promptNLShort: "Hoe laat eet u ontbijt?",
      modelAnswer: "Ik eet bijna nooit ontbijt. Ik drink meestal alleen een kopje koffie op mijn werk.",
      keywords: ["ontbijt", "koffie", "brood", "kaas", "melk", "ochtend", "eten", "drinken", "vroeg", "laat"],
      minWords: 8,
      minSentences: 2,
      images: []
    },
    {
      id: "va-7",
      type: "vraagAntwoord",
      promptNL: "Het is zaterdag en het regent buiten. Wat doet u dan? Vertel ook wat u doet als de zon schijnt.",
      promptNLShort: "Wat doet u als het regent?",
      modelAnswer: "Ik maak dan mijn huis schoon. Als de zon schijnt, ga ik meestal naar het park of doe ik de boodschappen.",
      keywords: ["regen", "zon", "huis", "schoonmaken", "park", "boodschappen", "binnen", "buiten", "wandelen"],
      minWords: 10,
      minSentences: 3,
      images: []
    },
    {
      id: "va-8",
      type: "vraagAntwoord",
      promptNL: "Ik doe allerlei dingen om gezond te blijven. Wat doet u allemaal om gezond te blijven?",
      promptNLShort: "Wat doet u om gezond te blijven?",
      modelAnswer: "Ik doe veel aan sport. Ik eet niet zo veel en ik drink geen alcohol.",
      keywords: ["sport", "eten", "drinken", "gezond", "alcohol", "wandelen", "fietsen", "slapen", "fruit", "groenten"],
      minWords: 8,
      minSentences: 2,
      images: []
    },
    {
      id: "va-9",
      type: "vraagAntwoord",
      promptNL: "Ik ga één keer per week naar de bibliotheek. Hoe vaak gaat u naar de bibliotheek? Vertel ook wat u daar dan doet.",
      promptNLShort: "Hoe vaak gaat u naar de bibliotheek?",
      modelAnswer: "Ik ga één keer per week naar de bibliotheek. Ik ga dan naar een taalcafé.",
      keywords: ["bibliotheek", "boeken", "lezen", "leren", "taalcafé", "cursus", "computer", "rustig"],
      minWords: 8,
      minSentences: 2,
      images: []
    },
    {
      id: "va-10",
      type: "vraagAntwoord",
      promptNL: "Ik vind de winter een heerlijk seizoen. Welk seizoen vindt u het prettigst? Vertel ook waarom.",
      promptNLShort: "Welk seizoen vindt u het prettigst?",
      modelAnswer: "Ik vind de zomer het prettigst. In de zomer is het lekker warm.",
      keywords: ["zomer", "winter", "herfst", "lente", "warm", "koud", "zon", "vakantie", "buiten"],
      minWords: 8,
      minSentences: 2,
      images: []
    },
    {
      id: "va-11",
      type: "vraagAntwoord",
      promptNL: "Ik ga drie keer per jaar op vakantie. Hoe vaak gaat u op vakantie? En waar gaat u dan naar toe?",
      promptNLShort: "Hoe vaak gaat u op vakantie?",
      modelAnswer: "Ik ga één keer per jaar op vakantie. Ik ga naar Thailand.",
      keywords: ["vakantie", "jaar", "land", "strand", "stad", "vliegtuig", "hotel", "familie", "zon"],
      minWords: 8,
      minSentences: 2,
      images: []
    },
    {
      id: "va-12",
      type: "vraagAntwoord",
      promptNL: "Wat is uw moedertaal en welke talen spreekt u nog meer?",
      promptNLShort: "Wat is uw moedertaal?",
      modelAnswer: "Mijn moedertaal is Engels. Ik spreek Engels en een klein beetje Nederlands.",
      keywords: ["moedertaal", "taal", "spreken", "Engels", "Nederlands", "leren", "cursus"],
      minWords: 6,
      minSentences: 2,
      images: []
    }
  ],

  // ============================================================
  //  DEEL 2: VRAGEN MET ÉÉN PLAATJE
  //  User sees one image, describes what they see
  //  Model: 2-4 sentences describing person/place/action/problem
  // ============================================================
  "Plaatjes Beschrijven": [
    {
      id: "pb-1",
      type: "plaatjesBeschrijven",
      promptNL: "Kijk naar het plaatje. Dit is Karine. Vertel drie dingen over Karine. Gebruik het plaatje.",
      promptNLShort: "Vertel over Karine",
      modelAnswer: "De vrouw is in een park. Ze is aan het hardlopen. Ze draagt een zwarte broek en rode sportschoenen.",
      keywords: ["park", "hardlopen", "vrouw", "broek", "schoenen", "sportief", "buiten", "rennen"],
      minWords: 8,
      minSentences: 3,
      images: [{ svg: "womanRunning", alt: "Een vrouw die hardloopt in het park" }]
    },
    {
      id: "pb-2",
      type: "plaatjesBeschrijven",
      promptNL: "Kijk naar het plaatje. Wat is er gebeurd? Vertel ook wanneer u dit voor het laatst gezien heeft. Gebruik het plaatje.",
      promptNLShort: "Wat is er gebeurd?",
      modelAnswer: "Ik zie twee auto's in een auto-ongeluk. Ik heb nog nooit een ongeluk gezien.",
      keywords: ["auto", "ongeluk", "ongeluk", "botsing", "straat", "politie", "kapot", "gevaarlijk", "gezien"],
      minWords: 8,
      minSentences: 2,
      images: [{ svg: "carAccident", alt: "Twee auto's in een ongeluk" }]
    },
    {
      id: "pb-3",
      type: "plaatjesBeschrijven",
      promptNL: "Kijk naar het plaatje. Vertel wat u ziet. Vertel ook waar u dit kunt zien. Gebruik het plaatje.",
      promptNLShort: "Wat ziet u?",
      modelAnswer: "Ik zie een man met een gebroken been. Ik kan dit in een ziekenhuis zien.",
      keywords: ["man", "gebroken", "been", "ziekenhuis", "dokter", "gips", "pijn", "bed"],
      minWords: 8,
      minSentences: 2,
      images: [{ svg: "brokenLeg", alt: "Een man met een gebroken been in het ziekenhuis" }]
    },
    {
      id: "pb-4",
      type: "plaatjesBeschrijven",
      promptNL: "Kijk naar het plaatje. Sam luncht op school. Vertel wat Sam kan eten. Vertel ook wat u van dit eten vindt. Gebruik het plaatje.",
      promptNLShort: "Wat eet Sam op school?",
      modelAnswer: "Sam kan gezond eten. Ik zie onder andere tomaatjes en paprika. Ik vind dit eten heel goed.",
      keywords: ["eten", "gezond", "tomaat", "paprika", "fruit", "brood", "school", "lunch", "goed", "lekker"],
      minWords: 8,
      minSentences: 3,
      images: [{ svg: "schoolLunch", alt: "Een gezonde lunch op school" }]
    },
    {
      id: "pb-5",
      type: "plaatjesBeschrijven",
      promptNL: "Kijk naar het plaatje. Jafar komt te laat op zijn werk. Waarom komt hij te laat? Vertel ook wat hij nu moet doen. Gebruik het plaatje.",
      promptNLShort: "Waarom komt Jafar te laat?",
      modelAnswer: "Jafar komt te laat omdat hij in de file staat. Hij moet nu zijn baas bellen.",
      keywords: ["te laat", "file", "auto", "baas", "bellen", "werk", "weg", "druk"],
      minWords: 8,
      minSentences: 2,
      images: [{ svg: "trafficJam", alt: "Een man in de file in zijn auto" }]
    },
    {
      id: "pb-6",
      type: "plaatjesBeschrijven",
      promptNL: "Kijk naar het plaatje. Wat doet de vrouw? Vertel ook hoe vaak ze dat doet. Gebruik het plaatje.",
      promptNLShort: "Wat doet de vrouw?",
      modelAnswer: "De vrouw is haar tanden aan het poetsen. Dit doet ze drie keer per dag.",
      keywords: ["vrouw", "tanden", "poetsen", "drie keer", "dag", "ochtend", "avond", "badkamer"],
      minWords: 8,
      minSentences: 2,
      images: [{ svg: "brushingTeeth", alt: "Een vrouw die haar tanden poetst" }]
    },
    {
      id: "pb-7",
      type: "plaatjesBeschrijven",
      promptNL: "Kijk naar het plaatje. Paula heeft een computer. Wat is het probleem? Wat kan zij het beste doen? Gebruik het plaatje.",
      promptNLShort: "Wat is het probleem met de computer?",
      modelAnswer: "De koffie valt op het toetsenbord. Zij moet een nieuw toetsenbord kopen.",
      keywords: ["computer", "koffie", "toetsenbord", "kapot", "probleem", "kopen", "nieuw", "vies"],
      minWords: 8,
      minSentences: 2,
      images: [{ svg: "spilledCoffee", alt: "Koffie gemorst op een toetsenbord" }]
    },
    {
      id: "pb-8",
      type: "plaatjesBeschrijven",
      promptNL: "Kijk naar het plaatje. Dit is Diego. Hij houdt van uitgaan. Wat doet hij en waar is hij volgens u? Gebruik het plaatje.",
      promptNLShort: "Wat doet Diego?",
      modelAnswer: "Hij kijkt naar een film. Hij is in een bioscoop.",
      keywords: ["film", "bioscoop", "kijken", "uitgaan", "stoel", "scherm", "avond"],
      minWords: 6,
      minSentences: 2,
      images: [{ svg: "atCinema", alt: "Een man in de bioscoop" }]
    },
    {
      id: "pb-9",
      type: "plaatjesBeschrijven",
      promptNL: "Kijk naar het plaatje. Dit is Henk. Hij gaat naar zijn werk. Hoe reist hij? En hoelang moet hij reizen naar zijn werk? Gebruik het plaatje.",
      promptNLShort: "Hoe reist Henk naar zijn werk?",
      modelAnswer: "Hij gaat met de fiets. Hij reist ongeveer tien minuten.",
      keywords: ["fiets", "werk", "tien minuten", "reizen", "snel", "makkelijk", "gezond"],
      minWords: 8,
      minSentences: 2,
      images: [{ svg: "bikingToWork", alt: "Een man die fietst naar zijn werk" }]
    },
    {
      id: "pb-10",
      type: "plaatjesBeschrijven",
      promptNL: "Kijk naar het plaatje. Dit is Mario. Wat is zijn beroep? Wat heeft hij in zijn rechterhand? Gebruik het plaatje.",
      promptNLShort: "Wat is het beroep van Mario?",
      modelAnswer: "Hij is slager. Hij heeft een mes in zijn hand.",
      keywords: ["slager", "mes", "hand", "vlees", "winkel", "werk", "beroep"],
      minWords: 6,
      minSentences: 2,
      images: [{ svg: "butcher", alt: "Een slager met een mes in zijn hand" }]
    }
  ],

  // ============================================================
  //  DEEL 3: VRAGEN MET TWEE PLAATJES (KIEZEN & UITLEGGEN)
  //  User sees two images, must choose one and explain why
  //  Model: 2-4 sentences stating choice + reason
  // ============================================================
  "Kiezen & Uitleggen": [
    {
      id: "ku-1",
      type: "kiezenUitleggen",
      promptNL: "Kijk naar de plaatjes. Veel mensen wassen zich elke dag. Hoe wast u zich? Vertel ook waarom. Kies één van de plaatjes.",
      promptNLShort: "Hoe wast u zich?",
      choicePrompt: "Kies: douche of bad",
      modelAnswer: "Ik neem liever een douche. Dat gebruikt minder water.",
      keywords: ["douche", "bad", "water", "warm", "snel", "makkelijk", "lekker", "wassen", "ochtend"],
      minWords: 8,
      minSentences: 2,
      images: [
        { svg: "shower", alt: "Een douche" },
        { svg: "bathtub", alt: "Een bad" }
      ]
    },
    {
      id: "ku-2",
      type: "kiezenUitleggen",
      promptNL: "Kijk naar de plaatjes. U volgt een opleiding. In welk gebouw hebt u liever les? Vertel ook waarom. Kies één van de plaatjes.",
      promptNLShort: "In welk gebouw hebt u liever les?",
      choicePrompt: "Kies: modern gebouw of oud gebouw",
      modelAnswer: "Ik heb liever les in het gebouw aan de linkerkant. Ik vind dit gebouw prachtig.",
      keywords: ["gebouw", "les", "modern", "oud", "mooi", "groot", "school", "raam", "licht"],
      minWords: 8,
      minSentences: 2,
      images: [
        { svg: "modernSchool", alt: "Een modern schoolgebouw" },
        { svg: "oldSchool", alt: "Een oud schoolgebouw" }
      ]
    },
    {
      id: "ku-3",
      type: "kiezenUitleggen",
      promptNL: "Kijk naar de plaatjes. Wat drinkt u liever? Vertel ook wanneer u dit graag drinkt. Kies één van de plaatjes.",
      promptNLShort: "Wat drinkt u liever?",
      choicePrompt: "Kies: koffie of melk",
      modelAnswer: "Ik drink liever melk. Ik drink graag melk in de ochtend.",
      keywords: ["koffie", "melk", "ochtend", "avond", "warm", "koud", "drinken", "lekker", "suiker"],
      minWords: 8,
      minSentences: 2,
      images: [
        { svg: "coffee", alt: "Een kop koffie" },
        { svg: "milk", alt: "Een glas melk" }
      ]
    },
    {
      id: "ku-4",
      type: "kiezenUitleggen",
      promptNL: "Kijk naar de plaatjes. U gaat op vakantie met de fiets. Waar fietst u liever? Vertel ook waarom. Kies één van de plaatjes.",
      promptNLShort: "Waar fietst u liever?",
      choicePrompt: "Kies: duinen of stad",
      modelAnswer: "Ik fiets liever door de duinen. Het uitzicht is prachtig.",
      keywords: ["fiets", "duinen", "stad", "natuur", "mooi", "uitzicht", "rustig", "druk", "vakantie"],
      minWords: 8,
      minSentences: 2,
      images: [
        { svg: "dunes", alt: "Fietsen door de duinen" },
        { svg: "cityBike", alt: "Fietsen in de stad" }
      ]
    },
    {
      id: "ku-5",
      type: "kiezenUitleggen",
      promptNL: "Kijk naar de plaatjes. Wat eet u liever? Vertel ook waarom. Kies één van de plaatjes.",
      promptNLShort: "Wat eet u liever?",
      choicePrompt: "Kies: salade of hamburger",
      modelAnswer: "Ik eet liever een salade. Dat vind ik veel lekkerder dan een hamburger.",
      keywords: ["salade", "hamburger", "gezond", "lekker", "eten", "groenten", "vlees", "snel", "lunch"],
      minWords: 8,
      minSentences: 2,
      images: [
        { svg: "salad", alt: "Een salade" },
        { svg: "hamburger", alt: "Een hamburger" }
      ]
    },
    {
      id: "ku-6",
      type: "kiezenUitleggen",
      promptNL: "Kijk naar de plaatjes. Hoe reist u vaker? Vertel ook waar u dan naartoe gaat. Kies één van de plaatjes.",
      promptNLShort: "Hoe reist u vaker?",
      choicePrompt: "Kies: trein of auto",
      modelAnswer: "Ik reis vaker met de trein. Ik ga dan naar Amsterdam.",
      keywords: ["trein", "auto", "Amsterdam", "werk", "snel", "makkelijk", "station", "rijden", "reizen"],
      minWords: 8,
      minSentences: 2,
      images: [
        { svg: "train", alt: "Een trein" },
        { svg: "car", alt: "Een auto" }
      ]
    },
    {
      id: "ku-7",
      type: "kiezenUitleggen",
      promptNL: "Kijk naar de plaatjes. Welk beroep past beter bij u? Vertel ook waarom. Kies één van de plaatjes.",
      promptNLShort: "Welk beroep past bij u?",
      choicePrompt: "Kies: leraar of zorgmedewerker",
      modelAnswer: "Leraar past beter bij mij. Ik vind het leuk op school.",
      keywords: ["leraar", "zorg", "school", "ziekenhuis", "mensen", "helpen", "werk", "leuk", "kinderen"],
      minWords: 8,
      minSentences: 2,
      images: [
        { svg: "teacher", alt: "Een leraar voor de klas" },
        { svg: "nurse", alt: "Een zorgmedewerker" }
      ]
    },
    {
      id: "ku-8",
      type: "kiezenUitleggen",
      promptNL: "Kijk naar de plaatjes. U wilt iets nieuws proberen. Wat doet u liever? Vertel ook waarom. Kies één van de plaatjes.",
      promptNLShort: "Wat wilt u proberen?",
      choicePrompt: "Kies: heteluchtballon of parachutespringen",
      modelAnswer: "Ik neem liever een heteluchtballonvaart. Dat is veiliger.",
      keywords: ["heteluchtballon", "parachute", "veilig", "hoog", "vliegen", "mooi", "spannend", "eng"],
      minWords: 8,
      minSentences: 2,
      images: [
        { svg: "hotAirBalloon", alt: "Een heteluchtballon" },
        { svg: "parachute", alt: "Parachutespringen" }
      ]
    },
    {
      id: "ku-9",
      type: "kiezenUitleggen",
      promptNL: "Kijk naar de plaatjes. Gebruikt u liever een laptop of een grote computer? Vertel ook waarom. Kies één van de plaatjes.",
      promptNLShort: "Laptop of grote computer?",
      choicePrompt: "Kies: laptop of desktop computer",
      modelAnswer: "Ik gebruik liever een grote computer. Dat is beter voor mijn ogen.",
      keywords: ["laptop", "computer", "scherm", "ogen", "werk", "thuis", "makkelijk", "groot", "klein"],
      minWords: 8,
      minSentences: 2,
      images: [
        { svg: "laptop", alt: "Een laptop" },
        { svg: "desktop", alt: "Een grote computer" }
      ]
    },
    {
      id: "ku-10",
      type: "kiezenUitleggen",
      promptNL: "Kijk naar de plaatjes. Waar gaat u liever uit eten? Vertel ook hoe vaak u daar naar toe gaat. Kies één van de plaatjes.",
      promptNLShort: "Waar eet u liever?",
      choicePrompt: "Kies: snackbar of restaurant",
      modelAnswer: "Ik ga liever naar een snackbar. Ik ga elke week.",
      keywords: ["snackbar", "restaurant", "eten", "goedkoop", "duur", "vaak", "soms", "lekker"],
      minWords: 8,
      minSentences: 2,
      images: [
        { svg: "snackbar", alt: "Een snackbar" },
        { svg: "restaurant", alt: "Een restaurant" }
      ]
    }
  ],

  // ============================================================
  //  DEEL 4: VRAGEN MET DRIE PLAATJES (VERHAAL VERTELLEN)
  //  User sees 3 images in sequence, describes all of them
  //  Model: 4-6 sentences covering each image
  // ============================================================
  "Verhaal Vertellen": [
    {
      id: "vv-1",
      type: "verhaalVertellen",
      promptNL: "Kijk naar de plaatjes. U ziet drie gebeurtenissen in het leven. Vertel wat deze gebeurtenissen zijn. Gebruik alle plaatjes.",
      promptNLShort: "Drie gebeurtenissen in het leven",
      modelAnswer: "In het eerste plaatje vieren we de geboorte van een kind. In het tweede plaatje zie ik een bruiloft. En in het derde plaatje een begrafenis.",
      keywords: ["geboorte", "bruiloft", "begrafenis", "feest", "familie", "mensen", "blij", "verdrietig", "leven", "vieren"],
      minWords: 12,
      minSentences: 3,
      images: [
        { svg: "birth", alt: "Geboorte van een kind" },
        { svg: "wedding", alt: "Een bruiloft" },
        { svg: "funeral", alt: "Een begrafenis" }
      ]
    },
    {
      id: "vv-2",
      type: "verhaalVertellen",
      promptNL: "Kijk naar de plaatjes. Els heeft gasten vanavond. Vertel wat Els vandaag moet doen. Vertel ook wanneer u voor het laatst gasten in uw huis had. Gebruik alle plaatjes.",
      promptNLShort: "Els heeft gasten",
      modelAnswer: "Els moet eerst boodschappen doen. Daarna moet ze koken. En na het bezoek moet ze afwassen. Ik had afgelopen weekend gasten bij mij thuis.",
      keywords: ["boodschappen", "koken", "afwassen", "gasten", "thuis", "eten", "schoonmaken", "bezoek", "gezellig"],
      minWords: 14,
      minSentences: 4,
      images: [
        { svg: "groceries", alt: "Boodschappen doen" },
        { svg: "cooking", alt: "Koken" },
        { svg: "washing", alt: "Afwassen" }
      ]
    },
    {
      id: "vv-3",
      type: "verhaalVertellen",
      promptNL: "Kijk naar de plaatjes. U ziet drie verschillende soorten weer. Vertel wat u ziet. Vertel ook welk weer u het liefst heeft. Gebruik alle plaatjes.",
      promptNLShort: "Drie soorten weer",
      modelAnswer: "In het eerste plaatje regent het. In het tweede plaatje is er heel veel wind. En in het derde plaatje sneeuwt het. Ik heb liever een dag met regen. Dat is gezellig.",
      keywords: ["regen", "wind", "sneeuw", "weer", "koud", "warm", "gezellig", "buiten", "binnen", "zon"],
      minWords: 14,
      minSentences: 4,
      images: [
        { svg: "rain", alt: "Regen" },
        { svg: "wind", alt: "Veel wind" },
        { svg: "snow", alt: "Sneeuw" }
      ]
    },
    {
      id: "vv-4",
      type: "verhaalVertellen",
      promptNL: "Kijk naar de plaatjes. Ricardo werkt als kapper. Vertel wat Ricardo doet. Vertel iets over alle plaatjes. Gebruik alle plaatjes.",
      promptNLShort: "Ricardo de kapper",
      modelAnswer: "Als eerste wast Ricardo de haren van de klant. Als tweede knipt Ricardo de haren van de klant. En als laatste veegt Ricardo alle haren bij elkaar.",
      keywords: ["kapper", "wassen", "knippen", "vegen", "haren", "klant", "schaar", "spiegel", "schoon", "mooi"],
      minWords: 12,
      minSentences: 3,
      images: [
        { svg: "hairWash", alt: "Haren wassen" },
        { svg: "hairCut", alt: "Haren knippen" },
        { svg: "sweep", alt: "Haren vegen" }
      ]
    },
    {
      id: "vv-5",
      type: "verhaalVertellen",
      promptNL: "Kijk naar de plaatjes. Ala gaat haar handen schoonmaken. Vertel wat Ala doet. Vertel iets over alle plaatjes. Gebruik alle plaatjes.",
      promptNLShort: "Ala maakt handen schoon",
      modelAnswer: "Eerst doet Ala wat zeep op haar handen. Dan wast Ala haar handen onder de kraan. En tenslotte droogt Ala haar handen met de handdoek.",
      keywords: ["handen", "zeep", "wassen", "droogt", "kraan", "handdoek", "water", "schoon", "hygiëne"],
      minWords: 12,
      minSentences: 3,
      images: [
        { svg: "soap", alt: "Zeep op handen doen" },
        { svg: "washHands", alt: "Handen wassen" },
        { svg: "dryHands", alt: "Handen drogen" }
      ]
    },
    {
      id: "vv-6",
      type: "verhaalVertellen",
      promptNL: "Kijk naar de plaatjes. Lucy heeft deze spullen gekocht. Vertel welke spullen dat zijn. Vertel ook wat Lucy erin kan doen. Gebruik alle plaatjes.",
      promptNLShort: "Lucy heeft spullen gekocht",
      modelAnswer: "Op het eerste plaatje zie ik een laptoptas. Hierin kan Lucy haar laptop doen. Op het tweede plaatje zie ik een toilettas. Hierin kan Lucy haar make-up doen. En op het derde plaatje zie ik een rolkoffer. Hierin kan Lucy haar kleding doen.",
      keywords: ["laptoptas", "toilettas", "rolkoffer", "laptop", "make-up", "kleding", "reizen", "tas", "spullen"],
      minWords: 16,
      minSentences: 5,
      images: [
        { svg: "laptopBag", alt: "Een laptoptas" },
        { svg: "toiletryBag", alt: "Een toilettas" },
        { svg: "suitcase", alt: "Een rolkoffer" }
      ]
    },
    {
      id: "vv-7",
      type: "verhaalVertellen",
      promptNL: "Kijk naar de plaatjes. Thomas heeft lunchtijd. Vertel wat hij doet tijdens de lunch. Gebruik alle plaatjes.",
      promptNLShort: "Thomas heeft lunchtijd",
      modelAnswer: "Hij eet een broodje. Hij drinkt koffie. En hij kijkt naar zijn computer.",
      keywords: ["broodje", "koffie", "computer", "lunch", "eten", "drinken", "werk", "pauze", "kantoor"],
      minWords: 10,
      minSentences: 3,
      images: [
        { svg: "sandwich", alt: "Een broodje eten" },
        { svg: "coffeeCup", alt: "Koffie drinken" },
        { svg: "atComputer", alt: "Naar computer kijken" }
      ]
    },
    {
      id: "vv-8",
      type: "verhaalVertellen",
      promptNL: "Kijk naar de plaatjes. Maria is met haar dochter in de winkel. Vertel wat Maria koopt. Gebruik alle plaatjes.",
      promptNLShort: "Maria in de winkel",
      modelAnswer: "Zij koopt fruit. Zij koopt ook groenten. En zij koopt een pak koekjes.",
      keywords: ["fruit", "groenten", "koekjes", "winkel", "kopen", "dochter", "supermarkt", "eten", "mand"],
      minWords: 10,
      minSentences: 3,
      images: [
        { svg: "fruit", alt: "Fruit kopen" },
        { svg: "vegetables", alt: "Groenten kopen" },
        { svg: "cookies", alt: "Koekjes kopen" }
      ]
    },
    {
      id: "vv-9",
      type: "verhaalVertellen",
      promptNL: "Kijk naar de plaatjes. Een bouwvakker bouwt een huis. Vertel wat een bouwvakker moet doen tijdens zijn werk. Gebruik alle plaatjes.",
      promptNLShort: "De bouwvakker",
      modelAnswer: "Een bouwvakker draagt stenen. Hij maakt een muur. Hij maakt ook een dak.",
      keywords: ["bouwvakker", "stenen", "muur", "dak", "huis", "bouwen", "werk", "helm", "hoog"],
      minWords: 10,
      minSentences: 3,
      images: [
        { svg: "bricks", alt: "Stenen dragen" },
        { svg: "wall", alt: "Een muur maken" },
        { svg: "roof", alt: "Een dak maken" }
      ]
    },
    {
      id: "vv-10",
      type: "verhaalVertellen",
      promptNL: "Kijk naar de plaatjes. Tamara gaat naar een restaurant. Wat doet zij in het restaurant? En met wie is zij daar? Gebruik alle plaatjes.",
      promptNLShort: "Tamara in het restaurant",
      modelAnswer: "Zij eet iets lekkers. Zij drinkt rode wijn. Zij is met haar broer.",
      keywords: ["restaurant", "eten", "wijn", "broer", "drinken", "tafel", "gezellig", "avond", "praten"],
      minWords: 10,
      minSentences: 3,
      images: [
        { svg: "eating", alt: "Iets lekkers eten" },
        { svg: "wine", alt: "Rode wijn drinken" },
        { svg: "withBrother", alt: "Met haar broer" }
      ]
    }
  ]
};
