const dateSinceTexts = document.querySelectorAll('.date-since');

dateSinceTexts.forEach(dateSinceText => {
  let elementText = dateSinceText.textContent;
  if (elementText == null) return;

  const dateRegex = /\{(\d{2}-\d{2}-\d{4})\}/g;
  const dateMatches = elementText.match(dateRegex);

  if (dateMatches) {
    dateMatches.forEach(match => {
      if (elementText == null) return;

      const date = new Date(match.replace(/\{|\}/g, ''));
      const now = new Date();

      const difference = now.getTime() - date.getTime();
      const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));

      elementText = elementText.replace(match, years.toString());
    });

    dateSinceText.textContent = elementText;
  }
});
