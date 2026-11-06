import 'server-only';

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

// [question, options, correctIndex, explanationEn, explanationTa?, category?, section?, passage?, audioPrompt?]
export type RawQuestionTuple = [
  string,
  string[],
  number,
  string,
  string?,
  ('Vocabulary' | 'Grammar' | 'Reading' | 'Listening')?,
  string?,
  string?,
  string?
];

export interface ServerExamQuestion {
  id: string;
  level: JLPTLevel;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  explanationTa?: string;
  category: 'Vocabulary' | 'Grammar' | 'Reading' | 'Listening';
  section?: string;
  passage?: string;
  audioPrompt?: string;
}

export interface ExamReviewItem {
  id: string;
  question: string;
  options: string[];
  userSelected: number | null;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
  explanationTa?: string;
  category: 'Vocabulary' | 'Grammar' | 'Reading' | 'Listening';
  section?: string;
}

const SERVER_QUESTION_BANK: Record<JLPTLevel, RawQuestionTuple[]> = {
  N5: [
    // Section 1: Language Knowledge (Vocabulary & Kanji) - Q1 to Q7
    [
      "「山」の読み方は？",
      ["やま", "かわ", "うみ", "そら"],
      0,
      "山 is read やま (mountain).",
      "山 என்பது 'やま' (மலை) என்று வாசிக்கப்படுகிறது.",
      "Vocabulary",
      "Language Knowledge"
    ],
    [
      "「昨日」の意味は？",
      ["today", "yesterday", "tomorrow", "morning"],
      1,
      "昨日（きのう）means yesterday.",
      "昨日 (きのう) என்றால் 'நேற்று' என்று பொருள்.",
      "Vocabulary",
      "Language Knowledge"
    ],
    [
      "「安い」の反対は？",
      ["高い", "古い", "近い", "少ない"],
      0,
      "高い (expensive/high) contrasts with 安い (cheap).",
      "安い (மலிவான) என்பதன் எதிர்ப்பதம் 高い (விலையுயர்ந்த).",
      "Vocabulary",
      "Language Knowledge"
    ],
    [
      "「友達」の読み方は？",
      ["ともだち", "ともたち", "ゆうだち", "とももち"],
      0,
      "友達 is read ともだち (friend).",
      "友達 என்பது 'ともだち' (நண்பர்) என்று வாசிக்கப்படுகிறது.",
      "Vocabulary",
      "Language Knowledge"
    ],
    [
      "「午後」の読み方は？",
      ["ごぜん", "ごご", "あさ", "よる"],
      1,
      "午後 is read ごご and means afternoon / PM.",
      "午後 என்பது 'ごご' (பிற்பகல்) என்று வாசிக்கப்படுகிறது.",
      "Vocabulary",
      "Language Knowledge"
    ],
    [
      "「病院」はどんなところですか。",
      ["本を買うところ", "病気の人が行くところ", "電車に乗るところ", "ご飯を食べるところ"],
      1,
      "病院（びょういん）is a hospital where sick people receive care.",
      "病院 (びょういん) என்பது நோயாளிகள் சிகிச்சை பெற செல்லும் இடம் (மருத்துவமனை).",
      "Vocabulary",
      "Language Knowledge"
    ],
    [
      "「毎週」の読み方は？",
      ["まいにち", "まいしゅう", "まいつき", "まいとし"],
      1,
      "毎週 is read まいしゅう (every week).",
      "毎週 என்பது 'まいしゅう' (ஒவ்வொரு வாரமும்) என்று வாசிக்கப்படுகிறது.",
      "Vocabulary",
      "Language Knowledge"
    ],

    // Section 2: Language Knowledge (Grammar) - Q8 to Q14
    [
      "わたしは毎朝、パン___食べます。",
      ["を", "に", "で", "が"],
      0,
      "を marks the direct object of the verb 食べます.",
      "செயலின் இலக்குப்பொருளை (Direct Object) குறிக்க 'を' வேற்றுமை உருபு பயன்படுகிறது.",
      "Grammar",
      "Language Knowledge"
    ],
    [
      "田中さん___学生です。",
      ["は", "を", "で", "に"],
      0,
      "は marks the topic: Tanaka-san is a student.",
      "வாக்கியத்தின் முதன்மை தலைப்பை (Topic) குறிக்க 'は' பயன்படுகிறது.",
      "Grammar",
      "Language Knowledge"
    ],
    [
      "毎日六時___起きます。",
      ["に", "を", "で", "へ"],
      0,
      "に marks a specific clock time at which an action occurs.",
      "குறிப்பிட்ட மணி நேரத்தைக் குறிக்க 'に' பயன்படுகிறது.",
      "Grammar",
      "Language Knowledge"
    ],
    [
      "これはだれ___かばんですか。",
      ["の", "を", "に", "で"],
      0,
      "だれの asks whose; の marks possession.",
      "உடைமையைக் குறிக்க 'の' (யாருடைய பை) பயன்படுகிறது.",
      "Grammar",
      "Language Knowledge"
    ],
    [
      "きのう、映画を___。",
      ["見ます", "見ました", "見ません", "見ましょう"],
      1,
      "きのう indicates the past; 見ました is the polite past tense.",
      "நேற்று என்ற கடந்த காலத்தைக் குறிப்பதால் '見ました' (பார்த்தேன்) பொருந்தும்.",
      "Grammar",
      "Language Knowledge"
    ],
    [
      "机の上に本が二___あります。",
      ["人", "本", "冊", "匹"],
      2,
      "冊（さつ）is the counter for bound books.",
      "புத்தகங்களை எண்ணுவதற்கு '冊' (சட்சு) என்ற எண் அடைமொழி பயன்படுகிறது.",
      "Grammar",
      "Language Knowledge"
    ],
    [
      "駅___友達を待ちます。",
      ["で", "を", "が", "へ"],
      0,
      "で marks the location where an action takes place.",
      "ஒரு செயல் நடைபெறும் இடத்தை குறிக்க 'で' உருபு பயன்படுகிறது.",
      "Grammar",
      "Language Knowledge"
    ],

    // Section 3: Reading Comprehension (読解) - Q15 to Q17
    [
      "木村さんはデパートで何をしましたか。",
      ["靴を買ってラーメンを食べた", "本を読んだ", "電車に乗った", "映画を見た"],
      0,
      "The diary states: 新しい靴を買って、レストランで美味しいラーメンを食べました (bought shoes and ate ramen).",
      "டைரியில் 'புதிய காலணி வாங்கி, உணவகத்தில் சுவையான ராமென் சாப்பிட்டேன்' என்று தெளிவாக கூறப்பட்டுள்ளது.",
      "Reading",
      "Reading",
      "木村さんの日記：きのうは友達とデパートへ行きました。新しい靴を買って、レストランで美味しいラーメンを食べました。"
    ],
    [
      "図書館で飲んでもいいものは何ですか。",
      ["水とお茶", "ジュースとコーヒー", "お酒", "何も飲んではいけない"],
      0,
      "The library notice says: 飲み物は水とお茶だけ飲んでもいいです (only water and tea allowed).",
      "நூலக அறிவிப்பில் 'தண்ணீர் மற்றும் தேநீர் மட்டுமே அருந்தலாம்' என்று தெளிவாக குறிப்பிடப்பட்டுள்ளது.",
      "Reading",
      "Reading",
      "図書館からのお願い：館内では静かにしてください。飲み物は水とお茶だけ飲んでもいいです。"
    ],
    [
      "田中さんは何で大学へ行きますか。",
      ["電車", "バス", "自転車", "歩いて"],
      0,
      "The passage explicitly states: ８時に電車で大学へ行きます (goes by train).",
      "பகுதியில் '8 மணிக்கு ரயிலில் பல்கலைக்கழகம் செல்கிறார்' என்று குறிப்பிடப்பட்டுள்ளது.",
      "Reading",
      "Reading",
      "田中さんは毎朝７時に起きて、パンと卵を食べます。８時に電車で大学へ行きます。"
    ],

    // Section 4: Listening Comprehension (聴解) - Q18 to Q20
    [
      "駅はどこにありますか。",
      ["角を右へ曲がったところ", "左の建物の後ろ", "信号を渡ったところ", "バス停の隣"],
      0,
      "The man directs: あの角を右へ曲がると、すぐ前にありますよ (turn right at the corner).",
      "அந்த மூலையில் வலதுபுறம் திரும்பினால் நேரே ரயில் நிலையம் உள்ளது என்று வழிகாட்டுகிறார்.",
      "Listening",
      "Listening",
      undefined,
      "女の人：すみません、駅はどこですか。男の人：あの角を右へ曲がると、すぐ前にありますよ。女の人：わかりました。ありがとうございます。"
    ],
    [
      "パーティーは何時に始まりますか。",
      ["午後６時半", "午後６時", "午後６時１５分", "午後７時"],
      0,
      "The woman clearly answers: 午後６時半からです (starts at 6:30 PM).",
      "மங்கையர் மாலை 6:30 மணி முதல் என்று பதிலளிக்கிறார்.",
      "Listening",
      "Listening",
      undefined,
      "男の人：明日のパーティーは何時に始まりますか。女の人：午後６時半からです。男の人：じゃあ、６時１５分に行きますね。"
    ],
    [
      "二人は何を食べに行きますか。",
      ["ラーメン", "寿司", "カレー", "パン"],
      0,
      "The man suggests ラーメンを食べましょう and the woman agrees (そうしましょう).",
      "இருவரும் ராமென் சாப்பிட முடிவு செய்கிறார்கள்.",
      "Listening",
      "Listening",
      undefined,
      "女の人：いっしょにお昼ご飯を食べに行きませんか。男の人：いいですね、ラーメンを食べましょう。女の人：そうしましょう。"
    ]
  ],
  N4: [
    ["「準備」の読み方は？", ["じゅんび", "じゅびん", "しゅんび", "じゅんぴ"], 0, "準備 is read じゅんび.", "தயாரிப்பு / ஏற்பாடு", "Vocabulary"],
    ["会議に間に合う___、早く出ました。", ["ように", "そうに", "ためで", "ことに"], 0, "ように expresses doing something so that a goal can be achieved.", "நோக்கத்தை அடைய 'ように'", "Grammar"],
    ["この料理は思った___おいしかった。", ["より", "まで", "ほどに", "しか"], 0, "思ったより means more than expected.", "எதிர்பார்த்ததை விட", "Grammar"],
    ["電車が遅れたので、学校に遅刻しました。なぜ遅刻しましたか。", ["電車が遅れたから", "寝なかったから", "雨が降ったから", "道に迷ったから"], 0, "The passage directly gives the train delay as the reason.", "ரயில் தாமதம்", "Grammar"],
    ["「経験」に近い意味は？", ["体験", "予定", "説明", "連絡"], 0, "経験 and 体験 both refer to experience.", "அனுபவம்", "Vocabulary"],
    ["薬を飲ん___、少し休んでください。", ["でから", "だから", "ても", "ながらに"], 0, "てから indicates the next action after taking medicine.", "செய்த பிறகு", "Grammar"],
    ["部屋をきれいに___ください。", ["して", "なって", "あって", "おいてて"], 0, "きれいにする means to make/keep clean.", "சுத்தமாக வைத்திருங்கள்", "Grammar"],
    ["雨が降りそうです。", ["It looks like it will rain", "It rained yesterday", "It never rains", "It stopped raining"], 0, "〜そうです here expresses appearance or likelihood.", "மழை பெய்யும் போல் உள்ளது", "Grammar"],
    ["約束の時間を忘れない___、メモしました。", ["ように", "ためで", "そうで", "ながら"], 0, "ように expresses taking care not to forget.", "மறக்காமல் இருக்க", "Grammar"],
    ["この道をまっすぐ行くと、右に銀行があります。銀行はどこですか。", ["まっすぐ進んで右", "左に曲がる", "後ろに戻る", "駅の中"], 0, "The directions say straight ahead, then on the right.", "நேரே சென்று வலப்புறம்", "Grammar"],
    ["「連絡」の読み方は？", ["れんらく", "れんろく", "ねんらく", "れんがく"], 0, "連絡 is read れんらく.", "தொடர்பு", "Vocabulary"],
    ["宿題をした___、テレビを見ました。", ["あとで", "まえに", "ながら", "までに"], 0, "あとで indicates after completing homework.", "பிறகு", "Grammar"],
    ["この店は駅から近い___、便利です。", ["ので", "のに", "でも", "なら"], 0, "ので expresses a natural cause or reason.", "அதனால் / ஆதலால்", "Grammar"],
    ["窓が開いています。だれかが___ようです。", ["開けた", "開ける", "開けて", "開けない"], 0, "開けたようです indicates an inference from past action.", "திறந்திருப்பதாக தெரிகிறது", "Grammar"],
    ["「間に合う」の意味は？", ["to be on time", "to get lost", "to be absent", "to forget"], 0, "間に合う means to be on time.", "நேரத்திற்கு சென்று சேர்வது", "Vocabulary"],
    ["日本へ行く___、日本語を勉強しています。", ["ために", "そうに", "ながら", "ばかり"], 0, "ために expresses a conscious purpose or goal.", "ஜப்பான் செல்வதற்காக", "Grammar"],
    ["ここに車を止め___はいけません。", ["て", "た", "る", "ない"], 0, "〜てはいけません expresses prohibition.", "நிறுத்தக்கூடாது", "Grammar"],
    ["彼は毎日練習しているので、上手に___ようになりました。", ["話せる", "話す", "話して", "話した"], 0, "〜ようになる indicates a newly acquired ability or state.", "பேசக்கூடிய நிலை", "Grammar"],
    ["「残念」の意味に近いものは？", ["disappointing", "convenient", "careful", "healthy"], 0, "残念 means regrettable or disappointing.", "வருந்தத்தக்கது", "Vocabulary"],
    ["このボタンを押すと、ドアが開きます。何をするとドアが開きますか。", ["ボタンを押す", "窓を閉める", "電気を消す", "名前を書く"], 0, "The sentence directly says ボタンを押すと.", "பொத்தானை அழுத்தினால்", "Grammar"]
  ],
  N3: [
    ["「影響」の読み方は？", ["えいきょう", "えいこう", "いんきょう", "えんきょう"], 0, "影響 is read えいきょう.", "தாக்கம்", "Vocabulary"],
    ["雨にも___、試合は行われた。", ["かかわらず", "つれて", "おいて", "よって"], 0, "〜にもかかわらず means in spite of or despite.", "இருப்பினும் / பொருட்படுத்தாமல்", "Grammar"],
    ["彼は忙しい___、毎日運動している。", ["ながらも", "うえで", "とおりに", "ばかりに"], 0, "ながらも means although or even while.", "இருந்தபோதிலும்", "Grammar"],
    ["新しい制度の導入によって、仕事の効率が上がった。何が効率を上げましたか。", ["新しい制度", "休日の増加", "人員の減少", "機械の故障"], 0, "によって marks the cause/means: new system.", "புதிய முறைமை", "Grammar"],
    ["「維持」の意味は？", ["keep something in the same state", "make something disappear", "change completely", "put something off"], 0, "維持 means to maintain or preserve.", "பராமரித்தல்", "Vocabulary"],
    ["説明を聞いた___、まだよく分からない。", ["ものの", "うえで", "ところで", "かわりに"], 0, "ものの means although.", "கேட்டபோதிலும்", "Grammar"],
    ["彼は約束した___、来なかった。", ["にもかかわらず", "にしたがって", "にとって", "に比べて"], 0, "にもかかわらず means despite having promised.", "இருந்தபோதிலும்", "Grammar"],
    ["この薬は食後に飲む___書いてあります。", ["ように", "ことに", "ためで", "ものを"], 0, "ように書く expresses an instruction: to take after meals.", "சாப்பிட்ட பின் குடிக்குமாறு", "Grammar"],
    ["利用者が増える___、サービスの改善も必要になる。", ["につれて", "として", "にしても", "に限って"], 0, "〜につれて means as something progresses or increases.", "அதிகரிக்க அதிகரிக்க", "Grammar"],
    ["調査の結果、利用者の多くが簡単な操作を望んでいることが分かった。利用者は何を望んでいますか。", ["簡単な操作", "高い料金", "複雑な機能", "長い説明"], 0, "The sentence says 簡単な操作を望んでいる.", "எளிய பயன்பாடு", "Grammar"],
    ["「比較」の読み方は？", ["ひかく", "ひがく", "びかく", "ひこう"], 0, "比較 is read ひかく.", "ஒப்பீடு", "Vocabulary"],
    ["この町は昔に比べて、ずいぶん便利に___。", ["なった", "した", "して", "なる"], 0, "便利になった indicates became convenient.", "வசதியாக மாறியது", "Grammar"],
    ["時間がない___、急いでください。", ["のだから", "ところで", "ものの", "ばかりに"], 0, "のだから expresses an obvious premise: since there is no time.", "நேரமில்லாததால்", "Grammar"],
    ["彼は説明を聞いたうえで、参加するかどうか決めた。いつ決めましたか。", ["説明を聞いてから", "説明を聞く前に", "説明を聞かずに", "説明の途中で"], 0, "〜たうえで means after doing something.", "கேட்ட பிறகு", "Grammar"],
    ["「改善」の意味は？", ["making something better", "making something smaller", "putting something away", "making a copy"], 0, "改善 means improvement or making something better.", "முன்னேற்றம்", "Vocabulary"],
    ["毎日運動すること___、健康になった。", ["によって", "にとって", "について", "に対して"], 0, "によって indicates the means/method.", "மூலம்", "Grammar"],
    ["彼女は歌が上手な___、ピアノも弾ける。", ["うえに", "かわりに", "せいで", "ところが"], 0, "〜うえに means in addition to or not only... but also.", "மேலும் / அதுமட்டுமின்றி", "Grammar"],
    ["電車に傘を忘れてしまった。話し手はどうしましたか。", ["傘を電車に置き忘れた", "傘を買いに行った", "電車を降りなかった", "傘を友達に貸した"], 0, "〜てしまった expresses an unintentional mistake.", "குடையை ரயிலில் மறந்து வைத்தது", "Grammar"],
    ["この仕事は一人では無理だ。", ["一人で行うのは難しい", "一人で簡単にできる", "誰でもすぐできる", "仕事をする必要がない"], 0, "無理だ means impossible or too difficult.", "ஒருவரால் செய்வது கடினம்", "Grammar"],
    ["雨が強くなるにつれて、川の水位も上がってきた。何が起きましたか。", ["雨が強まり川の水位が上がった", "雨が止み水位が下がった", "川が乾いてきた", "水位は変わらなかった"], 0, "〜につれて indicates concurrent increase in river water level.", "நீர் மட்டம் உயர்ந்தது", "Grammar"]
  ],
  N2: [
    ["「傾向」の読み方は？", ["けいこう", "けいごう", "きょうこう", "けんこう"], 0, "傾向 is read けいこう.", "போக்கு / சாய்வு", "Vocabulary"],
    ["この計画は費用の面___問題がある。", ["で", "に", "を", "へ"], 0, "〜の面で indicates in terms of aspect.", "செலவு அடிப்படையில்", "Grammar"],
    ["彼の説明は具体例を___、分かりやすかった。", ["交えて", "除いて", "問わず", "反して"], 0, "具体例を交えて means mixing with concrete examples.", "உதாரணங்களுடன்", "Grammar"],
    ["この結果は予想___のものだった。", ["に反する", "に限る", "に沿う", "に応じる"], 0, "予想に反する means contrary to expectations.", "எதிர்பார்ப்புக்கு மாறாக", "Grammar"],
    ["制度を変更するにあたって、利用者の意見を調査した。何をする前に調査しましたか。", ["制度の変更", "商品の発送", "会議の中止", "人員の採用"], 0, "〜にあたって marks an action undertaken prior to an important event.", "மாற்றுவதற்கு முன்", "Grammar"],
    ["「著しい」の意味に近いものは？", ["remarkable", "ordinary", "temporary", "uncertain"], 0, "著しい means striking or remarkable.", "குறிப்பிடத்தக்க", "Vocabulary"],
    ["彼は忙しい___、毎日欠かさず運動している。", ["にもかかわらず", "に応じて", "に基づいて", "に先立って"], 0, "〜にもかかわらず means in spite of or despite.", "இருந்தபோதிலும்", "Grammar"],
    ["この資料は最新のデータ___作成された。", ["に基づいて", "を問わず", "に限って", "と比べてから"], 0, "〜に基づいて means based on or grounded in.", "அடிப்படையில்", "Grammar"],
    ["交通規制に伴い、バスの運行ルートが変更された。何が変更されましたか。", ["バスの運行ルート", "電車の料金", "道路の幅", "駅の営業時間"], 0, "〜に伴い indicates along with or as a consequence of.", "பேருந்து வழித்தடம்", "Grammar"],
    ["彼の提案は検討に値する。", ["検討する価値がある", "検討する必要がない", "すでに却下された", "実行が禁止されている"], 0, "〜に値する means worthy of consideration.", "பரிசீலனைக்கு தகுதியானது", "Grammar"],
    ["計画を実行するかどうかは、予算___だ。", ["次第", "一方", "以来", "最中"], 0, "〜次第だ means depends on.", "பட்ஜெட்டைப் பொறுத்தது", "Grammar"]
  ],
  N1: [
    ["「顕著」の読み方は？", ["けんちょ", "けんしょう", "げんちょ", "けんじょ"], 0, "顕著 is read けんちょ.", "தெளிவான / முக்கிய", "Vocabulary"],
    ["彼の説明は要___得ている。", ["を", "に", "が", "で"], 0, "要を得る is an idiom meaning to the point.", "பொருத்தமானது", "Grammar"],
    ["計画の変更を余儀なくされた。意味は？", ["変更せざるを得なかった", "自由に変更した", "変更を拒否した", "変更を忘れた"], 0, "〜を余儀なくされる means forced to do something.", "கட்டாயப்படுத்தப்பட்டது", "Grammar"],
    ["新制度は導入されたものの、現場では十分に機能していない。状況は？", ["導入済みだが十分に働いていない", "導入が中止された", "現場で高く評価された", "以前より単純になった"], 0, "〜ものの indicates introducing without full efficacy.", "செயல்படவில்லை", "Grammar"],
    ["「妥協」の意味は？", ["互いに譲り合って折り合うこと", "一方的に命令すること", "問題を先送りすること", "事実を隠すこと"], 0, "妥協 means mutual compromise.", "சமாதானம் / விட்டுக்கொடுத்தல்", "Vocabulary"],
    ["彼は周囲の反対を押し切って実行した。", ["反対があっても実行した", "賛成を待って中止した", "周囲に相談せず忘れた", "反対意見に従った"], 0, "押し切る means pushing through opposition.", "எதிர்ப்பையும் மீறி", "Grammar"],
    ["状況を鑑みて、対応を再検討する。鑑みてに近い意味は？", ["考慮して", "無視して", "比較せず", "疑って"], 0, "鑑みて means taking into account.", "கருத்தில் கொண்டு", "Grammar"],
    ["彼の発言は誤解を招きかねない。", ["誤解を生む可能性がある", "誤解を必ず解消する", "誤解とは無関係だ", "誤解を避けた"], 0, "〜かねない expresses risk of negative outcome.", "தவறான புரிதல் ஏற்படும் வாய்ப்பு", "Grammar"],
    ["予算が限られている以上、優先順位をつけるほかない。どうする必要がありますか。", ["優先順位を決める", "予算を無制限に増やす", "計画をすべて中止する", "支出を記録しない"], 0, "〜ほかない indicates having no choice.", "முன்னுரிமை அளிக்க வேண்டும்", "Grammar"],
    ["彼は失敗をものともせず、研究を続けた。", ["失敗を気にせず", "失敗を恐れて", "失敗を隠して", "失敗を喜んで"], 0, "ものともせず means undaunted by failure.", "பொருட்படுத்தாமல்", "Grammar"],
    ["「踏まえる」の意味に最も近いものは？", ["to take into account", "to overlook", "to postpone", "to deny"], 0, "踏まえる means to take something into account.", "அடிப்படையில் கொள்ளுதல்", "Vocabulary"],
    ["彼の説明は論理に___。", ["かなっている", "かけている", "とどまっている", "およんでいる"], 0, "理にかなう means to be logical and sound.", "நியாயமானது", "Grammar"],
    ["この問題は一概に結論づける___。", ["わけにはいかない", "にほかならない", "にすぎない", "ものがある"], 0, "一概に〜わけにはいかない means cannot simply generalize.", "பொதுமைப்படுத்த முடியாது", "Grammar"],
    ["彼女は困難をものともせず、研究を続けた。どのような態度ですか。", ["困難に負けず続けた", "困難を避けてやめた", "困難を他人に任せた", "困難に気づかなかった"], 0, "ものともせず expresses courageous perseverance.", "கைவிடாமல் தொடர்ந்தது", "Grammar"],
    ["「懸命」の意味は？", ["doing one's utmost", "being careless", "being indifferent", "being hesitant"], 0, "懸命 means doing with all one's effort.", "முழு முயற்சி", "Vocabulary"],
    ["彼の発言は誤解を招き___。", ["かねない", "がたい", "かねる", "ぬく"], 0, "〜かねない indicates danger of misunderstanding.", "வாய்ப்பு", "Grammar"],
    ["実情を___、現実的な対策を立てる必要がある。", ["踏まえて", "問わず", "抜きにして", "よそに"], 0, "踏まえて means taking circumstances into account.", "கணக்கில் கொண்டு", "Grammar"],
    ["新技術の導入を___、作業工程を見直した。", ["機に", "限り", "問わず", "皮切りにしても"], 0, "〜を機に means using an event as a turning point.", "வாய்ப்பாக கொண்டு", "Grammar"],
    ["彼は批判を___、自分の信念を貫いた。", ["よそに", "もとに", "皮切りに", "限りに"], 0, "批判をよそに means ignoring criticism.", "பொருட்படுத்தாமல்", "Grammar"],
    ["議論は平行線をたどり、結論には至らなかった。", ["意見が対立したまま進展しなかった", "全員がすぐに賛成した", "結論がすでに決まった", "議論が予定より早く終わった"], 0, "平行線をたどる means discussions reached an impasse.", "முடிவுக்கு வரவில்லை", "Grammar"]
  ]
};

export function getServerQuestionsForLevel(level: JLPTLevel): ServerExamQuestion[] {
  const list = SERVER_QUESTION_BANK[level] || [];
  return list.map(([question, options, correctIndex, explanation, explanationTa, category, section, passage, audioPrompt], idx) => ({
    id: `${level.toLowerCase()}-q-${idx + 1}`,
    level,
    question,
    options,
    correctIndex,
    explanation,
    explanationTa: explanationTa || "",
    category: category || (question.includes('読み方') || question.includes('意味') ? 'Vocabulary' : 'Grammar'),
    section: section || 'Language Knowledge',
    passage,
    audioPrompt,
  }));
}
