import { DbRef, MongoDbDatabases } from "@diginet/ds-mongodb/dist"
import { ObjectID } from "mongodb"
import { User } from "./Models/Users"

export class DataAccess {

    public initDone: Promise<void>
    constructor(public db: DbRef, public mongoDbDatabases: MongoDbDatabases) {
        this.initDone = this.init()
    }

    // tslint:disable-next-line: variable-name
    public async AddOrUpdateItem(collection: string, _id: ObjectID | undefined, unique: object | undefined, doc: object): Promise<ObjectID | undefined> {
        let result
        if (this.db) {
            try {
                if (!_id && unique) {
                    const item = await this.mongoDbDatabases.getDocument(this.db, collection, unique)
                    if (item) {
                        result = item._id
                        await this.mongoDbDatabases.updateDocument(this.db, collection, unique, { $set: { ...doc } })
                    } else {
                        result = await this.mongoDbDatabases.insertDocument(this.db, collection, { ...unique, ...doc })
                    }
                } else {
                    if (_id) {
                        result = await this.mongoDbDatabases.updateDocument(this.db, collection, { _id }, { $set: { ...unique, ...doc } })
                    } else {
                        result = await this.mongoDbDatabases.insertDocument(this.db, collection, { ...unique, ...doc })
                    }
                }
            } catch (error) {
                result = await this.mongoDbDatabases.insertDocument(this.db, collection, { ...unique, ...doc })
            }
        }
        return result
    }

    public renameProperty(obj: { [key: string]: any }, from: string, to: string) {
        Object.defineProperty(obj, to, Object.getOwnPropertyDescriptor(obj, from)!)
        // tslint:disable-next-line:no-string-literal
        delete obj[from]
    }

    public removeProperty(obj: { [key: string]: any }, prop: string) {
        // tslint:disable-next-line:no-string-literal
        delete obj[prop]
    }

    /**
     * Get items from a collection for react-admin
     * @param collection Collection name
     * @param params See below
     */
    public getCollectionItems(collection: string, params: any): Promise<{ docs: any[]; total: number }> {
        return new Promise<{ docs: any[]; total: number }>(async (resolve, reject) => {
            if (this.db) {
                try {
                    const total = await this.mongoDbDatabases.documentCount(this.db, collection)
                    let docs = await this.mongoDbDatabases.getPageOfDocuments(this.db, collection, {}, params.pagination.page - 1, params.pagination.perPage)
                    for (const doc of docs) {
                        this.renameProperty(doc, "_id", "id")
                    }
                    docs = docs.filter(doc => {
                        const json = JSON.stringify(doc).toLowerCase()
                        let found = false
                        if (params.filter.q) {
                            found = json.indexOf(params.filter.q.toLowerCase()) >= 0
                        }
                        return Object.keys(params.filter).length === 0 || found
                    })
                    resolve({ docs, total })
                } catch (error) {
                    reject(error)
                }
            } else {
                reject(new Error("Database not open"))
            }
        })
    }

    public getCollectionItem(collection: string, params: any): Promise<any> {
        return new Promise<any[]>(async (resolve, reject) => {
            if (this.db) {
                try {
                    const doc = await this.mongoDbDatabases.getDocument(this.db, collection, { _id: ObjectID.createFromHexString(params.id) })
                    this.renameProperty(doc, "_id", "id")
                    resolve(doc)
                } catch (error) {
                    reject(error)
                }
            } else {
                reject(new Error("Database not open"))
            }
        })
    }

    public createCollectionItem(collection: string, params: any): Promise<any> {
        return new Promise<any[]>(async (resolve, reject) => {
            if (this.db) {
                try {
                    let doc: any
                    switch (collection) {
                        case "user":
                            {
                                doc = new User()
                                await this.mongoDbDatabases.insertDocument(this.db, collection, doc)
                                this.renameProperty(doc, "_id", "id")
                            }
                            break
                        default:
                            {
                                doc = params.data
                                doc.id = await this.mongoDbDatabases.insertDocument(this.db, collection, doc)
                            }
                            break
                    }
                    resolve(doc)
                } catch (error) {
                    reject(error)
                }
            } else {
                reject(new Error("Database not open"))
            }
        })
    }

    public isHex(s: string) {
        for (let n = 0; n < s.length; n++) {
            const x = s.charCodeAt(n)
            if (!((x >= 0x30 && x <= 0x39) || (x >= 0x61 && x <= 0x66) || (x >= 0x41 && x <= 0x46))) {
                return false
            }
        }
        return true
    }

    public convertStringIdToObjectId(data: any, checkInherited: boolean = false) {
        if (data) {
            const keys = Object.keys(data)
            for (const prop of keys) {
                if (prop && (checkInherited || data.hasOwnProperty(prop))) {
                    if (typeof data[prop] === "string" && data[prop].length === 24 && this.isHex(data[prop])) {
                        data[prop] = ObjectID.createFromHexString(data[prop])
                        if (prop === "id" && keys.indexOf("_id") < 0) {
                            data._id = data[prop]
                            delete data[prop]
                        }
                    } else if (typeof data[prop] === "object") {
                        this.convertStringIdToObjectId(data[prop])
                    }
                }
            }
        }
    }

    public updateCollectionItem(collection: string, params: any): Promise<any> {
        return new Promise<any[]>(async (resolve, reject) => {
            if (this.db) {
                try {
                    this.convertStringIdToObjectId(params)
                    this.removeProperty(params.data, "id")
                    if (await this.mongoDbDatabases.updateDocument(this.db, collection, { _id: params._id }, { $set: params.data })) {
                        const doc = await this.mongoDbDatabases.getDocument(this.db, collection, { _id: params._id })
                        this.renameProperty(doc, "_id", "id")
                        resolve(doc)
                    } else {
                        reject(new Error("Failed to update document in database"))
                    }
                } catch (error) {
                    reject(error)
                }
            } else {
                reject(new Error("Database not open"))
            }
        })
    }

    public async getItemsById(collection: string, params: any) {
        if (this.db) {
            const objectIds = []
            if (params.id) {
                objectIds.push(ObjectID.createFromHexString(params.id))
            }
            if (params.ids) {
                for (const id of params.ids) {
                    if (id) {
                        objectIds.push(ObjectID.createFromHexString(id))
                    } else {
                        objectIds.push(ObjectID.createFromTime(0))
                    }
                }
            }
            const total = await this.mongoDbDatabases.documentCount(this.db, collection, { [params.target || "_id"]: { $in: objectIds } })
            const docs = await this.mongoDbDatabases.getDocuments(this.db, collection, { [params.target || "_id"]: { $in: objectIds } })
            for (const doc of docs) {
                this.renameProperty(doc, "_id", "id")
            }
            return { docs, total }
        } else {
            throw new Error("Database not open")
        }
    }

    protected async init() {
        try {
            if (true /* os.hostname() === "Tokyo" */) {
                this.db = await this.mongoDbDatabases.openDatabase("agera")
            } else {
                // this.db = await this.mongoDbDatabases.openDatabase("agera", "admin", "sumdum98")
            }
        } catch (e) {
            throw e
        }
    }
}
