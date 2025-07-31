export const checkAdmin = async(req , res , next) => { 

    if(req.user.role === "ADMIN" ) {
        next()
    } else {
        res.status(403).json({message : "You are not authorized to perform this action"})
    }
}

export const checkFaculty = async(req , res , next) => { 

    if(req.user.role === "FACULTY") {
        next()
    } else {
        res.status(403).json({message : "You are not authorized to perform this action"})
    }
}