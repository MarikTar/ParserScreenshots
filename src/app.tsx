import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

export const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (<div>Loading</div>),
    },
    {
      path: "test",
      element: (
        <div className="root">
          <header className="app-header">
            Test
          </header>
        </div>
      ),
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}