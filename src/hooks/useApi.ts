import { useMemo } from 'react';
import { useMsal } from '@azure/msal-react';
import { ApiClient } from '@/lib/api';

export function useApi() {
  const { instance } = useMsal();

  const apiClient = useMemo(() => {
    return new ApiClient(instance);
  }, [instance]);

  return apiClient;
} 