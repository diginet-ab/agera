import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { useTranslate, useLocale, useSetLocale, Title } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import { changeTheme } from './actions';

const getLocalStorageItem = (key: string, def: string = "") => localStorage.getItem(key) ? localStorage.getItem(key)! : def
const setLocalStorageItem = (key: string, value: string) => localStorage.setItem(key, value)
const getLocalStorageItemBoolean = (key: string, def: boolean = false) => localStorage.getItem(key) ? localStorage.getItem(key) !== "false" : def
const setLocalStorageItemBoolean = (key: string, value: boolean) => localStorage.setItem(key, value ? "true" : "false")

const useStyles = makeStyles({
    label: { width: '10em', display: 'inline-block' },
    button: { margin: '1em' },
});

const Configuration = () => {
    const [allUserMessages, setAllUserMessages] = useState(getLocalStorageItemBoolean("allUserMessages", true))
    useEffect(() => {
        setLocalStorageItemBoolean("allUserMessages", allUserMessages)
    }, [allUserMessages])
    const translate = useTranslate();
    const locale = useLocale();
    const setLocale = useSetLocale()
    const mySetLocale = (lang: string) => {
        setLocale(lang)
        localStorage.setItem("language", lang)
    }
    const classes = useStyles();
    const theme = useSelector((state: any) => state.theme);
    const dispatch = useDispatch();
    return (
        <Card>
            <Title title={translate('custom.title') + " / " + translate('pos.menu.setup')} />
            {/*}
            <CardContent>
                <div className={classes.label}>
                    {translate('pos.theme.name')}
                </div>
                <Button
                    variant="contained"
                    className={classes.button}
                    color={theme === 'light' ? 'primary' : 'default'}
                    onClick={() => dispatch(changeTheme('light'))}
                >
                    {translate('pos.theme.light')}
                </Button>
                <Button
                    variant="contained"
                    className={classes.button}
                    color={theme === 'dark' ? 'primary' : 'default'}
                    onClick={() => dispatch(changeTheme('dark'))}
                >
                    {translate('pos.theme.dark')}
                </Button>
            </CardContent>
            {*/}
            <CardContent>
                <div className={classes.label}>{translate('pos.language')}</div>
                <Button
                    variant="contained"
                    className={classes.button}
                    color={locale === 'sv' ? 'primary' : 'default'}
                    onClick={() => mySetLocale('sv')}
                >
                    sv
                </Button>
                <Button
                    variant="contained"
                    className={classes.button}
                    color={locale === 'en' ? 'primary' : 'default'}
                    onClick={() => mySetLocale('en')}
                >
                    en
                </Button>
            </CardContent>
        </Card>
    );
};

export default Configuration;