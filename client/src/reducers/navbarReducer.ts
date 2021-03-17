const initialState = {
  searchPhrase: "",
  eventType: "All",
  isLoggedIn: false,
};

const navbarReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SEARCH":
      return { ...state, searchPhrase: action.payload };
    case "SETTYPE":
      return { ...state, eventType: action.payload };
    case "ISLOGGEDIN":
      return { ...state, isLoggedIn: action.payload };
    default:
      return state;
  }
};

export default navbarReducer;
