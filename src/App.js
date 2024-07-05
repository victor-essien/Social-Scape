import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import {
  Home,
  Login,
  Register,
  ResetPassword,
  Profile,
  Message,
  Friends,
} from "./pages";
import { useSelector } from "react-redux";

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
function App() {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div data-theme={theme} className="w-full min-h-[100vh]">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:id?" element={<Profile />} />
          <Route path="/friendRequest" element={<Friends />} />
          <Route path="/messages" element={<Message />} />
          <Route path="/messages/:chatId" element={<Message />} />
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
