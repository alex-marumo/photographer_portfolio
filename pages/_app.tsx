import type { AppProps } from "next/app";
import Navigation from "../components/Navigation";
import "../styles/index.css";
import { Analytics } from "@vercel/analytics/next";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navigation />
      <Component {...pageProps} />
    </>
  );
}
