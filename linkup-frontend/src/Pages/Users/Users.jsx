import React, { useEffect } from "react";

export default function Users() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/userslist");
        const userData = await response.json();
        console.log(userData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <h1>User data</h1>
    </>
  );
}
