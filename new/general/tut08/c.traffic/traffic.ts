type States = 'RED' | 'YELLOW' | 'GREEN';
type Actions = 'CAR_WAITING' | 'NO_CAR_WAITING' | 'EMERGENCY';

interface Light {
    state: States
}

let light: Light = {
    state: "RED"
}

let timerId: ReturnType<typeof setTimeout>;

export function updateLight(action: Actions) {
    // TODO
}


// Functions for test suite

/**
 * Resets the state of the traffic lights back to RED
 */
export function reset() {
    clearTimeout(timerId);
    light.state = "RED";
}

/**
 * Returns the current state of the traffic light
 */
export function getState() {
    return light.state;
}