import { TAME } from '@diginet/tame4'

export class AdsWebService {
    constructor(public url: string, public amsNetId: string, public configFileUrl: string | undefined = undefined, public amsPort = "851") {
    }
    async init() {
        return new Promise<TAME>(async (resolve, reject) => {
            try {
                var plc = new TAME({
                    serviceUrl: this.url,
                    amsNetId: this.amsNetId,
                    amsPort: this.amsPort,
                    configFileUrl: this.configFileUrl,
                    adsCheckInterval: 1000,
                    onReady: function () {
                        resolve(plc)
                    }
                })
                await plc.open();
            } catch (ex) {
                reject(ex)
            }
        })
    }
}

export const plcInit = async (isCX8190 = true, useConfigFile = false) => {
    let http = ""
    let host = window.document.location.hostname
    if (window.document.location.port)
        host += ":" + window.document.location.port
    let amsNetId = ""
    let configFileUrl = undefined
    if (isCX8190) {
        http = "http"
        //amsNetId = "5.73.47.143.1.1"
        //amsNetId = "5.79.28.230.1.1"
        //host = "192.168.2.3"
        configFileUrl = "PLC1.tpy"
    } else {
        http = "http"
        //amsNetId = "81.170.174.167.1.1"
        host = "192.168.2.10"
        configFileUrl = "PLC1.tpy"
    }
    let url = ""
    if (isCX8190)
        url = http + "://" + host + "/TcAdsWebService/TcAdsWebService.dll"
    else
        url = "http://localhost:8080/" + http + "://" + host + "/TcAdsWebService/TcAdsWebService.dll"
    try {
        let response = await fetch(url)
        let html = await response.text()
        let domparser = new DOMParser()
        let doc = domparser.parseFromString(html, "text/html")
        let body = doc.getElementsByTagName("tbody").item(0)
        let trs = body!.getElementsByTagName("tr")
        let row = trs.item(2)
        let datas = row!.getElementsByTagName("td")
        let id = datas?.item(1)!.innerHTML!
        if (id)
            amsNetId = id
        console.log("Found ADS Net ID: " + amsNetId)
    } catch {        
    }
    const service = new AdsWebService(url, amsNetId, useConfigFile ? "http://localhost:8080/" + http + "://" + host + "/" + configFileUrl : undefined)
    return await service.init()
}

export const testPlc = async () => {
    let plc = await plcInit()
    ;(window as any).myVar = 0
    setInterval(() => {
        plc.readDint({name:"GVL.LifeCounter", jvar:"myVar"})
        console.log((window as any).myVar)
        plc.writeTime({name:"MAIN.time1b", val: (window as any).myVar})
        console.log((window as any).myVar)
    }, 100)
}
