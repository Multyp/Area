'use client';
import axios from 'axios';
import useToken from './useToken';
import { useQuery } from '@tanstack/react-query';

export default function useUser() {
  const token = useToken();

  if (!token) {
    return null;
  }

  const { data, error } = useQuery({
    queryKey: ['user', token],
    queryFn: async () => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile`, {
        token: token,
      });
      return response.data;
    },
  });

  if (error) {
    console.error('Error fetching user:', error);
  }

  return data;
}
