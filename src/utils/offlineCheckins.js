const LOCAL_STORAGE_KEY = 'offline_checkins';

export const saveOfflineCheckIn = (checkInData) => {
  const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
  existing.push(checkInData);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
};

export const getOfflineCheckIns = () => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
};

export const clearOfflineCheckIns = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};
