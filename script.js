// 1. DOM Element Selectors
const applicationForm = document.getElementById('applicationForm');
const dashboardRows = document.getElementById('dashboardRows');

// 2. Local "Database" array to store application objects
let applications = [];

// 3. Event Listener for Form Submission
applicationForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Stop page from reloading

    // Extract input data
    const documentType = document.getElementById('documentType').value;
    const fullName = document.getElementById('fullName').value;
    const dob = document.getElementById('dob').value;
    
    // Get today's date for the record
    const today = new Date().toLocaleDateString();

    // Create a new application record object
    const newApplication = {
        type: documentType,
        name: fullName,
        date: today,
        status: "Pending Review" // Default tracking status
    };

    // Push the object into our array
    applications.push(newApplication);

    // Refresh the dashboard display with the new data
    updateDashboard();

    // Clear form inputs
    applicationForm.reset();
});

// 4. Function to render the array data onto the dashboard table
function updateDashboard() {
    // Clear out old HTML rows inside the tbody
    dashboardRows.innerHTML = '';

    // If there are no applications, show the default empty state row
    if (applications.length === 0) {
        dashboardRows.innerHTML = `
            <tr id="noDataRow">
                <td colspan="4" class="no-data">No active applications found.</td>
            </tr>`;
        return;
    }

    // Loop through our application database and build the table rows
    applications.forEach(app => {
        // Create a new <tr> element
        const row = document.createElement('tr');

        // Populate the row with columns matching our object properties
        row.innerHTML = `
            <td><strong>${app.type}</strong></td>
            <td>${app.name}</td>
            <td>${app.date}</td>
            <td><span class="status-badge pending">${app.status}</span></td>
        `;

        // Append the new row to the table body
        dashboardRows.appendChild(row);
    });
}
// Event Listener for Form Submission
applicationForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Stop page from reloading

    // Extract input data
    const documentType = document.getElementById('documentType').value;
    const fullName = document.getElementById('fullName').value;
    const dobValue = document.getElementById('dob').value;
    
    // --- AGE VALIDATION SYNTAX START ---
    const dobDate = new Date(dobValue);
    const todayDate = new Date();
    
    // Calculate precise age difference
    let age = todayDate.getFullYear() - dobDate.getFullYear();
    const monthDifference = todayDate.getMonth() - dobDate.getMonth();
    
    // Adjust age if birthday hasn't happened yet this calendar year
    if (monthDifference < 0 || (monthDifference === 0 && todayDate.getDate() < dobDate.getDate())) {
        age--;
    }

    // Enforce legal age restriction specifically for the Driver's License option
    if (documentType === "Drivers License" && age < 18) {
        alert(`Application Denied: You must be at least 18 years old to apply for a Driver's License. (Current age: ${age})`);
        return; // Halts the function execution; data won't hit the dashboard
    }
    // --- AGE VALIDATION SYNTAX END ---

    // Get today's date formatted nicely for the table record
    const todayFormatted = todayDate.toLocaleDateString();

    // Create a new application record object
    const newApplication = {
        type: documentType,
        name: fullName,
        date: todayFormatted,
        status: "Pending Review"
    };

    // Push the object into our array database and refresh UI
    applications.push(newApplication);
    updateDashboard();

    // Clear form inputs for the next entry
    applicationForm.reset();
});