// Ready-made content: professional phrasings the user can insert and then
// tweak inline. Hebrew uses first-person past tense, which is gender-neutral.
// Square-bracket tokens ([X], [מוצר]…) mark the spots to personalize.

export const CONTENT_DOMAINS = [
  { id: 'dev',       he: 'פיתוח תוכנה',        en: 'Software' },
  { id: 'design',    he: 'עיצוב',              en: 'Design' },
  { id: 'product',   he: 'ניהול מוצר',         en: 'Product' },
  { id: 'marketing', he: 'שיווק',              en: 'Marketing' },
  { id: 'sales',     he: 'מכירות',             en: 'Sales' },
  { id: 'finance',   he: 'פיננסים',            en: 'Finance' },
  { id: 'ops',       he: 'תפעול ואדמין',       en: 'Operations' },
  { id: 'service',   he: 'שירות לקוחות',       en: 'Support' },
  { id: 'education', he: 'הוראה והדרכה',       en: 'Teaching' },
  { id: 'junior',    he: 'מתחילים וסטודנטים',  en: 'Entry-level' },
];

export const CONTENT_BANK = {
  dev: {
    he: {
      summaries: [
        'מהנדס/ת תוכנה עם [X] שנות ניסיון בפיתוח מערכות ווב בקנה מידה גדול. מתמחה ב-[טכנולוגיות עיקריות], עם דגש על קוד נקי, ביצועים ועבודת צוות. אוהב/ת לפרק בעיות מורכבות לפתרונות פשוטים.',
        'מפתח/ת Full-Stack עם ניסיון בהובלת פיצ׳רים מקצה לקצה — מאפיון מול מוצר ועד production. רקע חזק ב-[תחום], תשוקה לאוטומציה ולשיפור תהליכי פיתוח.',
      ],
      bullets: [
        'פיתחתי [פיצ׳ר/מערכת] ששימש/ה מעל [X] משתמשים פעילים ביום.',
        'שיפרתי ביצועי [מערכת/שאילתות] והפחתתי זמני טעינה ב-[X]%.',
        'הובלתי מעבר ל-[טכנולוגיה], שקיצר זמן פיתוח פיצ׳רים ב-[X]%.',
        'כתבתי בדיקות אוטומטיות שהעלו כיסוי מ-[X]% ל-[Y]% והפחיתו באגים ב-production.',
        'ליוויתי מפתחים צעירים בצוות דרך code reviews ומנטורינג שוטף.',
        'תכננתי ובניתי API שמשרת [X] בקשות בשנייה בזמינות של 99.9%.',
      ],
    },
    en: {
      summaries: [
        'Software engineer with [X] years of experience building large-scale web systems. Specializing in [key technologies], with a focus on clean code, performance, and teamwork.',
        'Full-stack developer experienced in owning features end to end — from product spec to production. Strong background in [domain], passionate about automation and developer experience.',
      ],
      bullets: [
        'Built [feature/system] serving over [X] daily active users.',
        'Improved [system/query] performance, cutting load times by [X]%.',
        'Led migration to [technology], reducing feature development time by [X]%.',
        'Wrote automated tests raising coverage from [X]% to [Y]%, reducing production bugs.',
        'Mentored junior developers through code reviews and pairing sessions.',
        'Designed and built an API handling [X] requests/sec at 99.9% availability.',
      ],
    },
  },
  design: {
    he: {
      summaries: [
        'מעצב/ת מוצר עם [X] שנות ניסיון בעיצוב חוויות דיגיטליות. מוביל/ה תהליכי עיצוב מקצה לקצה — ממחקר משתמשים ועד מסירה לפיתוח. אוהב/ת מערכות עיצוב וטיפוגרפיה.',
        'מעצב/ת UI/UX עם רקע ב-[תחום], דגש על עיצוב מבוסס-דאטה ושיתוף פעולה הדוק עם מוצר ופיתוח.',
      ],
      bullets: [
        'עיצבתי מחדש את [מסך/תהליך] והעליתי את שיעור ההמרה ב-[X]%.',
        'בניתי מערכת עיצוב שמשרתת [X] מוצרים וקיצרה זמן פיתוח מסכים ב-[X]%.',
        'הובלתי מחקר משתמשים — ראיונות ובדיקות שמישות — שעיצב את מפת הדרכים.',
        'עבדתי בשיתוף הדוק עם מפתחים על ספריית קומפוננטות ב-Figma ו-[כלי].',
        'ליוויתי מעצבים צעירים והובלתי ביקורות עיצוב שבועיות.',
        'יצרתי פרוטוטייפים אינטראקטיביים שקיצרו סבבי משוב מול לקוחות ב-[X]%.',
      ],
    },
    en: {
      summaries: [
        'Product designer with [X] years of experience crafting digital experiences. Leading design end to end — from user research to developer handoff. Passionate about design systems and typography.',
        'UI/UX designer with a background in [domain], focused on data-informed design and close collaboration with product and engineering.',
      ],
      bullets: [
        'Redesigned [screen/flow], lifting conversion rate by [X]%.',
        'Built a design system serving [X] products, cutting screen build time by [X]%.',
        'Led user research — interviews and usability tests — that shaped the roadmap.',
        'Partnered with engineers on a shared component library in Figma and [tool].',
        'Mentored junior designers and led weekly design critiques.',
        'Created interactive prototypes that shortened client feedback cycles by [X]%.',
      ],
    },
  },
  product: {
    he: {
      summaries: [
        'מנהל/ת מוצר עם [X] שנות ניסיון בהובלת מוצרי [תחום] מרעיון ל-scale. מחבר/ת בין דאטה, משתמשים ועסקים להחלטות מוצר חדות.',
        'מנהל/ת מוצר עם רקע ב-[תחום קודם], מתמחה בגילוי צרכים (discovery), ניסויים מהירים ועבודה צמודה עם פיתוח ועיצוב.',
      ],
      bullets: [
        'הובלתי השקת [מוצר/פיצ׳ר] שהגיע ל-[X] משתמשים בתוך [Y] חודשים.',
        'הגדרתי מדדי הצלחה ובניתי דשבורדים שהפכו לשפה המשותפת של הצוות.',
        'ניהלתי backlog ותעדוף מול [X] בעלי עניין תוך עמידה ביעדים רבעוניים.',
        'הרצתי ניסויי A/B שהעלו את שיעור ה-[מדד] ב-[X]%.',
        'ראיינתי עשרות משתמשים וגיבשתי תובנות שהובילו ל-[שינוי מוצרי].',
        'עבדתי צמוד לפיתוח ועיצוב בספרינטים דו-שבועיים עם שקיפות מלאה מול ההנהלה.',
      ],
    },
    en: {
      summaries: [
        'Product manager with [X] years of experience taking [domain] products from idea to scale. Connecting data, users, and business into sharp product decisions.',
        'PM with a background in [previous field], specializing in discovery, rapid experimentation, and tight collaboration with engineering and design.',
      ],
      bullets: [
        'Led the launch of [product/feature], reaching [X] users within [Y] months.',
        'Defined success metrics and built dashboards that became the team’s shared language.',
        'Managed backlog and prioritization across [X] stakeholders while hitting quarterly goals.',
        'Ran A/B experiments that improved [metric] by [X]%.',
        'Interviewed dozens of users, distilling insights that drove [product change].',
        'Worked hand-in-hand with engineering and design in two-week sprints with full leadership visibility.',
      ],
    },
  },
  marketing: {
    he: {
      summaries: [
        'איש/אשת שיווק דיגיטלי עם [X] שנות ניסיון בבניית משפכים, קמפיינים ותוכן שמייצרים צמיחה מדידה. שולט/ת ב-[ערוצים/כלים].',
        'מנהל/ת שיווק עם דגש על performance ותוכן. ניסיון בניהול תקציבים של [X] ₪ בחודש והובלת צוותים קטנים.',
      ],
      bullets: [
        'ניהלתי קמפיינים בתקציב חודשי של [X] ₪ עם ROAS ממוצע של [Y].',
        'הגדלתי תנועה אורגנית ב-[X]% בתוך [Y] חודשים באמצעות אסטרטגיית תוכן ו-SEO.',
        'בניתי משפך אימייל אוטומטי שהעלה המרות ב-[X]%.',
        'הובלתי מיתוג מחדש שכלל שפה חדשה, אתר וחומרי מכירה.',
        'ניתחתי דאטה ב-[כלי] וזיקקתי תובנות שהוזילו עלות ליד ב-[X]%.',
        'ניהלתי נוכחות סושיאל שצמחה מ-[X] ל-[Y] עוקבים.',
      ],
    },
    en: {
      summaries: [
        'Digital marketer with [X] years of experience building funnels, campaigns, and content that drive measurable growth. Fluent in [channels/tools].',
        'Marketing manager focused on performance and content. Experienced managing budgets of $[X]/month and leading small teams.',
      ],
      bullets: [
        'Managed campaigns with a monthly budget of $[X], averaging [Y] ROAS.',
        'Grew organic traffic by [X]% in [Y] months through content strategy and SEO.',
        'Built an automated email funnel that lifted conversions by [X]%.',
        'Led a rebrand covering messaging, website, and sales collateral.',
        'Analyzed data in [tool], surfacing insights that cut cost-per-lead by [X]%.',
        'Managed social presence growing from [X] to [Y] followers.',
      ],
    },
  },
  sales: {
    he: {
      summaries: [
        'איש/אשת מכירות עם [X] שנות ניסיון במכירת [מוצר/שירות] ללקוחות [B2B/B2C]. עומד/ת ביעדים בעקביות ובונה מערכות יחסים ארוכות טווח.',
        'מנהל/ת תיקי לקוחות עם ניסיון בניהול משא ומתן, סגירת עסקאות מורכבות והגדלת הכנסות מלקוחות קיימים.',
      ],
      bullets: [
        'עמדתי ביעדי מכירות ב-[X]% בממוצע לאורך [Y] רבעונים רצופים.',
        'סגרתי עסקאות בהיקף כולל של [X] ₪ בשנה.',
        'הגדלתי הכנסות מלקוחות קיימים ב-[X]% באמצעות upsell ו-cross-sell.',
        'בניתי pipeline של [X] לידים חדשים בחודש דרך שיחות יזומות ונטוורקינג.',
        'קיצרתי את מחזור המכירה הממוצע מ-[X] ל-[Y] ימים.',
        'הדרכתי אנשי מכירות חדשים וליוויתי אותם לעמידה ביעדים תוך [X] חודשים.',
      ],
    },
    en: {
      summaries: [
        'Sales professional with [X] years of experience selling [product/service] to [B2B/B2C] customers. Consistently exceeding quota and building long-term relationships.',
        'Account manager experienced in negotiation, closing complex deals, and growing revenue from existing accounts.',
      ],
      bullets: [
        'Exceeded sales targets by an average of [X]% across [Y] consecutive quarters.',
        'Closed deals totaling $[X] annually.',
        'Grew revenue from existing accounts by [X]% through upsell and cross-sell.',
        'Built a pipeline of [X] new leads per month through outbound calls and networking.',
        'Shortened the average sales cycle from [X] to [Y] days.',
        'Onboarded new sales reps, coaching them to quota within [X] months.',
      ],
    },
  },
  finance: {
    he: {
      summaries: [
        'כלכלן/ית עם [X] שנות ניסיון בתכנון פיננסי, בקרה תקציבית וניתוח דוחות. שולט/ת ב-Excel ברמה גבוהה וב-[מערכת].',
        'רו"ח / מנהל/ת כספים עם ניסיון בליווי חברות בצמיחה — תזרים, דיווח, שכר ועבודה מול רואי חשבון ורשויות.',
      ],
      bullets: [
        'ניהלתי תקציב שנתי של [X] ₪ תוך עמידה ביעדי הוצאות.',
        'בניתי מודל תחזית תזרים שחסך [X] שעות עבודה חודשיות.',
        'הובלתי סגירת דוחות חודשיים ושנתיים בזמן, ללא הערות ביקורת מהותיות.',
        'זיהיתי חיסכון תפעולי של [X] ₪ בשנה באמצעות ניתוח ספקים והתקשרויות.',
        'אוטמטתי תהליכי דיווח ב-[כלי] וקיצרתי זמן הכנה ב-[X]%.',
        'עבדתי מול רואי חשבון, בנקים ורשויות המס באופן שוטף.',
      ],
    },
    en: {
      summaries: [
        'Finance professional with [X] years of experience in planning, budget control, and reporting. Advanced Excel skills and proficiency in [system].',
        'Accountant / finance manager experienced supporting growth-stage companies — cash flow, reporting, payroll, and working with auditors and authorities.',
      ],
      bullets: [
        'Managed an annual budget of $[X] while meeting expense targets.',
        'Built a cash-flow forecasting model saving [X] work hours monthly.',
        'Led on-time monthly and annual closes with no material audit findings.',
        'Identified $[X]/year in operational savings through vendor and contract analysis.',
        'Automated reporting processes in [tool], cutting preparation time by [X]%.',
        'Worked routinely with auditors, banks, and tax authorities.',
      ],
    },
  },
  ops: {
    he: {
      summaries: [
        'מנהל/ת תפעול עם [X] שנות ניסיון בניהול שוטף של [תחום] — ספקים, לוגיסטיקה, תהליכים ואנשים. מסדר/ת כאוס ובונה תהליכים שעובדים.',
        'מנהל/ת משרד / אדמיניסטרציה עם ניסיון בתמיכה בהנהלה, ניהול יומנים, רכש והפקת אירועים. עצמאי/ת, מאורגנ/ת ומהיר/ה.',
      ],
      bullets: [
        'בניתי נהלי עבודה חדשים שקיצרו זמן טיפול בפניות ב-[X]%.',
        'ניהלתי התקשרויות מול [X] ספקים והוזלתי עלויות ב-[X]%.',
        'תיאמתי יומנים, נסיעות ופגישות עבור [X] מנהלים בכירים.',
        'הובלתי הטמעת [מערכת] שייעלה תהליכי עבודה רוחביים.',
        'הפקתי אירועי חברה ל-[X] משתתפים בתקציב של [Y] ₪.',
        'ניהלתי מלאי ורכש שוטף תוך שמירה על זמינות מלאה ותקציב מאוזן.',
      ],
    },
    en: {
      summaries: [
        'Operations manager with [X] years of experience running [domain] day to day — vendors, logistics, processes, and people. Turning chaos into processes that work.',
        'Office / administrative manager experienced supporting leadership, managing calendars, procurement, and events. Independent, organized, and fast.',
      ],
      bullets: [
        'Built new work procedures cutting request handling time by [X]%.',
        'Managed contracts with [X] vendors, reducing costs by [X]%.',
        'Coordinated calendars, travel, and meetings for [X] senior executives.',
        'Led rollout of [system], streamlining cross-team workflows.',
        'Produced company events for [X] attendees on a $[Y] budget.',
        'Owned inventory and procurement, maintaining full availability within budget.',
      ],
    },
  },
  service: {
    he: {
      summaries: [
        'נציג/ת שירות עם [X] שנות ניסיון בתמיכה בלקוחות ב-[ערוצים]. סבלנות, אמפתיה ויכולת לפתור בעיות מהר — גם תחת עומס.',
        'מנהל/ת צוות שירות עם ניסיון בבניית תהליכי תמיכה, מדידת שביעות רצון והובלת צוות של [X] נציגים.',
      ],
      bullets: [
        'טיפלתי ב-[X] פניות ביום בציון שביעות רצון ממוצע של [Y].',
        'שמרתי על זמן מענה ראשון מתחת ל-[X] דקות לאורך זמן.',
        'כתבתי מאגר ידע פנימי שהפחית פניות חוזרות ב-[X]%.',
        'הובלתי צוות של [X] נציגים כולל חניכה, משוב ושיבוץ משמרות.',
        'הפכתי לקוחות מתוסכלים לממליצים — עם שיעור שימור של [X]%.',
        'עבדתי עם צוותי מוצר ופיתוח להעברת משוב לקוחות שהוביל לתיקונים בפועל.',
      ],
    },
    en: {
      summaries: [
        'Customer support specialist with [X] years of experience across [channels]. Patient, empathetic, and fast at solving problems — even under pressure.',
        'Support team lead experienced building support processes, measuring satisfaction, and leading a team of [X] agents.',
      ],
      bullets: [
        'Handled [X] tickets daily with an average CSAT of [Y].',
        'Maintained first-response time under [X] minutes consistently.',
        'Wrote an internal knowledge base reducing repeat tickets by [X]%.',
        'Led a team of [X] agents, including onboarding, feedback, and scheduling.',
        'Turned frustrated customers into promoters — with [X]% retention.',
        'Partnered with product and engineering, channeling customer feedback into real fixes.',
      ],
    },
  },
  education: {
    he: {
      summaries: [
        'מורה / מדריכ/ה עם [X] שנות ניסיון בהוראת [תחום] לקבוצות ויחידים. מאמינ/ה בלמידה פעילה ובחיבור החומר לעולם האמיתי.',
        'מפתח/ת הדרכה עם ניסיון בבניית תוכניות לימוד, סדנאות ולומדות דיגיטליות עבור [קהל יעד].',
      ],
      bullets: [
        'לימדתי [מקצוע] לכיתות של עד [X] תלמידים עם שיפור ממוצע של [Y]% בציונים.',
        'פיתחתי תוכנית לימודים חדשה ל-[נושא] שאומצה על ידי [X] כיתות/קבוצות.',
        'הנחיתי סדנאות ל-[X] משתתפים עם ציוני משוב ממוצעים של [Y]/5.',
        'ליוויתי תלמידים מתקשים באופן פרטני עד לסגירת פערים.',
        'שילבתי כלים דיגיטליים בהוראה והעליתי מעורבות תלמידים באופן ניכר.',
        'עבדתי בשיתוף פעולה עם הורים וצוות חינוכי לבניית מענים אישיים.',
      ],
    },
    en: {
      summaries: [
        'Teacher / instructor with [X] years of experience teaching [subject] to groups and individuals. A believer in active learning and connecting material to the real world.',
        'Instructional designer experienced building curricula, workshops, and e-learning for [audience].',
      ],
      bullets: [
        'Taught [subject] to classes of up to [X] students, with average grade improvement of [Y]%.',
        'Developed a new curriculum for [topic], adopted by [X] classes/groups.',
        'Facilitated workshops for [X] participants with average feedback of [Y]/5.',
        'Tutored struggling students one-on-one until gaps were closed.',
        'Integrated digital tools into teaching, significantly raising engagement.',
        'Collaborated with parents and staff to build individualized support plans.',
      ],
    },
  },
  junior: {
    he: {
      summaries: [
        'סטודנט/ית ל[תואר] בשנה [X], עם תשוקה ל-[תחום]. לומד/ת מהר, אחראי/ת, ומחפש/ת מקום לצמוח בו ולתרום מהיום הראשון.',
        'בוגר/ת [מסלול/קורס] עם פרויקטים מעשיים ב-[תחום]. מגיע/ה עם מוטיבציה גבוהה, ראש גדול ונכונות ללמוד כל מה שצריך.',
      ],
      bullets: [
        'השלמתי פרויקט [שם/נושא] במסגרת הלימודים, שכלל [תיאור קצר].',
        'עבדתי במקביל ללימודים ב-[X] משרות/משמרות שבועיות תוך שמירה על ממוצע [Y].',
        'התנדבתי ב-[ארגון] ולקחתי אחריות על [תחום].',
        'למדתי באופן עצמאי [כלי/שפה] ובניתי איתו [פרויקט].',
        'הובלתי צוות סטודנטים בפרויקט גמר שקיבל ציון [X].',
        'שירתתי כ-[תפקיד] בשירות הצבאי/לאומי, עם אחריות על [תחום].',
      ],
    },
    en: {
      summaries: [
        'Year-[X] [degree] student passionate about [field]. Fast learner, responsible, looking for a place to grow and contribute from day one.',
        'Graduate of [program/course] with hands-on projects in [field]. High motivation, ownership mindset, and readiness to learn whatever it takes.',
      ],
      bullets: [
        'Completed [project name/topic] as part of my studies, involving [short description].',
        'Worked [X] shifts/jobs weekly alongside studies while maintaining a [Y] GPA.',
        'Volunteered at [organization], taking ownership of [area].',
        'Self-taught [tool/language] and built [project] with it.',
        'Led a student team in a capstone project graded [X].',
        'Served as [role] during military/national service, responsible for [area].',
      ],
    },
  },
};
