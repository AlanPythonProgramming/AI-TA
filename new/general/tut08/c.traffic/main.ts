import { updateLight } from './traffic'

console.log('Cycle 1:')
try {
    updateLight('CAR_WAITING');
    updateLight('NO_CAR_WAITING');
    updateLight('EMERGENCY');
} catch (e) {
    console.log(`Error thrown: '${e.message}'.`);
}

console.log();
console.log('Cycle 2:')
try {
    updateLight('CAR_WAITING');
    updateLight('NO_CAR_WAITING');
} catch (e) {
    console.log(`Error thrown: '${e.message}'.`);
}