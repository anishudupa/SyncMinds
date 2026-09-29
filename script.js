const params = new URLSearchParams(window.location.search);
const type = params.get("type");

const title = document.getElementById("pageTitle");
const form = document.getElementById("cardForm");
const cardsContainer = document.getElementById("cards");
const searchInput = document.getElementById("searchInput");

const storageKey = `flashcards_${type}`;
let cards = JSON.parse(localStorage.getItem(storageKey)) || [];
let editIndex = null;

/* ---------- TITLE ---------- */
title.innerText = type === "qna" ? "QnA Cards" : "Revision Cards";

/* ---------- FORM ---------- */
if (type === "qna") {
	form.innerHTML = `
    <input type="text" id="question" placeholder="Enter question">
    <input type="text" id="answer" placeholder="Enter answer">
    <button onclick="addOrUpdateCard()">Save Card</button>
  `;
} else {
	form.innerHTML = `
    <input type="text" id="topic" placeholder="Enter concept / topic name">
    <textarea id="content" placeholder="Enter detailed explanation"></textarea>
    <button onclick="addOrUpdateCard()">Save Card</button>
  `;
}

/* ---------- STORAGE ---------- */
function saveCards() {
	localStorage.setItem(storageKey, JSON.stringify(cards));
}

/* ---------- ADD / UPDATE ---------- */
function addOrUpdateCard() {
	if (type === "qna") {
		const q = document.getElementById("question").value.trim();
		const a = document.getElementById("answer").value.trim();
		if (!q || !a) return alert("Fill all fields");

		editIndex === null ? cards.push({ q, a }) : (cards[editIndex] = { q, a });
	} else {
		const topic = document.getElementById("topic").value.trim();
		const content = document.getElementById("content").value.trim();
		if (!topic || !content) return alert("Fill all fields");

		editIndex === null
			? cards.push({ topic, content })
			: (cards[editIndex] = { topic, content });
	}

	editIndex = null;
	saveCards();
	renderCards(cards);
	form.querySelectorAll("input, textarea").forEach((e) => (e.value = ""));
}

/* ---------- EDIT ---------- */
function editCard(index) {
	editIndex = index;
	const card = cards[index];

	if (type === "qna") {
		question.value = card.q;
		answer.value = card.a;
	} else {
		topic.value = card.topic;
		content.value = card.content;
	}
}

/* ---------- DELETE ---------- */
function deleteCard(index) {
	cards.splice(index, 1);
	saveCards();
	renderCards(cards);
}

/* ---------- SEARCH ---------- */
function searchCards() {
	const value = searchInput.value.toLowerCase();

	const filtered = cards.filter((card) =>
		type === "qna"
			? card.q.toLowerCase().includes(value)
			: card.topic.toLowerCase().includes(value),
	);

	renderCards(filtered);
}

/* ---------- RENDER ---------- */
function renderCards(list) {
	cardsContainer.innerHTML = "";

	list.forEach((card, index) => {
		const div = document.createElement("div");
		div.className = "flashcard";

		div.innerHTML = `
      <div class="flashcard-inner">
        <div class="flashcard-front">
          ${type === "qna" ? card.q : card.topic}
          <span class="edit-btn" onclick="event.stopPropagation(); editCard(${index})">✏️</span>
          <span class="delete-btn" onclick="event.stopPropagation(); deleteCard(${index})">✖</span>
        </div>
        <div class="flashcard-back">
          ${type === "qna" ? card.a : card.content}
        </div>
      </div>
    `;

		div.onclick = () => div.classList.toggle("flipped");
		cardsContainer.appendChild(div);
	});
}

renderCards(cards);
