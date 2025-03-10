import fs from 'fs'

type States = 'RED' | 'YELLOW' | 'GREEN';
export type Actions = 'CAR_WAITING' | 'NO_CAR_WAITING' | 'EMERGENCY';

interface Light {
    state: States
}

let light: Light = {
    state: "RED"
}

//////////////////////////////////////////////////////////

export function load() {
    if (fs.existsSync('./database.json')) {
        const dbstr = fs.readFileSync('./database.json');
        light = JSON.parse(String(dbstr));
    }
}

export function save() {
    const jsonstr = JSON.stringify(light);
    fs.writeFileSync('./database.json', jsonstr);
}

///////////////////////////////////////////////////////////

let timerId: ReturnType<typeof setTimeout>;
const DELAY = 1.5;


export function updateLight(action: Actions) {
   
    // RED
    if (light.state == "RED") {
       if (action != 'CAR_WAITING') {
           throw new Error(`Cannot use action '${action}' at state '${light.state}'`);
        }
        light.state = "GREEN";

    // GREEN
    } else if (light.state == "GREEN") {
        if (action != 'NO_CAR_WAITING' && action != 'EMERGENCY') {
            throw new Error(`Cannot use action '${action}' at state '${light.state}'`);
        }

        if (action == 'EMERGENCY') {
            light.state = "RED";
        } else if (action == 'NO_CAR_WAITING') {
            light.state = "YELLOW";
            timerId = setTimeout(turnRed, DELAY * 1000);
        }
    
    // YELLOW
    } else if (light.state == "YELLOW") {
        if (action != "EMERGENCY") {
            throw new Error(`Cannot use action '${action}' at state '${light.state}'`);
        }
        light.state = "RED";
    }
    console.log(`Light has changed to ${light.state}`);
    return {};
}

function turnRed() {
    if (light.state != "YELLOW") {
       throw new Error(`Cannot turn red at state '${light.state}'`);
    }
    light.state = "RED";
    console.log(`Light has changed to ${light.state}`)
}


///////////////////////////////////////////////////////////

// Functions for test suite

/**
 * Resets the state of the traffic lights back to RED
 */
export function reset() {
    light.state = "RED";
    return {}
}

/**
 * Returns the current state of the traffic light
 */
export function getState() {
    return light.state;
}

