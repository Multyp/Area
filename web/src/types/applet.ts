export type AppletField = {
  name: string;
  title: string;
};

export type AppletInfo = {
  title: string;
  description: string;
  fields: AppletField[];
  isEnabled: boolean;
};
