import jwt from 'jsonwebtoken'
import { parse } from 'cookie'


export const logAnyMissingParams = (body, ...fields) => {
    return fields.filter(field => !body[field]).map(field => `${field} is missing`).join('. ')
} 

export const checkAuth = async (req, res, next) => {
    if (!req.headers.cookie) {
        res.sendStatus(401)
        return
    }
    const cookies = parse(req.headers.cookie)
    const token = cookies.token;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            res.sendStatus(401);
            return
        } else {
            req.user = decoded
            next()
        }
    })
}