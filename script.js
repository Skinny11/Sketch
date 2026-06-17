// ============================================================
// 1. REAL-TIME CLOCK
// ============================================================
function updateClock() {
    const now = new Date();
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    const clockDisplay = document.getElementById('clockDisplay');
    if (clockDisplay) {
        clockDisplay.textContent = now.toLocaleDateString('en-US', options);
    }
}
setInterval(updateClock, 1000);
updateClock();

// ============================================================
// 2. MOBILE NAV TOGGLE
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navMenu = document.querySelector('.nav-menu');
    
    let toggleBtn = document.querySelector('.nav-toggle');
    if (!toggleBtn && navbar) {
        toggleBtn = document.createElement('button');
        toggleBtn.className = 'nav-toggle';
        toggleBtn.setAttribute('aria-label', 'Toggle menu');
        toggleBtn.innerHTML = '<span></span><span></span><span></span>';
        navbar.appendChild(toggleBtn);
    }
    
    if (toggleBtn && navMenu) {
        toggleBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const spans = this.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const spans = toggleBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
});

// ============================================================
// 3. CAMERA FUNCTIONS
// ============================================================
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photoPreview = document.getElementById('photoPreview');
const cameraPlaceholder = document.getElementById('cameraPlaceholder');
const startCameraBtn = document.getElementById('startCameraBtn');
const captureBtn = document.getElementById('captureBtn');
const resetCameraBtn = document.getElementById('resetCameraBtn');
let capturedImageDataUrl = null;
let cameraStream = null;

// ===== START CAMERA =====
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { 
                facingMode: 'user',
                width: { ideal: 640 },
                height: { ideal: 480 }
            },
            audio: false
        });
        
        cameraStream = stream;
        video.srcObject = stream;
        video.style.display = 'block';
        video.classList.add('active');
        
        // Hide placeholder
        if (cameraPlaceholder) {
            cameraPlaceholder.classList.add('hidden');
        }
        
        // Hide preview if visible
        photoPreview.style.display = 'none';
        photoPreview.classList.remove('active');
        
        // Update buttons
        startCameraBtn.disabled = true;
        startCameraBtn.textContent = '📷 Camera Active';
        captureBtn.disabled = false;
        captureBtn.textContent = '📸 Capture Photo';
        resetCameraBtn.style.display = 'none';
        
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Unable to access camera. Please check your camera permissions and try again.');
        
        startCameraBtn.disabled = false;
        startCameraBtn.textContent = '📷 Retry Camera';
    }
}

// ===== CAPTURE PHOTO =====
function capturePhoto() {
    if (!video.srcObject) {
        alert('Please start the camera first.');
        return;
    }
    
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    // Draw current frame
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Export frame data to image
    capturedImageDataUrl = canvas.toDataURL('image/png');
    photoPreview.src = capturedImageDataUrl;
    
    // Swap viewing
    video.style.display = 'none';
    video.classList.remove('active');
    photoPreview.style.display = 'block';
    photoPreview.classList.add('active');
    
    // Stop camera
    stopCamera();
    
    // Update buttons
    captureBtn.disabled = true;
    captureBtn.textContent = '✅ Photo Captured';
    resetCameraBtn.style.display = 'inline-block';
    startCameraBtn.disabled = false;
    startCameraBtn.textContent = '📷 Retake Photo';
}

// ===== STOP CAMERA =====
function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        video.srcObject = null;
    }
}

// ===== RESET / RETAKE =====
function resetCameraView() {
    // Clear preview
    photoPreview.src = '';
    photoPreview.style.display = 'none';
    photoPreview.classList.remove('active');
    capturedImageDataUrl = null;
    
    // Reset video
    video.style.display = 'none';
    video.classList.remove('active');
    
    // Show placeholder
    if (cameraPlaceholder) {
        cameraPlaceholder.classList.remove('hidden');
    }
    
    // Reset buttons
    captureBtn.disabled = true;
    captureBtn.textContent = '📸 Capture Photo';
    resetCameraBtn.style.display = 'none';
    startCameraBtn.disabled = false;
    startCameraBtn.textContent = '📷 Start Camera';
    
    // Stop camera if running
    if (video.srcObject) {
        stopCamera();
    }
}

// ===== CLEANUP ON PAGE UNLOAD =====
window.addEventListener('beforeunload', function() {
    stopCamera();
});

// ============================================================
// 4. APPLICATION FORM LOGIC (application.html)
// ============================================================
const form = document.getElementById('applicationForm');
if (form) {
    const documentType = document.getElementById('documentType');
    const middleNameGroup = document.getElementById('middleNameGroup');
    const middleName = document.getElementById('middleName');
    
    // Document-specific fields
    const passportFields = document.querySelectorAll('.passport-fields');
    const nationality = document.getElementById('nationality');
    const placeOfBirth = document.getElementById('placeOfBirth');
    const holderSignature = document.getElementById('holderSignature');
    
    // Preview elements
    const previewContent = document.getElementById('previewContent');
    const previewPlaceholder = document.querySelector('.preview-placeholder');
    const previewDocType = document.getElementById('previewDocType');
    const previewAppId = document.getElementById('previewAppId');
    const previewSurname = document.getElementById('previewSurname');
    const previewGivenNames = document.getElementById('previewGivenNames');
    const previewMiddleName = document.getElementById('previewMiddleName');
    const previewMiddleRow = document.getElementById('previewMiddleRow');
    const previewDob = document.getElementById('previewDob');
    const previewSex = document.getElementById('previewSex');
    const previewAddress = document.getElementById('previewAddress');
    const previewNationality = document.getElementById('previewNationality');
    const previewPlaceOfBirth = document.getElementById('previewPlaceOfBirth');
    const previewHolderSignature = document.getElementById('previewHolderSignature');
    const previewPhoto = document.getElementById('previewPhoto');
    const previewIssueDate = document.getElementById('previewIssueDate');
    const previewExpiryDate = document.getElementById('previewExpiryDate');
    const previewSerial = document.getElementById('previewSerial');
    
    // Form inputs
    const surname = document.getElementById('surname');
    const givenNames = document.getElementById('givenNames');
    const dob = document.getElementById('dob');
    const sex = document.getElementById('sex');
    const address = document.getElementById('address');
    const photoUpload = document.getElementById('photoUpload');
    
    // ===== CONDITIONAL FIELDS =====
    documentType.addEventListener('change', function() {
        const selected = this.value;
        
        // Hide all passport-specific fields first
        passportFields.forEach(el => el.style.display = 'none');
        
        // Show passport fields if Passport is selected
        if (selected === 'Passport') {
            passportFields.forEach(el => el.style.display = 'block');
        }
        
        // Update preview document type
        updatePreview();
    });
    
    // ===== LIVE PREVIEW =====
    function generateApplicationId() {
        const now = new Date();
        const year = now.getFullYear();
        const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
        return `SLD-${year}-${random}`;
    }
    
    function calculateExpiryDate(issueDate) {
        const expiry = new Date(issueDate);
        expiry.setFullYear(expiry.getFullYear() + 5);
        return expiry;
    }
    
    function generateSerialNumber(type) {
        const now = new Date();
        const random = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
        let prefix = 'SLD';
        if (type === 'National ID') prefix = 'SLD0020';
        else if (type === 'Passport') prefix = 'SLD0030';
        else if (type === 'Drivers License') prefix = 'SLD0000';
        return `${prefix}${random}`;
    }
    
    function updatePreview() {
        const selected = documentType ? documentType.value : '';
        const surnameVal = surname ? surname.value : '';
        const givenNamesVal = givenNames ? givenNames.value : '';
        const middleNameVal = middleName ? middleName.value : '';
        const dobVal = dob ? dob.value : '';
        const sexVal = sex ? sex.value : '';
        const addressVal = address ? address.value : '';
        const nationalityVal = nationality ? nationality.value : '';
        const placeOfBirthVal = placeOfBirth ? placeOfBirth.value : '';
        const holderSignatureVal = holderSignature ? holderSignature.value : '';
        
        // Check photo source (upload or camera)
        let photoVal = '—';
        if (photoUpload && photoUpload.files && photoUpload.files.length > 0) {
            photoVal = '✅ Uploaded';
        } else if (capturedImageDataUrl) {
            photoVal = '✅ Captured';
        }
        
        // Check if any field has value
        const hasData = surnameVal || givenNamesVal || dobVal || sexVal || addressVal;
        
        if (!hasData || !selected) {
            if (previewContent) previewContent.style.display = 'none';
            if (previewPlaceholder) previewPlaceholder.style.display = 'block';
            return;
        }
        
        if (previewPlaceholder) previewPlaceholder.style.display = 'none';
        if (previewContent) previewContent.style.display = 'block';
        
        // Update preview
        const appId = generateApplicationId();
        const today = new Date();
        const issueDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        const expiryDate = calculateExpiryDate(today).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        const serial = generateSerialNumber(selected);
        
        if (previewDocType) previewDocType.textContent = selected;
        if (previewAppId) previewAppId.textContent = appId;
        if (previewSurname) previewSurname.textContent = surnameVal || '—';
        if (previewGivenNames) previewGivenNames.textContent = givenNamesVal || '—';
        if (previewMiddleRow && previewMiddleName) {
            if (middleNameVal) {
                previewMiddleRow.style.display = 'flex';
                previewMiddleName.textContent = middleNameVal;
            } else {
                previewMiddleRow.style.display = 'none';
            }
        }
        if (previewDob) previewDob.textContent = dobVal ? new Date(dobVal).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
        if (previewSex) previewSex.textContent = sexVal || '—';
        if (previewAddress) previewAddress.textContent = addressVal || '—';
        if (previewPhoto) previewPhoto.textContent = photoVal;
        if (previewIssueDate) previewIssueDate.textContent = issueDate;
        if (previewExpiryDate) previewExpiryDate.textContent = expiryDate;
        if (previewSerial) previewSerial.textContent = serial;
        
        // Passport-specific preview fields
        if (selected === 'Passport') {
            document.querySelectorAll('.preview-row.passport-fields').forEach(el => el.style.display = 'flex');
            if (previewNationality) previewNationality.textContent = nationalityVal || '—';
            if (previewPlaceOfBirth) previewPlaceOfBirth.textContent = placeOfBirthVal || '—';
            if (previewHolderSignature) previewHolderSignature.textContent = holderSignatureVal || '—';
        } else {
            document.querySelectorAll('.preview-row.passport-fields').forEach(el => el.style.display = 'none');
        }
    }
    
    // Attach input events for live preview
    if (surname) surname.addEventListener('input', updatePreview);
    if (givenNames) givenNames.addEventListener('input', updatePreview);
    if (middleName) middleName.addEventListener('input', updatePreview);
    if (dob) dob.addEventListener('change', updatePreview);
    if (sex) sex.addEventListener('change', updatePreview);
    if (address) address.addEventListener('input', updatePreview);
    if (nationality) nationality.addEventListener('input', updatePreview);
    if (placeOfBirth) placeOfBirth.addEventListener('input', updatePreview);
    if (holderSignature) holderSignature.addEventListener('input', updatePreview);
    if (photoUpload) photoUpload.addEventListener('change', updatePreview);
    
    // ===== FORM SUBMISSION =====
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const selected = documentType.value;
        if (!selected) {
            alert('Please select a document type.');
            return;
        }
        
        // Check age for Driver's License
        if (selected === 'Drivers License') {
            const dobVal = dob.value;
            if (dobVal) {
                const dobDate = new Date(dobVal);
                const today = new Date();
                let age = today.getFullYear() - dobDate.getFullYear();
                const monthDiff = today.getMonth() - dobDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
                    age--;
                }
                if (age < 18) {
                    alert(`Application Denied: You must be at least 18 years old to apply for a Driver's License. (Current age: ${age})`);
                    return;
                }
            }
        }
        
        // Check if photo is uploaded OR captured
        const hasPhoto = (photoUpload && photoUpload.files && photoUpload.files.length > 0) || capturedImageDataUrl;
        if (!hasPhoto) {
            alert('Please upload a photo or capture one using the camera.');
            return;
        }
        
        // Generate Application ID
        const appId = generateApplicationId();
        const today = new Date();
        const issueDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        const expiryDate = calculateExpiryDate(today).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        const serial = generateSerialNumber(selected);
        
        // Build application data
        const appData = {
            applicationId: appId,
            documentType: selected,
            surname: surname.value,
            givenNames: givenNames.value,
            middleName: middleName ? middleName.value : '',
            dob: dob.value,
            sex: sex.value,
            address: address.value,
            nationality: nationality ? nationality.value : '',
            placeOfBirth: placeOfBirth ? placeOfBirth.value : '',
            holderSignature: holderSignature ? holderSignature.value : '',
            issueDate: issueDate,
            expiryDate: expiryDate,
            serial: serial,
            photo: photoUpload && photoUpload.files && photoUpload.files.length > 0 ? photoUpload.files[0].name : 'Captured via Camera',
            photoDataUrl: capturedImageDataUrl || null,
            submissionDate: new Date().toISOString(),
            status: 'Pending Review'
        };
        
        // Save to localStorage (for demo)
        let applications = JSON.parse(localStorage.getItem('saloneDucks_applications') || '[]');
        applications.push(appData);
        localStorage.setItem('saloneDucks_applications', JSON.stringify(applications));
        
        // Show success message
        const formSuccess = document.getElementById('formSuccess');
        const displayAppId = document.getElementById('displayAppId');
        if (formSuccess && displayAppId) {
            displayAppId.textContent = appId;
            formSuccess.style.display = 'block';
        }
        form.style.display = 'none';
        
        // Simulate email
        console.log('📧 Email sent to user:');
        console.log('Application ID:', appId);
        console.log('Document:', selected);
        console.log('Thank you for applying to Salone Ducks. Your application has been received.');
        console.log('You can track, update, or delete your application within 5 days using your Application ID.');
        
        // Scroll to success message
        if (formSuccess) formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

// ============================================================
// 5. APPLICATION TRACKER (application.html)
// ============================================================
const trackerBtn = document.getElementById('trackerBtn');
const trackerAppId = document.getElementById('trackerAppId');
const trackerResult = document.getElementById('trackerResult');

if (trackerBtn && trackerAppId && trackerResult) {
    trackerBtn.addEventListener('click', function() {
        const searchId = trackerAppId.value.trim();
        if (!searchId) {
            trackerResult.style.display = 'block';
            trackerResult.innerHTML = '<p style="color:#b45309;">⚠️ Please enter an Application ID.</p>';
            return;
        }
        
        const applications = JSON.parse(localStorage.getItem('saloneDucks_applications') || '[]');
        const app = applications.find(a => a.applicationId === searchId);
        
        if (!app) {
            trackerResult.style.display = 'block';
            trackerResult.innerHTML = '<p style="color:#b45309;">⚠️ No application found with this ID. Please check and try again.</p>';
            return;
        }
        
        // Check if within 5 days
        const submissionDate = new Date(app.submissionDate);
        const now = new Date();
        const daysDiff = Math.floor((now - submissionDate) / (1000 * 60 * 60 * 24));
        const isEditable = daysDiff < 5;
        
        trackerResult.style.display = 'block';
        trackerResult.innerHTML = `
            <div style="background:white; border-radius:8px; padding:20px; border-left:4px solid ${isEditable ? '#0a7a0a' : '#b45309'};">
                <h3 style="color:#0a4a2a; margin-top:0;">📄 Application Details</h3>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px 20px;">
                    <p><strong>Application ID:</strong> ${app.applicationId}</p>
                    <p><strong>Document:</strong> ${app.documentType}</p>
                    <p><strong>Name:</strong> ${app.surname}, ${app.givenNames} ${app.middleName || ''}</p>
                    <p><strong>Status:</strong> <span class="status-badge pending">${app.status}</span></p>
                    <p><strong>Submitted:</strong> ${new Date(app.submissionDate).toLocaleDateString()}</p>
                    <p><strong>Expiry:</strong> ${app.expiryDate}</p>
                    <p><strong>Serial:</strong> ${app.serial}</p>
                </div>
                <div style="margin-top:15px; padding-top:15px; border-top:1px solid #e8f0e8;">
                    <p style="color:${isEditable ? '#0a5a2a' : '#b45309'}; margin:0;">
                        ${isEditable ? '✅ You can update or delete this application (within 5 days of submission).' : '⛔ This application is locked. You can no longer update or delete it.'}
                    </p>
                    ${isEditable ? `
                        <div style="display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;">
                            <button onclick="updateApplication('${app.applicationId}')" style="width:auto; padding:8px 20px; background:#2563eb; color:white; border:none; border-radius:6px; cursor:pointer;">Update</button>
                            <button onclick="deleteApplication('${app.applicationId}')" style="width:auto; padding:8px 20px; background:#b91c1c; color:white; border:none; border-radius:6px; cursor:pointer;">Delete</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });
}

// ===== UPDATE APPLICATION =====
function updateApplication(appId) {
    alert('Update functionality: In a real system, you would be redirected to a form pre-filled with your data.\n\nFor now, please start a new application if you need changes.');
}

// ===== DELETE APPLICATION =====
function deleteApplication(appId) {
    if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) return;
    
    let applications = JSON.parse(localStorage.getItem('saloneDucks_applications') || '[]');
    applications = applications.filter(a => a.applicationId !== appId);
    localStorage.setItem('saloneDucks_applications', JSON.stringify(applications));
    
    alert('✅ Application deleted successfully.');
    const trackerResult = document.getElementById('trackerResult');
    if (trackerResult) {
        trackerResult.innerHTML = '<p style="color:#0a7a0a;">✅ Application deleted. You can start a new application.</p>';
    }
}

// ============================================================
// 6. NEWS FEED (news.html)
// ============================================================
const newsFeed = document.getElementById('newsFeed');
if (newsFeed) {
    // Sample news data
    const newsData = [
        {
            id: 1,
            type: 'press',
            title: 'New Digital ID Card System Launched',
            content: 'The Government of Sierra Leone has announced a new digital ID card system to be rolled out next month. The system aims to modernize identification and reduce fraud. Citizens will be able to apply for their ID cards online through Salone Ducks.',
            date: 'June 16, 2026',
            author: 'Ministry of Internal Affairs'
        },
        {
            id: 2,
            type: 'holiday',
            title: 'Eid al-Fitr Holiday Announcement',
            content: 'All government offices will be closed on June 20-21, 2026, in observance of Eid al-Fitr. Citizens are advised to plan their document applications accordingly.',
            date: 'June 15, 2026',
            author: 'Office of the President'
        },
        {
            id: 3,
            type: 'job',
            title: 'Ministry of Health — 50 New Positions',
            content: 'The Ministry of Health is hiring 50 healthcare professionals including nurses, doctors, and administrative staff. Applications are open until July 15, 2026. Apply now through the Salone Ducks portal.',
            date: 'June 14, 2026',
            author: 'Ministry of Health'
        },
        {
            id: 4,
            type: 'press',
            title: 'New Passport Processing Center Opens in Bo',
            content: 'A new passport processing center has been opened in Bo to reduce wait times for citizens in the southern region. The center will serve Kenema, Bo, and surrounding districts.',
            date: 'June 12, 2026',
            author: 'Ministry of Foreign Affairs'
        },
        {
            id: 5,
            type: 'holiday',
            title: 'Independence Day Celebrations',
            content: 'Sierra Leone will celebrate its 65th Independence Day on April 27, 2026. National events will be held in Freetown and all district headquarters.',
            date: 'April 20, 2026',
            author: 'Office of the President'
        },
        {
            id: 6,
            type: 'job',
            title: 'Ministry of Education — Teachers Recruitment',
            content: 'The Ministry of Education is recruiting 200 primary and secondary school teachers across all districts. Qualified candidates are encouraged to apply before August 30, 2026.',
            date: 'June 10, 2026',
            author: 'Ministry of Education'
        }
    ];
    
    let currentFilter = 'all';
    
    function renderNews(filter) {
        const filtered = filter === 'all' ? newsData : newsData.filter(n => n.type === filter);
        
        if (filtered.length === 0) {
            newsFeed.innerHTML = `
                <div class="news-empty">
                    <p style="text-align:center; color:#94a3b8; padding:40px 0;">No news found for this category.</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        filtered.forEach(news => {
            let tagClass = '';
            let tagText = '';
            if (news.type === 'press') { tagClass = 'press'; tagText = 'Press Release'; }
            else if (news.type === 'holiday') { tagClass = 'holiday'; tagText = 'Holiday'; }
            else if (news.type === 'job') { tagClass = 'job'; tagText = 'Job Vacancy'; }
            
            html += `
                <div class="news-item" data-type="${news.type}">
                    <div class="news-item-header">
                        <span class="news-tag ${tagClass}">${tagText}</span>
                        <span class="news-item-date">${news.date}</span>
                    </div>
                    <h3 class="news-item-title">${news.title}</h3>
                    <p class="news-item-content">${news.content}</p>
                    <p class="news-item-author">— ${news.author}</p>
                </div>
            `;
        });
        newsFeed.innerHTML = html;
    }
    
    // Initial render
    renderNews('all');
    
    // Filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderNews(currentFilter);
        });
    });
}

// ============================================================
// 7. SUBSCRIBE FUNCTION (news.html)
// ============================================================
const subscribeBtn = document.getElementById('subscribeBtn');
const subscribeEmail = document.getElementById('subscribeEmail');
const subscribeMessage = document.getElementById('subscribeMessage');

if (subscribeBtn && subscribeEmail && subscribeMessage) {
    subscribeBtn.addEventListener('click', function() {
        const email = subscribeEmail.value.trim();
        if (!email || !email.includes('@') || !email.includes('.')) {
            subscribeMessage.style.display = 'block';
            subscribeMessage.style.background = '#fef3c7';
            subscribeMessage.style.color = '#b45309';
            subscribeMessage.innerHTML = '⚠️ Please enter a valid email address.';
            return;
        }
        
        // Save subscriber
        let subscribers = JSON.parse(localStorage.getItem('saloneDucks_subscribers') || '[]');
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('saloneDucks_subscribers', JSON.stringify(subscribers));
            subscribeMessage.style.display = 'block';
            subscribeMessage.style.background = '#d1fae5';
            subscribeMessage.style.color = '#0a5a2a';
            subscribeMessage.innerHTML = '✅ You have been subscribed successfully! You will receive updates via email.';
            subscribeEmail.value = '';
        } else {
            subscribeMessage.style.display = 'block';
            subscribeMessage.style.background = '#fef3c7';
            subscribeMessage.style.color = '#b45309';
            subscribeMessage.innerHTML = '⚠️ This email is already subscribed.';
        }
    });
}

// ============================================================
// 8. DASHBOARD (index.html - existing functionality)
// ============================================================
const applicationForm = document.getElementById('applicationForm');
const dashboardRows = document.getElementById('dashboardRows');

// Only run on index.html (if elements exist and not already handled)
if (applicationForm && !document.getElementById('documentType')) {
    // This is the index.html dashboard - use simple localStorage
    let applications = JSON.parse(localStorage.getItem('saloneDucks_simpleApps') || '[]');
    
    function updateDashboard() {
        if (!dashboardRows) return;
        dashboardRows.innerHTML = '';
        
        if (applications.length === 0) {
            dashboardRows.innerHTML = `
                <tr id="noDataRow">
                    <td colspan="4" class="no-data">No active applications found.</td>
                </tr>`;
            return;
        }
        
        applications.forEach(app => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${app.type}</strong></td>
                <td>${app.name}</td>
                <td>${app.date}</td>
                <td><span class="status-badge pending">${app.status}</span></td>
            `;
            dashboardRows.appendChild(row);
        });
    }
    
    // Only attach if form exists on index.html (simple version)
    // This won't conflict with application.html
    if (applicationForm && !document.getElementById('documentType')) {
        applicationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const docTypeSelect = document.getElementById('documentType');
            const fullName = document.getElementById('fullName');
            const dobInput = document.getElementById('dob');
            
            if (!docTypeSelect || !fullName || !dobInput) return;
            
            const documentType = docTypeSelect.value;
            const fullNameVal = fullName.value;
            const dobVal = dobInput.value;
            
            if (!documentType || !fullNameVal || !dobVal) return;
            
            // Age validation for driver's license
            if (documentType === "Drivers License") {
                const dobDate = new Date(dobVal);
                const todayDate = new Date();
                let age = todayDate.getFullYear() - dobDate.getFullYear();
                const monthDiff = todayDate.getMonth() - dobDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && todayDate.getDate() < dobDate.getDate())) {
                    age--;
                }
                if (age < 18) {
                    alert(`Application Denied: You must be at least 18 years old to apply for a Driver's License. (Current age: ${age})`);
                    return;
                }
            }
            
            const today = new Date().toLocaleDateString();
            
            const newApplication = {
                type: documentType,
                name: fullNameVal,
                date: today,
                status: "Pending Review"
            };
            
            applications.push(newApplication);
            localStorage.setItem('saloneDucks_simpleApps', JSON.stringify(applications));
            updateDashboard();
            applicationForm.reset();
        });
        
        // Initial load
        updateDashboard();
    }
}

console.log('🇸🇱 Salone Ducks loaded successfully!');