// @flow

import CityConfig from './CityConfig'

const configs = {
  neuburgschrobenhausenwohnraum: new CityConfig({
    cmsName: 'neuburgschrobenhausenwohnraum',
    hostname: 'raumfrei.neuburg-schrobenhausen.de',
    formsEnabled: true,
    title: 'Raumfrei Neuburg-Schrobenhausen',
    logo: 'neuburg_logo.svg',
    favicon: 'neuburg_favicon.ico'
  }),
  testumgebungwohnraum: new CityConfig({
    cmsName: 'testumgebungwohnraum',
    hostname: 'test.wohnen.integreat-app.de',
    formsEnabled: true,
    title: 'Testumgebung',
    logo: null
  }),
  bayreuthwohnraum: new CityConfig({
    cmsName: 'bayreuthwohnraum',
    hostname: 'wohnraumboerse.bayreuth.de',
    formsEnabled: false,
    title: 'Bayreuth',
    logo: 'bayreuth_logo.png',
    favicon: 'bayreuth_favicon.ico'
  })
}

export default configs
