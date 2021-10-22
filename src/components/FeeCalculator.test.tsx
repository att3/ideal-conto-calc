import { render, screen } from '@testing-library/react';
import App from '../App';
import { getDeliveryFee } from './FeeCalculator';
import { ITotalDeliveryFee } from '../interfaces/ITotalDeliveryFee';

const RANDOM_DATETIME = new Date(Date.UTC(2018, 11, 1, 0, 0, 0));
const RUSH_HOUR_DATETIME = new Date(Date.UTC(2021, 10, 12, 16, 0, 0));
const MAX_FEE = 15;
const BASE_FEE = 1;
test('renders App', () => {
    render(<App />);
    const title = screen.getByText(/Delivery Fee Calculator/i);
    expect(title).toBeInTheDocument();

    const container = document.querySelector('.calculatorContainer');
    expect(container?.querySelector("#deliveryDistance")).toBeInTheDocument();
    expect(container?.querySelector("#deliveryItemsAmount")).toBeInTheDocument();
    expect(container?.querySelector("#deliveryDateTime")).toBeInTheDocument();
    expect(container?.querySelector("#calculateButton")).toBeInTheDocument();
    expect(container?.querySelector(".deliveryPrice")).toBeInTheDocument();
});

test('distance fee', () => {
    let deliveryObject = {
        cartValue: 10,
        distance: 100,
        amountOfItems: 1,
        dateTime: RANDOM_DATETIME
    } as ITotalDeliveryFee;
    expect(getDeliveryFee(deliveryObject)).toBe(BASE_FEE);
    deliveryObject.distance = 1000;
    expect(getDeliveryFee(deliveryObject)).toBe(2);
    deliveryObject.distance = 1499;
    expect(getDeliveryFee(deliveryObject)).toBe(3);
    deliveryObject.distance = 1500;
    expect(getDeliveryFee(deliveryObject)).toBe(3);
    deliveryObject.distance = 1501;
    expect(getDeliveryFee(deliveryObject)).toBe(4);
    deliveryObject.distance = 2001;
    expect(getDeliveryFee(deliveryObject)).toBe(5);
    deliveryObject.distance = 15001;
    expect(getDeliveryFee(deliveryObject)).toBe(MAX_FEE);
    deliveryObject.distance = 150010;
    expect(getDeliveryFee(deliveryObject)).toBe(MAX_FEE);
    deliveryObject.distance = -150010;
    expect(getDeliveryFee(deliveryObject)).toBe(0);
});

test('small order surcharge fee', () => {
    let deliveryObject = {
        cartValue: 50,
        distance: 100,
        amountOfItems: 1,
        dateTime: RANDOM_DATETIME
    } as ITotalDeliveryFee;

    const limitForFee = 10;
    expect(getDeliveryFee(deliveryObject)).toBe(BASE_FEE);

    deliveryObject.cartValue = 8.9;
    expect(getDeliveryFee(deliveryObject)).toBe(Math.round((limitForFee - deliveryObject.cartValue + BASE_FEE) * 100) / 100);
    deliveryObject.cartValue = 9;
    expect(getDeliveryFee(deliveryObject)).toBe(Math.round((limitForFee - deliveryObject.cartValue + BASE_FEE) * 100) / 100);
    deliveryObject.cartValue = 8;
    expect(getDeliveryFee(deliveryObject)).toBe(Math.round((limitForFee - deliveryObject.cartValue + BASE_FEE) * 100) / 100);
    deliveryObject.cartValue = 1.1;
    expect(getDeliveryFee(deliveryObject)).toBe(Math.round((limitForFee - deliveryObject.cartValue + BASE_FEE) * 100) / 100);
    deliveryObject.cartValue = -1.1;
    expect(getDeliveryFee(deliveryObject)).toBe(0);

    // very large order = delivery free
    deliveryObject.cartValue = 100;
    expect(getDeliveryFee(deliveryObject)).toBe(0);
});

test('amount of items surcharge', () => {
    let deliveryObject = {
        cartValue: 50,
        distance: 100,
        amountOfItems: 1,
        dateTime: RANDOM_DATETIME
    } as ITotalDeliveryFee;

    const feePerItem = 0.5;
    const feeAddedAfterItemsCount = 4
    expect(getDeliveryFee(deliveryObject)).toBe(BASE_FEE);
    deliveryObject.amountOfItems = 4;
    expect(getDeliveryFee(deliveryObject)).toBe(Math.round((deliveryObject.amountOfItems * feePerItem + BASE_FEE - (feeAddedAfterItemsCount * feePerItem)) * 100) / 100);
    deliveryObject.amountOfItems = 5;
    expect(getDeliveryFee(deliveryObject)).toBe(Math.round((deliveryObject.amountOfItems * feePerItem + BASE_FEE - (feeAddedAfterItemsCount * feePerItem)) * 100) / 100);
    deliveryObject.amountOfItems = 6;
    expect(getDeliveryFee(deliveryObject)).toBe(Math.round((deliveryObject.amountOfItems * feePerItem + BASE_FEE - (feeAddedAfterItemsCount * feePerItem)) * 100) / 100);
    deliveryObject.amountOfItems = 15;
    expect(getDeliveryFee(deliveryObject)).toBe(Math.round((deliveryObject.amountOfItems * feePerItem + BASE_FEE - (feeAddedAfterItemsCount * feePerItem)) * 100) / 100);
    deliveryObject.amountOfItems = 25;
    expect(getDeliveryFee(deliveryObject)).toBe(Math.round((deliveryObject.amountOfItems * feePerItem + BASE_FEE - (feeAddedAfterItemsCount * feePerItem)) * 100) / 100);
    deliveryObject.amountOfItems = 250;
    expect(getDeliveryFee(deliveryObject)).toBe(MAX_FEE);
    deliveryObject.amountOfItems = 0;
    expect(getDeliveryFee(deliveryObject)).toBe(0);
});

test('friday rush', () => {
    let deliveryObject = {
        cartValue: 50,
        distance: 100,
        amountOfItems: 1,
        dateTime: RANDOM_DATETIME
    } as ITotalDeliveryFee;

    const rushHourRate = 1.1;
    expect(getDeliveryFee(deliveryObject)).toBe(BASE_FEE);
    deliveryObject.amountOfItems = 50;
    expect(getDeliveryFee(deliveryObject)).toBe(MAX_FEE);
    
    deliveryObject.dateTime = RUSH_HOUR_DATETIME;
    deliveryObject.amountOfItems = 1;
    expect(getDeliveryFee(deliveryObject)).toBe(BASE_FEE*rushHourRate);
    deliveryObject.cartValue = 19;
    expect(getDeliveryFee(deliveryObject)).toBe(BASE_FEE*rushHourRate);
    deliveryObject.amountOfItems = 50;
    expect(getDeliveryFee(deliveryObject)).toBe(MAX_FEE);

    // very large order = delivery free
    deliveryObject.cartValue = 100;
    expect(getDeliveryFee(deliveryObject)).toBe(0);
});