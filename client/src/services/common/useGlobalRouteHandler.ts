import { useLocation, useNavigate } from "react-router-dom";

const getUrlQueries = (searchParams: URLSearchParams) => {
  const result: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    result[key] = value;
  });

  return result;
};

export default function useGlobalRoutesHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;

  const searchParams = new URLSearchParams(location.search);

  const urlQueries = getUrlQueries(searchParams);

  const navigateTo = ({
    remove = "",
    to = {},
    url,
    replace = false,
  }: {
    remove?: string | string[];
    to?: Record<string, string | number | undefined>;
    url?: string;
    replace?: boolean;
  }) => {
    const params = new URLSearchParams(location.search);

    // Remove params
    if (Array.isArray(remove)) {
      remove.forEach((key) => params.delete(key));
    } else if (remove) {
      params.delete(remove);
    }

    // Add/update params
    Object.entries(to).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    const queryString = params.toString();

    const finalUrl = `${url || pathname}${
      queryString ? `?${queryString}` : ""
    }`;

    navigate(finalUrl, {
      replace,
    });
  };

  const navigateUrl = (url: string) => {
    if (!url) return;

    navigate(url);
  };

  const activeRoutes = pathname.split("/");

  const subRoute = activeRoutes[activeRoutes.length - 1];

  return {
    activeRoutes,
    subRoute,
    pathname,
    urlQueries,
    navigateTo,
    navigate: navigateUrl,
  };
}