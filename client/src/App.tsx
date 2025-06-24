import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store/store"; 

function App() {
  const auth = useSelector((state: RootState) => state.auth);
  console.log("🟢 Redux Auth State:", auth); // You’ll see it in browser console

  return (
    <Router>
      <AppRoutes />
      <Toaster richColors position="top-right" />
    </Router>
  );
}

export default App;
