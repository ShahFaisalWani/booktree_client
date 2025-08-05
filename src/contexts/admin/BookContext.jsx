import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import LoadingScreen from "../../components/Loading/LoadingScreen";

export const BookContext = createContext();

export function useBookContext() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBookContext must be used within a BookProvider");
  }
  return context;
}

export default function BookProvider({ children }) {
  const queryClient = useQueryClient();

  // Persistent state (survives page navigation)
  const [supplier, setSupplier] = useState(() => {
    const saved = localStorage.getItem("selectedBookSupplier");
    return saved ? JSON.parse(saved) : "";
  });

  const [item, setItem] = useState(() => {
    return localStorage.getItem("selectedItemType") || "book";
  });

  // Form state (resets on form close)
  const [method, setMethod] = useState("");
  const [publisher, setPublisher] = useState("");
  const [coverImg, setCoverImg] = useState("");
  const [genre, setGenre] = useState("");

  // Fetch suppliers with caching
  const fetchSuppliers = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASEURL}/book/suppliers`
    );
    return res.data;
  };

  // Fetch genres with caching
  const fetchGenres = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASEURL}/book/genres`
    );
    return res.data;
  };

  // Fetch publishers by supplier with enhanced caching
  const fetchPublishersBySupplier = async (supplierName) => {
    if (!supplierName || supplierName === "All") return [];

    const res = await axios.get(
      `${
        import.meta.env.VITE_API_BASEURL
      }/publisher/getall?supplier_name=${supplierName}`
    );
    return res.data;
  };

  // Suppliers query
  const {
    data: suppliers = [],
    isLoading: isLoadingSuppliers,
    isError: isErrorSuppliers,
  } = useQuery(["suppliers"], fetchSuppliers, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Genres query
  const {
    data: genres = [],
    isLoading: isLoadingGenres,
    isError: isErrorGenres,
  } = useQuery(["genres"], fetchGenres, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Publishers query with caching by supplier
  const {
    data: publishers = [],
    isLoading: isLoadingPublishers,
    isError: isErrorPublishers,
  } = useQuery(
    ["publishers", supplier?.supplier_name],
    () => fetchPublishersBySupplier(supplier?.supplier_name),
    {
      enabled: !!supplier?.supplier_name && supplier.supplier_name !== "All",
      refetchOnWindowFocus: false,
      staleTime: 3 * 60 * 1000, // 3 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Persist supplier selection
  useEffect(() => {
    if (supplier) {
      localStorage.setItem("selectedBookSupplier", JSON.stringify(supplier));
    }
  }, [supplier]);

  // Persist item type selection
  useEffect(() => {
    if (item) {
      localStorage.setItem("selectedItemType", item);
    }
  }, [item]);

  // Reset publisher when supplier changes
  useEffect(() => {
    if (supplier?.supplier_name) {
      setPublisher("");
    }
  }, [supplier]);

  // Utility functions to reset state
  const resetFormState = useCallback(() => {
    setGenre("");
    setPublisher("");
    setCoverImg("");
  }, []);

  const resetSupplierState = useCallback(() => {
    setSupplier("");
    localStorage.removeItem("selectedBookSupplier");
    resetFormState();
  }, [resetFormState]);

  // Function to prefetch publishers for a supplier
  const prefetchPublishers = useCallback(
    (supplierName) => {
      if (supplierName && supplierName !== "All") {
        queryClient.prefetchQuery(
          ["publishers", supplierName],
          () => fetchPublishersBySupplier(supplierName),
          {
            staleTime: 3 * 60 * 1000,
          }
        );
      }
    },
    [queryClient]
  );

  // Function to get cached publishers for a specific supplier
  const getCachedPublishers = useCallback(
    (supplierName) => {
      if (!supplierName || supplierName === "All") return [];
      return queryClient.getQueryData(["publishers", supplierName]) || [];
    },
    [queryClient]
  );

  // Function to get cached books for a specific supplier
  const getCachedBooks = useCallback(
    (supplierQuery) => {
      return queryClient.getQueryData(["books table", supplierQuery]) || [];
    },
    [queryClient]
  );

  // Function to prefetch books for a supplier
  const prefetchBooks = useCallback(
    async (supplierQuery) => {
      const url = `/book/getall${
        supplierQuery && supplierQuery.supplier_name
          ? "?supplier_name=" + encodeURIComponent(supplierQuery.supplier_name)
          : ""
      }`;

      return queryClient.prefetchQuery(
        ["books table", supplierQuery],
        async () => {
          const res = await axios.get(import.meta.env.VITE_API_BASEURL + url);
          return res.data;
        },
        {
          staleTime: 2 * 60 * 1000, // 2 minutes
          cacheTime: 10 * 60 * 1000, // 10 minutes
        }
      );
    },
    [queryClient]
  );

  // Function to invalidate books cache
  const invalidateBooksCache = useCallback(() => {
    queryClient.invalidateQueries(["books table"]);
  }, [queryClient]);

  if (isLoadingSuppliers || isLoadingGenres) {
    return <LoadingScreen />;
  }

  const contextValue = {
    // State
    method,
    setMethod,
    supplier,
    setSupplier,
    publisher,
    setPublisher,
    coverImg,
    setCoverImg,
    genre,
    setGenre,
    item,
    setItem,

    // Data
    suppliers,
    genres,
    publishers,

    // Loading states
    isLoadingPublishers,
    isLoadingSuppliers,
    isLoadingGenres,

    // Error states
    isErrorSuppliers,
    isErrorGenres,
    isErrorPublishers,

    // Utility functions
    resetFormState,
    resetSupplierState,
    prefetchPublishers,
    getCachedPublishers,
    getCachedBooks,
    prefetchBooks,
    invalidateBooksCache,

    // Query client for advanced operations
    queryClient,
  };

  return (
    <BookContext.Provider value={contextValue}>{children}</BookContext.Provider>
  );
}
