class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;

//ROUTE:
// exports.getAllTours = async (req, res) => {
//     try {
//       //BUILD QUERY
//       //  1A)  Filtering
//       //{ difficulty: 'easy', duration: { gte: '5' } }
//       //{ difficulty: 'easy', duration: {'$gte':'5'} }
//       const queryObj = { ...req.query };
//       const excludeFields = ['page', 'sort', 'limit', 'fields'];
//       excludeFields.forEach((el) => delete queryObj[el]);

//       //  1B)  Advanced filtering
//       let queryStr = JSON.stringify(queryObj);
//       queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

//       let query = Tour.find(JSON.parse(queryStr));

//       //  2)  Sorting
//       if (req.query.sort) {
//         console.log(req.query.sort);
//         const sortBy = req.query.sort.split(',').join(' ');
//         query = query.sort(sortBy);
//       } else {
//         query = query.sort('-createdAt');
//       }

//       //  3) Field Limiting
//       if (req.query.fields) {
//         const fields = req.query.fields.split(',').join(' ');
//         query = query.select(fields);
//       } else {
//         query = query.select('-__v');
//       }

//       //  4) Pagination
//       const page = req.query.page * 1 || 1;
//       const limit = req.query.limit * 1 || 100;
//       const skip = (page - 1) * limit;

//       query = query.skip(skip).limit(limit);

//       if (req.query.page) {
//         const numTours = await Tour.countDocuments();
//         if (skip > numTours) throw new Error('This page does not exist.');
//       }

//       //EXECUTE QUERY
//       const tours = await query;
//       //SEND RESPONSE
//       res.status(200).json({
//         status: 'success',
//         results: tours.length,
//         data: {
//           tours,
//         },
//       });
//     } catch (err) {
//       res.status(404).json({
//         status: 'fail',
//         message: err,
//       });
//     }
//   };
