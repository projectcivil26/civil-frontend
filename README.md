git clone https://github.com/projectcivil26/civil-frontend.git
cd civil-frontend
pnpm install
# Then create application/Web/.env.local manually with:
#   AUTH_SECRET=...        (generate via: pnpm dlx auth secret)
#   AUTH_URL=http://localhost:3000
#   NEXT_PUBLIC_API_URL=http://localhost:8000/api
pnpm run dev
