import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import routes from "./Routes";
import LazyLoader from "./Components/Loaders/LazyLoader";

export default function App() {
  return (
    <>
      <Suspense fallback={<LazyLoader/>}>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </Suspense>
    </>
  )
}
