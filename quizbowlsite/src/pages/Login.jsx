import { useCookies } from "react-cookie";

export function Login() {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  var loggedIn = false;

  var handleEnterKey = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  }

  async function handleLogin() {
    document.getElementById("login-button").setAttribute("disabled", "true");
    document.getElementById("login-loading").style.display = "flex";
    setTimeout(() => {
      if (loggedIn === false) {
        document.getElementById("login-extra-dialog").style.display = "block";
      } 
    }, 5000);
    try {
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
      if (data.uid > 0) {
        setCookie('auth', {
          uid: data.uid,
          username: data.username
        });
        loggedIn = true;
        console.log("Logged in as", data.username);
        window.alert("You were successfully logged in as " + data.username + "! Once you click OK, the page will refresh and return you to the main question screen.");
        window.location.href = "/";
      } else {
        removeCookie('auth');
        window.alert("Invalid username or password. Please try again.");
        document.getElementById("login-button").removeAttribute("disabled");
        document.getElementById("login-loading").style.display = "none";
      }
    } catch (error) {
      console.error("Error fetching account details:", error);
      document.getElementById("login-button").removeAttribute("disabled");
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
        <button id="login-button" onClick={() => { handleLogin() }}>Login</button>
        <img src="loading.gif" className="loading-symbol" id="login-loading"/>
        <div className="dialog-div" id="login-extra-dialog">
          <h4>Looks like this is taking awhile.</h4>
          <p>If this is the first time that you've used the website in the last 2 hrs or so, the website is likely still restarting. Please do not refresh the page unless you receive an error.</p>
        </div>
      </div>
    </>
  );
}
