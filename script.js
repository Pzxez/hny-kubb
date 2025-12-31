// Configuration
const TARGET_DATE = new Date("2026-01-01T00:00:00+07:00").getTime();
// BYPASS: Set to current time to show celebration immediately
// const TARGET_DATE = new Date().getTime() - 1000;
// For testing/debugging, uncomment the line below to set countdown to 10 seconds from now
// const TARGET_DATE = new Date().getTime() + 10000; 

// DOM Elements
const timerEl = document.getElementById('timer');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

const sceneCountdown = document.getElementById('scene-countdown');
const sceneCelebration = document.getElementById('scene-celebration');
const sceneLetter = document.getElementById('scene-letter');
const sceneGallery = document.getElementById('scene-gallery');

const openLetterBtn = document.getElementById('open-letter-btn');
const letterContent = document.getElementById('letter-content');
const galleryPhotos = document.querySelectorAll('.photo-card');
const finalMessage = document.querySelector('.final-message');
const bgm = document.getElementById('bgm');

// State
let countdownInterval;

function updateCountdown() {
    const now = new Date().getTime();
    const distance = TARGET_DATE - now;

    if (distance < 0) {
        clearInterval(countdownInterval);
        showCelebration();
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerText = days.toString().padStart(2, '0');
    hoursEl.innerText = hours.toString().padStart(2, '0');
    minutesEl.innerText = minutes.toString().padStart(2, '0');
    secondsEl.innerText = seconds.toString().padStart(2, '0');
}

function switchScene(from, to) {
    from.classList.remove('active');
    setTimeout(() => {
        // Simple display toggle if needed, or just standard opacity fade (handled by CSS)
        // CSS implementation handles pointer-events and opacity.
        to.classList.add('active');
    }, 500); // Wait for fade out
}

function showCelebration() {
    switchScene(sceneCountdown, sceneCelebration);
}

function showLetter() {
    switchScene(sceneCelebration, sceneLetter);

    // Attempt to play audio
    try {
        bgm.play();
    } catch (e) {
        console.log("Audio autoplay prevented", e);
    }

    // Auto-transition to gallery after reading time (e.g., 8-10 seconds of reading time)
    // The requirement says: "After the letter appears for a few seconds, animate..."
    setTimeout(slideLetterAndShowGallery, 8000);
}

function slideLetterAndShowGallery() {
    // 1. Slide letter
    letterContent.classList.add('slide-away');

    // 2. Bring in Gallery scene (overlaying or replacing? Design implies showing photos WHILE letter is slid)
    // Actually, distinct scenes might hide the letter completely if we use switchScene.
    // Let's modify logic: Keep letter scene active but slide content, and fade in gallery scene ON TOP or sharing the space.
    // However, for simplicity and cleanliness: "Slide... until partially off-screen... Then show 2-3 couple photos"
    // This implies both exist. So we manually manage the scene transition here.

    sceneGallery.classList.add('active'); // Fade in gallery layer

    // 3. Animate photos one by one
    galleryPhotos.forEach((photo, index) => {
        setTimeout(() => {
            photo.classList.add('visible');
        }, 1000 + (index * 1500)); // Staggered delays
    });

    // 4. Show final message
    const totalPhotoTime = 1000 + (galleryPhotos.length * 1500);
    setTimeout(() => {
        finalMessage.classList.add('visible');
    }, totalPhotoTime + 500);
}

// Initialization
countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// Event Listeners
openLetterBtn.addEventListener('click', showLetter);
