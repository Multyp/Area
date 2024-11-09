'use client';

import { AppletInfo } from '@/types/applet';
import Cookies from 'js-cookie';
import axios from 'axios';

export const disableApplet = async (appletName: string): Promise<void> => {
  let response;

  try {
    response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/applets/${appletName}/disable`, {
      token: Cookies.get('token'),
    });
  } catch (error) {
    console.log('utils/disableApplet.ts error:', error);
  }
};
