export function About() {
  return (
    <div className="about-div">
      <h1>About the Quiz Bowl Capstone Project</h1>
      <h2>Project Purpose:</h2>
      <ul>
        <li>
          <h3>This website allows quizmasters for OSU's Extension Service to access quiz questions through basic filtering.</h3>
          <h3>Users are required to login before accessing the filtering can happen on this site.</h3>
          <h3>Based of off what the user filters, the backend will run to the Azure databse which will fetch questions based on the filters.</h3>
        </li>
      </ul>

      <h2>4-H Program Information:</h2>
      <ul>
        <li>
          <h3>Youth Program that is an extension provided by Oregon State University</h3>
        </li>
      </ul>

      <h2>Website Technical Information:</h2>
      <ul>
        <li>
          <h3>This is the front-end web interface for the Quiz Bowl database.</h3>
        </li>
      </ul>
    </div>
  );
}
