"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm, Controller, useWatch } from "react-hook-form";
import { CheckCircle2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const DAYS = [
  { id: "mon", label: "Mon" },
  { id: "tue", label: "Tue" },
  { id: "wed", label: "Wed" },
  { id: "thu", label: "Thu" },
  { id: "fri", label: "Fri" },
  { id: "sat", label: "Sat" },
  { id: "sun", label: "Sun" },
];

export default function RecurringForm({ onBack, onSubmit, selectedDate }) {
  const [selectedDays, setSelectedDays] = useState(() => {
    if (selectedDate) {
      const dayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
      return [dayMap[selectedDate.getDay()]];
    }
    return ["mon", "tue", "wed"];
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      startTime: "",
      endTime: "",
      slotDuration: "30m",
      bufferTime: "0m",
      repeatIndefinitely: false,
      endDate: null,
    },
  });

  const repeatIndefinitely = useWatch({
    control,
    name: "repeatIndefinitely",
  });

  useEffect(() => {
    if (selectedDate) {
      const dayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
      setSelectedDays([dayMap[selectedDate.getDay()]]);
    } else {
      setSelectedDays(["mon", "tue", "wed"]);
    }
    reset({
      startTime: "",
      endTime: "",
      slotDuration: "30m",
      bufferTime: "0m",
      repeatIndefinitely: false,
      endDate: null,
    });
  }, [selectedDate, reset]);

  const toggleDay = (id) => {
    setSelectedDays((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  };

  const doSubmit = async (data) => {
    if (selectedDays.length === 0) {
      alert("Please select at least one day");
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 600));
    onSubmit?.({ ...data, days: selectedDays });
  };

  const labelClass = "text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5 inline-block";

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit(doSubmit)}
      className="flex flex-col h-full gap-5 px-1 py-1"
    >
      <div className="space-y-5">
        {/* Day selection */}
        <div>
          <Label className={labelClass}>Select Days</Label>
          <div className="flex flex-wrap items-center gap-2">
            {DAYS.map((day) => {
              const isSelected = selectedDays.includes(day.id);
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => toggleDay(day.id)}
                  className={cn(
                    "flex h-8 items-center justify-center rounded-lg border px-3 text-xs font-semibold transition-all duration-150",
                    isSelected
                      ? "border-transparent bg-purple-100 text-purple-700 shadow-sm dark:bg-purple-900/40 dark:text-purple-300"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-(--dashboard-panel-strong) dark:text-slate-400 dark:hover:bg-slate-800/50",
                  )}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Start/End Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className={labelClass}>Start Time</Label>
            <Controller
              name="startTime"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={cn("w-full h-10 rounded-xl bg-white dark:bg-(--dashboard-panel-strong)", errors.startTime && "border-red-500")}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00">08:00 AM</SelectItem>
                    <SelectItem value="09:00">09:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label className={labelClass}>End Time</Label>
            <Controller
              name="endTime"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={cn("w-full h-10 rounded-xl bg-white dark:bg-(--dashboard-panel-strong)", errors.endTime && "border-red-500")}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="13:00">01:00 PM</SelectItem>
                    <SelectItem value="14:00">02:00 PM</SelectItem>
                    <SelectItem value="15:00">03:00 PM</SelectItem>
                    <SelectItem value="16:00">04:00 PM</SelectItem>
                    <SelectItem value="17:00">05:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Optional Settings Divider */}
        <div className="pt-2 pb-1">
          <h4 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 mb-1">Optional Settings</h4>
        </div>

        {/* Slot/Buffer */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className={labelClass}>Slot Duration</Label>
            <Controller
              name="slotDuration"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full h-10 rounded-xl bg-white dark:bg-(--dashboard-panel-strong)">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15m">15 mins</SelectItem>
                    <SelectItem value="30m">30 mins</SelectItem>
                    <SelectItem value="45m">45 mins</SelectItem>
                    <SelectItem value="60m">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label className={labelClass}>Buffer Time</Label>
            <Controller
              name="bufferTime"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full h-10 rounded-xl bg-white dark:bg-(--dashboard-panel-strong)">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0m">None</SelectItem>
                    <SelectItem value="5m">5 mins</SelectItem>
                    <SelectItem value="10m">10 mins</SelectItem>
                    <SelectItem value="15m">15 mins</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Repeat Indefinitely & End Date */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center space-x-2">
            <Controller
              control={control}
              name="repeatIndefinitely"
              render={({ field }) => <Checkbox id="repeat-indef" checked={field.value} onCheckedChange={field.onChange} className="rounded text-purple-600 focus:ring-purple-500" />}
            />
            <Label htmlFor="repeat-indef" className="text-sm font-semibold text-slate-800 dark:text-slate-200 cursor-pointer select-none">
              Repeat indefinitely
            </Label>
          </div>

          {!repeatIndefinitely && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <Label className={labelClass}>End Date</Label>
              <Controller
                control={control}
                name="endDate"
                rules={{ required: !repeatIndefinitely }}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-10 rounded-xl justify-start text-left font-normal bg-white dark:bg-(--dashboard-panel-strong) border-slate-200 dark:border-slate-800",
                          !field.value && "text-slate-400",
                          errors.endDate && "border-red-500 focus-visible:ring-red-500",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PP") : <span>dd-mm-yyyy</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </motion.div>
          )}
        </div>
      </div>

      <Separator className="mt-4 border-slate-100 dark:border-slate-800" />

      <div className="flex items-center justify-between gap-3 pt-1">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="h-10 rounded-xl px-5 text-sm font-semibold shadow-sm transition-all hover:bg-slate-50 border-slate-200 dark:border-slate-800 dark:bg-(--dashboard-panel) text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-10 rounded-xl bg-[linear-gradient(135deg,#7c3aed,#9333ea)] hover:bg-[linear-gradient(135deg,#6d28d9,#7e22ce)] px-5 text-sm font-bold text-white shadow-[0_4px_12px_-4px_rgba(124,58,237,0.5)] transition-all disabled:opacity-70 disabled:cursor-wait hover:scale-[1.01] active:scale-[0.98]"
        >
          {isSubmitting ? (
            "Saving..."
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4" strokeWidth={2} />
              Save Recurring Availability
            </div>
          )}
        </Button>
      </div>
    </motion.form>
  );
}
