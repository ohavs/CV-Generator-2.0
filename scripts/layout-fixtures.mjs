// Content variants the layout checker pushes through every template. Each one
// aims at a different way a template can break: realistic content, every
// single-line field at an awkward length, far more content than fits a page,
// and almost nothing at all.
import { DEMO_DATA, DEFAULT_SECTIONS } from '../src/data.js';

const clone = (o) => JSON.parse(JSON.stringify(o));

// A 1×1 photo is enough to make every template draw its photo box.
export const PHOTO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

export const ALL_SECTIONS = DEFAULT_SECTIONS.map(s => ({ ...s, visible: true }));

const LONG = {
  he: {
    name: 'אלכסנדרה-מרגריטה בן-שושן וולפנזון',
    title: 'ראש צוות פיתוח מוצר ומובילת אסטרטגיית חוויית משתמש',
    email: 'alexandra.benshoshan.wolfensohn@longcompanydomain.co.il',
    location: 'קריית ביאליק, מחוז חיפה, ישראל',
    company: 'Lumen Health Technologies International',
    role: 'מנהלת מוצר בכירה ומובילת צוות עיצוב רב-תחומי',
    place: 'רמת השרון והמרכז',
    school: 'הטכניון — מכון טכנולוגי לישראל, הפקולטה להנדסת תעשייה וניהול',
    degree: 'תואר שני במדעי הנתונים ובהנדסת תעשייה וניהול',
    category: 'פיתוח צד שרת ותשתיות ענן',
    url: 'linkedin.com/in/alexandra-margarita-benshoshan-wolfensohn',
    token: 'github.com/alexandra/very-long-repository-name-without-any-breaks',
    bullet: 'הובלתי מעבר של מערכת הליבה לארכיטקטורת מיקרו-שירותים בענן, תוך תיאום בין שישה צוותים וצמצום זמני תגובה ב-63% ועלויות תשתית ב-41%.',
    level: 'שפת אם — כתיבה ודיבור ברמה מקצועית',
  },
  en: {
    name: 'Alexandra-Margarita Ben-Shoshan Wolfensohn',
    title: 'Head of Product Development and User Experience Strategy',
    email: 'alexandra.benshoshan.wolfensohn@longcompanydomain.co.il',
    location: 'Kiryat Bialik, Haifa District, Israel',
    company: 'Lumen Health Technologies International',
    role: 'Senior Product Manager and Multidisciplinary Design Lead',
    place: 'Ramat HaSharon and Center',
    school: 'Technion — Israel Institute of Technology, Faculty of Industrial Engineering',
    degree: 'M.Sc. in Data Science and Industrial Engineering & Management',
    category: 'Backend & Cloud Infrastructure',
    url: 'linkedin.com/in/alexandra-margarita-benshoshan-wolfensohn',
    token: 'github.com/alexandra/very-long-repository-name-without-any-breaks',
    bullet: 'Led the migration of the core platform to a cloud micro-services architecture, coordinating six teams and cutting response times by 63% and infrastructure costs by 41%.',
    level: 'Native — professional writing and speaking',
  },
};

// Demo content, but every single-line field is long. This is the realistic
// edge: a page that still fits at 100%, with rows that must wrap gracefully.
function long(lang) {
  const d = clone(DEMO_DATA[lang]);
  const L = LONG[lang];
  Object.assign(d.personal, { name: L.name, title: L.title, email: L.email, location: L.location, photo: PHOTO });
  d.personal.links = d.personal.links.map(l => ({ ...l, url: L.url }));
  d.experience = d.experience.map((j, i) => ({
    ...j,
    company: i === 0 ? L.company : j.company,
    role: i === 0 ? L.role : j.role,
    location: L.place,
    bullets: i === 1 ? [...j.bullets.slice(0, 2), `${j.bullets[2]} ${L.token}`] : j.bullets,
  }));
  d.education = d.education.map(e => ({ ...e, school: L.school, degree: L.degree }));
  d.skills = d.skills.map((s, i) => (i === 0 ? { ...s, category: L.category } : s));
  d.projects = d.projects.map((p, i) => (i === 0 ? { ...p, link: L.token } : p));
  d.languages = d.languages.map((l, i) => (i === 0 ? { ...l, level: L.level } : l));
  return d;
}

// Far more than a page: forces AutoFit to shrink, and stacks every section.
function stress(lang) {
  const d = long(lang);
  const L = LONG[lang];
  d.summary = `${d.summary} ${d.summary} ${d.summary}`;
  const jobs = [...d.experience, ...clone(d.experience)];
  d.experience = jobs.map(j => ({ ...j, bullets: [...j.bullets, L.bullet, L.bullet] }));
  d.education = [...d.education, ...clone(d.education)];
  d.skills = [...d.skills, ...d.skills.map(s => ({ ...s, items: [...s.items, ...s.items] }))];
  d.projects = [...d.projects, ...clone(d.projects)];
  d.languages = [...d.languages, ...clone(d.languages)];
  d.certifications = [...d.certifications, ...clone(d.certifications)];
  d.awards = [...d.awards, { ...d.awards[0], description: L.bullet }];
  d.volunteering = [...d.volunteering, ...clone(d.volunteering)];
  d.publications = [...d.publications, { ...d.publications[0], description: L.bullet }];
  d.hobbies = `${d.hobbies} · ${d.hobbies}`;
  return d;
}

// Almost nothing: sections with no entries must not collapse into each other.
function sparse(lang) {
  const d = clone(DEMO_DATA[lang]);
  d.summary = '';
  d.experience = [{ company: '', role: d.experience[0].role, location: '', start: '2023-03', end: '', bullets: [d.experience[0].bullets[0]] }];
  d.education = [];
  d.projects = [];
  d.personal.links = [];
  return d;
}

export const VARIANTS = {
  demo: (lang) => ({ data: clone(DEMO_DATA[lang]), sections: ALL_SECTIONS }),
  long: (lang) => ({ data: long(lang), sections: ALL_SECTIONS }),
  stress: (lang) => ({ data: stress(lang), sections: ALL_SECTIONS }),
  sparse: (lang) => ({ data: sparse(lang), sections: DEFAULT_SECTIONS }),
};
