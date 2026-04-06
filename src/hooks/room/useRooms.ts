import { getApiErrorMessage } from "@/services/apiError";
import {
  getRooms,
  getRoomsCount,
  PagingMeta,
  RoomCountData,
  RoomItem,
  RoomStatus,
} from "@/services/room.api";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_COUNTS: RoomCountData = {
  AVAILABLE: 0,
  FULL: 0,
  MAINTENANCE: 0,
  Total: 0,
};

const DEFAULT_META: PagingMeta = {
  totalItems: 0,
  pageSize: 20,
  currentPage: 1,
  totalPages: 0,
  hasPrevious: false,
  hasNext: false,
};

const PAGE_SIZE = 20;

type RefetchOptions = {
  refreshing?: boolean;
  silent?: boolean;
};

export function useRooms() {
  const [items, setItems] = useState<RoomItem[]>([]);
  const [counts, setCounts] = useState<RoomCountData>(DEFAULT_COUNTS);
  const [meta, setMeta] = useState<PagingMeta>(DEFAULT_META);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<RoomStatus | "">("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [countLoading, setCountLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef(0);
  const initializedRef = useRef(false);

  const fetchCounts = useCallback(async () => {
    try {
      setCountLoading(true);
      const data = await getRoomsCount();
      setCounts(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setCountLoading(false);
    }
  }, []);

  const fetchPage = useCallback(
    async (
      page: number,
      opts?: {
        refresh?: boolean;
        append?: boolean;
        silent?: boolean;
      },
    ) => {
      const requestId = ++requestIdRef.current;

      try {
        if (opts?.refresh) {
          setRefreshing(true);
        } else if (opts?.append) {
          setLoadingMore(true);
        } else if (!initializedRef.current) {
          setLoading(true);
        } else if (!opts?.silent) {
          setFiltering(true);
        }

        setError(null);

        const res = await getRooms({
          Search: search.trim() || undefined,
          RoomStatus: status || undefined,
          Page: page,
          PageSize: PAGE_SIZE,
        });

        if (requestId !== requestIdRef.current) return;

        setMeta(res.meta);

        setItems((prev) => {
          if (opts?.append) {
            const merged = [...prev, ...res.items];
            const map = new Map(merged.map((item) => [item.id, item]));
            return Array.from(map.values());
          }
          return res.items;
        });

        initializedRef.current = true;
      } catch (err) {
        if (requestId !== requestIdRef.current) return;
        setError(getApiErrorMessage(err));
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setRefreshing(false);
          setLoadingMore(false);
          setFiltering(false);
        }
      }
    },
    [search, status],
  );

  const refetch = useCallback(
    async (opts?: RefetchOptions) => {
      if (opts?.refreshing) {
        await Promise.all([fetchCounts(), fetchPage(1, { refresh: true })]);
        return;
      }

      if (opts?.silent) {
        await Promise.all([fetchCounts(), fetchPage(1, { silent: true })]);
        return;
      }

      await Promise.all([fetchCounts(), fetchPage(1)]);
    },
    [fetchCounts, fetchPage],
  );

  const loadMore = useCallback(async () => {
    if (loading || refreshing || loadingMore || filtering) return;
    if (!meta.hasNext) return;

    await fetchPage(meta.currentPage + 1, { append: true });
  }, [
    fetchPage,
    loading,
    refreshing,
    loadingMore,
    filtering,
    meta.hasNext,
    meta.currentPage,
  ]);

  useEffect(() => {
    void fetchCounts();
  }, [fetchCounts]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void fetchPage(1, { silent: initializedRef.current });
    }, 250);

    return () => clearTimeout(timeout);
  }, [fetchPage]);

  const totalForSelectedTab =
    status === ""
      ? counts.Total
      : status === "AVAILABLE"
        ? counts.AVAILABLE
        : status === "FULL"
          ? counts.FULL
          : counts.MAINTENANCE;

  const hasAnyFilter = !!search.trim() || !!status;

  return {
    items,
    counts,
    meta,
    search,
    status,
    loading,
    refreshing,
    loadingMore,
    countLoading,
    filtering,
    error,
    totalForSelectedTab,
    hasAnyFilter,
    setSearch,
    setStatus,
    refetch,
    loadMore,
  };
}
