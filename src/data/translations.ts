// 12-Language UI Translations extracted from NihongoSetu canonical prototype
export interface TranslationMap {
  home: string;
  account?: string;
  kana: string;
  grammar?: string;
  vocab?: string;
  kanji?: string;
  listen?: string;
  mock?: string;
  videos?: string;
  levels?: string;
  exam?: string;
  sensei: string;
  tag: string;
  streak?: string;
  cont?: string;
  mean?: string;
  [key: string]: string | undefined;
}

export const T: Record<string, TranslationMap> = {
ja:{home:"ホーム",account:"アカウント",kana:"日本語の文字",grammar:"文法",vocab:"単語",kanji:"漢字",listen:"リスニング",mock:"模擬試験",videos:"動画レッスン",levels:"レベル",exam:"試験",sensei:"先生",tag:"日本語への架け橋",streak:"日連続学習",cont:"学習を始める",mean:"この言葉の意味は何ですか？"},
en:{home:"Home",account:"Account",kana:"Japanese Script",grammar:"Grammar",vocab:"Vocabulary",kanji:"Kanji",listen:"Listening",mock:"Mock Test",videos:"Video Lessons",levels:"Levels",exam:"Exam",sensei:"Sensei",tag:"Your Bridge to Japanese.",streak:"Day streak",cont:"Start learning",mean:"What does this word mean?"},
ta:{home:"முகப்பு",account:"கணக்கு",kana:"ஜப்பானிய எழுத்துகள்",grammar:"இலக்கணம்",vocab:"சொற்களஞ்சியம்",kanji:"காஞ்சி",listen:"கேட்டல்",mock:"மாதிரித் தேர்வு",videos:"வீடியோ பாடங்கள்",levels:"நிலைகள்",exam:"தேர்வு",sensei:"சென்செய்",tag:"ஜப்பானிய மொழிக்கான உங்கள் பாலம்.",streak:"தொடர் நாட்கள்",cont:"கற்கத் தொடங்குங்கள்",mean:"இந்த வார்த்தையின் பொருள் என்ன?"},
hi:{home:"होम",kana:"बुनियादी",vocab:"शब्दावली",kanji:"कांजी",levels:"स्तर",exam:"परीक्षा",sensei:"सेंसेई",tag:"जापानी की ओर आपका सेतु।",streak:"लगातार सीखने के दिन",cont:"सीखना शुरू करें",mean:"इस शब्द का अर्थ क्या है?"},
te:{home:"హోమ్",kana:"ప్రాథమికం",vocab:"పదజాలం",kanji:"కాంజి",levels:"స్థాయిలు",exam:"పరీక్ష",sensei:"సెన్సే",tag:"జపనీస్ నేర్చుకునే మీ వారధి.",streak:"వరుసగా నేర్చుకున్న రోజులు",cont:"నేర్చుకోవడం ప్రారంభించండి",mean:"ఈ పదానికి అర్థం ఏమిటి?"},
ml:{home:"ഹോം",kana:"അടിസ്ഥാനം",vocab:"പദാവലി",kanji:"കാഞ്ചി",levels:"നിലകൾ",exam:"പരീക്ഷ",sensei:"സെൻസെയ്",tag:"ജാപ്പനീസ് പഠനത്തിലേക്കുള്ള നിങ്ങളുടെ പാലം.",streak:"തുടർച്ചയായ പഠന ദിവസങ്ങൾ",cont:"പഠനം ആരംഭിക്കുക",mean:"ഈ വാക്കിന്റെ അർത്ഥം എന്താണ്?"},
kn:{home:"ಮುಖಪುಟ",kana:"ಮೂಲಭೂತ",vocab:"ಪದಸಂಪತ್ತು",kanji:"ಕಾಂಜಿ",levels:"ಮಟ್ಟಗಳು",exam:"ಪರೀಕ್ಷೆ",sensei:"ಸೆನ್ಸೇ",tag:"ಜಪಾನೀಸ್ ಕಲಿಕೆಗೆ ನಿಮ್ಮ ಸೇತುವೆ.",streak:"ಸತತ ಕಲಿಕೆಯ ದಿನಗಳು",cont:"ಕಲಿಕೆ ಪ್ರಾರಂಭಿಸಿ",mean:"ಈ ಪದದ ಅರ್ಥವೇನು?"},
bn:{home:"হোম",kana:"মৌলিক",vocab:"শব্দভান্ডার",kanji:"কাঞ্জি",levels:"স্তর",exam:"পরীক্ষা",sensei:"সেনসেই",tag:"জাপানি শেখার আপনার সেতু।",streak:"টানা শেখার দিন",cont:"শেখা শুরু করুন",mean:"এই শব্দের অর্থ কী?"},
mr:{home:"मुख्यपृष्ठ",kana:"मूलभूत",vocab:"शब्दसंग्रह",kanji:"कांजी",levels:"स्तर",exam:"परीक्षा",sensei:"सेन्सेई",tag:"जपानी शिकण्याचा तुमचा पूल.",streak:"सलग शिकण्याचे दिवस",cont:"शिकायला सुरुवात करा",mean:"या शब्दाचा अर्थ काय?"},
tl:{home:"Home",kana:"Basic",vocab:"Talasalitaan",kanji:"Kanji",levels:"Mga Antas",exam:"Pagsusulit",sensei:"Sensei",tag:"Tulay mo sa pag-aaral ng Japanese.",streak:"Sunod-sunod na araw ng pag-aaral",cont:"Simulan ang pag-aaral",mean:"Ano ang ibig sabihin ng salitang ito?"},
ar:{home:"الرئيسية",kana:"أساسي",vocab:"المفردات",kanji:"كانجي",levels:"المستويات",exam:"الاختبار",sensei:"سينسي",tag:"جسرك لتعلّم اللغة اليابانية.",streak:"أيام التعلّم المتتالية",cont:"ابدأ التعلّم",mean:"ما معنى هذه الكلمة؟"},
fr:{home:"Accueil",kana:"Bases",vocab:"Vocabulaire",kanji:"Kanji",levels:"Niveaux",exam:"Examen",sensei:"Sensei",tag:"Votre passerelle vers le japonais.",streak:"Jours d’apprentissage consécutifs",cont:"Commencer à apprendre",mean:"Que signifie ce mot ?"},
es:{home:"Inicio",kana:"Básico",vocab:"Vocabulario",kanji:"Kanji",levels:"Niveles",exam:"Examen",sensei:"Sensei",tag:"Tu puente para aprender japonés.",streak:"Días seguidos de aprendizaje",cont:"Empezar a aprender",mean:"¿Qué significa esta palabra?"}};;
export const LISTEN_LABELS: Record<string, string> = {ja:"リスニング",en:"Listening",ta:"கேட்டல்",hi:"सुनना",te:"వినడం",ml:"കേൾവി",kn:"ಆಲಿಸುವಿಕೆ",bn:"শোনা",mr:"ऐकणे",tl:"Pakikinig",ar:"الاستماع",fr:"Écoute",es:"Escucha"};
export const LISTEN_TEXT: Record<string, string[]> = {
ja:["日本語リスニング練習","文を聞いて、速度を調整し、意味を選択してください。","▶ 再生","🐢 ゆっくり","テキストを表示","テキストを隠す","意味は何ですか？","答えを確認","正解です！よくできました。","不正解です。もう一度聞いてみましょう。","先に回答を選択してください。"],
en:["Japanese Listening Practice","Listen to a sentence, change the speed, then choose its meaning.","▶ Play","🐢 Slow","Show transcript","Hide transcript","What does it mean?","Check answer","Correct! Well done.","Not quite. Listen again.","Choose an answer first."],
ta:["ஜப்பானிய கேட்புப் பயிற்சி","வாக்கியத்தைக் கேட்டு, வேகத்தை மாற்றி, அதன் பொருளைத் தேர்ந்தெடுக்கவும்.","▶ கேள்","🐢 மெதுவாகக் கேள்","வாக்கியத்தைக் காட்டு","வாக்கியத்தை மறை","இதன் பொருள் என்ன?","பதிலைச் சரிபார்","சரி! நன்றாகக் கேட்டீர்கள்.","சரியில்லை. மீண்டும் கேளுங்கள்.","முதலில் பதிலைத் தேர்ந்தெடுக்கவும்."],
hi:["जापानी सुनने का अभ्यास","वाक्य सुनें, गति बदलें और उसका अर्थ चुनें।","▶ सुनें","🐢 धीरे सुनें","वाक्य दिखाएँ","वाक्य छिपाएँ","इसका अर्थ क्या है?","उत्तर जाँचें","सही! बहुत अच्छा।","सही नहीं। फिर से सुनें।","पहले उत्तर चुनें।"],
te:["జపనీస్ వినికిడి సాధన","వాక్యాన్ని విని, వేగాన్ని మార్చి, అర్థాన్ని ఎంచుకోండి.","▶ వినండి","🐢 నెమ్మదిగా","వాక్యాన్ని చూపించు","వాక్యాన్ని దాచు","దీని అర్థం ఏమిటి?","సమాధానాన్ని తనిఖీ చేయండి","సరైనది! బాగా చేశారు.","సరైనది కాదు. మళ్లీ వినండి.","ముందుగా సమాధానం ఎంచుకోండి."],
ml:["ജാപ്പനീസ് കേൾവി പരിശീലനം","വാക്യം കേട്ട് വേഗം മാറ്റി അർത്ഥം തിരഞ്ഞെടുക്കുക.","▶ കേൾക്കുക","🐢 പതുക്കെ","വാക്യം കാണിക്കുക","വാക്യം മറയ്ക്കുക","അർത്ഥം എന്താണ്?","ഉത്തരം പരിശോധിക്കുക","ശരി! നന്നായി.","ശരിയല്ല. വീണ്ടും കേൾക്കുക.","ആദ്യം ഉത്തരം തിരഞ്ഞെടുക്കുക."],
kn:["ಜಪಾನೀಸ್ ಆಲಿಸುವ ಅಭ್ಯಾಸ","ವಾಕ್ಯವನ್ನು ಕೇಳಿ, ವೇಗ ಬದಲಿಸಿ, ಅರ್ಥ ಆಯ್ಕೆಮಾಡಿ.","▶ ಕೇಳಿ","🐢 ನಿಧಾನವಾಗಿ","ವಾಕ್ಯ ತೋರಿಸಿ","ವಾಕ್ಯ ಮರೆಮಾಡಿ","ಇದರ ಅರ್ಥವೇನು?","ಉತ್ತರ ಪರಿಶೀಲಿಸಿ","ಸರಿಯಾಗಿದೆ! ಚೆನ್ನಾಗಿದೆ.","ಸರಿಯಲ್ಲ. ಮತ್ತೆ ಕೇಳಿ.","ಮೊದಲು ಉತ್ತರ ಆಯ್ಕೆಮಾಡಿ."],
bn:["জাপানি শ্রবণ অনুশীলন","বাক্য শুনুন, গতি বদলান এবং অর্থ বেছে নিন।","▶ শুনুন","🐢 ধীরে শুনুন","বাক্য দেখান","বাক্য লুকান","এর অর্থ কী?","উত্তর যাচাই করুন","সঠিক! খুব ভালো।","সঠিক নয়। আবার শুনুন।","আগে উত্তর বেছে নিন।"],
mr:["जपानी ऐकण्याचा सराव","वाक्य ऐका, वेग बदला आणि अर्थ निवडा.","▶ ऐका","🐢 हळू ऐका","वाक्य दाखवा","वाक्य लपवा","याचा अर्थ काय?","उत्तर तपासा","बरोबर! छान.","चूक. पुन्हा ऐका.","आधी उत्तर निवडा."],
tl:["Pagsasanay sa Pakikinig ng Japanese","Makinig sa pangungusap at piliin ang kahulugan nito.","▶ Pakinggan","🐢 Mabagal","Ipakita ang pangungusap","Itago ang pangungusap","Ano ang ibig sabihin nito?","Suriin","Tama! Mahusay.","Hindi tama. Makinig muli.","Pumili muna ng sagot."],
ar:["تدريب الاستماع إلى اليابانية","استمع إلى الجملة واختر معناها.","▶ تشغيل","🐢 ببطء","إظهار النص","إخفاء النص","ما معناها؟","تحقق","صحيح! أحسنت.","غير صحيح. استمع مجدداً.","اختر إجابة أولاً."],
fr:["Exercice d’écoute en japonais","Écoutez une phrase, changez la vitesse et choisissez son sens.","▶ Écouter","🐢 Lentement","Afficher le texte","Masquer le texte","Que signifie cette phrase ?","Vérifier","Correct ! Bravo.","Pas tout à fait. Réécoutez.","Choisissez d’abord une réponse."],
es:["Práctica auditiva de japonés","Escucha una frase, cambia la velocidad y elige su significado.","▶ Escuchar","🐢 Lento","Mostrar texto","Ocultar texto","¿Qué significa?","Comprobar","¡Correcto! Muy bien.","No es correcto. Escucha otra vez.","Elige primero una respuesta."]
};

export const getListenText = (lang: string = "en"): string[] => {
  return LISTEN_TEXT[lang] || LISTEN_TEXT.en;
};

export interface ListenItem {
  jp: string;
  romaji: string;
  meaning: Record<string, string>;
  choices: Record<string, string[]>;
  answer: number;
}

export const LISTEN_ITEMS: ListenItem[] = [
{jp:"おはようございます。",romaji:"Ohayou gozaimasu.",meaning:{en:"Good morning",ta:"காலை வணக்கம்",hi:"सुप्रभात",te:"శుభోదయం",ml:"സുപ്രഭാതം",kn:"ಶುಭೋದಯ",bn:"সুপ্রভাত",mr:"शुभ सकाळ",tl:"Magandang umaga",ar:"صباح الخير",fr:"Bonjour",es:"Buenos días"},choices:{en:["Good morning","Good night","Thank you"],ta:["காலை வணக்கம்","இரவு வணக்கம்","நன்றி"],hi:["सुप्रभात","शुभ रात्रि","धन्यवाद"],te:["శుభోదయం","శుభ రాత్రి","ధన్యవాదాలు"],ml:["സുപ്രഭാതം","ശുഭ രാത്രി","നന്ദി"],kn:["ಶುಭೋದಯ","ಶುಭ ರಾತ್ರಿ","ಧನ್ಯವಾದಗಳು"],bn:["সুপ্রভাত","শুভ রাত্রি","ধন্যবাদ"],mr:["शुभ सकाळ","शुभ रात्री","धन्यवाद"],tl:["Magandang umaga","Magandang gabi","Salamat"],ar:["صباح الخير","تصبح على خير","شكراً"],fr:["Bonjour","Bonne nuit","Merci"],es:["Buenos días","Buenas noches","Gracias"]},answer:0},
{jp:"ありがとうございます。",romaji:"Arigatou gozaimasu.",meaning:{en:"Thank you very much",ta:"மிக்க நன்றி",hi:"बहुत धन्यवाद",te:"చాలా ధన్యవాదాలు",ml:"വളരെ നന്ദി",kn:"ತುಂಬಾ ಧನ್ಯವಾದಗಳು",bn:"অনেক ধন্যবাদ",mr:"खूप धन्यवाद",tl:"Maraming salamat",ar:"شكراً جزيلاً",fr:"Merci beaucoup",es:"Muchas gracias"},choices:{en:["Excuse me","Thank you very much","Goodbye"],ta:["மன்னிக்கவும்","மிக்க நன்றி","பிரியாவிடை"],hi:["माफ़ कीजिए","बहुत धन्यवाद","अलविदा"],te:["క్షమించండి","చాలా ధన్యవాదాలు","వీడ్కోలు"],ml:["ക്ഷമിക്കണം","വളരെ നന്ദി","വിട"],kn:["ಕ್ಷಮಿಸಿ","ತುಂಬಾ ಧನ್ಯವಾದಗಳು","ವಿದಾಯ"],bn:["দুঃখিত","অনেক ধন্যবাদ","বিদায়"],mr:["माफ करा","खूप धन्यवाद","निरोप"],tl:["Paumanhin","Maraming salamat","Paalam"],ar:["عذراً","شكراً جزيلاً","وداعاً"],fr:["Excusez-moi","Merci beaucoup","Au revoir"],es:["Disculpe","Muchas gracias","Adiós"]},answer:1},
{jp:"これは何ですか。",romaji:"Kore wa nan desu ka?",meaning:{en:"What is this?",ta:"இது என்ன?",hi:"यह क्या है?",te:"ఇది ఏమిటి?",ml:"ഇത് എന്താണ്?",kn:"ಇದು ಏನು?",bn:"এটি কী?",mr:"हे काय आहे?",tl:"Ano ito?",ar:"ما هذا؟",fr:"Qu’est-ce que c’est ?",es:"¿Qué es esto?"},choices:{en:["Where is this?","What is this?","Who is this?"],ta:["இது எங்கே?","இது என்ன?","இவர் யார்?"],hi:["यह कहाँ है?","यह क्या है?","यह कौन है?"],te:["ఇది ఎక్కడ?","ఇది ఏమిటి?","ఇతను ఎవరు?"],ml:["ഇത് എവിടെയാണ്?","ഇത് എന്താണ്?","ഇത് ആരാണ്?"],kn:["ಇದು ಎಲ್ಲಿದೆ?","ಇದು ಏನು?","ಇವರು ಯಾರು?"],bn:["এটি কোথায়?","এটি কী?","ইনি কে?"],mr:["हे कुठे आहे?","हे काय आहे?","ही व्यक्ती कोण?"],tl:["Nasaan ito?","Ano ito?","Sino ito?"],ar:["أين هذا؟","ما هذا؟","من هذا؟"],fr:["Où est-ce ?","Qu’est-ce que c’est ?","Qui est-ce ?"],es:["¿Dónde está esto?","¿Qué es esto?","¿Quién es?"]},answer:1},
{jp:"水を飲みます。",romaji:"Mizu o nomimasu.",meaning:{en:"I drink water",ta:"நான் தண்ணீர் குடிக்கிறேன்",hi:"मैं पानी पीता/पीती हूँ",te:"నేను నీళ్లు తాగుతాను",ml:"ഞാൻ വെള്ളം കുടിക്കുന്നു",kn:"ನಾನು ನೀರು ಕುಡಿಯುತ್ತೇನೆ",bn:"আমি পানি পান করি",mr:"मी पाणी पितो/पिते",tl:"Umiinom ako ng tubig",ar:"أنا أشرب الماء",fr:"Je bois de l’eau",es:"Bebo agua"},choices:{en:["I drink water","I eat rice","I read a book"],ta:["நான் தண்ணீர் குடிக்கிறேன்","நான் சாதம் சாப்பிடுகிறேன்","நான் புத்தகம் படிக்கிறேன்"],hi:["मैं पानी पीता/पीती हूँ","मैं चावल खाता/खाती हूँ","मैं किताब पढ़ता/पढ़ती हूँ"],te:["నేను నీళ్లు తాగుతాను","నేను అన్నం తింటాను","నేను పుస్తకం చదువుతాను"],ml:["ഞാൻ വെള്ളം കുടിക്കുന്നു","ഞാൻ ചോറ് കഴിക്കുന്നു","ഞാൻ പുസ്തകം വായിക്കുന്നു"],kn:["ನಾನು ನೀರು ಕುಡಿಯುತ್ತೇನೆ","ನಾನು ಅನ್ನ ತಿನ್ನುತ್ತೇನೆ","ನಾನು ಪುಸ್ತಕ ಓದುತ್ತೇನೆ"],bn:["আমি পানি পান করি","আমি ভাত খাই","আমি বই পড়ি"],mr:["मी पाणी पितो/पिते","मी भात खातो/खाते","मी पुस्तक वाचतो/वाचते"],tl:["Umiinom ako ng tubig","Kumakain ako ng kanin","Nagbabasa ako ng libro"],ar:["أنا أشرب الماء","أنا آكل الأرز","أنا أقرأ كتاباً"],fr:["Je bois de l’eau","Je mange du riz","Je lis un livre"],es:["Bebo agua","Como arroz","Leo un libro"]},answer:0},
{jp:"学校へ行きます。",romaji:"Gakkou e ikimasu.",meaning:{en:"I go to school",ta:"நான் பள்ளிக்குச் செல்கிறேன்",hi:"मैं स्कूल जाता/जाती हूँ",te:"నేను పాఠశాలకు వెళ్తాను",ml:"ഞാൻ സ്കൂളിലേക്ക് പോകുന്നു",kn:"ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ",bn:"আমি স্কুলে যাই",mr:"मी शाळेत जातो/जाते",tl:"Pumupunta ako sa paaralan",ar:"أذهب إلى المدرسة",fr:"Je vais à l’école",es:"Voy a la escuela"},choices:{en:["I go to school","I come home","I study Japanese"],ta:["நான் பள்ளிக்குச் செல்கிறேன்","நான் வீட்டிற்கு வருகிறேன்","நான் ஜப்பானியம் படிக்கிறேன்"],hi:["मैं स्कूल जाता/जाती हूँ","मैं घर आता/आती हूँ","मैं जापानी पढ़ता/पढ़ती हूँ"],te:["నేను పాఠశాలకు వెళ్తాను","నేను ఇంటికి వస్తాను","నేను జపనీస్ చదువుతాను"],ml:["ഞാൻ സ്കൂളിലേക്ക് പോകുന്നു","ഞാൻ വീട്ടിലേക്ക് വരുന്നു","ഞാൻ ജാപ്പനീസ് പഠിക്കുന്നു"],kn:["ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ","ನಾನು ಮನೆಗೆ ಬರುತ್ತೇನೆ","ನಾನು ಜಪಾನೀಸ್ ಕಲಿಯುತ್ತೇನೆ"],bn:["আমি স্কুলে যাই","আমি বাড়ি আসি","আমি জাপানি পড়ি"],mr:["मी शाळेत जातो/जाते","मी घरी येतो/येते","मी जपानी शिकतो/शिकते"],tl:["Pumupunta ako sa paaralan","Umuwi ako","Nag-aaral ako ng Japanese"],ar:["أذهب إلى المدرسة","أعود إلى المنزل","أدرس اليابانية"],fr:["Je vais à l’école","Je rentre à la maison","J’étudie le japonais"],es:["Voy a la escuela","Vuelvo a casa","Estudio japonés"]},answer:0}
];
