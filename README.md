# cast-react-service

React frontend for cast login and signup. It talks to
[cast-java-services/auth-service](https://github.com/Ayushnachiketa/cast-java-services/tree/main/auth-service).

Built with [Vite](https://vite.dev) + React, using only function components and `useState`/`useEffect`.

## Run it

1. Start the backend (in `cast-java-services/auth-service`):
   ```bash
   ./mvnw spring-boot:run
   ```
2. Start the frontend:
   ```bash
   npm install
   npm run dev
   ```
3. Open http://localhost:5173

OTPs are not really sent yet: look for `[DEV] OTP for ... is 123456` in the **backend** console.

Other scripts: `npm run build` (production build into `dist/`), `npm run lint`.

## How the frontend reaches the backend

`vite.config.js` forwards every `/api/...` request to `http://localhost:8080`, so there are no CORS problems
in development. To call a different backend (e.g. after deploying), set `VITE_API_BASE_URL` in a `.env` file:

```
VITE_API_BASE_URL=https://api.example.com
```

## Folder structure

```
src/
├── main.jsx                 starts React and the router
├── App.jsx                  which URL shows which page
├── index.css                all styles
├── api/authApi.js           one function per backend API (uses fetch)
├── utils/token.js           save/read/remove the JWT in localStorage
├── components/
│   ├── AuthCard.jsx         white card layout with a title
│   ├── TextField.jsx        label + input
│   ├── OtpForm.jsx          "enter OTP" form (used by login and signup)
│   ├── Message.jsx          error / info box
│   └── ProtectedRoute.jsx   redirects to /login if there is no token
└── pages/
    ├── LoginPage.jsx        /login
    ├── SignupPage.jsx       /signup
    └── HomePage.jsx         /  (shows your profile, needs login)
```

## The flows

**Login (`/login`)**
1. Enter email or mobile → **Send OTP**.
   If the account doesn't exist you see "No account found" with a link to sign up.
2. Enter the OTP → **Log in** → token is saved → home page.

**Signup (`/signup`)**
1. Enter email or mobile → **Send OTP**.
   If the account already exists, the page switches to "enter OTP to log in".
2. Enter the OTP.
3. Enter your name and email → **Continue**.
   If this email was already verified in step 1, the account is created right away.
4. Otherwise enter the OTP sent to the email → **Create account** → home page.

Each page keeps a `step` value in state and shows the form for that step. Read
`src/pages/LoginPage.jsx` first; it is the simplest example.
