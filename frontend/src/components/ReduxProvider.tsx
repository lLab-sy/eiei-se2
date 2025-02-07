'use client'
import { persistor, store } from "@/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  </Provider>
  )
}
