document.addEventListener("DOMContentLoaded", () => {
	profilePage();
	grabAllContacts();

	const createButton = document.getElementById("addContact");
	const searchBar = document.getElementById("searchBar");
	const contacts = document.getElementById("listContacts");
	const updateButton = document.getElementById("edit");

	createButton.addEventListener("click", () => {
		if(createButton.textContent === "Add Contact") {
			addNewContact(createButton);
		}
		else {
			saveContact(createButton);
		}
	});

	searchBar.addEventListener("input", () => {
		const query = searchBar.value.trim();
		if(query === "") {
			grabAllContacts();
		}
		else {
			searchContacts(query);
		}
	});

	contacts.addEventListener("click", (tmp) => {
		if(tmp.target.closest(".contactItem")) {
			const name = tmp.target.textContent;
			
			const userId = sessionStorage.getItem("userId");
			const contactId = tmp.target.dataset.id;
			contactPage(userId, contactId, updateButton);
			console.log("Clicked:", tmp.target, "userId:", userId);
		}
	});

	/*updateButton.addEventListener("click", () => {
		console.log("Edit pressed");
	});*/
});

function profilePage() {
	const firstName = sessionStorage.getItem("firstName");
	const lastName = sessionStorage.getItem("lastName");

	const main = document.getElementById("main");
	main.innerHTML = `<div class="inline">
				<h1>Profile</h1>
				<button type="button" class="buttons" id="edit">Edit Profile</button>
				<button type="button" class="buttons" id="logout">Log Out</button>
			</div>
			<h2>${firstName} ${lastName}</h2>`;
}

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
		list.innerHTML = "";
		if(result.error) {
			console.log(result);
			list.innerHTML = `<p>${result.error}</p>`;
		}
		else {
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

				list.append(letterHeader);
				list.append(ul);
			}
		}
	}
	catch(err) {
		document.getElementById("listContacts").textContent = "Error";
		console.log(err);
	}
}

function addNewContact(button) {
	const newTitle = document.createElement("h1");
	newTitle.id = "title";
	newTitle.textContent = "Add Contact";

	const newForm = document.createElement("form");
	newForm.id = "contactInfo";
	
	const inputFirstName = document.createElement("input");
	inputFirstName.type = "text";
	inputFirstName.name = "firstName";
	inputFirstName.id = "firstName";
	inputFirstName.placeholder = "First Name";
	inputFirstName.required = "true";

	const inputLastName = document.createElement("input");
	inputLastName.type = "text";
	inputLastName.name = "lastName";
	inputLastName.id = "lastName";
	inputLastName.placeholder = "Last Name";
	inputLastName.required = "true";

	const inputPhoneNumber = document.createElement("input");
	inputPhoneNumber.type = "text";
	inputPhoneNumber.name = "phoneNumber";
	inputPhoneNumber.id = "phoneNumber";
	inputPhoneNumber.placeholder = "Phone Number";
	inputPhoneNumber.required = "true";

	const inputEmail = document.createElement("input");
	inputEmail.type = "text";
	inputEmail.name = "email";
	inputEmail.id = "email";
	inputEmail.placeholder = "Email";
	inputEmail.required = "true";

	/*const inputUser = document.createElement("input");
	inputUser.type = "text";
	inputUser.name = "user";
	inputUser.id = "user";
	inputUser.placeholder = "Username";
	inputUser.required = "true";*/

	newForm.append(inputFirstName, inputLastName, inputPhoneNumber, inputEmail/*, inputUser*/);

	button.textContent = "Save Contact";

	
document.addEventListener("DOMContentLoaded", () => {
	profilePage();
	grabAllContacts();

	const createButton = document.getElementById("addContact");
	const searchBar = document.getElementById("searchBar");
	const contacts = document.getElementById("listContacts");
	const updateButton = document.getElementById("edit");

	createButton.addEventListener("click", () => {
		if(createButton.textContent === "Add Contact") {
			addNewContact(createButton);
		}
		else {
			saveContact(createButton);
		}
	});

	searchBar.addEventListener("input", () => {
		const query = searchBar.value.trim();
		if(query === "") {
			grabAllContacts();
		}
		else {
			searchContacts(query);
		}
	});

	contacts.addEventListener("click", (tmp) => {
		if(tmp.target.closest(".contactItem")) {
			const name = tmp.target.textContent;
			
			const userId = sessionStorage.getItem("userId");
			const contactId = tmp.target.dataset.id;
			contactPage(userId, contactId, updateButton);
			console.log("Clicked:", tmp.target, "userId:", userId);
		}
	});

	/*updateButton.addEventListener("click", () => {
		console.log("Edit pressed");
	});*/
});

function profilePage() {
	const firstName = sessionStorage.getItem("firstName");
	const lastName = sessionStorage.getItem("lastName");

	const main = document.getElementById("main");
	main.innerHTML = `<div class="inline">
				<h1>Profile</h1>
				<button type="button" class="buttons" id="edit">Edit Profile</button>
				<button type="button" class="buttons" id="logout">Log Out</button>
			</div>
			<h2>${firstName} ${lastName}</h2>`;
}

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
		list.innerHTML = "";
		if(result.error) {
			console.log(result);
			list.innerHTML = `<p>${result.error}</p>`;
		}
		else {
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

				list.append(letterHeader);
				list.append(ul);
			}
		}
	}
	catch(err) {
		document.getElementById("listContacts").textContent = "Error";
		console.log(err);
	}
}

function addNewContact(button) {
	const newTitle = document.createElement("h1");
	newTitle.id = "title";
	newTitle.textContent = "Add Contact";

	const newForm = document.createElement("form");
	newForm.id = "contactInfo";
	
	const inputFirstName = document.createElement("input");
	inputFirstName.type = "text";
	inputFirstName.name = "firstName";
	inputFirstName.id = "firstName";
	inputFirstName.placeholder = "First Name";
	inputFirstName.required = "true";

	const inputLastName = document.createElement("input");
	inputLastName.type = "text";
	inputLastName.name = "lastName";
	inputLastName.id = "lastName";
	inputLastName.placeholder = "Last Name";
	inputLastName.required = "true";

	const inputPhoneNumber = document.createElement("input");
	inputPhoneNumber.type = "text";
	inputPhoneNumber.name = "phoneNumber";
	inputPhoneNumber.id = "phoneNumber";
	inputPhoneNumber.placeholder = "Phone Number";
	inputPhoneNumber.required = "true";

	const inputEmail = document.createElement("input");
	inputEmail.type = "text";
	inputEmail.name = "email";
	inputEmail.id = "email";
	inputEmail.placeholder = "Email";
	inputEmail.required = "true";

	/*const inputUser = document.createElement("input");
	inputUser.type = "text";
	inputUser.name = "user";
	inputUser.id = "user";
	inputUser.placeholder = "Username";
	inputUser.required = "true";*/

	newForm.append(inputFirstName, inputLastName, inputPhoneNumber, inputEmail/*, inputUser*/);

	button.textContent = "Save Contact";

	const main = document.getElementById("main");
	main.innerHTML = "";
	main.append(newTitle, newForm, button);
}

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
			const main = document.getElementById("main");
			main.innerHTML = "";
			main.append(`<p>Error: ${result.erro}</p>`);
		}
		else {
			window.location.reload();
		}
	}
	catch(err) {
		console.log(err);
	}
}

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
		list.innerHTML = "";

		if(result.error || result.results.length === 0) {
			list.innerHTML = "<p>No matches found</p>";
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

		for(const letter in group) {
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

			list.append(letterHeader);
			list.append(ul);
		}
	}
	catch(err) {
		console.log(err);
	}
}

async function contactPage(userId, contactId, button) {
	const data = {
		UserID: userId,
		Search: contactId
	};

	try {
		const response = await fetch("../LAMPAPI/SearchContact.php", {
			method: "POST",
			headers: { "Content-Type": "application/json"},
			body: JSON.stringify(data)
		});

		const result = await response.json();
		if(result.error) {
			console.log(result);
		}
		else {
			const contact = result.results[0];

			const main = document.getElementById("main");
			main.innerHTML = `<div class="inline">
						<h1>${contact.FirstName} ${contact.LastName}</h1>
						<button type=button class="buttons" id="deleteContact">Delete Contact</button>
					</div>
					<h3>Phone Number: ${contact.Phone}</h3>
					<h3>Email: ${contact.Email}</h3>`;
			const inlineDiv = main.querySelector(".inline");
			button.textContent = "Edit Contact";
			inlineDiv.append(button);

			const deleteButton = document.getElementById("deleteContact");
			deleteButton.addEventListener("click", () => {
				console.log("delete pressed");
				deleteContact(contactId);
			});

			button.addEventListener("click", () => {
				console.log("edit in cPage pressed");
				updateContact(userId, contact, button);
			});
		}
	}
	catch(err) {
		console.log(err);
	}
}

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
		if(result.error) {
			console.log(result);
		}
		else {
			console.log(result);
			window.location.reload();
		}
	}
	catch(err) {
		console.log(err);
	}
}

async function updateContact(userId, contact, button) {
	const main = document.getElementById("main");

	main.innerHTML = `<div class="inline">
				<input type="text" id="firstName" value="${contact.FirstName}">
				<input type="text" id="lastName" value="${contact.LastName}">
				<button type="button" class="buttons" id="save">Save</button>
				<button type="button" class="buttons" id="cancel">Cancel</button>
			</div>
			<input type="text" id="phone" value="${contact.Phone}">
			<input type="text" id="email" value="${contact.Email}">`;

	const saveButton = document.getElementById("save");
	const cancelButton = document.getElementById("cancel");

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
		
		if(result.error) {
			console.log(result);
		}
		else {
			console.log(result);
			grabAllContacts();
			contactPage(userId, contact.ID, button);
		}
	});

	cancelButton.addEventListener("click", () => {
		console.log("cancel pressed");
		contactPage(userId, contact.ID, button);
	});

}

	const main = document.getElementById("main");
	main.innerHTML = "";
	main.append(newTitle, newForm, button);
}

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
			const main = document.getElementById("main");
			main.innerHTML = "";
			main.append(`<p>Error: ${result.erro}</p>`);
		}
		else {
			window.location.reload();
		}
	}
	catch(err) {
		console.log(err);
	}
}

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
		list.innerHTML = "";

		if(result.error || result.results.length === 0) {
			list.innerHTML = "<p>No matches found</p>";
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

		for(const letter in group) {
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

			list.append(letterHeader);
			list.append(ul);
		}
	}
	catch(err) {
		console.log(err);
	}
}

async function contactPage(userId, contactId, button) {
	const data = {
		UserID: userId,
		Search: contactId
	};

	try {
		const response = await fetch("../LAMPAPI/SearchContact.php", {
			method: "POST",
			headers: { "Content-Type": "application/json"},
			body: JSON.stringify(data)
		});

		const result = await response.json();
		if(result.error) {
			console.log(result);
		}
		else {
			const contact = result.results[0];

			const main = document.getElementById("main");
			main.innerHTML = `<div class="inline">
						<h1>${contact.FirstName} ${contact.LastName}</h1>
						<button type=button class="buttons" id="deleteContact">Delete Contact</button>
					</div>
					<h3>Phone Number: ${contact.Phone}</h3>
					<h3>Email: ${contact.Email}</h3>`;
			const inlineDiv = main.querySelector(".inline");
			button.textContent = "Edit Contact";
			inlineDiv.append(button);

			const deleteButton = document.getElementById("deleteContact");
			deleteButton.addEventListener("click", () => {
				console.log("delete pressed");
				deleteContact(contactId);
			});

			button.addEventListener("click", () => {
				console.log("edit in cPage pressed");
				updateContact(userId, contact, button);
			});
		}
	}
	catch(err) {
		console.log(err);
	}
}

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
		if(result.error) {
			console.log(result);
		}
		else {
			console.log(result);
			window.location.reload();
		}
	}
	catch(err) {
		console.log(err);
	}
}

async function updateContact(userId, contact, button) {
	const main = document.getElementById("main");

	main.innerHTML = `<div class="inline">
				<input type="text" id="firstName" value="${contact.FirstName}">
				<input type="text" id="lastName" value="${contact.LastName}">
				<button type="button" class="buttons" id="save">Save</button>
				<button type="button" class="buttons" id="cancel">Cancel</button>
			</div>
			<input type="text" id="phone" value="${contact.Phone}">
			<input type="text" id="email" value="${contact.Email}">`;

	const saveButton = document.getElementById("save");
	const cancelButton = document.getElementById("cancel");

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
		
		if(result.error) {
			console.log(result);
		}
		else {
			console.log(result);
			grabAllContacts();
			contactPage(userId, contact.ID, button);
		}
	});

	cancelButton.addEventListener("click", () => {
		console.log("cancel pressed");
		contactPage(userId, contact.ID, button);
	});

}
