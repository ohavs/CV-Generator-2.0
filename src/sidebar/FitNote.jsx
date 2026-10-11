import Icon from '../components/Icon.jsx';

// Tells the user when the page had to shrink to fit on one A4 sheet — and, past
// the point where print stays readable, that it's time to cut content rather
// than keep enlarging it.
export default function FitNote({ fitScale, he }) {
  if (fitScale >= 0.995) return null;
  const pct = Math.round(fitScale * 100);
  const tooSmall = fitScale < 0.6;
  return (
    <div className="fit-note" data-severe={tooSmall || undefined}>
      <Icon name="zoom-out" size={13}/>
      <span>
        {he
          ? `התוכן ארוך מעמוד אחד, ולכן העמוד כולו מוצג ב-${pct}% כדי שייכנס.`
          : `The content is longer than a page, so the whole page is shown at ${pct}% to fit.`}
        {tooSmall && (he
          ? ' בגודל כזה קשה לקרוא — כדאי לקצר תוכן, להסתיר מקטע או להקטין טקסט.'
          : ' That is hard to read — shorten some content, hide a section or reduce text size.')}
      </span>
    </div>
  );
}
