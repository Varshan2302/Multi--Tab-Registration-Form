const displayRequiredDetails = function(){
    try{
        const savedData = JSON.parse(localStorage.getItem("personalDetails"));

        const personalDataList = document.querySelector("#personalDataList");

        if(!savedData || !personalDataList){
            return;
        }
        personalDataList.innerHTML = `
        <div class ="employee-list">
        <h2>Employee List</h2>
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
        const deleteButtons = document.querySelectorAll(".delete-person");
        deleteButtons.forEach(function (button){
            button.addEventListener("click", function(){
                try{
                    const index = Number(button.getAttribute("data-index"));
                    const savedData = JSON.parse(localStorage.getItem("personalDetails")) || [];
                    savedData.splice(index, 1);
                    localStorage.setItem("personalDetails",JSON.stringify(savedData));
                    
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

displayRequiredDetails();