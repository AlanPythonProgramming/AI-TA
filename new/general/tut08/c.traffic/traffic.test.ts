import { updateLight, reset, getState } from './traffic';

beforeEach(() => {
    reset();
})


describe('Successful transition between states', () => {
    test('Complete cycle with no emergency', () => {
        expect(getState()).toStrictEqual("RED");
        updateLight('CAR_WAITING');
        expect(getState()).toStrictEqual("GREEN");
        updateLight('NO_CAR_WAITING');
        expect(getState()).toStrictEqual("YELLOW");
        reset();
    });

    test('Emergency from green', () => {
        expect(getState()).toStrictEqual("RED");
        updateLight('CAR_WAITING');
        expect(getState()).toStrictEqual("GREEN");
        updateLight('EMERGENCY');
        expect(getState()).toStrictEqual("RED"); 
    });

    test('Emergency from yellow', () => {
        expect(getState()).toStrictEqual("RED");
        updateLight('CAR_WAITING');
        expect(getState()).toStrictEqual("GREEN");
        updateLight('NO_CAR_WAITING');
        expect(getState()).toStrictEqual("YELLOW");
        updateLight('EMERGENCY');
        expect(getState()).toStrictEqual("RED"); 
    });
})

describe('Invalid actions', () => {
    test('Invalid actions for red', () => {
        expect(() => updateLight("EMERGENCY")).toThrow(Error);
        expect(() => updateLight("NO_CAR_WAITING")).toThrow(Error);
    });

    test('Invalid actions for green', () => {
        updateLight('CAR_WAITING');
        expect(() => updateLight('CAR_WAITING')).toThrow(Error);
    });

    test('Invalid actions for yellow', () => {
        updateLight('CAR_WAITING');
        updateLight('NO_CAR_WAITING');
        expect(() => updateLight('CAR_WAITING')).toThrow(Error);
        expect(() => updateLight("NO_CAR_WAITING")).toThrow(Error);
        reset();
    });
})
