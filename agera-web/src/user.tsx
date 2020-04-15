import React from 'react';
import { EmailField, ShowButton, Show, SimpleShowLayout, UrlField, PasswordField, List, SearchInput, Datagrid, TextField, ReferenceField, EditButton, SimpleForm, ReferenceInput, SelectInput, TextInput, Edit, Create, Filter,
    Responsive, SimpleList, useTranslate } from 'react-admin';
import { ListActions, ListEditActions, ListShowActions } from "./CommonActions"

const UserFilter = (props: any) => (
    <Filter {...props}>
        <SearchInput label="Search" source="q" alwaysOn />
    </Filter>
);

export const UserList = (props: JSX.IntrinsicAttributes) => {
    const translate = useTranslate()
    return <List {...props} title={translate('custom.title') + " / " + translate('resources.user.name', {smart_count: 0})} filters={<UserFilter />} sort={{ field: 'name', order: 'asc' }} >
       <Responsive
            small={
                <SimpleList
                    primaryText={(record: any) => record.name}
                    secondaryText={(record: any) => record.phone ? `Phone ${record.phone}` : ""}
                    tertiaryText={(record: any) => record.email}
                />
            }
            medium={
                <Datagrid rowClick="edit">
                    <TextField source="name" />
                    <EmailField source="email" />
                    <TextField source="phone" />
                    <ShowButton />
                    <EditButton />
                </Datagrid>
            }
        />
    </List>
}

export const UserShow = (props: JSX.IntrinsicAttributes) => (
    <Show actions={<ListEditActions />} title={<UserTitle />} {...props}>
        <SimpleShowLayout>
            <TextField source="name" />
            <EmailField source="email" />
            <TextField source="phone" />
        </SimpleShowLayout>
    </Show>
);

const UserTitle = ({ record }: { record?: any}) => {
    return <span>User {record ? record.name : ''}</span>;
};

export const UserEdit = (props: JSX.IntrinsicAttributes) => (
    <Edit actions={<ListShowActions />} title={<UserTitle />} {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="password" type="password" />
            <TextInput source="email" type="email"/>
            <TextInput source="phone" />
        </SimpleForm>
    </Edit>
);

export const UserCreate = (props: JSX.IntrinsicAttributes) => (
    <Create actions={<ListActions />} {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="password" type="password" />
            <TextInput source="email" type="email"/>
            <TextInput source="phone" />
        </SimpleForm>
    </Create>
);
