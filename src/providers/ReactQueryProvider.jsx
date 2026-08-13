"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
export const queryClient = new QueryClient();

const ReactQueryProvider = ({ children }) => {
  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools position="top" />
      </QueryClientProvider>
    </React.Fragment>
  );
};

export default ReactQueryProvider;
