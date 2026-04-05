// sport.js
// MLB Sport model

class Sport {
  constructor({ id, code, link, name, abbreviation, sortOrder, activeStatus }) {
    this.id = id;
    this.code = code;
    this.link = link;
    this.name = name;
    this.abbreviation = abbreviation;
    this.sort_order = sortOrder;
    this.active_status = !!activeStatus;
  }
}

module.exports = Sport;
