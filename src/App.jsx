import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import router from "./Routes/router";
import { RouterProvider } from "react-router-dom";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
