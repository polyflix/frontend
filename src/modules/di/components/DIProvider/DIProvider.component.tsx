import React, { PropsWithChildren } from "react";
import { useDispatch } from "react-redux";
import { APP_DISPATCHER } from "../../../common/constants/injection.constant";
import { Container } from "../../container";
import { Provider } from "../../types";

type DIProviderProps = {
  providers?: Provider[];
};

/**
 * A simple component that can accepts an array of providers in props in order
 * to provide them in the store.
 */
const DIProvider: React.FC<PropsWithChildren<DIProviderProps>> = ({
  providers,
  children,
}) => {
  const dispatch = useDispatch();

  const defaultProviders: Provider[] = [
    { provide: APP_DISPATCHER, useValue: dispatch },
  ];

  Container.provide(
    providers ? [...providers, ...defaultProviders] : defaultProviders
  );

  return <>{children}</>;
};

export default DIProvider;
