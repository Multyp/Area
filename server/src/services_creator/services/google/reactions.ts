import { ActionData } from '../../../types/action_data';
import { OutputParams, ServiceReaction } from '../../../types/service_reaction';
import { google } from 'googleapis';
import { pool } from '../../../utils/db';

async function sendEmail(
  oauthToken: string,
  providedId: string,
  clientId: string,
  clientSecret: string,
  recipientEmail: string,
  message: string
) {
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ access_token: oauthToken });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  const emailContent =
    `To: ${recipientEmail}\r\n` + `Subject: Test Email\r\n` + `Content-Type: text/plain; charset=utf-8\r\n` + `\r\n` + message;

  const base64EncodedEmail = Buffer.from(emailContent).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  try {
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: base64EncodedEmail,
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

    handleReaction: async (action_data: ActionData, { email_address, message }: OutputParams, provided_user: any): Promise<void> => {
      let client;

      try {
        client = await pool.connect();

        await sendEmail(
          provided_user.account_token,
          provided_user.account_id,
          process.env.GOOGLE_CLIENT_ID as string,
          process.env.GOOGLE_CLIENT_SECRET as string,
          email_address,
          message
        );
      } catch (error) {
        console.error(error);
      } finally {
        client?.release();
      }
    },
  },
];
