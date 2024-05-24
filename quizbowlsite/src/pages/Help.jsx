// export function Help() {
//   return (
//     <>
//       <ol type="1">
//         <li>Login to your Account, using email and password.</li>
//         <li>To filter questions click on the filter icon on the side bar.</li>
//       </ol>

//     <p>This page provides information on how to use the OSU Quiz Bowl website.</p>
//     <h2>Initial Setup</h2>
//     <p>Before running the website locally, ensure you have the following prerequisites:</p>
//     <ul>
//       <li>Node.js (= 18.17.0)</li>
//       <li>Code editor of your choice</li>
//       <li>The ability to clone GitHub repositories (usually through GitHub Desktop)</li>
//     </ul>
//     <h2>To Run Locally</h2>
//     <ol>
//       <li>Clone the repository using GitHub Desktop and open it using VS Code or your preferred code editor.</li>
//       <li>Open a terminal and navigate to the <code>quizbowlsite</code> folder inside the repository.</li>
//       <li>Run <code>npm install</code> to trigger the installation of all required software packages.</li>
//       <li>To run the website on your local machine, run the command <code>npm run dev</code>. Your console will give you a link that you can visit in your browser to see the site. Any changes you make are updated in real time.</li>
//     </ol>
//     </>
//   );
// }
export function Help() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', marginBottom: '20px' }}>
        <h2>Login</h2>
        <p>Login to your Account, using email and password.</p>
        <li>To filter questions click on the filter icon on the side bar.</li>
      </div>

      <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
        <p>This page provides information on how to use the OSU Quiz Bowl website.</p>
        <h2>Initial Setup</h2>
        <p>Before running the website locally, ensure you have the following prerequisites:</p>
        <ul style={{ marginBottom: '20px' }}>
          <li>Node.js (= 18.17.0)</li>
          <li>Code editor of your choice</li>
          <li>The ability to clone GitHub repositories (usually through GitHub Desktop)</li>
        </ul>
        <h2>To Run Locally</h2>
        <ol>
          <li>Clone the repository using GitHub Desktop and open it using VS Code or your preferred code editor.</li>
          <li>Open a terminal and navigate to the <code style={{ backgroundColor: '#f0f0f0', padding: '2px 5px', borderRadius: '3px' }}>quizbowlsite</code> folder inside the repository.</li>
          <li>Run <code>npm install</code> to trigger the installation of all required software packages.</li>
          <li>To run the website on your local machine, run the command <code>npm run dev</code>. Your console will give you a link that you can visit in your browser to see the site. Any changes you make are updated in real time.</li>
        </ol>
      </div>
    </div>
  );
}

