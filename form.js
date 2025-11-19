// DOM elements
const projectForm = document.getElementById('projectForm');
const formMessage = document.getElementById('formMessage');
const submitText = document.getElementById('submitText');
const submitLoading = document.getElementById('submitLoading');

// Handle form submission
projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable form during submission
    const submitButton = projectForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitText.style.display = 'none';
    submitLoading.style.display = 'inline';
    formMessage.style.display = 'none';

    try {
        // Get form data
        const formData = new FormData(projectForm);
        const studentName = formData.get('studentName');
        const projectTitle = formData.get('projectTitle');
        const projectLink = formData.get('projectLink');
        const screenshot = formData.get('screenshot');

        // Upload screenshot to Supabase Storage
        let screenshotUrl = null;
        if (screenshot && screenshot.size > 0) {
            screenshotUrl = await uploadScreenshot(screenshot, projectTitle);
        }

        // Insert project into database
        const { data, error } = await supabase
            .from(PROJECTS_TABLE)
            .insert([
                {
                    student_name: studentName,
                    title: projectTitle,
                    link: projectLink,
                    screenshot_url: screenshotUrl
                }
            ])
            .select();

        if (error) throw error;

        // Show success message
        showMessage('Project submitted successfully! 🎉', 'success');

        // Reset form
        projectForm.reset();

        // Redirect to main page after 2 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);

    } catch (error) {
        console.error('Error submitting project:', error);
        showMessage('Failed to submit project. Please try again.', 'error');

        // Re-enable form
        submitButton.disabled = false;
        submitText.style.display = 'inline';
        submitLoading.style.display = 'none';
    }
});

// Upload screenshot to Supabase Storage
async function uploadScreenshot(file, projectTitle) {
    try {
        // Create a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${projectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${fileExt}`;
        const filePath = `screenshots/${fileName}`;

        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
            .from('project-screenshots')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('project-screenshots')
            .getPublicUrl(filePath);

        return urlData.publicUrl;

    } catch (error) {
        console.error('Error uploading screenshot:', error);
        throw error;
    }
}

// Show form message
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
}
