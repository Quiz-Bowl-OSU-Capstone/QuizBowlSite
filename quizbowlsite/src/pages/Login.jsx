import { useCookies } from "react-cookie";

export function Login() {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  async function handleLogin() {
    document.getElementById("login-button").setAttribute("disabled", "true");
    try {
      console.log("Logging in...");
      var username = document.getElementById("username").value;
      var password = document.getElementById("password").value;
      var params = "?username=" + username + "&password=" + password;
      console.log(params);
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
        console.log("Logged in as", data.username);
        window.alert("Successfully logged in as " + data.username);
        window.location.href = "/";
      } else {
        removeCookie('auth');
        window.alert("Invalid username or password");
        document.getElementById("login-button").setAttribute("disabled", "false");
      }
    } catch (error) {
      console.error("Error fetching account details:", error);
      document.getElementById("login-button").setAttribute("disabled", "false");
    }
  }

  return (
    <>
      <div className="dialog">
        <label>
          Username:
          <input type="text" id="username" placeholder="Enter Username/Email" />
        </label>
        <br />
        <label>
          Password:
          <input type="text" id="password" placeholder="Enter Password" />
        </label>
        <br />
        <button id="login-button" onClick={handleLogin}>Login</button>
      </div>
    </>
  );
}
