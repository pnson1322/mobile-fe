type Listener = () => void;

const listeners = new Set<Listener>();

export function subscribeRoomListRefresh(listener: Listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function emitRoomListRefresh() {
  listeners.forEach((listener) => {
    listener();
  });
}
