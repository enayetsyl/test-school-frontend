// import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
// import { useSelector } from "react-redux";
// import type { RootState } from "@/store/store";

// function PrivateRoute() {
//   const user = useSelector((s: RootState) => s.auth.user);
//   return user ? <Outlet /> : <Navigate to="/login" replace />;
// }
// function RoleGuard({ allow }: { allow: Array<"admin"|"student"|"supervisor"> }) {
//   const role = useSelector((s: RootState) => s.auth.user?.role);
//   return role && allow.includes(role) ? <Outlet /> : <Navigate to="/" replace />;
// }

// const LoginPage = () => {
//   // super-minimal placeholder; wire real form later
//   return <div className="p-6">Login Page</div>;
// };
// const StudentDashboard = () => <div className="p-6">Student Dashboard</div>;

// export const router = createBrowserRouter([
//   { path: "/", element: <Navigate to="/student/dashboard" replace /> },
//   { path: "/login", element: <LoginPage /> },
//   {
//     element: <PrivateRoute />,
//     children: [
//       { path: "/student/dashboard", element: <StudentDashboard /> },
//       {
//         element: <RoleGuard allow={["admin"]} />,
//         children: [
//           { path: "/admin", element: <div className="p-6">Admin Home</div> },
//         ],
//       },
//     ],
//   },
//   { path: "*", element: <div className="p-6">404</div> },
// ]);
