"use client";

import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useDeletePatient } from "@/lib/queries";
import { errorMessage } from "@/lib/utils";

export default function DeletePatientDialog({ patient, open, onOpenChange }) {
  const remove = useDeletePatient();

  async function confirm() {
    try {
      await remove.mutateAsync(patient._id);
      toast.success("Patient deleted");
      onOpenChange(false);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Delete ${patient?.name ?? "this patient"}?`}
      description={`This removes the patient${patient?.doctor ? ` from ${patient.doctor.name}'s list` : ""}. The record is archived, not erased, so it can be restored by a developer if needed.`}
      confirmLabel="Delete patient"
      loading={remove.isPending}
      onConfirm={confirm}
    />
  );
}
