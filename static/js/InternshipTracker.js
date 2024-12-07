// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {

    /**
     * Custom HTML Element for the Internship Tracker table
     */
    class InternshipTracker extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }

        // Lifecycle method called when the element is added to the DOM
        connectedCallback() {
            this.render();
            this.initializeTable();
        }

        // Render the HTML structure for the element
        render() {
            this.shadowRoot.innerHTML = `
                <style>
                    @import "InternshipTracker.css"; /* Import external CSS */
                </style>
                <div class="datatable-wrapper">
                    <table id="InternshipTrackerTable" class="datatable-table"></table>
                </div>
                <button class="add-button" onclick="openAddModal()">+</button>
                <div id="internshipModal" class="modal">
                    <!-- Modal content here -->
                </div>
            `;
        }
    }

    // Data representing internships
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

    // Predefined colors for skill pills
    const pillColors = ["#072F5F", "#1261A0", "#3895D3", "#58CCED"];

    /**
     * Generate skill pills as HTML elements
     * @param {string} skillsRequired - JSON string of required skills
     * @returns {string} - HTML string for skill pills
     */
    const generateSkillPills = (skillsRequired) => {
        const skills = JSON.parse(skillsRequired);
        return skills.map((skill, index) => {
            const color = pillColors[index % pillColors.length];
            return `<span class="pill" style="background-color: ${color};">${skill}</span>`;
        }).join(" ");
    };

    // Application status options
    const statusOptions = [
        "Applied", "Interviewing", "Shortlisted", "OfferReceived", 
        "Rejected", "Pending", "OnHold", "InProgress", "Withdrew"
    ];

    // Colors corresponding to application statuses
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

    /**
     * Change the background color of the dropdown based on the selected status
     * @param {HTMLElement} selectElement - Dropdown element
     */
    window.changeStatus = function(selectElement) {
        const newStatus = selectElement.value;
        selectElement.style.backgroundColor = statusColors[newStatus];
    };

    /**
     * Generate a dropdown for application statuses
     * @param {string} currentStatus - Current status of the application
     * @returns {string} - HTML for the dropdown
     */
    const generateStatusDropdown = (currentStatus) => {
        const options = statusOptions.map((status) => {
            const selected = status === currentStatus ? "selected" : "";
            return `<option value="${status}" ${selected}>${status}</option>`;
        }).join("");

        return `
            <select class="status-dropdown" 
                    onchange="changeStatus(this)" 
                    style="background-color: ${statusColors[currentStatus]};">
                ${options}
            </select>
        `;
    };

    // Initialize the data table
    const dataTable = new simpleDatatables.DataTable("#InternshipTrackerTable", {
        searchable: true,
        columns: [
            { select: 0, sortable: false }, // Expand/collapse column
            { select: 6, sortable: false } // Edit button column
        ],
        data: {
            headings: [
                "", "Company Name", "Position Title", "Application Status",
                "Date Applied", "Application Link", ""
            ],
            data: internshipData.map((item, index) => [
                `<span class="dt-control" data-index="${index}">▶</span>`,
                item.companyName,
                item.positionTitle,
                generateStatusDropdown(item.applicationStatus),
                item.dateApplied,
                `<a href="${item.applicationLink}" target="_blank">Link</a>`,
                `<div class="edit" onclick='editInternship(${JSON.stringify(item)})'>✎</div>`
            ])
        }
    });

    // Handle row expansion to show detailed internship info
    document.querySelector('#InternshipTrackerTable tbody').addEventListener('click', function(e) {
        if (!e.target.classList.contains('dt-control')) return;

        const tr = e.target.closest('tr');
        const index = e.target.dataset.index;
        const item = internshipData[index];

        // Toggle expansion
        if (tr.nextElementSibling?.classList.contains('expanded-details')) {
            // Close expanded rows
            while (tr.nextElementSibling?.classList.contains('expanded-details')) {
                tr.nextElementSibling.remove();
            }
            e.target.textContent = '▶';
        } else {
            // Expand row to show details
            const detailRows = [
                ['Salary', `$${parseFloat(item.salary).toFixed(2)}`],
                ['Location', item.location],
                ['Contact', `${item.contactPerson} (${item.contactEmail})`],
                ['Important Dates', `Start: ${item.startDate} | Follow-up: ${item.followUpDate} | Deadline: ${item.offerDeadline || 'N/A'}`],
                ['Status', `Referral: ${item.referral ? 'Yes' : 'No'} | Offer: ${item.offerReceived ? 'Yes' : 'No'}`],
                ['Duration', item.internshipDuration],
                ['Skills', generateSkillPills(item.skillsRequired)],
                ['Notes', item.notes]
            ].map(([label, value]) => `
                <tr class="expanded-details">
                    <td></td>
                    <td class="detail-label">${label}</td>
                    <td colspan="5" class="detail-value">${value}</td>
                </tr>
            `).join('');

            tr.insertAdjacentHTML('afterend', detailRows);
            e.target.textContent = '▼';
        }
    });

    // Modal logic for adding/editing internships
    const modal = document.getElementById("addInternshipModal");
    const addButton = document.getElementById("addRowBtn");
    const closeButton = document.querySelector(".close");
    const cancelButton = document.querySelector(".cancel-btn");
    const saveButton = document.getElementById("saveInternship");

    // Show the modal
    addButton.onclick = () => {
        modal.style.display = "block";
        document.querySelector('.modal-header h2').textContent = 'Add New Internship';
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

    // Save form data when the modal is submitted
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

    /**
     * Edit an internship entry
     * @param {object} item - Internship details
     */
    window.editInternship = function(item) {
        const itemValues = typeof item === 'string' ? JSON.parse(item) : item;
        modal.style.display = "block";
        document.querySelector('.modal-header h2').textContent = 'Edit Internship';

        // Pre-fill form fields
        const formatDate = (dateString) => {
            if (!dateString) return '';
            const [month, day, year] = dateString.split('/');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        };

        document.getElementById("company_name").value = itemValues.companyName;
        document.getElementById("position_title").value = itemValues.positionTitle;
        document.getElementById("application_status").value = itemValues.applicationStatus;
        document.getElementById("date_applied").value = formatDate(itemValues.dateApplied);
        document.getElementById("follow_up_date").value = formatDate(itemValues.followUpDate);
        document.getElementById("application_link").value = itemValues.applicationLink;
        document.getElementById("start_date").value = formatDate(itemValues.startDate);
        document.getElementById("contact_person").value = itemValues.contactPerson;
        document.getElementById("contact_email").value = itemValues.contactEmail;
        document.getElementById("referral").checked = itemValues.referral;
        document.getElementById("offer_received").checked = itemValues.offerReceived;
        document.getElementById("offer_deadline").value = formatDate(itemValues.offerDeadline);
        document.getElementById("notes").value = itemValues.notes;
        document.getElementById("location").value = itemValues.location;
        document.getElementById("salary").value = parseFloat(itemValues.salary);
        document.getElementById("internship_duration").value = itemValues.internshipDuration;
        document.getElementById("skills_required").value = JSON.parse(itemValues.skillsRequired).join(", ");

        // Save updated data
        const saveButton = document.querySelector(".save-btn");
        saveButton.onclick = () => {
            const updatedInternship = {
                ...item,
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

            console.log(updatedInternship);
            closeModal();
        };
    };
});
