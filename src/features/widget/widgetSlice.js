import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
    bids: [],
    asks: [],
}

const widgetSlice = createSlice({
    name: 'widget',
    initialState,
    reducers: {
        setWidget(state, { payload = [] }) {
            const [payloadBids, payloadAsks] = payload.reduce((acc, data) => {
                const [price, count, amount] = data;

                if (!count) {
                    return acc;
                }

                const book = { price, count, amount: Math.abs(amount), total: 0 };
                const arrIndex = amount > 0 ? 0 : 1;

                acc[arrIndex].push(book);

                return acc;
            }, [[], []]);

            const { bids, asks } = current(state);

            state.bids = getFormattedBooks(payloadBids, bids, false);
            state.asks = getFormattedBooks(payloadAsks, asks);
            },
    }
});

function getFormattedBooks(newBooks, oldBooks, sortDesc = true) {
    const outdatedBooks = {};

    oldBooks.forEach((book) => {
        outdatedBooks[book.price] = false;
    });

    newBooks.forEach((book) => {
        if (outdatedBooks.hasOwnProperty(book.price)) {
            outdatedBooks[book.price] = true;
        }
    });

    oldBooks.forEach((data) => {
        if (!outdatedBooks[data.price]) {
            newBooks.push({ ...data });
        }
    });

    const books = newBooks
        .sort((a, b) => a.price > b.price ? Number(!sortDesc) : Number(sortDesc))
        .slice(0, 11)

    return updateTotal(books);
}

function updateTotal(books) {
    let runningTotal = 0;

    return books.map((book) => {
        runningTotal += book.amount;

        return{ ...book, total: runningTotal }
    });
}

export const { setWidget } = widgetSlice.actions;

export default widgetSlice.reducer;
