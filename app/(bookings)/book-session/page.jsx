"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import BookingStepIndicator from "./BookingStepIndicator";
import StepSelectService from "./StepSelectService";
import StepSelectSlot from "./StepSelectSlot";
import StepReviewSummary from "./StepReviewSummary";
import StepPaymentSuccess from "./StepPaymentSuccess";
import { menteeApi, paySimulation } from "@/lib/api/service";

const pageVariants = {
  enter: { opacity: 0, x: 40 },
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: -40,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const BookSession = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [notes, setNotes] = useState("");
  const [bookingResult, setBookingResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [availableSlots, setAvailableSlots] = useState([]);
  const [displayTimezone, setDisplayTimezone] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const goTo = (s) => setStep(s);

  const handleBookSession = () => {
    if (!selectedMentor?.id) {
      toast.error(`Missing booking details. Please go back and re-select a slot.`);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      availability_slot_id: selectedMentor.id,
      service_type: selectedService?.title || "something for now",
    };
    const trimmedNotes = notes.trim();
    if (trimmedNotes) payload.notes = trimmedNotes;

    menteeApi
      .createSessionBooking(payload)
      .then((res) => {
        setBookingResult(res.data);
        toast.success(res.data.message || "Session booked successfully!");
        const bookingId = res.data?.booking?.id;
        if (bookingId) {
          paySimulation.paidedSimulation(bookingId).then((data) => {
            router.push(`/my-sessions`);
          });
        } else {
          setStep(4);
        }
      })
      .catch((err) => {
        const status = err.response?.status;
        const serverMessage = err.response?.data?.message;

        if (status === 409) {
          toast.error("This slot has already been booked. Please go back and select another.");
        } else if (status === 422 || status === 400) {
          toast.error(serverMessage || "Invalid booking details. Please review and try again.");
        } else if (status === 401 || status === 403) {
          toast.error("Your session has expired. Please log in again.");
        } else if (!err.response) {
          toast.error("Network error. Please check your connection and try again.");
        } else {
          toast.error(serverMessage || "Failed to book session. Please try again.");
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  useEffect(() => {
    if (!selectedDate) return;

    const formattedDate =
      selectedDate instanceof Date
        ? [
            selectedDate.getFullYear(),
            String(selectedDate.getMonth() + 1).padStart(2, "0"),
            String(selectedDate.getDate()).padStart(2, "0"),
          ].join("-")
        : selectedDate;

    const params = { date: formattedDate };

    if (selectedService?.type) {
      params.service_type = selectedService.type;
    }

    let active = true;

    async function fetchSlots() {
      setLoadingSlots(true);
      setSlotsError(false);
      try {
        const res = await menteeApi.getBookingAvailableMentors(params);
        if (active) {
          const data = res?.data ?? {};
          setDisplayTimezone(data.display_timezone ?? "");
          setAvailableSlots(data.available_slots ?? []);
        }
      } catch {
        if (active) {
          setAvailableSlots([]);
          setSlotsError(true);
        }
      } finally {
        if (active) setLoadingSlots(false);
      }
    }

    fetchSlots();

    return () => {
      active = false;
    };
  }, [selectedDate, selectedService, retryCount]);

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
                availableSlots={availableSlots}
                displayTimezone={displayTimezone}
                loadingSlots={loadingSlots}
                slotsError={slotsError}
                onRetry={() => setRetryCount((c) => c + 1)}
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
                notes={notes}
                onNotesChange={setNotes}
                onBack={() => goTo(2)}
                onBookSession={handleBookSession}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step-4" variants={pageVariants} initial="enter" animate="center" exit="exit">
              <StepPaymentSuccess bookingResult={bookingResult} selectedService={selectedService} selectedMentor={selectedMentor} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookSession;
