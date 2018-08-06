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
  testumgebungwohnraum: new CityConfig({
    cmsName: 'testumgebungwohnraum',
    hostname: 'test.wohnen.integreat-app.de',
    formsEnabled: true,
    title: 'Testumgebung',
    logo: null
  }),
  bayreuthwohnraum: new CityConfig({
    cmsName: 'bayreuthwohnraum',
    hostname: 'bayreuth.wohnen.integreat-app.de',
    formsEnabled: false,
    title: 'Bayreuth',
    logo: null
  })
}

export default configs
