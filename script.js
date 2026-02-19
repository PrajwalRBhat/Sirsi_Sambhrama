document.addEventListener("DOMContentLoaded", () => {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    const SUPABASE_URL = window.SUPABASE_URL;
    const SUPABASE_KEY = window.SUPABASE_KEY;
    const newsGrid = document.querySelector('.news-grid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loader = document.querySelector('.load-controls .loader');
    const trendingList = document.getElementById('trending-list'); 
    const articlesPerClick = 8;
    let articles = [];
    let currentIndex = 0;

    function restoreScroll() {
        const savedPos = sessionStorage.getItem('scrollPos');
        if (savedPos) {
            window.scrollTo(0, parseInt(savedPos));
            sessionStorage.removeItem('scrollPos');
        }
    }

    newsGrid.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
            sessionStorage.setItem('scrollPos', window.scrollY);
        }
    });

    async function fetchBreakingNews() {
        const tickerTrack = document.getElementById('breaking-ticker');
        if (!tickerTrack) return;
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/News Articles?is_breaking=eq.true&is_published=eq.true&select=*&limit=5`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
            const data = await response.json();
            if (data?.length > 0) {
                const newsHTML = data.map(art => `<a href="article.html?id=${art.id}&from=home" class="ticker-item">${art.title}</a>`).join('');
                
                const updateTickerSpeed = () => {
                    const isPC = window.innerWidth > 1024;
                    tickerTrack.innerHTML = isPC ? newsHTML : newsHTML + newsHTML + newsHTML;
                    
                    requestAnimationFrame(() => {
                        const speed = isPC ? 120 : 80; 
                        const distance = isPC ? (tickerTrack.scrollWidth + tickerTrack.parentElement.offsetWidth) : (tickerTrack.scrollWidth / 3);
                        tickerTrack.style.animationDuration = `${distance / speed}s`;
                    });
                };

                updateTickerSpeed();

                let resizeTimer;
                window.addEventListener('resize', () => {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(updateTickerSpeed, 250);
                });
            }
        } catch (err) { console.error(err); }
    }

    async function fetchTrendingNews() {
        if (!trendingList) return;
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/News Articles?is_trending=eq.true&is_published=eq.true&select=id,title&order=display_date.desc&limit=4`, {
                headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
            });
            const data = await response.json();
            trendingList.innerHTML = data.length ? data.map(art => `<li><a href="article.html?id=${art.id}&from=home">${art.title}</a></li>`).join('') : '<li>No trending news.</li>';
        } catch (err) { trendingList.innerHTML = '<li>Error loading stories.</li>'; }
    }

    async function fetchArticleList() {
        loader.style.display = 'block';
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/News Articles?select=*&is_breaking=is.false&is_published=eq.true&order=display_date.desc`, {
                headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
            });
            articles = await response.json();
            showArticleList(articlesPerClick);
        } catch (err) { newsGrid.innerHTML = `<p class="error-message">Failed to load news.</p>`; }
        finally { loader.style.display = 'none'; }
    }

    function showArticleList(count) {
        const fragment = document.createDocumentFragment();
        const endIndex = Math.min(currentIndex + count, articles.length);
        for (let i = currentIndex; i < endIndex; i++) {
            const art = articles[i];
            const el = document.createElement("article");
            el.innerHTML = `
                <div class="image-box"><a href="article.html?id=${art.id}&from=home"><img src="${art.image_url}" alt="${art.title}" loading="lazy"></a></div>
                <div class="details-box">
                    <a href="article.html?id=${art.id}&from=home"><h3>${art.title}</h3></a>
                    <p class="description">${art.article}</p> 
                </div>`;
            fragment.appendChild(el);
        }
        newsGrid.appendChild(fragment);
        currentIndex = endIndex;
        setTimeout(restoreScroll, 100);
        loadMoreBtn.style.display = currentIndex >= articles.length ? 'none' : 'inline-block';
    }

    loadMoreBtn.addEventListener('click', () => showArticleList(articlesPerClick));
    fetchArticleList();
    fetchBreakingNews();
    fetchTrendingNews(); 
});