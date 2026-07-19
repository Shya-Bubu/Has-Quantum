// Fallback lectures if list.txt fails to load
const FALLBACK_LECTURES = [
    {
        id: 1,
        title: "Lecture 01",
        subtitle: "LN 02",
        status: "available",
        videoId: "eVgvWYz7feM",
        videoUrl: "https://youtu.be/eVgvWYz7feM?list=PLLstkJYnU01o",
        quizUrl: "https://notebooklm.google.com/notebook/c0c68814-f14e-4aed-9e3b-1ffbe8bab382/artifact/eb922fbb-1cac-4e1e-b7f0-5e43a5a7023d"
    },
    {
        id: 2,
        title: "Lecture 02",
        subtitle: "LN 03",
        status: "available",
        videoId: "k1QUahIlY3U",
        videoUrl: "https://youtu.be/k1QUahIlY3U?list=PLLstkJYnU01o",
        quizUrl: "https://notebooklm.google.com/notebook/f310388d-afdd-4d29-b373-b94d1d79118c/artifact/c8ee9944-0832-422f-8682-7c2a6e1c534d"
    },
    {
        id: 3,
        title: "Lecture 03",
        subtitle: "LN 04",
        status: "available",
        videoId: "FlXpi6B0xD8",
        videoUrl: "https://youtu.be/FlXpi6B0xD8",
        quizUrl: "https://notebooklm.google.com/notebook/137a289a-6638-4195-b593-59c3d3429b1f/artifact/7097212d-6680-45cd-a1c1-3b487d5827cf"
    },
    {
        id: 4,
        title: "Lecture 04",
        subtitle: "Coming Soon",
        status: "upcoming",
        videoId: null,
        videoUrl: null,
        quizUrl: null
    },
    {
        id: 5,
        title: "Lecture 05",
        subtitle: "Coming Soon",
        status: "upcoming",
        videoId: null,
        videoUrl: null,
        quizUrl: null
    },
    {
        id: 6,
        title: "Lecture 06",
        subtitle: "Coming Soon",
        status: "upcoming",
        videoId: null,
        videoUrl: null,
        quizUrl: null
    },
    {
        id: 7,
        title: "Lecture 07",
        subtitle: "Coming Soon",
        status: "upcoming",
        videoId: null,
        videoUrl: null,
        quizUrl: null
    },
    {
        id: 8,
        title: "Lecture 08",
        subtitle: "Coming Soon",
        status: "upcoming",
        videoId: null,
        videoUrl: null,
        quizUrl: null
    },
    {
        id: 9,
        title: "Lecture 09",
        subtitle: "Coming Soon",
        status: "upcoming",
        videoId: null,
        videoUrl: null,
        quizUrl: null
    },
    {
        id: 10,
        title: "Lecture 10",
        subtitle: "Coming Soon",
        status: "upcoming",
        videoId: null,
        videoUrl: null,
        quizUrl: null
    }
];

window.LECTURES = FALLBACK_LECTURES;
window.lecturesLoaded = false;

// Parser function to parse list.txt content dynamically
function parseListTxt(text) {
    const lines = text.split('\n');
    let section = '';
    const youtubeData = {};
    const quizData = {};
    
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        
        if (line.toLowerCase().startsWith('youtube')) {
            section = 'youtube';
            continue;
        }
        if (line.toLowerCase().startsWith('quiz')) {
            section = 'quiz';
            continue;
        }
        
        const match = line.match(/^vid_(\d+)\s*=\s*(.*)$/i);
        if (match) {
            const id = parseInt(match[1]);
            const rest = match[2].trim();
            if (section === 'youtube') {
                if (!rest) {
                    youtubeData[id] = null;
                } else {
                    let url = rest;
                    let label = '';
                    const quoteIndex = rest.indexOf("'");
                    if (quoteIndex !== -1) {
                        url = rest.substring(0, quoteIndex).trim();
                        label = rest.substring(quoteIndex + 1).replace(/'$/, '').trim();
                    } else {
                        const doubleQuoteIndex = rest.indexOf('"');
                        if (doubleQuoteIndex !== -1) {
                            url = rest.substring(0, doubleQuoteIndex).trim();
                            label = rest.substring(doubleQuoteIndex + 1).replace(/"$/, '').trim();
                        }
                    }
                    
                    let videoId = null;
                    if (url) {
                        if (url.includes('youtu.be/')) {
                            const parts = url.split('youtu.be/');
                            if (parts[1]) {
                                videoId = parts[1].split('?')[0].split('&')[0];
                            }
                        } else if (url.includes('youtube.com/embed/')) {
                            const parts = url.split('youtube.com/embed/');
                            if (parts[1]) {
                                videoId = parts[1].split('?')[0].split('&')[0];
                            }
                        } else if (url.includes('v=')) {
                            const queryStr = url.split('?')[1] || '';
                            const urlParams = new URLSearchParams(queryStr);
                            videoId = urlParams.get('v');
                        } else if (url.includes('youtube.com/shorts/')) {
                            const parts = url.split('youtube.com/shorts/');
                            if (parts[1]) {
                                videoId = parts[1].split('?')[0].split('&')[0];
                            }
                        }
                    }
                    
                    let subtitle = 'LN ' + String(id + 1).padStart(2, '0');
                    if (label.includes('-')) {
                        subtitle = label.split('-')[1].trim();
                    } else if (label) {
                        subtitle = label;
                    }
                    
                    youtubeData[id] = {
                        videoUrl: url,
                        videoId: videoId,
                        title: "Lecture " + String(id).padStart(2, '0'),
                        subtitle: subtitle
                    };
                }
            } else if (section === 'quiz') {
                if (rest) {
                    let url = rest;
                    const quoteIndex = rest.indexOf("'");
                    if (quoteIndex !== -1) {
                        url = rest.substring(0, quoteIndex).trim();
                    }
                    quizData[id] = url;
                } else {
                    quizData[id] = null;
                }
            }
        }
    }
    
    const lectures = [];
    const maxId = Math.max(10, ...Object.keys(youtubeData).map(Number), ...Object.keys(quizData).map(Number));
    
    for (let i = 1; i <= maxId; i++) {
        const yt = youtubeData[i];
        const quizUrl = quizData[i] || null;
        const isAvailable = (yt && yt.videoUrl) || quizUrl;
        
        if (isAvailable) {
            lectures.push({
                id: i,
                title: yt ? yt.title : ("Lecture " + String(i).padStart(2, '0')),
                subtitle: yt ? yt.subtitle : "Quiz Available",
                status: "available",
                videoId: yt ? yt.videoId : null,
                videoUrl: yt ? yt.videoUrl : null,
                quizUrl: quizUrl
            });
        } else {
            lectures.push({
                id: i,
                title: "Lecture " + String(i).padStart(2, '0'),
                subtitle: "Coming Soon",
                status: "upcoming",
                videoId: null,
                videoUrl: null,
                quizUrl: null
            });
        }
    }
    return lectures;
}

// Perform fetching of list.txt
fetch('list.txt')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(text => {
        window.LECTURES = parseListTxt(text);
        window.lecturesLoaded = true;
        // Dispatch custom event to notify listeners
        window.dispatchEvent(new CustomEvent('lecturesloaded', { detail: window.LECTURES }));
    })
    .catch(err => {
        console.error("Could not load list.txt dynamically, falling back to static array:", err);
    });
