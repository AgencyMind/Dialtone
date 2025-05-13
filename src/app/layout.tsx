import { Metadata } from "next";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Providers from "./providers";
import LayoutWrapper from "./LayoutWrapper";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dialtone.club"),
  title: "Dialtone",
  robots: {
    googleBot: {
      index: true,
      follow: true,
    },
  },
  description:
    "A shortform self-publishing app. Building on Livepeer, Lens, Farcaster, Bluesky & custom agents for mirror inference.",

  twitter: {
    card: "summary_large_image",
    title: "Dialtone",
    description:
      "A shortform self-publishing app. Building on Livepeer, Lens, Farcaster, Bluesky & custom agents for mirror inference.",
    images: ["https://www.dialtone.club/card.png/"],
  },

  openGraph: {
    title: "Dialtone",
    description:
      "A shortform self-publishing app. Building on Livepeer, Lens, Farcaster, Bluesky & custom agents for mirror inference.",
    images: "https://www.dialtone.club/cover.png/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
