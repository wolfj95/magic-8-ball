// State management
let projects = [];
let currentProjectIndex = -1;
let autoRotateInterval = null;
let isShaking = false;

// DOM elements
const eightBall = document.getElementById('eightBall');
const projectDisplay = document.getElementById('projectDisplay');
const shakeButton = document.getElementById('shakeButton');
const loading = document.getElementById('loading');
const errorElement = document.getElementById('error');

// Initialize the application
async function init() {
    try {
        loading.style.display = 'block';
        errorElement.style.display = 'none';

        await fetchProjects();

        if (projects.length === 0) {
            showError('No projects submitted yet. Be the first to submit!');
            loading.style.display = 'none';
            return;
        }

        loading.style.display = 'none';
        showRandomProject();
        startAutoRotation();

    } catch (error) {
        console.error('Initialization error:', error);
        showError('Failed to load projects. Please try again later.');
        loading.style.display = 'none';
    }
}

// Fetch projects from Supabase
async function fetchProjects() {
    try {
        const { data, error } = await supabase
            .from(PROJECTS_TABLE)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        projects = data || [];
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
}

// Display a specific project
function displayProject(index) {
    if (index < 0 || index >= projects.length) return;

    const project = projects[index];

    // Fade out current project
    projectDisplay.classList.remove('visible');

    setTimeout(() => {
        // Update project content
        const titleElement = projectDisplay.querySelector('.project-title');
        const authorElement = projectDisplay.querySelector('.project-author');
        const screenshotElement = projectDisplay.querySelector('.project-screenshot');
        const linkElement = projectDisplay.querySelector('.project-link');

        titleElement.textContent = project.title;
        authorElement.textContent = `by ${project.student_name}`;

        // Handle screenshot
        screenshotElement.innerHTML = '';
        if (project.screenshot_url) {
            const img = document.createElement('img');
            img.src = project.screenshot_url;
            img.alt = project.title;
            screenshotElement.appendChild(img);
        }

        // Handle link
        if (project.link) {
            linkElement.href = project.link;
            linkElement.textContent = 'View Project';
            linkElement.style.display = 'inline-block';

            // Ensure link is clickable
            linkElement.onclick = function(e) {
                e.stopPropagation();
                window.open(project.link, '_blank');
                console.log("link clicked")
                return false;
            };
        } else {
            linkElement.style.display = 'none';
        }

        // Fade in new project
        setTimeout(() => {
            projectDisplay.classList.add('visible');
        }, 50);

    }, 500);

    currentProjectIndex = index;
}

// Show a random project
function showRandomProject() {
    if (projects.length === 0) return;

    let newIndex;
    if (projects.length === 1) {
        newIndex = 0;
    } else {
        // Get a different project than the current one
        do {
            newIndex = Math.floor(Math.random() * projects.length);
        } while (newIndex === currentProjectIndex && projects.length > 1);
    }

    displayProject(newIndex);
}

// Shake animation
function shakeTheBall() {
    if (isShaking) return;

    isShaking = true;
    eightBall.classList.add('shaking');

    // Remove project visibility during shake
    projectDisplay.classList.remove('visible');

    setTimeout(() => {
        eightBall.classList.remove('shaking');
        isShaking = false;
        showRandomProject();
    }, 800);
}

// Start auto-rotation every 15 seconds
function startAutoRotation() {
    // Clear any existing interval
    if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
    }

    // Set interval for 15 seconds
    autoRotateInterval = setInterval(() => {
        shakeTheBall();
    }, 15000);
}

// Show error message
function showError(message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Event listeners
shakeButton.addEventListener('click', () => {
    shakeTheBall();
    // Reset the auto-rotation timer
    startAutoRotation();
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
