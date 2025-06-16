// Dark Mode:
// Apply saved mode on load
window.addEventListener("DOMContentLoaded", () => {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    applyMode(isDarkMode);
});

// Toggle on button click
document.getElementById("moonDark").onclick = () => {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    localStorage.setItem("darkMode", !isDarkMode);
    applyMode(!isDarkMode);
};

// Function to apply mode
function applyMode(isDark) {
    const header = document.querySelector("header");
    const sidebar = document.getElementById("sidebar");
    const mainWrap = document.querySelector(".mainWrap");
    const mainWrapRating = document.querySelector(".mainWrapRating"); 
    const paragraphs = document.querySelectorAll("p");
    const brgrBtn = document.getElementById("burgerBtn");

    if (isDark) {
        header.style.backgroundColor = "#393E46";
        sidebar.style.backgroundColor = "#393E46";
        if (mainWrap) mainWrap.style.backgroundColor = "#222831";
        if (mainWrapRating) mainWrapRating.style.backgroundColor = "#222831"; 
        brgrBtn.style.color = "#ffffff";
        paragraphs.forEach(p => p.style.color = "white");
    } else {
        header.style.backgroundColor = "#ffffff";
        sidebar.style.backgroundColor = "#ffffff";
        if (mainWrap) mainWrap.style.backgroundColor = "#F5F5F5";
        if (mainWrapRating) mainWrapRating.style.backgroundColor = "#F5F5F5";
        brgrBtn.style.color = "#000000";
        paragraphs.forEach(p => p.style.color = "black");
    }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Menu:
document.getElementById("burgerBtn").addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    const mainWrap = document.querySelector(".mainWrap");
    const bodyRating = document.querySelector(".mainWrapRating .bodyRating");

    sidebar.classList.toggle("open");

    if (sidebar.classList.contains("open")) {
        // Sidebar is shown — shrink both mainWrap and bodyRating
        mainWrap?.classList.remove("fullscreen");
        bodyRating?.classList.remove("fullscreen");
    } else {
        // Sidebar is hidden — make both mainWrap and bodyRating take full width
        mainWrap?.classList.add("fullscreen");
        bodyRating?.classList.add("fullscreen");
    }
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// animation for scrolling vertical:
document.addEventListener("DOMContentLoaded", () => {
    // Animate appearance of movie sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.movies').forEach(el => {
        observer.observe(el);
    });

    // Horizontal scroll logic per each .movies section
    document.querySelectorAll('.movies').forEach(moviesSection => {
        const scrollable = moviesSection.querySelector('.scrollable');
        const scrollLeftBtn = moviesSection.querySelector('.scrollLeft');
        const scrollRightBtn = moviesSection.querySelector('.scrollRight');
        const scrollAmount = 300;

        scrollLeftBtn.addEventListener('click', () => {
            scrollable.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        scrollRightBtn.addEventListener('click', () => {
            scrollable.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        // Optional: Animate images inside each scrollable container
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = "translateY(0)";
                }
            });
        }, {
            root: scrollable,
            threshold: 0.1
        });

        scrollable.querySelectorAll('img').forEach(img => {
            img.style.opacity = 0;
            img.style.transform = "translateY(50px)";
            img.style.transition = "all 0.6s ease-out";
            imgObserver.observe(img);
        });
    });
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// search movie and gives me rating:
function searchMovie() {
    const movieName = document.getElementById('searchText').value.trim();
    if (movieName) {
        const encoded = encodeURIComponent(movieName);
        // Open in the same window
        window.location.href = `rating.html?title=${encoded}`;
    } else {
        alert("Please enter a movie name.");
    }
}

// Click on search icon
document.getElementById('searchIcon').addEventListener('click', searchMovie);

// Press Enter inside the search input
document.getElementById('searchText').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchMovie();
    }
});


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// KeyBoard:
const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    ['SPACE', 'DEL', 'ENTER']
];

// Create and attach the keyboard
const keyboardDiv = document.createElement('div');
keyboardDiv.id = 'virtualKeyboard';
document.body.appendChild(keyboardDiv);

function createKeyboard() {
    keyboardDiv.innerHTML = ''; // Clear previous keys
    keyboardLayout.forEach(row => {
        const rowDiv = document.createElement('div');
        row.forEach(key => {
            const keyBtn = document.createElement('span');
            keyBtn.className = 'key';
            keyBtn.textContent = key === 'SPACE' ? '␣' : key;
            keyBtn.addEventListener('click', () => handleKeyPress(key));
            rowDiv.appendChild(keyBtn);
        });
        keyboardDiv.appendChild(rowDiv);
    });
}

function handleKeyPress(key) {
    const input = document.getElementById('searchText');
    if (key === 'SPACE') {
        input.value += ' ';
    } else if (key === 'DEL') {
        input.value = input.value.slice(0, -1);
    } else if (key === 'ENTER') {
        searchMovie(); // Trigger search
    } else {
        input.value += key;
    }
    input.focus();
}

// Show/hide when clicking the icon
document.getElementById('keyboardIcon').addEventListener('click', () => {
    if (keyboardDiv.style.display === 'none') {
        createKeyboard();
        keyboardDiv.style.display = 'block';
    } else {
        keyboardDiv.style.display = 'none';
    }
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// click on movie image and show us rating+movie+comments.

function goToRatingPageFromImage(event) {
    const movieTitle = event.target.alt.trim();
    if (movieTitle) {
        const encoded = encodeURIComponent(movieTitle);
        window.location.href = `rating.html?title=${encoded}`;
    }
}

// add alt
document.querySelectorAll('.scrollable img').forEach(img => {
    img.style.cursor = "pointer";
    img.addEventListener('click', goToRatingPageFromImage);
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// for music:

// Select all SongContainers and loop through them
const cards = document.querySelectorAll(".SongContainer");

cards.forEach(card => {
    const audio = card.querySelector("audio");

    card.addEventListener("click", () => {
        // Pause any other playing audio
        document.querySelectorAll("audio").forEach(a => {
            if (a !== audio) {
                a.pause();
                a.closest(".SongContainer").classList.remove("playing");
            }
        });

        if (audio.paused) {
            audio.currentTime = 0;
            audio.play();
        } else {
            audio.pause();
        }
    });

    // Add class when audio plays
    audio.addEventListener("play", () => {
        card.classList.add("playing");
    });

    // Remove class when audio pauses or ends
    audio.addEventListener("pause", () => {
        card.classList.remove("playing");
    });

    audio.addEventListener("ended", () => {
        card.classList.remove("playing");
    });
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// for rating:




