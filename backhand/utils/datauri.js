import Datauriparser from "datauri/parser.js";

import path from "path";

const getDaturi = (file) =>{
    const parser = new Datauriparser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName,file.buffer);
}

export default getDaturi;
