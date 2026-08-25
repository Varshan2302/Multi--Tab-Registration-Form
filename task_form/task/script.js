const FORM_CONFIG = Object.freeze({
    TOTAL_STEPS: 6,
    MAX_FILE_SIZE: 1024 * 1024,
    MAX_DOCUMENT_SIZE: 2 * 1024 * 1024,
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 100,
    MIN_ADDRESS_LENGTH: 5,
    MAX_ADDRESS_LENGTH: 255
});

const panels = document.querySelectorAll(".panel");

let currentStep = 1;

//COMMON STEP NAVIGATION
function showStep(stepNumber) {
    try {
        if (stepNumber < 1 || stepNumber > FORM_CONFIG.TOTAL_STEPS) {
            throw new Error("Invalid step number");
        }

        panels.forEach(function (panel) {
            panel.style.display = "none";
        });

        const currentPanel =
            document.querySelector(`#panel${stepNumber}`);

        if (!currentPanel) {
            throw new Error("Page not found");
        }

        currentPanel.style.display = "block";
        currentStep = stepNumber;

        const tabButtons = document.querySelectorAll(".tab-btn");

        tabButtons.forEach(function (button) {
            button.classList.remove("active");
        });

        const activeTab =
            document.querySelector(`.tab-btn[for="tab${stepNumber}"]`);

        if (!activeTab) {
            throw new Error("Active tab not found");
        }

        activeTab.classList.add("active");

    } catch (error) {
        console.error("Step Navigation error: " + error);
    }
}

showStep(1);

// PREVIOUS BUTTONS
const previousButtons = document.querySelectorAll(".btn-prev");

previousButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
        try {
            event.preventDefault();

            if (currentStep <= 1) {
                throw new Error("Already on the first page");
            }

            showStep(currentStep - 1);

        } catch (error) {
            console.error("Previous navigation error: " + error);
        }
    });
});

// TOP TAB NAVIGATION
const tabButtons = document.querySelectorAll(".tab-btn");

tabButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
        try {
            event.preventDefault();

            const targetTab = button.getAttribute("for");

            if (!targetTab) {
                throw new Error("Tab target not found");
            }

            const targetStep = Number(targetTab.replace("tab", ""));

            if (targetStep > currentStep) {
                throw new Error("Please complete the current step first");
            }

            showStep(targetStep);

        } catch (error) {
            console.error("Tab navigation error: " + error);
        }
    });
});


// ENUM OPTIONS
const genderOptions = document.querySelector("#genderOptions");

if (!genderOptions) {
    throw new Error("Gender options container not found");
}

genderOptions.innerHTML = "";

Object.values(FORM_ENUMS.GENDER).forEach(function (gender, index) {
    const label = document.createElement("label");

    label.className = "radio-inline";

    label.innerHTML = `
        <input
            type="radio"
            name="gender"
            value="${gender}"
            ${index === 0 ? "required" : ""}
        >
        ${gender}
    `;

    genderOptions.appendChild(label);
});


const state = document.querySelector("#state");

if (!state) {
    throw new Error("State field not found");
}

FORM_ENUMS.STATE.forEach(function (stateName) {
    const option = document.createElement("option");

    option.value = stateName;
    option.textContent = stateName;

    state.appendChild(option);
});


const country = document.querySelector("#country");

if (!country) {
    throw new Error("Country field not found");
}

FORM_ENUMS.COUNTRY.forEach(function (countryName) {
    const option = document.createElement("option");

    option.value = countryName;
    option.textContent = countryName;

    country.appendChild(option);
});

// YEAR OF PASSING
const passingYear = document.querySelector("#passingYear");

if (!passingYear) {
    throw new Error("Passing year field not found");
}

for (let year = 2026; year >= 1976; year--) {
    const option = document.createElement("option");

    option.value = year;
    option.textContent = year;

    passingYear.appendChild(option);
}

// PERSONAL DETAILS
const dob = document.querySelector("#dob");

const dobError = document.querySelector("#dobError");

const today = new Date().toISOString().split("T")[0];

dob.max = today;

dob.addEventListener("change", function () {
    try {
        if (dob.value > today) {
            dob.value = "";
            dobError.textContent =
                "Date of Birth cannot be a future date";

            throw new Error("Future date is not allowed");
        }

        dobError.textContent = "";

    } catch (error) {
        console.error("Date validation error: " + error);
    }
});


const namePattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const mobilePattern = /^[0-9]{10}$/;


const validatePersonalDetails = function () {
    try {
        const errors = {};

        // Full Name
        const fullName = document.querySelector("#fullName");

        const fullNameError = document.querySelector("#fullNameError");

        const fullNameValue = fullName.value.trim();

        if (fullNameValue === "") {
            errors["fullName"] = "Full Name is required";

        } 
        else if (fullNameValue.length < FORM_CONFIG.MIN_NAME_LENGTH){
            errors["fullName"] ="Full Name must contain at least 2 characters";
        } 
        else if (fullNameValue.length > FORM_CONFIG.MAX_NAME_LENGTH) {
            errors["fullName"] ="Full Name must not exceed 100 characters";
        }
        else if (!namePattern.test(fullNameValue)) {
            errors["fullName"] = "Full Name can contain only letters and spaces";
        }

        fullNameError.textContent = errors["fullName"] || "";


        // Email
        const email = document.querySelector("#email");

        const emailError = document.querySelector("#emailError");

        const emailValue = email.value.trim();

        if (emailValue === "") {
            errors["email"] ="Email is required";

        } 
        else if (!emailPattern.test(emailValue)) {
            errors["email"] ="Please enter a valid email address";
        }

        emailError.textContent = errors["email"] || "";


        // Mobile
        const mobile = document.querySelector("#mobile");

        const mobileError = document.querySelector("#mobileError");

        const mobileValue = mobile.value.trim();

        if (mobileValue === "") {
            errors["mobile"] = "Mobile Number is required";

        }
        else if (!mobilePattern.test(mobileValue)) {
            errors["mobile"] = "Mobile Number must contain exactly 10 digits";
        }

        mobileError.textContent = errors["mobile"] || "";

        // Date of Birth
        const dobValue = dob.value.trim();

        if (dobValue === "") {
            errors["dob"] = "Date of Birth is required";

        } else if (dobValue > today) {
            errors["dob"] = "Date of Birth cannot be a future date";
        }

        dobError.textContent = errors["dob"] || "";


        // Gender
        const gender = document.querySelector('input[name="gender"]:checked');

        const genderError = document.querySelector("#genderError");

        if (!gender) {
            errors["gender"] ="Gender is required";
        }

        genderError.textContent = errors["gender"] || "";


        // Profile Photo
        /* const photo = document.querySelector("#photo");

        const photoError = document.querySelector("#photoError");

        if (photo.files.length === 0) {
            errors["photo"] = "Profile Photo is required";

        } else {
            const file = photo.files[0];

            if (file.size > FORM_CONFIG.MAX_FILE_SIZE) {
                errors["photo"] = "Profile Photo must not exceed 1 MB";
            }
        }

        photoError.textContent = errors["photo"] || ""; */

        return Object.keys(errors).length === 0;

    } catch (error) {
        console.error(
            "Personal Details Validation error: " + error
        );
        return false;
    }
};

//JSON ARRAY
const savedData = JSON.parse(localStorage.getItem("personalDetails") || "[]");
const formData = savedData;

const saveRequiredDetails = function(){
    try{
        const gender = document.querySelector('input[name="gender"]:checked');

        const personalDetails = {
            fullName : document.querySelector("#fullName").value.trim(),
            gender : gender ? gender.value : "",
            city : document.querySelector("#city").value.trim(),
            institution : document.querySelector("#institution").value.trim(),
            yearOfPassing : document.querySelector("#passingYear").value,
            companyName : document.querySelector("#company").value.trim(),
        }
        formData.push(personalDetails);
        localStorage.setItem("personalDetails",JSON.stringify(formData));
    }catch(error){
        console.error("Required details save error: " + error);
    }
}


const personalNextButton = document.querySelector(".btn--personal");

personalNextButton.addEventListener("click", function (event) {
    try {
        event.preventDefault();

        const isValid = validatePersonalDetails();

        if (!isValid) {
            throw new Error("Please fill all required personal details");
        }

        showStep(2);

    } catch (error) {
        console.error(
            "Personal Details Navigation error: " + error
        );
    }
});

// ADDRESS DETAILS

const addressPattern = /^[A-Za-z0-9\s,./#-]+$/;

const cityPattern = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

const pincodePattern = /^[0-9]{6}$/;


const validateAddressDetails = function () {
    try {
        const errors = {};

        // Address Line 1
        const addr1 = document.querySelector("#addr1");

        const addr1Error = document.querySelector("#addr1Error");

        const addr1Value = addr1.value.trim();

        if (addr1Value === "") {
            errors["addr1"] = "Address Line 1 is required";

        } 
        else if (addr1Value.length < FORM_CONFIG.MIN_ADDRESS_LENGTH) {
            errors["addr1"] =
                "Address Line 1 must contain at least 5 characters";

        } 
        else if (addr1Value.length > FORM_CONFIG.MAX_ADDRESS_LENGTH) {
            errors["addr1"] =
                "Address Line 1 must not exceed 255 characters";

        } 
        else if (!addressPattern.test(addr1Value)) {
            errors["addr1"] = "Address contains invalid characters";
        }

        addr1Error.textContent = errors["addr1"] || "";


        // Address Line 2
        const addr2 = document.querySelector("#addr2");

        const addr2Error = document.querySelector("#addr2Error");

        const addr2Value = addr2.value.trim();

        if (addr2Value === "") {
            errors["addr2"] = "Address Line 2 is required";

        } 
        else if (addr2Value.length < FORM_CONFIG.MIN_ADDRESS_LENGTH) {
            errors["addr2"] = "Address Line 2 must contain at least 5 characters";

        } 
        else if (addr2Value.length > FORM_CONFIG.MAX_ADDRESS_LENGTH) {
            errors["addr2"] = "Address Line 2 must not exceed 255 characters";

        }
        else if (!addressPattern.test(addr2Value)) {
            errors["addr2"] = "Address contains invalid characters";
        }

        addr2Error.textContent = errors["addr2"] || "";


        // City
        const city = document.querySelector("#city");

        const cityError = document.querySelector("#cityError");

        const cityValue = city.value.trim();

        if (cityValue === "") {
            errors["city"] = "City is required";

        } else if (!cityPattern.test(cityValue)) {
            errors["city"] = "City can contain only letters, spaces and hyphens";
        }

        cityError.textContent = errors["city"] || "";


        // State
        const stateError = document.querySelector("#stateError");

        if (state.value === "") {
            errors["state"] = "State is required";
        }

        stateError.textContent = errors["state"] || "";


        // Country
        const countryError = document.querySelector("#countryError");

        if (country.value === "") {
            errors["country"] = "Country is required";
        }

        countryError.textContent = errors["country"] || "";


        // Pincode
        const pincode = document.querySelector("#pincode");

        const pincodeError = document.querySelector("#pincodeError");

        const pincodeValue = pincode.value.trim();

        if (pincodeValue === "") {
            errors["pincode"] = "Pincode is required";

        } 
        else if (!pincodePattern.test(pincodeValue)) {
            errors["pincode"] = "Pincode must contain exactly 6 digits";
        }

        pincodeError.textContent = errors["pincode"] || "";


        return Object.keys(errors).length === 0;

    } catch (error) {
        console.error(
            "Address Details Validation error: " + error
        );
        return false;
    }
};


const addressNextButton = document.querySelector(".btn--address");

addressNextButton.addEventListener("click", function (event) {
    try {
        event.preventDefault();

        const isValid =
            validateAddressDetails();

        if (!isValid) {
            throw new Error(
                "Please fill all required address fields"
            );
        }

        showStep(3);

    } catch (error) {
        console.error(
            "Address Details Navigation error: " + error
        );
    }
});


// EDUCATION DETAILS
const validateEducationDetails = function () {
    try {
        const errors = {};

        // Qualification
        const qualification = document.querySelector("#qualification");

        const qualificationError = document.querySelector("#qualificationError");

        if (qualification.value === "") {
            errors["qualification"] = "Highest Qualification is required";
        }

        qualificationError.textContent = errors["qualification"] || "";


        // Institution
        const institution = document.querySelector("#institution");

        const institutionError = document.querySelector("#institutionError");

        const institutionValue = institution.value.trim();

        if (institutionValue === "") {
            errors["institution"] = "Institution is required";
        }

        institutionError.textContent = errors["institution"] || "";


        // Field of Study
        const fieldOfStudy = document.querySelector("#fieldOfStudy");

        const fieldOfStudyError = document.querySelector("#fieldOfStudyError");

        const fieldOfStudyValue = fieldOfStudy.value.trim();

        if (fieldOfStudyValue === "") {
            errors["fieldOfStudy"] = "Field of Study is required";
        }

        fieldOfStudyError.textContent = errors["fieldOfStudy"] || "";


        // Year of Passing
        const passingYearError = document.querySelector("#passingYearError");

        if (passingYear.value === "") {
            errors["passingYear"] = "Year of Passing is required";
        }

        passingYearError.textContent = errors["passingYear"] || "";


        return Object.keys(errors).length === 0;

    } catch (error) {
        console.error(
            "Education Details Validation error: " + error
        );
        return false;
    }
};


const educationNextButton = document.querySelector(".btn--education");

educationNextButton.addEventListener("click", function (event) {
    try {
        event.preventDefault();

        const isValid =
            validateEducationDetails();

        if (!isValid) {
            throw new Error(
                "Please fill all required education fields"
            );
        }

        showStep(4);

    } catch (error) {
        console.error(
            "Education Details Navigation error: " + error
        );
    }
});

// WORK EXPERIENCE
const validateWorkExperience = function () {
    try {
        const errors = {};

        // Company
        const company = document.querySelector("#company");

        const companyError = document.querySelector("#companyError");

        if (company.value.trim() === "") {
            errors["company"] = "Company Name is required";
        }

        companyError.textContent = errors["company"] || "";


        // Designation
        const designation = document.querySelector("#designation");

        const designationError = document.querySelector("#designationError");

        if (designation.value.trim() === "") {
            errors["designation"] = "Designation is required";
        }

        designationError.textContent = errors["designation"] || "";


        // Experience
        const experience = document.querySelector("#experience");

        const experienceError = document.querySelector("#experienceError");

        if (experience.value.trim() === "") {
            errors["experience"] = "Experience is required";
        } 
        else if (Number(experience.value) < 0) {
            errors["experience"] = "Experience cannot be negative";
        }

        experienceError.textContent = errors["experience"] || "";


        // Skills
        const skills = document.querySelector("#skills");

        const skillsError = document.querySelector("#skillsError");

        if (skills.value.trim() === "") {
            errors["skills"] = "Skills are required";
        }

        skillsError.textContent = errors["skills"] || "";


        // Current Salary
        const currentSalary = document.querySelector("#currentSalary");

        const currentSalaryError = document.querySelector("#currentSalaryError");

        if (currentSalary.value.trim() === "") {
            errors["currentSalary"] = "Current Salary is required";
        } 
        else if (Number(currentSalary.value) < 0) {
            errors["currentSalary"] = "Current Salary cannot be negative";
        }

        currentSalaryError.textContent = errors["currentSalary"] || "";


        // Expected Salary
        const expectedSalary = document.querySelector("#expectedSalary");

        const expectedSalaryError = document.querySelector("#expectedSalaryError");

        if (expectedSalary.value.trim() === "") {
            errors["expectedSalary"] = "Expected Salary is required";
        } 
        else if (Number(expectedSalary.value) < 0) {
            errors["expectedSalary"] = "Expected Salary cannot be negative";
        }

        expectedSalaryError.textContent = errors["expectedSalary"] || "";

        return Object.keys(errors).length === 0;

    } catch (error) {
        console.error(
            "Work Experience Validation error: " + error
        );
        return false;
    }
};


const workNextButton = document.querySelector(".btn--work");

workNextButton.addEventListener("click", function (event) {
    try {
        event.preventDefault();

        const isValid =
            validateWorkExperience();

        if (!isValid) {
            throw new Error(
                "Please fill all required work experience fields"
            );
        }

        showStep(5);

    } catch (error) {
        console.error(
            "Work Experience Navigation error: " + error
        );
    }
});


// DOCUMENTS
const validateDocuments = function () {
    try {
        const errors = {};

        const documentFields = [
            {
                input: document.querySelector("#resume"),
                error: document.querySelector("#resumeError"),
                key: "resume",
                message: "Resume is required",
                sizeMessage: "Resume must not exceed 2 MB"
            },
            {
                input: document.querySelector("#aadhaar"),
                error: document.querySelector("#aadhaarError"),
                key: "aadhaar",
                message: "Aadhaar Card is required",
                sizeMessage: "Aadhaar Card must not exceed 2 MB"
            },
            {
                input: document.querySelector("#pan"),
                error: document.querySelector("#panError"),
                key: "pan",
                message: "PAN Card is required",
                sizeMessage: "PAN Card must not exceed 2 MB"
            },
            {
                input: document.querySelector("#passportPhoto"),
                error: document.querySelector("#passportPhotoError"),
                key: "passportPhoto",
                message: "Passport Size Photo is required",
                sizeMessage: "Passport Size Photo must not exceed 2 MB"
            }
        ];

        documentFields.forEach(function (field) {
            if (field.input.files.length === 0) {
                errors[field.key] = field.message;

            } else if (
                field.input.files[0].size >
                FORM_CONFIG.MAX_DOCUMENT_SIZE
            ) {
                errors[field.key] = field.sizeMessage;
            }

            field.error.textContent =
                errors[field.key] || "";
        });

        return Object.keys(errors).length === 0;

    } catch (error) {
        console.error(
            "Documents Validation error: " + error
        );
        return false;
    }
};



// REVIEW DETAILS
const generateReview = function () {
    try {
        const fullName = document.querySelector("#fullName").value.trim();

        const email = document.querySelector("#email").value.trim();

        const mobile = document.querySelector("#mobile").value.trim();

        const dob = document.querySelector("#dob").value;

        const gender = document.querySelector('input[name="gender"]:checked');

        const addr1 = document.querySelector("#addr1").value.trim();

        const addr2 = document.querySelector("#addr2").value.trim();

        const city = document.querySelector("#city").value.trim();

        const state = document.querySelector("#state");

        const country = document.querySelector("#country");

        const pincode = document.querySelector("#pincode").value.trim();

        const qualification = document.querySelector("#qualification");

        const institution = document.querySelector("#institution").value.trim();

        const fieldOfStudy = document.querySelector("#fieldOfStudy").value.trim();

        const company = document.querySelector("#company").value.trim();

        const designation = document.querySelector("#designation").value.trim();

        const experience = document.querySelector("#experience").value;

        const skills = document.querySelector("#skills").value.trim();

        const currentSalary = document.querySelector("#currentSalary").value;

        const expectedSalary = document.querySelector("#expectedSalary").value;

        const resume = document.querySelector("#resume");

        const aadhaar = document.querySelector("#aadhaar");

        const pan = document.querySelector("#pan");

        const passportPhoto = document.querySelector("#passportPhoto");


        document.querySelector("#reviewFullName").textContent = fullName;

        document.querySelector("#reviewEmail").textContent = email;

        document.querySelector("#reviewMobile").textContent = mobile;

        document.querySelector("#reviewDob").textContent = dob;

        document.querySelector("#reviewGender").textContent = gender ? gender.value : "";

        document.querySelector("#reviewAddress").textContent = `${addr1}, ${addr2}, ${city}, ${state.value} - ${pincode}, ${country.value}`;

        document.querySelector("#reviewEducation").textContent = `${qualification.value}, ${institution}, ${fieldOfStudy}, ${passingYear.value}`;

        document.querySelector("#reviewWork").textContent = `${company}, ${designation}, ${experience} years, Skills: ${skills}, Current Salary: ${currentSalary}, Expected Salary: ${expectedSalary}`;

        document.querySelector("#reviewDocuments").textContent =
            `Resume: ${resume.files[0]?.name || ""}, ` +
            `Aadhaar: ${aadhaar.files[0]?.name || ""}, ` +
            `PAN: ${pan.files[0]?.name || ""}, ` +
            `Passport Photo: ${passportPhoto.files[0]?.name || ""}`;

    } catch (error) {
        console.error("Review generation error: " + error);
    }
};


// DOCUMENTS NEXT BUTTON
const documentsNextButton = document.querySelector(".btn--documents");

documentsNextButton.addEventListener("click", function (event) {
    try {
        event.preventDefault();

        const isValid =
            validateDocuments();

        if (!isValid) {
            throw new Error(
                "Please upload all required documents"
            );
        }

        generateReview();
        showStep(6);

    } catch (error) {
        console.error(
            "Documents Navigation error: " + error
        );
    }
});


// SUBMIT / RESET
const submitForm = document.querySelector("#submitForm");

submitForm.addEventListener("submit", function (event) {
    try {
        event.preventDefault();
        const isValid =
            validatePersonalDetails() &&
            validateAddressDetails() &&
            validateEducationDetails() &&
            validateWorkExperience() &&
            validateDocuments();

        if (!isValid) {
            throw new Error(
                "Please complete all required fields before submitting"
            );
        }

        generateReview();

        saveRequiredDetails();

        window.location.href = "index.html";

    } catch (error) {
        console.error(
            "Form submission error: " + error
        );
    }
});


const resetButton = document.querySelector(".btn-reset");

resetButton.addEventListener("click", function (event) {
    try {
        event.preventDefault();

        document.querySelectorAll("form").forEach(function (form) {
            if (form.id !== "submitForm") {
                form.reset();
            }
        });

        localStorage.removeItem("personalDetails");

        const personalDataList =
            document.querySelector("#personalDataList");

        if (personalDataList) {
            personalDataList.innerHTML = "";
        }

        showStep(1);

    } catch (error) {
        console.error("Form reset error: " + error);
    }
});

