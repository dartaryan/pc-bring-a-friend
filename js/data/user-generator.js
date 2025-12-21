/**
 * PassportCard Refer - User Generator
 * Functions for generating mock user data from email addresses
 */

import { seededRandom } from '../core/utils.js';
import { ACTIVITY_TYPES } from '../core/config.js';
import { STAMP_TYPES } from './stamp-types.js';
import { MOCK_POSITIONS } from './mock-positions.js';

// ============================================
// MOCK DATA - Story 6.5 Enhanced User Generation
// ============================================

/**
 * Hebrew first names for realistic data generation (Story 6.5)
 * Expanded with gender support for more authentic Hebrew names
 */
const HEBREW_FIRST_NAMES_MALE = ['יוסי', 'דוד', 'משה', 'אבי', 'דני', 'גלעד', 'עידן', 'רועי', 'נועם', 'איתי', 'גיא', 'עומר', 'רון', 'אלון', 'טל', 'יובל'];
const HEBREW_FIRST_NAMES_FEMALE = ['דנה', 'מירי', 'יעל', 'שירה', 'נועה', 'רחל', 'תמר', 'ליאת', 'מאיה', 'הילה', 'מיכל', 'ענת', 'אורית', 'שרון', 'טל', 'גלית'];

// Combined for backwards compatibility
const HEBREW_FIRST_NAMES = [...HEBREW_FIRST_NAMES_MALE, ...HEBREW_FIRST_NAMES_FEMALE];

/**
 * Hebrew last names for realistic data generation (Story 6.5)
 */
const HEBREW_LAST_NAMES = ['כהן', 'לוי', 'מזרחי', 'פרץ', 'ביטון', 'דהן', 'אברהם', 'פרידמן', 'שלום', 'גולן', 'אלון', 'בן דוד', 'יוסף', 'חיים', 'רוזנברג', 'שפירא'];

/**
 * English to Hebrew name mapping for email-based generation (Story 6.5)
 * Maps common English first names to Hebrew equivalents
 */
const ENGLISH_TO_HEBREW_NAMES = {
  // ============================================
  // MALE NAMES - Comprehensive List
  // ============================================
  // A
  'aaron': 'אהרון', 'aharon': 'אהרון', 'adam': 'אדם', 'adi': 'עדי',
  'adir': 'אדיר', 'adiel': 'עדיאל', 'afik': 'אפיק', 'agam': 'אגם',
  'aharoni': 'אהרוני', 'ahron': 'אהרון', 'aitan': 'איתן', 'akiva': 'עקיבא',
  'alan': 'אלן', 'alex': 'אלכס', 'alexander': 'אלכסנדר', 'alon': 'אלון',
  'almog': 'אלמוג', 'amir': 'אמיר', 'amit': 'עמית', 'amitai': 'אמיתי',
  'amnon': 'אמנון', 'amos': 'עמוס', 'andrew': 'אנדרו', 'anthony': 'אנתוני',
  'ari': 'ארי', 'ariel': 'אריאל', 'arnon': 'ארנון', 'aron': 'אהרון',
  'asaf': 'אסף', 'asher': 'אשר', 'asi': 'אסי', 'assaf': 'אסף',
  'avi': 'אבי', 'aviad': 'אביעד', 'avichai': 'אביחי', 'avidan': 'אבידן',
  'aviel': 'אביאל', 'avigdor': 'אביגדור', 'avihai': 'אביחי', 'avihu': 'אביהוא',
  'avinatan': 'אבינתן', 'avinoam': 'אבינועם', 'aviram': 'אבירם', 'avishai': 'אבישי',
  'avishay': 'אבישי', 'avital': 'אביטל', 'avner': 'אבנר', 'avraham': 'אברהם',
  'avram': 'אברם', 'ayalon': 'איילון', 'azriel': 'עזריאל',
  // B
  'bar': 'בר', 'barak': 'ברק', 'barel': 'בראל', 'baruch': 'ברוך',
  'batel': 'בתאל', 'ben': 'בן', 'beni': 'בני', 'benjamin': 'בנימין',
  'benny': 'בני', 'benyamin': 'בנימין', 'boaz': 'בועז', 'brian': 'בריאן',
  // C
  'chai': 'חי', 'chaim': 'חיים', 'charles': 'צ\'ארלס', 'chris': 'כריס',
  // D
  'dan': 'דן', 'dani': 'דני', 'daniel': 'דניאל', 'danny': 'דני',
  'dany': 'דני', 'dor': 'דור', 'doron': 'דורון', 'dov': 'דב',
  'david': 'דוד', 'dave': 'דוד', 'dudi': 'דודי', 'dvir': 'דביר',
  // E
  'ed': 'אד', 'eddie': 'אדי', 'eden': 'עדן', 'ehud': 'אהוד',
  'eitan': 'איתן', 'ethan': 'איתן', 'el': 'אל', 'elad': 'אלעד',
  'elas': 'אלעס', 'eldad': 'אלדד', 'eli': 'אלי', 'eliav': 'אליאב',
  'eliezer': 'אליעזר', 'elijah': 'אליהו', 'elior': 'אליאור', 'eliran': 'אלירן',
  'elisha': 'אלישע', 'eliyahu': 'אליהו', 'elkana': 'אלקנה', 'elon': 'אילון',
  'emanuel': 'עמנואל', 'eran': 'ערן', 'eric': 'אריק', 'erik': 'אריק',
  'eshel': 'אשל', 'etai': 'איתי', 'etay': 'איתי', 'evan': 'אוון',
  'eyal': 'אייל', 'eytan': 'איתן', 'ezra': 'עזרא',
  // G
  'gabi': 'גבי', 'gabriel': 'גבריאל', 'gad': 'גד', 'gadi': 'גדי',
  'gal': 'גל', 'gary': 'גארי', 'gavriel': 'גבריאל', 'george': 'ג\'ורג\'',
  'gershon': 'גרשון', 'gidon': 'גדעון', 'gideon': 'גדעון', 'gil': 'גיל',
  'gilad': 'גלעד', 'guy': 'גיא',
  // H
  'hadar': 'הדר', 'haim': 'חיים', 'harel': 'הראל', 'hayim': 'חיים',
  'henry': 'הנרי', 'hershel': 'הרשל', 'hillel': 'הלל', 'hod': 'הוד',
  // I
  'idan': 'עידן', 'ido': 'עידו', 'igal': 'יגאל', 'ilan': 'אילן',
  'ilay': 'עילאי', 'immanuel': 'עמנואל', 'isaac': 'יצחק', 'israel': 'ישראל',
  'isser': 'איסר', 'itai': 'איתי', 'itay': 'איתי', 'itamar': 'איתמר',
  'itzik': 'איציק', 'ivan': 'איוון',
  // J
  'jack': 'יעקב', 'jacob': 'יעקב', 'jake': 'ג\'ייק', 'james': 'ג\'יימס',
  'jason': 'ג\'ייסון', 'jeff': 'ג\'ף', 'jeremy': 'ג\'רמי', 'jesse': 'ג\'סי',
  'joe': 'יוסי', 'joel': 'יואל', 'john': 'יוחנן', 'johnny': 'ג\'וני',
  'jonah': 'יונה', 'jonathan': 'יונתן', 'jordan': 'ירדן', 'josh': 'יהושע',
  'joshua': 'יהושע', 'judah': 'יהודה',
  // K
  'kobi': 'קובי', 'koby': 'קובי',
  // L
  'lavi': 'לביא', 'leon': 'ליאון', 'leo': 'ליאו', 'lev': 'לב',
  'levi': 'לוי', 'liad': 'ליעד', 'liam': 'ליאם', 'lior': 'ליאור',
  'lioz': 'ליאוז', 'liron': 'לירון', 'liran': 'לירן', 'lotan': 'לוטן',
  'lucas': 'לוקס', 'luke': 'לוק',
  // M
  'magen': 'מגן', 'maor': 'מאור', 'mark': 'מרק', 'marcus': 'מרקוס',
  'martin': 'מרטין', 'matan': 'מתן', 'mati': 'מתי', 'matt': 'מט',
  'matthew': 'מתיו', 'max': 'מקס', 'meir': 'מאיר', 'menachem': 'מנחם',
  'menashe': 'מנשה', 'michael': 'מיכאל', 'micha': 'מיכה', 'micky': 'מיקי',
  'mike': 'מייק', 'miki': 'מיקי', 'moishe': 'מויש', 'mor': 'מור',
  'mordechai': 'מרדכי', 'mordy': 'מורדי', 'moshe': 'משה', 'moses': 'משה',
  'moti': 'מוטי', 'motty': 'מוטי',
  // N
  'nadav': 'נדב', 'nahum': 'נחום', 'naor': 'נאור', 'naphtali': 'נפתלי',
  'natan': 'נתן', 'nathan': 'נתן', 'natanel': 'נתנאל', 'netanel': 'נתנאל',
  'nave': 'נווה', 'naveh': 'נווה', 'neria': 'נריה', 'neriya': 'נריה',
  'nevo': 'נבו', 'nick': 'ניק', 'nico': 'ניקו', 'nimrod': 'נמרוד',
  'nir': 'ניר', 'nisan': 'ניסן', 'nitai': 'ניתאי', 'nitay': 'ניתאי',
  'niv': 'ניב', 'noam': 'נועם', 'noah': 'נח',
  // O
  'oded': 'עודד', 'ofer': 'עופר', 'ofir': 'אופיר', 'ohad': 'אוהד',
  'omer': 'עומר', 'omar': 'עומר', 'omri': 'עמרי', 'or': 'אור',
  'oran': 'אורן', 'oren': 'אורן', 'ori': 'אורי', 'oriel': 'אוריאל',
  'oz': 'עוז', 'ofer': 'עופר',
  // P
  'paul': 'פאול', 'peretz': 'פרץ', 'peter': 'פיטר', 'pinchas': 'פנחס',
  // R
  'rafi': 'רפי', 'rafael': 'רפאל', 'raphael': 'רפאל', 'ram': 'רם',
  'rami': 'רמי', 'ran': 'רן', 'ravid': 'רביד', 'raviv': 'רביב',
  'raz': 'רז', 'reuven': 'ראובן', 'reuben': 'ראובן', 'richard': 'ריצ\'ארד',
  'robert': 'רוברט', 'roi': 'רועי', 'roey': 'רועי', 'ron': 'רון',
  'ronan': 'רונן', 'ronen': 'רונן', 'roy': 'רועי',
  // S
  'sam': 'סם', 'sami': 'סמי', 'samuel': 'שמואל', 'shai': 'שי',
  'shahar': 'שחר', 'shaul': 'שאול', 'shay': 'שי', 'shaked': 'שקד',
  'shalom': 'שלום', 'shavit': 'שביט', 'shilo': 'שילה', 'shimon': 'שמעון',
  'shimshon': 'שמשון', 'shlomi': 'שלומי', 'shlomo': 'שלמה', 'shmuel': 'שמואל',
  'simon': 'שמעון', 'snir': 'סניר', 'solomon': 'שלמה', 'stav': 'סתו',
  'steven': 'סטיבן', 'steve': 'סטיב', 'stephen': 'סטפן',
  // T
  'tal': 'טל', 'tali': 'טלי', 'tamir': 'תמיר', 'tomer': 'תומר',
  'tom': 'תום', 'tommy': 'תומי', 'tsvi': 'צבי', 'tzvi': 'צבי',
  // U
  'udy': 'אודי', 'uri': 'אורי', 'uriel': 'אוריאל', 'uriya': 'אוריה',
  // V
  'victor': 'ויקטור',
  // Y
  'yaakov': 'יעקב', 'yacov': 'יעקב', 'yael': 'יעל', 'yair': 'יאיר',
  'yaki': 'יאקי', 'yanai': 'ינאי', 'yaniv': 'יניב', 'yarden': 'ירדן',
  'yariv': 'יריב', 'yaron': 'ירון', 'yashar': 'ישר', 'yechezkel': 'יחזקאל',
  'yechiel': 'יחיאל', 'yedidya': 'ידידיה', 'yehonatan': 'יהונתן', 'yehoshua': 'יהושע',
  'yehuda': 'יהודה', 'yiftach': 'יפתח', 'yigal': 'יגאל', 'yinon': 'ינון',
  'yishai': 'ישי', 'yisrael': 'ישראל', 'yitzchak': 'יצחק', 'yoav': 'יואב',
  'yochai': 'יוחאי', 'yoel': 'יואל', 'yom-tov': 'יום טוב', 'yonatan': 'יונתן',
  'yoni': 'יוני', 'yosef': 'יוסף', 'yoseph': 'יוסף', 'yossi': 'יוסי',
  'yosi': 'יוסי', 'yotam': 'יותם', 'yuval': 'יובל',
  // Z
  'zach': 'זק', 'zack': 'זק', 'zakhar': 'זכר', 'zeev': 'זאב',
  'zev': 'זאב', 'ziv': 'זיו', 'zohar': 'זוהר',
  
  // ============================================
  // FEMALE NAMES - Comprehensive List
  // ============================================
  // A
  'abigail': 'אביגיל', 'avigail': 'אביגיל', 'adel': 'אדל', 'adele': 'אדל',
  'adi': 'עדי', 'adina': 'עדינה', 'adva': 'אדוה', 'agam': 'אגם',
  'ahinoam': 'אחינועם', 'aliza': 'עליזה', 'alma': 'אלמה', 'almog': 'אלמוג',
  'alon': 'אלונה', 'alona': 'אלונה', 'amit': 'עמית', 'amira': 'אמירה',
  'ana': 'אנה', 'anat': 'ענת', 'anna': 'אנה', 'anya': 'אניה',
  'ariela': 'אריאלה', 'ariella': 'אריאלה', 'avigayil': 'אביגיל', 'avital': 'אביטל',
  'aviva': 'אביבה', 'ayala': 'איילה', 'ayelet': 'איילת',
  // B
  'bar': 'בר', 'bat': 'בת', 'bat-el': 'בת אל', 'batel': 'בתאל',
  'batsheva': 'בת שבע', 'batya': 'בתיה', 'bianca': 'ביאנקה',
  // C
  'carmel': 'כרמל', 'carmela': 'כרמלה', 'carmit': 'כרמית', 'chana': 'חנה',
  'chani': 'חני', 'chava': 'חוה', 'chaya': 'חיה', 'chen': 'חן',
  // D
  'dafna': 'דפנה', 'dafne': 'דפנה', 'dalia': 'דליה', 'dalya': 'דליה',
  'dana': 'דנה', 'dani': 'דני', 'daniela': 'דניאלה', 'danielle': 'דניאל',
  'daphne': 'דפנה', 'dayana': 'דיאנה', 'devora': 'דבורה', 'devorah': 'דבורה',
  'dikla': 'דיקלה', 'dina': 'דינה', 'dinah': 'דינה', 'dorin': 'דורין',
  'dorit': 'דורית', 'dror': 'דרור', 'drora': 'דרורה',
  // E
  'eden': 'עדן', 'edna': 'עדנה', 'efrat': 'אפרת', 'einat': 'עינת',
  'ela': 'אלה', 'elana': 'אילנה', 'elena': 'אלנה', 'eli': 'אלי',
  'eliana': 'אליאנה', 'elinor': 'אלינור', 'elisa': 'אליסה', 'elisheva': 'אלישבע',
  'ella': 'אלה', 'emily': 'אמילי', 'emma': 'אמה', 'esti': 'אסתי',
  'esther': 'אסתר', 'eva': 'אווה',
  // G
  'gal': 'גל', 'gali': 'גלי', 'galia': 'גליה', 'galit': 'גלית',
  'gefen': 'גפן', 'geula': 'גאולה', 'gila': 'גילה', 'gili': 'גילי',
  'gitit': 'גיטית',
  // H
  'hadas': 'הדס', 'hadasa': 'הדסה', 'hadass': 'הדס', 'hadar': 'הדר',
  'hagit': 'חגית', 'hana': 'חנה', 'hanna': 'חנה', 'hannah': 'חנה',
  'hela': 'הלה', 'helen': 'הלן', 'hila': 'הילה', 'hilla': 'הילה',
  // I
  'idit': 'עידית', 'ido': 'עידו', 'ila': 'אילה', 'ilana': 'אילנה',
  'ilanit': 'אילנית', 'inbal': 'ענבל', 'inbar': 'ענבר', 'iris': 'איריס',
  'irit': 'עירית', 'irit': 'אירית',
  // J
  'jennifer': 'ג\'ניפר', 'jenny': 'ג\'ני', 'jessica': 'ג\'סיקה', 'judith': 'יהודית',
  'julia': 'יוליה', 'julie': 'ג\'ולי',
  // K
  'karen': 'קרן', 'karin': 'קרין', 'karmit': 'כרמית', 'kelila': 'כלילה',
  'keren': 'קרן', 'keshet': 'קשת', 'kinneret': 'כנרת',
  // L
  'lee': 'לי', 'liat': 'ליאת', 'liba': 'ליבא', 'libby': 'ליבי',
  'libi': 'ליבי', 'liel': 'ליאל', 'lila': 'לילה', 'lili': 'לילי',
  'lilach': 'לילך', 'lilit': 'לילית', 'lilly': 'לילי', 'limor': 'לימור',
  'lina': 'לינה', 'linoy': 'לינוי', 'liora': 'ליאורה', 'liraz': 'לירז',
  'liran': 'לירן', 'liron': 'לירון', 'livnat': 'לבנת', 'livya': 'ליביה',
  'liya': 'ליה', 'liz': 'ליז',
  // M
  'maayan': 'מעיין', 'maia': 'מאיה', 'malka': 'מלכה', 'malkah': 'מלכה',
  'malki': 'מלכי', 'maya': 'מאיה', 'meital': 'מיטל', 'merav': 'מירב',
  'meytal': 'מיטל', 'mia': 'מיה', 'michal': 'מיכל', 'michal': 'מיכל',
  'mika': 'מיקה', 'mili': 'מילי', 'mira': 'מירה', 'miriam': 'מרים',
  'miri': 'מירי', 'moriah': 'מוריה', 'mor': 'מור', 'moran': 'מורן',
  // N
  'na\'ama': 'נעמה', 'naama': 'נעמה', 'nadia': 'נדיה', 'nava': 'נאוה',
  'navit': 'נאוית', 'nechama': 'נחמה', 'nelly': 'נלי', 'neta': 'נטע',
  'nili': 'נילי', 'nina': 'נינה', 'nira': 'נירה', 'nirit': 'נירית',
  'nitsa': 'ניצה', 'nitza': 'ניצה', 'noa': 'נועה', 'noah': 'נועה',
  'nofar': 'נופר', 'noga': 'נוגה', 'nomi': 'נעמי', 'naomi': 'נעמי',
  'nurit': 'נורית',
  // O
  'ofir': 'אופיר', 'ofra': 'עפרה', 'ophir': 'אופיר', 'ophira': 'אופירה',
  'ophra': 'עפרה', 'ora': 'אורה', 'orah': 'אורה', 'orit': 'אורית',
  'orly': 'אורלי', 'orna': 'אורנה', 'ortal': 'אורטל', 'osnat': 'אסנת',
  // P
  'pearl': 'פרל', 'pnina': 'פנינה',
  // R
  'rachel': 'רחל', 'racheli': 'רחלי', 'rina': 'רינה', 'rinat': 'רינת',
  'rivka': 'רבקה', 'rivki': 'ריבקי', 'romi': 'רומי', 'rona': 'רונה',
  'roni': 'רוני', 'ronit': 'רונית', 'rotem': 'רותם', 'ruth': 'רות',
  'ruti': 'רותי',
  // S
  'sahar': 'סהר', 'sapir': 'ספיר', 'sara': 'שרה', 'sarah': 'שרה',
  'sari': 'שרי', 'shaked': 'שקד', 'shani': 'שני', 'sharon': 'שרון',
  'sharone': 'שרון', 'sheli': 'שלי', 'shelly': 'שלי', 'shir': 'שיר',
  'shira': 'שירה', 'shirel': 'שירל', 'shirley': 'שירלי', 'shlomit': 'שלומית',
  'shulamit': 'שולמית', 'sigal': 'סיגל', 'sigalit': 'סיגלית', 'simcha': 'שמחה',
  'sivan': 'סיון', 'stav': 'סתו', 'stavi': 'סתווי', 'svetlana': 'סבטלנה',
  // T
  'tal': 'טל', 'tali': 'טלי', 'talia': 'טליה', 'talya': 'טליה',
  'tamar': 'תמר', 'tamara': 'תמרה', 'tehila': 'תהילה', 'tehilla': 'תהילה',
  'tirtza': 'תרצה', 'tova': 'טובה', 'tzipi': 'ציפי', 'tzipora': 'ציפורה',
  // V
  'varda': 'ורדה', 'vered': 'ורד', 'victoria': 'ויקטוריה',
  // Y
  'yael': 'יעל', 'yaeli': 'יעלי', 'yaara': 'יערה', 'yafit': 'יפית',
  'yamit': 'ימית', 'yarden': 'ירדן', 'yardena': 'ירדנה', 'yifat': 'יפעת',
  'yisca': 'יסכה', 'yiskah': 'יסכה', 'yochi': 'יוכי', 'yocheved': 'יוכבד',
  'yonat': 'יונת', 'yonit': 'יונית',
  // Z
  'zahava': 'זהבה', 'zehava': 'זהבה', 'ziona': 'ציונה', 'ziva': 'זיוה',
  'zohar': 'זוהר', 'zvia': 'צביה'
};

/**
 * English to Hebrew surname mapping (Story 6.5)
 */
const ENGLISH_TO_HEBREW_SURNAMES = {
  // ============================================
  // TOP 10 MOST COMMON ISRAELI SURNAMES
  // ============================================
  'cohen': 'כהן', 'kohen': 'כהן', 'koen': 'כהן', 'kohn': 'כהן', 'coen': 'כהן',
  'levi': 'לוי', 'levy': 'לוי', 'levin': 'לוין', 'levine': 'לוין', 'levinson': 'לוינסון',
  'mizrachi': 'מזרחי', 'mizrahi': 'מזרחי', 'mizrachi': 'מזרחי',
  'peretz': 'פרץ', 'perez': 'פרץ', 'perec': 'פרץ',
  'biton': 'ביטון', 'bitton': 'ביטון', 'bitan': 'ביתן',
  'dahan': 'דהן', 'dhan': 'דהן', 'dehan': 'דהן',
  'avraham': 'אברהם', 'abraham': 'אברהם', 'abrahami': 'אברהמי', 'avrahami': 'אברהמי',
  'friedman': 'פרידמן', 'freedman': 'פרידמן', 'fridman': 'פרידמן',
  'yosef': 'יוסף', 'joseph': 'יוסף', 'yoseph': 'יוסף', 'yossefi': 'יוספי',
  'amar': 'עמר', 'ammar': 'עמר',
  
  // ============================================
  // SEPHARDIC / MIZRACHI SURNAMES
  // ============================================
  'azulay': 'אזולאי', 'azoulay': 'אזולאי', 'azulai': 'אזולאי',
  'abergel': 'אברג\'ל', 'aberjel': 'אברג\'ל',
  'abitbol': 'אביטבול', 'abitbul': 'אביטבול',
  'abukasis': 'אבוקסיס', 'abukaysis': 'אבוקסיס',
  'abutbul': 'אבוטבול', 'aboutboul': 'אבוטבול',
  'adari': 'אדרי', 'aderi': 'אדרי', 'edri': 'אדרי', 'edry': 'אדרי',
  'alfasi': 'אלפסי', 'alpasi': 'אלפסי',
  'amar': 'עמר', 'ammar': 'עמר',
  'amsalem': 'אמסלם', 'amselem': 'אמסלם',
  'assouline': 'אסולין', 'assulin': 'אסולין',
  'atias': 'עטיאס', 'attias': 'עטיאס', 'attiya': 'עטיה',
  'benaroch': 'בן ארוש', 'benarroch': 'בן ארוש',
  'benaim': 'בן אאים', 'benayim': 'בן אאים',
  'benshlomo': 'בן שלמה', 'ben-shlomo': 'בן שלמה',
  'bensimon': 'בן סימון', 'ben-simon': 'בן סימון',
  'buzaglo': 'בוזגלו', 'bouzaglo': 'בוזגלו',
  'dayan': 'דיין', 'dayyan': 'דיין',
  'elbaz': 'אלבז', 'albaz': 'אלבז',
  'elmaliach': 'אלמליח', 'elmaleh': 'אלמליח',
  'gamliel': 'גמליאל', 'gamlial': 'גמליאל',
  'gabay': 'גבאי', 'gabbay': 'גבאי', 'gabai': 'גבאי',
  'hadad': 'חדד', 'haddad': 'חדד',
  'haim': 'חיים', 'haym': 'חיים', 'chaim': 'חיים', 'hayim': 'חיים',
  'hamu': 'חמו', 'hamou': 'חמו',
  'harosh': 'הרוש', 'haroush': 'הרוש',
  'hasson': 'חסון', 'hason': 'חסון', 'hassan': 'חסן',
  'hazut': 'חזות', 'hazout': 'חזות',
  'ifergan': 'יפרגן', 'ifergane': 'יפרגן',
  'kadosh': 'קדוש', 'kadush': 'קדוש',
  'knafo': 'כנאפו', 'knafou': 'כנאפו',
  'mamane': 'ממנה', 'maman': 'ממן',
  'malka': 'מלכה', 'malca': 'מלכה', 'malchi': 'מלכי',
  'madar': 'מדר', 'maddar': 'מדר',
  'muyal': 'מויאל', 'moyal': 'מויאל',
  'nahon': 'נחון', 'nachon': 'נחון',
  'naim': 'נאים', 'naeem': 'נאים', 'nahim': 'נחים',
  'ohayon': 'אוחיון', 'ohaion': 'אוחיון', 'ohayan': 'אוחיון',
  'ohana': 'אוחנה', 'ochana': 'אוחנה',
  'saban': 'סבן', 'sabban': 'סבן',
  'sabag': 'סבג', 'sabbag': 'סבג', 'sebag': 'סבג',
  'sarusi': 'סרוסי', 'sarussi': 'סרוסי',
  'shirazi': 'שירזי', 'shirazee': 'שירזי',
  'shitrit': 'שטרית', 'chitrit': 'שטרית',
  'suissa': 'סויסה', 'swisa': 'סויסה', 'swissa': 'סויסה',
  'vaknin': 'וקנין', 'waknin': 'וקנין',
  'yaacobi': 'יעקובי', 'yacobi': 'יעקובי', 'jacobi': 'יעקובי',
  
  // ============================================
  // ASHKENAZI SURNAMES
  // ============================================
  'adler': 'אדלר', 'adelr': 'אדלר',
  'applebaum': 'אפלבאום', 'appelbaum': 'אפלבאום',
  'becker': 'בקר', 'bekker': 'בקר',
  'berg': 'ברג', 'berger': 'ברגר',
  'bernstein': 'ברנשטיין', 'bornstein': 'בורנשטיין',
  'blau': 'בלאו', 'blau': 'בלאו',
  'blum': 'בלום', 'bloom': 'בלום',
  'braun': 'בראון', 'brown': 'בראון',
  'dreyfus': 'דרייפוס', 'dreyfuss': 'דרייפוס',
  'ehrlich': 'ארליך', 'erlich': 'ארליך',
  'einstein': 'איינשטיין', 'einstien': 'איינשטיין',
  'feinberg': 'פיינברג', 'fineberg': 'פיינברג',
  'feldman': 'פלדמן', 'feltman': 'פלדמן',
  'fink': 'פינק', 'finke': 'פינק',
  'fischer': 'פישר', 'fisher': 'פישר',
  'frank': 'פרנק', 'frankel': 'פרנקל',
  'geller': 'גלר', 'gellar': 'גלר',
  'ginsburg': 'גינזבורג', 'ginzburg': 'גינזבורג',
  'glass': 'גלס', 'glaser': 'גלזר',
  'gold': 'גולד', 'golden': 'גולדן',
  'goldberg': 'גולדברג', 'goldberger': 'גולדברגר',
  'goldman': 'גולדמן', 'goldmann': 'גולדמן',
  'goldstein': 'גולדשטיין', 'goldstien': 'גולדשטיין',
  'gordon': 'גורדון', 'gorden': 'גורדון',
  'green': 'גרין', 'greene': 'גרין', 'grin': 'גרין',
  'greenberg': 'גרינברג', 'greenberg': 'גרינברג',
  'gross': 'גרוס', 'grosz': 'גרוס',
  'grossman': 'גרוסמן', 'grosman': 'גרוסמן',
  'gutman': 'גוטמן', 'guttman': 'גוטמן',
  'heller': 'הלר', 'hellar': 'הלר',
  'herman': 'הרמן', 'hermann': 'הרמן',
  'hirsch': 'הירש', 'hirsh': 'הירש',
  'hoffman': 'הופמן', 'hofman': 'הופמן',
  'horowitz': 'הורוביץ', 'hurwitz': 'הורוביץ',
  'jacobson': 'יעקבסון', 'jacobsen': 'יעקבסון',
  'kaplan': 'קפלן', 'caplan': 'קפלן',
  'katz': 'כץ', 'kac': 'כץ', 'kaz': 'כץ',
  'kaufman': 'קאופמן', 'kaufmann': 'קאופמן',
  'klein': 'קליין', 'kline': 'קליין',
  'kolodny': 'קולודני', 'kolodni': 'קולודני',
  'korn': 'קורן', 'koren': 'קורן',
  'kramer': 'קרמר', 'kraemer': 'קרמר',
  'landau': 'לנדאו', 'lando': 'לנדו',
  'lehrer': 'לרר', 'lerer': 'לרר',
  'lerner': 'לרנר', 'learner': 'לרנר',
  'lipman': 'ליפמן', 'lippman': 'ליפמן',
  'loewenstein': 'לוונשטיין', 'lowenstein': 'לוונשטיין',
  'mandel': 'מנדל', 'mendel': 'מנדל',
  'marcus': 'מרקוס', 'markus': 'מרקוס',
  'meir': 'מאיר', 'meyer': 'מאיר', 'mayer': 'מאיר',
  'mendelsohn': 'מנדלסון', 'mendelson': 'מנדלסון',
  'miller': 'מילר', 'muller': 'מילר',
  'novak': 'נובק', 'nowak': 'נובק',
  'perlman': 'פרלמן', 'pearlman': 'פרלמן',
  'rabinovitch': 'רבינוביץ', 'rabinovich': 'רבינוביץ', 'rabinowitz': 'רבינוביץ',
  'rosen': 'רוזן', 'rozen': 'רוזן',
  'rosenberg': 'רוזנברג', 'rozenberg': 'רוזנברג',
  'rosenfeld': 'רוזנפלד', 'rozenfeld': 'רוזנפלד',
  'rosenthal': 'רוזנטל', 'rozenthal': 'רוזנטל',
  'rothenberg': 'רוטנברג', 'rottenberg': 'רוטנברג',
  'rothschild': 'רוטשילד', 'rotschild': 'רוטשילד',
  'rubin': 'רובין', 'rubinstein': 'רובינשטיין',
  'schneider': 'שניידר', 'snyder': 'סניידר',
  'schultz': 'שולץ', 'shultz': 'שולץ',
  'schwartz': 'שוורץ', 'shwartz': 'שוורץ', 'schwarz': 'שוורץ',
  'segal': 'סגל', 'siegel': 'סיגל',
  'shapira': 'שפירא', 'shapiro': 'שפירא', 'schapiro': 'שפירא',
  'shulman': 'שולמן', 'schulman': 'שולמן',
  'silber': 'זילבר', 'silver': 'סילבר', 'zilber': 'זילבר',
  'simon': 'סימון', 'shimon': 'שמעון',
  'singer': 'זינגר', 'sanger': 'זינגר',
  'spector': 'ספקטור', 'spektor': 'ספקטור',
  'stein': 'שטיין', 'stien': 'שטיין',
  'steinberg': 'שטיינברג', 'stenberg': 'שטיינברג',
  'stern': 'שטרן', 'sterne': 'שטרן',
  'strauss': 'שטראוס', 'straus': 'שטראוס',
  'vogel': 'פוגל', 'fogel': 'פוגל',
  'waxman': 'וקסמן', 'vaxman': 'וקסמן',
  'weiner': 'ויינר', 'wiener': 'ויינר',
  'weinberg': 'ויינברג', 'weinberg': 'ויינברג',
  'weinstein': 'ויינשטיין', 'wiensten': 'ויינשטיין',
  'weiss': 'וייס', 'weis': 'וייס', 'wise': 'וייס',
  'weissman': 'וייסמן', 'wiseman': 'וייסמן',
  'wolf': 'וולף', 'wolff': 'וולף',
  'zimmerman': 'צימרמן', 'zimmermann': 'צימרמן',
  
  // ============================================
  // HEBREW / ISRAELI MODERN SURNAMES
  // ============================================
  'akiva': 'עקיבא', 'akiba': 'עקיבא',
  'alon': 'אלון', 'aloni': 'אלוני', 'ilan': 'אילן', 'ilani': 'אילני',
  'amit': 'עמית', 'amiti': 'עמיתי',
  'ariel': 'אריאל', 'ariely': 'אריאלי',
  'bar': 'בר', 'bar-on': 'בר און', 'baron': 'בר און',
  'barkai': 'ברקאי', 'barkay': 'ברקאי',
  'baruch': 'ברוך', 'boruch': 'ברוך',
  'ben-ami': 'בן עמי', 'benami': 'בן עמי',
  'ben-ari': 'בן ארי', 'benari': 'בן ארי',
  'ben-david': 'בן דוד', 'bendavid': 'בן דוד',
  'ben-haim': 'בן חיים', 'benhaim': 'בן חיים',
  'ben-moshe': 'בן משה', 'benmoshe': 'בן משה',
  'ben-shlomo': 'בן שלמה', 'benshlomo': 'בן שלמה',
  'ben-yosef': 'בן יוסף', 'benyosef': 'בן יוסף',
  'ben-zvi': 'בן צבי', 'benzvi': 'בן צבי',
  'binyamin': 'בנימין', 'benjamin': 'בנימין',
  'carmeli': 'כרמלי', 'karmi': 'כרמי', 'carmi': 'כרמי',
  'carmel': 'כרמל', 'karmel': 'כרמל',
  'david': 'דוד', 'davidoff': 'דוידוף',
  'dor': 'דור', 'dori': 'דורי', 'doron': 'דורון',
  'eldar': 'אלדר', 'eldad': 'אלדד',
  'eliahu': 'אליהו', 'eliyahu': 'אליהו', 'elyahu': 'אליהו',
  'even': 'אבן', 'even-chen': 'אבן חן', 'evenchen': 'אבן חן',
  'gabriel': 'גבריאל', 'gavriel': 'גבריאל', 'gavrieli': 'גבריאלי',
  'gal': 'גל', 'gali': 'גלי',
  'gilad': 'גלעד', 'giladi': 'גלעדי',
  'golan': 'גולן', 'golani': 'גולני',
  'gur': 'גור', 'guri': 'גורי',
  'hadar': 'הדר', 'hadari': 'הדרי',
  'harel': 'הראל', 'hareli': 'הראלי',
  'herzl': 'הרצל', 'hertzel': 'הרצל',
  'israeli': 'ישראלי', 'yisraeli': 'ישראלי',
  'keren': 'קרן', 'karni': 'קרני',
  'kaspi': 'כספי', 'kesef': 'כסף',
  'lavi': 'לביא', 'lavy': 'לביא',
  'lavie': 'לביא', 'lavia': 'לביא',
  'livne': 'לבנה', 'livni': 'לבני',
  'melamed': 'מלמד', 'melamid': 'מלמד',
  'mor': 'מור', 'mori': 'מורי',
  'navon': 'נבון', 'navoni': 'נבוני',
  'naor': 'נאור', 'naori': 'נאורי',
  'nir': 'ניר', 'niri': 'נירי',
  'paz': 'פז', 'pazi': 'פזי',
  'rabin': 'רבין', 'rabini': 'רביני',
  'ran': 'רן', 'rani': 'רני',
  'raz': 'רז', 'razi': 'רזי',
  'ron': 'רון', 'roni': 'רוני',
  'shaked': 'שקד', 'shakedi': 'שקדי',
  'shalom': 'שלום', 'shalomi': 'שלומי',
  'shamir': 'שמיר', 'shamiri': 'שמירי',
  'sharon': 'שרון', 'sharoni': 'שרוני',
  'shlomo': 'שלמה', 'shlomi': 'שלומי',
  'shoham': 'שוהם', 'shohami': 'שוהמי',
  'tal': 'טל', 'tali': 'טלי',
  'tamir': 'תמיר', 'tamiri': 'תמירי',
  'tov': 'טוב', 'tovi': 'טובי',
  'tzur': 'צור', 'zur': 'צור', 'zuri': 'צורי',
  'yadin': 'ידין', 'yadlin': 'ידלין',
  'yaffe': 'יפה', 'yaffee': 'יפה', 'jaffa': 'יפו',
  'yaniv': 'יניב', 'yanivi': 'יניבי',
  'zohar': 'זוהר', 'zohari': 'זוהרי',
  'ziv': 'זיו', 'zivi': 'זיוי'
};

/**
 * Departments with full structure (Story 6.5)
 */
export const DEPARTMENT_DATA = [
  { id: 'dev', name: 'פיתוח', nameEn: 'Development' },
  { id: 'product', name: 'מוצר', nameEn: 'Product' },
  { id: 'marketing', name: 'שיווק', nameEn: 'Marketing' },
  { id: 'hr', name: 'משאבי אנוש', nameEn: 'HR' },
  { id: 'finance', name: 'כספים', nameEn: 'Finance' },
  { id: 'operations', name: 'תפעול', nameEn: 'Operations' }
];

// Simple department names array for backwards compatibility
export const DEPARTMENTS = DEPARTMENT_DATA.map(d => d.name);

/**
 * Relationship options for referral form (Story 6.5)
 */
export const RELATIONSHIP_OPTIONS = [
  { id: 'friend', name: 'חבר/ה קרוב/ה' },
  { id: 'colleague', name: 'קולגה מעבודה קודמת' },
  { id: 'professional', name: 'מכר/ה מקצועי/ת' },
  { id: 'other', name: 'אחר' }
];

/**
 * Gets Hebrew first name from English email part (Story 6.5)
 * @param {string} englishName - English name from email
 * @param {Function} random - Seeded random function
 * @returns {string} Hebrew first name
 */
export function getHebrewFirstName(englishName, random) {
  const normalized = englishName.toLowerCase().replace(/[^a-z]/g, '');
  
  // Try direct mapping
  if (ENGLISH_TO_HEBREW_NAMES[normalized]) {
    return ENGLISH_TO_HEBREW_NAMES[normalized];
  }
  
  // Determine likely gender from name patterns
  const femalePatterns = /a$|ah$|it$|li$|ie$|y$/i;
  const isFemale = femalePatterns.test(normalized);
  
  // Fall back to random selection based on gender
  const names = isFemale ? HEBREW_FIRST_NAMES_FEMALE : HEBREW_FIRST_NAMES_MALE;
  return names[Math.floor(random() * names.length)];
}

/**
 * Gets Hebrew surname from English email part (Story 6.5)
 * @param {string} englishSurname - English surname from email
 * @param {Function} random - Seeded random function
 * @returns {string} Hebrew surname
 */
export function getHebrewSurname(englishSurname, random) {
  const normalized = englishSurname.toLowerCase().replace(/[^a-z-]/g, '');
  
  // Try direct mapping
  if (ENGLISH_TO_HEBREW_SURNAMES[normalized]) {
    return ENGLISH_TO_HEBREW_SURNAMES[normalized];
  }
  
  // Fall back to random selection
  return HEBREW_LAST_NAMES[Math.floor(random() * HEBREW_LAST_NAMES.length)];
}

/**
 * Generates join date in the past 1-3 years (Story 6.5 AC1)
 * @param {Function} random - Seeded random function
 * @returns {string} ISO date string
 */
export function generateJoinDate(random) {
  const now = new Date();
  const threeYearsAgo = new Date(now);
  threeYearsAgo.setFullYear(now.getFullYear() - 3);
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  
  // Random date between 1-3 years ago
  const range = oneYearAgo.getTime() - threeYearsAgo.getTime();
  const randomTime = threeYearsAgo.getTime() + (random() * range);
  return new Date(randomTime).toISOString().split('T')[0];
}

/**
 * Calculates months since a date (Story 6.5)
 * @param {string} dateStr - ISO date string
 * @returns {number} Number of months
 */
export function getMonthsSince(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const months = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
  return Math.max(0, months);
}

/**
 * Calculates user level based on points (Story 6.5)
 * @param {number} points - Total points
 * @returns {Object} Level info with level number, name, next threshold, and progress
 */
export function calculateLevelInfo(points) {
  if (points >= 5000) return { level: 5, name: 'אגדה', next: null, progress: 100 };
  if (points >= 2000) return { level: 4, name: 'אלוף', next: 5000, progress: ((points - 2000) / 3000) * 100 };
  if (points >= 750) return { level: 3, name: 'מומחה', next: 2000, progress: ((points - 750) / 1250) * 100 };
  if (points >= 250) return { level: 2, name: 'פעיל', next: 750, progress: ((points - 250) / 500) * 100 };
  return { level: 1, name: 'מתחיל', next: 250, progress: (points / 250) * 100 };
}

/**
 * Generates mock referrals array with proper position linking (Story 6.5 AC3)
 * @param {Function} random - Seeded random function
 * @param {number} count - Number of referrals to generate (3-8)
 * @param {string} joinDate - User's join date to bound referral dates
 * @returns {Array} Mock referrals with timelines
 */
export function generateMockReferrals(random, count, joinDate) {
  const CANDIDATE_FIRST_NAMES = [...HEBREW_FIRST_NAMES_MALE, ...HEBREW_FIRST_NAMES_FEMALE];
  const CANDIDATE_LAST_NAMES = [...HEBREW_LAST_NAMES];
  const RELATIONSHIPS = ['חבר/ה קרוב/ה', 'קולגה מעבודה קודמת', 'מכר/ה מקצועי/ת', 'אחר'];
  
  const referrals = [];
  const usedPositionIds = new Set();
  
  // Status distribution to ensure variety (AC3 requirements)
  const statusDistribution = [];
  if (count >= 1) statusDistribution.push('submitted');
  if (count >= 2) statusDistribution.push('review');
  if (count >= 3) statusDistribution.push('interview');
  if (count >= 4) statusDistribution.push('hired');
  if (count >= 5) statusDistribution.push('rejected');
  
  // Fill remaining slots with weighted random statuses
  while (statusDistribution.length < count) {
    const r = random();
    if (r < 0.25) statusDistribution.push('submitted');
    else if (r < 0.45) statusDistribution.push('review');
    else if (r < 0.65) statusDistribution.push('interview');
    else if (r < 0.80) statusDistribution.push('offer');
    else if (r < 0.92) statusDistribution.push('hired');
    else statusDistribution.push('rejected');
  }
  
  // Shuffle the status distribution
  for (let i = statusDistribution.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [statusDistribution[i], statusDistribution[j]] = [statusDistribution[j], statusDistribution[i]];
  }
  
  const joinDateObj = new Date(joinDate);
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const firstName = CANDIDATE_FIRST_NAMES[Math.floor(random() * CANDIDATE_FIRST_NAMES.length)];
    const lastName = CANDIDATE_LAST_NAMES[Math.floor(random() * CANDIDATE_LAST_NAMES.length)];
    const status = statusDistribution[i];
    
    // Pick a position from MOCK_POSITIONS (avoid duplicates when possible)
    let positionIndex;
    const availableIndices = [];
    for (let p = 0; p < MOCK_POSITIONS.length; p++) {
      if (!usedPositionIds.has(p)) availableIndices.push(p);
    }
    if (availableIndices.length > 0) {
      positionIndex = availableIndices[Math.floor(random() * availableIndices.length)];
      usedPositionIds.add(positionIndex);
    } else {
      positionIndex = Math.floor(random() * MOCK_POSITIONS.length);
    }
    const position = MOCK_POSITIONS[positionIndex];
    
    // Generate submission date: between join date and now
    const maxDaysAgo = Math.floor((now - joinDateObj) / (1000 * 60 * 60 * 24));
    const daysAgo = Math.floor(random() * Math.min(maxDaysAgo, 365));
    const submittedDate = new Date(now);
    submittedDate.setDate(submittedDate.getDate() - daysAgo);
    
    // Generate progressive timeline based on status
    const timeline = generateReferralTimeline(submittedDate, status, random);
    
    // Calculate points earned from timeline
    let pointsEarned = 0;
    timeline.forEach(entry => { pointsEarned += entry.points || 0; });
    
    // Calculate potential points (what can still be earned)
    let potentialPoints = 0;
    if (status !== 'hired' && status !== 'rejected') {
      const remaining = ['submitted', 'review', 'interview', 'offer', 'hired'];
      const currentIdx = remaining.indexOf(status);
      if (currentIdx < remaining.length - 1) {
        potentialPoints = 500; // Hired bonus still available
        if (status === 'submitted' || status === 'review') potentialPoints += 100; // Interview bonus
      }
    }
    
    const referralId = `ref-${(1000 + i).toString().padStart(4, '0')}`;
    
    const referral = {
      id: referralId,
      candidateName: `${firstName} ${lastName}`,
      candidateEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      candidatePhone: `05${Math.floor(random() * 10)}-${Math.floor(random() * 9000000 + 1000000)}`,
      relationship: RELATIONSHIPS[Math.floor(random() * RELATIONSHIPS.length)],
      positionId: position.id,
      positionTitle: position.title,
      positionDepartment: position.department,
      status: status,
      submittedAt: submittedDate.toISOString(),
      updatedAt: timeline[timeline.length - 1]?.date ? 
        new Date(timeline[timeline.length - 1].date).toISOString() : 
        submittedDate.toISOString(),
      timeline: timeline,
      pointsEarned: pointsEarned,
      potentialPoints: potentialPoints,
      // For backwards compatibility
      position: position.title,
      submittedDate: submittedDate.toISOString().split('T')[0],
      points: pointsEarned
    };
    
    // Add milestones for hired referrals
    if (status === 'hired' && timeline.length > 0) {
      const hiredEntry = timeline.find(t => t.status === 'hired');
      if (hiredEntry) {
        const hiredDate = new Date(hiredEntry.date);
        const threeMonths = new Date(hiredDate);
        threeMonths.setMonth(threeMonths.getMonth() + 3);
        const sixMonths = new Date(hiredDate);
        sixMonths.setMonth(sixMonths.getMonth() + 6);
        referral.milestones = {
          threeMonth: threeMonths.toISOString().split('T')[0],
          sixMonth: sixMonths.toISOString().split('T')[0]
        };
      }
    }
    
    // Add rejection reason for rejected referrals
    if (status === 'rejected') {
      const reasons = [
        'לא עמד בדרישות הניסיון הטכני',
        'לא התאים לתרבות הארגונית',
        'המשרה אוישה על ידי מועמד אחר',
        'ביטל את המועמדות'
      ];
      referral.rejectionReason = reasons[Math.floor(random() * reasons.length)];
    }
    
    referrals.push(referral);
  }
  
  // Sort by submission date (newest first)
  referrals.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  
  return referrals;
}

/**
 * Generates a progressive timeline for a referral (Story 6.5 AC3)
 * Timeline dates are 3-14 days apart
 * @param {Date} submittedDate - Initial submission date
 * @param {string} finalStatus - Current/final status
 * @param {Function} random - Seeded random function
 * @returns {Array} Timeline entries with status, date, and points
 */
export function generateReferralTimeline(submittedDate, finalStatus, random) {
  const statusOrder = ['submitted', 'review', 'interview', 'offer', 'hired'];
  const statusPoints = { submitted: 50, review: 0, interview: 100, offer: 0, hired: 500 };
  
  const timeline = [];
  let currentDate = new Date(submittedDate);
  
  // Always add submitted
  timeline.push({
    status: 'submitted',
    date: currentDate.toISOString().split('T')[0],
    points: statusPoints.submitted
  });
  
  if (finalStatus === 'rejected') {
    // For rejected: submitted -> review -> rejected
    currentDate.setDate(currentDate.getDate() + Math.floor(random() * 11) + 3); // 3-14 days
    timeline.push({
      status: 'review',
      date: currentDate.toISOString().split('T')[0],
      points: 0
    });
    currentDate.setDate(currentDate.getDate() + Math.floor(random() * 11) + 3);
    timeline.push({
      status: 'rejected',
      date: currentDate.toISOString().split('T')[0],
      points: 0
    });
    return timeline;
  }
  
  // Build timeline up to final status
  const finalIdx = statusOrder.indexOf(finalStatus);
  
  for (let i = 1; i <= finalIdx; i++) {
    const status = statusOrder[i];
    currentDate.setDate(currentDate.getDate() + Math.floor(random() * 11) + 3); // 3-14 days apart
    
    timeline.push({
      status: status,
      date: currentDate.toISOString().split('T')[0],
      points: statusPoints[status] || 0
    });
  }
  
  return timeline;
}

/**
 * Generates mock stamps based on referral history (Story 6.5 AC4)
 * @param {Function} random - Seeded random function
 * @param {Array} referrals - User's referrals array
 * @param {string} joinDate - User's join date
 * @returns {Array} Array of stamp objects
 */
export function generateMockStamps(random, referrals, joinDate) {
  const stamps = [];
  const now = new Date();
  let stampIdCounter = 1;
  
  // Helper to create stamp
  const createStamp = (type, date, referralId = null, extraPoints = 0) => {
    const config = STAMP_TYPES[type];
    if (!config) return null;
    
    return {
      id: `stamp-${stampIdCounter++}`,
      type: type,
      label: config.label,
      points: config.points + extraPoints,
      earnedDate: date,
      referralId: referralId,
      color: config.color,
      shape: config.shape,
      icon: config.icon,
      isNew: false
    };
  };
  
  // 1. First Referral stamp (exactly 1, AC4)
  if (referrals.length > 0) {
    // Find earliest referral
    const sortedReferrals = [...referrals].sort((a, b) => 
      new Date(a.submittedAt) - new Date(b.submittedAt)
    );
    const firstReferral = sortedReferrals[0];
    const firstStamp = createStamp('first', firstReferral.submittedAt, firstReferral.id);
    if (firstStamp) stamps.push(firstStamp);
  }
  
  // 2. Generate stamps from referrals
  referrals.forEach(referral => {
    // Submitted stamp for each referral
    const submittedStamp = createStamp('submitted', referral.submittedAt, referral.id);
    if (submittedStamp) stamps.push(submittedStamp);
    
    // Interview stamp if reached interview stage
    const interviewEntry = referral.timeline?.find(t => t.status === 'interview');
    if (interviewEntry) {
      const interviewStamp = createStamp('interview', interviewEntry.date, referral.id);
      if (interviewStamp) stamps.push(interviewStamp);
    }
    
    // Hired stamp if hired
    const hiredEntry = referral.timeline?.find(t => t.status === 'hired');
    if (hiredEntry) {
      const hiredStamp = createStamp('hired', hiredEntry.date, referral.id);
      if (hiredStamp) stamps.push(hiredStamp);
      
      // Milestone stamps for hired referrals
      if (referral.milestones) {
        // 3-month milestone
        const threeMonthDate = new Date(referral.milestones.threeMonth);
        if (threeMonthDate <= now) {
          const milestone3Stamp = createStamp('milestone3m', referral.milestones.threeMonth, referral.id);
          if (milestone3Stamp) stamps.push(milestone3Stamp);
        }
        
        // 6-month milestone
        const sixMonthDate = new Date(referral.milestones.sixMonth);
        if (sixMonthDate <= now) {
          const milestone6Stamp = createStamp('milestone6m', referral.milestones.sixMonth, referral.id);
          if (milestone6Stamp) stamps.push(milestone6Stamp);
        }
      }
    }
  });
  
  // 3. Campaign stamps (0-2, random for users with tenure)
  const tenureMonths = getMonthsSince(joinDate);
  if (tenureMonths >= 6 && random() > 0.4) {
    // Add 1-2 campaign stamps for longer-tenure users
    const campaignCount = random() > 0.5 ? 2 : 1;
    for (let i = 0; i < campaignCount; i++) {
      // Random date between join and now
      const randomDays = Math.floor(random() * Math.min(tenureMonths * 30, 365));
      const campaignDate = new Date(now);
      campaignDate.setDate(campaignDate.getDate() - randomDays);
      
      const campaignStamp = createStamp('campaign', campaignDate.toISOString());
      if (campaignStamp) stamps.push(campaignStamp);
    }
  }
  
  // 4. Streak stamp (0-1, for active users)
  const submittedCount = referrals.filter(r => 
    new Date(r.submittedAt) > new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  ).length;
  
  if (submittedCount >= 3 && random() > 0.3) {
    // Recent streak - add streak stamp
    const streakDate = new Date(now);
    streakDate.setDate(streakDate.getDate() - Math.floor(random() * 14));
    const streakStamp = createStamp('streak', streakDate.toISOString());
    if (streakStamp) stamps.push(streakStamp);
  }
  
  // Sort stamps by date (newest first)
  stamps.sort((a, b) => new Date(b.earnedDate) - new Date(a.earnedDate));
  
  return stamps;
}

/**
 * Gets the days offset from submission for each status
 * @param {string} status - Referral status
 * @param {Function} random - Seeded random function
 * @returns {number} Days offset
 */
export function getStatusDaysOffset(status, random) {
  const offsets = {
    'submitted': 0,
    'review': Math.floor(random() * 7) + 3,        // 3-10 days
    'interview': Math.floor(random() * 14) + 10,   // 10-24 days
    'offer': Math.floor(random() * 21) + 24,       // 24-45 days
    'hired': Math.floor(random() * 30) + 45,       // 45-75 days
    'rejected': Math.floor(random() * 21) + 14     // 14-35 days
  };
  return offsets[status] || 0;
}

/**
 * Generates activity items from referrals array
 * @param {Array} referrals - User's referrals
 * @param {Function} random - Seeded random function
 * @returns {Array} Activity items sorted by timestamp (newest first)
 */
export function generateActivitiesFromReferrals(referrals, random) {
  const activities = [];
  
  const STATUS_TO_ACTIVITY = {
    'submitted': {
      type: ACTIVITY_TYPES.REFERRAL_SUBMITTED,
      descTemplate: '{{name}} הוגש/ה למשרת {{position}}',
      points: 50,
      icon: 'ti-send',
      iconColor: 'primary'
    },
    'review': {
      type: ACTIVITY_TYPES.STATUS_CHANGE,
      descTemplate: '{{name}} נמצא/ת בבדיקה',
      points: 0,
      icon: 'ti-eye',
      iconColor: 'info'
    },
    'interview': {
      type: ACTIVITY_TYPES.STATUS_CHANGE,
      descTemplate: '{{name}} עבר/ה לשלב ראיון',
      points: 100,
      icon: 'ti-calendar-event',
      iconColor: 'warning'
    },
    'offer': {
      type: ACTIVITY_TYPES.STATUS_CHANGE,
      descTemplate: '{{name}} קיבל/ה הצעת עבודה',
      points: 0,
      icon: 'ti-file-text',
      iconColor: 'info'
    },
    'hired': {
      type: ACTIVITY_TYPES.STATUS_CHANGE,
      descTemplate: '{{name}} גויס/ה בהצלחה!',
      points: 500,
      icon: 'ti-trophy',
      iconColor: 'success'
    },
    'rejected': {
      type: ACTIVITY_TYPES.STATUS_CHANGE,
      descTemplate: '{{name}} לא נבחר/ה להמשך',
      points: 0,
      icon: 'ti-x',
      iconColor: 'error'
    }
  };
  
  referrals.forEach(referral => {
    const config = STATUS_TO_ACTIVITY[referral.status];
    if (!config) return;
    
    // Create activity for current status
    const description = config.descTemplate
      .replace('{{name}}', referral.candidateName)
      .replace('{{position}}', referral.position);
    
    // Generate timestamp relative to submitted date
    const statusDate = new Date(referral.submittedDate);
    const daysOffset = getStatusDaysOffset(referral.status, random);
    statusDate.setDate(statusDate.getDate() + daysOffset);
    
    activities.push({
      id: `act-${referral.id}-${referral.status}`,
      type: config.type,
      description: description,
      points: config.points,
      timestamp: statusDate.toISOString(),
      referralId: referral.id,
      icon: config.icon,
      iconColor: config.iconColor
    });
    
    // Add points activity if points > 0
    if (config.points > 0) {
      activities.push({
        id: `act-${referral.id}-points-${referral.status}`,
        type: ACTIVITY_TYPES.POINTS_EARNED,
        description: `הרווחת ${config.points} נקודות`,
        points: config.points,
        timestamp: new Date(statusDate.getTime() + 1000).toISOString(), // 1 second after
        referralId: referral.id,
        icon: 'ti-star',
        iconColor: 'primary'
      });
    }
  });
  
  // Sort by timestamp descending (newest first)
  activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  return activities;
}

/**
 * Formats a timestamp as a relative time string in Hebrew
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Relative time in Hebrew (e.g., "לפני 2 שעות")
 */
export function formatRelativeTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  
  if (diffSeconds < 60) {
    return 'עכשיו';
  }
  
  if (diffMinutes < 60) {
    if (diffMinutes === 1) return 'לפני דקה';
    if (diffMinutes === 2) return 'לפני 2 דקות';
    return `לפני ${diffMinutes} דקות`;
  }
  
  if (diffHours < 24) {
    if (diffHours === 1) return 'לפני שעה';
    if (diffHours === 2) return 'לפני שעתיים';
    return `לפני ${diffHours} שעות`;
  }
  
  if (diffDays === 1) {
    return 'אתמול';
  }
  
  if (diffDays === 2) {
    return 'לפני יומיים';
  }
  
  if (diffDays < 7) {
    return `לפני ${diffDays} ימים`;
  }
  
  if (diffWeeks === 1) {
    return 'לפני שבוע';
  }
  
  if (diffWeeks < 4) {
    return `לפני ${diffWeeks} שבועות`;
  }
  
  if (diffMonths === 1) {
    return 'לפני חודש';
  }
  
  if (diffMonths < 12) {
    return `לפני ${diffMonths} חודשים`;
  }
  
  // Fallback to date format for older items
  return date.toLocaleDateString('he-IL', { 
    day: 'numeric',
    month: 'short'
  });
}

/**
 * Generates mock campaign data with dynamic dates (Story 6.5 AC5)
 * @param {Function} random - Seeded random function
 * @returns {Array} Array of campaign objects with valid date ranges
 */
export function generateMockCampaigns(random) {
  const now = new Date();
  
  /**
   * Campaign templates with dynamic date generation
   * End dates are 7-30 days in the future as per AC5
   */
  const campaignTemplates = [
    {
      id: 'camp-001',
      name: 'סופר בולס מפתחים!',
      description: 'נקודות כפולות על כל הפניה לתפקידי פיתוח! הזדמנות מוגבלת בזמן.',
      multiplier: 2,
      eligibleDepartments: ['פיתוח'],
      eligiblePositionIds: ['pos-001', 'pos-006', 'pos-009', 'pos-011'],
      badgeColor: 'primary',
      icon: 'ti-code',
      badgeText: '<i class="ti ti-gift" aria-hidden="true"></i> x2 נקודות!',
      accentColor: '#6C5CE7'
    },
    {
      id: 'camp-002',
      name: '🚀 מבצע שיווק!',
      description: 'בונוס x1.5 על כל הפניה למשרות שיווק. הזמן רץ!',
      multiplier: 1.5,
      eligibleDepartments: ['שיווק'],
      eligiblePositionIds: ['pos-003', 'pos-012'],
      badgeColor: 'success',
      icon: 'ti-speakerphone',
      badgeText: '<i class="ti ti-bolt" aria-hidden="true"></i> x1.5 נקודות!',
      accentColor: '#00B894'
    },
    {
      id: 'camp-003',
      name: 'שבוע הבונוסים',
      description: 'כל הפניה שווה בונוס! לא משנה לאיזו משרה.',
      multiplier: 1.5,
      eligibleDepartments: [], // All departments
      eligiblePositionIds: [], // All positions
      badgeColor: 'warning',
      icon: 'ti-stars',
      badgeText: '<i class="ti ti-sparkles" aria-hidden="true"></i> בונוס מיוחד!',
      accentColor: '#F39C12'
    }
  ];
  
  // Generate campaigns with dynamic dates
  const campaigns = campaignTemplates.map(template => {
    // Start date: 5-15 days ago
    const startDaysAgo = Math.floor(random() * 10) + 5;
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - startDaysAgo);
    startDate.setHours(0, 0, 0, 0);
    
    // End date: 7-30 days in the future (AC5 requirement)
    const endDaysFromNow = Math.floor(random() * 23) + 7;
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + endDaysFromNow);
    endDate.setHours(23, 59, 59, 999);
    
    return {
      ...template,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isActive: true,
      // Helper for countdown display
      daysRemaining: endDaysFromNow,
      // Helper for eligible position count
      positionCount: template.eligiblePositionIds.length || MOCK_POSITIONS.length
    };
  });
  
  // Always return at least 1 campaign, sometimes 2 (AC5)
  const numActive = random() > 0.3 ? 2 : 1;
  
  // Shuffle and return the selected campaigns
  const shuffled = campaigns.sort(() => random() - 0.5);
  return shuffled.slice(0, numActive);
}

// ============================================
// FORMATTING UTILITIES
// ============================================

/**
 * Formats a number as points string
 * @param {number} points - Points value
 * @returns {string} Formatted points string
 */
export function formatPoints(points) {
  return new Intl.NumberFormat('he-IL').format(points || 0);
}

/**
 * Formats points for RTL display
 * @param {number} points - Points value
 * @returns {string} Formatted points string for RTL
 */
export function formatPointsRTL(points) {
  return formatPoints(points);
}

/**
 * Formats points delta with sign
 * @param {number} delta - Points delta (can be negative)
 * @returns {string} Formatted delta string with +/- sign
 */
export function formatPointsDelta(delta) {
  if (delta > 0) {
    return `+${formatPoints(delta)}`;
  }
  return formatPoints(delta);
}

/**
 * Formats a date string in Hebrew format
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
  const dateObj = date instanceof Date ? date : new Date(date);
  const defaultOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  return dateObj.toLocaleDateString('he-IL', { ...defaultOptions, ...options });
}

/**
 * Alias for formatRelativeTime (backward compatibility)
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Relative time in Hebrew
 */
export function timeAgo(timestamp) {
  return formatRelativeTime(timestamp);
}

/**
 * Gets Hebrew month name from a date
 * @param {string|Date} date - Date to get month from
 * @returns {string} Hebrew month name
 */
export function getHebrewMonthName(date) {
  const dateObj = date instanceof Date ? date : new Date(date);
  const months = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];
  return months[dateObj.getMonth()];
}

/**
 * Alias for generateMockStamps (backward compatibility)
 * @param {Function} random - Seeded random function
 * @param {Array} referrals - User's referrals array
 * @param {string} joinDate - User's join date
 * @returns {Array} Array of stamp objects
 */
export function generateDemoStamps(random, referrals, joinDate) {
  return generateMockStamps(random, referrals, joinDate);
}

/**
 * Generates referral statistics from referrals array
 * @param {Array} referrals - User's referrals
 * @returns {Object} Statistics object
 */
export function generateReferralStats(referrals) {
  const total = referrals.length;
  const hired = referrals.filter(r => r.status === 'hired').length;
  const inProgress = referrals.filter(r => 
    !['hired', 'rejected'].includes(r.status)
  ).length;
  const rejected = referrals.filter(r => r.status === 'rejected').length;
  
  return {
    total,
    hired,
    inProgress,
    rejected,
    successRate: total > 0 ? Math.round((hired / total) * 100) : 0
  };
}

/**
 * Alias for generateActivitiesFromReferrals (backward compatibility)
 * @param {Array} referrals - User's referrals
 * @param {Function} random - Seeded random function
 * @returns {Array} Activity items sorted by timestamp
 */
export function generateActivityFeed(referrals, random) {
  return generateActivitiesFromReferrals(referrals, random);
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Generates a complete user object from email using seeded random (Story 6.5 AC1)
 * Same email always produces identical user data (deterministic)
 * Uses the REAL name from the email (not generated Hebrew names)
 * @param {string} email - User email (e.g., firstname.lastname@passportcard.co.il)
 * @returns {Object} Generated user object with referrals, stamps, activities
 */
export function generateUserFromEmail(email) {
  const random = seededRandom(email);
  
  // Parse email to extract name parts
  const [namePart] = email.split('@');
  const nameParts = namePart.split('.');
  const rawFirstName = nameParts[0] || '';
  const rawLastName = nameParts[1] || '';
  
  // Translate first name to Hebrew if mapping exists, otherwise use capitalized English
  // Example: ben.akiva@company.com → "בן עקיבא" (if mappings exist)
  const hebrewFirstName = getHebrewFirstName(rawFirstName, random);
  const hebrewLastName = getHebrewSurname(rawLastName, random);
  const firstName = hebrewFirstName;
  const lastName = hebrewLastName;
  const fullName = lastName ? `${firstName} ${lastName}` : firstName;
  
  // Generate join date: 1-3 years ago (AC1)
  const joinDate = generateJoinDate(random);
  const tenureMonths = getMonthsSince(joinDate);
  
  // Generate department (AC1)
  const department = DEPARTMENTS[Math.floor(random() * DEPARTMENTS.length)];
  
  // Generate mock referrals (3-8 per user, AC1)
  const referralCount = Math.floor(random() * 6) + 3;
  const referrals = generateMockReferrals(random, referralCount, joinDate);
  
  // Generate stamps from referral history (5-15 stamps, AC1)
  const stamps = generateMockStamps(random, referrals, joinDate);
  
  // Calculate total points from stamps (AC1 - points come from stamps)
  const totalPoints = stamps.reduce((sum, stamp) => sum + (stamp.points || 0), 0);
  
  // Get level info based on calculated points
  const levelInfo = calculateLevelInfo(totalPoints);
  
  // Generate activities from referrals
  const activities = generateActivitiesFromReferrals(referrals, random);
  
  // Generate campaigns (Story 2.4)
  const campaigns = generateMockCampaigns(random);
  
  // Generate user ID (deterministic from email)
  const userId = `usr-${Math.floor(random() * 10000).toString().padStart(4, '0')}`;
  
  return {
    id: userId,
    email: email,
    firstName: firstName,
    lastName: lastName,
    fullName: fullName,
    department: department,
    points: totalPoints,
    level: levelInfo.name,
    levelInfo: levelInfo,
    joinDate: joinDate,
    avatarInitial: firstName[0] || '?',
    referrals: referrals,
    stamps: stamps,
    activities: activities,
    campaigns: campaigns,
    preferences: {
      notifications: true
    }
  };
}
