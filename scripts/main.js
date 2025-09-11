// Автоматически ищет папки глав и страницы внутри них

// Получение списка глав с сервера (требуется сервер, например, express или php)
// Для локального теста используем статический список, но ниже пример для динамики

// --- Динамический способ (работает только с сервером, например, Node.js + express) ---
// fetch('/ch/')
//   .then(res => res.text())
//   .then(html => {
//     // Парсим html директории и ищем папки с числами
//   });

// --- Статический способ (для локального теста) ---
const chapters = [
  { num: 9,  title: "Глава 9. Неизлечимый", cover: "ch/9/1.jpg", pages: 18 },
  { num: 10, title: "Глава 10. Безумные методы", cover: "ch/10/1.jpg", pages: 18 },
  { num: 11, title: "Глава 11. Такой же, как ты", cover: "ch/11/1.jpg", pages: 18 },
  { num: 12, title: "Глава 12. Жажда крови", cover: "ch/12/1.jpg", pages: 19 },
  { num: 13, title: "Глава 13. Проклятые влюблённые", cover: "ch/13/1.jpg", pages: 18 },
  { num: 14, title: "Глава 14. Законный выбор", cover: "ch/14/1.jpg", pages: 17 },
  { num: 15, title: "Глава 15. Битва воль", cover: "ch/15/1.jpg", pages: 17 },
  { num: 16, title: "Глава 16. Любовь и отчаяние", cover: "ch/16/1.jpg", pages: 19 },
  { num: 17, title: "Глава 17. То, что нас связывает", cover: "ch/17/1.jpg", pages: 18 },
  { num: 18, title: "Глава 18. Рыцарь Локонов", cover: "ch/18/1.jpg", pages: 19 },
];

let currentChapterIndex = 0;

// Показать список глав
function showChapters() {
  document.getElementById('reader').style.display = 'none';
  document.body.style.overflow = '';
  const chaptersDiv = document.getElementById('chapters');
  chaptersDiv.innerHTML = '';
  chapters.forEach((ch, idx) => {
    const card = document.createElement('div');
    card.className = 'chapter-card';
    card.innerHTML = `
      <img src="${ch.cover}" alt="Глава ${ch.num}">
      <h3>${ch.title}</h3>
      <button onclick="openChapter(${idx})">Читать</button>
    `;
    chaptersDiv.appendChild(card);
  });
}

// Запуск чтения с первой главы или с последней прочитанной
function startReading() {
  let idx = 0;
  const saved = localStorage.getItem('lastChapterIndex');
  if (saved !== null && chapters[saved]) {
    idx = parseInt(saved, 10);
  }
  openChapter(idx);
}

// Открыть выбранную главу
function openChapter(idx) {
  currentChapterIndex = idx;
  localStorage.setItem('lastChapterIndex', idx);
  document.getElementById('chapters').innerHTML = '';
  document.getElementById('reader').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  renderChapter();
}

function renderChapter() {
  const ch = chapters[currentChapterIndex];
  const pagesDiv = document.getElementById('pages');
  pagesDiv.innerHTML = '';
  for (let i = 1; i <= ch.pages; i++) {
    const img = document.createElement('img');
    img.src = `ch/${ch.num}/${i}.jpg`;
    img.alt = `Страница ${i}`;
    pagesDiv.appendChild(img);
  }
  document.getElementById('prev-chapter').style.visibility = currentChapterIndex > 0 ? 'visible' : 'hidden';
  document.getElementById('next-chapter').style.visibility = currentChapterIndex < chapters.length - 1 ? 'visible' : 'hidden';
  document.getElementById('prev-chapter-bottom').style.visibility = currentChapterIndex > 0 ? 'visible' : 'hidden';
  document.getElementById('next-chapter-bottom').style.visibility = currentChapterIndex < chapters.length - 1 ? 'visible' : 'hidden';
}

function closeReader() {
  document.getElementById('reader').style.display = 'none';
  document.body.style.overflow = '';
  showChapters();
}

function prevChapter() {
  if (currentChapterIndex > 0) {
    currentChapterIndex--;
    renderChapter();
    window.scrollTo(0, 0);
  }
}

function nextChapter() {
  if (currentChapterIndex < chapters.length - 1) {
    currentChapterIndex++;
    renderChapter();
    window.scrollTo(0, 0);
  }
}

// Показать главы при загрузке
window.onload = showChapters;