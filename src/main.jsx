import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
const App = lazy(() => import("./App.jsx"));

import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import LoadingScreen from "./components/Loading/LoadingScreen.jsx";

const Toaster = lazy(() =>
  import("react-hot-toast").then((module) => {
    return { default: module.Toaster };
  })
);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Toaster />
            <App />
          </Suspense>
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
