export function saveToken(token) {
  localStorage.setItem("cc_token", token);
}

export function logout() {
  localStorage.removeItem("cc_token");
  window.location.href = "/login";
}
