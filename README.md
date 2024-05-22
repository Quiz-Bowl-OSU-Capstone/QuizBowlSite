# Quiz Bowl Site
This repository contains the files for the front-end web interface for the OSU Quiz Bowl's website. The website itself is written with React.js and Vite.js. Like the other repository, any deployment to the main branch will automatically trigger a build and deploy action that deploys the current website version onto the production Azure Static Web App.

## Internal File Structure
- .github
   - workflows
      - azure-static-web-apps workflow (auto-deploy workflow)
- quizbowlsite (contains the actual vite.js application)
   - node_modules
   - public (contains the publicly available resources, like images and the blank template CSV file)
   - src
      - components (contains individual React components like the question card and sheet formatting.)
      - fonts (contains the font used for Quiz Bowl, Exo in this case.)
      - pages (contains the individual pages)
      - Home.jsx (contains the overall page layout)
      - main.jsx (contains the router for React)
      - index.css (contains most of the styling for the website)

## Initial Setup
### Prerequisites
- Node.js (>= 18.17.0)
- Code editor of your choice
- The ability to clone github repositories (usually through GitHub Desktop)

1. Clone the repository using GitHub Desktop and open it using VS Code or your preferred code editor.
2. Open a terminal and navigate to the quizbowlsite folder inside the repository. You must be inside of the quizbowlsite folder, not just the QuizBowlSite repository.
3. Run ```npm install``` to trigger the installation of all required software packages.

### To Run Locally
To run the website on your local machine, run the command ```npm run dev```. Your console will give you a link that you can visit in your browser to see the site. Any changes you make are updated in real time. To stop the dev website, use Ctrl+C.

You do not need to run build or any other script, as Azure should automatically deploy the website on production with DevOps.

### More Info
For more information about Vite.js and how it works, [click here](https://vitejs.dev/guide/).
