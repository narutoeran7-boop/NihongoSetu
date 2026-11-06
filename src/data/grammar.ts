// ==============================================================================
// NIHONGOSETU — JLPT GRAMMAR CURRICULUM
// Enhanced with grammatical formations, English & Tamil definitions and examples
// ==============================================================================

export interface GrammarItem {
  pattern: string;
  reading: string;
  meaning: string;
  meaningTa?: string;
  formation?: string;
  exampleJp: string;
  exampleEn: string;
  exampleTa?: string;
  level: string;
  notes?: string;
}

// [pattern, reading, meaningEn, exampleJp, exampleEn, meaningTa?, formation?, exampleTa?]
type RawGrammarTuple = [
  string,
  string,
  string,
  string,
  string,
  string?,
  string?,
  string?
];

const GRAMMAR_DATA: Record<string, RawGrammarTuple[]> = {
  N5: [
    [
      "です",
      "です",
      "Polite sentence ending; identifies or describes something (to be).",
      "わたしは学生です。",
      "I am a student.",
      "பயனிலை முடிவு (ஆகும் / இருக்கிறேன்).",
      "Noun / な-Adjective + です",
      "நான் ஒரு மாணவன்."
    ],
    [
      "は",
      "は (わ)",
      "Marks the topic of a sentence (as for...).",
      "これは本です。",
      "This is a book.",
      "வாக்கியத்தின் முதன்மை தலைப்பு (பற்றி / என்பது).",
      "Noun + は",
      "இது புத்தகம் ஆகும்."
    ],
    [
      "か",
      "か",
      "Turns a statement into a question at the end of a sentence.",
      "これは何ですか。",
      "What is this?",
      "வினா எழுப்ப வாக்கிய முடிவில் சேரும் உருபு (ஆ?).",
      "Sentence + か",
      "இது என்ன?"
    ],
    [
      "の",
      "の",
      "Shows possession or connects two nouns together.",
      "これはわたしのかばんです。",
      "This is my bag.",
      "உடைமை மற்றும் பெயர்ச்சொல் இணைப்பு (இன் / உடைய).",
      "Noun 1 + の + Noun 2",
      "இது என்னுடைய பை."
    ],
    [
      "も",
      "も",
      "Particle meaning 'also' or 'too', replacing は/が/を.",
      "わたしも行きます。",
      "I will go too.",
      "கூட / உம் ('நானும் செல்வேன்').",
      "Noun + も",
      "நானும் செல்வேன்."
    ],
    [
      "を",
      "を (お)",
      "Marks the direct object of a transitive verb action.",
      "水を飲みます。",
      "I drink water.",
      "செயல்படுபொருள் வேற்றுமை உருபு (ஐ).",
      "Noun + を + Transitive Verb",
      "தண்ணீர் குடிக்கிறேன்."
    ],
    [
      "に",
      "に",
      "Marks specific time, point of existence, or destination.",
      "七時に起きます。",
      "I wake up at seven o'clock.",
      "குறிப்பிட்ட காலம் / இருப்பிடம் / சேருமிடம் (இல் / இற்கு).",
      "Time / Place + に + Verb",
      "ஏழு மணிக்கு எழுகிறேன்."
    ],
    [
      "で",
      "で",
      "Marks the place where an action takes place, or a tool/means.",
      "図書館で勉強します。",
      "I study at the library.",
      "செயல் நடைபெறும் இடம் அல்லது கருவி (இல் / ஆல்).",
      "Place / Means + で + Action Verb",
      "நூலகத்தில் படிக்கிறேன்."
    ],
    [
      "へ",
      "へ (え)",
      "Marks physical direction or destination of motion verbs.",
      "日本へ行きます。",
      "I am going to Japan.",
      "திசை மற்றும் சேருமிடம் (நோக்கி / இற்கு).",
      "Place + へ + 行く/来る/帰る",
      "ஜப்பானை நோக்கிச் செல்கிறேன்."
    ],
    [
      "と",
      "と",
      "Connects nouns ('and') or indicates a companion ('with').",
      "友達と話します。",
      "I talk with my friend.",
      "மற்றும் / உடன்.",
      "Noun + と + Noun / Person + と + Verb",
      "நண்பனுடன் பேசுகிறேன்."
    ],
    [
      "から ～ まで",
      "から ～ まで",
      "Indicates starting point and ending point in time or space (from... to...).",
      "９時から５時まで働きます。",
      "I work from 9 to 5.",
      "இருந்து... வரை.",
      "Time/Place + から + Time/Place + まで",
      "9 மணி முதல் 5 மணி வரை வேலை செய்கிறேன்."
    ],
    [
      "ません",
      "ません",
      "Polite negative non-past verb ending (do not / will not).",
      "肉を食べません。",
      "I do not eat meat.",
      "மரியாதையான எதிர்மறை வினைமுற்று (சாப்பிடுவதில்லை).",
      "Verb [ます-stem] + ません",
      "இறைச்சி உண்பதில்லை."
    ],
    [
      "ました / ませんでした",
      "ました / ませんでした",
      "Polite past affirmative and past negative verb endings.",
      "きのう本を読みました。",
      "I read a book yesterday.",
      "மரியாதையான கடந்தகால வினைமுற்று (செய்தேன் / செய்யவில்லை).",
      "Verb [ます-stem] + ました / ませんでした",
      "நேற்று புத்தகம் படித்தேன்."
    ],
    [
      "たいです",
      "たいです",
      "Expresses speaker's desire to do an action (want to do).",
      "日本へ行きたいです。",
      "I want to go to Japan.",
      "செய்ய விரும்புகிறேன் (ஆசை).",
      "Verb [ます-stem] + たいです",
      "ஜப்பான் செல்ல விரும்புகிறேன்."
    ],
    [
      "てください",
      "てください",
      "Polite request: please do something.",
      "ここに名前を書いてください。",
      "Please write your name here.",
      "தயவுசெய்து செய்யுங்கள் (வேண்டுகோள்).",
      "Verb [て-form] + ください",
      "இங்கு பெயர் எழுதுங்கள்."
    ],
    [
      "ないでください",
      "ないでください",
      "Polite negative request: please do not do something.",
      "ここで写真を撮らないでください。",
      "Please do not take photos here.",
      "தயவுசெய்து செய்யாதீர்கள் (எதிர்மறை வேண்டுகோள்).",
      "Verb [ない-form] + でください",
      "இங்கே புகைப்படம் எடுக்காதீர்கள்."
    ],
    [
      "てもいいです",
      "てもいいです",
      "Asks or grants permission (may do / is allowed to do).",
      "ここに座ってもいいですか。",
      "May I sit here?",
      "செய்யலாம் (அனுமதி).",
      "Verb [て-form] + もいいです (か)",
      "இங்கே உட்காரலாமா?"
    ],
    [
      "てはいけません",
      "てはいけません",
      "Expresses strong prohibition (must not / may not do).",
      "ここに車を止めてはいけません。",
      "You must not park your car here.",
      "செய்யக்கூடாது (கண்டிப்பான தடை).",
      "Verb [て-form] + はいけません",
      "இங்கே கார் நிறுத்தக்கூடாது."
    ],
    [
      "ています",
      "ています",
      "Describes an ongoing progressive action or continuing state.",
      "今、本を読んでいます。",
      "I am reading a book right now.",
      "செய்துகொண்டிருக்கிறேன் (தொடர் செயல்).",
      "Verb [て-form] + います",
      "இப்போது புத்தகம் படித்துக்கொண்டிருக்கிறேன்."
    ],
    [
      "まえに",
      "まえに",
      "Indicates an action happens before another event.",
      "寝る前に本を読みます。",
      "I read a book before going to sleep.",
      "செய்வதற்கு முன்பு.",
      "Verb [Dictionary form] + まえに",
      "தூங்குவதற்கு முன் புத்தகம் படிப்பேன்."
    ]
  ],
  N4: [
    ["なければなりません", "なければなりません", "Expresses obligation: must do.", "毎日勉強しなければなりません。", "I must study every day."],
    ["なくてもいいです", "なくてもいいです", "Says something is not necessary.", "明日は来なくてもいいです。", "You do not have to come tomorrow."],
    ["たことがある", "たことがある", "Describes past experience.", "富士山に登ったことがあります。", "I have climbed Mount Fuji."],
    ["たり～たりする", "たり～たりする", "Lists representative actions.", "休みの日は本を読んだり、映画を見たりします。", "On days off I read books, watch movies, and so on."],
    ["ながら", "ながら", "Two actions done at the same time.", "音楽を聞きながら勉強します。", "I study while listening to music."],
    ["そうです（様態）", "そうです", "Indicates appearance or something that seems likely.", "このケーキはおいしそうです。", "This cake looks delicious."],
    ["と思います", "と思います", "Expresses an opinion or thought.", "明日は雨だと思います。", "I think it will rain tomorrow."],
    ["かもしれません", "かもしれません", "Expresses possibility or uncertainty.", "彼は来ないかもしれません。", "He might not come."],
    ["てしまう", "てしまう", "Expresses completion or regret.", "財布を忘れてしまいました。", "I unfortunately forgot my wallet."],
    ["ために", "ために", "Expresses purpose or reason.", "日本で働くために、日本語を勉強しています。", "I study Japanese in order to work in Japan."]
  ],
  N3: [
    ["ことにする", "ことにする", "Expresses a decision made by the speaker.", "毎朝走ることにしました。", "I have decided to run every morning."],
    ["ことになる", "ことになる", "Expresses a decision or arrangement made by others or circumstances.", "来月から大阪で働くことになりました。", "It has been decided that I will work in Osaka from next month."],
    ["ようにする", "ようにする", "Describes making an effort or forming a habit.", "毎日漢字を復習するようにしています。", "I make a point of reviewing kanji every day."],
    ["ようになる", "ようになる", "Describes a change or new ability.", "日本語の新聞が読めるようになりました。", "I have become able to read Japanese newspapers."],
    ["ばかり", "ばかり", "Indicates doing nothing but something, or having just done it depending on form.", "弟はゲームばかりしています。", "My younger brother does nothing but play games."],
    ["わけではない", "わけではない", "Softens or partially denies a generalization.", "日本料理が嫌いなわけではありません。", "It is not that I dislike Japanese food."],
    ["はずだ", "はずだ", "Expresses an expectation based on reason or information.", "田中さんはもう着いたはずです。", "Tanaka should have arrived by now."],
    ["おかげで", "おかげで", "Indicates a positive result thanks to something.", "先生のおかげで合格できました。", "Thanks to my teacher, I was able to pass."],
    ["せいで", "せいで", "Indicates a negative result caused by something.", "雨のせいで試合が中止になりました。", "The match was cancelled because of the rain."],
    ["一方で", "一方で", "Introduces a contrasting side or simultaneous trend.", "都会は便利な一方で、生活費が高いです。", "Cities are convenient, but living costs are high."]
  ],
  N2: [
    ["に違いない", "に違いない", "Expresses a strong inference: must surely be.", "電気がついている。まだ家にいるに違いない。", "The light is on. They must still be home."],
    ["わけにはいかない", "わけにはいかない", "Indicates that circumstances or responsibility make an action impossible.", "明日は試験なので、休むわけにはいきません。", "I cannot take the day off because I have an exam tomorrow."],
    ["ものの", "ものの", "Means “although”; introduces an unexpected contrast.", "薬を飲んだものの、熱は下がりません。", "Although I took medicine, my fever did not go down."],
    ["に応じて", "に応じて", "Means “according to” or “in response to”.", "能力に応じてクラスを分けます。", "We divide classes according to ability."],
    ["をめぐって", "をめぐって", "Indicates a topic or dispute around which discussion occurs.", "新しい計画をめぐって意見が分かれています。", "Opinions are divided over the new plan."],
    ["に伴って", "に伴って", "Expresses a change that occurs along with another change.", "人口の増加に伴って、交通量も増えました。", "Traffic also increased along with population growth."],
    ["次第", "次第", "Means “as soon as” when attached to a verb stem.", "詳細が分かり次第、ご連絡します。", "I will contact you as soon as I know the details."],
    ["かねない", "かねない", "Indicates a real possibility of an undesirable result.", "このままでは事故になりかねません。", "If this continues, it could lead to an accident."],
    ["に限らず", "に限らず", "Means “not limited to”; extends a statement beyond one group.", "若者に限らず、多くの人が利用しています。", "Many people use it, not only young people."],
    ["とは限らない", "とは限らない", "Says something is not necessarily always true.", "高いものが必ずしも良いとは限りません。", "Expensive things are not necessarily good."]
  ],
  N1: [
    ["いかんによって", "いかんによって", "Indicates that a result depends on a particular matter or condition.", "結果いかんによっては、計画を変更します。", "Depending on the result, we may change the plan."],
    ["を禁じ得ない", "を禁じ得ない", "Expresses an emotion that cannot be suppressed.", "その知らせに驚きを禁じ得ません。", "I cannot help feeling surprised by the news."],
    ["に即して", "に即して", "Means in accordance with or based on a standard or reality.", "現状に即して対策を見直す必要があります。", "We need to review measures in light of the current situation."],
    ["を余儀なくされる", "を余儀なくされる", "Means to be forced to do something due to circumstances.", "大雨で計画の変更を余儀なくされました。", "Heavy rain forced us to change the plan."],
    ["にたえない", "にたえない", "Expresses that something is unbearable or, in another usage, deeply felt.", "彼の努力には敬意にたえません。", "His efforts are truly worthy of deep respect."],
    ["と相まって", "と相まって", "Means combined with; two factors work together.", "技術の進歩と相まって、生活は便利になりました。", "Combined with technological progress, life has become more convenient."],
    ["をおいてほかにない", "をおいてほかにない", "Emphasizes that there is no alternative except the stated one.", "この仕事を任せられる人は彼をおいてほかにいません。", "There is no one other than him who can be entrusted with this work."],
    ["ならでは", "ならでは", "Expresses a quality unique to a person, place or thing.", "これは京都ならではの景色です。", "This is scenery unique to Kyoto."],
    ["にかたくない", "にかたくない", "Means it is not difficult to imagine or understand.", "彼がどれほど努力したかは想像にかたくありません。", "It is easy to imagine how hard he worked."],
    ["んがため（に）", "んがため（に）", "A formal literary expression meaning “in order to”; attaches to the verb negative stem, with する becoming せんがため.", "夢を実現せんがため、彼は努力を続けた。", "In order to realize his dream, he continued his efforts."]
  ]
};

export { GRAMMAR_DATA };

export function getGrammarForLevel(level: string): GrammarItem[] {
  const rawList = GRAMMAR_DATA[level] || [];
  return rawList.map(([pattern, reading, meaning, exampleJp, exampleEn, meaningTa, formation, exampleTa]) => ({
    pattern,
    reading,
    meaning,
    meaningTa,
    formation,
    exampleJp,
    exampleEn,
    exampleTa,
    level,
  }));
}
