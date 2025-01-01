
const newsCategory = document.getElementById('category');
const preferencesForm = document.getElementById('preferences-form');
const newsContainer = document.getElementById('news-articles');
const loader = document.getElementById('loader');
const greeting = document.getElementById('greeting');

const apiKey = '32d5e22c99344a55b0d1c2754ffb4858'; 
const apiUrl = 'https://newsapi.org/v2/top-headlines';


const hours = new Date().getHours();
if (hours < 12) {
    greeting.innerHTML = "Good Morning!";
} else if (hours < 18) {
    greeting.innerHTML = "Good Afternoon!";
} else {
    greeting.innerHTML = "Good Evening!";
}

preferencesForm.addEventListener('submit', fetchNews);


function fetchNews(event) {
    event.preventDefault(); 
    const category = newsCategory.value || 'general';
    const url = `${apiUrl}?country=us&category=${category}&apiKey=${apiKey}`;


    loader.classList.remove('hidden');
    newsContainer.innerHTML = ''; 

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            loader.classList.add('hidden'); 
            if (data.status === 'ok' && data.articles.length > 0) {
                displayNews(data.articles);
            } else {
                newsContainer.innerHTML = '<p>No news available for this category. Try another one!</p>';
            }
        })
        .catch(error => {
            loader.classList.add('hidden'); 
            newsContainer.innerHTML = '<p>Something went wrong. Please try again later.</p>';
            console.error('Fetch error:', error);
        });
}


function displayNews(articles) {
    
    const validArticles = articles.filter(article => {
        return article.title && article.description && article.url 
            && article.title.trim() !== '' && article.description.trim() !== ''
            && !article.title.includes('[Removed]') && !article.description.includes('[Removed]')
            && !article.url.includes('[Removed]');
    });

    if (validArticles.length === 0) {
        newsContainer.innerHTML = '<p>No valid news articles found for this category.</p>';
        return; 
    }

    
    validArticles.forEach(article => {
        const articleEle = document.createElement('div');
        articleEle.classList.add('article');

        articleEle.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <a href="${article.url}" target="_blank">Read More</a>
        `;

        
        articleEle.addEventListener('click', () => {
            articleEle.classList.toggle('expanded');
        });

        newsContainer.appendChild(articleEle);
    });
}
