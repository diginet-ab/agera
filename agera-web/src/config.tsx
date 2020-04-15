import React from "react"
import {
    Toolbar,
    SaveButton,
    translate,
    SelectField,
    NumberField,
    ShowButton,
    Show,
    SimpleShowLayout,
    UrlField,
    PasswordField,
    List,
    Datagrid,
    TextField,
    ReferenceField,
    EditButton,
    SimpleForm,
    NumberInput,
    SelectInput,
    TextInput,
    SearchInput,
    Edit,
    Create,
    Filter,
    Responsive,
    SimpleList
} from "react-admin"
import { ListActions, ListEditActions, ListShowActions } from "./CommonActions"
import withStyles from "@material-ui/core/styles/withStyles";
import CustomizableDatagrid from 'ra-customizable-datagrid'

const ConfigFilter = (props: any) => (
    <Filter {...props}>
        <SearchInput label="Search" source="q" alwaysOn />
    </Filter>
)

const logLevelNames = ["Verbose", "Debug", "Information", "Warning", "Error", "Fatal"]

export const ConfigList = translate(({ translate, ...props }: any) => {
    return (
        <List {...props} filters={<ConfigFilter />} sort={{ field: 'name', order: 'asc' }} >
            <Responsive
                small={
                    <SimpleList
                        primaryText={(record: any) => `${record.name}`}
                        secondaryText={(record: any) => `Log level: ${logLevelNames[record.logLevel]}`}
                        tertiaryText={(record: any) => `Default SMSC: ${record.defaultProvider}`}
                    />
                }
                medium={
                    <CustomizableDatagrid rowClick="edit">
                        <TextField source="name" />
                        <NumberField source="messageLifeTimeDays" />
                        <NumberField source="messageFrequency" />
                        <NumberField source="messageBucketSize" />
                        <TextField source="defaultProvider" />
                        <SelectField
                            source="logLevel"
                            choices={[
                                { id: 0, name: "Verbose" },
                                { id: 1, name: "Debug" },
                                { id: 2, name: "Information" },
                                { id: 3, name: "Warning" },
                                { id: 4, name: "Error" },
                                { id: 5, name: "Fatal" }
                            ]}
                        />
                        <ShowButton />
                        <EditButton />
                    </CustomizableDatagrid>
                }
            />
        </List>
    )
})

export const ConfigShow = (props: JSX.IntrinsicAttributes) => (
    <Show actions={<ListActions />} title={<ConfigTitle />} {...props}>
        <SimpleShowLayout>
            <SelectField
                source="logLevel"
                choices={[{ id: 0, name: "Verbose" }, { id: 1, name: "Debug" }, { id: 2, name: "Information" }, { id: 3, name: "Warning" }, { id: 4, name: "Error" }, { id: 5, name: "Fatal" }]}
            />
            <TextField source="defaultProvider" />
            <NumberField source="messageLifeTimeDays" />
            <NumberField source="messageFrequency" />
            <NumberField source="messageBucketSize" />
        </SimpleShowLayout>
    </Show>
)

const ConfigTitle = ({ record }: { record?: any }) => {
    return <span>Config {record ? record.name : ""}</span>
}

const toolbarStyles = {
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
    },
};

const CustomToolbar = withStyles(toolbarStyles)(props => (
    <Toolbar {...props}>
        <SaveButton />
    </Toolbar>
));

export const ConfigEdit = (props: JSX.IntrinsicAttributes) => (
    <Edit actions={<ListShowActions />} title={<ConfigTitle />} {...props}>
        <SimpleForm>
            <SelectInput
                source="logLevel"
                choices={[{ id: 0, name: "Verbose" }, { id: 1, name: "Debug" }, { id: 2, name: "Information" }, { id: 3, name: "Warning" }, { id: 4, name: "Error" }, { id: 5, name: "Fatal" }]}
            />
            <TextInput source="defaultProvider" />
            <NumberInput source="messageLifeTimeDays" />
            <NumberInput source="messageFrequency" />
            <NumberInput source="messageBucketSize" />
        </SimpleForm>
    </Edit>
)
