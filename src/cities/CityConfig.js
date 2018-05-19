// @flow

class CityConfig {
  cmsName: string
  hostName: string
  formsEnabled: boolean
  title: string
  logo: ?string

  constructor (cmsName: string, hostname: string, formsEnabled: boolean, title: string, logo: ?string) {
    this.cmsName = cmsName
    this.hostName = hostname
    this.formsEnabled = formsEnabled
    this.title = title
    this.logo = logo
  }
}

export default CityConfig
