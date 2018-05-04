// @flow

export default {
  // landlord's data
  landlord: {
    lastName: {
      type: String,
      required: true
    },
    firstName: {
      type: String
    },
    phone: {
      type: String
    }
  },

  // data on the object
  accommodation: {
    totalArea: {
      type: Number,
      required: true
    },
    totalRooms: {
      type: Number,
      min: 1,
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
    moveInDate: {
      type: Date,
      required: true
    }
  },

  // costs of the object
  costs: {
    baseRent: {
      type: Number,
      min: 0,
      required: true
    },
    runningCosts: {
      type: Number,
      min: 0,
      required: true
    },
    ofRunningServices: {
      type: [String],
      enum: ['heating', 'water', 'garbage', 'chimney', 'other'],
      validate: {
        validator: function (values: Array<string>): boolean {
          return this.costs.runningCosts === 0 || values.length > 0
        },
        message: 'ofRunningServices can not be empty if runningCosts > 0'
      }
    },
    hotWaterInHeatingCosts: {
      type: Boolean,
      required: true
    },
    additionalCosts: {
      type: Number,
      min: 0,
      required: true
    },
    ofAdditionalServices: {
      type: [String],
      enum: ['garage', 'other'],
      validate: {
        validator: function (values: Array<string>): boolean {
          return this.costs.additionalCosts === 0 || values.length > 0
        },
        message: 'ofAdditionalServices can not be empty if additionalCosts > 0'
      }
    }
  }
}
