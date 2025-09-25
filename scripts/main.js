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
  { num: 19, title: "Глава 19. Решено", cover: "ch/19/1.jpg", pages: 19 },
];

let currentChapterIndex = 0;
let currentPage = 1;

// --- Закладки и история ---
function saveBookmark() {
  const bookmark = {
    chapter: currentChapterIndex,
    page: currentPage
  };
  localStorage.setItem('bookmark', JSON.stringify(bookmark));
  alert('Закладка сохранена!');
}

function loadBookmark() {
  const data = localStorage.getItem('bookmark');
  if (data) {
    const { chapter, page } = JSON.parse(data);
    openChapter(chapter, page);
  } else {
    alert('Закладка не найдена.');
  }
}

function addToHistory(chapterIdx) {
  let history = JSON.parse(localStorage.getItem('history') || '[]');
  // Удаляем если уже есть
  history = history.filter(h => h !== chapterIdx);
  history.unshift(chapterIdx);
  if (history.length > 10) history = history.slice(0, 10);
  localStorage.setItem('history', JSON.stringify(history));
}

function showHistory() {
  let history = JSON.parse(localStorage.getItem('history') || '[]');
  if (!history.length) {
    alert('История пуста.');
    return;
  }
  let msg = 'История чтения (последние 10):\n';
  history.forEach(idx => {
    if (chapters[idx]) msg += `- ${chapters[idx].title}\n`;
  });
  alert(msg);
}

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

// --- Сохранять последнюю главу и страницу при закрытии сайта ---
window.addEventListener('beforeunload', function() {
  localStorage.setItem('lastRead', JSON.stringify({ chapter: currentChapterIndex, page: currentPage }));
});

// --- Кнопка «Читать» ведёт на последнюю страницу ---
function startReading() {
  let idx = 0;
  let page = 1;
  const lastRead = localStorage.getItem('lastRead');
  if (lastRead) {
    const { chapter, page: savedPage } = JSON.parse(lastRead);
    if (chapters[chapter]) {
      idx = chapter;
      page = savedPage || 1;
    }
  } else {
    const saved = localStorage.getItem('lastChapterIndex');
    if (saved !== null && chapters[saved]) {
      idx = parseInt(saved, 10);
    }
  }
  openChapter(idx, page);
}

// Открыть выбранную главу
function openChapter(idx, page = 1) {
  currentChapterIndex = idx;
  currentPage = page;
  localStorage.setItem('lastChapterIndex', idx);
  addToHistory(idx);
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
    img.className = 'manga-page';
    img.onclick = () => {
      currentPage = i;
      saveBookmark();
    };
    // Если .jpg не найден, пробуем .jpeg
    img.onerror = function() {
      this.onerror = null;
      this.src = `ch/${ch.num}/${i}.jpeg`;
    };
    if (i === currentPage) img.style.border = '3px solid #6ad1ff';
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

// --- Кнопка «Закладка» на странице главы ---
function addBookmarkButton() {
  let reader = document.getElementById('reader');
  if (!reader) return;
  let oldBtn = document.getElementById('bookmark-btn');
  if (oldBtn) oldBtn.remove();
  let btn = document.createElement('button');
  btn.id = 'bookmark-btn';
  btn.className = 'nav-btn';
  btn.innerText = 'Закладка';
  btn.style.margin = '12px auto 0 auto';
  btn.onclick = saveBookmark;
  reader.insertBefore(btn, reader.children[1]);
}

// Вставлять кнопку при открытии главы
const origOpenChapter = openChapter;
openChapter = function(idx, page = 1) {
  origOpenChapter(idx, page);
  setTimeout(addBookmarkButton, 0);
};

// --- Скачать главу (zip) ---
function loadJSZipIfNeeded(cb) {
  if (window.JSZip) return cb();
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
  script.onload = cb;
  document.head.appendChild(script);
}

function downloadCurrentChapterZip() {
  loadJSZipIfNeeded(async () => {
    const ch = chapters[currentChapterIndex];
    const zip = new JSZip();
    let count = 0;
    for (let i = 1; i <= ch.pages; i++) {
      let urlJpg = `ch/${ch.num}/${i}.jpg`;
      let urlJpeg = `ch/${ch.num}/${i}.jpeg`;
      try {
        const resp = await fetch(urlJpg);
        if (resp.ok) {
          const blob = await resp.blob();
          zip.file(`${i}.jpg`, blob);
          count++;
          continue;
        }
      } catch {}
      try {
        const resp = await fetch(urlJpeg);
        if (resp.ok) {
          const blob = await resp.blob();
          zip.file(`${i}.jpeg`, blob);
          count++;
        }
      } catch {}
    }
    if (count === 0) {
      alert('Не удалось найти страницы главы для скачивания.');
      return;
    }
    const content = await zip.generateAsync({type: 'blob'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = `${ch.title.replace(/[^a-zA-Z0-9а-яА-ЯёЁ _.-]/g, '_')}.zip`;
    a.click();
  });
}

// --- Переключение светлой/тёмной темы ---
function applyTheme(theme) {
  const isLight = theme === 'light';
  document.body.classList.toggle('light', isLight);
  // Главные блоки
  const info = document.querySelector('.info');
  if (info) info.classList.toggle('light', isLight);
  document.querySelectorAll('.poster img').forEach(img => img.classList.toggle('light', isLight));
  document.querySelectorAll('.desc').forEach(d => d.classList.toggle('light', isLight));
  document.querySelectorAll('.chapter-card').forEach(card => card.classList.toggle('light', isLight));
  document.querySelectorAll('.buttons button, .buttons a > button, .nav-btn').forEach(btn => btn.classList.toggle('light', isLight));
}

function toggleTheme() {
  let theme = localStorage.getItem('theme') === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
  applyTheme(theme);
  // Меняем иконку
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'light' ? '🌙' : '☀️';
}

// Применять тему при загрузке
window.addEventListener('DOMContentLoaded', function() {
  let theme = localStorage.getItem('theme') || 'dark';
  applyTheme(theme);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'light' ? '🌙' : '☀️';
});

// Показать главы при загрузке
window.onload = showChapters;