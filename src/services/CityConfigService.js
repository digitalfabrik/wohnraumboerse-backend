// @flow

import type {Config} from '../Config'
import format from 'string-format'
import CityConfig from '../cities/CityConfig'
import cityConfigs from '../cities/cityConfigs'

export default class CityConfigService {
  config: Config

  constructor (config: Config) {
    this.config = config
  }

  getFilledCityConfigs (): Array<CityConfig> {
    const baseUrl = `${this.config.host}:${this.config.port}`
    const cityConfigsArray: Array<CityConfig> = Object.values(cityConfigs)
    cityConfigsArray.forEach(cityConfig => {
      cityConfig.logo = format(cityConfig.logo, baseUrl)
      cityConfig.favicon = format(cityConfig.favicon, baseUrl)
    })
    return cityConfigsArray
  }
}
