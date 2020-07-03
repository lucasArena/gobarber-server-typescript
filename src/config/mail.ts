interface IMailConfig {
  driver: 'ethereal' | 'SES';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      email: 'webmaster@lucasarenasantos.com',
      name: 'Lucas Arena',
    },
  },
} as IMailConfig;
