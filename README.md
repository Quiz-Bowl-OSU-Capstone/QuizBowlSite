### Quiz Bowl Site
This repository contains the files for the front-end web interface for the OSU Quiz Bowl's website. The website itself is written in Next.js, which is a framework for React.js applications. Like the other repository, any deployment to the main branch will automatically trigger a build and deploy action that deploys the current website version onto the production Azure Static Web App.

## Internal File Structure
- .github
   - workflows
      - azure-static-web-apps workflow (auto-deploy workflow)
- quizbowlsite (contains the actual next.js application)

## Initial Setup
# Prerequisites
- Node.js (>= 18.17.0)
- Code editor of your choice
- The ability to clone github repositories (usually through GitHub Desktop)

1. Clone the repository using GitHub Desktop and open it using VS Code or your preferred code editor.
2. Open a terminal and navigate to the quizbowlsite folder inside the repository.
3. Run ```npm install``` to trigger the installation of all required software packages.

# To Run Locally
To run the website on your local machine, run the command ```npm run dev```. Your console will give you a link that you can visit in your browser to see the site. Any changes you make are updated in real time.

# More Info
For more information about Next.js and how it works, [visit the Next.js docs here](https://nextjs.org/docs).