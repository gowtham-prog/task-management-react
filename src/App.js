
import { Route,Routes } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import TaskManagement from "./pages/taskManagement";

function App() {
  return (
    <Routes >
      <Route path="/this" element={<div>hello</div>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/tasks" element={<TaskManagement />} />
    </Routes>
  );
}

export default App;
