const CSS_WIDTH_VAR = '--close-width-percent';
const INVERT_PADDING = 20;

const title = document.getElementById('title')!;

const titleWidthPx = title.offsetWidth - INVERT_PADDING;
const titleWidthPercent = (titleWidthPx / window.innerWidth) * 100;

const overlay = document.getElementById('load-overlay')!;
overlay.style.setProperty(CSS_WIDTH_VAR, `${titleWidthPercent}%`);
