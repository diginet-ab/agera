import nJwt from "njwt"
import secureRandom from "secure-random"

export const createJWT = (sub: string, iss: string, scope: any) => {
    const signingKey = secureRandom(256, { type: "Buffer" }) // Create a highly random byte array of 256 bytes

    const claims = {
        iss,    // The URL of your service
        scope,  // The access allowed
        sub,    // The UID of the user in your system
    }

    const jwt = nJwt.create(claims, signingKey)

    const token = jwt.compact()
    const key = signingKey.toString("base64")

    return { key, token }
}

export const verifyJWT = (key: string, token: string) => {
    try {
        const signingKey = Buffer.from(key, "base64")
        const verifiedJwt = nJwt.verify(token, signingKey)
        // tslint:disable-next-line:no-console
        console.log(verifiedJwt)
    } catch (e) {
        // tslint:disable-next-line:no-console
        console.log(e)
    }
}
