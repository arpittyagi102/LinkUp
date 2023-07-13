# Login Page

```bash
https://getlinkup.vercel.app/login
```

## Login data flow

In the Login page of LinkUp the following logic is implemented..
When the user clicks on the `login button`. it takes the input value of `email` and `password`.

| [Problem #4](https://github.com/arpittyagirocks/LinkUp/issues/4)                                 |
| ------------------------------------------------------------------------------------------------ |
| Here even if the fields are empty it still tries to send response to Backend                     |
| There is no Validator which confirms that value entered in `email` field is a valid email or not |

There it emits a socket event

```javascript
socket.emit("login-attempt", {
  email: emailinput,
  password: passwordinput,
});
```

<br/>

And the Backend catches these values and sends the response accordingly

```javascript
socket.on("login-attempt", async (userdata) => {
  const users = db.collection("users");
  const user = await users.findOne({ email: userdata.email });
  // Retrieving Users data from MongoDB

  if (!user) socket.emit("login-attempt-response", "WRONGEMAIL");
  // Response if there is email is wrong
  else if (user.email === userdata.email && user.password === userdata.password)
    socket.emit("login-attempt-response", "SUCCESSFULL");
  // Response if both email and password is correct
  else if (user.email === userdata.email && user.password !== userdata.password)
    socket.emit("login-attempt-response", "WRONGPASSWORD");
  // Response if email is correct but password is wrong
  else socket.emit("login-attempt-response", "UNSUCCESSFULL");
});
// Any other error
```

Now if the Frontend gets the response to be SUCCESSFULL it route to the `/chat` page

| [Problem #6](https://github.com/arpittyagirocks/LinkUp/issues/6)                                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| When the login is Successfull. Bbackend should send all the data of user to frontend, then react should store all the data into cookies and then route to `/chat` where the chatting page will receive all the data from cookies and display it according to the UI. |

```mermaid
    flowchart TD
        A -- username,password --> SB
        SB --> T
        DB --> Backend
        subgraph Frontend
            A["Login Button"]
            T["Login Status"]
        end
        subgraph Backend
            SB["socket.on(userdata)"]
            SB -- findOne --> B
            B("users")
        end
        DB[("MongoDB")]
```

## Google Authentication

The project is using `useGoogleLogin` from `@react-oauth/google` library for google authentication.
In which OnSuccess we get the response and find the access_token from it
then use it to fetch user data from `googleapis` and console.log the user details

| [Problem](https://github.com/users/arpittyagirocks/projects/3/views/1?pane=issue&itemId=31673954)                                                               |
| --------- |
| When the google authentication is Successfull. It should send data to backend that user has logged in and send data to cookies and then navigate to `chat` page |

## Learnings

### Connecting and calling socket.io
When i connected to socket.io, it is called multiple times in react due to which in the nodejs terminal a lot of connections are shown, so i connected it in a useEffect
```javascript
useEffect(() => {
    const socket = io.connect("http://localhost:3001");
    return () => {  
            socket.disconnect();
        };
}, []);
```
But this code was causing a problem i wanted to send a socket event inside `handlesubmit` function, which was causing an error `socket is not defined` as the socket was defined in useEffect and it was inaccessible outside.

So i tried to define the `handlesubmit` function in the same useEffect, but due to that now this function is inaccessible to the `Login button`
after searching i found the solution which is : creating a state
```javascript
const [socket, setSocket] = useState("");
useEffect(() => {
    cost socket = io.connect("http://localhost:3001");
    setSocket(socket);
    return () => {
          socket.disconnect();
    };
}, []);
```
and now i was able to send socket events from anywhere in the page
