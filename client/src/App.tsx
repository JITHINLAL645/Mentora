import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner"; 

function App() {
  return (
    <Router>
      <AppRoutes />
      <Toaster richColors position="top-right" />
    </Router>
  );
}

export default App;
