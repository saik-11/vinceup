"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { AlertCircle, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { mentorApi } from "@/services/service";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function BlockTimeForm({ onBack, onSubmit, selectedDate }) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      date: selectedDate || null,
      startTime: "",
      endTime: "",
    },
  });

  useEffect(() => {
    reset({
      date: selectedDate || null,
      startTime: "",
      endTime: "",
    });
  }, [selectedDate, reset]);

  const doSubmit = async (data) => {
    try {
      if (!data.date || !data.startTime || !data.endTime) {
        toast.error("Please complete the required date and time entries.");
        return;
      }
      
      const payload = {
        slots: [
          {
            date: format(data.date, "yyyy-MM-dd"),
            start_time: data.startTime,
            end_time: data.endTime,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
            service_type: null,
            status: "Blocked"
          }
        ]
      };
      
      await mentorApi.createAvailability(payload);
      toast.success("Time successfully blocked!");
      onSubmit?.();
    } catch (err) {
      console.error("Availability save failed:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to block time.");
    }
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
        {/* Warning Banner */}
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400">
          <AlertCircle className="size-4 shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-[13px] font-medium leading-tight">
            Blocked time will prevent mentees from booking sessions during this period.
          </p>
        </div>

        {/* Select Date */}
        <div>
          <Label className={labelClass}>Select Date</Label>
          <Controller
            control={control}
            name="date"
            rules={{ required: true }}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-10 rounded-xl justify-start text-left font-normal bg-white dark:bg-(--dashboard-panel-strong) border-slate-200 dark:border-slate-800",
                      !field.value && "text-slate-400",
                      errors.date && "border-red-500 focus-visible:ring-red-500",
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
                  <SelectTrigger
                    className={cn(
                      "w-full h-10 rounded-xl bg-white dark:bg-(--dashboard-panel-strong)",
                      errors.startTime && "border-red-500",
                    )}
                  >
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
                  <SelectTrigger
                    className={cn("w-full h-10 rounded-xl bg-white dark:bg-(--dashboard-panel-strong)", errors.endTime && "border-red-500")}
                  >
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
          className="flex-1 h-10 rounded-xl bg-red-600 hover:bg-red-700 px-5 text-sm font-bold text-white shadow-sm transition-all disabled:opacity-70 disabled:cursor-wait hover:scale-[1.01] active:scale-[0.98]"
        >
          {isSubmitting ? (
            "Blocking..."
          ) : (
            <div className="flex items-center gap-2">
              <AlertCircle className="size-4" strokeWidth={2} />
              Block This Time
            </div>
          )}
        </Button>
      </div>
    </motion.form>
  );
}
