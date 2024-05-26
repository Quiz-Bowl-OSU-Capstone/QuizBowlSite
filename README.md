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

### To Deploy A Static Web App For Quizpedia:
1. In the Azure portal, click "Create a resource".
2. Search for "Static web app" in the search bar that appears. Find that one that is titled "Static Web App" and created by Microsoft, and click Create.
3. You'll need to click another button that says "Create" next to the drop down box that says Plan: Static Web App. If the drop down does not say Static Web App, you are in the wrong place.
4. Enter the following details on the Basics page:
- Subscription: 4H (unless you are developing in a different one)
- Resource Group: Quizbowl
- Name: Quizpedia (or something else, just remember what it is)
- Hosting Plan: Free
5. In the section for Deployment details, enter the following information:
- Source: GitHub
- GitHub account: log in with your gitHub account that has access to the Quizpedia repository for the website.
- Organization: Quiz-Bowl-CS-Capstone (or whatever organization your repo is owned by)
- Repository: QuizBowlSite (or whatever repo you are using)
- Branch: main
6. In the section for Build details, enter the following information or make sure it is entered correctly (some of it will autofill when you select the correct repository.):
- Build Presets: React
- App location: ./quizbowlsite
- Api location: (leave blank)
- Output location: build
7. Click on Review and Create.
8. Make sure there are no errors, then click "Create".

### More Info
For more information about Vite.js and how it works, [click here](https://vitejs.dev/guide/).
