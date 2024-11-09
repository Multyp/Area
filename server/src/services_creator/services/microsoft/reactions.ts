import { ActionData } from '../../../types/action_data';
import { OutputParams, ServiceReaction } from '../../../types/service_reaction';
import axios from 'axios';
import { pool } from '../../../utils/db';

async function sendEmail(accessToken: string, recipientEmail: string, subject: string, message: string) {
  const emailContent = {
    message: {
      subject: subject,
      body: {
        contentType: 'Text',
        content: message,
      },
      toRecipients: [
        {
          emailAddress: {
            address: recipientEmail,
          },
        },
      ],
    },
    saveToSentItems: 'true',
  };

  try {
    const response = await axios.post('https://graph.microsoft.com/v1.0/me/sendMail', emailContent, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Email sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export const serviceReactions: ServiceReaction[] = [
  {
    name: 'send_email',
    description: 'Send an email to the selected user',
    required_fields: ['email_address', 'message'],

    handleReaction: async (_: ActionData, { email_address, message }: OutputParams, provided_user: any): Promise<void> => {
      let client;

      try {
        client = await pool.connect();

        await sendEmail(provided_user.account_token, email_address, 'Test Email', message);
      } catch (error) {
        console.error(error);
      } finally {
        client?.release();
      }
    },
  },
];
