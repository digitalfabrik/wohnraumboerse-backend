// @flow

export default {
  // landlord's data
  landlord: {
    lastName: {
      type: String,
      required: [true, 'Nachname ist leer.']
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
      required: [true, 'Gesamtfläche ist leer.']
    },
    totalRooms: {
      type: Number,
      min: [1, 'Der Mindestwert für die Gesamtzahl der Räume ist 1'],
      required: [true, 'Gesamtzahl der Räume ist leer']
    },
    ofRooms: {
      type: [String],
      lowercase: true,
      enum: {
        values: ['kitchen', 'bath', 'wc', 'child1', 'child2',
          'child3', 'bed', 'hallway', 'store', 'basement', 'balcony'],
        message: 'Ungültige Werte für Räume.'
      },
      validate: {
        validator: function (values: Array<string>): boolean {
          return values.length > 0
        },
        message: 'Sie müssen mindestens einen Raum auswählen.'
      }
    },
    moveInDate: {
      type: Date,
      required: [true, 'Bezugsdatum ist leer.']
    }
  },

  // costs of the object
  costs: {
    baseRent: {
      type: Number,
      min: [0, 'Der Mindestwert für die Miete ist 0.'],
      required: [true, 'Miete ist leer']
    },
    runningCosts: {
      type: Number,
      min: [0, 'Der Mindestwert für die Nebenkosten ist 0.'],
      required: [true, 'Nebenkosten ist leer.']
    },
    ofRunningServices: {
      type: [String],
      enum: {
        values: ['heating', 'water', 'garbage', 'chimney', 'other'],
        message: 'Ungültige Werte für Art der Nebenkosten.'
      },
      validate: {
        validator: function (values: Array<string>): boolean {
          return this.costs.runningCosts === 0 || values.length > 0
        },
        message: 'Art der Nebenkosten ist leer, obwohl Nebenkosten anfallen.'
      }
    },
    hotWaterInHeatingCosts: {
      type: Boolean,
      required: [true, 'Heißwasser in Heizkosten enthalten ist leer.']
    },
    additionalCosts: {
      type: Number,
      min: [0, 'Der Mindestwert für die Zusatzkosten ist 0.'],
      required: [true, 'Zusatzkosten ist leer.']
    },
    ofAdditionalServices: {
      type: [String],
      enum: {
        values: ['garage', 'other'],
        message: 'Ungültige Werte für Art der Zusatzkosten'
      },
      validate: {
        validator: function (values: Array<string>): boolean {
          return this.costs.additionalCosts === 0 || values.length > 0
        },
        message: 'Art der Zusatzkosten ist leer, obwohl Zusatzkosten anfallen.'
      }
    }
  }
}
