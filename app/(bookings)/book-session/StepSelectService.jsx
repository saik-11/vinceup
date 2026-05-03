"use client";

import { ArrowRight, Check, Clock, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function EmptyServices() {
  return (
    <Card className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white py-0 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <CardContent className="flex min-h-56 flex-col items-center justify-center p-6 text-center">
        <FileText className="size-12 text-gray-300 dark:text-gray-700" />
        <p className="mt-4 text-base font-medium text-gray-600 dark:text-gray-300">No services available</p>
      </CardContent>
    </Card>
  );
}

export default function StepSelectService({ services = [], selectedService, onSelect, onNext }) {
  return (
    <section className="mx-auto max-w-[1280px]">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-950 dark:text-gray-50">Choose Your Service</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Select the type of mentorship session you need</p>
      </div>

      {services.length === 0 ? (
        <EmptyServices />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon ?? FileText;
            const isSelected = selectedService?.id === service.id;

            return (
              <button key={service.id} type="button" onClick={() => onSelect(service)} className="text-left">
                <Card
                  className={`h-full rounded-2xl border bg-white py-0 shadow-sm dark:bg-gray-900 ${
                    isSelected ? "border-primary bg-primary/5 dark:bg-primary/10" : "border-gray-200 dark:border-gray-800"
                  }`}
                >
                  <CardContent className="relative p-6">
                    {isSelected && (
                      <span className="absolute right-6 top-6 flex size-6 items-center justify-center rounded-full border-2 border-primary text-primary">
                        <Check className="size-3.5" />
                      </span>
                    )}

                    <div className="flex items-start gap-4 pr-9">
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                        <Icon className="size-6" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-xl font-bold leading-tight text-gray-950 dark:text-gray-50">{service.title}</h2>
                        {service.description && <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{service.description}</p>}
                      </div>
                    </div>

                    {service.tags?.length ? (
                      <div className="mt-5 flex flex-wrap gap-2 pl-[4.5rem]">
                        {service.tags.map((tag) => (
                          <Badge key={tag} className="h-6 rounded bg-purple-50 px-2 text-xs font-medium text-purple-700 hover:bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-6 flex items-center gap-3 pl-[4.5rem]">
                      {service.duration ? (
                        <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                          <Clock className="size-4" />
                          {service.duration} minutes
                        </span>
                      ) : null}
                      {service.price != null ? <span className="text-2xl font-bold text-primary">${service.price}</span> : null}
                    </div>
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="outline" size="lg" asChild className="h-13 rounded-xl border-2 border-gray-300 bg-white px-5 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
        <Button size="lg" onClick={onNext} disabled={!selectedService} className="h-13 rounded-xl bg-primary px-8 text-base font-bold text-white shadow-none hover:bg-primary/90 disabled:bg-gray-200 disabled:text-gray-400 disabled:opacity-100 dark:disabled:bg-gray-800">
          Continue to Schedule
          <ArrowRight className="size-5" />
        </Button>
      </div>
    </section>
  );
}
