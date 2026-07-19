// Theme toggle
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

// View toggle
const viewToggle = document.getElementById('view-toggle');
const lectureList = document.getElementById('lecture-list');
let currentView = window.innerWidth <= 768 ? 'list' : 'grid';

function setView(view) {
    currentView = view;
    lectureList.className = view === 'grid' ? 'lecture-grid' : 'lecture-list';
    viewToggle.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    localStorage.setItem('view', view);
}

// Check for saved view preference
const savedView = localStorage.getItem('view');
if (savedView) {
    currentView = savedView;
} else {
    currentView = window.innerWidth <= 768 ? 'list' : 'grid';
}
setView(currentView);

viewToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('.view-btn');
    if (btn) setView(btn.dataset.view);
});

// Responsive: switch to list on mobile
window.addEventListener('resize', () => {
    if (!localStorage.getItem('view')) {
        setView(window.innerWidth <= 768 ? 'list' : 'grid');
    }
});

// Render lecture list
function renderLectures() {
    if (!lectureList) return;

    lectureList.innerHTML = LECTURES.map(lecture => {
        const isAvailable = lecture.status === 'available';
        const num = String(lecture.id).padStart(2, '0');

        if (isAvailable) {
            return `
                <a href="lecture.html?id=${lecture.id}" class="lecture-item">
                    <div class="lecture-number">${num}</div>
                    <div class="lecture-info">
                        <h3>${lecture.title}</h3>
                        <p>${lecture.subtitle}</p>
                    </div>
                    <div class="lecture-status">
                        <span class="status-available">Available</span>
                    </div>
                    <svg class="lecture-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </a>
            `;
        } else {
            return `
                <div class="lecture-item upcoming">
                    <div class="lecture-number">${num}</div>
                    <div class="lecture-info">
                        <h3>${lecture.title}</h3>
                        <p>${lecture.subtitle}</p>
                    </div>
                    <div class="lecture-status">
                        <span class="status-upcoming">Coming Soon</span>
                    </div>
                </div>
            `;
        }
    }).join('');
}

renderLectures();
