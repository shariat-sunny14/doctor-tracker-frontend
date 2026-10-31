"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { Sheet } from "@/components/ui/Sheet";
import { useCreateDoctor, useDoctorMeta } from "@/lib/queries";
import { doctorSchema } from "@/lib/schemas";
import { applyServerErrors, errorMessage } from "@/lib/utils";

function DoctorForm({ onDone, onCreated }) {
  const create = useCreateDoctor();
  const meta = useDoctorMeta();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(doctorSchema),
    defaultValues: { name: "", specialization: "", hospital: "", phone: "", email: "" },
  });

  async function onSubmit(values) {
    try {
      const doctor = await create.mutateAsync(values);
      toast.success(`${doctor.name} added`);
      onCreated?.(doctor);
      onDone();
    } catch (error) {
      // 409 (email already used) and 422 (validation) arrive as field errors -> show them under the input.
      if (!applyServerErrors(error, setError)) toast.error(errorMessage(error));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
        <Field label="Full name" htmlFor="d-name" error={errors.name?.message}>
          <Input
            id="d-name"
            placeholder="Dr. Tanvir Ahmed"
            autoComplete="off"
            invalid={!!errors.name}
            {...register("name")}
          />
        </Field>

        <Field
          label="Specialization"
          htmlFor="d-spec"
          error={errors.specialization?.message}
          hint="Pick an existing one or type a new one."
        >
          <Input
            id="d-spec"
            list="spec-options"
            placeholder="Cardiology"
            autoComplete="off"
            invalid={!!errors.specialization}
            {...register("specialization")}
          />
          <datalist id="spec-options">
            {meta.data?.specializations.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </Field>

        <Field label="Hospital" htmlFor="d-hospital" error={errors.hospital?.message}>
          <Input
            id="d-hospital"
            list="hospital-options"
            placeholder="Hospital name"
            autoComplete="off"
            invalid={!!errors.hospital}
            {...register("hospital")}
          />
          <datalist id="hospital-options">
            {meta.data?.hospitals.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone" htmlFor="d-phone" error={errors.phone?.message}>
            <Input
              id="d-phone"
              type="tel"
              placeholder="01712345678"
              invalid={!!errors.phone}
              {...register("phone")}
            />
          </Field>
          <Field label="Email" htmlFor="d-email" error={errors.email?.message}>
            <Input
              id="d-email"
              type="email"
              placeholder="doctor@hospital.com"
              invalid={!!errors.email}
              {...register("email")}
            />
          </Field>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-ink-200 bg-ink-50/60 px-6 py-4">
        <Button type="button" variant="secondary" onClick={onDone} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Add doctor
        </Button>
      </div>
    </form>
  );
}

export default function DoctorFormSheet({ open, onOpenChange, onCreated }) {
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Add doctor"
      description="Create a doctor profile. You can add patients to them afterwards."
    >
      <DoctorForm onDone={() => onOpenChange(false)} onCreated={onCreated} />
    </Sheet>
  );
}
