const EVENT_NAME = "keydown";

export function useKeyboard() {
    const listeners = [];

    function addListener(listener) {
        listeners.push(listener);
        window.addEventListener(EVENT_NAME, listener);
    }

    function removeAllListeners() {
        listeners.forEach((listener) => {
            window.removeEventListener(EVENT_NAME, listener);
        });
    }

    return { addListener, removeAllListeners };
}