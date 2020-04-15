import React, { useState, useEffect, useRef } from "react"
import {
    useRefresh,
    useDataProvider
} from "react-admin"
import moment from 'moment'


export const useAutoUpdateResource = (resource: string, customizableDatagridRef?: React.MutableRefObject<null>) => {
    const dataProvider = useDataProvider()
    const refresh = useRefresh()
    let [lastState, setLastState] = useState({ total: 0 as number, lastTimeStatus: moment().utc() })
    useEffect(() => {
        let timer = setInterval(async () => {
            try {
                if (!customizableDatagridRef || !((customizableDatagridRef as any).current?.state?.modalOpened)) {
                    (async () => {
                        const response = await dataProvider.getList(resource, { pagination: { page: 1, perPage: 1 }, sort: { field: "timeCreated", sort: "asc" }})
                        if (response && response.total) {
                            setLastState(current => {
                                let lastTimeStatus = response?.data?.timeStatus ? moment.utc(response?.data?.timeStatus) : moment.utc().add(1, 'hour')
                                if (response.total > current.total || lastTimeStatus.isAfter(current.lastTimeStatus))
                                    refresh()
                                return { total: response.total, lastTimeStatus: moment() }
                            })    
                        }
                    })()
                }
            } catch {                
            }
        }, 5000)
        return () => {
            clearTimeout(timer)
        }
    }, [])
}

