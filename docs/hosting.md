# Hosting of Link-Up

this file contains documentation and information about hosting this project

```bash
Currently linkup-frontend is hosted on "https://getlinkup.vercel.app"
and linkup-backend end is hosted on "https://linkup-backend-k05n.onrender.com/"
```

## AWS Amplify

- I wanted to deploy my project to AWS but after trying to deploy i got to know that i need a credit card for the AWS even for a free account, so i started exploring other options.

## Vercel

- Hosting of frontend is pretty easy it just takes a few clicks.
- But i couldn't host the [Backend](../linkup-backend/) to vercel, it was causing an error:

```bash
No 'Access-Control-Allow-Origin' header is present
```

I tried configuring the file [vercel.json](../linkup-backend/vercel.json) but not yet able to remove the error.

- i added this code in [Backend](../linkup-backend/app.js)

```bash
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://getlinkup.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
```

- but the connection is still unsuccessfull
  > I am testing the connection by using socket.on.connection => emit("CTS") and console.log("connected") when CTS is received

## Render.com

- on advice to one of my friend I deployed the backend to render.com the link to backend is [https://linkup-backend-k05n.onrender.com/](https://linkup-backend-k05n.onrender.com/), and the deployment is sucessfull
