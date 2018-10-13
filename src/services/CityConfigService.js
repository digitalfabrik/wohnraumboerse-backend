// @flow

import type {Config} from '../Config'
import format from 'string-format'
import CityConfig from '../cities/CityConfig'
import cityConfigs from '../cities/cityConfigs'
import _ from 'lodash'

export default class CityConfigService {
  config: Config

  constructor (config: Config) {
    this.config = config
  }

  getFilledCityConfigs (): Array<CityConfig> {
    const baseUrl = `${this.config.protocol}://${this.config.host}:${this.config.port}`
    // Object.values() only returns an Array<mixed>, see https://github.com/facebook/flow/issues/2221 for reference.
    // Therefore we disable flow type checking for this line.
    // $FlowFixMe
    const cityConfigsArray: Array<CityConfig> = _.cloneDeep(Object.values(cityConfigs))
    console.log(Object.values(cityConfigs))
    cityConfigsArray.forEach(cityConfig => {
      cityConfig.logo = format(cityConfig.logo, baseUrl)
      cityConfig.favicon = format(cityConfig.favicon, baseUrl)
    })
    return cityConfigsArray
  }
}
