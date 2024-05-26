import { createContext } from "react";

export const ChildContext = createContext<{
  child: { len: number };
  updateChild: ({ len }) => void;
}>({
  child: { len: 0 },
  updateChild: () => {}
});
