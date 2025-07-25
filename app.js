/* 
const form = document.querySelector("#cardDetailsForm");: This line finds the HTML element with the ID cardDetailsForm. This is assumed to be the <form> element containing all the input fields. If the element isn't found on the page, form will be null.
*/
const form = document.querySelector("#cardDetailsForm");

/* 
const liveData = { ... }: This creates an object named liveData. It acts as a temporary storage container in the browser's memory (RAM) to hold the current values entered by the user in the form fields. It's initialized with placeholder/default values (e.g., "Jane Appleseed", "0000 0000 0000 0000").
*/
const liveData = {
  fullName: "Jane Appleseed",
  cardNum: "0000 0000 0000 0000",
  month: "00",
  year: "00",
  cvc: "000",
};

/* 
if (form) { ... }: This is a crucial check. The entire main logic block (steps 2-11) only runs if the form element was actually found on the current page. This prevents errors on pages like thanks.html where the form doesn't exist.
*/
if (form) {
  /* 
  const inputs = form.querySelectorAll("input");: This selects all <input> elements that are descendants of the form element found in step 1. This gives us a list (NodeList) of all the input fields (Name, Card Number, MM, YY, CVC).
  */
  const inputs = form.querySelectorAll("input");

  /* 
  const submitButton = form.querySelector(".submit-button");: This finds the specific button within the form that has the CSS class submit-button. This is the button that will submit the form when clicked.
  */
  const submitButton = form.querySelector(".submit-button");

  /* 
  inputs.forEach((input) => { ... });: This loop iterates through each <input> field found in step 2, applying the following listeners and logic to each one individually.
  */
  inputs.forEach((input) => {
    /* 
    keypress Listener:

    input.addEventListener("keypress", (e) => { ... });: This sets up a function to run every time a key is pressed down while an input field is focused.
    */
    input.addEventListener("keypress", (e) => {
      /* 
      Purpose: To prevent the user from typing invalid characters before they are added to the input field.
      */

      if (
        /* 
        if ((input.name === "cardNum" || ... ) && /\D/.test(e.key)): Checks if the input field is one of the numeric fields (cardNum, month, year, cvc) and if the key pressed (e.key) is a non-digit character (using the regular expression \D which matches anything that is not 0-9).
        */
        (input.name === "cardNum" ||
          input.name === "month" ||
          input.name === "year" ||
          input.name === "cvc") &&
        /\D/.test(e.key)
      ) {
        /* 
        e.preventDefault();: If the condition is true, this stops the default action of the keypress, effectively blocking the non-digit character from being entered.
        */
        e.preventDefault();
        showMessage(input, "Numbers only.", true);
        return;
      } else if (input.name === "fullName" && /[^a-zA-Z\-']/.test(e.key)) {
        /* 
        else if (input.name === "fullName" && /[^a-zA-Z\-']/.test(e.key)): Checks if the input field is the fullName field and if the key pressed is not (^ inside [] means "not") a letter (a-z, A-Z), a hyphen (-), or an apostrophe (').
        */
        e.preventDefault();
        showMessage(input, "Letters, hyphen, or apostrophe only.", true);
        return;
      }
    });

    /* 
    input Listener:

    input.addEventListener("input", (e) => { ... });: This sets up a function to run every time the value of the input field changes. This includes typing, deleting, pasting (after the paste event logic runs), etc. This is where the main logic for formatting, updating the preview, and triggering validation happens.
    */
    input.addEventListener("input", (e) => {
      /* 
      const { name } = e.target;: Gets the name attribute of the input field that triggered the event (e.g., "cardNum", "fullName").
      */
      const { name } = e.target;

      /* 
      if (name === "cardNum"): Checks if the changed field is the card number.
      */
      if (name === "cardNum") {
        /* 
        const rawValue = e.target.value.replace(/\D/g, "");: Takes the current value in the input field and removes all non-digit characters (/\D/g means find all non-digits globally). This strips spaces or any pasted garbage.
        */
        const rawValue = e.target.value.replace(/\D/g, "");

        /* 
        const formatted = rawValue.replace(/(.{4})/g, "$1 ").trim();: Takes the rawValue string of digits and uses a regular expression to insert a space after every 4 characters. (.{4}) captures 4 characters, $1  replaces them with the captured characters plus a space. .trim() removes any trailing space that might result.
        */
        const formatted = rawValue.replace(/(.{4})/g, "$1 ").trim();

        /* 
        e.target.value = formatted;: Updates the value displayed in the card number input field to the formatted version (e.g., "1234 5678 9012 3456").
        */
        e.target.value = formatted;

        /* 
        liveData[name] = formatted;: Stores the formatted card number in the liveData object.
        */
        liveData[name] = formatted;
      } else {
        /* 
        else { liveData[name] = e.target.value; }: For all other fields (fullName, month, year, cvc), their current value (as typed/formatted by the user) is stored directly in liveData.
        */
        liveData[name] = e.target.value;
      }

      /* 
      const wrapper = document.querySelector(".header-wrapper");: Finds the HTML element (presumably containing the visual card representation) with the class header-wrapper.

      if (wrapper) { ... }: Checks if the wrapper was found (to prevent errors).
      */
      const wrapper = document.querySelector(".header-wrapper");
      if (wrapper) {
        /* 
        if (name === "cardNum") ...: Finds the element displaying the card number within the wrapper (.card-number) and updates its text content with the formatted number from liveData. .padEnd(19, "•") ensures it's at least 19 characters long (accounting for spaces), padding with • if the input is shorter (though formatting usually makes it 19).
        */
        if (name === "cardNum")
          wrapper.querySelector(".card-number").textContent =
            liveData.cardNum.padEnd(19, "•");
        if (name === "fullName")
          /* 
        if (name === "fullName") ...: Updates the .holder-name element with the value from liveData.
        */
          wrapper.querySelector(".holder-name").textContent = liveData.fullName;
        if (name === "month")
          /* 
        if (name === "month") ...: Updates the .exp-month element. .padEnd(2, "•") ensures it's at least 2 characters, padding with •.
        */
          wrapper.querySelector(".exp-month").textContent =
            liveData.month.padEnd(2, "•");
        if (name === "year")
          /* 
        if (name === "year") ...: Updates the .exp-year element. .padEnd(2, "•") ensures it's at least 2 characters, padding with •.
        */
          wrapper.querySelector(".exp-year").textContent = liveData.year.padEnd(
            2,
            "•"
          );
        if (name === "cvc")
          /* 
        if (name === "cvc") ...: Updates the .CVC element. .padEnd(3, "•") ensures it's at least 3 characters, padding with •.
        */
          wrapper.querySelector(".CVC").textContent = liveData.cvc.padEnd(
            3,
            "•"
          );
      }

      /* 
      validateInput(input);: Calls the validateInput function (defined later) to check if the current input field's value meets the required criteria. This will update visual feedback (like error/success messages and input styling).
      */
      validateInput(input);

      /* 
      updateSubmitButton();: Calls the updateSubmitButton function (defined later) to check if all fields are valid and enable/disable the submit button accordingly.
      */
      updateSubmitButton();
    });

    /* 
    paste Listener:

    input.addEventListener("paste", (e) => { ... });: This sets up a function to run when the user pastes content into an input field.
    Purpose: To intercept pasted content, validate it before it's inserted, and potentially prevent invalid pastes or clean up the pasted data.
    */
    input.addEventListener("paste", (e) => {
      /* 
      const pasted = (e.clipboardData || window.clipboardData).getData("text");: Retrieves the text content from the clipboard.
      */
      const pasted = (e.clipboardData || window.clipboardData).getData("text");

      /* 
      Similar if conditions as the keypress listener check if the pasted content contains invalid characters for the specific field (non-digits for numeric fields, invalid chars for name).
      */
      if (
        (input.name === "cardNum" ||
          input.name === "month" ||
          input.name === "year" ||
          input.name === "cvc") &&
        /\D/.test(pasted)
      ) {
        e.preventDefault();
        showMessage(input, "Numbers only.", true);
        return;
      } else if (input.name === "fullName" && /[^a-zA-Z\-']/.test(pasted)) {
        // Block anything that's not a letter, hyphen, or apostrophe
        e.preventDefault();
        showMessage(input, "Letters, hyphen, or apostrophe only.", true);
        return;
      }

      setTimeout(() => {
        input.value = input.value.replace(/\D/g, "");
        if (input.name === "cardNum") {
          input.value = input.value.replace(/(.{4})/g, "$1 ").trim();
        }
        liveData[input.name] = input.value;
        validateInput(input);
        updateSubmitButton();
      }, 0);
    });
  });

  /* 
  function validateInput(input) { ... }: This function takes a single input element as an argument and performs validation specific to that field.
  */
  function validateInput(input) {
    /* 
    const wrapper = input.closest("...");: Finds the parent container element (like .name-wrapper) that holds the input and its associated error/success message element (.message).
    */
    const wrapper =
      input.closest(".name-wrapper") ||
      input.closest(".card-num-wrapper") ||
      input.closest(".expiry-wrapper") ||
      input.closest(".cvc-wrapper");

    /* 
    const message = wrapper.querySelector(".message");: Selects the .message element within that wrapper.
    */
    const message = wrapper.querySelector(".message");

    /* 
    const value = input.value.trim();: Gets the current value of the input and removes any leading/trailing whitespace.
    */
    const value = input.value.trim();

    /* 
    clearMessage(input, message);: Calls a helper function to reset any previous styling or messages on the input and message element.
    */
    clearMessage(input, message);

    /* 
    if (value === "") { return setError(...); }: Checks if the trimmed value is empty. If so, it calls setError to mark the field as invalid and display a "Can't be blank" message, then exits the function.
    */
    if (value === "") {
      return setError(input, message, "Can't be blank.");
    }

    /* 
    let isValid = true;: Initializes a flag to assume the input is valid unless proven otherwise within the specific validation blocks.
    */
    let isValid = true;

    // Specific Validation Blocks:
    if (input.name === "fullName") {
      isValid = validateFullName(input, message);
    } else if (input.name === "cardNum") {
      isValid = validateCardNumber(input, message);
    } else if (input.name === "month" || input.name === "year") {
      isValid = validateExpiration(input, message);
    } else if (input.name === "cvc") {
      if (!/^\d{3}$/.test(value)) {
        isValid = setError(input, message, "CVC must be exactly 3 digits.");
      }
    }

    /* 
    if (isValid) { ... }: If the input passed all validation checks.
    */
    if (isValid) {
      setSuccess(input, message, "Looks good!");
      liveData[input.name] = input.value;
    }

    return isValid;
  }

  // Purpose: Validates the full name field.
  function validateFullName(nameInput, message) {
    /* 
    let val = nameInput.value...: Takes the input value, converts it to lowercase, splits it into words by whitespace (/\s+/), capitalizes the first letter of each word, and joins them back with spaces. This implements basic title casing.
    */
    let val = nameInput.value
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    nameInput.value = val;
    liveData[nameInput.name] = val;

    /* 
    if (words.length < 2 || !words.every(...)): Checks if there are fewer than 2 words OR if not every word consists only of letters, hyphens, or apostrophes (using /^[A-Za-z\-']+$/).
    */
    const words = val.trim().split(/\s+/);
    if (words.length < 2 || !words.every((w) => /^[A-Za-z\-']+$/.test(w))) {
      return setError(nameInput, message, "Must contain first & last name.");
    }

    return true;
  }

  // Validates the card number field.
  function validateCardNumber(cardInput, message) {
    //  Strips all non-digits from the input value.
    const digits = cardInput.value.replace(/\D/g, "");

    //  Checks if the resulting digit string is exactly 16 characters long.
    if (digits.length !== 16) {
      return setError(
        cardInput,
        message,
        "Credit card number must be exactly 16 digits."
      );
    }

    /* 
     Applies the 4-digit grouping formatting (even if it was already formatted, this ensures consistency).
    */
    const formatted = digits.replace(/(.{4})/g, "$1 ").trim();

    // Updates the input display.
    cardInput.value = formatted;
    liveData[cardInput.name] = formatted;
    return true;
  }

  // Validates the expiration month and year fields together.
  function validateExpiration(dateInput, message) {
    const monthVal = document.querySelector('input[name="month"]').value;
    const yearVal = document.querySelector('input[name="year"]').value;

    const month = parseInt(monthVal, 10);
    const year = parseInt(yearVal, 10);

    if (isNaN(month) || month < 1 || month > 12) {
      return setError(dateInput, message, "Enter a valid month (01 - 12).");
    }

    if (isNaN(year)) {
      return setError(dateInput, message, "Year is required.");
    }

    const currentDate = new Date();
    const fullYear = 2000 + year;
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (year < currentYear % 100 || year > (currentYear % 100) + 10) {
      return setError(
        dateInput,
        message,
        "Year must be within the next 10 years."
      );
    }

    if (
      fullYear < currentYear ||
      (fullYear === currentYear && month < currentMonth)
    ) {
      return setError(
        dateInput,
        message,
        "Expiration date cannot be in the past."
      );
    }

    liveData[dateInput.name] = dateInput.value;
    return true;
  }

  function setError(input, message, msg) {
    input.classList.add("invalid");
    message.classList.add("error-message");
    message.style.display = "block";
    message.textContent = msg;
    return false;
  }

  function setSuccess(input, message, msg) {
    input.classList.add("valid");
    message.classList.add("success-message");
    message.style.display = "block";
    message.textContent = msg;
  }

  function clearMessage(input, message) {
    input.classList.remove("valid", "invalid");
    message.classList.remove("success-message", "error-message");
    message.style.display = "none";
    message.textContent = "";
  }

  function showMessage(input, msg, isError = false) {
    const wrapper =
      input.closest(".card-num-wrapper") ||
      input.closest(".name-wrapper") ||
      input.closest(".expiry-wrapper") ||
      input.closest(".cvc-wrapper");
    const message = wrapper.querySelector(".message");
    input.classList.add(isError ? "invalid" : "valid");
    message.classList.add(isError ? "error-message" : "success-message");
    message.style.display = "block";
    message.textContent = msg;
  }

  function updateSubmitButton() {
    let isFormValid = true;
    inputs.forEach((input) => {
      if (!validateInput(input)) isFormValid = false;
    });
    submitButton.disabled = !isFormValid;
  }

  form.addEventListener("submit", (e) => {
    let isFormValid = true;
    inputs.forEach((input) => {
      if (!validateInput(input)) isFormValid = false;
    });

    if (!isFormValid) {
      e.preventDefault();
      return;
    }

    localStorage.setItem("userFormData", JSON.stringify(liveData));
    e.preventDefault();
    window.open("thanks.html", "_blank");
  });
}

// Load and display user data on thanks.html
const storedData = localStorage.getItem("userFormData");
const userData = storedData
  ? JSON.parse(storedData)
  : {
      fullName: "Jane Appleseed",
      cardNum: "0000 0000 0000 0000",
      month: "00",
      year: "00",
      cvc: "000",
    };

if (document.querySelector(".main-thanks")) {
  window.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.querySelector(".header-wrapper");
    wrapper.querySelector(".card-number").textContent = userData.cardNum;
    wrapper.querySelector(".holder-name").textContent = userData.fullName;
    wrapper.querySelector(".exp-month").textContent = userData.month;
    wrapper.querySelector(".exp-year").textContent = userData.year;
    wrapper.querySelector(".CVC").textContent = userData.cvc;
  });

  document.querySelector(".continue-button").addEventListener("click", () => {
    window.open(
      "https://www.stewardbank.co.zw/for-you/cards/visa-globetrotter/",
      "_blank"
    );
  });
}
