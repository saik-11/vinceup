"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BookingStepIndicator from "./BookingStepIndicator";
import StepSelectService from "./StepSelectService";
import StepSelectSlot from "./StepSelectSlot";
import StepReviewSummary from "./StepReviewSummary";
import StepPaymentSuccess from "./StepPaymentSuccess";

const pageVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.2, ease: "easeIn" } },
};

const BookSession = () => {
  const [step, setStep] = useState(1);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [totalPaid, setTotalPaid] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const goTo = (s) => setStep(s);

  const handleCheckout = (total) => {
    setIsPending(true);
    setTimeout(() => {
      setTotalPaid(total);
      setIsPending(false);
      setStep(4);
    }, 1500);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setSelectedMentor(null);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    setSelectedMentor(null);
  };

  const displayStep = Math.min(step, 3);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-transparent pb-16">
      {step <= 3 && (
        <div className="pt-8 pb-6">
          <BookingStepIndicator currentStep={displayStep} />
        </div>
      )}

      {step === 4 && <div className="pt-12" />}

      <div className="px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step-1" variants={pageVariants} initial="enter" animate="center" exit="exit">
              <StepSelectService selectedService={selectedService} onSelect={setSelectedService} onNext={() => goTo(2)} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step-2" variants={pageVariants} initial="enter" animate="center" exit="exit">
              <StepSelectSlot
                selectedService={selectedService}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                selectedTime={selectedTime}
                onTimeChange={handleTimeChange}
                selectedMentor={selectedMentor}
                onMentorChange={setSelectedMentor}
                onBack={() => goTo(1)}
                onNext={() => goTo(3)}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step-3" variants={pageVariants} initial="enter" animate="center" exit="exit">
              <StepReviewSummary
                selectedService={selectedService}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                selectedMentor={selectedMentor}
                onBack={() => goTo(2)}
                onCheckout={handleCheckout}
                isPending={isPending}
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step-4" variants={pageVariants} initial="enter" animate="center" exit="exit">
              <StepPaymentSuccess
                selectedService={selectedService}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                selectedMentor={selectedMentor}
                totalPaid={totalPaid}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookSession;
