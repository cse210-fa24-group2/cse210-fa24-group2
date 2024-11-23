document.addEventListener("DOMContentLoaded", () => {
    /**
     * Data for internships
     * Each object represents an internship and its associated details
     */
    const internshipData = [
        {
            internshipId: "1",
            companyName: "Google",
            positionTitle: "Software Engineer Intern",
            applicationStatus: "Applied",
            dateApplied: "11/10/2024",
            followUpDate: "11/20/2024",
            applicationLink: "https://careers.google.com/jobs/results/12345",
            startDate: "06/01/2025",
            contactPerson: "Jane Doe",
            contactEmail: "jane.doe@google.com",
            referral: true,
            offerReceived: false,
            offerDeadline: "",
            notes: "Submitted coding test on 11/15/2024.",
            location: "Mountain View, CA",
            salary: "8000.0",
            internshipDuration: "12 weeks",
            skillsRequired: '["Python", "C++", "Data Structures"]'
        },
        {
            internshipId: "2",
            companyName: "Meta",
            positionTitle: "Machine Learning Intern",
            applicationStatus: "Interviewing",
            dateApplied: "10/15/2024",
            followUpDate: "10/25/2024",
            applicationLink: "https://careers.meta.com/jobs/results/23456",
            startDate: "06/10/2025",
            contactPerson: "John Smith",
            contactEmail: "john.smith@meta.com",
            referral: false,
            offerReceived: false,
            offerDeadline: "",
            notes: "Technical interview focused on ML concepts.",
            location: "Remote",
            salary: "8500.0",
            internshipDuration: "10 weeks",
            skillsRequired: '["Machine Learning", "TensorFlow", "Python"]'
        },
        {
            internshipId: "3",
            companyName: "Amazon",
            positionTitle: "Software Development Intern",
            applicationStatus: "Applied",
            dateApplied: "10/01/2024",
            followUpDate: "",
            applicationLink: "https://www.amazon.jobs/en/jobs/34567",
            startDate: "05/20/2025",
            contactPerson: "Alice Johnson",
            contactEmail: "alice.johnson@amazon.com",
            referral: false,
            offerReceived: true,
            offerDeadline: "11/30/2024",
            notes: "Offer includes relocation assistance.",
            location: "Seattle, WA",
            salary: "9000.0",
            internshipDuration: "12 weeks",
            skillsRequired: '["Java", "Spring", "AWS"]'
        },
        {
            internshipId: "4",
            companyName: "Apple",
            positionTitle: "iOS Developer Intern",
            applicationStatus: "Rejected",
            dateApplied: "09/15/2024",
            followUpDate: "",
            applicationLink: "https://jobs.apple.com/en-us/details/45678",
            startDate: "",
            contactPerson: "No Response",
            contactEmail: "noreply@apple.com",
            referral: false,
            offerReceived: false,
            offerDeadline: "",
            notes: "Interview went well, but rejection email received.",
            location: "Cupertino, CA",
            salary: "8500.0",
            internshipDuration: "12 weeks",
            skillsRequired: '["Swift", "iOS Development", "Xcode"]'
        },
        {
            internshipId: "5",
            companyName: "Microsoft",
            positionTitle: "Data Science Intern",
            applicationStatus: "Interviewing",
            dateApplied: "10/20/2024",
            followUpDate: "11/01/2024",
            applicationLink: "https://careers.microsoft.com/us/en/job/56789",
            startDate: "06/15/2025",
            contactPerson: "Michael Brown",
            contactEmail: "michael.brown@microsoft.com",
            referral: true,
            offerReceived: false,
            offerDeadline: "",
            notes: "Awaiting feedback from final interview.",
            location: "Redmond, WA",
            salary: "8200.0",
            internshipDuration: "12 weeks",
            skillsRequired: '["Python", "SQL", "Data Analysis"]'
        }
    ];
    


        // Additional internships follow the same structure as above

    // Predefined colors for skill pills
    const pillColors = ["#072F5F", "#1261A0", "#3895D3", "#58CCED"];

    /**
     * Generates HTML for skill pills
     * @param {string} skillsRequired - JSON string of skills
     * @returns {string} HTML string for skill pills
     */
    const generateSkillPills = (skillsRequired) => {
        const skills = JSON.parse(skillsRequired);
        return skills.map((skill, index) => {
            const color = pillColors[index % pillColors.length];
            return `<span class="pill" style="background-color: ${color};">${skill}</span>`;
        }).join(" ");
    };

    // Status options for dropdown
    const statusOptions = [
        "Applied",
        "Interviewing",
        "Shortlisted",
        "OfferReceived",
        "Rejected",
        "Pending",
        "OnHold",
        "InProgress",
        "Withdrew"
    ];

    /**
     * Generates a dropdown for application status
     * @param {string} currentStatus - Current status of the internship
     * @returns {string} HTML string for the status dropdown
     */
    const generateStatusDropdown = (currentStatus) => {
        const options = statusOptions.map((status) => {
            const selected = status === currentStatus ? "selected" : "";
            return `<option value="${status}" ${selected}>${status}</option>`;
        }).join("");

        return `
            <select class="status-dropdown status-${currentStatus}" 
                    onchange="changeStatus(this)" 
                    style="background-color: ${getStatusColor(currentStatus)};">
                ${options}
            </select>
        `;
    };

    /**
     * Returns the color associated with a status
     * @param {string} status - Status of the internship
     * @returns {string} Color in hex format
     */
    const getStatusColor = (status) => {
        const statusColors = {
            "Applied": "#6BD9E7",
            "Interviewing": "#FFB347",
            "Shortlisted": "#C5A3FF",
            "OfferReceived": "#7FFFD4",
            "Rejected": "#FF6B6B",
            "Pending": "#FFD54F",
            "OnHold": "#B0BEC5",
            "InProgress": "#81D4FA",
            "Withdrew": "#BDBDBD"
        };
        return statusColors[status] || "#FFFFFF"; // Default to white
    };

    /**
     * Handles status change in dropdown
     * @param {HTMLElement} dropdown - Dropdown element
     */
    const changeStatus = (dropdown) => {
        const newStatus = dropdown.value;
        dropdown.style.backgroundColor = getStatusColor(newStatus);
        dropdown.style.color = "white";
    };

    // Initialize DataTable
    const dataTable = new simpleDatatables.DataTable("#InternshipTrackerTable", {
        searchable: true,
        data: {
            headings: [
                "Internship ID",
                "Company Name",
                "Position Title",
                "Application Status",
                "Date Applied",
                "Follow-Up Date",
                "Application Link",
                "Start Date",
                "Contact Person",
                "Contact Email",
                "Referral",
                "Offer Received",
                "Offer Deadline",
                "Notes",
                "Location",
                "Salary",
                "Internship Duration",
                "Skills Required"
            ],
            data: internshipData.map((item) => [
                item.internshipId,
                item.companyName,
                item.positionTitle,
                generateStatusDropdown(item.applicationStatus),
                item.dateApplied,
                item.followUpDate,
                `<a href="${item.applicationLink}" target="_blank">Link</a>`,
                item.startDate,
                item.contactPerson,
                item.contactEmail,
                item.referral ? "Yes" : "No",
                item.offerReceived ? "Yes" : "No",
                item.offerDeadline || "N/A",
                `<p class="notes">${item.notes}</p>`,
                item.location,
                `$${parseFloat(item.salary).toFixed(2)}`,
                item.internshipDuration,
                `<div class="skills-column">${generateSkillPills(item.skillsRequired)}</div>`
            ])
        },
        responsive: true
    });

    // Modal-related logic
    const modal = document.getElementById("addInternshipModal");
    const addButton = document.getElementById("addRowBtn");
    const closeButton = document.querySelector(".close");
    const cancelButton = document.querySelector(".cancel-btn");
    const saveButton = document.getElementById("saveInternship");

    // Show the modal
    addButton.onclick = () => {
        modal.style.display = "block";
    };

    // Close the modal
    const closeModal = () => {
        modal.style.display = "none";
        document.getElementById("internshipForm").reset();
    };

    closeButton.onclick = closeModal;
    cancelButton.onclick = closeModal;

    window.onclick = (event) => {
        if (event.target === modal) {
            closeModal();
        }
    };

    // Save form data
    saveButton.onclick = () => {
        const newInternship = {
            internshipId: Date.now().toString(),
            companyName: document.getElementById("company_name").value,
            positionTitle: document.getElementById("position_title").value,
            applicationStatus: document.getElementById("application_status").value,
            dateApplied: document.getElementById("date_applied").value,
            followUpDate: document.getElementById("follow_up_date").value,
            applicationLink: document.getElementById("application_link").value,
            startDate: document.getElementById("start_date").value,
            contactPerson: document.getElementById("contact_person").value,
            contactEmail: document.getElementById("contact_email").value,
            referral: document.getElementById("referral").checked,
            offerReceived: document.getElementById("offer_received").checked,
            offerDeadline: document.getElementById("offer_deadline").value,
            notes: document.getElementById("notes").value,
            location: document.getElementById("location").value,
            salary: parseFloat(document.getElementById("salary").value) || 0,
            internshipDuration: document.getElementById("internship_duration").value,
            skillsRequired: JSON.stringify(
                document
                    .getElementById("skills_required")
                    .value.split(",")
                    .map((skill) => skill.trim())
            )
        };

        console.log(newInternship);
        closeModal();
    };
});
