import React, { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import LoadingScreen from "../components/Loading/LoadingScreen";
import UserNav from "../components/User/UserNav";

const Profile = lazy(() => import("../components/User/Profile"));
const Member = lazy(() => import("../components/User/Member"));
const OrderHistory = lazy(() => import("../components/User/OrderHistory"));

const UserPage = () => {
  const { path } = useParams();

  let renderedComponent;
  switch (path) {
    case "profile":
      renderedComponent = <Profile />;
      break;
    case "member":
      renderedComponent = <Member />;
      break;
    case "history":
      renderedComponent = <OrderHistory />;
      break;
    default:
      renderedComponent = <h1>Error</h1>;
  }

  return (
    <div>
      <div className="gap-16 pt-8 hidden sm:flex">
        <div className="w-1/3 flex flex-col items-center">
          <UserNav />
        </div>
        <div className="w-2/3">
          <Suspense fallback={<LoadingScreen />}>{renderedComponent}</Suspense>
        </div>
      </div>
      <div className="gap-16 pt-8 block sm:hidden">
        <div className="w-fullflex flex-col items-center">
          <Suspense fallback={<LoadingScreen />}>{renderedComponent}</Suspense>
        </div>
        <div className="w-full flex mt-10">
          <UserNav />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
