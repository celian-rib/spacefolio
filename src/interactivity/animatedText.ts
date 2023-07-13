import './animatedText.css';

const animatedTexts = document.querySelectorAll('.animated-text');

function letterize(element: HTMLElement, animationIndex: { val: number; } = { val: 0 }) {
  let animations: { child: ChildNode, newLetters: HTMLElement[] }[] = [];

  Array.from(element.childNodes).forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent;
      if (!text) return;

      const letters = text.split('');

      const newLetters = letters.map((letter) => {
        const span = document.createElement('span');
        span.classList.add('letter');
        span.textContent = letter;
        span.style.animationDelay = `${animationIndex.val++ * 40}ms`;
        return span;
      });

      animations.push({ child, newLetters });
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      letterize(child as HTMLElement, animationIndex);
    }
  });

  // Apply the animations after iteration is complete.
  animations.forEach(({ child, newLetters }) => {
    child.replaceWith(...newLetters);
  });
}

animatedTexts.forEach((animatedText) => {
  console.log('animatedText', animatedText);
  letterize(animatedText as HTMLElement, { val: 10 });
});

