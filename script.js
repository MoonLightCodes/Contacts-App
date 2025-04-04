const logInWindow = document.getElementById("main-container");
const registerWindow = document.getElementById("register-container");
const registerNow = document.getElementById("register-on-log");
const resMsg = document.querySelectorAll(".res-message");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const cardHolder = document.getElementById("contacts-holder");
const contactsContainer = document.getElementById("contacts-container");
const createContact = document.getElementById("create-contact");
const editContact = document.getElementById("edit-contact");
const addContact = document.getElementById("add-contact");
const back = document.querySelectorAll(".back");
const createForm = document.getElementById("create-contact-form");
const editForm = document.getElementById("edit-contact-form");

let activeEditContactInd;
let token;

let fetchedContacts = [];

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const res = await fetch("https://contacts-api-tqhi.onrender.com/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    resMsg[0].style.display = "block";
    resMsg[0].innerText = data.message;
    await new Promise((r) =>
      setTimeout(() => {
        resMsg[0].style.display = "none";
        if (data.message !== "Email Or Password are Invalid") registerOnLogin();
        r();
      }, 2100)
    );
  } else {
    token = data.accessToken;
    getContacts();
  }
});
function noneAll() {
  createContact.style.display = "none";
  editContact.style.display = "none";
  contactsContainer.style.display = "none";
  logInWindow.style.display = "none";
  registerWindow.style.display = "none";
}
async function getContacts() {
  noneAll();
  contactsContainer.style.display = "block";
  cardHolder.innerHTML = "";
  fetchedContacts = [];
  try {
    const contacts = await fetch("https://contacts-api-tqhi.onrender.com/contacts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const contactsData = await contacts.json();
    fetchedContacts = contactsData;
    if (contactsData.length === 0) {
      let resMessage = document.createElement("div");
      resMessage.classList.add("res-message");
      resMessage.innerText = "No Contacts Found!";
      cardHolder.appendChild(resMessage);
      return;
    }
    contactsData.forEach((d, i) => {
      cardHolder.innerHTML += `
      <div data-ind=${i} class="contact-card">
            <div  class="info">
              <h3>${d.name}</h3>
              <h4>Email: ${d.email}</h4>
              <h4>Phone: ${d.phone}</h4>
            </div>
            <div  class="options">
              <div class="options-delete"><i class="fa fa-trash"></i></div>
              <div class="options-edit"><i class="fas fa-pen"></i></div>
            </div>
        </div>`;
    });
  } catch (e) {
    fetchedContacts = [];
    let resMessage = document.createElement("div");
    resMessage.classList.add("res-message");
    resMessage.innerText = e;
    cardHolder.appendChild(resMessage);
    return;
  }
}

function logInOnRegister() {
  registerWindow.style.display = "none";
  logInWindow.style.display = "block";
}
function registerOnLogin() {
  logInWindow.style.display = "none";
  registerWindow.style.display = "block";
}

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("register-email").value;
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;

  try {
    const res = await fetch("https://contacts-api-tqhi.onrender.com/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, username }),
    });
    const data = await res.json();
    console.log(data);
    if (!res.ok) {
      resMsg[1].style.display = "block";
      resMsg[1].innerText = data.message;
      await new Promise((r) =>
        setTimeout(() => {
          resMsg[1].style.display = "none";
          if (data.message === "Email already exist") logInOnRegister();
          r();
        }, 2100)
      );
    } else {
      resMsg[1].style.display = "block";
      resMsg[1].innerText = "Registration successful! Redirecting...";
      await new Promise((r) =>
        setTimeout(() => {
          resMsg[1].style.display = "none";
          logInOnRegister();
          r();
        }, 2100)
      );
    }
  } catch (e) {
    resMsg[1].style.display = "block";
    resMsg[1].innerText = e.message;
    await new Promise((r) =>
      setTimeout(() => {
        resMsg[1].style.display = "none";
        r();
      }, 2100)
    );
  }
  registerForm.reset();
});
back[0].addEventListener("click", getContacts);
back[1].addEventListener("click", getContacts);
addContact.addEventListener("click", () => {
  noneAll();
  createContact.style.display = "block";
});
createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const email = document.getElementById("create-email").value;
    const phone = document.getElementById("create-phone").value;
    const name = document.getElementById("create-name").value;
    const res = await fetch("https://contacts-api-tqhi.onrender.com/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, phone, name }),
    });
    const resData = await res.json();
    if (!res.ok) {
      resMsg[2].style.display = "block";
      resMsg[2].innerText = resData.message;
      await new Promise((r) =>
        setTimeout(() => {
          resMsg[2].style.display = "none";
          r();
        }, 2100)
      );
    } else {
      resMsg[2].style.display = "block";
      resMsg[2].innerText = "created successfully";
      await new Promise((r) =>
        setTimeout(() => {
          resMsg[2].style.display = "none";
          r();
        }, 2100)
      );
    }
  } catch (e) {
    resMsg[2].style.display = "block";
    resMsg[2].innerText = e.message;
    await new Promise((r) =>
      setTimeout(() => {
        resMsg[2].style.display = "none";
        r();
      }, 2100)
    );
  }
  createForm.reset();
  getContacts();
});
cardHolder.addEventListener("click", async (e) => {
  console.log("click");
  if (e.target.classList.contains("fa-trash")) {
    const clickedCard = e.target.closest(".contact-card");
    const contactId = fetchedContacts[parseInt(clickedCard.dataset.ind)]._id;
    try {
      const res = await fetch(`https://contacts-api-tqhi.onrender.com/contacts/${contactId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const resData = await res.json();
      if (!res.ok) {
        resMsg[3].style.display = "block";
        resMsg[3].innerText = resData.message;
        await new Promise((r) =>
          setTimeout(() => {
            resMsg[3].style.display = "none";
            r();
          }, 2100)
        );
      } else {
        resMsg[3].style.display = "block";
        resMsg[3].innerText = resData.message;
        await new Promise((r) =>
          setTimeout(() => {
            resMsg[3].style.display = "none";
            r();
          }, 2100)
        );
      }
    } catch (e) {
      resMsg[3].style.display = "block";
      resMsg[3].innerText = e.message;
      await new Promise((r) =>
        setTimeout(() => {
          resMsg[3].style.display = "none";
          r();
        }, 2100)
      );
    }
    getContacts();
  } else if (e.target.classList.contains("fa-pen")) {
    const clickedCard = e.target.closest(".contact-card");
    noneAll();
    editContact.style.display = "block";
    activeEditContactInd = parseInt(clickedCard.dataset.ind);

    document.getElementById("edit-email").value =
      fetchedContacts[activeEditContactInd].email;
    document.getElementById("edit-phone").value =
      fetchedContacts[activeEditContactInd].phone;
    document.getElementById("edit-name").value =
      fetchedContacts[activeEditContactInd].name;
  }
});
editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const email = document.getElementById("edit-email").value;
    const phone = document.getElementById("edit-phone").value;
    const name = document.getElementById("edit-name").value;
    const res = await fetch(
      `https://contacts-api-tqhi.onrender.com/contacts/${fetchedContacts[activeEditContactInd]._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          phone,
          name,
        }),
      }
    );
    const resData = await res.json();
    if (!res.ok) {
      resMsg[3].style.display = "block";
      resMsg[3].innerText = resData.message;
      await new Promise((r) =>
        setTimeout(() => {
          resMsg[3].style.display = "none";
          r();
        }, 2100)
      );
    } else {
      resMsg[3].style.display = "block";
      resMsg[3].innerText = "Updated succesfully";
      await new Promise((r) =>
        setTimeout(() => {
          resMsg[3].style.display = "none";
          r();
        }, 2100)
      );
    }
  } catch (e) {
    resMsg[3].style.display = "block";
    resMsg[3].innerText = e.message;
    await new Promise((r) =>
      setTimeout(() => {
        resMsg[3].style.display = "none";
        r();
      }, 2100)
    );
  }
  editForm.reset();
  getContacts();
});
