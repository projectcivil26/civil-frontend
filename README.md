This Repo represents the Frontend design development for the SiteStack Civil ERP project.

--> This architecture contains the structure for both web and mobile application under the application folder which acts as the core folder.
--> The Documents folder contains the .MD file for your agents to understand what is done exactly and all the other informations to learn and understand. 

Below are the steps to start contributing to the project.

git clone https://github.com/projectcivil26/civil-frontend.git
cd civil-frontend
pnpm install
# Then create application/Web/.env.local manually with:
#   AUTH_SECRET=...        (generate via: pnpm dlx auth secret)
#   AUTH_URL=http://localhost:3000
#   NEXT_PUBLIC_API_URL=http://localhost:8000/api
pnpm run dev
