const CSS_WIDTH_VAR = '--close-width-percent';
const INVERT_PADDING = 70;

export default function handleLoadOverlay(onDone: () => void, duration: number = 1000) {
  const title = document.getElementById('title')!;
  const subtitle = document.getElementById('subtitle')!;

  subtitle.classList.add('inactive');

  const titleWidthPx = title.offsetWidth - INVERT_PADDING;
  const titleWidthPercent = (titleWidthPx / window.innerWidth) * 100;

  const overlay = document.getElementById('load-overlay')!;
  overlay.style.setProperty(CSS_WIDTH_VAR, `${titleWidthPercent}%`);

  setTimeout(() => {
    subtitle.classList.remove('inactive');
    onDone();
  }, duration);
}
