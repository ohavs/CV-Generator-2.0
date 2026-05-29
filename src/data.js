// Demo data + state defaults + i18n strings
// Two languages: 'he' (Hebrew RTL), 'en' (English LTR)

export const I18N = {
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
      hobbies: 'תחביבים',
      links: 'קישורים',
      awards: 'פרסים והישגים',
      volunteering: 'התנדבות',
      publications: 'פרסומים',
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
      apiKey: 'Anthropic API Key',
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
      hobbies: 'Hobbies',
      links: 'Links',
      awards: 'Awards',
      volunteering: 'Volunteering',
      publications: 'Publications',
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
      apiKey: 'Anthropic API Key',
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
export const TEMPLATES = [
  { id: 'classic',    name: { he: 'קלאסי',     en: 'Classic'     } },
  { id: 'minimal',   name: { he: 'מינימלי',    en: 'Minimal'     } },
  { id: 'sidebar',   name: { he: 'דו-טורי',    en: 'Two-column'  } },
  { id: 'nordic',    name: { he: 'נורדי',      en: 'Nordic'      } },
  { id: 'executive', name: { he: 'אקזקיוטיב',  en: 'Executive'   } },
  { id: 'stripe',    name: { he: 'סטרייפ',     en: 'Stripe'      } },
  { id: 'bold',      name: { he: 'בולד',       en: 'Bold'        } },
  { id: 'technical', name: { he: 'טכני',       en: 'Technical'   } },
  { id: 'academic',  name: { he: 'אקדמי',      en: 'Academic'    } },
  { id: 'editorial', name: { he: 'מערכת',      en: 'Editorial'   } },
  { id: 'breeze',    name: { he: 'ברייז',      en: 'Breeze'      } },
  { id: 'split',     name: { he: 'ספליט',      en: 'Split'       } },
  { id: 'verse',     name: { he: 'ורס',         en: 'Verse'       } },
  { id: 'compact',   name: { he: 'קומפקט',     en: 'Compact'     } },
  { id: 'charter',   name: { he: 'צ׳רטר',      en: 'Charter'     } },
];

export const ACCENT_PALETTE = [
  '#A8542C', // terracotta (default)
  '#1F1B16', // ink
  '#2D5A4A', // forest
  '#3A5694', // indigo
  '#7B3F5D', // plum
  '#A88934', // ochre
  '#B8533F', // rust
  '#4E5159', // graphite
];

export const FONT_PRESETS = [
  {
    id: 'newsreader',
    name: { he: 'ניוזרידר', en: 'Newsreader' },
    heading: "'Newsreader', 'Frank Ruhl Libre', Georgia, serif",
    body: "'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'playfair',
    name: { he: 'פלייפייר', en: 'Playfair Display' },
    heading: "'Playfair Display', 'Frank Ruhl Libre', Georgia, serif",
    body: "'Heebo', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'lora',
    name: { he: 'לורה', en: 'Lora' },
    heading: "'Lora', 'Frank Ruhl Libre', Georgia, serif",
    body: "'DM Sans', 'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'instrument',
    name: { he: 'אינסטרומנט', en: 'Instrument Serif' },
    heading: "'Instrument Serif', 'Frank Ruhl Libre', Georgia, serif",
    body: "'Inter Tight', 'Heebo', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'garamond',
    name: { he: 'גרמונד', en: 'EB Garamond' },
    heading: "'EB Garamond', 'Frank Ruhl Libre', Georgia, serif",
    body: "'IBM Plex Sans', 'IBM Plex Sans Hebrew', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'heebo',
    name: { he: 'היבו', en: 'Heebo' },
    heading: "'Heebo', system-ui, sans-serif",
    body: "'Heebo', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'poppins',
    name: { he: 'פופינס', en: 'Poppins' },
    heading: "'Poppins', 'Heebo', system-ui, sans-serif",
    body: "'Poppins', 'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'raleway',
    name: { he: 'ראלווי', en: 'Raleway' },
    heading: "'Raleway', 'Heebo', system-ui, sans-serif",
    body: "'DM Sans', 'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'dm-sans',
    name: { he: 'DM סנס', en: 'DM Sans' },
    heading: "'DM Sans', 'Heebo', system-ui, sans-serif",
    body: "'DM Sans', 'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'mono',
    name: { he: 'מונוספייס', en: 'Monospace' },
    heading: "'JetBrains Mono', monospace",
    body: "'JetBrains Mono', monospace",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },

  /* ---- Local custom fonts (fonts.css) ---- */
  {
    id: 'galil',
    name: { he: 'גליל', en: 'Galil' },
    heading: "'Galil', 'Frank Ruhl Libre', sans-serif",
    body: "'Galil', 'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'proxima-nova-hebrew',
    name: { he: 'פרוקסימה נובה', en: 'Proxima Nova Hebrew' },
    heading: "'Proxima Nova Hebrew', 'Heebo', sans-serif",
    body: "'Proxima Nova Hebrew', 'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'discovery',
    name: { he: 'דיסקברי', en: 'Discovery' },
    heading: "'Discovery', 'Heebo', sans-serif",
    body: "'Discovery', 'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'primaries',
    name: { he: 'פריימריז', en: 'Primaries' },
    heading: "'Primaries', 'Heebo', sans-serif",
    body: "'Primaries', 'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'taamula',
    name: { he: 'תעמולה', en: 'Taamula' },
    heading: "'Taamula', 'Heebo', sans-serif",
    body: "'Taamula', 'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'bamberger',
    name: { he: 'במברגר', en: 'Bamberger' },
    heading: "'Bamberger', 'Heebo', sans-serif",
    body: "'Bamberger', 'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'leon',
    name: { he: 'ליאון', en: 'Leon' },
    heading: "'Leon', 'Heebo', sans-serif",
    body: "'Leon', 'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'lia-kaha',
    name: { he: 'ליה כהה', en: 'Lia Kaha' },
    heading: "'Lia Kaha', 'Heebo', sans-serif",
    body: "'Lia Kaha', 'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'duckas',
    name: { he: 'דאקאס', en: 'Duckas' },
    heading: "'Duckas', 'Heebo', sans-serif",
    body: "'Duckas', 'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'trampolina',
    name: { he: 'טרמפולינה', en: 'Trampolina' },
    heading: "'Trampolina', 'Heebo', sans-serif",
    body: "'Trampolina', 'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'placebo',
    name: { he: 'פלצבו', en: 'Placebo' },
    heading: "'Placebo', 'Heebo', sans-serif",
    body: "'Placebo', 'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'babav',
    name: { he: 'בבב', en: 'Babav' },
    heading: "'Babav', 'Heebo', sans-serif",
    body: "'Babav', 'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'zvulun',
    name: { he: 'זבולון', en: 'Zvulun' },
    heading: "'Zvulun', 'Heebo', sans-serif",
    body: "'Zvulun', 'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'krisperv',
    name: { he: 'קריספרב', en: 'Krisperv' },
    heading: "'Krisperv', 'Heebo', sans-serif",
    body: "'Krisperv', 'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'motaleh',
    name: { he: 'מוטלה', en: 'Motaleh' },
    heading: "'Motaleh', 'Heebo', sans-serif",
    body: "'Motaleh', 'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'ravitzky',
    name: { he: 'רביצקי', en: 'Ravitzky' },
    heading: "'Ravitzky', 'Heebo', sans-serif",
    body: "'Ravitzky', 'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'rag-marom-poster',
    name: { he: 'רג מרום פוסטר', en: 'Rag Marom Poster' },
    heading: "'Rag Marom Poster', 'Heebo', sans-serif",
    body: "'Rag Marom Poster', 'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
  {
    id: 'shilgiya',
    name: { he: 'שלגיה', en: 'Shilgiya' },
    heading: "'Shilgiya', 'Heebo', sans-serif",
    body: "'Shilgiya', 'Assistant', system-ui, sans-serif",
    sample: { he: 'אבגד Aa', en: 'Aa אבגד' },
  },
];

// Default modular sections (order + visibility)
export const DEFAULT_SECTIONS = [
  { id: 'personal', visible: true },
  { id: 'summary', visible: true },
  { id: 'experience', visible: true },
  { id: 'education', visible: true },
  { id: 'skills', visible: true },
  { id: 'projects', visible: true },
  { id: 'languages', visible: true },
  { id: 'certifications', visible: false },
  { id: 'hobbies', visible: false },
  { id: 'awards', visible: false },
  { id: 'volunteering', visible: false },
  { id: 'publications', visible: false },
];

// Demo data — fictional person, dual-language
export const DEMO_DATA = {
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
    awards: [
      { name: 'פרס עיצוב השנה', issuer: 'איגוד מעצבי ישראל', date: '2023', description: '' },
    ],
    volunteering: [
      { role: 'מנטורית עיצוב', org: 'Mindset IL', start: '2022-01', end: '', description: 'ליווי מעצבים מתחילים בתהליך מציאת עבודה ובניית תיק עבודות.' },
    ],
    publications: [
      { title: 'מערכות עיצוב בסטארטאפים — לקחים מהשטח', venue: 'UX Collective', date: '2023', description: '' },
    ],
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
        description: "A mobile reader that respects the reader's pace. Awwwards Site of the Day, 2024.",
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
    awards: [
      { name: 'Designer of the Year', issuer: 'Israel Design Association', date: '2023', description: '' },
    ],
    volunteering: [
      { role: 'Design Mentor', org: 'Mindset IL', start: '2022-01', end: '', description: 'Coaching early-career designers through job search and portfolio building.' },
    ],
    publications: [
      { title: 'Design Systems in Startups — Lessons from the Field', venue: 'UX Collective', date: '2023', description: '' },
    ],
  },
};

export const DEFAULT_STATE = {
  language: 'he',
  template: 'classic',
  accent: ACCENT_PALETTE[0],
  fontPreset: 'newsreader',
  fontScale: 1.0,
  darkEdit: false,
  sections: DEFAULT_SECTIONS,
  data: DEMO_DATA,
};

export function formatRange(start, end, lang) {
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
}
