import multer from 'multer';
import {NextFunction, Request,Response} from 'express';
const storage = multer.diskStorage({
    destination: function(req:Request,file:Express.Multer.File,cb:any){
        const allowedFileTypes = ['image/png',"image/jpeg","image/jpg"];
        if(!allowedFileTypes.includes(file.mimetype)){
            cb(new Error('filetype must be jpg,png and jpeg'));
            return;
        }
        cb(null,'./src/uploads');
    },
    filename: function(req:Request,file:Express.Multer.File,cb:any){
        const data = Date.now();
        cb(null,data + file.originalname);
    }
    
})
export{
    multer,
    storage
}