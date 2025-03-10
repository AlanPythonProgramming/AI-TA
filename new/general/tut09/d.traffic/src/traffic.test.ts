import { Actions } from './traffic';
import request from 'sync-request-curl';
import { port, url } from './config.json';
import sleepSync from 'slync';

const SERVER_URL = `${url}:${port}`;
const ERROR = { error: expect.any(String) };


///////////////////////////////////////////////////////////
// Request Wrappers

const requestUpdateLight = (action: Actions) => {
    const res = request('PUT', SERVER_URL + '/updateLight', { json: {action}})
    return JSON.parse(res.body.toString())
}

const requestState = () => {
    const res = request('GET', SERVER_URL + '/getState', {})
    return JSON.parse(res.body.toString())
}

const requestReset = () => {
    const res = request('PUT', SERVER_URL + '/resetState', {})
    return JSON.parse(res.body.toString())
}

///////////////////////////////////////////////////////////
// Tests

beforeEach(() => {
    requestReset();
})

describe.only('Invalid actions', () => {
    test('Invalid actions for red', () => {
        expect(requestUpdateLight("EMERGENCY")).toStrictEqual(ERROR);
        expect(requestUpdateLight("NO_CAR_WAITING")).toStrictEqual(ERROR);
    });

    test('Invalid actions for green', () => {
        requestUpdateLight('CAR_WAITING');
        expect(requestUpdateLight('CAR_WAITING')).toStrictEqual(ERROR);
    });

    test('Invalid actions for yellow', () => {
        requestUpdateLight('CAR_WAITING');
        requestUpdateLight('NO_CAR_WAITING');
        expect(requestUpdateLight('CAR_WAITING')).toStrictEqual(ERROR);
        expect(requestUpdateLight("NO_CAR_WAITING")).toStrictEqual(ERROR);
    });
})


describe('Transitions between states', () => {
    test('Cycle with no emergency or timer', () => {
        expect(requestState()).toStrictEqual("RED");
        requestUpdateLight('CAR_WAITING');
        expect(requestState()).toStrictEqual("GREEN");
        requestUpdateLight('NO_CAR_WAITING');
        expect(requestState()).toStrictEqual("YELLOW");
    });

    test('Emergency from green', () => {
        requestUpdateLight('CAR_WAITING');
        requestUpdateLight('EMERGENCY');
        expect(requestState()).toStrictEqual("RED"); 
    });

    test('Emergency from yellow', () => {
        requestUpdateLight('CAR_WAITING');
        requestUpdateLight('NO_CAR_WAITING');
        requestUpdateLight('EMERGENCY');
        expect(requestState()).toStrictEqual("RED");  
    });

    test('Timer from yellow to red', () => {
        requestUpdateLight('CAR_WAITING');
        requestUpdateLight('NO_CAR_WAITING');
        sleepSync(1.6 * 1000)
        expect(requestState()).toStrictEqual("RED")
    })

    test('Complete cycle with no emergency', () => {
        expect(requestState()).toStrictEqual("RED");
        requestUpdateLight('CAR_WAITING');
        expect(requestState()).toStrictEqual("GREEN");
        requestUpdateLight('NO_CAR_WAITING');
        expect(requestState()).toStrictEqual("YELLOW");
        sleepSync(1.6 * 1000)
        expect(requestState()).toStrictEqual("RED")
    })
})

describe('Multiple rotations of cycle', () => {
    test('2 cycles complete, emergency from yellow then green', () => {
        requestUpdateLight('CAR_WAITING');
        requestUpdateLight('NO_CAR_WAITING');
        requestUpdateLight('EMERGENCY');
        expect(requestState()).toStrictEqual("RED");  
        requestUpdateLight('CAR_WAITING');
        requestUpdateLight('EMERGENCY');
        expect(requestState()).toStrictEqual("RED"); 
    })
    
    
    test('2 cycles complete with no emergency', () => {
        requestUpdateLight('CAR_WAITING');
        requestUpdateLight('NO_CAR_WAITING');
        sleepSync(1.6 * 1000)
        expect(requestState()).toStrictEqual("RED")
        requestUpdateLight('CAR_WAITING');
        requestUpdateLight('NO_CAR_WAITING');
        expect(requestState()).toStrictEqual("YELLOW")
    })

    test('cycle with yellow emergency then wait on red', () => {
        requestUpdateLight('CAR_WAITING');
        requestUpdateLight('NO_CAR_WAITING');
        requestUpdateLight('EMERGENCY');
        expect(requestState()).toStrictEqual("RED");  
        sleepSync(2 * 1000)
        expect(requestState()).toStrictEqual("RED");  
    })

    test('Two cycles, no emergency, wait 1 second at each stop', () => {
        requestUpdateLight('CAR_WAITING');
        sleepSync(1 * 1000);
        requestUpdateLight('NO_CAR_WAITING');
        sleepSync(1.6 * 1000);
        requestUpdateLight('CAR_WAITING');
        sleepSync(1 * 1000);
        requestUpdateLight('NO_CAR_WAITING');
        sleepSync(1.6 * 1000);
        expect(requestState()).toStrictEqual("RED");
    })
})





