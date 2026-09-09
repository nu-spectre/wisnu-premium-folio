import { queryOptions } from "@tanstack/react-query";
import { getProjectBySlug, getSiteData, listPublishedProjects } from "./portfolio.functions";

export const siteQuery = queryOptions({
  queryKey: ["site"],
  queryFn: () => getSiteData(),
  staleTime: 30_000,
});

export const projectsQuery = queryOptions({
  queryKey: ["projects", "published"],
  queryFn: () => listPublishedProjects(),
  staleTime: 30_000,
});

export const projectQuery = (slug: string) =>
  queryOptions({
    queryKey: ["project", slug],
    queryFn: () => getProjectBySlug({ data: { slug } }),
    staleTime: 30_000,
  });
