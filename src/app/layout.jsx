import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/figtree";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata = {
  title: { default: "Doctor Tracker", template: "%s · Doctor Tracker" },
  description: "Admin portal to manage doctors, patients and care analytics.",
};

export const viewport = { themeColor: "#0a2523" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader color="#2b9384" height={2} showSpinner={false} shadow={false} />
        <Providers>{children}</Providers>
        <Toaster position="top-right" toastOptions={{ classNames: { toast: "font-sans" } }} />
      </body>
    </html>
  );
}
