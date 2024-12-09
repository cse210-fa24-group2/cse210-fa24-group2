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
    let dataTable;
    async function addInternship(internshipData) {
        try {
            const response = await fetch("/api/internships", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(internshipData),
            });
    
            const result = await response.json();
            if (response.ok) {
                console.log("Internship added successfully:", result);
                internshipDataFetch();
            } else {
                console.error("Error adding internship:", result.error);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
    
    // Data representing internships
   
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
    // const internshipData = [
    //     {
    //         internshipId: "1",
    //         companyName: "Google",
    //         positionTitle: "Software Engineer Intern",
    //         applicationStatus: "Applied",
    //         dateApplied: "11/10/2024",
    //         followUpDate: "11/20/2024",
    //         applicationLink: "https://careers.google.com/jobs/results/12345",
    //         startDate: "06/01/2025",
    //         contactPerson: "Jane Doe",
    //         contactEmail: "jane.doe@google.com",
    //         referral: true,
    //         offerReceived: false,
    //         offerDeadline: "",
    //         notes: "Submitted coding test on 11/15/2024.",
    //         location: "Mountain View, CA",
    //         salary: "8000.0",
    //         internshipDuration: "12 weeks",
    //         skillsRequired: '["Python", "C++", "Data Structures"]'
    //     }]
    function attachRowExpansionLogic() {
        const tableBody = document.querySelector('#InternshipTrackerTable tbody');
    
        if (!tableBody) {
            console.error("Table body not found for attaching row expansion logic.");
            return;
        }
    
        // Attach click event for row expansion
        tableBody.addEventListener('click', function (e) {
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
    }
    
    async function internshipDataFetch() {
        try {
            const response = await fetch('/internshipData');
            const data = await response.json();
    
            console.log('Received:', data);
            internshipData = data;
    
            // Destroy the existing table if it exists
            if (dataTable) {
                dataTable.destroy();
            }
    
            // Ensure the table has a <tbody>
            const tableBody = document.querySelector("#InternshipTrackerTable tbody");
            if (!tableBody) {
                const table = document.querySelector("#InternshipTrackerTable");
                const newTbody = document.createElement("tbody");
                table.appendChild(newTbody);
            } else {
                tableBody.innerHTML = ""; // Clear existing rows
            }
    
            // Reinitialize the DataTable with updated data
            dataTable = new simpleDatatables.DataTable("#InternshipTrackerTable", {
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
    
            // Reattach row expansion logic
            attachRowExpansionLogic();
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    
    internshipDataFetch();

    
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
            company_name: document.getElementById("company_name").value,
            position_title: document.getElementById("position_title").value,
            application_status: document.getElementById("application_status").value,
            date_applied: document.getElementById("date_applied").value,
            follow_up_date: document.getElementById("follow_up_date").value,
            application_link: document.getElementById("application_link").value,
            start_date: document.getElementById("start_date").value,
            contact_person: document.getElementById("contact_person").value,
            contact_email: document.getElementById("contact_email").value,
            referral: document.getElementById("referral").checked,
            offer_received: document.getElementById("offer_received").checked,
            notes: document.getElementById("notes").value,
            location: document.getElementById("location").value,
            salary: parseFloat(document.getElementById("salary").value) || 0,
            internship_duration: document.getElementById("internship_duration").value,
            skills_required: JSON.stringify(
                document
                    .getElementById("skills_required")
                    .value.split(",")
                    .map((skill) => skill.trim())
            )
        };
        addInternship(newInternship)
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
saveButton.onclick = async () => {
    const updatedInternship = {
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

    try {
        const response = await fetch(`/api/internships/${item.internshipId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedInternship),
        });

        if (response.ok) {
            console.log("Internship updated successfully.");
            internshipDataFetch(); // Refresh the data
        } else {
            const errorData = await response.json();
            console.error("Error updating internship:", errorData.error);
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        closeModal();
    }
};
    };
});