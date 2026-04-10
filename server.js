const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public')); // Serve the frontend from the public directory

// Cache the database in memory for fast lookup
let members = [];
const CSV_FILE = '11 april 2026 cpc member database - consolidated_cpc_members_final (1).csv';

fs.createReadStream(CSV_FILE)
  .pipe(csv())
  .on('data', (data) => {
    // Only keeping the important frontend columns, protecting any unwanted info from being sent
    members.push({
      Member_Name: data['Member_Name'],
      Batch: data['Batch'],
      Registration: data['Registration'],
      Roll_No: data['Roll No.'],
      Member_ID: data['Member_ID'],
      email: data['email'] ? data['email'].toString().toLowerCase().trim() : '',
      Mobile_No: data['Mobile No.'],
      Department: data['Department'],
      Joined: data['cpc joining year']
    });
  })
  .on('end', () => {
    console.log(`CSV Database Loaded: ${members.length} records found.`);
  });

// API endpoint to look up member by email
app.get('/api/member', (req, res) => {
  const queryEmail = req.query.email;
  if (!queryEmail) {
    return res.status(400).json({ error: 'Email parameter is required.' });
  }

  const searchEmail = queryEmail.toLowerCase().trim();
  const match = members.find(m => m.email === searchEmail);

  if (match) {
    res.json({ success: true, data: match });
  } else {
    // We add a tiny delay to deter enum scanning (basic protection)
    setTimeout(() => {
        res.status(404).json({ success: false, error: 'Member not found. Please check your email and try again.' });
    }, 300);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
