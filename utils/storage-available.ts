// ----------------------------------------------------------------------

export function localStorageAvailable(): boolean {
  try {
    // Verificar si estamos en el navegador
    if (typeof window === 'undefined') {
      return false;
    }
    const key = '__some_random_key_you_are_not_going_to_use__';
    window.localStorage.setItem(key, key);
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.log('Local storage is not available.', error);
    return false;
  }
}

export function localStorageGetItem(key: string, defaultValue = ''): string | undefined {
  const storageAvailable = localStorageAvailable();

  let value;

  if (storageAvailable) {
    value = localStorage.getItem(key) || defaultValue;
  }

  return value;
}
