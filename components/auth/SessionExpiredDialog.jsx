"use client";

import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

export function SessionExpiredDialog({ open, onConfirm, isWarning, onContinue }) {
  // Prevent closing dialog by restricting interactions outside
  const handleOpenChange = (isOpen) => {
    // Force user to interact with the buttons if session is fully expired
    if (!open) return;
    if (isWarning && !isOpen) {
      onContinue?.();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent
        onInteractOutside={(e) => {
          if (!isWarning) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (!isWarning) e.preventDefault();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{isWarning ? "Session Expiring Soon" : "Session Expired"}</AlertDialogTitle>
          <AlertDialogDescription>
            {isWarning
              ? "Your session is about to expire in less than 2 minutes. Do you want to continue your session or log out?"
              : "Your login session has expired. Please sign in again to continue."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* {isWarning ? (
            <>
              <AlertDialogCancel onClick={onConfirm}>Log out</AlertDialogCancel>
              <AlertDialogAction onClick={onContinue}>Continue Session</AlertDialogAction>
            </>
          ) : (
          )} */}
          <AlertDialogAction onClick={onContinue}>Go to Login</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
