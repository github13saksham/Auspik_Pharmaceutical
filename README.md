# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

## Career application email

Applications are written to the Firestore `careerApplications` collection and queue an HR email plus an applicant confirmation in the `mail` collection. An optional PDF/Word resume (up to 600 KB) is attached to the HR email. To deliver those messages:

1. Install Firebase's [Trigger Email extension](https://firebase.google.com/docs/extensions/official/firestore-send-email) in the Firebase project used by this app.
2. Configure the extension to monitor the `mail` collection and provide SMTP credentials, a default sender address, and a reply-to address in the Firebase Console.
3. Deploy `firestore.rules` to that same Firebase project before accepting applications. The rules allow only validated application submissions and matching email queue entries; application data and queued mail are not readable by visitors.

SMTP credentials must stay in the Firebase extension configuration and must not be added to frontend environment variables. Email delivery is not active until the extension is installed and configured.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
