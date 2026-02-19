document.addEventListener("DOMContentLoaded", () => {
    const SUPABASE_URL = window.SUPABASE_URL;
    const SUPABASE_KEY = window.SUPABASE_KEY;
    const articleView = document.getElementById('article-view');
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');

    function getArticleIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    async function fetchSingleArticle(articleId) {
        if (!articleId) {
            articleView.innerHTML = `<p>Article ID not found.</p>`;
            return;
        }
        articleView.innerHTML = `<div class="loader"></div>`;
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/News%20Articles?id=eq.${articleId}&select=*`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (data && data.length > 0) {
                displayFullArticle(data[0]);
            } else {
                throw new Error('Article not found.');
            }
        } catch (err) {
            console.error(err);
            articleView.innerHTML = `<p>Could not load the article.</p>`;
        }
    }

    function displayFullArticle(article) {
        document.title = `${article.title} - ಶಿರಸಿ ಸಂಭ್ರಮ`;
        const date = new Date(article.display_date);
        const formattedDate = date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) + 
                             ' | ' + 
                             date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });

        const paragraphs = article.article.split('\n').filter(p => p.trim() !== '');
        const firstParagraph = `<p>${paragraphs[0]}</p>`;
        const restOfArticle = paragraphs.slice(1).map(p => `<p>${p}</p>`).join('');

        let editorsNoteHtml = '';
        if (article.editors_note) {
            const noteContent = article.editors_note.split('\n').filter(p => p.trim() !== '').map(p => `<p>${p}</p>`).join('');
            editorsNoteHtml = `<aside class="note-beside-text"><h3>From the Editor's Desk</h3><div class="note-content">${noteContent}</div></aside>`;
        }

        articleView.innerHTML = `
            <div class="full-article">
                <h1>${article.title}</h1>
                <div class="article-meta">
                    <span><strong>Edited by:</strong> ${article.editor || 'Editorial Staff'}</span>
                    <span><strong>Published on:</strong> ${formattedDate}</span>
                </div>
                <div class="article-content">${firstParagraph}</div>
                <figure>
                    <img id="article-image" src="${article.image_url}" alt="${article.title}">
                    ${article.image_cap ? `<figcaption>${article.image_cap}</figcaption>` : ''}
                </figure>
                <div class="article-content">${editorsNoteHtml}${restOfArticle}</div>
                <a href="index.html" id="back-button">&larr; Back to News</a>
            </div>
        `;

        document.getElementById('back-button').addEventListener('click', (e) => {
            e.preventDefault();
            const origin = new URLSearchParams(window.location.search).get('from');
            if (origin && window.history.length > 1) {
                window.history.back();
            } else {
                window.location.replace('index.html');
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target.id === "article-image") {
            imageModal.style.display = "flex";
            modalImage.src = e.target.src;
        } else if (e.target.classList.contains('close-button') || e.target.id === 'image-modal') {
            imageModal.style.display = "none";
        }
    });

    fetchSingleArticle(getArticleIdFromURL());
});