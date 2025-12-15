// const API = "http://localhost:5000/api/chats";

// export const fetchChats = (userId) =>
//   fetch(`${API}/${userId}`).then((r) => r.json());

// export const createChat = (userId) =>
//   fetch(API, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ userId }),
//   }).then((r) => r.json());

// export const addMessage = (chatId, text, from) =>
//   fetch(`${API}/message/${chatId}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ text, from }),
//   }).then((r) => r.json());

// export const renameChat = (id, title) =>
//   fetch(`${API}/rename/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ title }),
//   });

// export const deleteChat = (id) =>
//   fetch(`${API}/${id}`, { method: "DELETE" });
