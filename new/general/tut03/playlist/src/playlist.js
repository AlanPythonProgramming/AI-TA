const dataStore = {
  users: [],
  songs: []
}

// users is an array of User objects
// {
//     userId: String,
//     email: String,
//     password: String,
//     playlist: Song[],
//     dateCreated: String
// }

// songs is an array of Song objects
// {
//     songId: String,
//     name: String,
//     artist: String,
//     duration: Integer
// }

/**
 * Registers a user with an email and password 
 * @param {string} email 
 * @param {string} password 
 * @returns {{userId: number}|{error: string}} 
 */
function addUser(email, password) {
  // check if password is empty
  if (password === "") {
    return { error: 'invalid password' };
  }

  // TODO: validate the email

  // TODO: generate a random string for the userId
  let userId = '-';

  // TODO: get the date now in the format
  // 'WEEKDAY - hh:mm:ss [am/pm]". e.g. 'Saturday - 06:03:54 pm'
  let date = '-';

  const newUser = {
    userId: userId,
    email: email,
    password: password,
    playlist: [],
    dateCreated: date
  }

  dataStore.users.push(newUser);

  return { userId };
}

/**
 * Adds a new song to the database
 * @param {string} name 
 * @param {string} artist 
 * @param {number} duration 
 * @returns {{userId: number}|{error: string}}
 */
function addSong(name, artist, duration) {
  if (name === "" || artist === "" || duration > 10 || duration < 0) {
    return {error: "invalid param"};
  }

  // TODO: generate a random string for the userId
  const songId = '-';

  dataStore.songs.push({ name, artist, duration, songId });
  return { songId };
}

/**
 * Adds a song to a users playlist
 * @param {string} userId 
 * @param {string} songId 
 * @returns {}
 */
function addToPlaylist(userId, songId) {
  const user = dataStore.users.find(user => user.userId === userId);
  const song = dataStore.songs.find(song => song.songId === songId);
  
  if (!user && !song) {
    return {error: "userId or songId is invalid"};
  }

  if (user.playlist.includes(song)) {
    return {error: "song is already in users playlist"};
  }

  user.playlist.push(song);
  return {};
}

/**
 * Lists all of the songs in a users playlist
 * @param {string} userId 
 * @returns {songs[]} playlist
 */
function listPlaylist(userId) {
  const user = dataStore.users.find(user => user.userId === userId);

  if (!user) {
    return {error: "userId is invalid"};
  }
  return user.playlist;
}

/**
 * Returns the program to its original state
 * @returns {}
 */
function clear() {
  dataStore.songs = [];
  dataStore.users = [];
  return {};
}

// Manually Testing that the code works!
// Add Users and Songs to the Database!
const userId = addUser('amber@gmail.com', 'secure!');
const songId = addSong('name', 'artist', 10);
console.log(userId);
console.log(songId);
console.log(dataStore);