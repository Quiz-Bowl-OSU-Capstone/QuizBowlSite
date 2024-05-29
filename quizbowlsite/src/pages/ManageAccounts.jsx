import React, { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";

export function ManageAccounts() { 
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const [accounts, setAccounts] = React.useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [actionableAccount, setActionableAccount] = useState(null);
    const [action, setAction] = useState(null);

    var handleAccountClick = (username) => {
        if (selectedAccount == username) {
            setSelectedAccount(null);
        } else {
            setSelectedAccount(username);
        }
    }

    var handleEnterKey = (event) => {
        if (event.key === "Enter") {
            getAccounts(document.getElementById("password").value);
        }
    }

    var handleEnterKeyPopup = (event) => {
        if (event.key === "Enter") {
            handlePopupClose();
        }
    }

    var handleEnterKeyCreate = (event) => {
        if (event.key === "Enter") {
            handleCreateAccount(document.getElementById("password").value);
        }
    }

    async function getAccounts(pass) {
        try {
            document.getElementById("login-loading").style.display = "flex";
            document.getElementById("password").setAttribute("disabled", "true");
            document.getElementById("relogin").setAttribute("disabled", "true");
        } catch (e) {
            console.log("Caught an error trying to hide the loading symbol, this is probably okay to ignore.")
        }

        const response = await fetch("https://qzblapi.azurewebsites.net/api/ListAccounts?uid=" + cookies.auth.uid + "&currentpass=" + encodeURIComponent(pass));
        if (!response.ok) {
            alert("Failed to authenticate. Please try again.");
            throw new Error("Failed to authenticate");
        }
        var data = await response.json();
        if (data.Error) {
            alert("Failed to authenticate. Please try again.");

            try {
                document.getElementById("login-loading").style.display = "none";
                document.getElementById("password").removeAttribute("disabled");
                document.getElementById("relogin").removeAttribute("disabled");
            } catch (e) {
                console.log("Caught an error trying to hide the loading symbol, this is probably okay to ignore.")
            }

            return;
        }
        var accounts = data.accounts.sort();
        setAccounts(accounts);
    }

    async function handleCreateAccount(currentpass) {
        document.getElementById("newusername").setAttribute("disabled", "true");
        document.getElementById("newpassword").setAttribute("disabled", "true");
        document.getElementById("newadmin").setAttribute("disabled", "true");
        document.getElementById("password").setAttribute("disabled", "true");
        document.getElementById("button-create-account").setAttribute("disabled", "true");

        var newusername = document.getElementById("newusername").value;

        if (newusername == "") {
            alert("You need to enter a username to create an account.");
        } else if (currentpass == "") {
            alert("You need to enter your password to create an account.");
        } else {
            var params = "?uid=" + cookies.auth.uid + "&currentpass="  + encodeURIComponent(currentpass) + "&username=" + newusername;

            if (document.getElementById("newpassword").value != "") {
                params += "&password=" + document.getElementById("newpassword").value;
            }

            if (document.getElementById("newadmin").checked) {
                params += "&admin=true";
            }

            const response = await fetch("https://qzblapi.azurewebsites.net/api/AddAccount" + params);
            const data = await response.json();
            if (data.Error) {
                alert(data.Error);
            } else {
                alert("Created the new account successfully! The password to log into the new account is '" + data.password + "'. Please inform the user of this new password, and make sure to write this down or save it somewhere, as this information won't be shown again.");
                getAccounts(currentpass);
            }
        }

        document.getElementById("newusername").removeAttribute("disabled");
        document.getElementById("newpassword").removeAttribute("disabled");
        document.getElementById("newadmin").removeAttribute("disabled");
        document.getElementById("password").removeAttribute("disabled");
        document.getElementById("button-create-account").removeAttribute("disabled");
    }

    async function handlePasswordConfirm(username, action) {
        setAction(action);
        setActionableAccount(username);
    }

    function handlePopupClose() {
        document.getElementById("popup-password").setAttribute("disabled", "true");
        document.getElementById("button-reset-delete").setAttribute("disabled", "true");

        if (document.getElementById("popup-password").value == "") {
            alert("You need to enter your password to confirm this action.");
            document.getElementById("popup-password").removeAttribute("disabled");
            document.getElementById("button-reset-delete").removeAttribute("disabled");
        } else {
            if (action == "reset") {
                handleResetPassword(actionableAccount, document.getElementById("popup-password").value);
            } else {
                handleAccountDelete(actionableAccount, document.getElementById("popup-password").value);
            }
        }
    }

    async function handleResetPassword(username, pass) {
        var params = "?uid=" + cookies.auth.uid + "&currentpass=" + encodeURIComponent(pass) + "&acctusername=" + username;
        var newpass = prompt("Did you want to set a specific password for this account? If so, you can enter that here. Otherwise, leave this blank to generate a random password. Clicking 'Cancel' will cancel the password reset.")
        
        if (newpass != null) {
            if (newpass.length >= 8) {
                params += "&newpassword=" + newpass;
            } else if (newpass.length < 8 && newpass.length > 0) {
                alert("Password must be at least 8 characters long.");
                return;
            }

            const response = await fetch("https://qzblapi.azurewebsites.net/api/ChangePassword" + params);
            if (!response.ok) {
                alert("Failed to reset password for account.");
                throw new Error("Failed to fetch user details");
            }
            var data = await response.json();

            alert("Password reset successfully! The new password is '" + data.pass + "'. Please inform the user of this new password, and make sure to write this down or save it somewhere, as this information won't be shown again.");
            setActionableAccount(null);
            document.getElementById("popup-password").removeAttribute("disabled");
            document.getElementById("button-reset-delete").removeAttribute("disabled");
        } else {
            setActionableAccount(null);
            setAction(null);
            document.getElementById("popup-password").removeAttribute("disabled");
            document.getElementById("button-reset-delete").removeAttribute("disabled");
        }
    }

    async function handleAccountDelete(username, pass) {
        var params = "?uid=" + cookies.auth.uid + "&currentpass=" + encodeURIComponent(pass) + "&username=" + username;

        const response = await fetch("https://qzblapi.azurewebsites.net/api/RemoveAccount" + params);
        if (!response.ok) {
            throw new Error("Failed to fetch user details");
            alert("Failed to delete account.");
        }

        var data = await response.json();
        alert("Account deleted successfully!");

        setActionableAccount(null);
        setAction(null);
        getAccounts(pass);
    }

    function AccountDisplay({}) {
        if (accounts.length == 0) {
            return (
                <div>
                    <p>In order to see accounts here, please re-enter your password to authenticate yourself.</p>
                    <label>
                        <input className="loginbox" type="password" id="password" placeholder="Password" onKeyDown={handleEnterKey}/>
                    </label>
                    <button id="relogin" className="mainbutton" onClick={() => getAccounts(document.getElementById("password").value)}>OK</button>    
                </div>
            );
        } else {
            return (
                <div>
                    <hr />
                    {actionableAccount != null? (
                        <div id="popup-pass" className="dialog-short">
                            {action == "reset" ? (
                                <h3>Do you want to reset the password for '{actionableAccount}'?</h3>
                            ) : (
                                <h3>Do you want to delete the account '{actionableAccount}'?</h3>
                            )}
                            <input id="popup-password" className="loginbox" type="password" onKeyDown={handleEnterKeyPopup} placeholder="Enter your password to confirm"/>
                            <button id="button-reset-delete" className="mainbutton" onClick={() => handlePopupClose()}>OK</button>
                        </div>
                    ) : (
                        <div className="dialog-short">
                            <div>
                                <h3>Want to create a new account?</h3>
                                <p>First, fill out the fields below. You need to provide a unique username to identify the account. Providing a password is optional (if none is provided, a random one will be generated).</p>
                                <label>
                                    <input type="text" id="newusername" placeholder="New Username"/>
                                </label>
                                <label>
                                    <input type="password" id="newpassword" placeholder="New Password"/>
                                </label>
                            </div>
                            <div>
                                <h4>Do you want this account to be an administrator?</h4>
                                <p>Administrators can edit, create, and delete questions.
                                Administrators can also manage other accounts using this page.
                                Grant this permission carefully!</p>
                                <label>
                                    <input type="checkbox" id="newadmin" className="select-box"/>
                                </label>
                            </div>
                            <div>
                                <p>In order to create a new account, please re-enter your password and click "Create Account".</p>
                                <input className="loginbox" type="password" id="password" placeholder="Password" onKeyDown={handleEnterKeyCreate}/>
                                <button id="button-create-account" className="mainbutton" onClick={() => handleCreateAccount(document.getElementById("password").value)}>Create Account</button>
                            </div>
                        </div>
                    )}
                    <hr />
                    {accounts.map((account, index) => (
                    <div
                        key={index}
                        className="question-card"
                        onClick={() => handleAccountClick(account.username)}
                    >
                        <p>{account.username}</p>

                        {selectedAccount == account.username ? (
                        <div className="question-info-holder">
                            <button className="mainbutton" onClick={() => handlePasswordConfirm(account.username, "reset")}>Reset Password</button>
                            <button className="mainbutton" onClick={() => handlePasswordConfirm(account.username, "delete")}>Delete Account</button>
                        </div>
                        ) : (
                            <p>
                                {account.admin ? <strong>Administrator</strong> : "User"}
                            </p>
                        )}
                    </div>
                    ))}
                    <hr />
                </div>
            );
        }
    }

    function Manage({ user }) {
        if (user != undefined && user.uid > 0 && user.admin) {
            return (
            <div className="midbound">
                <h4>Manage Accounts</h4>
                <p>Admins can use this page to create, reset password for, and delete user accounts for Quizpedia. Click on any account to view options for it.</p>
                <AccountDisplay />
                <button className="mainbutton" onClick={() => window.location.href = "/"}>Back to Home</button>
                <img src="loading.gif" className="loading-symbol" id="login-loading"/>
            </div>
            );
        } else {
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
            return (
            <div className="midbound">
                <h4>You're not an admin or not logged in.</h4>
                <p>Please log in to an admin account to use this page. Otherwise, we'll redirect you to the home page in a moment.</p>
            </div>
            );
        }
    }

    return (
        <Manage user={cookies.auth}/>
    );
  }
  
  