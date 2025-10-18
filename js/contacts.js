/*
 * Responsible for loading user information as well as their contacts
 * Also responsible for handling user interaction with contacts, search bar, logout, and adding contacts
 */
document.addEventListener("DOMContentLoaded", () => {
	profilePage();
	grabAllContacts();

	const searchBar = document.getElementById("searchBar");
	const contacts = document.getElementById("listContacts");
	const createButton = document.getElementById("addContact");

	document.body.addEventListener("click", (e) => {
		if(e.target.id === "logout") doLogout();
		if(e.target.id === "addContact") {
			if(e.target.textContent === "Add Contact") addNewContact(e.target);
			else saveContact();
		}
		console.log("Clicked:", e.target);
	});

	searchBar.addEventListener("input", () => {
		const query = searchBar.value.trim();

		if(query === "") grabAllContacts();
		else searchContacts(query);
	});

	contacts.addEventListener("click", (e) => {
		if(e.target.closest(".contactItem")) {
			const name = e.target.textContent;
			const userId = sessionStorage.getItem("userId");
			const contactId = e.target.dataset.id;

			contactPage(userId, contactId, createButton);
			console.log("Clicked:", e.target, "userId:", userId);
		}
	});
});

/*
 * Responsible for loading the users information on main and tracking the myProfile session storage
 * Accepts no input and provides no output
 */
function profilePage() {
	const firstName = sessionStorage.getItem("firstName");
	const lastName = sessionStorage.getItem("lastName");
	sessionStorage.setItem("myProfile", false); // Tracks whether My Profile button should appear or not

	const main = document.getElementById("main");
	main.innerHTML = `<div class="inline">
				<h1>Profile</h1>
				<button type="button" class="buttons" id="logout">Log Out</button>
			</div>
			<h2>${firstName} ${lastName}</h2>`;
}

/*
 * Responsible for retrieving all users contacts to display on sidebar
 * Accepts no input and provides no output
 * Employs SearchContact.php to retrieve information
 */
async function grabAllContacts() {
	const userId = sessionStorage.getItem("userId");

	const data = {
		UserID: userId,
		Search: ""
	};

	try {
		const response = await fetch("../LAMPAPI/SearchContact.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		});

		const result = await response.json();
		const list = document.getElementById("listContacts");
		if(sessionStorage.getItem("myProfile") === "true") var myProfile = document.getElementById("myProfile");
		list.innerHTML = "";
		if(result.error) {
			console.log(result);
			list.innerHTML = `<p>${result.error}</p>`;
		}
		else {
			if(myProfile) list.prepend(myProfile);
			const sorted = result.results.sort((a, b) =>
				a.FirstName.localeCompare(b.FirstName)
			);

			const group = {};
			sorted.forEach(contact => {
				const letter = contact.FirstName[0].toUpperCase();
				if(!group[letter]) group[letter] = [];
				group[letter].push(contact);
			});

			for(const letter in group) {
				const wrapper = document.createElement("li");

				const letterHeader = document.createElement("h3");
				letterHeader.textContent = letter;
				letterHeader.classList.add("letterHeader");

				const ul = document.createElement("ul");
				ul.classList.add("contactGroup");

				group[letter].forEach(contact => {
					const li = document.createElement("li");
					li.textContent = `${contact.FirstName} ${contact.LastName}`;
					li.classList.add("contactItem");
					li.dataset.id = contact.ID;
					ul.append(li);
				});

				wrapper.append(letterHeader, ul);
				list.append(wrapper);
			}
		}
	}
	catch(err) {
		document.getElementById("listContacts").textContent = "Error";
		console.log(err);
	}
}

/*
 * Responsible for reformatting main and sidebar to display add contact page
 * Accepts the addContact button as input so it can edit it to Save Contact
 * Also moves the button onto main
 */
function addNewContact(button) {
	const newTitle = document.createElement("h1");
	newTitle.id = "title";
	newTitle.textContent = "Add Contact";

	const newForm = document.createElement("form");
	newForm.id = "newForm";
	
	const inputFirstName = document.createElement("input");
	inputFirstName.type = "text";
	inputFirstName.name = "firstName";
	inputFirstName.classList.add("inputs");
	inputFirstName.id = "firstName";
	inputFirstName.placeholder = "First Name";
	inputFirstName.required = true;

	const inputLastName = document.createElement("input");
	inputLastName.type = "text";
	inputLastName.name = "lastName";
	inputLastName.classList.add("inputs");
	inputLastName.id = "lastName";
	inputLastName.placeholder = "Last Name";
	inputLastName.required = true;

	const inputPhoneNumber = document.createElement("input");
	inputPhoneNumber.type = "text";
	inputPhoneNumber.name = "phoneNumber";
	inputPhoneNumber.classList.add("inputs");
	inputPhoneNumber.id = "phoneNumber";
	inputPhoneNumber.placeholder = "Phone Number";
	inputPhoneNumber.required = true;

	const inputEmail = document.createElement("input");
	inputEmail.type = "text";
	inputEmail.name = "email";
	inputEmail.classList.add("inputs");
	inputEmail.id = "email";
	inputEmail.placeholder = "Email";
	inputEmail.required = true;

	newForm.append(inputFirstName, inputLastName, inputPhoneNumber, inputEmail);

	button.textContent = "Save Contact";
	const cancelButton = document.createElement('button');
	cancelButton.textContent = "cancel";
	cancelButton.classList.add("buttons");
	cancelButton.addEventListener("click", () => {
		window.location.reload();
	});

	const main = document.getElementById("main");
	main.innerHTML = "";
	main.append(newTitle, newForm, button, cancelButton);

	console.log(main);
	console.log(button);
	console.log(cancelButton);
}

/*
 * Responsible for saving contact information after save contact button is pressed
 * Accepts no input and provides no output
 * Employs the AddContact.php to save input information to contacts db or display an error to user
 */
async function saveContact() {
	const data = {
		FirstName: document.getElementById("firstName").value,
		LastName: document.getElementById("lastName").value,
		Phone: document.getElementById("phoneNumber").value,
		Email: document.getElementById("email").value,
		UserID: sessionStorage.getItem("userId")
	};

	try {
		const response = await fetch("../LAMPAPI/AddContact.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		});

		const result = await response.json();
		if(result.error) {
			const oldErr = document.getElementById("errMsg");
			if(oldErr) oldErr.remove();

			const errMsg = document.createElement("p");
			errMsg.textContent = `Error: ${result.error}`;
			errMsg.id = "errMsg";

			const main = document.getElementById("main");
			main.append(errMsg);
		}
		else {
			window.location.reload();
		}
	}
	catch(err) {
		console.log(err);
	}
}

/*
 * Responsible for displaying up to 10 contacts related to search query
 * Accepts a query string that is input into the search bar and returns nothing
 * Employs the SearchContact.php and follows similar methods to grabAllContacts() in order to display contacts
 */
async function searchContacts(query) {
	const userId = sessionStorage.getItem("userId");
	const data = {
		UserID: userId,
		Search: query
	};

	try {
		const response = await fetch("../LAMPAPI/SearchContact.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		});

		const result = await response.json();
		const list = document.getElementById("listContacts");

		if(sessionStorage.getItem("myProfile") === "true") var myProfile = document.getElementById("myProfile");

		list.innerHTML = "";

		if(result.error || result.results.length === 0) {
			list.innerHTML = "<p>No matches found</p>";
			if(myProfile) list.prepend(myProfile);
			return;
		}

		const limitResults = result.results.slice(0, 10);
		const sorted = limitResults.sort((a, b) =>
			a.FirstName.localeCompare(b.FirstName)
		);

		const group = {};
		sorted.forEach(contact => {
			const letter = contact.FirstName[0].toUpperCase();
			if(!group[letter]) group[letter] = [];
			group[letter].push(contact);
		});

		if(myProfile) list.prepend(myProfile);

		for(const letter in group) {
			const wrapper = document.createElement("li");

			const letterHeader = document.createElement("h3");
			letterHeader.textContent = letter;
			letterHeader.classList.add("letterHeader");

			const ul = document.createElement("ul");
			ul.classList.add("contactGroup");

			group[letter].forEach(contact => {
				const li = document.createElement("li");
				li.textContent = `${contact.FirstName} ${contact.LastName}`;
				li.classList.add("contactItem");
				li.dataset.id = contact.ID;
				ul.append(li);
			});

			wrapper.append(letterHeader, ul);
			list.append(wrapper);
		}
	}
	catch(err) {
		console.log(err);
	}
}

/*
 * Responsible for reformatting main to display a contacts information after theyve been clicked on
 * Employs SearchContact.php to get contact information
 * Responsible for creating and listening to delete as well as edit contacts events
 * Accepts userId, the contactsId, and the addContact button as input. Returns no output
 */
async function contactPage(userId, contactId, createButton) {
	const span = document.getElementById("sideSpan");
	if(!createButton.parentNode !== span.parentNode) span.insertAdjacentElement('afterend', createButton);
	createButton.textContent = "Add Contact";

	const data = {
		UserID: userId,
		ID: contactId
	};

	try {
		const response = await fetch("../LAMPAPI/SearchContact.php", {
			method: "POST",
			headers: { "Content-Type": "application/json"},
			body: JSON.stringify(data)
		});

		const result = await response.json();
		if(result.error) console.log(result);
		else {
			if(sessionStorage.getItem("myProfile") === "false") {
				sessionStorage.setItem("myProfile", true);
				const listContacts = document.getElementById("listContacts");
				const myProfile = document.createElement("li");

				myProfile.textContent = "My Profile";
				myProfile.classList.add("contactItem");
				myProfile.id = "myProfile";

				myProfile.addEventListener("click", (e) => {
					e.stopPropagation();
					profilePage();
					grabAllContacts();
					span.insertAdjacentElement('afterend', createButton);
					createButton.textContent = "Add Contact";
				});

				listContacts.prepend(myProfile);
			}

			const contact = result.results[0];

			const main = document.getElementById("main");
			main.innerHTML = `<div class="inline">
						<h1>${contact.FirstName} ${contact.LastName}</h1>
						<button type=button class="buttons" id="deleteContact">Delete Contact</button>
						<button type=button class="buttons" id="updateContact">Edit Contact</button>
					</div>
					<div id="delModal" class="modal">
						<div class="modalContent">
							<p>Are you sure you want to delete this contact?</p>
							<div>
								<button type=button class="buttons" id="confirmDel">Confirm</button>
								<button type=button class="buttons" id="cancelDel">Cancel</button>
							</div>
						</div>
					</div>
					<h3>Phone Number: ${displayPhone(contact.Phone)}</h3>
					<h3>Email: ${contact.Email}</h3>`;

			const deleteButton = document.getElementById("deleteContact");
			deleteButton.addEventListener("click", () => {
				const modal = document.getElementById("delModal");
				modal.style.display = "flex";

				const confirmDel = document.getElementById("confirmDel");
				const cancelDel = document.getElementById("cancelDel");
				
				confirmDel.addEventListener("click", () => {
					modal.style.display = "none";
					deleteContact(contactId);
				});

				cancelDel.addEventListener("click", () => {
					modal.style.display = "none";
				});
			});

			const updateButton = document.getElementById("updateContact");
			updateButton.addEventListener("click", () => {
				console.log("edit in cPage pressed");
				updateContact(userId, contact);
			});
		}
	}
	catch(err) {
		console.log(err);
	}
}

/*
 * Phone numbers in db are stored as only digits
 * Responsible for reformatting returned phonenumbers from the db into more readable phonenumbers
 * Accepts the unformatted raw phonenumber and returns the reformatted phonenumber
 */
function displayPhone(phone) {
	const area = phone.slice(0, 3);
	const prefix = phone.slice(3, 6);
	const line = phone.slice(6);
	return `(${area})${prefix}-${line}`;
}

/*
 * Responsible for removing contact from contacts db
 * Employs DeleteContact.php in order to remove from db
 * Accepts contactId as input and returns no output
 */
async function deleteContact(contactId) {
	const data = { ID: contactId };
	console.log(`Contact Id is: ${contactId}`);

	try {
		const response = await fetch("../LAMPAPI/DeleteContact.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		});

		const result = await response.json();
		if(result.error) console.log(result);
		else {
			console.log(result);
			window.location.reload();
		}
	}
	catch(err) {
		console.log(err);
	}
}

/*
 * Responsible for editing/updating contact information as well as displaying any related errors to user
 * Employs the UpdateContact.php to do this
 * Accepts userId and contact object (stores all contact information) as input. Returns no output
 */
async function updateContact(userId, contact) {
	const main = document.getElementById("main");

	main.innerHTML = `<div class="inline">
				<input type="text" class="inputs" id="firstName" value="${contact.FirstName}">
				<input type="text" class="inputs" id="lastName" value="${contact.LastName}">
				<button type="button" class="buttons" id="save">Save</button>
				<button type="button" class="buttons" id="cancel">Cancel</button>
			</div>
			<input type="text" class="inputs" id="phone" value="${contact.Phone}">
			<input type="text" class="inputs" id="email" value="${contact.Email}">`;

	const saveButton = document.getElementById("save");
	const cancelButton = document.getElementById("cancel");
	const createButton = document.getElementById("addContact");

	saveButton.addEventListener("click", async () => {
		const data = {
			ID: contact.ID,
			FirstName: document.getElementById("firstName").value,
			LastName: document.getElementById("lastName").value,
			Phone: document.getElementById("phone").value,
			Email: document.getElementById("email").value
		};

		console.log(`Contact info: ${contact.FirstName} ${contact.LastName} ${contact.Phone} ${contact.Email}`);

		const response = await fetch("../LAMPAPI/UpdateContact.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		});

		const result = await response.json();
		
		if(result.error) console.log(result);
		else {
			console.log(result);
			grabAllContacts();
			contactPage(userId, contact.ID, createButton);
		}
	});

	cancelButton.addEventListener("click", () => {
		console.log("cancel pressed");
		contactPage(userId, contact.ID, createButton);
	});

}

/*
 * Responsible for clearing session storage and returning user to home page
 * Accepts no input, and returns no output
 */
function doLogout() {
	sessionStorage.clear();
	window.location.href = "/";
}
