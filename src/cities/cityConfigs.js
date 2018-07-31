// @flow

import CityConfig from './CityConfig'

const configs = {
  neuburgschrobenhausenwohnraum: new CityConfig({
    cmsName: 'neuburgschrobenhausenwohnraum',
    hostname: 'raumfrei.neuburg-schrobenhausen.de',
    formsEnabled: true,
    title: 'Raumfrei Neuburg-Schrobenhausen',
    logo: null
  }),
  bayreuthwohnraum: new CityConfig({
    cmsName: 'bayreuthwohnraum',
    hostname: 'wohnraumboerse.bayreuth.de',
    formsEnabled: false,
    title: 'Bayreuth',
    logo: null
  })
}

export default configs
