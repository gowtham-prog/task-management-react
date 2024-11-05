
import { Route,Routes } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import TaskManagement from "./pages/taskManagement";

function App() {
  return (
    <Routes >
      <Route path="/" element={<TaskManagement />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
