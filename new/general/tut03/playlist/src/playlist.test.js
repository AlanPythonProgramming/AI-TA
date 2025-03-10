import { addSong, addToPlaylist, listPlaylist, clear } from "./playlist.js"

// beforeEach, clear
beforeEach(() => {    
  clear();
});

////////////////////////////////////////////////////////////////////////////////
//////////////////////// TODO: Write tests for addUser /////////////////////////
////////////////////////////////////////////////////////////////////////////////


// describe('addSong tests', () => {
//   test('addSong Success', () => {
//     expect(addSong('name', 'artist', 1)).toStrictEqual({ songId: expect.any(String) });
//   });

//   test('addSong empty name', () => {
//     expect(addSong('', 'artist', 1)).toStrictEqual({ error: expect.any(String) });
//   });

//   test('addSong empty artist', () => {
//     expect(addSong('name', '', 1)).toStrictEqual({ error: expect.any(String) });
//   });

//   test('addSong duration too small', () => {
//     expect(addSong('name', 'artist', -1)).toStrictEqual({ error: expect.any(String) });
//   });

//   test('addSong duration too large', () => {
//     expect(addSong('name', 'artist', 11)).toStrictEqual({ error: expect.any(String) });
//   });
// });

// describe('addToPlaylist tests', () => {
//   test('addToPlaylist Success', () => {
//     const userId = addUser('valid@mail.com', 'mypassword').userId;
//     const songId = addSong('name', 'artist', 1).songId;
//     expect(addToPlaylist(userId, songId)).toStrictEqual({})
//   });

//   test('addToPlaylist Invalid userId', () => {
//     const songId = addSong('name', 'artist', 1).songId;
//     expect(addToPlaylist(0, songId)).toStrictEqual({ error: expect.any(String) })
//   });

//   test('addToPlaylist Invalid songId', () => {
//     const userId = addUser('valid@mail.com', 'mypassword').userId;
//     expect(addToPlaylist(userId, 0)).toStrictEqual({ error: expect.any(String) })
//   });
// });


// describe('listPlaylist tests', () => {
//   test('listPlaylist Success', () => {
//     const userId = addUser('valid@mail.com', 'mypassword').userId;
//     const songId = addSong('name', 'artist', 1).songId;
//     addToPlaylist(userId, songId);
//     expect(listPlaylist(userId)).toStrictEqual([{
//       "artist": "artist",
//       "duration": 1,
//       "name": "name",
//       "songId": expect.any(String),
//     }]);
//   });

//   test('listPlaylist invalid userId', () => {
//     expect(listPlaylist(1)).toStrictEqual({ error: expect.any(String) });
//   });
// });
