import { store } from "@data/redux/index.store";
import DIProvider from "@ui/components/DIProvider/DIProvider.component";
import IndexRouter from "@ui/pages/index.router";
import React from "react";
import ReactDOM from "react-dom";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import "swiper/components/navigation/navigation.scss";
import "swiper/swiper.scss";
import { providers } from "./providers";
import reportWebVitals from "./reportWebVitals";
import "./styles/index.scss";

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <DIProvider providers={providers}>
        <Router>
          <IndexRouter />
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
