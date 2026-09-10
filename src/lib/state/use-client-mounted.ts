import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getClient = () => true;
const getServer = () => false;

export function useClientMounted(): boolean {
  return useSyncExternalStore(subscribe, getClient, getServer);
}
