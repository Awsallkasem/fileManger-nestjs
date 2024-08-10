


export default (): {} => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  session: {
    secret: process.env.SESSION_SECRET || 'my-secret',
    resave: process.env.SESSION_RESAVE === 'true' || false,
    saveUninitialized: process.env.SESSION_SAVE_UNINITIALIZED === 'true' || false,


  }
});
