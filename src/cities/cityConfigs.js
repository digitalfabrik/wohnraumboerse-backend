// @flow

import CityConfig from './CityConfig'

import logoNeuburg from './assets/neuburg_logo.svg'
import logoBayreuth from './assets/bayreuth_logo.png'
import faviconBayreuth from './assets/bayreuth_favicon.ico'
import faviconNeuburg from './assets/neuburg_favicon.ico'

const configs = {
  neuburgschrobenhausenwohnraum: new CityConfig({
    cmsName: 'neuburgschrobenhausenwohnraum',
    hostname: 'raumfrei.neuburg-schrobenhausen.de',
    formsEnabled: true,
    title: 'Raumfrei Neuburg-Schrobenhausen',
    logo: logoNeuburg,
    favicon: faviconNeuburg
  }),
  bayreuthwohnraum: new CityConfig({
    cmsName: 'bayreuthwohnraum',
    hostname: 'wohnraumboerse.bayreuth.de',
    formsEnabled: false,
    title: 'Bayreuth',
    logo: logoBayreuth,
    favicon: faviconBayreuth
  })
}

export default configs
