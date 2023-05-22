const API_KEY = 'k3YyNrN9XHrbYbSZGPDSebL25JzffpDO';
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const gifList = document.getElementById('gif-list');
let offset = 0;
let limit = 10;
let fetching = false;

// Fetch and display trending GIFs on page load
window.addEventListener('load', () => {
  fetchTrendingGifs();
});

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value;
  searchGifs(searchTerm);
});

window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    if (!fetching) {
      fetchMoreGifs();
    }
  }
});

function fetchTrendingGifs() {
  const url = `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=${limit}&offset=${offset}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayGifs(data.data);
      offset += limit;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function searchGifs(searchTerm) {
  offset = 0;
  gifList.innerHTML = '';
  fetchMoreGifs(searchTerm);
}

function fetchMoreGifs(searchTerm) {
  fetching = true;
  let url = `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=${limit}&offset=${offset}`;

  if (searchTerm) {
    url = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=${limit}&offset=${offset}`;
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayGifs(data.data);
      offset += limit;
      fetching = false;
    })
    .catch(error => {
      console.error('Error:', error);
      fetching = false;
    });
}

function displayGifs(gifs) {
  gifs.forEach(gif => {
    const gifItem = document.createElement('div');
    gifItem.classList.add('gif-item');

    const img = document.createElement('img');
    img.src = gif.images.fixed_width.url;
    gifItem.appendChild(img);

    const copyButton = document.createElement('button');
    copyButton.classList.add('copy-button');
    copyButton.innerText = 'Copy';
    copyButton.addEventListener('click', () => {
      copyToClipboard(gif.images.fixed_width.url);
    });
    gifItem.appendChild(copyButton);

    gifList.appendChild(gifItem);
  });
}

function copyToClipboard(text) {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);

  alert('GIF URL copied!');
}
