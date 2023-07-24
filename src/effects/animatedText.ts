import './animatedText.css';

function letterize(element: HTMLElement, animationIndex: { val: number } = { val: 0 }) {
  const animations: { child: ChildNode; newLetters: HTMLElement[] }[] = [];

  Array.from(element.childNodes).forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent;
      if (!text) return;

      const letters = Array.from(text);

      const newLetters = letters.map(letter => {
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

export default function animateText(textElement: HTMLElement) {
  const childAnimatedText = textElement.querySelectorAll('.animated-text');

  childAnimatedText.forEach(animatedText => {
    const html = animatedText as HTMLElement;
    const letters = html.querySelectorAll('.letter');
    const isLetterized = letters.length > 0;
    if (isLetterized) {
      for (const letter of letters) {
        const letterElt = letter as HTMLElement;
        letterElt.getAnimations().forEach(a => {
          a.cancel();
          a.play();
        });
      }
    } else {
      letterize(animatedText as HTMLElement, { val: 10 });
    }
  });
}
