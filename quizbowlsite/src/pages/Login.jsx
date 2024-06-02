import { useCookies } from "react-cookie";

export function Login() {
  // Cookies access
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  // Whether the login is loading. This is used to determine if the "it's been a while" dialog should show.
  var loading = false;

  // If the user presses enter, treat it as if they clicked the login button.
  var handleEnterKey = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  }

  // Handle the login process.
  async function handleLogin() {
    document.getElementById("login-button").setAttribute("disabled", "true");
    document.getElementById("username").setAttribute("disabled", "true");
    document.getElementById("password").setAttribute("disabled", "true");
    loading = true;
    document.getElementById("login-loading").style.display = "flex";
    setTimeout(() => {
      // Show the "it's been awhile" dialog if the login is still loading after 4 seconds.
      if (loading) {
        document.getElementById("login-extra-dialog").style.display = "block";
      } 
    }, 4000);
    try {
      // The actual login happens here.
      var username = document.getElementById("username").value;
      var password = document.getElementById("password").value;
      var params = "?username=" + username + "&password=" + password;
      console.log("Attempting to log in with username: ", username);
      const response = await fetch(
        "https://qzblapi.azurewebsites.net/api/ValidAccount" +
          params
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const data = await response.json();
      if (data.uid > 0) { // Successfully found account.
        // Setting an auth cookie.
        setCookie('auth', {
          uid: data.uid,
          username: data.username,
          admin: data.admin
        });
        loading = false;
        console.log("Logged in as", data.username);
        window.location.href = "/"; // Returns the user to the homepage on successful login.
      } else {
        removeCookie('auth');
        loading = false;
        document.getElementById("login-loading").style.display = "none";
        window.alert("Invalid username or password. Please try again.");
        document.getElementById("login-button").removeAttribute("disabled");
        document.getElementById("username").removeAttribute("disabled");
        document.getElementById("password").removeAttribute("disabled");
        document.getElementById("password").value = "";
      }
    } catch (error) {
      console.error("Error fetching account details:", error);
      loading = false;
      document.getElementById("login-button").removeAttribute("disabled");
      document.getElementById("username").removeAttribute("disabled");
      document.getElementById("password").removeAttribute("disabled");
      document.getElementById("login-loading").style.display = "none";
    }
  }

  return (
    <>
      <div className="dialog">
        <label>
          <input type="text" id="username" placeholder="Username" onKeyDown={handleEnterKey}/>
        </label>
        <br />
        <label>
          <input type="password" id="password" placeholder="Password" onKeyDown={handleEnterKey}/>
        </label>
        <br />
        <button id="login-button" className="mainbutton" onClick={() => { handleLogin() }}>Login</button>
        <img src="loading.gif" className="loading-symbol" id="login-loading"/>
        <div className="dialog-div" id="login-extra-dialog">
          <h4>Looks like this is taking awhile.</h4>
          <p>The website is most likely still coming online. Please do not refresh the page unless you receive an error.</p>
        </div>
      </div>
    </>
  );
}
