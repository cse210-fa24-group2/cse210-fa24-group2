// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {

    /**
     * Array to hold internship data.
     * @type {Array<Object>}
     */
    let internshipData = [];

    /**
     * DataTable instance for managing the table.
     * @type {Object}
     */
    let dataTable;

    /**
     * Adds a new internship entry to the database.
     * @param {Object} internshipData - The data for the new internship.
     * @returns {Promise<void>}
     */
    async function addInternship(internshipData) {
        try {
            const response = await fetch("/api/internships", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(internshipData),
            });

            const result = await response.json();
            if (response.ok) {
                console.log("Internship added successfully:", result);
                internshipDataFetch(); // Refresh data after successful addition
                window.fetchAndRenderDeadlines();
            } else {
                console.error("Error adding internship:", result.error);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    /**
     * Attaches row expansion logic to the table.
     */
    function attachRowExpansionLogic() {
        const tableBody = document.querySelector('#InternshipTrackerTable tbody');

        if (!tableBody) {
            console.error("Table body not found for attaching row expansion logic.");
            return;
        }

        tableBody.addEventListener('click', function (e) {
            if (!e.target.classList.contains('dt-control')) return;

            const tr = e.target.closest('tr');
            const index = e.target.dataset.index;
            const item = internshipData[index];
            const isSmallScreen = window.innerWidth <= 950;

            if (tr.nextElementSibling?.classList.contains('expanded-details')) {
                while (tr.nextElementSibling?.classList.contains('expanded-details')) {
                    tr.nextElementSibling.remove();
                }
                e.target.textContent = '▶';
            } else {
                let referral = (item.referral === 'true');
                let offer = (item.offerReceived === 'true');
                const detailRows = [
                    ['Salary', `$${parseFloat(item.salary).toFixed(2)}`],
                    ['Location', item.location],
                    ['Contact', `${item.contactPerson} (${item.contactEmail})`],
                    ['Important Dates', `Start: ${item.startDate} | Follow-up: ${item.followUpDate} | Deadline: ${item.offerDeadline || 'N/A'}`],
                    ['Status', `Referral: ${referral ? 'Yes' : 'No'} | Offer: ${offer ? 'Yes' : 'No'}`],
                    ['Duration', item.internshipDuration],
                    ['Notes', item.notes]
                ];

                if (isSmallScreen) {
                    detailRows.unshift(
                        ['Application Status', item.applicationStatus],
                        ['Date Applied', item.dateApplied],
                        ['Application Link', item.applicationLink ? `<a href="${item.applicationLink}" target="_blank">Link</a>` : "N/A"],
                        ['Actions', `<button class="in-row-edit" onclick='editInternship(${JSON.stringify(item)})'>✎</button> <button class="in-row-delete" onclick='deleteInternship(${JSON.stringify(item)})'>❌</button>`]
                    );
                }

                const detailHtml = detailRows.map(([label, value]) => `
                <tr class="expanded-details">
                    <td></td>
                    <td class="detail-label">${label}</td>
                    <td colspan="5" class="detail-value">${value}</td>
                </tr>
                `).join('');

                tr.insertAdjacentHTML('afterend', detailHtml);
                e.target.textContent = '▼';
            }
        });
    }

    /**
     * Fetches internship data and renders the table.
     * @returns {Promise<void>}
     */
    async function internshipDataFetch() {
        try {
            const response = await fetch('/internshipData');
            const data = await response.json();

            console.log('Received:', data);
            internshipData = data;

            if (dataTable) {
                dataTable.destroy();
            }

            const tableBody = document.querySelector("#InternshipTrackerTable tbody");
            if (!tableBody) {
                const table = document.querySelector("#InternshipTrackerTable");
                const newTbody = document.createElement("tbody");
                table.appendChild(newTbody);
            } else {
                tableBody.innerHTML = ""; // Clear existing rows
            }

            dataTable = new simpleDatatables.DataTable("#InternshipTrackerTable", {
                searchable: true,
                columns: [
                    { select: 0, sortable: false },
                    { select: 6, sortable: false },
                    { select: 7, sortable: false }
                ],
                data: {
                    headings: [
                        "", "Company Name", "Position Title", "Application Status",
                        "Date Applied", "Application Link", "", ""
                    ],
                    data: internshipData.map((item, index) => [
                        `<span class="dt-control" data-index="${index}">▶</span>`,
                        item.companyName,
                        item.positionTitle,
                        item.applicationStatus,
                        item.dateApplied,
                        item.applicationLink ? `<a href="${item.applicationLink}" target="_blank">Link</a>` : "N/A",
                        `<div class="edit" onclick='editInternship(${JSON.stringify(item)})'>✎</div>`,
                        `<div class="delete" onclick='deleteInternship(${JSON.stringify(item)})'>❌</div>`
                    ])
                }
            });

            attachRowExpansionLogic();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    internshipDataFetch();

    const modal = document.getElementById("addInternshipModal");
    const addButton = document.getElementById("addRowBtn");
    const closeButton = document.querySelector(".close");
    const cancelButton = document.querySelector(".cancel-btn");
    const saveButton = document.getElementById("saveInternship");

    addButton.onclick = () => {
        modal.style.display = "block";
        document.querySelector('.modal-header h2').textContent = 'Add New Internship';
    };

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
            offer_deadline: document.getElementById("offer_deadline").value,
            offer_received: document.getElementById("offer_received").checked,
            notes: document.getElementById("notes").value,
            location: document.getElementById("location").value,
            salary: parseFloat(document.getElementById("salary").value) || 0,
            internship_duration: document.getElementById("internship_duration").value
        };

        addInternship(newInternship);
        closeModal();
    };

    /**
     * Edits an internship entry.
     * @param {Object} item - Internship details.
     */
    window.editInternship = function (item) {
        // Implementation of edit functionality
    };

    /**
     * Deletes an internship entry.
     * @param {Object} item - Internship details.
     */
    window.deleteInternship = async function (item) {
        // Implementation of delete functionality
    };
});
