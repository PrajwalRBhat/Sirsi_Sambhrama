document.addEventListener("DOMContentLoaded", () => {
    const SUPABASE_URL = window.SUPABASE_URL;
    const SUPABASE_KEY = window.SUPABASE_KEY;
    let horizontalAds = [];
    let sidebarAds = [];

    async function fetchAds() {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/Advertisements?select=*&is_active=eq.true`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
            if (!response.ok) throw new Error("Ad fetch failed");
            const allAds = await response.json();
            horizontalAds = allAds.filter(ad => ad.is_horizontal);
            sidebarAds = allAds.filter(ad => !ad.is_horizontal);
            
            renderAds();

            if (horizontalAds.length > 1) {
                setInterval(rotateHorizontalBanners, 15000);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const getAdHtml = (ad) => {
        const content = `<img src="${ad.image_url}" alt="Promotion">`;
        return (ad.ad_type?.toLowerCase() === 'job') 
            ? `<div class="promo-container">${content}</div>`
            : `<a href="${ad.link_url}" class="promo-container" target="_blank" rel="noopener noreferrer">${content}</a>`;
    };

    function renderAds() {
        const adSlots = document.querySelectorAll('.promo-box');
        let availH = [...horizontalAds].sort(() => Math.random() - 0.5);
        let availS = [...sidebarAds].sort(() => Math.random() - 0.5);

        adSlots.forEach(slot => {
            if (slot.classList.contains('banner-promo')) {
                if (availH.length > 0) slot.innerHTML = `<div class="single-ad-layout">${getAdHtml(availH.pop())}</div>`;
            } else {
                const isSplit = Math.random() > 0.7 && availS.length >= 2;
                slot.innerHTML = isSplit 
                    ? `<div class="promo-grid">${getAdHtml(availS.pop())}${getAdHtml(availS.pop())}</div>`
                    : `<div class="single-ad-layout">${getAdHtml(availS.pop() || availH.pop())}</div>`;
            }
        });
    }

    function rotateHorizontalBanners() {
        const bannerSlots = document.querySelectorAll('.promo-box.banner-promo');
        bannerSlots.forEach(slot => {
            const adContainer = slot.querySelector('.single-ad-layout');
            const currentImg = slot.querySelector('img');
            if (!adContainer || !currentImg) return;

            const currentSrc = currentImg.src;
            const otherAds = horizontalAds.filter(ad => ad.image_url !== currentSrc);
            const pool = otherAds.length > 0 ? otherAds : horizontalAds;

            adContainer.classList.add('ad-exit');

            setTimeout(() => {
                const randomAd = pool[Math.floor(Math.random() * pool.length)];
                if (randomAd) {
                    slot.innerHTML = `<div class="single-ad-layout ad-enter">${getAdHtml(randomAd)}</div>`;
                    
                    requestAnimationFrame(() => {
                        const newContainer = slot.querySelector('.single-ad-layout');
                        setTimeout(() => {
                            newContainer.classList.remove('ad-enter');
                        }, 50);
                    });
                }
            }, 500);
        });
    }

    fetchAds();
});