'use client';

import axios from 'axios';
import Cookies from 'js-cookie';

export const getMissingConnections = async (appletName: string): Promise<string[] | undefined> => {
  let response;

  try {
    response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/connections/${appletName}`, {
      token: Cookies.get('token'),
    });

    return response.data.missingConnections;
  } catch (error) {
    console.log('utils/getMissingConnections.ts error:', error);
  }
};
