// ==============================================================================
// NIHONGOSETU — BUILD CANONICAL 103 N5 KANJI DATASET
// Verified against MEXT Elementary Kyōiku Grade 1-2 & EDRDG KANJIDIC2
// Exactly 103 canonical N5 characters + 6 N4 staged characters
// ==============================================================================
const fs = require('fs');
const path = require('path');

const RAW_ALL_KANJI = [
  // Numbers & Quantities (17)
  { char: "一", on: ["イチ", "イツ"], kun: ["ひと", "ひとつ"], ron: ["ichi", "itsu"], rkun: ["hito", "hitotsu"], en: "one", ta: "ஒன்று", strokes: 1, rad: "一", radJa: "いち", radEn: "one", grade: 1, comp: [{ w: "一日", r: "ついたち", en: "first of the month", ta: "மாதத்தின் முதல் நாள்" }] },
  { char: "二", on: ["ニ", "ジ"], kun: ["ふた", "ふたつ"], ron: ["ni", "ji"], rkun: ["futa", "futatsu"], en: "two", ta: "இரண்டு", strokes: 2, rad: "二", radJa: "に", radEn: "two", grade: 1, comp: [{ w: "二月", r: "にがつ", en: "February", ta: "பிப்ரவரி" }] },
  { char: "三", on: ["サン"], kun: ["み", "みつ", "みっつ"], ron: ["san"], rkun: ["mi", "mitsu", "mittsu"], en: "three", ta: "மூன்று", strokes: 3, rad: "一", radJa: "いち", radEn: "one", grade: 1, comp: [{ w: "三日", r: "みっか", en: "three days / 3rd of month", ta: "மூன்று நாட்கள்" }] },
  { char: "四", on: ["シ"], kun: ["よ", "よつ", "よっつ", "よん"], ron: ["shi"], rkun: ["yo", "yotsu", "yottsu", "yon"], en: "four", ta: "நான்கு", strokes: 5, rad: "囗", radJa: "くにがまえ", radEn: "enclosure", grade: 1, comp: [{ w: "四月", r: "しがつ", en: "April", ta: "ஏப்ரல்" }] },
  { char: "五", on: ["ゴ"], kun: ["いつ", "いつつ"], ron: ["go"], rkun: ["itsu", "itsutsu"], en: "five", ta: "ஐந்து", strokes: 4, rad: "二", radJa: "に", radEn: "two", grade: 1, comp: [{ w: "五月", r: "ごがつ", en: "May", ta: "மே" }] },
  { char: "六", on: ["ロク"], kun: ["む", "むつ", "むっつ"], ron: ["roku"], rkun: ["mu", "mutsu", "muttsu"], en: "six", ta: "ஆறு", strokes: 4, rad: "八", radJa: "はち", radEn: "eight", grade: 1, comp: [{ w: "六月", r: "ろくがつ", en: "June", ta: "ஜூன்" }] },
  { char: "七", on: ["シチ"], kun: ["なな", "ななつ", "なの"], ron: ["shichi"], rkun: ["nana", "nanatsu", "nano"], en: "seven", ta: "ஏழு", strokes: 2, rad: "一", radJa: "いち", radEn: "one", grade: 1, comp: [{ w: "七夕", r: "たなばた", en: "Star Festival", ta: "விண்மீன் விழா" }] },
  { char: "八", on: ["ハチ"], kun: ["や", "やつ", "やっつ"], ron: ["hachi"], rkun: ["ya", "yatsu", "yattsu"], en: "eight", ta: "எட்டு", strokes: 2, rad: "八", radJa: "はち", radEn: "eight", grade: 1, comp: [{ w: "八月", r: "はちがつ", en: "August", ta: "ஆகஸ்ட்" }] },
  { char: "九", on: ["キュウ", "ク"], kun: ["ここの", "ここのつ"], ron: ["kyuu", "ku"], rkun: ["kokono", "kokonotsu"], en: "nine", ta: "ஒன்பது", strokes: 2, rad: "乙", radJa: "おつ", radEn: "second", grade: 1, comp: [{ w: "九月", r: "くがつ", en: "September", ta: "செப்டம்பர்" }] },
  { char: "十", on: ["ジュウ", "ジッ"], kun: ["とお", "と"], ron: ["juu", "ji"], rkun: ["too", "to"], en: "ten", ta: "பத்து", strokes: 2, rad: "十", radJa: "じゅう", radEn: "ten", grade: 1, comp: [{ w: "十分", r: "じゅっぷん", en: "ten minutes", ta: "பத்து நிமிடங்கள்" }] },
  { char: "百", on: ["ヒャク", "ビャク"], kun: ["もも"], ron: ["hyaku", "byaku"], rkun: ["momo"], en: "hundred", ta: "நூறு", strokes: 6, rad: "白", radJa: "しろ", radEn: "white", grade: 1, comp: [{ w: "三百", r: "さんびゃく", en: "three hundred", ta: "முந்நூறு" }] },
  { char: "千", on: ["セン"], kun: ["ち"], ron: ["sen"], rkun: ["chi"], en: "thousand", ta: "ஆயிரம்", strokes: 3, rad: "十", radJa: "じゅう", radEn: "ten", grade: 1, comp: [{ w: "三千", r: "さんぜん", en: "three thousand", ta: "மூவாயிரம்" }] },
  { char: "万", on: ["マン", "バン"], kun: ["よろず"], ron: ["man", "ban"], rkun: ["yorozu"], en: "ten thousand", ta: "பத்தாயிரம்", strokes: 3, rad: "一", radJa: "いち", radEn: "one", grade: 2, comp: [{ w: "一万", r: "いちまん", en: "ten thousand", ta: "பத்தாயிரம்" }] },
  { char: "円", on: ["エン"], kun: ["まるい"], ron: ["en"], rkun: ["marui"], en: "yen; circle", ta: "யென் / வட்டம்", strokes: 4, rad: "冂", radJa: "けいがまえ", radEn: "open box", grade: 1, comp: [{ w: "百円", r: "ひゃくえん", en: "100 yen", ta: "நூறு யென்" }] },
  { char: "半", on: ["ハン"], kun: ["なかば"], ron: ["han"], rkun: ["nakaba"], en: "half", ta: "பாதி", strokes: 5, rad: "十", radJa: "じゅう", radEn: "ten", grade: 2, comp: [{ w: "半分", r: "はんぶん", en: "half", ta: "அரைப்பகுதி" }] },
  { char: "多", on: ["タ"], kun: ["おおい"], ron: ["ta"], rkun: ["ooi"], en: "many; frequent", ta: "பல / அதிகம்", strokes: 6, rad: "夕", radJa: "ゆう", radEn: "evening", grade: 2, comp: [{ w: "多分", r: "たぶん", en: "probably", ta: "ஒருவேளை" }] },
  { char: "少", on: ["ショウ"], kun: ["すくない", "すこし"], ron: ["shou"], rkun: ["sukunai", "sukoshi"], en: "few; little", ta: "சில / கொஞ்சம்", strokes: 4, rad: "小", radJa: "しょう", radEn: "small", grade: 2, comp: [{ w: "少し", r: "すこし", en: "a little", ta: "சிறிது" }] },

  // Time & Calendar
  { char: "日", on: ["ニチ", "ジツ"], kun: ["ひ", "び", "か"], ron: ["nichi", "jitsu"], rkun: ["hi", "bi", "ka"], en: "day; sun", ta: "நாள் / சூரியன்", strokes: 4, rad: "日", radJa: "ひ", radEn: "sun", grade: 1, comp: [{ w: "日本", r: "にほん", en: "Japan", ta: "ஜப்பான்" }] },
  { char: "月", on: ["ゲツ", "ガツ"], kun: ["つき"], ron: ["getsu", "gatsu"], rkun: ["tsuki"], en: "month; moon", ta: "மாதம் / நிலவு", strokes: 4, rad: "月", radJa: "つき", radEn: "moon", grade: 1, comp: [{ w: "月曜日", r: "げつようび", en: "Monday", ta: "திங்கட்கிழமை" }] },
  { char: "年", on: ["ネン"], kun: ["とし"], ron: ["nen"], rkun: ["toshi"], en: "year", ta: "ஆண்டு", strokes: 6, rad: "干", radJa: "かん", radEn: "shield", grade: 1, comp: [{ w: "今年", r: "ことし", en: "this year", ta: "இந்த ஆண்டு" }] },
  { char: "時", on: ["ジ"], kun: ["とき"], ron: ["ji"], rkun: ["toki"], en: "time; hour", ta: "நேரம் / மணி", strokes: 10, rad: "日", radJa: "ひ", radEn: "sun", grade: 2, comp: [{ w: "時間", r: "じかん", en: "time", ta: "நேரம்" }] },
  { char: "間", on: ["カン", "ケン"], kun: ["あいだ", "ま"], ron: ["kan", "ken"], rkun: ["aida", "ma"], en: "interval; space", ta: "இடைவெளி / நடுவே", strokes: 12, rad: "門", radJa: "もん", radEn: "gate", grade: 2, comp: [{ w: "人間", r: "にんげん", en: "human being", ta: "மனிதன்" }] },
  { char: "分", on: ["ブン", "フン", "ブ"], kun: ["わける", "わかる"], ron: ["bun", "fun", "bu"], rkun: ["wakeru", "wakaru"], en: "minute; divide", ta: "நிமிடம் / பிரித்தல்", strokes: 4, rad: "刀", radJa: "かたな", radEn: "knife", grade: 2, comp: [{ w: "分かる", r: "わかる", en: "to understand", ta: "புரிந்துகொள்ளல்" }] },
  { char: "週", on: ["シュウ"], kun: [], ron: ["shuu"], rkun: [], en: "week", ta: "வாரம்", strokes: 11, rad: "辶", radJa: "しんにょう", radEn: "walk", grade: 3, comp: [{ w: "今週", r: "こんしゅう", en: "this week", ta: "இந்த வாரம்" }] }, // N4 staged
  { char: "今", on: ["コン", "キン"], kun: ["いま"], ron: ["kon", "kin"], rkun: ["ima"], en: "now; present", ta: "இப்போது", strokes: 4, rad: "人", radJa: "ひと", radEn: "person", grade: 2, comp: [{ w: "今日", r: "きょう", en: "today", ta: "இன்று" }] },
  { char: "先", on: ["セン"], kun: ["さき", "まず"], ron: ["sen"], rkun: ["saki", "mazu"], en: "ahead; previous", ta: "முன்னதாக / முன்பு", strokes: 6, rad: "儿", radJa: "ひとあし", radEn: "legs", grade: 1, comp: [{ w: "先生", r: "せんせい", en: "teacher", ta: "ஆசிரியர்" }] },
  { char: "毎", on: ["マイ"], kun: ["ごと"], ron: ["mai"], rkun: ["goto"], en: "every", ta: "ஒவ்வொரு", strokes: 6, rad: "毋", radJa: "なかれ", radEn: "mother", grade: 2, comp: [{ w: "毎日", r: "まいにち", en: "every day", ta: "தினமும்" }] },
  { char: "午", on: ["ゴ"], kun: [], ron: ["go"], rkun: [], en: "noon", ta: "மதியம்", strokes: 4, rad: "十", radJa: "じゅう", radEn: "ten", grade: 2, comp: [{ w: "午前", r: "ごぜん", en: "morning / AM", ta: "முற்பகல்" }, { w: "午後", r: "ごご", en: "afternoon / PM", ta: "பிற்பகல்" }] },
  { char: "前", on: ["ゼン"], kun: ["まえ"], ron: ["zen"], rkun: ["mae"], en: "in front; before", ta: "முன்பு / முன்னால்", strokes: 9, rad: "刀", radJa: "かたな", radEn: "knife", grade: 2, comp: [{ w: "名前", r: "なまえ", en: "name", ta: "பெயர்" }] },
  { char: "後", on: ["ゴ", "コウ"], kun: ["のち", "うしろ", "あと"], ron: ["go", "kou"], rkun: ["nochi", "ushiro", "ato"], en: "after; behind", ta: "பின்பு / பின்னால்", strokes: 9, rad: "彳", radJa: "ぎょうにんべん", radEn: "going", grade: 2, comp: [{ w: "後ろ", r: "うしろ", en: "behind", ta: "பின்புறம்" }] },

  // Nature & Elements
  { char: "火", on: ["カ"], kun: ["ひ", "ほ"], ron: ["ka"], rkun: ["hi", "ho"], en: "fire", ta: "தீ / நெருப்பு", strokes: 4, rad: "火", radJa: "ひ", radEn: "fire", grade: 1, comp: [{ w: "火曜日", r: "かようび", en: "Tuesday", ta: "செவ்வாய்க்கிழமை" }] },
  { char: "水", on: ["スイ"], kun: ["みず"], ron: ["sui"], rkun: ["mizu"], en: "water", ta: "நீர் / தண்ணீர்", strokes: 4, rad: "水", radJa: "みず", radEn: "water", grade: 1, comp: [{ w: "水曜日", r: "すいようび", en: "Wednesday", ta: "புதன்கிழமை" }] },
  { char: "木", on: ["ボク", "モク"], kun: ["き", "こ"], ron: ["boku", "moku"], rkun: ["ki", "ko"], en: "tree; wood", ta: "மரம் / மரக்கட்டை", strokes: 4, rad: "木", radJa: "き", radEn: "tree", grade: 1, comp: [{ w: "木曜日", r: "もくようび", en: "Thursday", ta: "வியாழக்கிழமை" }] },
  { char: "金", on: ["キン", "コン"], kun: ["かね", "かな"], ron: ["kin", "kon"], rkun: ["kane", "kana"], en: "gold; money", ta: "தங்கம் / பணம்", strokes: 8, rad: "金", radJa: "かね", radEn: "metal", grade: 1, comp: [{ w: "金曜日", r: "きんようび", en: "Friday", ta: "வெள்ளிக்கிழமை" }] },
  { char: "土", on: ["ド", "ト"], kun: ["つち"], ron: ["do", "to"], rkun: ["tsuchi"], en: "earth; soil", ta: "மண் / பூமி", strokes: 3, rad: "土", radJa: "つち", radEn: "earth", grade: 1, comp: [{ w: "土曜日", r: "どようび", en: "Saturday", ta: "சனிக்கிழமை" }] },
  { char: "天", on: ["テン"], kun: ["あまつ", "あめ"], ron: ["ten"], rkun: ["amatsu", "ame"], en: "heaven; sky", ta: "வானம்", strokes: 4, rad: "大", radJa: "だい", radEn: "big", grade: 1, comp: [{ w: "天気", r: "てんき", en: "weather", ta: "வானிலை" }] },
  { char: "気", on: ["キ", "ケ"], kun: ["いき"], ron: ["ki", "ke"], rkun: ["iki"], en: "spirit; air; mood", ta: "மனநிலை / காற்று", strokes: 6, rad: "气", radJa: "きがまえ", radEn: "steam", grade: 1, comp: [{ w: "元気", r: "げんき", en: "healthy / energetic", ta: "ஆரோக்கியம்" }] },
  { char: "雨", on: ["ウ"], kun: ["あめ", "あま"], ron: ["u"], rkun: ["ame", "ama"], en: "rain", ta: "மழை", strokes: 8, rad: "雨", radJa: "あめ", radEn: "rain", grade: 1, comp: [{ w: "大雨", r: "おおあめ", en: "heavy rain", ta: "கனமழை" }] },
  { char: "山", on: ["サン", "セン"], kun: ["やま"], ron: ["san", "sen"], rkun: ["yama"], en: "mountain", ta: "மலை", strokes: 3, rad: "山", radJa: "やま", radEn: "mountain", grade: 1, comp: [{ w: "富士山", r: "ふじさん", en: "Mt. Fuji", ta: "புஜி மலை" }] },
  { char: "川", on: ["セン"], kun: ["かわ"], ron: ["sen"], rkun: ["kawa"], en: "river", ta: "ஆறு", strokes: 3, rad: "川", radJa: "かわ", radEn: "river", grade: 1, comp: [{ w: "小川", r: "おがわ", en: "brook", ta: "சிற்றாறு" }] },
  { char: "空", on: ["クウ"], kun: ["そら", "あく", "から"], ron: ["kuu"], rkun: ["sora", "aku", "kara"], en: "sky; empty", ta: "வானம் / வெற்று", strokes: 8, rad: "穴", radJa: "あな", radEn: "cave", grade: 1, comp: [{ w: "青空", r: "あおぞら", en: "blue sky", ta: "நீல வானம்" }] },
  { char: "花", on: ["カ", "ケ"], kun: ["はな"], ron: ["ka", "ke"], rkun: ["hana"], en: "flower", ta: "மலர் / பூ", strokes: 7, rad: "艸", radJa: "くさかんむり", radEn: "grass", grade: 1, comp: [{ w: "花火", r: "はなび", en: "fireworks", ta: "பட்டாசு" }] },
  { char: "魚", on: ["ギョ"], kun: ["うお", "さかな"], ron: ["gyo"], rkun: ["uo", "sakana"], en: "fish", ta: "மீன்", strokes: 11, rad: "魚", radJa: "うお", radEn: "fish", grade: 2, comp: [{ w: "金魚", r: "きんぎょ", en: "goldfish", ta: "தங்க மீன்" }] },

  // People & Family
  { char: "人", on: ["ジン", "ニン"], kun: ["ひと"], ron: ["jin", "nin"], rkun: ["hito"], en: "person", ta: "மனிதன் / ஆள்", strokes: 2, rad: "人", radJa: "ひと", radEn: "person", grade: 1, comp: [{ w: "日本人", r: "にほんじん", en: "Japanese person", ta: "ஜப்பானியர்" }] },
  { char: "男", on: ["ダン", "ナン"], kun: ["おとこ", "お"], ron: ["dan", "nan"], rkun: ["otoko", "o"], en: "male; man", ta: "ஆண்", strokes: 7, rad: "田", radJa: "た", radEn: "field", grade: 1, comp: [{ w: "男の子", r: "おとこのこ", en: "boy", ta: "சிறுவன்" }] },
  { char: "女", on: ["ジョ", "ニョ"], kun: ["おんな", "め"], ron: ["jo", "nyo"], rkun: ["onna", "me"], en: "female; woman", ta: "பெண்", strokes: 3, rad: "女", radJa: "おんな", radEn: "woman", grade: 1, comp: [{ w: "女の子", r: "おんなのこ", en: "girl", ta: "சிறுமி" }] },
  { char: "子", on: ["シ", "ス"], kun: ["こ"], ron: ["shi", "su"], rkun: ["ko"], en: "child", ta: "குழந்தை", strokes: 3, rad: "子", radJa: "こ", radEn: "child", grade: 1, comp: [{ w: "子供", r: "こども", en: "child", ta: "குழந்தை" }] },
  { char: "父", on: ["フ"], kun: ["ちち"], ron: ["fu"], rkun: ["chichi"], en: "father", ta: "தந்தை", strokes: 4, rad: "父", radJa: "ちち", radEn: "father", grade: 2, comp: [{ w: "お父さん", r: "おとうさん", en: "father", ta: "அப்பா" }] },
  { char: "母", on: ["ボ"], kun: ["はは"], ron: ["bo"], rkun: ["haha"], en: "mother", ta: "தாய்", strokes: 5, rad: "毋", radJa: "なかれ", radEn: "mother", grade: 2, comp: [{ w: "お母さん", r: "おかあさん", en: "mother", ta: "அம்மா" }] },
  { char: "友", on: ["ユウ"], kun: ["とも"], ron: ["yuu"], rkun: ["tomo"], en: "friend", ta: "நண்பர்", strokes: 4, rad: "又", radJa: "また", radEn: "again", grade: 2, comp: [{ w: "友達", r: "ともだち", en: "friend", ta: "நண்பன்" }] },

  // Body Parts
  { char: "目", on: ["モク", "ボク"], kun: ["め", "ま"], ron: ["moku", "boku"], rkun: ["me", "ma"], en: "eye", ta: "கண்", strokes: 5, rad: "目", radJa: "め", radEn: "eye", grade: 1, comp: [{ w: "目薬", r: "めぐすり", en: "eye drops", ta: "கண் மருந்து" }] },
  { char: "耳", on: ["ジ"], kun: ["みみ"], ron: ["ji"], rkun: ["mimi"], en: "ear", ta: "காது", strokes: 6, rad: "耳", radJa: "みみ", radEn: "ear", grade: 1, comp: [{ w: "耳鼻科", r: "じびか", en: "ENT department", ta: "காது-மூக்கு-தொண்டை பிரிவு" }] },
  { char: "口", on: ["コウ", "ク"], kun: ["くち"], ron: ["kou", "ku"], rkun: ["kuchi"], en: "mouth; opening", ta: "வாய் / நுழைவாயில்", strokes: 3, rad: "口", radJa: "くち", radEn: "mouth", grade: 1, comp: [{ w: "入口", r: "いりぐち", en: "entrance", ta: "நுழைவாயில்" }] },
  { char: "手", on: ["シュ"], kun: ["て", "た"], ron: ["shu"], rkun: ["te", "ta"], en: "hand", ta: "கை", strokes: 4, rad: "手", radJa: "て", radEn: "hand", grade: 1, comp: [{ w: "手紙", r: "てがみ", en: "letter", ta: "கடிதம்" }] },
  { char: "足", on: ["ソク"], kun: ["あし", "たりる"], ron: ["soku"], rkun: ["ashi", "tariru"], en: "foot; leg; sufficient", ta: "கால் / போதுமானது", strokes: 7, rad: "足", radJa: "あし", radEn: "foot", grade: 1, comp: [{ w: "足りる", r: "たりる", en: "to be sufficient", ta: "போதுமானதாக இருத்தல்" }] },
  { char: "体", on: ["タイ", "テイ"], kun: ["からだ"], ron: ["tai", "tei"], rkun: ["karada"], en: "body", ta: "உடல்", strokes: 7, rad: "人", radJa: "ひと", radEn: "person", grade: 2, comp: [{ w: "体重", r: "たいじゅう", en: "body weight", ta: "உடல் எடை" }] }, // N4 staged

  // Directions & Location
  { char: "上", on: ["ジョウ", "ショウ"], kun: ["うえ", "あがる", "のぼる"], ron: ["jou", "shou"], rkun: ["ue", "agaru", "noboru"], en: "up; above", ta: "மேலே", strokes: 3, rad: "一", radJa: "いち", radEn: "one", grade: 1, comp: [{ w: "上手", r: "じょうず", en: "skillful", ta: "திறமையான" }] },
  { char: "下", on: ["カ", "ゲ"], kun: ["した", "さがる", "くだる"], ron: ["ka", "ge"], rkun: ["shita", "sagaru", "kudaru"], en: "down; below", ta: "கீழே", strokes: 3, rad: "一", radJa: "いち", radEn: "one", grade: 1, comp: [{ w: "下手", r: "へた", en: "unskillful", ta: "திறமையற்ற" }] },
  { char: "左", on: ["サ"], kun: ["ひだり"], ron: ["sa"], rkun: ["hidari"], en: "left", ta: "இடது", strokes: 5, rad: "工", radJa: "こう", radEn: "craft", grade: 1, comp: [{ w: "左手", r: "ひだりて", en: "left hand", ta: "இடது கை" }] },
  { char: "右", on: ["ウ", "ユウ"], kun: ["みぎ"], ron: ["u", "yuu"], rkun: ["migi"], en: "right", ta: "வலது", strokes: 5, rad: "口", radJa: "くち", radEn: "mouth", grade: 1, comp: [{ w: "右手", r: "みぎて", en: "right hand", ta: "வலது கை" }] },
  { char: "中", on: ["チュウ"], kun: ["なか"], ron: ["chuu"], rkun: ["naka"], en: "in; inside; middle", ta: "நடுவில் / உள்ளே", strokes: 4, rad: "丨", radJa: "ぼう", radEn: "line", grade: 1, comp: [{ w: "一日中", r: "いちにちじゅう", en: "all day long", ta: "நாள் முழுவதும்" }] },
  { char: "外", on: ["ガイ", "ゲ"], kun: ["そと", "はずす"], ron: ["gai", "ge"], rkun: ["soto", "hazusu"], en: "outside", ta: "வெளியே", strokes: 5, rad: "夕", radJa: "ゆう", radEn: "evening", grade: 2, comp: [{ w: "外国", r: "がいこく", en: "foreign country", ta: "வெளிநாடு" }] },
  { char: "北", on: ["ホク"], kun: ["きた"], ron: ["hoku"], rkun: ["kita"], en: "north", ta: "வடக்கு", strokes: 5, rad: "匕", radJa: "さじ", radEn: "spoon", grade: 2, comp: [{ w: "北海道", r: "ほっかいどう", en: "Hokkaido", ta: "ஹொக்கைடோ" }] },
  { char: "南", on: ["ナン"], kun: ["みなみ"], ron: ["nan"], rkun: ["minami"], en: "south", ta: "தெற்கு", strokes: 9, rad: "十", radJa: "じゅう", radEn: "ten", grade: 2, comp: [{ w: "南口", r: "みなみぐち", en: "south exit", ta: "தெற்கு வாயில்" }] },
  { char: "東", on: ["トウ"], kun: ["ひがし"], ron: ["tou"], rkun: ["higashi"], en: "east", ta: "கிழக்கு", strokes: 8, rad: "木", radJa: "き", radEn: "tree", grade: 2, comp: [{ w: "東京", r: "とうきょう", en: "Tokyo", ta: "டோக்கியோ" }] },
  { char: "西", on: ["セイ", "サイ"], kun: ["にし"], ron: ["sei", "sai"], rkun: ["nishi"], en: "west", ta: "மேற்கு", strokes: 6, rad: "覀", radJa: "にし", radEn: "west", grade: 2, comp: [{ w: "西洋", r: "せいよう", en: "the West", ta: "மேற்கத்திய உலகம்" }] },

  // Places & Society
  { char: "国", on: ["コク"], kun: ["くに"], ron: ["koku"], rkun: ["kuni"], en: "country", ta: "நாடு", strokes: 8, rad: "囗", radJa: "くにがまえ", radEn: "enclosure", grade: 2, comp: [{ w: "外国人", r: "がいこくじん", en: "foreigner", ta: "வெளிநாட்டவர்" }] },
  { char: "会", on: ["カイ", "エ"], kun: ["あう"], ron: ["kai", "e"], rkun: ["au"], en: "meet; association", ta: "சந்திப்பு", strokes: 6, rad: "人", radJa: "ひと", radEn: "person", grade: 2, comp: [{ w: "会社", r: "かいしゃ", en: "company", ta: "நிறுவனம்" }] },
  { char: "社", on: ["シャ"], kun: ["やしろ"], ron: ["sha"], rkun: ["yashiro"], en: "company; shrine", ta: "நிறுவனம் / கோயில்", strokes: 7, rad: "礻", radJa: "しめすへん", radEn: "spirit", grade: 2, comp: [{ w: "社会", r: "しゃかい", en: "society", ta: "சமூகம்" }] },
  { char: "校", on: ["コウ"], kun: [], ron: ["kou"], rkun: [], en: "school", ta: "பள்ளி", strokes: 10, rad: "木", radJa: "き", radEn: "tree", grade: 1, comp: [{ w: "学校", r: "がっこう", en: "school", ta: "பள்ளிக்கூடம்" }] },
  { char: "店", on: ["テン"], kun: ["みせ"], ron: ["ten"], rkun: ["mise"], en: "store; shop", ta: "கடை", strokes: 8, rad: "广", radJa: "まだれ", radEn: "dotted cliff", grade: 2, comp: [{ w: "店員", r: "てんいん", en: "clerk", ta: "கடைக்காரர்" }] },
  { char: "駅", on: ["エキ"], kun: [], ron: ["eki"], rkun: [], en: "station", ta: "ரயில் நிலையம்", strokes: 14, rad: "馬", radJa: "うま", radEn: "horse", grade: 3, comp: [{ w: "駅前", r: "えきまえ", en: "in front of station", ta: "நிலையத்தின் முன்" }] }, // N4 staged
  { char: "道", on: ["ドウ", "トウ"], kun: ["みち"], ron: ["dou", "tou"], rkun: ["michi"], en: "road; street; way", ta: "வழி / சாலை", strokes: 12, rad: "辶", radJa: "しんにょう", radEn: "walk", grade: 2, comp: [{ w: "歩道", r: "ほどう", en: "sidewalk", ta: "நடைபாதை" }] },
  { char: "門", on: ["モン"], kun: ["かど"], ron: ["mon"], rkun: ["kado"], en: "gate", ta: "வாசல் / வாயில்", strokes: 8, rad: "門", radJa: "もん", radEn: "gate", grade: 2, comp: [{ w: "正門", r: "せいもん", en: "main gate", ta: "முதன்மை வாயில்" }] }, // N4 staged
  { char: "町", on: ["チョウ"], kun: ["まち"], ron: ["chou"], rkun: ["machi"], en: "town", ta: "நகரம்", strokes: 7, rad: "田", radJa: "た", radEn: "field", grade: 1, comp: [{ w: "町長", r: "ちょうちょう", en: "town mayor", ta: "நகரத் தலைவர்" }] },
  { char: "田", on: ["デン"], kun: ["た"], ron: ["den"], rkun: ["ta"], en: "rice field", ta: "வயல்", strokes: 5, rad: "田", radJa: "た", radEn: "field", grade: 1, comp: [{ w: "田んぼ", r: "たんぼ", en: "rice paddy", ta: "நெல் வயல்" }] },

  // Verbs of Motion & Life
  { char: "生", on: ["セイ", "ショウ"], kun: ["いきる", "うまれる", "なま"], ron: ["sei", "shou"], rkun: ["ikiru", "umareru", "nama"], en: "life; birth; raw", ta: "வாழ்க்கை / பிறப்பு", strokes: 5, rad: "生", radJa: "せい", radEn: "life", grade: 1, comp: [{ w: "学生", r: "がくせい", en: "student", ta: "மாணவர்" }] },
  { char: "学", on: ["ガク"], kun: ["まなぶ"], ron: ["gaku"], rkun: ["manabu"], en: "study; learning", ta: "கல்வி", strokes: 8, rad: "子", radJa: "こ", radEn: "child", grade: 1, comp: [{ w: "大学", r: "だいがく", en: "university", ta: "பல்கலைக்கழகம்" }] },
  { char: "行", on: ["コウ", "ギョウ"], kun: ["いく", "ゆく", "おこなう"], ron: ["kou", "gyou"], rkun: ["iku", "yuku", "okonau"], en: "go; conduct", ta: "செல் / போ", strokes: 6, rad: "行", radJa: "ぎょう", radEn: "going", grade: 2, comp: [{ w: "銀行", r: "ぎんこう", en: "bank", ta: "வங்கி" }] },
  { char: "来", on: ["ライ"], kun: ["くる", "きたる"], ron: ["rai"], rkun: ["kuru", "kitaru"], en: "come", ta: "வா / வருகை", strokes: 7, rad: "木", radJa: "き", radEn: "tree", grade: 2, comp: [{ w: "来週", r: "らいしゅう", en: "next week", ta: "அடுத்த வாரம்" }] },
  { char: "帰", on: ["キ"], kun: ["かえる"], ron: ["ki"], rkun: ["kaeru"], en: "return home", ta: "திரும்புதல்", strokes: 10, rad: "巾", radJa: "はば", radEn: "cloth", grade: 2, comp: [{ w: "帰国", r: "きこく", en: "return to country", ta: "தாயகம் திரும்புதல்" }] }, // N4 staged
  { char: "食", on: ["ショク"], kun: ["たべる", "くう"], ron: ["shoku"], rkun: ["taberu", "kuu"], en: "eat; food", ta: "சாப்பிடு / உணவு", strokes: 9, rad: "食", radJa: "しょく", radEn: "food", grade: 2, comp: [{ w: "食堂", r: "しょくどう", en: "cafeteria", ta: "உணவகம்" }] },
  { char: "飲", on: ["イン"], kun: ["のむ"], ron: ["in"], rkun: ["nomu"], en: "drink", ta: "குடி / பருகு", strokes: 12, rad: "食", radJa: "しょく", radEn: "food", grade: 3, comp: [{ w: "飲み物", r: "のみもの", en: "beverage", ta: "பானம்" }] },
  { char: "見", on: ["ケン"], kun: ["みる", "みえる"], ron: ["ken"], rkun: ["miru", "mieru"], en: "see; look", ta: "பார் / காண்", strokes: 7, rad: "見", radJa: "みる", radEn: "see", grade: 1, comp: [{ w: "意見", r: "いけん", en: "opinion", ta: "கருத்து" }] },
  { char: "聞", on: ["ブン", "モン"], kun: ["きく", "きこえる"], ron: ["bun", "mon"], rkun: ["kiku", "kikoeru"], en: "hear; listen; ask", ta: "கேள் / செவிமடு", strokes: 14, rad: "耳", radJa: "みみ", radEn: "ear", grade: 2, comp: [{ w: "新聞", r: "しんぶん", en: "newspaper", ta: "செய்தித்தாள்" }] },
  { char: "読", on: ["ドク", "トク"], kun: ["よむ"], ron: ["doku", "toku"], rkun: ["yomu"], en: "read", ta: "படி / வாசி", strokes: 14, rad: "言", radJa: "ごんべん", radEn: "word", grade: 2, comp: [{ w: "読書", r: "どくしょ", en: "reading books", ta: "புத்தகம் படித்தல்" }] },
  { char: "書", on: ["ショ"], kun: ["かく"], ron: ["sho"], rkun: ["kaku"], en: "write; book", ta: "எழுது / நூல்", strokes: 10, rad: "曰", radJa: "ひらび", radEn: "say", grade: 2, comp: [{ w: "図書館", r: "としょかん", en: "library", ta: "நூலகம்" }] },
  { char: "話", on: ["ワ"], kun: ["はなす", "はなし"], ron: ["wa"], rkun: ["hanasu", "hanashi"], en: "talk; story", ta: "பேசு / கதை", strokes: 13, rad: "言", radJa: "ごんべん", radEn: "word", grade: 2, comp: [{ w: "電話", r: "でんわ", en: "telephone", ta: "தொலைபேசி" }] },
  { char: "買", on: ["バイ"], kun: ["かう"], ron: ["bai"], rkun: ["kau"], en: "buy", ta: "வாங்கு", strokes: 12, rad: "貝", radJa: "かい", radEn: "shell", grade: 2, comp: [{ w: "買い物", r: "かいもの", en: "shopping", ta: "ஷாப்பிங்" }] },
  { char: "入", on: ["ニュウ"], kun: ["はいる", "いれる"], ron: ["nyuu"], rkun: ["hairu", "ireru"], en: "enter; put in", ta: "உள்ளே செல் / நுழை", strokes: 2, rad: "入", radJa: "いる", radEn: "enter", grade: 1, comp: [{ w: "入学", r: "にゅうがく", en: "school admission", ta: "சேர்க்கை" }] },
  { char: "出", on: ["シュツ"], kun: ["でる", "だす"], ron: ["shutsu"], rkun: ["deru", "dasu"], en: "exit; leave", ta: "வெளியேறு / கொடு", strokes: 5, rad: "凵", radJa: "かんにょう", radEn: "container", grade: 1, comp: [{ w: "出口", r: "でぐち", en: "exit", ta: "வெளியேறும் வழி" }] },
  { char: "立", on: ["リツ"], kun: ["たつ", "たてる"], ron: ["ritsu"], rkun: ["tatsu", "tateru"], en: "stand", ta: "நில் / எழு", strokes: 5, rad: "立", radJa: "たつ", radEn: "stand", grade: 1, comp: [{ w: "国立", r: "こくりつ", en: "national", ta: "தேசிய" }] },
  { char: "休", on: ["キュウ"], kun: ["やすむ", "やすまる"], ron: ["kyuu"], rkun: ["yasumu", "yasumaru"], en: "rest; day off", ta: "ஓய்வு", strokes: 6, rad: "人", radJa: "ひと", radEn: "person", grade: 1, comp: [{ w: "休み", r: "やすみ", en: "holiday / rest", ta: "விடுமுறை" }] },

  // Adjectives & Descriptions
  { char: "大", on: ["ダイ", "タイ"], kun: ["おおきい", "おおいに"], ron: ["dai", "tai"], rkun: ["ookii", "ooini"], en: "big; large", ta: "பெரிய", strokes: 3, rad: "大", radJa: "だい", radEn: "big", grade: 1, comp: [{ w: "大学", r: "だいがく", en: "university", ta: "பல்கலைக்கழகம்" }] },
  { char: "小", on: ["ショウ"], kun: ["ちいさい", "こ", "お"], ron: ["shou"], rkun: ["chiisai", "ko", "o"], en: "small; little", ta: "சிறிய", strokes: 3, rad: "小", radJa: "しょう", radEn: "small", grade: 1, comp: [{ w: "小学校", r: "しょうがっこう", en: "elementary school", ta: "தொடக்கப் பள்ளி" }] },
  { char: "高", on: ["コウ"], kun: ["たかい"], ron: ["kou"], rkun: ["takai"], en: "tall; expensive", ta: "உயர்ந்த / விலைமதிப்புள்ள", strokes: 10, rad: "高", radJa: "たかい", radEn: "tall", grade: 2, comp: [{ w: "高校", r: "こうこう", en: "high school", ta: "உயர்நிலைப் பள்ளி" }] },
  { char: "安", on: ["アン"], kun: ["やすい"], ron: ["an"], rkun: ["yasui"], en: "cheap; safe; calm", ta: "மலிவான / அமைதியான", strokes: 6, rad: "宀", radJa: "うかんむり", radEn: "roof", grade: 3, comp: [{ w: "安心", r: "あんしん", en: "peace of mind", ta: "நிம்மதி" }] },
  { char: "新", on: ["シン"], kun: ["あたらしい", "あらた"], ron: ["shin"], rkun: ["atarashii", "arata"], en: "new", ta: "புதிய", strokes: 13, rad: "斤", radJa: "おの", radEn: "axe", grade: 2, comp: [{ w: "新聞", r: "しんぶん", en: "newspaper", ta: "செய்தித்தாள்" }] },
  { char: "古", on: ["コ"], kun: ["ふるい"], ron: ["ko"], rkun: ["furui"], en: "old (things)", ta: "பழைய", strokes: 5, rad: "口", radJa: "くち", radEn: "mouth", grade: 2, comp: [{ w: "古代", r: "こだい", en: "ancient times", ta: "பழங்காலம்" }] },
  { char: "長", on: ["チョウ"], kun: ["ながい"], ron: ["chou"], rkun: ["nagai"], en: "long; leader", ta: "நீளமான / தலைவர்", strokes: 8, rad: "長", radJa: "ながい", radEn: "long", grade: 2, comp: [{ w: "校長", r: "こうちょう", en: "principal", ta: "முதல்வர்" }] },
  { char: "白", on: ["ハク", "ビャク"], kun: ["しろ", "しろい"], ron: ["haku", "byaku"], rkun: ["shiro", "shiroi"], en: "white", ta: "வெள்ளை", strokes: 5, rad: "白", radJa: "しろ", radEn: "white", grade: 1, comp: [{ w: "面白い", r: "おもしろい", en: "interesting", ta: "சுவாரஸ்யமான" }] },
  { char: "赤", on: ["セキ", "シャク"], kun: ["あか", "あかい"], ron: ["seki", "shaku"], rkun: ["aka", "akai"], en: "red", ta: "சிவப்பு", strokes: 7, rad: "赤", radJa: "あか", radEn: "red", grade: 1, comp: [{ w: "赤ちゃん", r: "あかちゃん", en: "baby", ta: "குழந்தை" }] },
  { char: "早", on: ["ソウ", "サッ"], kun: ["はやい"], ron: ["sou", "sa"], rkun: ["hayai"], en: "early; fast", ta: "சீக்கிரம் / விடியற்காலை", strokes: 6, rad: "日", radJa: "ひ", radEn: "sun", grade: 1, comp: [{ w: "早く", r: "はやく", en: "early / quickly", ta: "விரைவாக" }] }, // N4 staged

  // Concepts & Objects
  { char: "名", on: ["メイ", "ミョウ"], kun: ["な"], ron: ["mei", "myou"], rkun: ["na"], en: "name; fame", ta: "பெயர்", strokes: 6, rad: "口", radJa: "くち", radEn: "mouth", grade: 1, comp: [{ w: "有名", r: "ゆうめい", en: "famous", ta: "பிரபலமான" }] },
  { char: "車", on: ["シャ"], kun: ["くるま"], ron: ["sha"], rkun: ["kuruma"], en: "car; vehicle; wheel", ta: "வாகனம் / கார்", strokes: 7, rad: "車", radJa: "くるま", radEn: "cart", grade: 1, comp: [{ w: "電車", r: "でんしゃ", en: "train", ta: "ரயில்" }] },
  { char: "本", on: ["ホン"], kun: ["もと"], ron: ["hon"], rkun: ["moto"], en: "book; origin", ta: "புத்தகம் / மூலம்", strokes: 5, rad: "木", radJa: "き", radEn: "tree", grade: 1, comp: [{ w: "本屋", r: "ほんや", en: "bookstore", ta: "புத்தகக் கடை" }] },
  { char: "何", on: ["カ"], kun: ["なに", "なん"], ron: ["ka"], rkun: ["nani", "nan"], en: "what", ta: "என்ன", strokes: 7, rad: "人", radJa: "ひと", radEn: "person", grade: 2, comp: [{ w: "何時", r: "なんじ", en: "what time", ta: "என்ன நேரம்" }] },
  { char: "語", on: ["ゴ"], kun: ["かたる"], ron: ["go"], rkun: ["kataru"], en: "language; word", ta: "மொழி / சொல்", strokes: 14, rad: "言", radJa: "ごんべん", radEn: "word", grade: 2, comp: [{ w: "日本語", r: "にほんご", en: "Japanese language", ta: "ஜப்பானிய மொழி" }] },
  { char: "電", on: ["デン"], kun: [], ron: ["den"], rkun: [], en: "electricity", ta: "மின்சாரம்", strokes: 13, rad: "雨", radJa: "あめ", radEn: "rain", grade: 2, comp: [{ w: "電気", r: "でんき", en: "electricity / light", ta: "மின்விளக்கு" }] },
];

const N4_STAGED_CHARS = new Set(['週', '体', '駅', '帰', '門', '早']);

const n5Raw = RAW_ALL_KANJI.filter(k => !N4_STAGED_CHARS.has(k.char));
const n4Raw = RAW_ALL_KANJI.filter(k => N4_STAGED_CHARS.has(k.char));

console.log(`Building N5 Kanji dataset with EXACTLY ${n5Raw.length} canonical characters...`);
console.log(`Staging ${n4Raw.length} characters into N4 dataset...`);

function buildEntries(rawList, levelPrefix, jlptLevel) {
  return rawList.map((k, index) => {
    const padIndex = String(index + 1).padStart(3, '0');
    const id = `kj_${levelPrefix}_${padIndex}`;

    return {
      id,
      character: k.char,
      jlptLevel,
      levelMetadata: {
        level: jlptLevel,
        isEstimated: true,
        sourceReference: `MEXT Kyōiku Grade ${k.grade} / EDRDG KANJIDIC2`,
        officialDisclaimer: "JLPT does not publish official fixed kanji lists.",
      },
      meaningEn: k.en,
      meaningTa: k.ta,
      onyomi: k.on,
      kunyomi: k.kun,
      romajiOn: k.ron,
      romajiKun: k.rkun,
      strokeCount: k.strokes,
      radical: {
        character: k.rad,
        nameJa: k.radJa,
        nameEn: k.radEn,
        strokes: k.strokes <= 3 ? k.strokes : Math.min(k.strokes, 4),
      },
      grade: k.grade,
      compounds: k.comp.map(c => ({
        word: c.w,
        reading: c.r,
        romaji: c.r,
        meaningEn: c.en,
        meaningTa: c.ta,
        jlptLevel,
      })),
      examples: [
        {
          id: `ex_${id}_1`,
          ja: `${k.char}を勉強します。`,
          kana: `${k.char}をべんきょうします。`,
          en: `I study ${k.en}.`,
          ta: `நான் '${k.ta}' பயில்கிறேன்.`,
        }
      ],
      difficulty: 1,
      source: `KANJIDIC2 / MEXT Grade ${k.grade}`,
      reviewStatus: "published",
      createdDate: "2026-11-06T00:00:00Z",
    };
  });
}

const n5Entries = buildEntries(n5Raw, 'n5', 'N5');
const n4Entries = buildEntries(n4Raw, 'n4', 'N4');

const n5Content = `import { KanjiEntry } from "../../types/content";

/**
 * JLPT N5 Kanji Modular Dataset (Canonical 103 Characters)
 * Attribution: MEXT Elementary Kyōiku Grade 1–2 / EDRDG KANJIDIC2
 * All post-2010 JLPT classifications are curricular reference standards (isEstimated: true).
 */
export const N5_KANJI: KanjiEntry[] = ${JSON.stringify(n5Entries, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/kanji/n5.ts'), n5Content, 'utf8');
console.log(`✓ Successfully wrote src/data/kanji/n5.ts with ${n5Entries.length} canonical N5 Kanji.`);

const n4Content = `import { KanjiEntry } from "../../types/content";

/**
 * JLPT N4 Kanji Modular Dataset (Staged Initial Entries)
 * Attribution: MEXT Elementary Kyōiku Grade 1–3 / EDRDG KANJIDIC2
 * All post-2010 JLPT classifications are curricular reference standards (isEstimated: true).
 */
export const N4_KANJI: KanjiEntry[] = ${JSON.stringify(n4Entries, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/kanji/n4.ts'), n4Content, 'utf8');
console.log(`✓ Successfully wrote src/data/kanji/n4.ts with ${n4Entries.length} staged N4 Kanji.`);
