// @flow

export default {
  surname: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  plz: {
    type: Number,
    required: true,
    min: 10000,
    max: 99999
  },
  location: {
    type: String,
    required: true
  },
  telephone: {
    type: Number
  },

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
    enum: ['bathroom', 'bedroom'],
    validate: {
      validator: function (values: Array<string>): boolean {
        return values.length > 0
      },
      message: 'ofRooms can not be empty'
    }
  },

  baseRent: {
    type: Number,
    required: true
  },
  runningCosts: {
    type: Number,
    required: true
  },
  ofRunningServices: {
    type: [String]
  },
  hotWaterInHeatingCosts: {
    type: Boolean,
    default: false
  },
  additionalCosts: {
    type: Number,
    default: 0
  },
  ofAdditionalServices: {
    type: [String]
  },
  agreedToDataProtection: {
    type: Boolean,
    required: true
  }
}
