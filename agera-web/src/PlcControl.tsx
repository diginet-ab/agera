import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import PowerIcon from '@material-ui/icons/PowerSettingsNew';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { translate, Title } from "react-admin";
import { MyCheckBox } from './dashboard/Dashboard'

const styles = (theme: any) => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    } as any,
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        marginTop: theme.spacing(3),
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
});

const getLocalStorageItem = (key: string, def: string = "") => localStorage.getItem(key) ? localStorage.getItem(key)! : def
const setLocalStorageItem = (key: string, value: string) => localStorage.setItem(key, value)
const getLocalStorageItemBoolean = (key: string, def: boolean = false) => localStorage.getItem(key) ? localStorage.getItem(key) !== "false" : def
const setLocalStorageItemBoolean = (key: string, value: boolean) => localStorage.setItem(key, value ? "true" : "false")

const SendSMS = (props: { classes: any; translate?: any; }) => {

    let { classes, translate } = props;

    const onClick = () => {
    }

    const [checked, setChecked] = useState(false)

    return (
        <main className={props.classes.main}>
            <Title title={translate('custom.title') + " / " + translate('custom.system')}/>
            <CssBaseline />
            <Paper className={props.classes.paper}>
                <Avatar className={props.classes.avatar}>
                    <PowerIcon />
                </Avatar>
                <form className={props.classes.form} onSubmit={onClick}>
                    <MyCheckBox checked={checked} setChecked={setChecked} label="On" />
                    <p></p>
                </form>
            </Paper>
            <p></p>
        </main>
    );
}

export default withStyles(styles as any)(translate(SendSMS));
