import { LoadingScreen } from "@/components";
import path from "@/lib/path";
import Auth from "@/pages/auth/Auth";
import Home from "@/pages/home/Home";
import { lazy, Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

// auth
const Login = Loadable(lazy(() => import("@/pages/auth/Login")));
const Register = Loadable(lazy(() => import("@/pages/auth/Register")));
const ForgotPassword = Loadable(
  lazy(() => import("@/pages/auth/ForgotPassword"))
);
// Not Found
const NotFound = Loadable(lazy(() => import("@/components/NotFound")));
// Home
const Posts = Loadable(lazy(() => import("@/pages/home/Posts")));
const User = Loadable(lazy(() => import("@/pages/home/User")));
const Search = Loadable(lazy(() => import("@/pages/home/Search")));
const PostDetail = Loadable(lazy(() => import("@/pages/home/PostDetail")));
const Activity = Loadable(lazy(() => import("@/pages/home/Activity")));
const Chats = Loadable(lazy(() => import("@/pages/home/Chats")));

const Router = () => {
  return useRoutes([
    {
      path: path.AUTH,
      element: <Auth />,
      children: [
        { path: path.LOGIN, element: <Login /> },
        { path: path.REGISTER, element: <Register /> },
        { path: path.FORGOT_PASSWORD, element: <ForgotPassword /> },
        { path: path.NOT_FOUND, element: <NotFound /> },
        {
          path: path.ALL,
          element: <Navigate to={`/${path.NOT_FOUND}`} replace />,
        },
      ],
    },
    {
      path: path.HOME,
      element: <Home />,
      children: [
        { path: "", element: <Posts /> },
        { path: path.USER__NAME, element: <User /> },
        { path: path.SEARCH, element: <Search /> },
        { path: path.POSTS__ID, element: <PostDetail /> },
        { path: path.ACTIVITY, element: <Activity /> },
        { path: path.MESSAGER, element: <Chats /> },
        { path: path.NOT_FOUND, element: <NotFound /> },
        {
          path: path.ALL,
          element: <Navigate to={`/${path.NOT_FOUND}`} replace />,
        },
      ],
    },
  ]);
};

export default Router;
