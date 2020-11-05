const initialState = {
    searchPhrase: "",
    eventType: "All"
};

const navbarReducer = (state = initialState, action: any) => {
    switch(action.type) {
        case 'SEARCH':
            return { ...state, searchPhrase: action.payload };
        case 'SETTYPE':
            return { ...state, eventType: action.payload };
        default:
            return state;
    }
}

export default navbarReducer;
