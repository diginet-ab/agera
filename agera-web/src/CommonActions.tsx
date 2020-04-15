import * as React from "react"
import { TopToolbar, EditButton, ListButton, ShowButton, CloneButton } from "react-admin"

const topToolbarStyle = {
    zIndex: 2,
    display: "inline-block",
    float: "right",
}

export const ListEditActions = ({ basePath, data, resources }: any) => (
    <TopToolbar style={topToolbarStyle}>
        <ListButton basePath={basePath} />
        <EditButton  basePath={basePath} record={data} />
        <CloneButton  basePath={basePath} record={data} />
    </TopToolbar>
)

export const ListShowActions = ({ basePath, data, resource }: any) => (
    <TopToolbar style={topToolbarStyle}>
        <ListButton basePath={basePath} />
        <ShowButton  basePath={basePath} record={data} />
        <CloneButton  basePath={basePath} record={data} />
    </TopToolbar>
)

export const ListActions = ({ basePath, data, resource }: any) => (
    <TopToolbar style={topToolbarStyle}>
        <ListButton basePath={basePath} />
    </TopToolbar>
)
