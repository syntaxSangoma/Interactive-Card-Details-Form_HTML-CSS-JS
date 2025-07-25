const form = document.querySelector("#cardDetailsForm");
const liveData = {};

if (form) {
  const inputs = form.querySelectorAll("input");
  const submitButton = form.querySelector(".submit-button");

  inputs.forEach((input) => {
    input.addEventListener("keypress", (e) => {
      if (input.name === "cardNum" && /\D/.test(e.key)) {
        e.preventDefault();
      }
    });

    input.addEventListener("input", (e) => {
      const { name } = e.target;

      if (name === "cardNum") {
        const rawValue = e.target.value.replace(/\D/g, "");
        const formatted = rawValue.replace(/(.{4})/g, "$1 ").trim();
        e.target.value = formatted;
        liveData[name] = formatted;
      } else {
        liveData[name] = e.target.value;
      }

      validateInput(input);
      updateSubmitButton();
    });

    input.addEventListener("paste", (e) => {
      const pasted = (e.clipboardData || window.clipboardData).getData("text");

      if (input.name === "cardNum" && /\D/.test(pasted)) {
        e.preventDefault();
        showMessage(input, "Numbers only.", true);
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

  function validateInput(input) {
    const wrapper =
      input.closest(".name-wrapper") ||
      input.closest(".card-num-wrapper") ||
      input.closest(".expiry-wrapper") ||
      input.closest(".cvc-wrapper");
    const message = wrapper.querySelector(".message");
    const value = input.value.trim();

    clearMessage(input, message);

    if (value === "") {
      return setError(input, message, "Can't be blank.");
    }

    let isValid = true;

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
    } else {
      if (input.getAttribute("inputmode") === "numeric") {
        input.value = value.replace(/\D/g, "");
        if (!/^\d+$/.test(input.value)) {
          isValid = setError(input, message, "Numbers only.");
        }
      }
    }

    if (isValid) {
      setSuccess(input, message, "Looks good!");
      liveData[input.name] = input.value;
    }

    return isValid;
  }

  function validateFullName(nameInput, message) {
    let val = nameInput.value
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    nameInput.value = val;
    liveData[nameInput.name] = val;

    const words = val.trim().split(/\s+/);
    if (words.length < 2 || !words.every((w) => /^[A-Za-z\-']+$/.test(w))) {
      return setError(nameInput, message, "Must contain first & last name.");
    }

    return true;
  }

  function validateCardNumber(cardInput, message) {
    const digits = cardInput.value.replace(/\D/g, "");
    if (digits.length !== 16) {
      return setError(
        cardInput,
        message,
        "Credit card number must be exactly 16 digits."
      );
    }

    const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
    cardInput.value = formatted;
    liveData[cardInput.name] = formatted;
    return true;
  }

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
    window.location.href = "thanks.html";
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
    window.location.href = "index.html";
  });
}

if (form) {
  window.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.querySelector(".header-wrapper");
    wrapper.querySelector(".card-number").textContent = userData.cardNum;
    wrapper.querySelector(".holder-name").textContent = userData.fullName;
    wrapper.querySelector(".exp-month").textContent = userData.month;
    wrapper.querySelector(".exp-year").textContent = userData.year;
    wrapper.querySelector(".CVC").textContent = userData.cvc;
  });
}
