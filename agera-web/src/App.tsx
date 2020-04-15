import React, { useState, useEffect } from 'react';
import { Admin, Resource, resolveBrowserLocale, useTranslate } from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot'
import { UserList, UserShow, UserEdit, UserCreate } from './user';
import { EventList, EventShow, EventEdit, EventCreate } from './event';
import EventIcon from '@material-ui/icons/Event';
import UserIcon from '@material-ui/icons/Group';
import Dashboard from './dashboard/Dashboard';
import authProvider from './authProvider';
import Login from './Login';
import { myTheme } from "./layout/MyTheme";
import MyLayout from './layout/MyLayout';
import customRoutes from './CustomRoutes';
import themeReducer from './themeReducer'

import dataProviderFactory from './dataProvider';
import fakeServerFactory from './fakeServer';

import products from './products'

// interface translations
import englishMessages from 'ra-language-english';
import swedishMessages from 'ra-language-swedish';

// domain translations
import { domainMessages } from './i18n/i18n';
import * as joint from 'rappid'
window.joint = joint

const messages = {
    sv: { ...swedishMessages, ...domainMessages.sv },
    en: { ...englishMessages, ...domainMessages.en },
} as { [key: string]: any };

const getLocale = () => {
  if (localStorage.getItem("language")){
    return localStorage.getItem("language");
  }
  else {
    return resolveBrowserLocale();
  }
}

const i18nProvider = polyglotI18nProvider(locale => messages[locale], getLocale())

const Title = ({ className }: any) => {
  const translate = useTranslate()
return <span className={className}>{ translate("custom.title")}</span>
}

const App = () => {
  const [dataProvider, setDataProvider] = useState(null);

  useEffect(() => {
      let restoreFetch;

      const fetchDataProvider = async () => {
          restoreFetch = await fakeServerFactory(
              process.env.REACT_APP_DATA_PROVIDER
          );
          const dataProviderInstance = await dataProviderFactory(
              process.env.REACT_APP_DATA_PROVIDER
          );
          setDataProvider(
              // GOTCHA: dataProviderInstance can be a function
              () => dataProviderInstance
          );
      };

      fetchDataProvider();

      return restoreFetch;
  }, []);

  if (!dataProvider) {
      return (
          <div className="loader-container">
              <div className="loader">Loading...</div>
          </div>
      );
  }
  return <Admin customRoutes={customRoutes} layout={MyLayout} title={ <Title/> } i18nProvider={i18nProvider} theme={myTheme} customReducers={{ theme: themeReducer }} dashboard={Dashboard} authProvider={authProvider} dataProvider={dataProvider} loginPage={Login} >
    <Resource name="event" list={EventList} show={EventShow} edit={EventEdit} icon={EventIcon} />
    <Resource name="user" list={UserList} show={UserShow} edit={UserEdit} create={UserCreate} icon={UserIcon} />
    <Resource name="products" {...products} />
  </Admin>
}

export default App;