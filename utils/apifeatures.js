class API {
  constructor(query, querystr) {
    this.query = query;
    this.querystr = querystr;
  }

  filter() {
    const queryobj = { ...this.querystr };
    const excludefields = ['page', 'limit', 'fields', 'sort'];
    excludefields.forEach((el) => delete queryobj[el]);
    // ADVANCR FILTERING
    let querystr = JSON.stringify(queryobj);
    querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(querystr));
    return this;
  }

  sort() {
    if (this.querystr.sort) {
      const sortby = this.querystr.sort.split(',').join(' ');
      this.query = this.query.sort(sortby);
    } else {
      this.query = this.query.sort('price');
    }
    return this;
  }

  paginate() {
    const page = this.querystr.page * 1;
    const limit = this.querystr.limit * 1;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  limitfields() {
    if (this.querystr.fields) {
      const fields = this.querystr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
}
module.exports = API;
