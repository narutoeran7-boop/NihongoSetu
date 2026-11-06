// Client-Safe JLPT Examination Question Bank
// NEVER include correctIndex or explanation in this module.
// All answer keys and grading logic reside exclusively in serverQuestions.ts and /api/exams/grade.

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface ClientExamQuestion {
  id: string;
  level: JLPTLevel;
  question: string;
  options: string[];
  category: 'Vocabulary' | 'Grammar' | 'Reading' | 'Listening';
  section?: string;
  passage?: string;
  audioPrompt?: string;
}

// Backwards-compatible alias
export type ExamQuestion = ClientExamQuestion;

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

// [question, options, category, section?, passage?, audioPrompt?]
type ClientQuestionTuple = [string, string[], 'Vocabulary' | 'Grammar' | 'Reading' | 'Listening', string?, string?, string?];

const CLIENT_QUESTIONS_RAW: Record<JLPTLevel, ClientQuestionTuple[]> = {
  N5: [
    // Section 1: Language Knowledge (Vocabulary & Kanji) - Q1 to Q7
    ["「山」の読み方は？", ["やま", "かわ", "うみ", "そら"], "Vocabulary", "Language Knowledge"],
    ["「昨日」の意味は？", ["today", "yesterday", "tomorrow", "morning"], "Vocabulary", "Language Knowledge"],
    ["「安い」の反対は？", ["高い", "古い", "近い", "少ない"], "Vocabulary", "Language Knowledge"],
    ["「友達」の読み方は？", ["ともだち", "ともたち", "ゆうだち", "とももち"], "Vocabulary", "Language Knowledge"],
    ["「午後」の読み方は？", ["ごぜん", "ごご", "あさ", "よる"], "Vocabulary", "Language Knowledge"],
    ["「病院」はどんなところですか。", ["本を買うところ", "病気の人が行くところ", "電車に乗るところ", "ご飯を食べるところ"], "Vocabulary", "Language Knowledge"],
    ["「毎週」の読み方は？", ["まいにち", "まいしゅう", "まいつき", "まいとし"], "Vocabulary", "Language Knowledge"],

    // Section 2: Language Knowledge (Grammar) - Q8 to Q14
    ["わたしは毎朝、パン___食べます。", ["を", "に", "で", "が"], "Grammar", "Language Knowledge"],
    ["田中さん___学生です。", ["は", "を", "で", "に"], "Grammar", "Language Knowledge"],
    ["毎日六時___起きます。", ["に", "を", "で", "へ"], "Grammar", "Language Knowledge"],
    ["これはだれ___かばんですか。", ["の", "を", "に", "で"], "Grammar", "Language Knowledge"],
    ["きのう、映画を___。", ["見ます", "見ました", "見ません", "見ましょう"], "Grammar", "Language Knowledge"],
    ["机の上に本が二___あります。", ["人", "本", "冊", "匹"], "Grammar", "Language Knowledge"],
    ["駅___友達を待ちます。", ["で", "を", "が", "へ"], "Grammar", "Language Knowledge"],

    // Section 3: Reading Comprehension (読解) - Q15 to Q17
    [
      "木村さんはデパートで何をしましたか。",
      ["靴を買ってラーメンを食べた", "本を読んだ", "電車に乗った", "映画を見た"],
      "Reading",
      "Reading",
      "木村さんの日記：きのうは友達とデパートへ行きました。新しい靴を買って、レストランで美味しいラーメンを食べました。"
    ],
    [
      "図書館で飲んでもいいものは何ですか。",
      ["水とお茶", "ジュースとコーヒー", "お酒", "何も飲んではいけない"],
      "Reading",
      "Reading",
      "図書館からのお願い：館内では静かにしてください。飲み物は水とお茶だけ飲んでもいいです。"
    ],
    [
      "田中さんは何で大学へ行きますか。",
      ["電車", "バス", "自転車", "歩いて"],
      "Reading",
      "Reading",
      "田中さんは毎朝７時に起きて、パンと卵を食べます。８時に電車で大学へ行きます。"
    ],

    // Section 4: Listening Comprehension (聴解) - Q18 to Q20
    [
      "駅はどこにありますか。",
      ["角を右へ曲がったところ", "左の建物の後ろ", "信号を渡ったところ", "バス停の隣"],
      "Listening",
      "Listening",
      undefined,
      "女の人：すみません、駅はどこですか。男の人：あの角を右へ曲がると、すぐ前にありますよ。女の人：わかりました。ありがとうございます。"
    ],
    [
      "パーティーは何時に始まりますか。",
      ["午後６時半", "午後６時", "午後６時１５分", "午後７時"],
      "Listening",
      "Listening",
      undefined,
      "男の人：明日のパーティーは何時に始まりますか。女の人：午後６時半からです。男の人：じゃあ、６時１５分に行きますね。"
    ],
    [
      "二人は何を食べに行きますか。",
      ["ラーメン", "寿司", "カレー", "パン"],
      "Listening",
      "Listening",
      undefined,
      "女の人：いっしょにお昼ご飯を食べに行きませんか。男の人：いいですね、ラーメンを食べましょう。女の人：そうしましょう。"
    ]
  ],
  N4: [
    ["「準備」の読み方は？", ["じゅんび", "じゅびん", "しゅんび", "じゅんぴ"], "Vocabulary"],
    ["会議に間に合う___、早く出ました。", ["ように", "そうに", "ためで", "ことに"], "Grammar"],
    ["この料理は思った___おいしかった。", ["より", "まで", "ほどに", "しか"], "Grammar"],
    ["電車が遅れたので、学校に遅刻しました。なぜ遅刻しましたか。", ["電車が遅れたから", "寝なかったから", "雨が降ったから", "道に迷ったから"], "Grammar"],
    ["「経験」に近い意味は？", ["体験", "予定", "説明", "連絡"], "Vocabulary"],
    ["薬を飲ん___、少し休んでください。", ["でから", "だから", "ても", "ながらに"], "Grammar"],
    ["部屋をきれいに___ください。", ["して", "なって", "あって", "おいてて"], "Grammar"],
    ["雨が降りそうです。", ["It looks like it will rain", "It rained yesterday", "It never rains", "It stopped raining"], "Grammar"],
    ["約束の時間を忘れない___、メモしました。", ["ように", "ためで", "そうで", "ながら"], "Grammar"],
    ["この道をまっすぐ行くと、右に銀行があります。銀行はどこですか。", ["まっすぐ進んで右", "左に曲がる", "後ろに戻る", "駅の中"], "Grammar"],
    ["「連絡」の読み方は？", ["れんらく", "れんろく", "ねんらく", "れんがく"], "Vocabulary"],
    ["宿題をした___、テレビを見ました。", ["あとで", "まえに", "ながら", "までに"], "Grammar"],
    ["この店は駅から近い___、便利です。", ["ので", "のに", "でも", "なら"], "Grammar"],
    ["窓が開いています。だれかが___ようです。", ["開けた", "開ける", "開けて", "開けない"], "Grammar"],
    ["「間に合う」の意味は？", ["to be on time", "to get lost", "to be absent", "to forget"], "Vocabulary"],
    ["日本へ行く___、日本語を勉強しています。", ["ために", "そうに", "ながら", "ばかり"], "Grammar"],
    ["ここに車を止め___はいけません。", ["て", "た", "る", "ない"], "Grammar"],
    ["彼は毎日練習しているので、上手に___ようになりました。", ["話せる", "話す", "話して", "話した"], "Grammar"],
    ["「残念」の意味に近いものは？", ["disappointing", "convenient", "careful", "healthy"], "Vocabulary"],
    ["このボタンを押すと、ドアが開きます。何をするとドアが開きますか。", ["ボタンを押す", "窓を閉める", "電気を消す", "名前を書く"], "Grammar"]
  ],
  N3: [
    ["「影響」の読み方は？", ["えいきょう", "えいこう", "いんきょう", "えんきょう"], "Vocabulary"],
    ["雨にも___、試合は行われた。", ["かかわらず", "つれて", "おいて", "よって"], "Grammar"],
    ["彼は忙しい___、毎日運動している。", ["ながらも", "うえで", "とおりに", "ばかりに"], "Grammar"],
    ["新しい制度の導入によって、仕事の効率が上がった。何が効率を上げましたか。", ["新しい制度", "休日の増加", "人員の減少", "機械の故障"], "Grammar"],
    ["「維持」の意味は？", ["keep something in the same state", "make something disappear", "change completely", "put something off"], "Vocabulary"],
    ["説明を聞いた___、まだよく分からない。", ["ものの", "うえで", "ところで", "かわりに"], "Grammar"],
    ["彼は約束した___、来なかった。", ["にもかかわらず", "にしたがって", "にとって", "に比べて"], "Grammar"],
    ["この薬は食後に飲む___書いてあります。", ["ように", "ことに", "ためで", "ものを"], "Grammar"],
    ["利用者が増える___、サービスの改善も必要になる。", ["につれて", "として", "にしても", "に限って"], "Grammar"],
    ["調査の結果、利用者の多くが簡単な操作を望んでいることが分かった。利用者は何を望んでいますか。", ["簡単な操作", "高い料金", "複雑な機能", "長い説明"], "Grammar"],
    ["「比較」の読み方は？", ["ひかく", "ひがく", "びかく", "ひこう"], "Vocabulary"],
    ["この町は昔に比べて、ずいぶん便利に___。", ["なった", "した", "して", "なる"], "Grammar"],
    ["時間がない___、急いでください。", ["のだから", "ところで", "ものの", "ばかりに"], "Grammar"],
    ["彼は説明を聞いたうえで、参加するかどうか決めた。いつ決めましたか。", ["説明を聞いてから", "説明を聞く前に", "説明を聞かずに", "説明の途中で"], "Grammar"],
    ["「改善」の意味は？", ["making something better", "making something smaller", "putting something away", "making a copy"], "Vocabulary"],
    ["毎日運動すること___、健康になった。", ["によって", "にとって", "について", "に対して"], "Grammar"],
    ["彼女は歌が上手な___、ピアノも弾ける。", ["うえに", "かわりに", "せいで", "ところが"], "Grammar"],
    ["電車に傘を忘れてしまった。話し手はどうしましたか。", ["傘を電車に置き忘れた", "傘を買いに行った", "電車を降りなかった", "傘を友達に貸した"], "Grammar"],
    ["この仕事は一人では無理だ。", ["一人で行うのは難しい", "一人で簡単にできる", "誰でもすぐできる", "仕事をする必要がない"], "Grammar"],
    ["雨が強くなるにつれて、川の水位も上がってきた。何が起きましたか。", ["雨が強まり川の水位が上がった", "雨が止み水位が下がった", "川が乾いてきた", "水位は変わらなかった"], "Grammar"]
  ],
  N2: [
    ["「傾向」の読み方は？", ["けいこう", "けいごう", "きょうこう", "けんこう"], "Vocabulary"],
    ["この計画は費用の面___問題がある。", ["で", "に", "を", "へ"], "Grammar"],
    ["彼の説明は具体例を___、分かりやすかった。", ["交えて", "除いて", "問わず", "反して"], "Grammar"],
    ["この結果は予想___のものだった。", ["に反する", "に限る", "に沿う", "に応じる"], "Grammar"],
    ["制度を変更するにあたって、利用者の意見を調査した。何をする前に調査しましたか。", ["制度の変更", "商品の発送", "会議の中止", "人員の採用"], "Grammar"],
    ["「著しい」の意味に近いものは？", ["remarkable", "ordinary", "temporary", "uncertain"], "Vocabulary"],
    ["彼は忙しい___、毎日欠かさず運動している。", ["にもかかわらず", "に応じて", "に基づいて", "に先立って"], "Grammar"],
    ["この資料は最新のデータ___作成された。", ["に基づいて", "を問わず", "に限って", "と比べてから"], "Grammar"],
    ["交通規制に伴い、バスの運行ルートが変更された。何が変更されましたか。", ["バスの運行ルート", "電車の料金", "道路の幅", "駅の営業時間"], "Grammar"],
    ["彼の提案は検討に値する。", ["検討する価値がある", "検討する必要がない", "すでに却下された", "実行が禁止されている"], "Grammar"],
    ["計画を実行するかどうかは、予算___だ。", ["次第", "一方", "以来", "最中"], "Grammar"]
  ],
  N1: [
    ["「顕著」の読み方は？", ["けんちょ", "けんしょう", "げんちょ", "けんじょ"], "Vocabulary"],
    ["彼の説明は要___得ている。", ["を", "に", "が", "で"], "Grammar"],
    ["計画の変更を余儀なくされた。意味は？", ["変更せざるを得なかった", "自由に変更した", "変更を拒否した", "変更を忘れた"], "Grammar"],
    ["新制度は導入されたものの、現場では十分に機能していない。状況は？", ["導入済みだが十分に働いていない", "導入が中止された", "現場で高く評価された", "以前より単純になった"], "Grammar"],
    ["「妥協」の意味は？", ["互いに譲り合って折り合うこと", "一方的に命令すること", "問題を先送りすること", "事実を隠すこと"], "Vocabulary"],
    ["彼は周囲の反対を押し切って実行した。", ["反対があっても実行した", "賛成を待って中止した", "周囲に相談せず忘れた", "反対意見に従った"], "Grammar"],
    ["状況を鑑みて、対応を再検討する。鑑みてに近い意味は？", ["考慮して", "無視して", "比較せず", "疑って"], "Grammar"],
    ["彼の発言は誤解を招きかねない。", ["誤解を生む可能性がある", "誤解を必ず解消する", "誤解とは無関係だ", "誤解を避けた"], "Grammar"],
    ["予算が限られている以上、優先順位をつけるほかない。どうする必要がありますか。", ["優先順位を決める", "予算を無制限に増やす", "計画をすべて中止する", "支出を記録しない"], "Grammar"],
    ["彼は失敗をものともせず、研究を続けた。", ["失敗を気にせず", "失敗を恐れて", "失敗を隠して", "失敗を喜んで"], "Grammar"],
    ["「踏まえる」の意味に最も近いものは？", ["to take into account", "to overlook", "to postpone", "to deny"], "Vocabulary"],
    ["彼の説明は論理に___。", ["かなっている", "かけている", "とどまっている", "およんでいる"], "Grammar"],
    ["この問題は一概に結論づける___。", ["わけにはいかない", "にほかならない", "にすぎない", "ものがある"], "Grammar"],
    ["彼女は困難をものともせず、研究を続けた。どのような態度ですか。", ["困難に負けず続けた", "困難を避けてやめた", "困難を他人に任せた", "困難に気づかなかった"], "Grammar"],
    ["「懸命」の意味は？", ["doing one's utmost", "being careless", "being indifferent", "being hesitant"], "Vocabulary"],
    ["彼の発言は誤解を招き___。", ["かねない", "がたい", "かねる", "ぬく"], "Grammar"],
    ["実情を___、現実的な対策を立てる必要がある。", ["踏まえて", "問わず", "抜きにして", "よそに"], "Grammar"],
    ["新技術の導入を___、作業工程を見直した。", ["機に", "限り", "問わず", "皮切りにしても"], "Grammar"],
    ["彼は批判を___、自分の信念を貫いた。", ["よそに", "もとに", "皮切りに", "限りに"], "Grammar"],
    ["議論は平行線をたどり、結論には至らなかった。", ["意見が対立したまま進展しなかった", "全員がすぐに賛成した", "結論がすでに決まった", "議論が予定より早く終わった"], "Grammar"]
  ]
};

export function getClientQuestionsForLevel(level: JLPTLevel): ClientExamQuestion[] {
  const list = CLIENT_QUESTIONS_RAW[level] || [];
  return list.map(([question, options, category, section, passage, audioPrompt], idx) => ({
    id: `${level.toLowerCase()}-q-${idx + 1}`,
    level,
    question,
    options,
    category,
    section: section || (category === 'Vocabulary' || category === 'Grammar' ? 'Language Knowledge' : category),
    passage,
    audioPrompt,
  }));
}

export function getQuestionsForLevel(level: JLPTLevel): ClientExamQuestion[] {
  return getClientQuestionsForLevel(level);
}
