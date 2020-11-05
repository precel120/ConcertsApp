export const search = (value: string) => {
    return {
        type: "SEARCH",
        payload: value.trim(),
    }
};

export const setEventType = (value: string) => {
    return {
        type: "SETTYPE",
        payload: value
    }
}