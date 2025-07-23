const facts = [
  "Honey never spoils. Archaeologists have found 3000-year-old jars of honey in ancient Egyptian tombs!",
  "Bananas are berries, but strawberries aren't.",
  "A group of flamingos is called a 'flamboyance'.",
  "Octopuses have three hearts.",
  "The Eiffel Tower can grow over 6 inches in summer due to heat expansion.",
  "Sloths can hold their breath longer than dolphins can."
];

function showRandomFact() {
  const randomIndex = Math.floor(Math.random() * facts.length);
  document.getElementById("fact").textContent = facts[randomIndex];
}
