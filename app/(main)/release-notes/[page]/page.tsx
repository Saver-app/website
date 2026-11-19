import { ReleaseNote } from "@/components/release_note/release_note";
import { ReleaseNotesPagination } from "@/components/release_notes_pagination/release_notes_pagination";
import { MAX_RELEASE_NOTES_PER_PAGE } from "@/constants";
import {
  readReleaseNotesPage,
  readTotalReleaseNotesPageCount,
} from "@/lib/release_notes_helpers";
import { createPageMetadata } from "@/lib/site_metadata";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  const isFirstPage = page === "1";

  return createPageMetadata({
    title: isFirstPage
      ? "Release Notes | Saver"
      : `Release Notes: Page ${page} | Saver`,
    description: "See what is new, improved, and fixed in Saver.",
    /*
      Page 1 shows the same notes as /release-notes, so it names that page as
      the one to index instead of competing with it.
    */
    path: isFirstPage ? "/release-notes" : `/release-notes/${page}`,
  });
}

export default async function ReleaseNotesPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const totalPageCount = await readTotalReleaseNotesPageCount(
    MAX_RELEASE_NOTES_PER_PAGE,
  );
  const notes = await readReleaseNotesPage(
    Number(page),
    MAX_RELEASE_NOTES_PER_PAGE,
  );

  return (
    <>
      {notes.map((note) => (
        <ReleaseNote
          key={note.slug}
          title={note.title}
          publishDate={note.publishDate}
          content={<note.content />}
        />
      ))}

      {totalPageCount > 1 && (
        <ReleaseNotesPagination
          currentPage={Number(page)}
          totalPageCount={totalPageCount}
        />
      )}
    </>
  );
}

export async function generateStaticParams() {
  const totalPageCount = await readTotalReleaseNotesPageCount(
    MAX_RELEASE_NOTES_PER_PAGE,
  );

  return Array.from({
    length: totalPageCount,
  }).map((_, index) => ({
    page: String(index + 1),
  }));
}

export const dynamicParams = false;
