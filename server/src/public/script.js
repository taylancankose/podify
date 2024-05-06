const getById = (id) => {
  return document.getElementById(id);
};

const password = getById("password");
const confirmPassword = getById("confirm-password");
const form = getById("form");
const container = getById("container");
const loader = getById("loader");
const button = getById("submit");
const error = getById("error");
const success = getById("success");

error.style.display = "none";
success.style.display = "none";
container.style.display = "none";

let token, userId;
const passRegx =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/;

window.addEventListener("DOMContentLoaded", async () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => {
      return searchParams.get(prop);
    },
  });
  token = params.token;
  userId = params.userId;

  const res = await fetch("/auth/verify-password-reset-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      token,
      userId,
    }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    loader.innerText = error;
    return;
  }

  loader.style.display = "none";
  container.style.display = "block";
});

// alttaki linki de açsana yine aynı sayfaya gidecek
// http://localhost:8080/reset-password?
// token=4f441015216e4bee7cf6d3babbafd66ea0e30151bdae48c86377c07cef9fffaf766e9a68&
// userId=64f8e58a6a31d20fe8ff155d

const displayError = (errorMessage) => {
  // remove if there is anny success message
  success.style.display = "none";
  error.innerText = errorMessage;
  error.style.display = "block";
};

const displaySuccess = (successMessage) => {
  // remove if there is anny error message
  error.style.display = "none";
  success.innerText = successMessage;
  success.style.display = "block";
};

const handleSubmit = async (e) => {
  e.preventDefault();
  // validate PWs
  // if no pw is entered
  if (!password.value.trim()) {
    // render error
    return displayError("Password is missing");
  }

  // if pws are not matches
  if (password.value !== confirmPassword.value) {
    // render error
    return displayError("Passwords do not match");
  }

  // if pw is not valid
  if (!passRegx.test(password.value)) {
    // render error
    return displayError("Password is too simple");
  }

  button.disabled = true;
  button.innerText = "Please wait...";

  //handle the submit
  const res = await fetch("/auth/update-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      token,
      userId,
      password: password.value,
    }),
  });

  button.disabled = false;
  button.innerText = "Reset Password";

  if (!res.ok) {
    const { error } = await res.json();
    return displayError(error);
  }
  displaySuccess("Your Password Reset Successfully");
  password.value = "";
  confirmPassword.value = "";
};

form.addEventListener("submit", handleSubmit);
