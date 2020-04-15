import { DbRef, MongoDbDatabases } from "@diginet/ds-mongodb/dist"
import { log } from "@diginet/seq-logger"
import { ObjectID } from "bson"
import { createJWT, verifyJWT } from "./CreateJWT"
import * as Users from "./Models/Users"

export class Authorization {
    public initDone: Promise<void>
    constructor(public db: DbRef, public mongoDbDatabases: MongoDbDatabases) {
        this.initDone = this.init()
    }

    public async authenticateUser(email: string, password: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            if (this.db) {
                try {
                    const addRole = async (roleID: ObjectID, capabilities: any[]) => {
                        const role: Users.Role = await this.mongoDbDatabases.getDocument(this.db, "role", { _id: roleID })
                        if (role) {
                            capabilities = capabilities.concat(role.capabilities)
                            if (role.basedOn) {
                                for (const baseRoleID of role.basedOn) {
                                    if (baseRoleID !== roleID) {
                                        capabilities = await addRole(baseRoleID, capabilities)
                                    }
                                }
                            }
                        }
                        return capabilities
                    }
                    const user: Users.User = await this.mongoDbDatabases.getDocument(this.db, "user", { email: email.toLocaleLowerCase() })
                    if (user && password === user.password) {
                        let capabilities: any[] = []
                        if (user.capabilities) {
                            capabilities = capabilities.concat(user.capabilities)
                        }
                        if (user.roles) {
                            for (const role of user.roles) {
                                capabilities = await addRole(role, capabilities)
                            }
                        }
                        const groups = await this.mongoDbDatabases.getDocuments(this.db, "group", { members: { $in: [user._id] } })
                        if (groups) {
                            for (const group of groups) {
                                if (group) {
                                    if (group.capabilities) {
                                        capabilities = capabilities.concat(group.capabilities)
                                    }
                                    if (group.roles) {
                                        for (const roleID of group.roles) {
                                            capabilities = await addRole(roleID, capabilities)
                                        }
                                    }
                                }
                            }
                        }
                        // Filter any duplicates
                        capabilities = capabilities.filter((item, pos, self) => {
                            return self.indexOf(item) === pos
                        })
                        for (let n = 0; n < capabilities.length; ++n) {
                            const capability: Users.Capability = await this.mongoDbDatabases.getDocument(this.db, "capability", { _id: capabilities[n] })
                            capabilities[n] = capability.name
                        }
                        const jwt = createJWT(user._id!.toString(), "tank-server", capabilities)
                        const r = verifyJWT(jwt.key, jwt.token)
                        log.info("Authorized user \"{userName}\" with capabilities {capabilities}", email, capabilities)
                        resolve({ capabilities, jwt })
                    } else {
                        reject(new Error("Error in user account"))
                    }
                } catch (error) {
                    reject(new Error("Invalid username or password"))
                }
            } else {
                reject(new Error("Database not open"))
            }
        })
    }

    private async init() {
        return
    }
}
