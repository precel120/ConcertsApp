import prod from "./prod";
import dev from "./dev";

export const env = process.env.NODE_ENV === "production" ? prod : dev;
