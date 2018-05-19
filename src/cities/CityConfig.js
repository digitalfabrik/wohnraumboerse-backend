// @flow

class CityConfig {
  cmsName: string
  hostName: string
  formsEnabled: boolean
  title: string
  logo: string
  impressumUrl: string

  constructor ({cmsName, hostname, formsEnabled, title, logo, impressumUrl}: {|cmsName: string,
    hostname: string, formsEnabled: boolean, title: string, logo: string, impressumUrl: string|}) {
    this.cmsName = cmsName
    this.hostName = hostname
    this.formsEnabled = formsEnabled
    this.title = title
    this.logo = logo
    this.impressumUrl = impressumUrl
  }
}

export default CityConfig
