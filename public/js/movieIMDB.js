const API_KEY = 'b7a4aa1e';
const container = document.getElementById('movieDetailPage');

async function fetchMovieDetails(id) {
    try {
        const r = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
        );
        const data = await r.json();
        if (data.Response === 'True') displayMovieDetails(data);
        else container.innerHTML = '<p>Details not found.</p>';
    } catch (e) {
        console.error(e);
        container.innerHTML = '<p>Error loading details.</p>';
    }
}

function displayMovieDetails(m) {
    container.innerHTML = `
    <div class="movie-box">
      <img
        src="${m.Poster !== 'N/A' ? m.Poster : 'error-img.png'}"
        alt="${m.Title}"
        onerror="this.onerror=null;this.src='error-img.png';"
      />
      <div class="movie-details">
        <h2>${m.Title} (${m.Year})</h2>
        <p><strong>Released:</strong> ${m.Released}</p>
        <p><strong>IMDB Rating:</strong> ${m.imdbRating}</p>
        <p><strong>Genre:</strong> ${m.Genre}</p>
        <p><strong>Director:</strong> ${m.Director}</p>
        <p><strong>Writer:</strong> ${m.Writer}</p>
        <p><strong>Actors:</strong> ${m.Actors}</p>
        <p><strong>Plot:</strong> ${m.Plot}</p>
      </div>
    </div>
  `;
}

const params = new URLSearchParams(window.location.search);
const id = params.get('imdbID');
if (id) fetchMovieDetails(id);
else container.innerHTML = '<p>No movie specified.</p>';