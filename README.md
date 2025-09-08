# LeetCode-Like Project (Admin + Backend + Frontend)

A monorepo containing:
- Admin dashboard (React/Argon)
- Backend (Java Spring Boot)
- Frontend (React app)

Repo: https://github.com/Tranvietbach/leetcodelikeproject

## Monorepo Structure

- `admin/` — Argon Dashboard React UI for admin
- `back end/` — Spring Boot backend (REST APIs, Stripe, email, MySQL)
- `front end/` — Public React web app

## Requirements

- Node.js 18+ and npm
- Java 17 (or compatible) + Maven
- MySQL 8+ (or a compatible instance)
- Git

## Environment Variables

Set these before running the backend:

- STRIPE_API_KEY
- SPRING_MAIL_USERNAME
- SPRING_MAIL_PASSWORD

On Windows (PowerShell):
```powershell
$env:STRIPE_API_KEY="your_stripe_key"
$env:SPRING_MAIL_USERNAME="your_email@example.com"
$env:SPRING_MAIL_PASSWORD="your_app_password"
```

On macOS/Linux:
```bash
export STRIPE_API_KEY="your_stripe_key"
export SPRING_MAIL_USERNAME="your_email@example.com"
export SPRING_MAIL_PASSWORD="your_app_password"
```

Database defaults (edit in `back end/src/main/resources/application.properties` if needed):
- URL: `jdbc:mysql://localhost:3306/Doanky4`
- User: `root`
- Password: `""` (empty)

## Backend (Spring Boot)

From `back end/`:
```bash
# Windows
mvnw.cmd spring-boot:run

# macOS/Linux
./mvnw spring-boot:run
```

Build:
```bash
# Windows
mvnw.cmd clean package

# macOS/Linux
./mvnw clean package
```

Default port: `2109` (change via `application.properties`).

## Frontend (React public app)

From `front end/`:
```bash
npm install
npm start
```

Dev server runs on `http://localhost:3000`

## Admin Dashboard (React)

From `admin/`:
```bash
npm install
npm start
```

Dev server runs on `http://localhost:3001` (or next free port).

## Notes on Secrets and Security

- Stripe key is loaded via env (no hard-coded secret).
- Mail credentials read via env (no plain-text secrets).
- Don’t commit `.env` files or secrets to the repo.

## Common Issues

- “Port already in use”: stop existing process or change the port.
- “Push blocked by GitHub push protection”: remove secrets from code/commit, then push again.
- MySQL auth errors: confirm `application.properties` DB URL/user/password.

## Scripts Quick Reference

- Admin:
  - `npm start` — dev
  - `npm run build` — production build
- Frontend:
  - `npm start` — dev
  - `npm run build` — production build
- Backend:
  - `mvnw spring-boot:run` — dev
  - `mvnw clean package` — build JAR

## License

Check `admin/LICENSE` for the dashboard’s license and apply your preferred license to the root project as needed.

## Repository

- Main branch contains all code: [leetcodelikeproject](https://github.com/Tranvietbach/leetcodelikeproject)
