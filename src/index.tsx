import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import "swiper/components/navigation/navigation.scss";
import "swiper/swiper.scss";
import "./config/i18n.config";
import { DIProvider } from "./modules/common/components";
import { MINIO_URL } from "./modules/common/constants/minio.constant";
import { IndexRouter } from "./modules/common/pages/index.router";
import { store } from "./modules/common/redux/index.store";
import "./modules/common/styles/index.scss";
import { Spinner } from "./modules/ui/components/Spinner/Spinner.component";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <DIProvider
        providers={[
          {
            provide: "minio.url",
            useValue: MINIO_URL,
          },
        ]}
      >
        <Router>
          <Suspense
            fallback={
              <Spinner page className="w-screen h-screen dark:bg-red" />
            }
          >
            <IndexRouter />
          </Suspense>
        </Router>
      </DIProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
