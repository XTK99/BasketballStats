// venue.js
// MLB Venue model

class Venue {
  constructor({ id, name, link, active, season }) {
    this.id = id;
    this.name = name;
    this.link = link;
    this.active = !!active;
    this.season = season;
  }
}

module.exports = Venue;
