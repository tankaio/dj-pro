
/*************************************************************
 * 图片压缩
**************************************************************/

/* jshint esversion: 6 */ 


let imgenc = {
    // getBase64Image (img) {
    //     try {
    //         var canvas = document.createElement("canvas");
    //         canvas.width = img.width;
    //         canvas.height = img.height;

    //         var ctx = canvas.getContext("2d");
    //         ctx.drawImage(img, 0, 0, img.width, img.height);

    //         var dataURL = canvas.toDataURL("image/png");
    //         return dataURL;
    //     } catch (e) {return null;}
    //     // return dataURL.replace("data:image/png;base64,", "");
    // },

    /*
        通过一个url加载所需要的图片对象，其中 url 参数传入图片的 url , fn 为回调方法,包含一个Image对象的参数
    */
    urltoImage (url,fn) {
        var img = new Image();
        img.src = url;
        img.onload = () => {
            fn(img);
        };
    },

    /*
        将一个 Image 对象转变为一个 Canvas 类型对象，其中 image 参数传入一个Image对象
    */
    imagetoCanvas (image, width, height) {
        var cvs = document.createElement("canvas");
        var ctx = cvs.getContext('2d');
        cvs.width = null==width ? image.width:width;
        cvs.height = null==height ? image.height:height;
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, cvs.width, cvs.height);
        return cvs ;
    },

    /*
        将一个 Canvas 对象压缩转变为一个 Blob 类型对象；
        其中 canvas 参数传入一个 Canvas 对象; quality 参数传入一个0-1的 number 类型，表示图片压缩质量; fn 为回调方法，包含一个 Blob 对象的参数
    */
    canvasResizetoFile (canvas,quality,fn) {
        canvas.toBlob((blob) => { fn(blob); },'image/jpeg',quality);
    },

    /*
        将一个 Canvas 对象压缩转变为一个 dataURL 字符串,
        其中 canvas 参数传入一个 Canvas 对象; quality 参数传入一个0-1的 number 类型，表示图片压缩质量
    */
    canvasResizetoDataURL (canvas,quality) {
        return canvas.toDataURL('image/jpeg',quality);
    },

    /*
        将 File （ Blob ）类型文件转变为 dataURL 字符串,其中 file 参数传入一个 File （ Blob ）类型文件; 
        fn 为回调方法，包含一个 dataURL 字符串的参数
    */
    filetoDataURL (file,fn) {
        var reader = new FileReader();
        reader.onloadend = (e) => {
            fn(e.target.result);
        };
        reader.readAsDataURL(file);
    },

    /*
        将一串 dataURL 字符串转变为 Image 类型文件,其中 dataurl 参数传入一个 dataURL 字符串, 
        fn 为回调方法，包含一个 Image 类型文件的参数
    */
    dataURLtoImage (dataurl,fn) {
        var img = new Image();
        img.onload = function() {
            fn(img);
        };
        img.src = dataurl;
    },

    /*
        将一串 dataURL 字符串转变为 Blob 类型对象，其中 dataurl 参数传入一个 dataURL 字符串
    */
    dataURLtoFile (dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    },

    /*
        blob -> blob 压缩
    */
    fileResizetoFile (file, quality, width, height, fn) {
        this.filetoDataURL(file, (dataurl) => {
            this.dataURLtoImage(dataurl, (image) => {
                this.canvasResizetoFile(this.imagetoCanvas(image,width,height), quality, fn);
            });
        });
    },
};


export default imgenc;
