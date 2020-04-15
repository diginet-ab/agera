import { ObjectID } from "mongodb"

export interface ResourceAllocation {
    _id?: ObjectID
    allocatedByUser: ObjectID
    allocatedDate: string
    resourceUser: ObjectID
    resourceName: string
    resource: ObjectID
    startDate: string
    endDate: string
}

export interface Permission {
    user: ObjectID
    read: boolean
    write: boolean
    execute: boolean
}

export class Resource {
    public owner?: ObjectID
    public sharing?: Permission[]
}

export class User {
    _id?: ObjectID
    email?: string
    name: string = ""
    roles?: ObjectID[] = []
    capabilities: ObjectID[] = []
    company?: string
    street?: string
    zip?: string
    city?: string
    state?: string
    country?: string
    phone?: string
    password?: string
}

export interface Group {
    _id?: ObjectID
    name: string
    roles?: ObjectID[]
    capabilities: ObjectID[]
    members: ObjectID[]
}

export interface Role {
    _id?: ObjectID
    name: string
    capabilities: ObjectID[]
    basedOn?: ObjectID[]
}

export interface Capability {
    _id?: ObjectID
    name: string
    capabilities: ObjectID[]
}
