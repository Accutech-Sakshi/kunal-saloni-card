// Only names, confirmed dates/times and venue come from the provided wedding PDF.
// Sangeet / Mehndi / Haldi dates and timings were NOT specified; edit when confirmed.
export const invitation = {
  groom: 'Kunal',
  bride: 'Saloni',
  groomParents: 'Mrs. Monika & Mr. Pardeep Garg',
  brideParents: 'Mrs. Sushila & Mr. Munish Singla',
  weddingDateText: 'WEDNESDAY, 2 DECEMBER 2026',
  weddingDateISO: '2026-12-02T16:00:00+05:30',
  blessing: '|| Shree Ganeshaya Namah ||',
  venueName: 'The Palace Banquet Hall',
  venueAddress: 'Rangarh Derabassi Road, Kakrali, Punjab',
  directionsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Palace+Banquet+Hall+Rangarh+Derabassi+Road+Kakrali+Punjab',
  mapEmbedUrl: 'https://maps.google.com/maps?q=The%20Palace%20Banquet%20Hall%20Rangarh%20Derabassi%20Road%20Kakrali%20Punjab&t=&z=15&ie=UTF8&iwloc=&output=embed',
  invitedBy: 'Mrs. Poonam & Mr. Sandeep Garg',
  rsvpLabel: 'RSVP – Garg Family',
  phones: ['+91-9882896000', '+91-9418044412'],
  events: [
    { title:'Sangeet', image:'sangeet', background:'bg-sangeet-new', coupleImage:'couple-sangeet', subtitle:'A musical night of song, dance & laughter', date:'To be announced', time:'To be announced', venue:'To be confirmed' },
    { title:'Mehndi', image:'mehndi', background:'bg-gavdev-groom-new', coupleImage:'couple-gavdev', subtitle:'A colourful celebration of love and traditions', date:'To be announced', time:'To be announced', venue:'To be confirmed' },
    { title:'Haldi', image:'haldi', background:'bg-haldi-new', coupleImage:'couple-haldi', subtitle:'A joyful beginning filled with blessings', date:'To be announced', time:'To be announced', venue:'To be confirmed' },
    { title:'Reception', image:'reception', background:'bg-varmala-new', coupleImage:'couple-varmala', subtitle:'An evening to celebrate our new journey', date:'Wednesday, 2 Dec 2026', time:'8:00 PM', venue:'The Palace Banquet Hall' }
  ]
};
