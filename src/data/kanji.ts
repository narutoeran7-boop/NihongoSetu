// NihongoSetu Core Kanji Dataset & Readings
import { N5_KANJI } from "./kanji/n5";
import { kanjiEntryToCardItem } from "./kanji/index";
export interface KanjiEntry {
  character: string;
  onyomi: string;
  kunyomi: string;
  meanings: string;
  examples: string[];
  strokes?: number;
}

const KANJI_DATA={
N5:[
["日","にち・ひ","ニチ・ジツ / ひ・か","day; sun","日本（にほん）・日曜日（にちようび）"],
["月","げつ・つき","ゲツ・ガツ / つき","month; moon","月曜日（げつようび）・月（つき）"],
["人","じん・ひと","ジン・ニン / ひと","person","日本人（にほんじん）・人（ひと）"],
["火","か・ひ","カ / ひ","fire","火曜日（かようび）・火山（かざん）"],
["水","すい・みず","スイ / みず","water","水曜日（すいようび）・水（みず）"],
["木","もく・き","モク・ボク / き","tree; wood","木曜日（もくようび）・木（き）"],
["土","ど・つち","ド・ト / つち","earth; soil","土曜日（どようび）・土地（とち）"],
["山","さん・やま","サン / やま","mountain","富士山（ふじさん）・山（やま）"],
["川","せん・かわ","セン / かわ","river","川（かわ）・小川（おがわ）"],
["生","せい・いきる","セイ・ショウ / いきる・うまれる","life; birth","先生（せんせい）・学生（がくせい）"],
["学","がく・まなぶ","ガク / まなぶ","study; learning","学生（がくせい）・学校（がっこう）"],
["校","こう","コウ","school","学校（がっこう）"],
["金","きん・かね","キン・コン / かね","gold; money","金曜日（きんようび）・お金（おかね）"],
["田","でん・た","デン / た","rice field","田んぼ（たんぼ）・田中（たなか）"],
["口","こう・くち","コウ・ク / くち","mouth; opening","入口（いりぐち）・出口（でぐち）"],
["目","もく・め","モク / め","eye","目（め）・目的（もくてき）"],
["耳","じ・みみ","ジ / みみ","ear","耳（みみ）"],
["手","しゅ・て","シュ / て","hand","手紙（てがみ）・手（て）"],
["足","そく・あし","ソク / あし・たりる","foot; leg","足（あし）・足りる（たりる）"],
["力","りょく・ちから","リョク・リキ / ちから","power; strength","力（ちから）・電力（でんりょく）"]
],
N4:[
["会","かい・あう","カイ・エ / あう","meet; association","会社（かいしゃ）・会う（あう）"],
["同","どう・おなじ","ドウ / おなじ","same","同じ（おなじ）・同時（どうじ）"],
["事","じ・こと","ジ / こと","thing; matter","仕事（しごと）・大事（だいじ）"],
["自","じ・みずから","ジ・シ / みずから","self","自分（じぶん）・自転車（じてんしゃ）"],
["社","しゃ・やしろ","シャ / やしろ","company; shrine","会社（かいしゃ）・社会（しゃかい）"],
["発","はつ","ハツ・ホツ","departure; emit","出発（しゅっぱつ）・発音（はつおん）"],
["者","しゃ・もの","シャ / もの","person","医者（いしゃ）・若者（わかもの）"],
["地","ち・じ","チ・ジ","ground; place","地下（ちか）・地図（ちず）"],
["業","ぎょう・わざ","ギョウ・ゴウ / わざ","business; work","授業（じゅぎょう）・仕事（しごと）"],
["方","ほう・かた","ホウ / かた","direction; person","方法（ほうほう）・夕方（ゆうがた）"],
["新","しん・あたらしい","シン / あたらしい・あらた","new","新しい（あたらしい）・新聞（しんぶん）"],
["場","じょう・ば","ジョウ / ば","place","場所（ばしょ）・工場（こうじょう）"],
["員","いん","イン","member; employee","会社員（かいしゃいん）・店員（てんいん）"],
["立","りつ・たつ","リツ・リュウ / たつ","stand","立つ（たつ）・国立（こくりつ）"],
["開","かい・ひらく","カイ / ひらく・あく","open","開く（あく）・開始（かいし）"],
["不","ふ・ぶ","フ・ブ","not; un-","不便（ふべん）・不安（ふあん）"],
["世","せい・よ","セイ・セ / よ","world; generation","世界（せかい）・世の中（よのなか）"],
["主","しゅ・ぬし","シュ・ス / ぬし","main; owner","主人（しゅじん）・主に（おもに）"],
["用","よう・もちいる","ヨウ / もちいる","use; business"," 用事（ようじ）・使用（しよう）"],
["度","ど・たび","ド・ト・タク / たび","degree; time","今度（こんど）・温度（おんど）"]
],
N3:[
["政","せい・まつりごと","セイ・ショウ","politics; government","政治（せいじ）"],
["議","ぎ","ギ","deliberation; discussion","会議（かいぎ）・議員（ぎいん）"],
["民","みん・たみ","ミン / たみ","people; nation","国民（こくみん）・市民（しみん）"],
["連","れん・つれる","レン / つれる・つらなる","connect; take along","連絡（れんらく）・連休（れんきゅう）"],
["対","たい","タイ・ツイ","opposite; versus","反対（はんたい）・対象（たいしょう）"],
["部","ぶ","ブ","section; department","部屋（へや）・全部（ぜんぶ）"],
["合","ごう・あう","ゴウ・ガッ / あう","fit; combine","場合（ばあい）・合格（ごうかく）"],
["市","し・いち","シ / いち","city; market","市役所（しやくしょ）・市場（いちば）"],
["内","ない・うち","ナイ・ダイ / うち","inside","国内（こくない）・案内（あんない）"],
["相","そう・あい","ソウ・ショウ / あい","mutual; appearance","相談（そうだん）・相手（あいて）"],
["定","てい・さだめる","テイ・ジョウ / さだめる","decide; fixed","予定（よてい）・決定（けってい）"],
["回","かい・まわる","カイ・エ / まわる","times; turn around","今回（こんかい）・回る（まわる）"],
["選","せん・えらぶ","セン / えらぶ","choose","選ぶ（えらぶ）・選手（せんしゅ）"],
["米","べい・こめ","ベイ・マイ / こめ","rice; America","米（こめ）・米国（べいこく）"],
["実","じつ・み","ジツ / み・みのる","truth; fruit","実験（じっけん）・実は（じつは）"],
["関","かん・せき","カン / せき・かかわる","relation; barrier","関係（かんけい）・関心（かんしん）"],
["決","けつ・きめる","ケツ / きめる","decide","決める（きめる）・決定（けってい）"],
["全","ぜん・すべて","ゼン / まったく","whole; all","全部（ぜんぶ）・安全（あんぜん）"],
["表","ひょう・おもて","ヒョウ / おもて・あらわす","surface; express","発表（はっぴょう）・表（おもて）"],
["戦","せん・たたかう","セン / たたかう","war; battle","戦争（せんそう）・作戦（さくせん）"]
],
N2:[
["営","えい・いとなむ","エイ / いとなむ","manage; operate","営業（えいぎょう）・経営（けいえい）"],
["責","せき・せめる","セキ / せめる","responsibility; blame","責任（せきにん）"],
["任","にん・まかせる","ニン / まかせる","duty; appoint","責任（せきにん）・任せる（まかせる）"],
["証","しょう・あかし","ショウ","proof; certificate","証明（しょうめい）・証拠（しょうこ）"],
["効","こう・きく","コウ / きく","effect; effectiveness","効果（こうか）・有効（ゆうこう）"],
["資","し","シ","resources; capital","資料（しりょう）・資金（しきん）"],
["態","たい","タイ","condition; attitude","状態（じょうたい）・態度（たいど）"],
["構","こう・かまえる","コウ / かまえる","structure; construct","構造（こうぞう）・結構（けっこう）"],
["比","ひ・くらべる","ヒ / くらべる","compare; ratio","比較（ひかく）・比率（ひりつ）"],
["際","さい・きわ","サイ / きわ","occasion; edge","実際（じっさい）・国際（こくさい）"],
["減","げん・へる","ゲン / へる・へらす","decrease","減少（げんしょう）・増減（ぞうげん）"],
["増","ぞう・ます","ゾウ / ます・ふえる","increase","増加（ぞうか）・増える（ふえる）"],
["確","かく・たしか","カク / たしか","certain; confirm","確認（かくにん）・正確（せいかく）"],
["認","にん・みとめる","ニン / みとめる","recognize; acknowledge","確認（かくにん）・認める（みとめる）"],
["断","だん・ことわる","ダン / ことわる・たつ","refuse; cut off","判断（はんだん）・断る（ことわる）"],
["提","てい","テイ","present; propose","提案（ていあん）・提出（ていしゅつ）"],
["案","あん","アン","plan; proposal","案内（あんない）・提案（ていあん）"],
["価","か・あたい","カ / あたい","value; price","価格（かかく）・価値（かち）"],
["格","かく","カク・コウ","status; standard","価格（かかく）・合格（ごうかく）"],
["導","どう・みちびく","ドウ / みちびく","guide; lead","指導（しどう）・導入（どうにゅう）"]
],
N1:[
["顕","けん・あらわれる","ケン / あらわれる","appear; manifest","顕著（けんちょ）・顕微鏡（けんびきょう）"],
["懸","けん・かける","ケン / かける","hang; stake","懸念（けねん）・懸命（けんめい）"],
["措","そ・おく","ソ / おく","place; set aside","措置（そち）・措定（そてい）"],
["甚","じん・はなはだ","ジン / はなはだ","very; exceedingly","甚大（じんだい）・甚だしい（はなはだしい）"],
["謄","とう","トウ","copy; transcribe","謄本（とうほん）"],
["璧","へき","ヘキ","jade; perfect thing","完璧（かんぺき）"],
["鬱","うつ","ウツ","gloom","憂鬱（ゆううつ）"],
["畏","い・おそれる","イ / おそれる","fear; awe","畏敬（いけい）・畏怖（いふ）"],
["萎","い・なえる","イ / なえる","wither; weaken","萎縮（いしゅく）・萎える（なえる）"],
["嗣","し","シ","heir; succeed","後嗣（こうし）"],
["賜","し・たまわる","シ / たまわる","grant; bestow","賜る（たまわる）・賜杯（しはい）"],
["拙","せつ・つたない","セツ / つたない","clumsy; unskillful","拙速（せっそく）・拙い（つたない）"],
["勅","ちょく","チョク","imperial edict","勅語（ちょくご）"],
["叙","じょ","ジョ","describe; confer","叙述（じょじゅつ）・叙勲（じょくん）"],
["遷","せん・うつる","セン / うつる","move; transition","変遷（へんせん）・遷都（せんと）"],
["謁","えつ","エツ","audience; visit","謁見（えっけん）"],
["弔","ちょう・とむらう","チョウ / とむらう","mourn; condolence","弔問（ちょうもん）・弔う（とむらう）"],
["賄","わい・まかなう","ワイ / まかなう","provide; bribe","賄賂（わいろ）・賄う（まかなう）"],
["剖","ぼう","ボウ","divide; dissect","解剖（かいぼう）"],
["遵","じゅん","ジュン","abide by; obey","遵守（じゅんしゅ）"]
]};

// Reading guide: On-yomi is the Sino-Japanese reading, often used in compounds.
// Kun-yomi is the native Japanese reading, often used with okurigana or by itself.
// Readings are pronunciations, not separate dictionary meanings.
const KANJI_READING_EXAMPLES={
"日":["On: にち — 日曜日（にちようび）= Sunday; 日本（にほん）= Japan","Kun: ひ — 日（ひ）= sun/day; 日々（ひび）= day by day"],
"月":["On: げつ・がつ — 月曜日（げつようび）= Monday; 一月（いちがつ）= January","Kun: つき — 月（つき）= moon; 月明かり（つきあかり）= moonlight"],
"火":["On: か — 火曜日（かようび）= Tuesday; 火山（かざん）= volcano","Kun: ひ — 火（ひ）= fire; 火花（ひばな）= spark"],
"水":["On: すい — 水曜日（すいようび）= Wednesday; 水道（すいどう）= water supply","Kun: みず — 水（みず）= water; 水色（みずいろ）= light blue"],
"木":["On: もく — 木曜日（もくようび）= Thursday; 木材（もくざい）= lumber","Kun: き — 木（き）= tree; 木陰（こかげ）= shade of a tree"],
"金":["On: きん — 金曜日（きんようび）= Friday; 金色（きんいろ）= gold color","Kun: かね — お金（おかね）= money; 金持ち（かねもち）= rich person"],
"土":["On: ど — 土曜日（どようび）= Saturday; 土地（とち）= land","Kun: つち — 土（つち）= soil; 土 color 土色（つちいろ）= earth color"],
"人":["On: じん・にん — 日本人（にほんじん）= Japanese person; 三人（さんにん）= three people","Kun: ひと — 人（ひと）= person; あの人（あのひと）= that person"],
"山":["On: さん — 富士山（ふじさん）= Mount Fuji; 火山（かざん）= volcano","Kun: やま — 山（やま）= mountain; 山道（やまみち）= mountain path"],
"川":["On: せん — 河川（かせん）= rivers; 山川（さんせん）= mountains and rivers","Kun: かわ — 川（かわ）= river; 小川（おがわ）= stream"],
"田":["On: でん — 水田（すいでん）= rice paddy; 田園（でんえん）= countryside","Kun: た — 田んぼ（たんぼ）= rice field; 田植え（たうえ）= rice planting"],
"口":["On: こう — 人口（じんこう）= population; 入口（いりぐち）= entrance","Kun: くち — 口（くち）= mouth; 口元（くちもと）= around the mouth"],
"目":["On: もく — 目的（もくてき）= purpose; 目標（もくひょう）= goal","Kun: め — 目（め）= eye; 目玉（めだま）= eyeball"],
"耳":["On: じ — 耳鼻科（じびか）= ear, nose and throat clinic","Kun: みみ — 耳（みみ）= ear; 耳元（みみもと）= beside the ear"],
"手":["On: しゅ — 選手（せんしゅ）= athlete; 手術（しゅじゅつ）= surgery","Kun: て — 手（て）= hand; 手紙（てがみ）= letter"],
"足":["On: そく — 足音（あしおと）= footsteps; 不足（ふそく）= shortage","Kun: あし — 足（あし）= foot/leg; 足元（あしもと）= at one's feet"],
"力":["On: りょく・りき — 電力（でんりょく）= electric power; 力学（りきがく）= mechanics","Kun: ちから — 力（ちから）= strength; 力持ち（ちからもち）= strong person"],
"学":["On: がく — 学校（がっこう）= school; 学生（がくせい）= student","Kun: まなぶ — 学ぶ（まなぶ）= to learn; 学び（まなび）= learning"],
"校":["On: こう — 学校（がっこう）= school; 校長（こうちょう）= principal","Kun: — (no common standalone kun-yomi in everyday use)"],
"生":["On: せい・しょう — 学生（がくせい）= student; 先生（せんせい）= teacher; 誕生（たんじょう）= birth","Kun: いきる・うまれる — 生きる（いきる）= to live; 生まれる（うまれる）= to be born"],
"会":["On: かい — 会社（かいしゃ）= company; 会議（かいぎ）= meeting","Kun: あう — 会う（あう）= to meet; 出会う（であう）= to encounter"],
"同":["On: どう — 同時（どうじ）= at the same time; 同意（どうい）= agreement","Kun: おなじ — 同じ（おなじ）= same; 同じく（おなじく）= likewise"],
"事":["On: じ — 仕事（しごと）= work; 事故（じこ）= accident","Kun: こと — 事（こと）= thing/matter; 事前（じぜん）= beforehand"],
"自":["On: じ — 自分（じぶん）= oneself; 自動車（じどうしゃ）= automobile","Kun: みずから — 自ら（みずから）= oneself; 自ら進む（みずからすすむ）= proceed on one's own"],
"社":["On: しゃ — 会社（かいしゃ）= company; 社会（しゃかい）= society","Kun: やしろ — 社（やしろ）= Shinto shrine"],
"発":["On: はつ — 出発（しゅっぱつ）= departure; 発音（はつおん）= pronunciation","Kun: — (no common everyday kun-yomi)"],
"者":["On: しゃ — 医者（いしゃ）= doctor; 学者（がくしゃ）= scholar","Kun: もの — 若者（わかもの）= young person; 何者（なにもの）= who/what kind of person"],
"地":["On: ち・じ — 地下（ちか）= underground; 地図（ちず）= map; 地面（じめん）= ground","Kun: — (no common everyday kun-yomi)"],
"業":["On: ぎょう — 授業（じゅぎょう）= class/lesson; 工業（こうぎょう）= industry","Kun: わざ — 業（わざ）= deed/skill (literary use)"],
"方":["On: ほう — 方法（ほうほう）= method; 方向（ほうこう）= direction","Kun: かた — あの方（あのかた）= that person (polite); 夕方（ゆうがた）= evening"],
"新":["On: しん — 新聞（しんぶん）= newspaper; 新年（しんねん）= New Year","Kun: あたらしい・あらた — 新しい（あたらしい）= new; 新た（あらた）= anew"],
"場":["On: じょう — 工場（こうじょう）= factory; 会場（かいじょう）= venue","Kun: ば — 場所（ばしょ）= place; その場（そのば）= on the spot"],
"員":["On: いん — 会社員（かいしゃいん）= company employee; 店員（てんいん）= shop assistant","Kun: — (no common everyday kun-yomi)"],
"立":["On: りつ — 国立（こくりつ）= national; 独立（どくりつ）= independence","Kun: たつ — 立つ（たつ）= to stand; 立ち上がる（たちあがる）= to stand up"],
"開":["On: かい — 開始（かいし）= start; 開会（かいかい）= opening of a meeting","Kun: あく・ひらく — ドアが開く（ドアがあく）= the door opens; 開く（ひらく）= to open"],
"不":["On: ふ・ぶ — 不便（ふべん）= inconvenient; 不安（ふあん）= anxiety","Kun: — (no common everyday kun-yomi)"],
"世":["On: せい・せ — 世界（せかい）= world; 世紀（せいき）= century","Kun: よ — 世の中（よのなか）= society/world; この世（このよ）= this world"],
"主":["On: しゅ — 主人（しゅじん）= master/husband; 主食（しゅしょく）= staple food","Kun: ぬし — 持ち主（もちぬし）= owner; 主（ぬし）= master/owner"],
"用":["On: よう — 用事（ようじ）= errand; 使用（しよう）= use","Kun: もちいる — 用いる（もちいる）= to use; 用い方（もちいかた）= way of using"],
"度":["On: ど — 温度（おんど）= temperature; 今度（こんど）= this time/next time","Kun: たび — この度（このたび）= this occasion; 旅（たび）= journey (different kanji)"],
"政":["On: せい — 政治（せいじ）= politics; 政府（せいふ）= government","Kun: まつりごと — 政（まつりごと）= governance (literary)"],
"議":["On: ぎ — 会議（かいぎ）= meeting; 議員（ぎいん）= assembly member","Kun: — (no common everyday kun-yomi)"],
"民":["On: みん — 国民（こくみん）= citizens; 民主（みんしゅ）= democracy","Kun: たみ — 民（たみ）= people; 民の声（たみのこえ）= people's voice"],
"連":["On: れん — 連絡（れんらく）= contact; 連休（れんきゅう）= consecutive holidays","Kun: つれる・つらなる — 子どもを連れる（こどもをつれる）= take a child along; 連なる（つらなる）= to line up"],
"対":["On: たい・つい — 反対（はんたい）= opposition; 対象（たいしょう）= target","Kun: — (no common everyday kun-yomi)"],
"部":["On: ぶ — 部屋（へや）= room; 全部（ぜんぶ）= all; 部分（ぶぶん）= part","Kun: — (no common everyday kun-yomi)"],
"合":["On: ごう — 合格（ごうかく）= pass an exam; 都合（つごう）= circumstances","Kun: あう — 合う（あう）= to fit/match; 話し合う（はなしあう）= discuss"],
"市":["On: し — 市役所（しやくしょ）= city hall; 市民（しみん）= citizen","Kun: いち — 市（いち）= market; 朝市（あさいち）= morning market"],
"内":["On: ない — 国内（こくない）= domestic; 内容（ないよう）= contents","Kun: うち — 家の内（いえのうち）= inside the house; 内側（うちがわ）= inner side"],
"相":["On: そう — 相談（そうだん）= consultation; 相手（あいて）= partner/opponent","Kun: あい — 相合傘（あいあいがさ）= sharing an umbrella"],
"定":["On: てい — 予定（よてい）= plan/schedule; 決定（けってい）= decision","Kun: さだめる — 定める（さだめる）= to establish; 定まる（さだまる）= to be fixed"],
"回":["On: かい — 今回（こんかい）= this time; 回数（かいすう）= number of times","Kun: まわる — 回る（まわる）= to go around; 時計回り（とけいまわり）= clockwise"],
"選":["On: せん — 選手（せんしゅ）= athlete; 選挙（せんきょ）= election","Kun: えらぶ — 選ぶ（えらぶ）= to choose; 選び方（えらびかた）= how to choose"],
"米":["On: べい・まい — 米国（べいこく）= United States; 白米（はくまい）= white rice","Kun: こめ — 米（こめ）= rice; 米粒（こめつぶ）= grain of rice"],
"実":["On: じつ — 実験（じっけん）= experiment; 実際（じっさい）= actually","Kun: み・みのる — 実（み）= fruit/seed; 実る（みのる）= to bear fruit"],
"関":["On: かん — 関係（かんけい）= relationship; 関心（かんしん）= interest","Kun: せき・かかわる — 関（せき）= barrier/checkpoint; 関わる（かかわる）= to be involved"],
"決":["On: けつ — 決定（けってい）= decision; 解決（かいけつ）= solution","Kun: きめる — 決める（きめる）= to decide; 決まる（きまる）= to be decided"],
"全":["On: ぜん — 全部（ぜんぶ）= all; 全国（ぜんこく）= nationwide","Kun: すべて — 全て（すべて）= everything; 全く（まったく）= entirely"],
"表":["On: ひょう — 発表（はっぴょう）= presentation; 表面（ひょうめん）= surface","Kun: おもて・あらわす — 表（おもて）= front/surface; 表す（あらわす）= to express"],
"戦":["On: せん — 戦争（せんそう）= war; 作戦（さくせん）= strategy","Kun: たたかう — 戦う（たたかう）= to fight; 戦い（たたかい）= battle"],
"営":["On: えい — 営業（えいぎょう）= business operations; 経営（けいえい）= management","Kun: いとなむ — 営む（いとなむ）= to run/conduct (a business/life)"],
"責":["On: せき — 責任（せきにん）= responsibility; 責務（せきむ）= duty","Kun: せめる — 責める（せめる）= to blame; 責め（せめ）= blame"],
"任":["On: にん — 任務（にんむ）= duty; 責任（せきにん）= responsibility","Kun: まかせる — 任せる（まかせる）= to entrust; 任される（まかされる）= be entrusted"],
"証":["On: しょう — 証明（しょうめい）= proof; 証拠（しょうこ）= evidence","Kun: あかし — 証（あかし）= proof (literary); 身の証（みのあかし）= proof of identity"],
"効":["On: こう — 効果（こうか）= effect; 有効（ゆうこう）= effective","Kun: きく — 効く（きく）= to be effective; 薬が効く（くすりがきく）= medicine works"],
"資":["On: し — 資料（しりょう）= materials; 資金（しきん）= funds","Kun: — (no common everyday kun-yomi)"],
"態":["On: たい — 状態（じょうたい）= condition; 態度（たいど）= attitude","Kun: — (no common everyday kun-yomi)"],
"構":["On: こう — 構造（こうぞう）= structure; 結構（けっこう）= quite/fine","Kun: かまえる — 構える（かまえる）= to assume a posture; 店を構える（みせをかまえる）= establish a shop"],
"比":["On: ひ — 比較（ひかく）= comparison; 比率（ひりつ）= ratio","Kun: くらべる — 比べる（くらべる）= to compare; 比べ物（くらべもの）= something to compare"],
"際":["On: さい — 実際（じっさい）= actually; 国際（こくさい）= international","Kun: きわ — 水際（みずぎわ）= waterside; 間際（まぎわ）= just before"],
"減":["On: げん — 減少（げんしょう）= decrease; 削減（さくげん）= reduction","Kun: へる・へらす — 減る（へる）= decrease; 減らす（へらす）= reduce"],
"増":["On: ぞう — 増加（ぞうか）= increase; 増大（ぞうだい）= growth","Kun: ます・ふえる — 増す（ます）= increase; 増える（ふえる）= to increase"],
"確":["On: かく — 確認（かくにん）= confirmation; 正確（せいかく）= accurate","Kun: たしか — 確か（たしか）= certain; 確かめる（たしかめる）= to make sure"],
"認":["On: にん — 確認（かくにん）= confirmation; 認識（にんしき）= recognition","Kun: みとめる — 認める（みとめる）= to recognize/admit; 認められる（みとめられる）= be recognized"],
"断":["On: だん — 判断（はんだん）= judgment; 断水（だんすい）= water outage","Kun: ことわる・たつ — 断る（ことわる）= to refuse; 断つ（たつ）= to cut off"],
"提":["On: てい — 提案（ていあん）= proposal; 提出（ていしゅつ）= submission","Kun: さげる — 提げる（さげる）= to carry/hang (less common)"],
"案":["On: あん — 案内（あんない）= guidance; 提案（ていあん）= proposal","Kun: — (no common everyday kun-yomi)"],
"価":["On: か — 価格（かかく）= price; 価値（かち）= value","Kun: あたい — 価（あたい）= value (literary); 価する（あたいする）= be worth"],
"格":["On: かく — 価格（かかく）= price; 合格（ごうかく）= pass","Kun: — (no common everyday kun-yomi)"],
"導":["On: どう — 指導（しどう）= guidance; 導入（どうにゅう）= introduction","Kun: みちびく — 導く（みちびく）= to guide/lead"],
"顕":["On: けん — 顕著（けんちょ）= remarkable; 顕微鏡（けんびきょう）= microscope","Kun: あらわれる — 顕れる（あらわれる）= to become visible (literary)"],
"懸":["On: けん — 懸念（けねん）= concern; 懸命（けんめい）= desperate/earnest","Kun: かける — 懸ける（かける）= to stake/put at risk"],
"措":["On: そ — 措置（そち）= measure/action; 措定（そてい）= postulation","Kun: おく — 措く（おく）= to set aside (literary)"],
"甚":["On: じん — 甚大（じんだい）= enormous; 甚句（じんく）= folk song type","Kun: はなはだ — 甚だしい（はなはだしい）= extreme; 甚だ（はなはだ）= exceedingly"],
"謄":["On: とう — 謄本（とうほん）= certified copy; 謄写（とうしゃ）= copying","Kun: — (no common everyday kun-yomi)"],
"璧":["On: へき — 完璧（かんぺき）= perfect; 双璧（そうへき）= two outstanding people/things","Kun: — (no common everyday kun-yomi)"],
"鬱":["On: うつ — 憂鬱（ゆううつ）= depression/gloom; 鬱病（うつびょう）= depression","Kun: — (no common everyday kun-yomi)"],
"畏":["On: い — 畏敬（いけい）= awe/respect; 畏怖（いふ）= fear/awe","Kun: おそれる — 畏れる（おそれる）= to fear/revere"],
"萎":["On: い — 萎縮（いしゅく）= shrinkage/atrophy; 萎凋（いちょう）= withering","Kun: なえる — 萎える（なえる）= to wilt/lose strength"],
"嗣":["On: し — 後嗣（こうし）= heir/successor; 嗣子（しし）= heir","Kun: — (no common everyday kun-yomi)"],
"賜":["On: し — 賜杯（しはい）= imperial cup; 賜金（しきん）= grant of money","Kun: たまわる — 賜る（たまわる）= to receive graciously/be granted"],
"拙":["On: せつ — 拙速（せっそく）= crude but quick; 拙作（せっさく）= my poor work","Kun: つたない — 拙い（つたない）= poor/unskilled"],
"勅":["On: ちょく — 勅語（ちょくご）= imperial rescript; 勅命（ちょくめい）= imperial command","Kun: — (no common everyday kun-yomi)"],
"叙":["On: じょ — 叙述（じょじゅつ）= description; 叙勲（じょくん）= decoration/honour","Kun: — (no common everyday kun-yomi)"],
"遷":["On: せん — 変遷（へんせん）= transition; 遷都（せんと）= moving a capital","Kun: うつる — 遷る（うつる）= to move/transfer (literary)"],
"謁":["On: えつ — 謁見（えっけん）= audience with a person of rank","Kun: — (no common everyday kun-yomi)"],
"弔":["On: ちょう — 弔問（ちょうもん）= condolence visit; 弔辞（ちょうじ）= eulogy","Kun: とむらう — 弔う（とむらう）= to mourn/hold a memorial"],
"賄":["On: わい — 賄賂（わいろ）= bribe; 贈賄（ぞうわい）= bribery","Kun: まかなう — 賄う（まかなう）= to provide/cover expenses"],
"剖":["On: ぼう — 解剖（かいぼう）= dissection; 剖検（ぼうけん）= autopsy","Kun: — (no common everyday kun-yomi)"],
"遵":["On: じゅん — 遵守（じゅんしゅ）= compliance/observance; 遵法（じゅんぽう）= law-abiding","Kun: — (no common everyday kun-yomi)"]
};


export const KANJI_TARGET_COUNTS = {
  N5: 103, // Canonical N5 target based on MEXT Grade 1–2 / JLPT reference standard
  N4: 166,
  N3: 367,
  N2: 367,
  N1: 117
};

export interface KanjiCardItem {
  character: string;
  kunyomi: string;
  onyomi: string;
  meanings: string;
  examples: string;
  level: string;
}

export function getKanjiForLevel(level: string): KanjiCardItem[] {
  if (level === "N5" && typeof N5_KANJI !== "undefined" && N5_KANJI.length > 0) {
    return N5_KANJI.map(kanjiEntryToCardItem);
  }
  const raw = ((KANJI_DATA as unknown) as Record<string, [string, string, string, string, string][]>)[level] || [];
  return raw.map(([character, kunyomi, onyomi, meanings, examples]) => ({
    character,
    kunyomi,
    onyomi,
    meanings,
    examples,
    level,
  }));
}

export { KANJI_DATA, KANJI_READING_EXAMPLES };

// ==============================================================================
// MODULAR DATA LAYER BRIDGE (STEP 2)
// ==============================================================================
export {
  N5_KANJI,
  N4_KANJI,
  N3_KANJI,
  N2_KANJI,
  N1_KANJI,
  getAllModularKanji,
  getModularKanjiForLevel,
  getModularKanjiByChar,
  searchModularKanji,
  kanjiEntryToCardItem,
} from "./kanji/index";

