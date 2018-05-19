// @flow

import CityConfig from './CityConfig'

const configs = {
  neuburgschrobenhausenwohnraum: new CityConfig({
    cmsName: 'neuburgschrobenhausenwohnraum',
    hostname: 'https://raumfrei.neuburg-schrobenhausen.de',
    formsEnabled: true,
    title: 'Raumfrei Neuburg-Schrobenhausen',
    logo: null,
    impressumUrl: 'https://www.neuburg-schrobenhausen.de/Impressum.n10.html'
  }),
  bayreuthwohnraum: new CityConfig({
    cmsName: 'bayreuthwohnraum',
    hostname: 'bayreuth.wohnen.integreat-app.de',
    formsEnabled: false,
    title: 'Bayreuth',
    logo: null,
    impressumUrl: 'https://www.bayreuth.de/impressum/'
  })
}

export default configs
