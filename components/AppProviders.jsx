"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import HeaderLayoyt from "@/components/layout/HeaderLayoyt";
import { TooltipProvider } from "@/components/ui/tooltip";

const AppProviders = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HeaderLayoyt>{children}</HeaderLayoyt>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
