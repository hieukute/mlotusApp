export const setConfig = (domain, database, email, password, method) => ({
  type: 'SET_CONFIGURATION',
  data: { domain, database, email, password, method }
});