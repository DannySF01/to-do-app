import { useEffect, useState } from "react";

interface StorageUsage {
  bytes: number;
  formatted: string;
  loading: boolean;
  isEstimate: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Estimate Fallback
function estimateLocalStorageBytes(): number {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    const value = localStorage.getItem(key) ?? "";
    total += (key.length + value.length) * 2;
  }
  return total;
}

export function useStorageUsage(): StorageUsage {
  const [bytes, setBytes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEstimate, setIsEstimate] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function calculate() {
      if ("storage" in navigator && "estimate" in navigator.storage) {
        try {
          const estimate = await navigator.storage.estimate();
          if (!cancelled && estimate.usage !== undefined) {
            setBytes(estimate.usage);
            setIsEstimate(false);
            setLoading(false);
            return;
          }
        } catch {}
      }

      // Fallback: not supported
      if (!cancelled) {
        setBytes(estimateLocalStorageBytes());
        setIsEstimate(true);
        setLoading(false);
      }
    }

    calculate();
    return () => {
      cancelled = true;
    };
  }, []);

  return { bytes, formatted: formatBytes(bytes), loading, isEstimate };
}
