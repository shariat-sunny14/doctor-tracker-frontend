"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Input";
import { Sheet } from "@/components/ui/Sheet";
import { CONDITIONS, GENDERS } from "@/lib/constants";
import { useCreatePatient, useDoctorOptions, useUpdatePatient } from "@/lib/queries";
import { patientSchema } from "@/lib/schemas";
import { applyServerErrors, cn, errorMessage } from "@/lib/utils";

function PatientForm({ patient, lockedDoctor, onDone }) {
  const isEdit = Boolean(patient);
  const doctors = useDoctorOptions();
  const create = useCreatePatient();
  const update = useUpdatePatient();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: patient?.name ?? "",
      age: patient?.age ?? "",
      gender: patient?.gender ?? "",
      phone: patient?.phone ?? "",
      email: patient?.email ?? "",
      address: patient?.address ?? "",
      condition: patient?.condition ?? "general",
      doctorId: patient?.doctorId ?? lockedDoctor?._id ?? "",
    },
  });

  async function onSubmit(values) {
    try {
      if (isEdit) await update.mutateAsync({ id: patient._id, body: values });
      else await create.mutateAsync({ body: values, lockedDoctorId: lockedDoctor?._id });
      toast.success(isEdit ? "Patient updated" : "Patient added");
      onDone();
    } catch (error) {
      if (!applyServerErrors(error, setError)) toast.error(errorMessage(error));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
        <Field label="Full name" htmlFor="p-name" error={errors.name?.message}>
          <Input
            id="p-name"
            placeholder="e.g. Nusrat Jahan"
            autoComplete="off"
            invalid={!!errors.name}
            {...register("name")}
          />
        </Field>

        <div className="grid grid-cols-[7rem_1fr] gap-4">
          <Field label="Age" htmlFor="p-age" error={errors.age?.message}>
            <Input
              id="p-age"
              type="number"
              inputMode="numeric"
              min={0}
              max={130}
              placeholder="34"
              invalid={!!errors.age}
              {...register("age")}
            />
          </Field>

          <Field label="Gender" error={errors.gender?.message}>
            <div role="radiogroup" aria-label="Gender" className="grid grid-cols-3 gap-2">
              {GENDERS.map((gender) => (
                <div key={gender.value}>
                  <input
                    id={`g-${gender.value}`}
                    type="radio"
                    value={gender.value}
                    className="peer sr-only"
                    {...register("gender")}
                  />
                  <label
                    htmlFor={`g-${gender.value}`}
                    className={cn(
                      "flex h-10 cursor-pointer items-center justify-center rounded-lg border bg-white text-sm font-medium text-ink-700 shadow-card transition-colors",
                      "hover:bg-ink-50 peer-checked:border-brand-600 peer-checked:bg-brand-50 peer-checked:text-brand-800 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/40",
                      errors.gender ? "border-rose-400" : "border-ink-200"
                    )}
                  >
                    {gender.label}
                  </label>
                </div>
              ))}
            </div>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone" htmlFor="p-phone" error={errors.phone?.message}>
            <Input
              id="p-phone"
              type="tel"
              placeholder="01712345678"
              invalid={!!errors.phone}
              {...register("phone")}
            />
          </Field>
          <Field label="Email (optional)" htmlFor="p-email" error={errors.email?.message}>
            <Input
              id="p-email"
              type="email"
              placeholder="name@mail.com"
              invalid={!!errors.email}
              {...register("email")}
            />
          </Field>
        </div>

        <Field label="Address (optional)" htmlFor="p-address" error={errors.address?.message}>
          <Input
            id="p-address"
            placeholder="House, road, area"
            invalid={!!errors.address}
            {...register("address")}
          />
        </Field>

        <Field label="Condition" htmlFor="p-condition" error={errors.condition?.message}>
          <Select id="p-condition" invalid={!!errors.condition} {...register("condition")}>
            {CONDITIONS.map((condition) => (
              <option key={condition.value} value={condition.value}>
                {condition.label}
              </option>
            ))}
          </Select>
        </Field>

        {lockedDoctor ? (
          <Field label="Doctor" htmlFor="p-doctor" hint="New patients are added to this doctor's list.">
            <Input
              id="p-doctor"
              value={`${lockedDoctor.name} (${lockedDoctor.specialization})`}
              readOnly
              disabled
            />
            <input type="hidden" {...register("doctorId")} />
          </Field>
        ) : (
          <Field label="Doctor" htmlFor="p-doctor" error={errors.doctorId?.message}>
            <Select
              id="p-doctor"
              invalid={!!errors.doctorId}
              disabled={doctors.isLoading}
              {...register("doctorId")}
            >
              <option value="">{doctors.isLoading ? "Loading doctors" : "Select a doctor"}</option>
              {doctors.data?.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} ({doctor.specialization})
                </option>
              ))}
            </Select>
          </Field>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t border-ink-200 bg-ink-50/60 px-6 py-4">
        <Button type="button" variant="secondary" onClick={onDone} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? "Save changes" : "Add patient"}
        </Button>
      </div>
    </form>
  );
}

/** Add (no `patient`) or edit (`patient`) in a slide-over. Pass `lockedDoctor` to add under a specific doctor. */
export default function PatientFormSheet({ open, onOpenChange, patient, lockedDoctor }) {
  const isEdit = Boolean(patient);
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit patient" : "Add patient"}
      description={
        isEdit
          ? `Update the details for ${patient.name}.`
          : lockedDoctor
            ? `Add a new patient under ${lockedDoctor.name}.`
            : "Register a new patient and assign a doctor."
      }
    >
      <PatientForm
        key={patient?._id ?? "new"}
        patient={patient}
        lockedDoctor={lockedDoctor}
        onDone={() => onOpenChange(false)}
      />
    </Sheet>
  );
}
