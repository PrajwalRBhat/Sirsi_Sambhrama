document.addEventListener("DOMContentLoaded", () => {
    const SUPABASE_URL = window.SUPABASE_URL;
    const SUPABASE_KEY = window.SUPABASE_KEY;
    const newsGrid = document.querySelector('.news-grid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loader = document.querySelector('.load-controls .loader');
    const categoryTitle = document.getElementById('category-title');
    let articles = [];
    let currentIndex = 0;
    const articlesPerClick = 8;

    sessionStorage.setItem('lastVisitedPage', window.location.href);

    function restoreScroll() {
        const savedPos = sessionStorage.getItem('categoryScrollPos');
        if (savedPos) {
            window.scrollTo(0, parseInt(savedPos));
            sessionStorage.removeItem('categoryScrollPos');
        }
    }

    newsGrid.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
            sessionStorage.setItem('categoryScrollPos', window.scrollY);
        }
    });

    function getCategoryFromURL() {
        return new URLSearchParams(window.location.search).get('name');
    }

    async function fetchCategoryArticles(category) {
        if (!category) {
            categoryTitle.textContent = "Category Not Found";
            return;
        }
        categoryTitle.textContent = `${category} News`;
        document.title = `${category} - ಶಿರಸಿ ಸಂಭ್ರಮ`;
        loader.style.display = 'block';
        
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/News Articles?select=*&category=ilike.${category}&is_published=eq.true&order=display_date.desc`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
            if (!response.ok) throw new Error("Fetch failed");
            articles = await response.json();
            showArticleList(articlesPerClick);
        } catch (err) {
            console.error(err);
            newsGrid.innerHTML = `<p>Failed to load news.</p>`;
        } finally {
            loader.style.display = 'none';
        }
    }

    function createArticleCard(art) {
        const cat = getCategoryFromURL();
        const el = document.createElement("article");
        el.innerHTML = `
          <div class="image-box">
            <a href="article.html?id=${art.id}&from=category&name=${cat}">
                <img src="${art.image_url}" alt="${art.title}" loading="lazy">
            </a>
          </div>
          <div class="details-box">
            <a href="article.html?id=${art.id}&from=category&name=${cat}">
                <h3>${art.title}</h3>
            </a>
            <p class="description">${art.article.substring(0, 100)}...</p> 
          </div>`;
        return el;
    }

    function showArticleList(count) {
        if (articles.length === 0) {
            newsGrid.innerHTML = `<p style="text-align: center;">No articles found.</p>`;
            loadMoreBtn.style.display = 'none';
            return;
        }
        const fragment = document.createDocumentFragment();
        const endIndex = Math.min(currentIndex + count, articles.length);
        for (let i = currentIndex; i < endIndex; i++) {
            fragment.appendChild(createArticleCard(articles[i]));
        }
        newsGrid.appendChild(fragment);
        currentIndex = endIndex;
        setTimeout(restoreScroll, 100);
        loadMoreBtn.style.display = (currentIndex >= articles.length) ? 'none' : 'inline-block';
    }

    loadMoreBtn.addEventListener('click', () => showArticleList(articlesPerClick));
    fetchCategoryArticles(getCategoryFromURL());
});