import { useEffect, useState } from "react";

const STORAGE_KEY = "basketball-stats-saved-pages";

function readSavedPages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to read saved pages:", error);
    return [];
  }
}

export function useSavedPages() {
  const [savedPages, setSavedPages] = useState([]);

  useEffect(() => {
    setSavedPages(readSavedPages());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPages));
    } catch (error) {
      console.error("Failed to save pages:", error);
    }
  }, [savedPages]);

  function savePage(page) {
    if (!page) return;

    const pageId =
      page.id ||
      `${page.type}-${page.name}-${Date.now()}`
        .replace(/\s+/g, "-")
        .toLowerCase();

    const pageToSave = {
      ...page,
      id: pageId,
      savedAt: new Date().toISOString(),
    };

    setSavedPages((prev) => {
      const filtered = prev.filter((item) => item.id !== pageId);
      return [pageToSave, ...filtered];
    });
  }

  function deletePage(pageId) {
    setSavedPages((prev) => prev.filter((item) => item.id !== pageId));
  }

  return {
    savedPages,
    savePage,
    deletePage,
  };
}
