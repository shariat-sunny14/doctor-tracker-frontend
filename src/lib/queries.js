"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./api";

/** Drop empty values so URLs and query keys stay clean. */
const clean = (params = {}) =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null));
const get = (url, params) => api.get(url, { params: clean(params) }).then((res) => res.data);

// ---- queries -----------------------------------------------------------------------------------------
export const useSession = () =>
  useQuery({
    queryKey: ["session"],
    queryFn: () => get("/auth/me").then((res) => res.data.admin),
    staleTime: 5 * 60_000,
    retry: false,
  });

export const useDashboard = (range) =>
  useQuery({
    queryKey: ["dashboard", range],
    queryFn: () => get("/dashboard/overview", { range }).then((res) => res.data),
    placeholderData: keepPreviousData,
  });

export const useDoctors = (params) =>
  useQuery({
    queryKey: ["doctors", clean(params)],
    queryFn: () => get("/doctors", params),
    placeholderData: keepPreviousData, // keep showing the old page while the next one loads
  });

export const useDoctor = (id) =>
  useQuery({ queryKey: ["doctor", id], queryFn: () => get(`/doctors/${id}`).then((res) => res.data) });

export const useDoctorMeta = () =>
  useQuery({
    queryKey: ["doctor-meta"],
    queryFn: () => get("/doctors/meta").then((res) => res.data),
    staleTime: 5 * 60_000,
  });

export const useDoctorOptions = () =>
  useQuery({
    queryKey: ["doctor-options"],
    queryFn: () => get("/doctors/options").then((res) => res.data),
    staleTime: 5 * 60_000,
  });

export const useDoctorPatients = (doctorId, params) =>
  useQuery({
    queryKey: ["doctor-patients", doctorId, clean(params)],
    queryFn: () => get(`/doctors/${doctorId}/patients`, params),
    placeholderData: keepPreviousData,
  });

export const usePatients = (params) =>
  useQuery({
    queryKey: ["patients", clean(params)],
    queryFn: () => get("/patients", params),
    placeholderData: keepPreviousData,
  });

// ---- mutations ---------------------------------------------------------------------------------------
function useRefresh() {
  const queryClient = useQueryClient();
  return (...keys) => Promise.all(keys.map((key) => queryClient.invalidateQueries({ queryKey: [key] })));
}

export function useCreateDoctor() {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: (body) => api.post("/doctors", body).then((res) => res.data.data),
    onSuccess: () => refresh("doctors", "doctor-meta", "doctor-options", "dashboard"),
  });
}

const refreshPatientViews = (refresh) =>
  refresh("patients", "doctor-patients", "doctor", "doctors", "dashboard");

/** Creates under a doctor when `lockedDoctorId` is set (POST /doctors/:id/patients), otherwise POST /patients. */
export function useCreatePatient() {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: ({ body, lockedDoctorId }) => {
      if (lockedDoctorId) {
        const { doctorId, ...rest } = body; // eslint-disable-line no-unused-vars
        return api.post(`/doctors/${lockedDoctorId}/patients`, rest).then((res) => res.data.data);
      }
      return api.post("/patients", body).then((res) => res.data.data);
    },
    onSuccess: () => refreshPatientViews(refresh),
  });
}

export function useUpdatePatient() {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: ({ id, body }) => api.patch(`/patients/${id}`, body).then((res) => res.data.data),
    onSuccess: () => refreshPatientViews(refresh),
  });
}

export function useDeletePatient() {
  const refresh = useRefresh();
  return useMutation({
    mutationFn: (id) => api.delete(`/patients/${id}`),
    onSuccess: () => refreshPatientViews(refresh),
  });
}
