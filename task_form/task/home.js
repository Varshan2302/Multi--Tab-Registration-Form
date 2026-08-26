const employeeListSection = document.querySelector("#employeeListSection");
const registrationFormSection = document.querySelector("#registrationFormSection");
const addFormButton = document.querySelector("#addFormButton");
const employeeSearch = document.querySelector("#employeeSearch");
const tableBody = document.querySelector("#employeeTableBody");

const displayRequiredDetails = function(){
    try{
        const savedData = JSON.parse(localStorage.getItem("personalDetails") || "[]");

        if(!tableBody){
            return;
        }
        tableBody.innerHTML = "";
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
        
        }catch(error){
            console.error("Employee list Display error:" + error);
        }
    }

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

        
        if (tableBody) {
        tableBody.addEventListener("click",function (event) {
                try {
                    const deleteButton = event.target.closest(".delete-person");
                    if (!deleteButton) {
                        return;
                    }
                    const index = Number(deleteButton.getAttribute("data-index"));
                    const savedData = JSON.parse(localStorage.getItem("personalDetails") || "[]");

                    savedData.splice(index, 1);

                    localStorage.setItem("personalDetails",JSON.stringify(savedData));

                    displayRequiredDetails();

                } catch (error) {
                    console.error("Delete details error: " + error);
                }
            });
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