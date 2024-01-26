import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./ui/Home.js";
import Error from "./ui/Error.js";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>,
    errorElement: <Error />,
  },
]);

function App() {
  return (
      <RouterProvider router={router}/>
  )
}

export default App;
