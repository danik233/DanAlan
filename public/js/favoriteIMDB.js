const favContainer = document.getElementById('favoritesList');
let favorites = [];

window.addEventListener('load', () => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
        favorites = JSON.parse(stored);
        renderFavorites();
    }
});

function renderFavorites() {
    favContainer.innerHTML = '';
    if (favorites.length === 0) {
        favContainer.innerHTML = '<p>No favorites yet.</p>';
        return;
    }

    favorites.forEach(m => {
        const div = document.createElement('div');
        div.className = 'favorite-movie';
        div.innerHTML = `
      <a href="movieIMDB.html?imdbID=${m.imdbID}">
        <img
          src="${m.Poster !== 'N/A' ? m.Poster : 'error-img.png'}"
          alt="${m.Title}"
          onerror="this.onerror=null;this.src='error-img.png';"
        />
      </a>
      <div class="movie-details">
        <h2>${m.Title}</h2>
        <button data-id="${m.imdbID}" class="remove-btn">Remove</button>
      </div>
    `;
        div.querySelector('.remove-btn')
            .addEventListener('click', () => removeFavorite(m.imdbID));
        favContainer.appendChild(div);
    });
}

function removeFavorite(id) {
    favorites = favorites.filter(m => m.imdbID !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
}