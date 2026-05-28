// Demo data + state defaults + i18n strings
// Two languages: 'he' (Hebrew RTL), 'en' (English LTR)

const I18N = {
  he: {
    appName: 'קוֹרוֹת',
    appSub: 'מחולל קורות חיים',
    tabs: { content: 'תוכן', design: 'עיצוב', sections: 'מקטעים' },
    sections: {
      personal: 'פרטים אישיים',
      summary: 'תקציר',
      experience: 'ניסיון תעסוקתי',
      education: 'השכלה',
      skills: 'כישורים',
      languages: 'שפות',
      projects: 'פרויקטים',
      certifications: 'תעודות והסמכות',
      hobbies: 'תחביבים והתנדבות',
      links: 'קישורים',
    },
    labels: {
      template: 'תבנית',
      accent: 'צבע מרכזי',
      font: 'טיפוגרפיה',
      darkMode: 'מצב כהה לעריכה',
      language: 'שפת ממשק',
      direction: 'כיוון מסמך',
      addSection: 'הוסף מקטע',
      addItem: 'הוסף',
      delete: 'מחק',
      export: 'הורד PDF',
      ai: 'שיפור AI',
      aiTooltip: 'שכתב עם AI',
      summaryPlaceholder: 'כתבו תקציר קצר על עצמכם...',
      bulletPlaceholder: 'תיאור הישג או תחום אחריות...',
      saving: 'שומר',
      saved: 'נשמר',
      preview: 'תצוגה מקדימה',
      edit: 'עריכה',
      pageOf: 'עמוד',
      zoomFit: 'התאם',
      empty: 'אין מקטעים מוצגים — בחרו במקטעים מצד שמאל',
    },
    months: {
      jan: 'ינואר', feb: 'פברואר', mar: 'מרץ', apr: 'אפריל',
      may: 'מאי', jun: 'יוני', jul: 'יולי', aug: 'אוגוסט',
      sep: 'ספטמבר', oct: 'אוקטובר', nov: 'נובמבר', dec: 'דצמבר',
      present: 'היום',
    },
  },
  en: {
    appName: 'koroth',
    appSub: 'CV builder',
    tabs: { content: 'Content', design: 'Design', sections: 'Sections' },
    sections: {
      personal: 'Personal',
      summary: 'Summary',
      experience: 'Experience',
      education: 'Education',
      skills: 'Skills',
      languages: 'Languages',
      projects: 'Projects',
      certifications: 'Certifications',
      hobbies: 'Hobbies & Volunteering',
      links: 'Links',
    },
    labels: {
      template: 'Template',
      accent: 'Accent color',
      font: 'Typography',
      darkMode: 'Dark edit mode',
      language: 'Interface',
      direction: 'Document direction',
      addSection: 'Add section',
      addItem: 'Add',
      delete: 'Delete',
      export: 'Export PDF',
      ai: 'AI polish',
      aiTooltip: 'Rewrite with AI',
      summaryPlaceholder: 'Write a short summary about yourself...',
      bulletPlaceholder: 'Describe an achievement or responsibility...',
      saving: 'Saving',
      saved: 'Saved',
      preview: 'Preview',
      edit: 'Edit',
      pageOf: 'page',
      zoomFit: 'Fit',
      empty: 'No sections visible — pick some on the left',
    },
    months: {
      jan: 'Jan', feb: 'Feb', mar: 'Mar', apr: 'Apr',
      may: 'May', jun: 'Jun', jul: 'Jul', aug: 'Aug',
      sep: 'Sep', oct: 'Oct', nov: 'Nov', dec: 'Dec',
      present: 'Present',
    },
  },
};

// Available templates
const TEMPLATES = [
  { id: 'classic', name: { he: 'קלאסי', en: 'Classic' } },
  { id: 'minimal', name: { he: 'מינימלי', en: 'Minimal' } },
  { id: 'sidebar', name: { he: 'דו-טורי', en: 'Two-column' } },
  { id: 'technical', name: { he: 'טכני', en: 'Technical' } },
  { id: 'academic', name: { he: 'אקדמי', en: 'Academic' } },
  { id: 'editorial', name: { he: 'מערכת', en: 'Editorial' } },
];

const ACCENT_PALETTE = [
  '#A8542C', // terracotta (default)
  '#1F1B16', // ink
  '#2D5A4A', // forest
  '#3A5694', // indigo
  '#7B3F5D', // plum
  '#A88934', // ochre
  '#B8533F', // rust
  '#4E5159', // graphite
];

const FONT_PRESETS = [
  {
    id: 'newsreader',
    name: { he: 'ניוזרידר', en: 'Newsreader' },
    heading: "'Newsreader', 'Frank Ruhl Libre', Georgia, serif",
    body: "'Assistant', 'Geist', system-ui, sans-serif",
  },
  {
    id: 'instrument',
    name: { he: 'אינסטרומנט', en: 'Instrument' },
    heading: "'Instrument Serif', 'David Libre', Georgia, serif",
    body: "'Inter Tight', 'Heebo', system-ui, sans-serif",
  },
  {
    id: 'serif-bold',
    name: { he: 'EB גרמונד', en: 'EB Garamond' },
    heading: "'EB Garamond', 'Frank Ruhl Libre', Georgia, serif",
    body: "'IBM Plex Sans', 'Assistant', system-ui, sans-serif",
  },
  {
    id: 'sans-modern',
    name: { he: 'סנס מודרני', en: 'Modern sans' },
    heading: "'Inter Tight', 'Heebo', system-ui, sans-serif",
    body: "'Inter Tight', 'Heebo', system-ui, sans-serif",
  },
  {
    id: 'mono',
    name: { he: 'מונוספייס', en: 'Monospace' },
    heading: "'JetBrains Mono', 'Miriam Mono CLM', monospace",
    body: "'JetBrains Mono', 'Miriam Mono CLM', monospace",
  },
];

// Default modular sections (order + visibility)
const DEFAULT_SECTIONS = [
  { id: 'personal', visible: true },
  { id: 'summary', visible: true },
  { id: 'experience', visible: true },
  { id: 'education', visible: true },
  { id: 'skills', visible: true },
  { id: 'projects', visible: true },
  { id: 'languages', visible: true },
  { id: 'certifications', visible: true },
  { id: 'hobbies', visible: false },
];

// Demo data — fictional person, dual-language
const DEMO_DATA = {
  he: {
    personal: {
      name: 'מאיה כהן',
      title: 'מעצבת מוצר בכירה',
      email: 'maya.cohen@gmail.com',
      phone: '+972 52-123-4567',
      location: 'תל אביב, ישראל',
      photo: '',
      links: [
        { label: 'LinkedIn', url: 'linkedin.com/in/mayacohen', icon: 'linkedin' },
        { label: 'Portfolio', url: 'mayacohen.design', icon: 'globe' },
        { label: 'GitHub', url: 'github.com/mayacohen', icon: 'github' },
      ],
    },
    summary: 'מעצבת מוצר עם 8 שנות ניסיון בעיצוב חוויות דיגיטליות לסטארטאפים בשלבי צמיחה. מובילה תהליכי עיצוב מקצה לקצה — מחקר משתמשים, אסטרטגיה, פרוטוטייפינג ועד שיתוף פעולה עם מהנדסים. אוהבת מערכות עיצוב, טיפוגרפיה ומיקרו-אינטראקציות שמרגישות פשוט נכון.',
    experience: [
      {
        company: 'Lumen Health',
        role: 'מעצבת מוצר בכירה',
        location: 'תל אביב',
        start: '2023-03', end: '',
        bullets: [
          'הובלתי redesign של ה-onboarding שהעלה את שיעור ההמרה מ-34% ל-58% תוך שלושה חודשים.',
          'בניתי מערכת עיצוב שמשרתת 4 מוצרים, הפחיתה זמן פיתוח של מסכים חדשים ב-40%.',
          'מנחה צוות של 3 מעצבים, מובילה ביקורות עיצוב שבועיות ותכנון רוחבי.',
        ],
      },
      {
        company: 'Wavelet',
        role: 'מעצבת מוצר',
        location: 'תל אביב',
        start: '2020-08', end: '2023-02',
        bullets: [
          'עיצבתי את ה-dashboard הראשי של המוצר, ששימש מעל 12,000 משתמשים פעילים.',
          'הקמתי תהליך מחקר משתמשים סדור — מראיונות שבועיים ועד נהלי בדיקת שמישות.',
          'שיתפתי פעולה עם צוות הפיתוח על מערכת קומפוננטות ב-React + Figma.',
        ],
      },
      {
        company: 'Studio Bara',
        role: 'מעצבת UI/UX',
        location: 'תל אביב',
        start: '2018-01', end: '2020-07',
        bullets: [
          'הובלתי פרויקטי לקוח עבור 14 מותגים בתחומי e-commerce ופינטק.',
          'יצירת ספריית טיפוגרפיה ייעודית לעברית שמשמשת את הסטודיו עד היום.',
        ],
      },
    ],
    education: [
      {
        school: 'בצלאל — אקדמיה לאמנות ועיצוב',
        degree: 'B.Des בעיצוב תקשורת חזותית',
        location: 'ירושלים',
        start: '2014-10', end: '2018-06',
        description: 'התמחות בעיצוב אינטראקציה. פרויקט גמר: "ספרייה של ניואנסים" — מערכת עיצוב לעברית דיגיטלית.',
      },
    ],
    skills: [
      { category: 'עיצוב', items: ['Figma', 'מערכות עיצוב', 'פרוטוטייפינג', 'מחקר משתמשים', 'אינטראקציה'] },
      { category: 'פיתוח', items: ['HTML / CSS', 'React (בסיסי)', 'SVG ואנימציה'] },
      { category: 'טיפוגרפיה', items: ['עברית דיגיטלית', 'בחירת פונטים', 'היררכיה'] },
    ],
    projects: [
      {
        name: 'Mishmar — קריאת חדשות איטית',
        description: 'אפליקציית מובייל לקריאת חדשות בקצב שמכבד את הקורא. בחירת זוכת פרס בעיצוב Awwwards 2024.',
        tech: 'Figma · Lottie · iOS',
        link: 'mishmar.app',
      },
      {
        name: 'KeshetType',
        description: 'משפחת פונטים פתוחה לעברית — שבעה משקלים, תמיכה מלאה ב-OpenType.',
        tech: 'Glyphs · Pública',
        link: 'github.com/keshettype',
      },
    ],
    languages: [
      { name: 'עברית', level: 'שפת אם', dots: 5 },
      { name: 'אנגלית', level: 'שוטף', dots: 5 },
      { name: 'ספרדית', level: 'בינוני', dots: 3 },
      { name: 'ערבית', level: 'בסיסי', dots: 2 },
    ],
    certifications: [
      { name: 'Interaction Design Foundation — UX Research', issuer: 'IDF', date: '2022' },
      { name: 'Type@Cooper — קורס טיפוגרפיה למתקדמים', issuer: 'Cooper Union', date: '2021' },
    ],
    hobbies: 'אופניים ארוכי טווח · ספרי מסעות · קליגרפיה עברית · קפה נוסטלגי',
  },

  en: {
    personal: {
      name: 'Maya Cohen',
      title: 'Senior Product Designer',
      email: 'maya.cohen@gmail.com',
      phone: '+972 52-123-4567',
      location: 'Tel Aviv, Israel',
      photo: '',
      links: [
        { label: 'LinkedIn', url: 'linkedin.com/in/mayacohen', icon: 'linkedin' },
        { label: 'Portfolio', url: 'mayacohen.design', icon: 'globe' },
        { label: 'GitHub', url: 'github.com/mayacohen', icon: 'github' },
      ],
    },
    summary: 'Product designer with 8 years of experience crafting digital experiences for growth-stage startups. I lead design end-to-end — from user research and strategy to prototyping and shipping with engineers. I love design systems, typography, and micro-interactions that feel just right.',
    experience: [
      {
        company: 'Lumen Health',
        role: 'Senior Product Designer',
        location: 'Tel Aviv',
        start: '2023-03', end: '',
        bullets: [
          'Led an onboarding redesign that lifted conversion from 34% to 58% in three months.',
          'Built a design system spanning 4 products, cutting new-screen build time by 40%.',
          'Mentor a team of 3 designers, run weekly design reviews and cross-team planning.',
        ],
      },
      {
        company: 'Wavelet',
        role: 'Product Designer',
        location: 'Tel Aviv',
        start: '2020-08', end: '2023-02',
        bullets: [
          'Designed the core dashboard used by 12,000+ active users.',
          'Established a research practice — weekly interviews to usability protocols.',
          'Partnered with engineering on a React + Figma component library.',
        ],
      },
      {
        company: 'Studio Bara',
        role: 'UI/UX Designer',
        location: 'Tel Aviv',
        start: '2018-01', end: '2020-07',
        bullets: [
          'Led client work for 14 brands across e-commerce and fintech.',
          'Built a Hebrew typography library still used by the studio today.',
        ],
      },
    ],
    education: [
      {
        school: 'Bezalel Academy of Arts and Design',
        degree: 'B.Des in Visual Communication',
        location: 'Jerusalem',
        start: '2014-10', end: '2018-06',
        description: 'Specialized in interaction design. Thesis: "Library of Nuance" — a design system for digital Hebrew.',
      },
    ],
    skills: [
      { category: 'Design', items: ['Figma', 'Design systems', 'Prototyping', 'User research', 'Interaction'] },
      { category: 'Engineering', items: ['HTML / CSS', 'React (basic)', 'SVG & animation'] },
      { category: 'Typography', items: ['Digital Hebrew', 'Type selection', 'Hierarchy'] },
    ],
    projects: [
      {
        name: 'Mishmar — slow news reading',
        description: 'A mobile reader that respects the reader\u2019s pace. Awwwards Site of the Day, 2024.',
        tech: 'Figma · Lottie · iOS',
        link: 'mishmar.app',
      },
      {
        name: 'KeshetType',
        description: 'An open Hebrew type family — seven weights with full OpenType support.',
        tech: 'Glyphs · Pública',
        link: 'github.com/keshettype',
      },
    ],
    languages: [
      { name: 'Hebrew', level: 'Native', dots: 5 },
      { name: 'English', level: 'Fluent', dots: 5 },
      { name: 'Spanish', level: 'Intermediate', dots: 3 },
      { name: 'Arabic', level: 'Basic', dots: 2 },
    ],
    certifications: [
      { name: 'Interaction Design Foundation — UX Research', issuer: 'IDF', date: '2022' },
      { name: 'Type@Cooper — Advanced Typography', issuer: 'Cooper Union', date: '2021' },
    ],
    hobbies: 'Long-distance cycling · Travel writing · Hebrew calligraphy · Specialty coffee',
  },
};

const DEFAULT_STATE = {
  language: 'he',
  template: 'classic',
  accent: ACCENT_PALETTE[0],
  fontPreset: 'newsreader',
  darkEdit: false,
  sections: DEFAULT_SECTIONS,
  data: DEMO_DATA, // both languages
};

window.CV_I18N = I18N;
window.CV_TEMPLATES = TEMPLATES;
window.CV_ACCENT_PALETTE = ACCENT_PALETTE;
window.CV_FONT_PRESETS = FONT_PRESETS;
window.CV_DEFAULT_SECTIONS = DEFAULT_SECTIONS;
window.CV_DEMO_DATA = DEMO_DATA;
window.CV_DEFAULT_STATE = DEFAULT_STATE;

// helpers
window.formatRange = function(start, end, lang) {
  const monthsByIdx = lang === 'he'
    ? ['ינו׳','פבר׳','מרץ','אפר׳','מאי','יוני','יולי','אוג׳','ספט׳','אוק׳','נוב׳','דצמ׳']
    : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fmt = (ym) => {
    if (!ym) return '';
    const [y, m] = ym.split('-');
    return `${monthsByIdx[Math.max(0, Math.min(11, parseInt(m, 10) - 1))]} ${y}`;
  };
  const present = lang === 'he' ? 'היום' : 'Present';
  const s = fmt(start);
  const e = end ? fmt(end) : present;
  if (!s && !e) return '';
  if (!s) return e;
  return `${s} — ${e}`;
};
