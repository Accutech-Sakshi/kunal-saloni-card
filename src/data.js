// Names, wedding venue and Pheras/Reception times come from the invitation.
// Haldi, Mehendi, Carnival and Cocktail dates were supplied afterward.
// Unspecified times and venues remain unconfirmed.
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
  // Event dates supplied by the family. Times not provided remain TBA.
  // Carnival/Cocktail reuse available event artwork until their own images are supplied.
  // Event schedule confirmed by the family. No unconfirmed times are displayed.
  // Existing Carnival and Cocktail graphics reuse the available illustrated assets.
  events: [
    { title:'Haldi', image:'haldi', background:'bg-haldi-new', coupleImage:'couple-haldi', subtitle:'A joyful beginning filled with blessings', date:'29 November 2026' },
    { title:'Mehendi', image:'mehndi', background:'bg-gavdev-groom-new', coupleImage:'couple-gavdev', subtitle:'An afternoon of colour, love and tradition', date:'30 November 2026' },
    { title:'Carnival', image:'carnival', background:'bg-sapthapadi-new', coupleImage:'couple-carnival', subtitle:'Celebrating togetherness, laughter and joy', date:'1 December 2026' },
    { title:'Cocktail', image:'cocktail', background:'bg-sangeet-new', coupleImage:'couple-sangeet', subtitle:'An evening of music and cherished memories', date:'1 December 2026' },
    { title:'Wedding', kind:'wedding', image:'pheras', background:'bg-varmala-new', coupleImage:'couple-varmala', subtitle:'Two hearts, one beautiful beginning', date:'Wednesday, 2 December 2026' }
  ]
};
