/*
 * Responsible for Account creation and if the user wants to return to login page
 * Employs Signup.php to save user information to db or return error if invalid info processed
 */
document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("signupForm").addEventListener("submit", async (e) => {
		e.preventDefault();

	  	const data = {
			FirstName: document.getElementById("firstName").value,
		      	LastName: document.getElementById("lastName").value,
		     	Login: document.getElementById("username").value,
		      	Password: document.getElementById("password").value
		};

	  	try {
			const response = await fetch("../LAMPAPI/Signup.php", {
				method: "POST",
			        headers: { "Content-Type": "application/json" },
			        body: JSON.stringify(data)
			});

		      	const result = await response.json();
		      	if (result.error) document.getElementById("message").textContent = result.error;
			else {
				sessionStorage.setItem("signupSuccess", "true");
				window.location.href = "/";
			}
		}
		catch (err) {
			document.getElementById("msg").textContent = "ERROR FROM JS";
		}
	});

	document.getElementById("goBack").addEventListener("click", () => { 
		window.location.href = "/";
	});
});
