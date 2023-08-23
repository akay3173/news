        const API_KEY = "c67d177805c340db869b57c3f82c84f2";
        const url = "https://newsapi.org/v2/everything?q=";

        window.addEventListener("load", () => fetchNews("India"));

        function reload() {
            window.location.reload();
        }

        async function fetchNews(query) {
            const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
            const data = await res.json();
            bindData(data.articles);
        }

        function bindData(articles) {
            const cardsContainer = document.getElementById("cards-container");
            const newsCardTemplate = document.getElementById("template-news");
        
            cardsContainer.innerHTML = '';
        
            if (!Array.isArray(articles)) {
                console.error("Invalid data format. Expected an array of articles.");
                console.error("Received data:", articles);
                return;
            }
        
            if (articles.length === 0) {
                console.log("No articles found.");
                return;
            }
        
            articles.forEach(article => {
                if (!article.urlToImage) {
                    console.warn("Article skipped due to missing image:", article);
                    return;
                }
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

        let curSelectedNav = null;

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
            const query = searchtext.value;
            if (!query) return;
            fetchNews(query);
            if (curSelectedNav) {
                curSelectedNav.classList.remove("active");
                curSelectedNav = null;
            }
        });
