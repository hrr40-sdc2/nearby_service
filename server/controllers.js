const Pool = require('pg').Pool;
const redis = require('redis');
const { password } = require('../config.js');
const connectionString = `postgres://postgres:${password}@ec2-18-222-27-79.us-east-2.compute.amazonaws.com:5432/housemania`;

const pool = new Pool({
  connectionString
});

const client = redis.createClient({
  port: 6379,
  host: 'ec2-3-19-237-85.us-east-2.compute.amazonaws.com'
});

exports.createRental = (req, res) => {
  const {
    imgurl, location, type, title, cost, zip
  } = req.body;
  const query = 'INSERT INTO rentals (imgurl, location, type, title, cost, stars, \
    reviewcount, zip) VALUES ($1, $2, $3, $4, $5, 0, 0, $6)';
  pool.query(query, [imgurl, location, type, title, cost, zip])
    .then(result => {
      res.status(201).end();
    })
    .catch(e => {
      console.log(e);
      res.status(500);
    });
};

exports.findNearbyRentals = (req, res) => {
  client.get(req.params.zip, (err, records) => {
    if (err) {
      throw err;
    }
    if (records) {
      res.json(JSON.parse(records));
    } else {

      const query = 'SELECT * FROM rentals WHERE zip > $1 AND zip < $2 \
        ORDER by id DESC FETCH FIRST 12 ROW ONLY';
      const searchZip = Number(req.params.zip);
      const params = [(searchZip - 500), (searchZip + 500)];
      pool.query(query, params)
        .then(result => {
          client.setex(req.params.zip, 3600, JSON.stringify(result.rows));
          res.status(200).json(result.rows);
        })
        .catch(e => {
          res.status(500).end();
        });
    }
  });
};

exports.updateRental = (req, res) => {
  const [toBeUpdated] = Object.entries(req.body);
  const query = `UPDATE rentals SET ${toBeUpdated[0]} = $1 WHERE id = $2`;
  const { id } = req.params;
  const params = [toBeUpdated[1], id];
  pool.query(query, params)
    .then(result => {
      res.status(200).send(`User with id: ${id} updated`);
    })
    .catch(e => {
      res.status(500);
    });
};

exports.deleteRental = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM rentals WHERE id = $1';
  pool.query(query, [id])
    .then(result => {
      res.status(200).send(`User with id: ${id} deleted`);
    })
    .catch(e => {
      res.status(500);
    });
};