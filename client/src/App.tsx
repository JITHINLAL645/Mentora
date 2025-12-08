import { BrowserRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store/store";
import { PersistGate } from "redux-persist/integration/react";
import axios from "axios";
import { setUser } from "./redux/slice/authSlice";

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      if (userId && userName) {
        dispatch(setUser({
          _id: userId,
          name: userName,
          email: "", 
          isAdmin: false, 
          token: token
        }));
      }
    }
  }, [dispatch]);

  return (
    <>
      <AppRoutes />
      <Toaster richColors position="top-right" />
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <AppContent />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;