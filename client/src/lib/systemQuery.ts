import { queryOptions } from "@tanstack/react-query";
import { api } from "./api";

/** Shared snapshot of supply, preorders and recipes used by every /system/* page. */
export const systemQueryOptions = queryOptions({
  queryKey: ["system-data"],
  queryFn: api.getSystem,
});

export const seasonsQueryOptions = queryOptions({
  queryKey: ["seasonal-calendar"],
  queryFn: api.getSeasons,
});
