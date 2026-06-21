import useSWR, { mutate } from 'swr';

const initialState = {
  isDashboardDrawerOpened: true
};

const fetcher = () => initialState;

// ==============================|| API - MENU ||============================== //

export const useGetMenuMaster = () => {
  const { data } = useSWR('menuMaster', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  return { menuMaster: data };
};

export function handlerDrawerOpen(isOpen) {
  mutate('menuMaster', (prev) => ({ ...prev, isDashboardDrawerOpened: isOpen }), false);
}
