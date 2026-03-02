import { useState, useEffect } from 'react';
import { sanityClient } from '../lib/sanity';

export function useContent<T>(query: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await sanityClient.fetch(query);
        setData(result);
      } catch (err: any) {
        console.error("Sanity Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return { data, loading, error };
}
