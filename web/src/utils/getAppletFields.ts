'use client';

import { AppletInfo } from '@/types/applet';
import Cookies from 'js-cookie';
import axios from 'axios';

export const getAppletInfos = async (appletName: string): Promise<AppletInfo | undefined> => {
  let response;

  try {
    response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/applets/${appletName}`, {
      token: Cookies.get('token'),
    });

    return response.data;
  } catch (error) {
    console.log('utils/getAppletFields.ts error:', error);
  }
};
