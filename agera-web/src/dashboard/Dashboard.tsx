import React, { useState, useEffect, useRef } from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import { withStyles } from '@material-ui/core/styles'
import { translate, useVersion } from 'react-admin'
import { fetchWithQueryParams } from '../authProvider'
import { uuid } from 'uuidv4'
import moment from 'moment'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { testPlc, plcInit } from '../ads-web-service/AdsWebService'
import { TAME } from '@diginet/tame4'
import { Overview } from './Overview'
import { Rappid } from '../RappidIDE/rappid'
import { Title } from 'react-admin'
import { setIntervalAsync } from 'set-interval-async/dynamic'

export const MyCheckBox = ({ checked, setChecked, label}: any) => {
    return <FormControlLabel
        control={
            <Checkbox
                checked={ checked }
                onChange={ event => setChecked(event.target.checked) }
                color="primary"
            />
        }
        label={ label }
    />
}

const getLocalStorageItem = (key: string, def: string = "") => localStorage.getItem(key) ? localStorage.getItem(key)! : def
const setLocalStorageItem = (key: string, value: string) => localStorage.setItem(key, value)
const getLocalStorageItemBoolean = (key: string, def: boolean = false) => localStorage.getItem(key) ? localStorage.getItem(key) !== "false" : def
const setLocalStorageItemBoolean = (key: string, value: boolean) => localStorage.setItem(key, value ? "true" : "false")

const styles: any = {
    table: {
        fontFamily: 'arial, sans-serif',
        borderCollapse: 'collapse',
        width: '100%',
    },
    td: {
        border: '1px solid #dddddd',
        textAlign: 'left',
        padding: '8px',
        '&:nth-child(even)': {
            backgroundColor: '#dddddd',
        }
    },
    maxWidth: {
        maxWidth: '50vw',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    useFlexRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    verInfo: {
        fontFamily: 'arial, sans-serif',
        fontSize: '10pt',
        marginLeft: '2%',
    }
};

export default withStyles(styles)(translate(({ classes, translate }: any) => {

    const [readCounter, setReadCounter] = useState(0)
    const [plc, setPlc] = useState(null as TAME | null)
    useEffect(() => {
        (async () => {
            const p = await plcInit(true, false)
            setPlc(current => p)
        })()
    }, [])

    const [editForm, setEditForm] = useState(getLocalStorageItemBoolean("Dashboard.editForm", false))
    useEffect(() => {
        setLocalStorageItemBoolean("Dashboard.editForm", editForm)
    }, [editForm])

    const [form, setForm] = useState(getLocalStorageItem("Dashboard.form", ""))
    useEffect(() => {
        setLocalStorageItem("Dashboard.form", form)
    }, [form])

    const [status] = useState({} as { autoUpdate: boolean })

    const [autoUpdate, setAutoUpdate] = useState(getLocalStorageItemBoolean("Dashboard.autoUpdate", false))
    useEffect(() => {
        setLocalStorageItemBoolean("Dashboard.autoUpdate", autoUpdate)
        status.autoUpdate = autoUpdate
    }, [autoUpdate])

    const [plcState, setPlcState] = useState("")

    useEffect(() => {
        if (plc) {
            (async () => {
                (window as any).myStruct = {}
                let b = false
                setIntervalAsync(async () => {
                    if (status.autoUpdate) {
                        let cnt = await plc?.readDint({name: "GVL.LifeCounter", jvar: "myVar"})
                        //let struct = await plc?.readStruct({name: "MAIN.PlcStruct", jvar: "myStruct"})
                        //console.log((window as any).myStruct)
                        //console.log("PLC State: " + plc?.adsStates[plc?.adsState])
                        //console.log(cnt)
                        await plc?.writeBool({name: "IO_DO.DO01", val: b});
                        b = !b
                        setReadCounter(cnt)
                    }
                }, 100)
            })()
        }
    }, [plc])

    useEffect(() => {
        if (plc) {
            (async () => {
                setInterval(async () => {
                    setPlcState(plc?.adsStates[plc?.adsState])
                }, 100)
            })()
        }
    }, [plc])

    const version = useVersion();

    const [resetCounter, setResetCounter] = useState(false)
    useEffect(() => {
        if (resetCounter) {
            setReadCounter(0)
            plc?.writeDint({ name: "GVL.LifeCounter", val: 0})
            setResetCounter(false)
        }
    }, [resetCounter])


    return (
        <div>
            <Title title={translate('custom.title') + " / " + translate('ra.page.dashboard')} />
            <Card>
                <CardContent>
                    <MyCheckBox checked={ editForm } setChecked={ setEditForm } label="Edit form"/>
                    {editForm ? <Rappid form={ form } onFormChange={
                        (newForm: string) => {
                            setLocalStorageItem("Dashboard.form", newForm)
                        }}
                         /> : <Overview form={ form } text="ok" />}
                    
                </CardContent>
            </Card>
        </div>
    )
}))

const DropDown = withStyles(styles)(({ classes, translate, caption, state, setState, states, labels }: any) => {
    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">{caption}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={state}
                onChange={(event) => setState(event.target.value as number)}
            >
                {states.map((item: any, index: number) => <MenuItem key={uuid()} value={item}>{labels ? labels[index] : item}</MenuItem>)}
            </Select>
        </FormControl>
    )

})
