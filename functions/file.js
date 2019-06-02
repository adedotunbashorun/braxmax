const fs = require('fs')
const Activity = require('functions/activity')
const userFiles ='public'
var url = ''

class File{

    static Image(file,dest,name,extension){
        if (typeof file != 'undefined' || file != "" || file != null) {
            let check = this.isBase64(file)
            if(check == false){
                let data = Activity.Base64_encode(file.path)
                return this.upload_file(data,dest,name,extension)
            }else{
                return this.upload_file(file,dest,name,extension)
            }
            
        }
        return ''
    }

    static generalFile(file,dest,name,extension){
        if (typeof file != 'undefined' || file != "" || file != null) {
            let check = this.isBase64(file)
            if(check == false){
                let data = Activity.Base64_encode(file.path)
                return this.upload_file(data,dest,name,extension)
            }else{
                return this.upload_file(file,dest,name,extension)
            }
        }
        return ''
    }

    static zipFile(file,name,extension) {

    }

    static isBase64(str) {
        try {
            return btoa(atob(str)) == str;
        } catch (err) {
            return false;
        }
    }

    static upload_file(file,dest,name,extension = ''){
        var image = file.replace(/^data:.*,/, '')
        image = image.replace(/ /g, '+')
        var bitmap = new Buffer(image, 'base64')
        url = userFiles+ dest+ name +'-'+ Date.now() + extension
        fs.writeFileSync(url, bitmap)
        return url
    }

    
}

module.exports = File