const urlBase = 'http://circlefriends.online/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

document.addEventListener("DOMContentLoaded", () => { // Responsible for listening to all button presses
	if(sessionStorage.getItem("signupSuccess") === "true") {
		document.getElementById("msg").textContent = "Account Created!";
		sessionStorage.removeItem("signupSuccess");
	}

	const login = document.getElementById("loginButton")
	login.addEventListener("click", doLogin);

	document.getElementById("loginPassword").addEventListener("keyup", (e) => {
		if(e.key === "Enter") login.click();
	});

	document.getElementById("signupButton").addEventListener("click", () => {
		window.location.href = "signup.html";
	});
});

/*
 * On 'Sign In' button press doLogin() triggers
 * Does not accept or return any variables
 * Employs Login.php to check user credentials against user db
 * Also creates and sets sessionStorage for userId, firstName, and lastName so contacts.js can use them later
 */
function doLogin() {
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 ) {		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				sessionStorage.setItem("userId", userId);
				sessionStorage.setItem("firstName", firstName);
				sessionStorage.setItem("lastName", lastName);
	
				window.location.href = "profile.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}

}
