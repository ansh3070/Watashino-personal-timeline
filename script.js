// Timeline data
let events = [];

// DOM elements
const loadingScreen = document.getElementById('loadingScreen');
const mainContent = document.getElementById('mainContent');
const timelineEvents = document.getElementById('timelineEvents');
const mobileTimeline = document.getElementById('mobileTimeline');
const addEventBtn = document.getElementById('addEventBtn');
const modal = document.getElementById('modal');
const eventForm = document.getElementById('eventForm');
const cancelBtn = document.getElementById('cancelBtn');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Show loading animation for 3 seconds
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
        loadEvents();
    }, 3000);

    // Event listeners
    addEventBtn.addEventListener('click', openModal);
    cancelBtn.addEventListener('click', closeModal);
    eventForm.addEventListener('submit', handleSubmit);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });

    // Handle resize events for responsive design
    window.addEventListener('resize', checkMobileView);
});

// Check if we should show mobile view
function checkMobileView() {
    if (window.innerWidth <= 768) {
        document.querySelector('.timeline-container').style.display = 'none';
        document.querySelector('.mobile-timeline').style.display = 'block';
    } else {
        document.querySelector('.timeline-container').style.display = 'block';
        document.querySelector('.mobile-timeline').style.display = 'none';
    }
}

// Load events from Firebase (or localStorage for demo)
function loadEvents() {
    // Demo data - replace with Firebase calls
    const demoEvents = [
        {
            id: '1',
            title: 'Started My Journey',
            description: 'The beginning of something amazing that changed my perspective on life.',
            date: '2020-03-15'
        },
        {
            id: '2',
            title: 'First Big Achievement',
            description: 'Accomplished something I had been working towards for months. It felt incredible.',
            date: '2021-07-22'
        },
        {
            id: '3',
            title: 'Life-Changing Moment',
            description: 'A moment that completely shifted my direction and opened new possibilities.',
            date: '2022-11-08'
        },
        {
            id: '4',
            title: 'New Adventure Begins',
            description: 'Started a new chapter filled with excitement and endless opportunities.',
            date: '2023-05-12'
        }
    ];

    // Try to load from localStorage first
    const savedEvents = localStorage.getItem('timelineEvents');
    events = savedEvents ? JSON.parse(savedEvents) : demoEvents;
    
    sortEventsByDate();
    renderTimeline();
    checkMobileView(); // Check initial view
}

// Sort events by date
function sortEventsByDate() {
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Render timeline
function renderTimeline() {
    renderDesktopTimeline();
    renderMobileTimeline();
}

// Render desktop timeline
function renderDesktopTimeline() {
    timelineEvents.innerHTML = '';
    
    events.forEach((event, index) => {
        const isLeft = index % 2 === 0;
        const eventElement = createTimelineEvent(event, isLeft);
        timelineEvents.appendChild(eventElement);
    });
}

// Render mobile timeline
function renderMobileTimeline() {
    mobileTimeline.innerHTML = '';
    
    events.forEach(event => {
        const eventElement = createMobileEvent(event);
        mobileTimeline.appendChild(eventElement);
    });
}

// Create timeline event element
function createTimelineEvent(event, isLeft) {
    const eventDiv = document.createElement('div');
    eventDiv.className = `timeline-event ${isLeft ? 'left' : 'right'}`;
    
    eventDiv.innerHTML = `
        <div class="timeline-point"></div>
        <div class="event-content ${isLeft ? 'left' : 'right'}">
            <div class="event-date">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>${formatDate(event.date)}</span>
            </div>
            <h3 class="event-title">${escapeHTML(event.title)}</h3>
            <p class="event-description">${escapeHTML(event.description)}</p>
        </div>
        <div class="connector-line ${isLeft ? 'left' : 'right'}"></div>
    `;
    
    return eventDiv;
}

// Create mobile event element
function createMobileEvent(event) {
    const eventDiv = document.createElement('div');
    eventDiv.className = 'mobile-event';
    
    eventDiv.innerHTML = `
        <div class="event-date">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>${formatDate(event.date)}</span>
        </div>
        <h3 class="event-title">${escapeHTML(event.title)}</h3>
        <p class="event-description">${escapeHTML(event.description)}</p>
    `;
    
    return eventDiv;
}

// Format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Escape HTML to prevent XSS
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Modal functions
function openModal() {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    eventForm.reset();
}

// Handle form submission
function handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(eventForm);
    const newEvent = {
        id: Date.now().toString(),
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('date')
    };
    
    // Add to events array
    events.push(newEvent);
    
    // Save to localStorage (replace with Firebase)
    localStorage.setItem('timelineEvents', JSON.stringify(events));
    
    // Re-render timeline
    sortEventsByDate();
    renderTimeline();
    
    // Close modal
    closeModal();
    
    // Try to save to Firebase if available
    if (window.db && window.collection && window.addDoc) {
        saveEventToFirebase(newEvent).catch(console.error);
    }
}

// Firebase integration functions
async function saveEventToFirebase(event) {
    if (window.db && window.collection && window.addDoc) {
        try {
            const eventsCollection = window.collection(window.db, "events");
            await window.addDoc(eventsCollection, event);
            console.log("Event saved to Firebase");
        } catch (error) {
            console.error("Error saving to Firebase:", error);
        }
    }
}

async function loadEventsFromFirebase() {
    if (window.db && window.collection && window.getDocs && window.query && window.orderBy) {
        try {
            const eventsCollection = window.collection(window.db, "events");
            const q = window.query(eventsCollection, window.orderBy("date"));
            const querySnapshot = await window.getDocs(q);
            
            const firebaseEvents = [];
            querySnapshot.forEach((doc) => {
                firebaseEvents.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            if (firebaseEvents.length > 0) {
                events = firebaseEvents;
                sortEventsByDate();
                renderTimeline();
                localStorage.setItem('timelineEvents', JSON.stringify(events));
            }
        } catch (error) {
            console.error("Error loading from Firebase:", error);
        }
    }
}