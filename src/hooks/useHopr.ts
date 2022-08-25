import { useState } from "react";
import { Settings } from "../types";
import useWebsocket from "./useWebsocket";

export const useHopr = (settings: Settings) => {
  const websocket = useWebsocket(settings)

  return {

  }
};

export default useHopr;