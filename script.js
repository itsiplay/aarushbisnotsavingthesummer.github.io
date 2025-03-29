let questions = [];
let currentIndex = 0;
const batchSize = 10;

window.MathJax = {
  tex: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
      ["*", "*"],
    ],
  },
  svg: {
    fontCache: "global",
  },
};

fetch("./questions.json")
  .then((res) => res.json())
  .then((data) => {
    if (!Array.isArray(data)) {
      data = data.math; // Accessing array
    }
    questions = data;
    loadQuestions(); // Load initial batch
  })
  .catch(error => console.error("Error fetching JSON:", error));

function loadQuestions() {
  const container = document.getElementById("content");
  const endIndex = Math.min(currentIndex + batchSize, questions.length);

  for (let i = currentIndex; i < endIndex; i++) {
    const item = questions[i];

    // Create question element
    const questionElem = document.createElement("p");
    questionElem.innerHTML = `<strong>Q: </strong>${item.question.question}`;
    container.appendChild(questionElem);

    // Create choices container
    const choicesContainer = document.createElement("ul");
    for (const [key, value] of Object.entries(item.question.choices)) {
      const choiceElem = document.createElement("li");
      choiceElem.innerHTML = `<strong>${key}:</strong> ${value}`;

      // Highlight the correct answer
      if (key === item.question.correct_answer) {
        choiceElem.style.color = "green"; // Make the correct answer green
        choiceElem.style.fontWeight = "bold";
      }

      choicesContainer.appendChild(choiceElem);
    }
    container.appendChild(choicesContainer);

    // Create explanation element
    const explanationElem = document.createElement("p");
    explanationElem.innerHTML = `<strong>Explanation:</strong> ${item.question.explanation}`;
    container.appendChild(explanationElem);

    // Add a separator between questions
    container.appendChild(document.createElement("hr"));
  }

  currentIndex += batchSize;

  // Tell MathJax to render the new content
  if (window.MathJax) {
    MathJax.typesetPromise().catch((err) =>
      console.error("MathJax rendering error:", err)
    );
  }

  // Show or hide the "Load More" button
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (currentIndex >= questions.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "block";
  }
}
