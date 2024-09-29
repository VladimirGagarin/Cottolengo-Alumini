const song = 'music.mp3';
const audio = new Audio(song);
let isAudioPlaying = false;
// Flag to track translation state
let isTranslated = false;
const originalTexts = []; // Store original texts


const container = document.querySelector('.container');
const playBtn = document.getElementById('play-btn');
const progressTruck = document.querySelector('.progress-truck');
const progressBar = document.querySelector('.progress-bar');

// Select all the .friend elements
const friends = document.querySelectorAll('.friend');

// Loop through each friend div
friends.forEach((friend, index) => {
    // Select the buttons inside the current friend div
    const pauseBtn = friend.querySelector('.controls span:nth-child(1)');
    const contactBtn = friend.querySelector('.controls span:nth-child(2)');
    const muteBtn = friend.querySelector('.controls span:nth-child(3)');
    const translateBtn = friend.querySelector('.controls span:nth-child(4)');

    // Add event listeners for each button
    pauseBtn.addEventListener('click', () => {
        console.log(`Pause button clicked in Friend ${index + 1}`);
        // You can add your pause functionality here
        isAudioPlaying = !isAudioPlaying;
        
        if(isAudioPlaying) {
            audio.pause();
            pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
        else{
            audio.play();
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
    });

    contactBtn.addEventListener('click', () => {
        console.log(`Contact button clicked in Friend ${index + 1}`);
        // Add your contact functionality here
        showNotification(`${friend.querySelector('.friend-name').textContent}, contact not added`);
        audio.pause();
        pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        isAudioPlaying = false;
    });

    muteBtn.addEventListener('click', () => {
        // Add your mute functionality here
        isAudioPlaying = !isAudioPlaying;
        audio.muted = isAudioPlaying;
        // Reflect the mute state on all mute buttons
        friends.forEach(f => {
            const muteButton = f.querySelector('.controls span:nth-child(3)');
            muteButton.classList.toggle('muted', isAudioPlaying);
        });

        // Optionally, change the icon based on mute state
        muteBtn.classList.toggle('muted', isAudioPlaying);

    });

    translateBtn.addEventListener('click', () => {
        // Select all the paragraphs in the friend description
        const paragraphs = friend.querySelectorAll('.friend-description p');

        paragraphs.forEach(p => console.log(p));

        paragraphs.forEach((paragraph, pIndex) => {
            if (isTranslated) {
                // Change back to original text
                paragraph.textContent = originalTexts[pIndex] || paragraph.textContent; // Use stored original text
            } else {
                // Store the original text before changing
                originalTexts[pIndex] = paragraph.textContent; // Save the original text
                
                // Change to translated text (assuming `data-italian` exists)
                paragraph.textContent = paragraph.getAttribute('data-italian') || paragraph.textContent; // Use Italian text
            }
        });

        friends.forEach(f => {
            const  transBtn = f.querySelector('.controls span:nth-child(4)');
            transBtn.classList.toggle('translating', isTranslated);
        })
       
        // Toggle the translation flag
        isTranslated = !isTranslated;

        translateBtn.classList.toggle('translating', isTranslated);

        audio.pause();
        isAudioPlaying = false;
    });
});

    function rearrangeFriends() {
        // Select the container holding all the friends (replace .friends-container with your actual container class or ID)
    const friendsContainer = document.querySelector('.container');

    // Select all the .friend elements
    const friends = Array.from(document.querySelectorAll('.friend'));

    // Sort the friends based on the text content of .friend-name
    friends.sort((a, b) => {
        const nameA = a.querySelector('.friend-name').textContent.toUpperCase(); // Ignore case
        const nameB = b.querySelector('.friend-name').textContent.toUpperCase(); // Ignore case

        // Compare the two names
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // If names are equal
        return 0;
    });

    // Remove existing .friend elements from the DOM (optional step, this is for better performance)
    friends.forEach(friend => {
        friendsContainer.removeChild(friend);
    });

    // Append the sorted .friend elements back to the container
    friends.forEach(friend => {
        friendsContainer.appendChild(friend);
    });

    }

    rearrangeFriends()
// Function to scroll based on audio time
function scrollToTime() {
    const totalScrollHeight = container.scrollHeight - container.clientHeight;
    const scrollPosition = (audio.currentTime / audio.duration) * totalScrollHeight;
    container.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
    });

    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = percent + "%";
}

// Add an event listener to track time updates
audio.addEventListener('timeupdate',  scrollToTime);

// Add play/pause toggle functionality
playBtn.addEventListener('click', () => {
    if (audio.paused) {
        playBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; // Change to pause icon
        setTimeout(() => {playBtn.innerHTML = '<i class="fas fa-pause"></i>'; audio.play();},2000);

        isAudioPlaying = true;
    } else {
        audio.pause();
        playBtn.textContent = '▶'; // Change to play icon

        isAudioPlaying = false;
    }
});

// Update scroll position even when seeking
audio.addEventListener('seeked', scrollToTime);

// Add event listener to the progress truck
progressTruck.addEventListener('click', (e) => {
    const progressTruckWidth = progressTruck.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    // Calculate the new current time
    const newTime = (clickX / progressTruckWidth) * duration;
    audio.currentTime = newTime;
});



function showNotification(message) {
    const notificationContainer = document.getElementById('notification-container');

    // Set the notification message
    notificationContainer.textContent = message;

    // Add the 'show-notification' class to slide down
    notificationContainer.style.display = 'block';

    // Remove the notification after 3 seconds (you can adjust this duration)
    setTimeout(() => {
        notificationContainer.style.display = 'none';
    }, 3000); // Duration before it hides again
}


