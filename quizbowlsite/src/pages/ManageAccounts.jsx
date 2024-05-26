import React, { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";

export function ManageAccounts() { 
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const [accounts, setAccounts] = React.useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);

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

    var handleEnterKeyCreate = (event) => {
        if (event.key === "Enter") {
            handleCreateAccount(document.getElementById("password").value);
        }
    }

    async function getAccounts(pass) {
        const response = await fetch("https://qzblapi.azurewebsites.net/api/ListAccounts?uid=" + cookies.auth.uid + "&currentpass=" + encodeURIComponent(pass));
        const data = await response.json();
        console.log(data)
        setAccounts(data.accounts);
    }

    async function handleCreateAccount(currentpass) {
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
                alert("Account created successfully!");
                getAccounts(currentpass);
            }
        }
    }

    async function handleResetPassword(username) {}

    async function handleAccountDelete(username) {}

    function AccountDisplay({}) {
        if (accounts.length == 0) {
            return (
                <div>
                    <p>In order to see accounts here, please re-enter your password to authenticate yourself.</p>
                    <label>
                        <input className="loginbox" type="password" id="password" placeholder="Password" onKeyDown={handleEnterKey}/>
                    </label>
                </div>
            );
        } else {
            return (
                <div>
                    {accounts.map((account, index) => (
                    <div
                        key={index}
                        className="question-card"
                        onClick={() => handleAccountClick(account.username)}
                    >
                        <p>{account.username}</p>

                        {selectedAccount == account.username ? (
                        <div className="question-info-holder">
                            <button className="mainbutton" onClick={() => handleResetPassword(account.username)}>Reset Password</button>
                            <button className="mainbutton" onClick={() => handleAccountDelete(account.username)}>Delete Account</button>
                        </div>
                        ) : "Administrator: " + account.admin.toString().toUpperCase()}
                    </div>
                    ))}
                    <hr />
                    <h3>Want to create a new account?</h3>
                    <p>Fill out the fields below, then click Create Account.</p>
                    <div className="dialog">
                        <p>You need to provide a unique username to identify the account.<br/>Providing a password is optional - if none is provided, a random one will be generated.</p>
                        <label>
                            <input type="text" id="newusername" placeholder="New Username"/>
                        </label>
                        <label>
                            <input type="password" id="newpassword" placeholder="New Password"/>
                        </label>
                        <br />
                        <h4>Do you want this account to be an administrator?</h4>
                        <p>Administrators can edit, create, and delete questions.</p>
                        <p>Administrators can also manage other accounts using this page.</p>
                        <p>Grant this permission carefully!</p>
                        <label>
                            <input type="checkbox" id="newadmin" className="select-box"/>
                        </label>
                        <hr />
                        <p>In order to authorize the creation of a new account, please re-enter your password.</p>
                        <input className="loginbox" type="password" id="password" placeholder="Password" onKeyDown={handleEnterKey}/>
                    </div>
                    <button className="mainbutton" onClick={() => handleCreateAccount(document.getElementById("password").value)}>Create Account</button>
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
  
  