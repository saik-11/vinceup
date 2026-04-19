"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import AvailabilityOptions from "./AvailabilityOptions";
import SingleDayForm from "./SingleDayForm";
import RecurringForm from "./RecurringForm";
import BlockTimeForm from "./BlockTimeForm";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SCREEN_TITLES = {
  options: "Set Availability",
  single: "Single Day Availability",
  recurring: "Recurring Availability",
  block: "Block Time",
};

export default function AvailabilityModal({ isOpen, onClose, initialScreen = "options" }) {
  const [prevInitial, setPrevInitial] = useState(initialScreen);
  const [activeScreen, setActiveScreen] = useState(initialScreen);

  // Derive activeScreen from initialScreen securely during render
  if (initialScreen !== prevInitial) {
    setPrevInitial(initialScreen);
    setActiveScreen(initialScreen);
  }

  const handleBack = () => setActiveScreen("options");

  const handleSubmit = (data) => {
    console.log("Submitted data for:", activeScreen, data);
    onClose();
  };

  const handleOpenChange = (open) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="w-full max-w-[480px] p-0 flex flex-col gap-0 overflow-hidden border-slate-100 dark:border-slate-800 bg-background/95 sm:rounded-[24px]"
        showCloseButton={true}
      >
        <DialogHeader className="p-6 pb-4 border-b border-transparent">
          <DialogTitle className="text-[17px] font-bold text-slate-900 dark:text-slate-100">{SCREEN_TITLES[activeScreen]}</DialogTitle>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="overflow-y-auto px-6 pb-6 pt-2 custom-scrollbar" style={{ maxHeight: "calc(100vh - 120px)" }}>
          <AnimatePresence mode="wait" initial={false}>
            {activeScreen === "options" && <AvailabilityOptions key="options" onSelectOption={setActiveScreen} />}
            {activeScreen === "single" && <SingleDayForm key="single" onBack={handleBack} onSubmit={handleSubmit} />}
            {activeScreen === "recurring" && <RecurringForm key="recurring" onBack={handleBack} onSubmit={handleSubmit} />}
            {activeScreen === "block" && <BlockTimeForm key="block" onBack={handleBack} onSubmit={handleSubmit} />}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
