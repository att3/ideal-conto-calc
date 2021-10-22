import { useState } from 'react';
import { DateTimePicker } from '@mui/lab';
import { Button, FormControl, InputLabel, Input, Container, TextField, InputAdornment } from '@mui/material';
import { ITotalDeliveryFee } from '../interfaces/ITotalDeliveryFee';
import './FeeCalculator.css'

export const FeeCalculator = () => {
    const utcTimeNow = new Date(new Date().getTimezoneOffset() * 60000 + new Date().getTime());
    const [deliveryObject, setDeliveryObject] = useState<ITotalDeliveryFee>({
        cartValue: 20, distance: 1000, amountOfItems: 1, dateTime: utcTimeNow, deliveryFee: 2
    });

    return (
        <Container maxWidth="xs" className="calculatorContainer">
            <h2>Delivery Fee Calculator</h2>
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <InputLabel htmlFor="cartValue">Cart Value</InputLabel>
                <Input
                    id="cartValue"
                    defaultValue={deliveryObject.cartValue}
                    error={deliveryObject.cartValue < 0}
                    onChange={(e) => setDeliveryObject({ ...deliveryObject, cartValue: Number(e?.target?.value) })}
                    endAdornment={<InputAdornment position="start">€</InputAdornment>} />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <InputLabel htmlFor="deliveryDistance">Delivery Distance</InputLabel>
                <Input
                    id="deliveryDistance"
                    defaultValue={deliveryObject.distance}
                    error={deliveryObject.distance < 1}
                    onChange={(e) => setDeliveryObject({ ...deliveryObject, distance: Number(e?.target?.value) })}
                    endAdornment={<InputAdornment position="start">m</InputAdornment>} />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <InputLabel htmlFor="deliveryItemsAmount">Amount of items</InputLabel>
                <Input
                    error={deliveryObject.amountOfItems < 1}
                    defaultValue={deliveryObject.amountOfItems}
                    onChange={(e) => setDeliveryObject({ ...deliveryObject, amountOfItems: Number(e?.target?.value) })}
                    id="deliveryItemsAmount" />
            </FormControl>
            <FormControl id="deliveryDateTime" fullWidth sx={{ m: 1 }} variant="standard">
                <DateTimePicker
                    label="Date & Time (UTC)"
                    value={deliveryObject.dateTime}
                    onChange={(date) => setDeliveryObject({ ...deliveryObject, dateTime: date })}
                    renderInput={(params) => <TextField {...params} />} />
            </FormControl>
            <hr />
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <Button variant="contained" onClick={() => setDeliveryObject({ ...deliveryObject, deliveryFee: getDeliveryFee(deliveryObject) })} id="calculateButton">Calculate Fee</Button>
            </FormControl>
            <hr />
            <h3>Delivery Price:</h3>
            <h2 className="deliveryPrice">
                {deliveryObject.deliveryFee > 0 ? <span><span id="resultsText">{deliveryObject.deliveryFee}</span>€</span> : "Please check input"}
            </h2>
        </Container>
    );
};

/**
 * 
 * @param deliveryObject 
 * @returns delivery fee according to spec found at: TODO add link to spec here
 * Returns 0 if delivery object is invalid
 */
export const getDeliveryFee = (deliveryObject: ITotalDeliveryFee): number => {
    if (deliveryObject.cartValue < 0.01 ||
        deliveryObject.distance < 1 ||
        deliveryObject.amountOfItems < 1 ||
        deliveryObject.dateTime === undefined)
        return 0;

    let deliveryFee = 0;
    // add small order surcharge
    const smallOrderSurchargeLimitEur = 10.00;
    if (deliveryObject.cartValue < smallOrderSurchargeLimitEur) {
        deliveryFee += smallOrderSurchargeLimitEur - deliveryObject.cartValue;
    }

    // add item count surcharge
    const surChargeForItemsOver = 4;
    const surchargePerItem = 0.5;
    if (deliveryObject.amountOfItems > surChargeForItemsOver) {
        deliveryFee += (deliveryObject.amountOfItems - surChargeForItemsOver) * surchargePerItem;
    }

    // add distance travelled fee
    const feeFirst1000MetersEur = 2.0;
    const feeAddedEveryMeters = 500;
    const additionalFeeAmountEur = 1.0;
    const additionalFee = Math.ceil((deliveryObject.distance - 1000) / feeAddedEveryMeters) * additionalFeeAmountEur;
    deliveryFee += feeFirst1000MetersEur + additionalFee;

    // add Friday rush fee (3-7pm UTC)
    const fridayAsNumber = 5;
    if (deliveryObject.dateTime?.getDay() === fridayAsNumber &&
        deliveryObject.dateTime?.getHours() > 15 &&
        deliveryObject.dateTime?.getHours() < 19) {
        deliveryFee *= 1.1;
    }

    // set max delivery price
    const maxDeliveryFee = 15;
    if (deliveryFee > maxDeliveryFee)
        deliveryFee = maxDeliveryFee;

    // if order over 100, delivery is free
    if (deliveryObject.cartValue >= 100) {
        deliveryFee = 0;
    }

    return Math.round(deliveryFee * 100) / 100;
}

