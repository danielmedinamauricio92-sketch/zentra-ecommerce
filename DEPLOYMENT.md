# Zentra Production Deploy

## Backend: Railway

Service root directory:

```txt
back
```

Build command:

```txt
npm install && npm run build
```

Start command:

```txt
npm start
```

Healthcheck path:

```txt
/health
```

Required variables:

```env
NODE_ENV=production
PORT=${{PORT}}
DATABASE_URL=${{Postgres.DATABASE_URL}}
DB_SYNCHRONIZE=false
FRONTEND_URL=https://zentra-blond-eight.vercel.app
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=replace_after_google_oauth_setup
GOOGLE_CLIENT_SECRET=replace_after_google_oauth_setup
GOOGLE_CALLBACK_URL=https://zentra-backend-production-8613.up.railway.app/users/google/callback
```

`DB_SYNCHRONIZE=true` was used only for the first production deploy to create the schema. Keep it disabled afterward:

```env
DB_SYNCHRONIZE=false
```

## Frontend: Vercel

Project root directory:

```txt
front
```

Build command:

```txt
npm run build
```

Required variables:

```env
NEXT_PUBLIC_API_URL=https://your-railway-domain.up.railway.app
NEXT_PUBLIC_API_URL=https://zentra-backend-production-8613.up.railway.app
```

## Google OAuth

Create an OAuth client in Google Cloud Console:

- Application type: Web application
- Authorized redirect URI:

```txt
https://your-railway-domain.up.railway.app/users/google/callback
https://zentra-backend-production-8613.up.railway.app/users/google/callback
```

Copy the generated client ID and client secret into Railway:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```
