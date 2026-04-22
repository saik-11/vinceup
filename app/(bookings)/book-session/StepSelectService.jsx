"use client";

import { Check, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SERVICES } from "./booking-config";
import Link from "next/link";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function StepSelectService({ selectedService, onSelect, onNext }) {
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Choose Your Service</h1>
        <p className="mt-2 text-muted-foreground">Select the type of mentorship session you need</p>
      </div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto" variants={stagger} initial="hidden" animate="visible">
        {SERVICES.map((service) => {
          const Icon = service.icon;
          const isSelected = selectedService?.id === service.id;

          return (
            <motion.div
              key={service.id}
              variants={fadeUp}
              onClick={() => onSelect(service)}
              className={`
                relative cursor-pointer rounded-2xl border-2 p-6
                bg-white dark:bg-gray-900
                transition-all duration-200 hover:shadow-lg dark:hover:shadow-gray-900/50
                ${isSelected ? "border-primary shadow-md dark:shadow-primary/10" : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"}
              `}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 flex size-6 items-center justify-center rounded-full bg-primary text-white">
                  <Check className="size-3.5" />
                </motion.div>
              )}

              {/* Icon + Title + Description */}
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                  <Icon className="size-5" />
                </div>
                <div className="pr-6">
                  <h3 className="text-lg font-bold leading-tight">{service.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
                {service.tags.map((tag) => (
                  <span key={tag} className="text-xs font-medium text-primary">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Duration + Price */}
              <div className="mt-4 flex items-center gap-3 pt-1">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="size-3.5" />
                  {service.duration} minutes
                </span>
                <span className="text-xl font-bold text-primary">${service.price}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-10 flex items-center justify-between max-w-4xl mx-auto">
        <Button variant="outline" size="lg" asChild className="cursor-pointer">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
        {selectedService && (
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
            <Button size="lg" onClick={onNext} className="cursor-pointer">
              Continue to Schedule →
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
