import type { ReactNode } from "react";

import { Article } from "@/components/article/article";

export default function ReleaseNotesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Article>
        <h1>Saver app release notes</h1>
        <p>Find changes to the Saver apps and browser extensions by release date.</p>
      </Article>
      {children}
    </>
  );
}
