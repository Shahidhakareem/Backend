import { useState } from "react";
import "./App.css";

import MainRoutes from "./routes/MainRoutes.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <MainRoutes />
      </div>
    </>
  );
}

export default App;
