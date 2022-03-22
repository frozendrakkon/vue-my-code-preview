export function getToken(name) {
  const token = localStorage.getItem(name);

  return token || null;
}

export function setToken(name, value) {
  localStorage.setItem(name, value);
}

export function removeToken(name) {
  localStorage.removeItem(name);
}
