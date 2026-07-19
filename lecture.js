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

// Get lecture ID from URL
function getLectureId() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

// Render lecture page
function renderLecture() {
    const id = getLectureId();
    const lecture = LECTURES.find(l => l.id === id);

    if (!lecture) {
        document.querySelector('.lecture-container').innerHTML = `
            <div style="text-align:center; padding:100px 24px;">
                <h2>Lecture not found</h2>
                <p style="color:var(--text-secondary); margin-top:8px;">This lecture doesn't exist yet.</p>
                <a href="index.html" style="color:var(--accent); margin-top:16px; display:inline-block;">Go back to lectures</a>
            </div>
        `;
        return;
    }

    // Update page title
    document.title = `${lecture.title} - Quantum Chemistry`;

    // Render header - title is Lecture XX, subtitle is LN XX
    const header = document.getElementById('lecture-header');
    const num = String(lecture.id).padStart(2, '0');
    header.innerHTML = `
        <div class="lecture-number-large">${num}</div>
        <h1>${lecture.title}</h1>
        <p>${lecture.subtitle}</p>
    `;

    // Render video
    const videoSection = document.getElementById('video-section');
    if (lecture.videoId) {
        videoSection.innerHTML = `
            <div class="video-wrapper">
                <iframe 
                    src="https://www.youtube.com/embed/${lecture.videoId}" 
                    title="${lecture.title}"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
            <div class="video-actions-center">
                <a href="${lecture.videoUrl}" target="_blank" class="btn-youtube">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    Watch on YouTube
                </a>
            </div>
        `;
    } else {
        videoSection.innerHTML = `
            <div class="no-quiz">
                <div class="no-quiz-icon">🎬</div>
                <h3>Video Coming Soon</h3>
                <p>This lecture hasn't been uploaded yet.</p>
            </div>
        `;
    }

    // Render quiz section — button only, no iframe
    const quizSection = document.getElementById('quiz-section');
    if (lecture.quizUrl) {
        quizSection.innerHTML = `
            <div class="quiz-mandatory-card">
                <div class="quiz-mandatory-banner">
                    <div class="quiz-mandatory-badge">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        Mandatory — Do Not Skip
                    </div>
                </div>
                <div class="quiz-mandatory-content">
                    <div class="quiz-mandatory-icon">📝</div>
                    <h3>Take the Quiz — ${lecture.title}</h3>
                    <p class="quiz-mandatory-desc">
                        This quiz is <strong>mandatory</strong> before moving to the next lecture. 
                        It tests whether you've truly understood the key concepts covered. 
                        If you skip it, you'll have gaps in your understanding that will make future lectures harder — and it <strong>will</strong> affect your final grade.
                    </p>
                    <div class="quiz-mandatory-points">
                        <div class="quiz-point">
                            <span class="quiz-point-icon">✅</span>
                            <span>Covers all key concepts from this lecture</span>
                        </div>
                        <div class="quiz-point">
                            <span class="quiz-point-icon">⚠️</span>
                            <span>Must complete before proceeding to the next lecture</span>
                        </div>
                        <div class="quiz-point">
                            <span class="quiz-point-icon">🎯</span>
                            <span>Skipping will leave gaps that affect your pass</span>
                        </div>
                    </div>
                    <a href="${lecture.quizUrl}" target="_blank" class="btn-take-quiz">
                        Open Quiz
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                </div>
            </div>
        `;
    } else {
        quizSection.innerHTML = `
            <div class="quiz-card quiz-card-disabled">
                <div class="quiz-card-header">
                    <div class="quiz-card-icon">📝</div>
                    <div class="quiz-card-info">
                        <div class="quiz-required-badge">
                            <span class="required-dot"></span>
                            Required
                        </div>
                        <h3>Quiz Coming Soon</h3>
                        <p>The quiz for this lecture will be available soon.</p>
                    </div>
                </div>
            </div>
        `;
    }
}

renderLecture();
