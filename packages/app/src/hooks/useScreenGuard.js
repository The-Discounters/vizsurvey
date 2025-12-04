import { useContext, useMemo } from "react";
import { useSelector } from "react-redux";

import Spinner from "../components/Spinner.js";
import { Context as ServiceContext } from "../app/ReactContext.js";
import { getStatus } from "../features/questionSlice.js";

export function useScreenGuard({
  expectedStatus,
  isDataReady = true,
  loadingText = "Loading...",
  savingText = "Your answers are being saved...",
  suppressSavingOnMatch = false,
}) {
  const status = useSelector(getStatus);
  const processingRequests = useContext(ServiceContext);

  const spinner = useMemo(() => {
    if (!isDataReady) {
      return <Spinner text={loadingText} />;
    }

    const statusMatches = !expectedStatus || status === expectedStatus;
    const shouldShowSavingSpinner =
      processingRequests && !(suppressSavingOnMatch && statusMatches);

    if (!statusMatches || shouldShowSavingSpinner) {
      return <Spinner text={savingText} />;
    }

    return null;
  }, [
    expectedStatus,
    isDataReady,
    loadingText,
    processingRequests,
    suppressSavingOnMatch,
    savingText,
    status,
  ]);

  const statusMatches = !expectedStatus || status === expectedStatus;
  const shouldShowSavingSpinner =
    processingRequests && !(suppressSavingOnMatch && statusMatches);

  const isReady = isDataReady && statusMatches && !shouldShowSavingSpinner;

  return {
    isReady,
    processingRequests,
    spinner,
    status,
  };
}
