import React, { useState, useEffect, useRef } from "react"
import {
    DateField,
    ShowButton,
    Show,
    SimpleShowLayout,
    UrlField,
    PasswordField,
    List,
    Datagrid,
    TextField,
    NumberField,
    ReferenceField,
    EditButton,
    SimpleForm,
    ReferenceInput,
    SelectInput,
    TextInput,
    SearchInput,
    DateInput,
    DateTimeInput,
    Edit,
    Create,
    Filter,
    Responsive,
    SimpleList,
    useRefresh,
    useDataProvider,
    useTranslate
} from "react-admin"
import { ListActions, ListEditActions, ListShowActions } from "./CommonActions"
import { translate } from "ra-core"
import CustomizableDatagrid from 'ra-customizable-datagrid'
import { useAutoUpdateResource } from './AutoUpdateResourceEffect'
import moment from 'moment'
import { uuid } from "uuidv4"
import EventLinkField from './EventLinkField'

const EventFilter = (props: any) => {
    const translate = useTranslate()
    return <Filter {...props}>
        <SearchInput label="Search" source="q" alwaysOn />
        <DateInput source="time_gte" label="custom.dateAfter" />
        <TextInput source="time_gte_x" label="custom.timeAfter" />
        <DateInput source="time_lte" label="custom.dateBefore" />
        <TextInput source="time_lte_x" label="custom.timeBefore" />
        <TextInput source="to" />
        <TextInput source="providerMessageId" />
        <TextInput source="status"/>
        <TextInput source="referenceId" label={translate("resources.event.fields.referenceId")}/>
        <ReferenceInput source="userId" reference="user" allowEmpty>
            <SelectInput optionText="name" />
        </ReferenceInput>
        <ReferenceInput source="providerId" reference="provider" allowEmpty>
            <SelectInput optionText="name" />
        </ReferenceInput>
    </Filter>
}

export const EventList = (props: any) => {
    const translate = useTranslate();
    let datagridRef = useRef(null)
    // useAutoUpdateResource("event", datagridRef)

    return (
        <List {...props} title={translate('custom.title') + " / " + translate('resources.event.name', {smart_count: 0})} filters={<EventFilter />} sort={{ field: 'time', order: 'DESC' }} >
            <Responsive
                small={
                    <SimpleList linkType={"none"}
                        primaryText={(record: any) => (
                            <div>{`${moment.utc(record?.time).format("YYYY-MM-DD HH:mm.ss")} (${moment(record?.time).fromNow()})`}</div>
                        )}
                        secondaryText={(record: any) => {
                            let items = []
                            items.push(<ReferenceField key={uuid()} source="userId" reference="user" basePath="user" record={record} link="show" >
                                    <TextField source="name" />
                                </ReferenceField>)
                            items.push(" (")
                            items.push(<ReferenceField key={uuid()} source="messageId" reference="message" basePath="message" record={record} link="show" >
                                    <TextField source="from" />
                                </ReferenceField>)
                            items.push(") to ")
                            items.push(<ReferenceField key={uuid()} source="messageId" reference="message" basePath="message" record={record} link="show" >
                                    <TextField source="to" />
                                </ReferenceField>)
                            items.push(<div key={uuid()} >{`Ref ID: ${record?.referenceId}`}</div>)
                            if (record?.providerId) {
                                items.push(<div key={uuid()}>
                                        <ReferenceField key={uuid()} source="providerId" reference="provider" basePath="provider" record={record} link="show" >
                                            <TextField source="name" />
                                        </ReferenceField>
                                        { record.providerMessageId ?
                                            <span> ID: <a href={ encodeURI(`${ window.location.pathname }#/event?filter={"providerMessageId":"${ record?.providerMessageId }"}&order=DESC&page=1&perPage=10&sort=time`) }>{`${record.providerMessageId}`}</a></span>
                                            : null
                                        }
                                    </div>)
                            }
                            return items
                        }}
                        tertiaryText={(record: any) => record?.status}
                    />
                }
                medium={
                    <CustomizableDatagrid ref={ datagridRef }>
                        <DateField source="time" showTime label={ translate("resources.event.fields.time") } />
                        <ReferenceField source="userId" reference="user" link="show" label={ translate("resources.event.fields.userId") } >
                            <TextField source="name" />
                        </ReferenceField>
                        <TextField source="to" label={ translate("resources.event.fields.to") } />
                        <TextField source="status" label={ translate("resources.event.fields.status") } />
                        <NumberField source="statusCode" label={ translate("resources.event.fields.statusCode") } />
                        <ReferenceField source="messageId" reference="message" link="show" label={ translate("resources.event.fields.referenceId") } >
                            <TextField source="referenceId" />
                        </ReferenceField>
                        <ReferenceField source="providerId" reference="provider" link="show" label={ translate("resources.event.fields.providerId") } >
                            <TextField source="name" />
                        </ReferenceField>
                        <EventLinkField source="providerMessageId" label={ translate("resources.event.fields.providerMessageId") } />
                        <ShowButton />
                    </CustomizableDatagrid>
                }
            />
        </List>
    )
}

export const EventShow = (props: JSX.IntrinsicAttributes) => (
    <Show actions={<ListActions />} title={<EventTitle />} {...props}>
        <SimpleShowLayout>
            <DateField source="time" showTime />
            <TextField source="status" />
            <NumberField source="statusCode" />
            <TextField source="providerMessageId" />
            <TextField source="to" />
            <ReferenceField source="messageId" reference="message" link="" >
                <TextField source="referenceId" />
            </ReferenceField>
            <ReferenceField source="userId" reference="user" link="" >
                <TextField source="name" />
            </ReferenceField>
            <ReferenceField source="providerId" reference="provider" link="" >
                <TextField source="name" />
            </ReferenceField>
        </SimpleShowLayout>
    </Show>
)

const EventTitle = ({ record }: { record?: any }) => {
    return <span>Event {record ? record.name : ""}</span>
}

export const EventEdit = (props: JSX.IntrinsicAttributes) => (
    <Edit actions={<ListShowActions />} title={<EventTitle />} {...props}>
        <SimpleForm>
            <ReferenceInput source="userId" reference="user">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <ReferenceInput source="messageId" reference="message">
                <SelectInput optionText="providerMessageId" />
            </ReferenceInput>
            <DateInput source="time" showTime />
            <TextInput source="to" />
            <TextInput source="status" />
            <ReferenceInput source="providerId" reference="provider">
                <SelectInput optionText="name" />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
)

export const EventCreate = (props: JSX.IntrinsicAttributes) => (
    <Create actions={<ListActions />} {...props}>
        <SimpleForm>
            <ReferenceInput source="userId" reference="user">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <ReferenceInput source="messageId" reference="message">
                <SelectInput optionText="providerMessageId" />
            </ReferenceInput>
            <DateInput source="time" showTime />
            <TextInput source="to" />
            <TextInput source="status" />
            <ReferenceInput source="providerId" reference="provider">
                <SelectInput optionText="name" />
            </ReferenceInput>
        </SimpleForm>
    </Create>
)
