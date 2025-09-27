// Chapters data
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
  { num: 20, title: "Глава 20. Золушка", cover: "ch/20/1.jpg", pages: 19 },
];

let currentChapterIndex = 0;
let currentPage = 1;

// Theme management
function applyTheme(theme) {
  const isLight = theme === 'light';
  document.body.classList.toggle('light', isLight);
  
  // Apply theme to all relevant elements
  const elements = [
    '.info', '.chapter-card', '.reader-nav',
    '.poster img', '.desc', '.buttons button', 
    '.buttons a > button', '.nav-btn', '.reader'
  ];
  
  elements.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.toggle('light', isLight);
    });
  });
}

function toggleTheme() {
  const currentTheme = document.body.classList.contains('light') ? 'light' : 'dark';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  // Save to localStorage
  try {
    localStorage.setItem('theme', newTheme);
  } catch (e) {
    console.warn('Cannot save theme to localStorage');
  }
  
  applyTheme(newTheme);
  
  // Update button text
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.textContent = newTheme === 'light' ? '☀️' : '🌙';
  }
}

// Bookmark functionality
function saveBookmark() {
  const bookmark = {
    chapter: currentChapterIndex,
    page: currentPage,
    timestamp: Date.now()
  };
  
  try {
    localStorage.setItem('bookmark', JSON.stringify(bookmark));
  } catch (e) {
    console.warn('Cannot save bookmark to localStorage');
  }
  
  // Visual feedback
  const btn = document.getElementById('bookmark-btn');
  if (btn) {
    const originalText = btn.textContent;
    btn.textContent = '✅ Сохранено!';
    btn.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 2000);
  }
}

function loadBookmark() {
  try {
    const data = localStorage.getItem('bookmark');
    if (data) {
      const { chapter, page } = JSON.parse(data);
      if (chapters[chapter]) {
        openChapter(chapter, page);
        return true;
      }
    }
  } catch (e) {
    console.warn('Cannot load bookmark from localStorage');
  }
  return false;
}

// History management
function addToHistory(chapterIdx) {
  try {
    let history = JSON.parse(localStorage.getItem('history') || '[]');
    history = history.filter(h => h !== chapterIdx);
    history.unshift(chapterIdx);
    if (history.length > 10) history = history.slice(0, 10);
    localStorage.setItem('history', JSON.stringify(history));
  } catch (e) {
    console.warn('Cannot save history to localStorage');
  }
}

function showHistory() {
  try {
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
  } catch (e) {
    console.warn('Cannot load history from localStorage');
    alert('История недоступна.');
  }
}

// Chapter management
function showChapters() {
  document.getElementById('reader').style.display = 'none';
  document.body.style.overflow = '';
  
  const chaptersDiv = document.getElementById('chapters');
  chaptersDiv.innerHTML = '';
  
  chapters.forEach((ch, idx) => {
    const card = document.createElement('div');
    card.className = 'chapter-card';
    if (document.body.classList.contains('light')) {
      card.classList.add('light');
    }
    
    card.innerHTML = `
      <img src="${ch.cover}" alt="Глава ${ch.num}" 
           onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjMjMyNDNBIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkFEMUZGIiBmb250LXNpemU9IjE0Ij5HbGF2YSAke2NoLm51bX08L3RleHQ+Cjwvc3ZnPg=='">
      <h3>${ch.title}</h3>
      <button onclick="openChapter(${idx})">Читать</button>
    `;
    
    chaptersDiv.appendChild(card);
  });
}

function startReading() {
  let idx = 0;
  let page = 1;
  
  // Try to load last read position
  try {
    const lastRead = localStorage.getItem('lastRead');
    if (lastRead) {
      const { chapter, page: savedPage } = JSON.parse(lastRead);
      if (chapters[chapter]) {
        idx = chapter;
        page = savedPage || 1;
      }
    }
  } catch (e) {
    console.warn('Cannot load last read position');
  }
  
  openChapter(idx, page);
}

function openChapter(idx, page = 1) {
  if (!chapters[idx]) return;
  
  currentChapterIndex = idx;
  currentPage = page;
  
  // Save current position
  try {
    localStorage.setItem('lastChapterIndex', idx);
    localStorage.setItem('lastRead', JSON.stringify({ chapter: idx, page }));
  } catch (e) {
    console.warn('Cannot save reading position');
  }
  
  addToHistory(idx);
  
  document.getElementById('chapters').innerHTML = '';
  const reader = document.getElementById('reader');
  reader.style.display = 'flex';
  if (document.body.classList.contains('light')) {
    reader.classList.add('light');
  }
  document.body.style.overflow = 'hidden';
  
  renderChapter();
}

function renderChapter() {
  const ch = chapters[currentChapterIndex];
  const pagesDiv = document.getElementById('pages');
  pagesDiv.innerHTML = '';
  
  // Create pages
  for (let i = 1; i <= ch.pages; i++) {
    const img = document.createElement('img');
    img.src = `ch/${ch.num}/${i}.jpg`;
    img.alt = `Страница ${i}`;
    img.className = 'manga-page';
    img.loading = 'lazy';
    
    // Handle missing images
    img.onerror = function() {
      this.onerror = null;
      this.src = `ch/${ch.num}/${i}.jpeg`;
      this.onerror = function() {
        this.src = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUzMyIgdmlld0JveD0iMCAwIDQwMCA1MzMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNTMzIiBmaWxsPSIjMjMyNDNBIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkFEMUZGIiBmb250LXNpemU9IjE2Ij5TdHJhbmljYSAke2l9PC90ZXh0Pgo8L3N2Zz4K`;
      };
    };
    
    // Click to save page position
    img.onclick = () => {
      currentPage = i;
      saveBookmark();
    };
    
    pagesDiv.appendChild(img);
  }
  
  // Update navigation buttons
  updateNavigationButtons();
  
  // Scroll to top
  window.scrollTo(0, 0);
}

function updateNavigationButtons() {
  const prevBtn = document.getElementById('prev-chapter');
  const nextBtn = document.getElementById('next-chapter');
  
  if (prevBtn) {
    prevBtn.disabled = currentChapterIndex <= 0;
    prevBtn.style.opacity = currentChapterIndex <= 0 ? '0.5' : '1';
  }
  
  if (nextBtn) {
    nextBtn.disabled = currentChapterIndex >= chapters.length - 1;
    nextBtn.style.opacity = currentChapterIndex >= chapters.length - 1 ? '0.5' : '1';
  }
}

function closeReader() {
  document.getElementById('reader').style.display = 'none';
  document.body.style.overflow = '';
  showChapters();
}

function prevChapter() {
  if (currentChapterIndex > 0) {
    currentChapterIndex--;
    currentPage = 1;
    renderChapter();
  }
}

function nextChapter() {
  if (currentChapterIndex < chapters.length - 1) {
    currentChapterIndex++;
    currentPage = 1;
    renderChapter();
  }
}

// Download functionality
function loadJSZipIfNeeded(callback) {
  if (window.JSZip) {
    callback();
    return;
  }
  
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
  script.onload = callback;
  script.onerror = () => {
    alert('Не удалось загрузить библиотеку для скачивания.');
  };
  document.head.appendChild(script);
}

async function downloadCurrentChapterZip() {
  const ch = chapters[currentChapterIndex];
  const btn = document.getElementById('download-zip');
  
  if (btn) {
    btn.textContent = '⏳ Загрузка...';
    btn.disabled = true;
  }
  
  loadJSZipIfNeeded(async () => {
    try {
      const zip = new JSZip();
      let successCount = 0;
      
      for (let i = 1; i <= ch.pages; i++) {
        const urls = [
          `ch/${ch.num}/${i}.jpg`,
          `ch/${ch.num}/${i}.jpeg`
        ];
        
        let success = false;
        for (const url of urls) {
          try {
            const response = await fetch(url);
            if (response.ok) {
              const blob = await response.blob();
              const extension = url.endsWith('.jpeg') ? 'jpeg' : 'jpg';
              zip.file(`${String(i).padStart(3, '0')}.${extension}`, blob);
              successCount++;
              success = true;
              break;
            }
          } catch (error) {
            console.warn(`Failed to fetch ${url}:`, error);
          }
        }
        
        if (!success) {
          console.warn(`Could not download page ${i}`);
        }
      }
      
      if (successCount === 0) {
        alert('Не удалось найти страницы главы для скачивания.');
        return;
      }
      
      // Generate zip
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `${ch.title.replace(/[^a-zA-Z0-9а-яА-ЯёЁ _.-]/g, '_')}.zip`;
      link.click();
      
      // Clean up
      URL.revokeObjectURL(link.href);
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Ошибка при скачивании главы.');
    } finally {
      if (btn) {
        btn.textContent = '💾 Скачать';
        btn.disabled = false;
      }
    }
  });
}

// Keyboard navigation
function handleKeyPress(event) {
  // Check if reader is open
  const readerOpen = document.getElementById('reader').style.display === 'flex';
  
  if (readerOpen) {
    switch (event.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        event.preventDefault();
        prevChapter();
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        event.preventDefault();
        nextChapter();
        break;
      case 'ArrowUp':
        event.preventDefault();
        window.scrollBy(0, -window.innerHeight * 0.8);
        break;
      case 'ArrowDown':
      case ' ': // Spacebar
        event.preventDefault();
        window.scrollBy(0, window.innerHeight * 0.8);
        break;
      case 'Home':
        event.preventDefault();
        window.scrollTo(0, 0);
        break;
      case 'End':
        event.preventDefault();
        window.scrollTo(0, document.body.scrollHeight);
        break;
      case 'Escape':
        event.preventDefault();
        closeReader();
        break;
      case 'b':
      case 'B':
        event.preventDefault();
        saveBookmark();
        break;
      case 's':
      case 'S':
        event.preventDefault();
        downloadCurrentChapterZip();
        break;
    }
  } else {
    // Navigation in chapter list
    switch (event.key) {
      case 'Enter':
        // If focused on a chapter card, open it
        const focused = document.activeElement;
        if (focused && focused.closest('.chapter-card')) {
          const button = focused.querySelector('button') || focused;
          if (button.onclick) {
            button.click();
          }
        } else {
          // Start reading first chapter
          startReading();
        }
        break;
      case 'r':
      case 'R':
        event.preventDefault();
        startReading();
        break;
      case 't':
      case 'T':
        event.preventDefault();
        toggleTheme();
        break;
    }
  }
}

// Touch navigation for mobile
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let touchStartTime = 0;

function handleTouchStart(event) {
  const touch = event.changedTouches[0];
  touchStartX = touch.screenX;
  touchStartY = touch.screenY;
  touchStartTime = Date.now();
}

function handleTouchEnd(event) {
  const touch = event.changedTouches[0];
  touchEndX = touch.screenX;
  touchEndY = touch.screenY;
  
  // Only handle swipes if reader is open
  if (document.getElementById('reader').style.display === 'flex') {
    handleSwipe();
  }
}

function handleSwipe() {
  const swipeThreshold = 80;
  const swipeTimeThreshold = 800; // Maximum time for a swipe (ms)
  const verticalThreshold = 100; // Minimum vertical movement to ignore horizontal swipes
  
  const deltaX = touchStartX - touchEndX;
  const deltaY = touchStartY - touchEndY;
  const swipeTime = Date.now() - touchStartTime;
  
  // Check if swipe was quick enough and not too vertical
  if (swipeTime > swipeTimeThreshold) return;
  if (Math.abs(deltaY) > verticalThreshold) return;
  
  if (Math.abs(deltaX) > swipeThreshold) {
    if (deltaX > 0) {
      // Swipe left - next chapter
      nextChapter();
      
      // Visual feedback
      showSwipeAnimation('next');
    } else {
      // Swipe right - previous chapter  
      prevChapter();
      
      // Visual feedback
      showSwipeAnimation('prev');
    }
  }
}

// Visual feedback for swipes
function showSwipeAnimation(direction) {
  const reader = document.getElementById('reader');
  if (!reader) return;
  
  // Remove existing animation elements
  const existingAnimations = reader.querySelectorAll('.swipe-animation');
  existingAnimations.forEach(el => el.remove());
  
  // Create animation element
  const animation = document.createElement('div');
  animation.className = 'swipe-animation';
  animation.innerHTML = direction === 'next' ? '→' : '←';
  
  // Style the animation
  Object.assign(animation.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '3rem',
    color: '#6ad1ff',
    background: 'rgba(0, 0, 0, 0.7)',
    padding: '20px',
    borderRadius: '50%',
    zIndex: '9999',
    pointerEvents: 'none',
    opacity: '0',
    animation: 'swipeIndicator 0.5s ease-out forwards'
  });
  
  reader.appendChild(animation);
  
  // Remove after animation
  setTimeout(() => {
    animation.remove();
  }, 500);
}

// Add CSS for swipe animation
function addSwipeAnimationCSS() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes swipeIndicator {
      0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5);
      }
      50% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.1);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(1);
      }
    }
    
    .swipe-animation {
      user-select: none;
      -webkit-user-select: none;
    }
  `;
  document.head.appendChild(style);
}

// Double tap to toggle fullscreen (mobile)
let lastTouchTime = 0;
function handleDoubleTap(event) {
  const currentTime = Date.now();
  const tapLength = currentTime - lastTouchTime;
  
  if (tapLength < 500 && tapLength > 0) {
    // Double tap detected
    event.preventDefault();
    
    if (document.getElementById('reader').style.display === 'flex') {
      // Toggle fullscreen on mobile
      if (document.documentElement.requestFullscreen) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
      }
    }
  }
  
  lastTouchTime = currentTime;
}

// Initialize app
function initializeApp() {
  // Load saved theme
  try {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.textContent = savedTheme === 'light' ? '☀️' : '🌙';
    }
  } catch (e) {
    console.warn('Cannot load theme from localStorage');
  }
  
  // Add swipe animation CSS
  addSwipeAnimationCSS();
  
  // Set up event listeners
  document.addEventListener('keydown', handleKeyPress);
  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchend', handleTouchEnd, { passive: true });
  document.addEventListener('touchstart', handleDoubleTap, { passive: false });
  
  // Prevent context menu on long press (mobile)
  document.addEventListener('contextmenu', (e) => {
    if (document.getElementById('reader').style.display === 'flex') {
      e.preventDefault();
    }
  });
  
  // Prevent zoom on double tap in reader
  document.addEventListener('touchend', (e) => {
    if (document.getElementById('reader').style.display === 'flex') {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Show chapters on load
  showChapters();
  
  // Show keyboard shortcuts help on first visit
  showKeyboardShortcutsHelp();
}

// Show keyboard shortcuts help
function showKeyboardShortcutsHelp() {
  try {
    const helpShown = localStorage.getItem('keyboardHelpShown');
    if (!helpShown) {
      setTimeout(() => {
        const helpText = `
Управление клавиатурой:
📖 R - Начать чтение
🌙 T - Переключить тему
⬅️ A/← - Предыдущая глава
➡️ D/→ - Следующая глава
⬆️ ↑ - Прокрутить вверх
⬇️ ↓/Space - Прокрутить вниз
📚 B - Сохранить закладку
💾 S - Скачать главу
🏠 Home - В начало страницы
🔚 End - В конец страницы
❌ Escape - Закрыть ридер

На мобильном:
👆 Свайп влево - Следующая глава
👆 Свайп вправо - Предыдущая глава
👆👆 Двойной тап - Полный экран
        `.trim();
        
        alert(helpText);
        localStorage.setItem('keyboardHelpShown', 'true');
      }, 1000);
    }
  } catch (e) {
    console.warn('Cannot save help status');
  }
}

// Save reading position before page unload
window.addEventListener('beforeunload', function() {
  try {
    localStorage.setItem('lastRead', JSON.stringify({ 
      chapter: currentChapterIndex, 
      page: currentPage,
      timestamp: Date.now()
    }));
  } catch (e) {
    console.warn('Cannot save reading position on unload');
  }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}