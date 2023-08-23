const API_KEY = "c67d177805c340db869b57c3f82c84f2";
const url = "https://newsapi.org/v2/everything?q=";
const cardsContainer = document.getElementById("cards-container");
const newsCardTemplate = document.getElementById("template-news");
let curSelectedNav = null;

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        const data = await res.json();
        if (data.status === "ok") {
            bindData(data.articles);
        } else {
            console.error("Failed to fetch news data.");
        }
    } catch (error) {
        console.error("An error occurred while fetching news:", error);
    }
}

function bindData(articles) {
    cardsContainer.innerHTML = '';

    if (!Array.isArray(articles)) {
        console.error("Invalid data format. Expected an array of articles.");
        return;
    }

    if (articles.length === 0) {
        console.log("No articles found.");
        return;
    }

    articles.forEach(article => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector('#src');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');
    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
    newsSource.innerHTML = `${article.source.name} ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    if (curSelectedNav) {
        curSelectedNav.classList.remove('active');
    }
    curSelectedNav = navItem;
    curSelectedNav.classList.add('active');
}

const searchbutton = document.getElementById("searchit");
const searchtext = document.getElementById("search-text");
searchbutton.addEventListener("click", () => {
    const query = searchtext.value.trim();
    if (!query) return;
    fetchNews(query);
    if (curSelectedNav) {
        curSelectedNav.classList.remove("active");
        curSelectedNav = null;
    }
});
