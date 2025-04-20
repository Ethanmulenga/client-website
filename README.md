# Project Setup

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com.
2. In your Firebase project settings, find your Firebase configuration object.
3. Create a `.env` file in the root of your project (do NOT commit this file to version control).
4. Add your Firebase credentials to the `.env` file as follows:

```
FIREBASE_API_KEY=your_actual_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
```

5. Ensure `.env` is added to your `.gitignore` file to prevent accidental commits.

## Using Environment Variables in Code

- Replace all hardcoded Firebase config objects with environment variables.
- For example, in Node.js or build tools, access variables via `process.env.FIREBASE_API_KEY`.
- In frontend frameworks like Vite or React, use `import.meta.env.VITE_FIREBASE_API_KEY` or similar.

## Verify

- Run your app locally and verify Firebase functionality works correctly with environment variables.
- Check that `.env` is not tracked by Git by running `git status`.

## Notes

- Never commit your Firebase API keys or credentials to public repositories.
- Use environment variables to keep sensitive data secure.
