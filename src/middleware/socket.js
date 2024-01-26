import { setWidget } from "../features/widget/widgetSlice";

const BOOK_ORDER_REQUEST = {
    symbol:"tBTCUSD",
    prec:"P0",
    freq:"F0",
    len:"100",
    event:"subscribe",
    subId:"book/tBTCUSD/P0",
    channel:"book"
}

const BOOK_SOCKET_URL = 'wss://api-pub.bitfinex.com/ws/2'

export const socketMiddleware = (socket) => (store) => (next) => (action) => {
    const { dispatch } = store;

    const { type, payload } = action;

    switch (type) {
        case 'socket/update':
            socket.disconnect();
        case 'socket/connect':
            if (socket.readyState === WebSocket.OPEN) {
                break;
            }

            socket.connect(BOOK_SOCKET_URL);

            const precision = payload.precision ?? "P0";

            socket.on('open', () => { socket.send({ ...BOOK_ORDER_REQUEST, prec: precision, subId:`book/tBTCUSD/${precision}`, })});
            socket.on('message', (event) => {
                const data = JSON.parse(event.data);

                if (Array.isArray(data[1])) {
                    const books = Array.isArray(data[1][0]) ? data[1] : [data[1]];

                    dispatch(setWidget(books));
                }
            })
            socket.on('close', () => {})
            socket.on('error', () => {})
            break;

        case 'socket/disconnect':
            if (socket.readyState === WebSocket.CLOSED) {
                break;
            }

            socket.disconnect();
            break;

        default:
            break
    }

    return next(action)
}
