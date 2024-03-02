const initialState = {
    domain: null,
    database: null,
    email: null,
    password: null,
    method: null
  };
  
  const ConfigReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_CONFIGURATION':
        return {
          ...state,
          domain: action.data.domain,
          database: action.data.database,
          email: action.data.email,
          password: action.data.password,
          method: action.data.method,
        };
      default:
        return state;
    }
  };
  
  export default ConfigReducer;