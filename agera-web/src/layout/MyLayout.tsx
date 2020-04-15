import React from 'react';
import { Layout } from 'react-admin';
import MyMenu from './MyMenu';

const MyLayout = (props: JSX.IntrinsicAttributes) => <Layout {...props} menu={MyMenu} />;

export default MyLayout;
