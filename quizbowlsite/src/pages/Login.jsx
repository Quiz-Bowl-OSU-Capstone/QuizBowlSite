export function Login() {
  return (
    <>
      <div className="dialog">
        <form>
          <label>
            Username:
            <input type="text" placeholder="Enter Username/Email" />
          </label>
          <br />
          <label>
            Password:
            <input type="text" placeholder="Enter Password" />
          </label>
          <br />
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
}
