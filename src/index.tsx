import { store } from "@data/redux/index.store";
import DIProvider from "@ui/components/DIProvider/DIProvider.component";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import "swiper/components/navigation/navigation.scss";
import "swiper/swiper.scss";
import Spinner from "./components/Spinner/Spinner.component";
import "./config/i18n.config";
import IndexRouter from "./pages/index.router";
import { providers } from "./providers";
import reportWebVitals from "./reportWebVitals";
import "./styles/index.scss";

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <DIProvider providers={providers}>
        <Router>
          <Suspense
            fallback={
              <Spinner page className="w-screen h-screen dark:bg-black" />
            }
          >
            <IndexRouter />
          </Suspense>
        </Router>
      </DIProvider>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
