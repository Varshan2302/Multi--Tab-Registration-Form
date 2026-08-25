const employeeListSection = document.querySelector("#employeeListSection");
const registrationFormSection = document.querySelector("#registrationFormSection");
const displayRequiredDetails = function(){
    try{
        const savedData = JSON.parse(localStorage.getItem("personalDetails") || "[]");

        const personalDataList = document.querySelector("#personalDataList");

        if(!savedData || !personalDataList){
            return;
        }
        personalDataList.innerHTML = `
        <div class ="employee-list">
        <div class="employee-list-header">
            <h2>Employee List</h2>
            <div class="employee-list-actions">
                <input
                    type="text"
                    id="employeeSearch"
                    placeholder="Search...">

                <button
                    type="button"
                    id="addFormButton">
                    + Add Form
                </button>
            </div>
        </div>
            <div class = "table-wrapper">
                <table class = "employee-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>City</th>
                            <th>Institution</th>
                            <th>Year of Passing</th>
                            <th>Company</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="employeeTableBody"></tbody>
                </table>
            </div>
        </div>
        `;
        const tableBody = document.querySelector("#employeeTableBody");
        savedData.forEach(function (person,index){
            tableBody.innerHTML +=`
            <tr>
                <td>${index + 1}</td>
                <td>${person.fullName}</td>
                <td>${person.gender}</td>
                <td>${person.city}</td>
                <td>${person.institution}</td>
                <td>${person.yearOfPassing}</td>
                <td>${person.companyName}</td>
                <td>
                    <button
                        type="button"
                        class="delete-person"
                        data-index="${index}">
                        🗑
                    </button>
                </td>
            </tr>
            `;
        });
        const addFormButton = document.querySelector("#addFormButton");

        if (addFormButton) {
            addFormButton.addEventListener("click", function () {
                try {
                    employeeListSection.style.display = "none";
                    registrationFormSection.style.display = "block";
                    showStep(1);
                } catch (error) {
                    console.error(
                        "Add form error: " + error
                    );
                }
            });
        }

        const employeeSearch = document.querySelector("#employeeSearch");
        if (employeeSearch) {
            employeeSearch.addEventListener("input", function () {
                try {
                    const searchValue = employeeSearch.value.toLowerCase().trim();
                    const rows =document.querySelectorAll("#employeeTableBody tr");

                    rows.forEach(function (row) {

                    const rowText = row.textContent.toLowerCase();

                    if (rowText.includes(searchValue)) {
                        row.style.display = "";
                    }
                    else {
                        row.style.display = "none";
                    }
                });
            } 
            catch (error) {
                console.error("Employee search error: " + error);
            }
        });
        }

        const deleteButtons = document.querySelectorAll(".delete-person");
        deleteButtons.forEach(function (button){
            button.addEventListener("click", function(){
                try{
                    const index = Number(button.getAttribute("data-index"));
                    const savedData = JSON.parse(localStorage.getItem("personalDetails")) || [];
                    savedData.splice(index, 1);
                    localStorage.setItem("personalDetails",JSON.stringify(savedData));
                    displayRequiredDetails();
                }
                catch(error){
                    console.error("Delete details error: " + error);
                }
            });
        });
    }catch(error){
        console.error("Employee list Display error:" + error);
    }
}


const showEmployeeList = function () {
    try {

        employeeListSection.style.display = "block";
        registrationFormSection.style.display = "none";

        displayRequiredDetails();

    } catch (error) {

        console.error(
            "Employee list display error: " + error
        );
    }
};

showEmployeeList();