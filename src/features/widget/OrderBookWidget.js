import React, { useEffect, useState } from 'react';
import styles from './OrderBookWidget.module.css';
import { useDispatch, useSelector } from "react-redux";
import { useThrottle } from "@uidotdev/usehooks";

const PRECISIONS = ['P0', 'P1', 'P2', 'P3', 'P4'];

const OrderBookWidget = () => {
    const widgetData = useSelector((state) => state.widget)
    const { asks, bids } = useThrottle(widgetData, 500);
    const [isCollapsed, setCollapsed] = useState(false);
    const [precision, setPrecision] = useState(0);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: 'socket/connect', payload: { precision: PRECISIONS[precision] } })

        return () => {
            dispatch({ type: 'socket/disconnect' })
        }
    }, [dispatch]);

    function updatePrecision(decrease = true) {
        const newPrecision = decrease ? precision - 1 : precision + 1;

        if (PRECISIONS[newPrecision]) {
            setPrecision(newPrecision);

            console.log('PRECISIONS', PRECISIONS[newPrecision])

            dispatch({ type: 'socket/update', payload: { precision: PRECISIONS[newPrecision] } })
        }
    }

    const toggleCollapse = () => {
        setCollapsed(!isCollapsed);
    };

    return (
        <div className={styles.widget}>
            <div className={styles.widget_header}>
                <div className={styles.widget_title} onClick={toggleCollapse}>
                    <i className={`${styles.arrow} ${isCollapsed ? styles.arrow_right : ''}`}></i>

                    <h2>Book Order Widget</h2>
                </div>

                <div className={styles.buttons}>
                    <button onClick={() => updatePrecision()}>-Precision</button>
                    <button onClick={() => updatePrecision(false)}>+Precision</button>
                </div>

                <div>
                    Current precision: { PRECISIONS[precision] }
                </div>
            </div>
            <div className={`${styles.content} ${isCollapsed ? styles.collapsed : ''}`}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th className={styles.rightAlign}>COUNT</th>
                        <th>AMOUNT</th>
                        <th>TOTAL</th>
                        <th>PRICE</th>
                    </tr>
                    </thead>
                    <tbody>

                    { asks.map(ask =>
                        <tr key={ask.price}>
                            <td className={styles.rightAlign}>{ ask.count }</td>
                            <td>{ ask.amount }</td>
                            <td>{ ask.total }</td>
                            <td>{ ask.price }</td>
                        </tr>) }
                    </tbody>
                </table>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th className={styles.rightAlign}>COUNT</th>
                        <th>AMOUNT</th>
                        <th>TOTAL</th>
                        <th>PRICE</th>
                    </tr>
                    </thead>
                    <tbody>
                    { bids.map(bid =>
                        <tr key={bid.price}>
                            <td className={styles.rightAlign}>{ bid.count }</td>
                            <td>{ bid.amount }</td>
                            <td>{ bid.total }</td>
                            <td>{ bid.price }</td>
                        </tr>) }
                    </tbody>
                </table>
            </div>

            <div className={styles.buttons}>
                <button onClick={() => dispatch({ type: 'socket/connect', payload: { precision: PRECISIONS[precision] } })}>Connect</button>
                <button onClick={() =>  dispatch({ type: 'socket/disconnect' })}>Disconnect</button>
            </div>
        </div>
    );
};

export default OrderBookWidget;