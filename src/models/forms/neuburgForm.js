// @flow

export default {
  // landlord's data
  surname: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  street: {
    type: String
  },
  plz: {
    type: Number,
    min: 10000,
    max: 99999
  },
  location: {
    type: String
  },
  telephone: {
    type: String
  },

  // data on the object
  totalArea: {
    type: Number,
    required: true
  },
  totalRooms: {
    type: Number,
    required: true
  },
  ofRooms: {
    type: [String],
    lowercase: true,
    enum: ['kitchen', 'bath', 'wc', 'child1', 'child2',
      'child3', 'bed', 'hallway', 'store', 'basement', 'balcony'],
    validate: {
      validator: function (values: Array<string>): boolean {
        return values.length > 0
      },
      message: 'ofRooms can not be empty'
    }
  },

  baseRent: {
    type: Number,
    min: 0,
    required: true
  },
  runningCosts: {
    type: Number,
    min: 0,
    default: 0
  },
  ofRunningServices: {
    type: [String],
    enum: ['heating', 'water', 'garbage', 'chimney', 'other'],
    validate: {
      validator: function (values: Array<string>): boolean {
        return this.runningCosts === 0 || values.length > 0
      },
      message: 'ofRunningServices can not be empty if runningCosts > 0'
    }
  },
  hotWaterInHeatingCosts: {
    type: Boolean,
    default: false
  },
  additionalCosts: {
    type: Number,
    min: 0,
    default: 0
  },
  ofAdditionalServices: {
    type: [String],
    enum: ['garage', 'other'],
    validate: {
      validator: function (values: Array<string>): boolean {
        return this.additionalCosts === 0 || values.length > 0
      },
      message: 'ofAdditionalServices can not be empty if additionalCosts > 0'
    }
  }
}
