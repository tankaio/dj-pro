/* jshint esversion: 6 */ 

import lamejs from 'lamejs';

class Rec {

    // afterStop: options.afterStop,
    // micFailed: options.micFailed,
    // initPass: options.initPass,

    constructor () {

        // 缓冲区大小
        this.bufferSize = 4096;
        this.records = [];
        this.samples = [];
        this.isPause = false;
        this.isRecording =  false;

        this.duration = 0;
        this.volume = 0;
        this._duration = 0;

        this.mp3enc = new lamejs.Mp3Encoder(1, 44100, 64);
        this.samplesMono = 0;
        this.maxSamples = 1152;
        this.blob = '';
        this.initComplete = false;

        this.timeThreshold = 2000;
        this.startTime = 0;
        
        // 改
        this.stopTime = 0;
        this.recCache = [];

        // 记录音量回调
        this.volumTime = Date.now();
        this.volumCallback = null;

        // 是否正在录音
        this.recording = false;
    }

    start (vf) {
        this.recCache = [];
        this.volumCallback = vf;

        this.recording = true; // 记录开始录音

        // 如果按键罗辑兼容问题，会占用线程，想办法KILL
        if(this.isRecording){
            this.killAll();
            return;
        }
        
        this.startTime = Date.now();    // 重新记录开始时间
        this.volumTime = Date.now();    // 记录音量回调间隔

        navigator.mediaDevices.getUserMedia({audio: true})
            .then(this._micCaptured.bind(this))
            .catch(this._micError.bind(this));
        this.isPause = false;
        this.isRecording = true;
    }

    killAll () {
        if(this.context && this.context.state == 'running'){
            try{
                if (this.stream) {
                    let tracks = this.stream.getAudioTracks();
                    for (let i = 0; i < tracks.length; i++) {
                        tracks[i].stop();
                    }
                    this.stream = 0;
                }
                this.input.disconnect();
                this.processor.disconnect();
                this.highShelf.disconnect();
                this.lowShelf.disconnect();
                this.highPass.disconnect();
                this.lowPass.disconnect();
                this.context.close();
            }catch (e) {
                console.log('catch', e);
            }
        }
    }

    stop () {
        this.initComplete = false;
        this.killAll();

        this.recording = false; // 记录停止录音

        // 记录音频时间
        this.stopTime = Date.now();
        let buflen = this.recCache.length;
        let milsec = buflen > 0 ? parseInt(this.stopTime - this.startTime) : 0;

        // 从缓存拿取数据，做帧内压缩
        for (let i=0; i < buflen; i++) {
            let mp3buf = this.mp3enc.encodeBuffer( this.recCache[i] );
            this._appendToBuffer(mp3buf);
        }
        this.recCache = [];

        // flush 帧间压缩
        this._appendToBuffer(this.mp3enc.flush());
        this.blob = new Blob(this.samples, {type: 'audio/mp3'});
        this.samples = [];
        // if (this.afterStop) {
        //     this.afterStop();
        // }

        this.isPause = false;
        this.isRecording = false;
        this._duration = 0;
        this.duration = 0;

        return milsec; // 返回音频毫秒数
    }

    cancel () {
        this.initComplete = false;
        this.killAll();

        this.recording = false; // 记录停止录音

        this.stopTime = Date.now();

        this.isPause = false;
        this.isRecording = false;
        this._duration = 0;
        this.duration = 0;
    }

    pause () {
        this.killAll();
        this._duration = this.duration;
        this.isPause = true;
    }

    mp3Blob () {
        return this.blob;
    }

    _micCaptured (stream) {
        if (Date.now() - this.startTime > this.timeThreshold) {
            // 弹窗略过
            //console.log('弹出授权窗体');
            if (this.$store.state.isios) {
                let tracks = stream.getAudioTracks();
                for (let i = 0; i < tracks.length; i++) {
                    tracks[i].stop();
                }
            }
            this.isPause = false;
            this.isRecording = false;
            return;
        }

        this.context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext)();
        // 媒体输入源,麦克风
        this.input = this.context.createMediaStreamSource(stream);
        // 音频处理
        this.processor = this.context.createScriptProcessor(this.bufferSize, 1, 1);

        this.initComplete = true;
        this.duration = this._duration;
        this.stream = stream;

        // 采集帧循环回调
        this.processor.onaudioprocess = (ev) => {
            let sample = ev.inputBuffer.getChannelData(0);
            let sum = 0.0;
            for (let i = 0; i < sample.length; ++i) {
                sum += sample[i] * sample[i];
            }
            this.duration = parseFloat(this._duration) + parseFloat(this.context.currentTime.toFixed(2));
            this.volume = Math.sqrt(sum / sample.length).toFixed(2);
            //console.log(this.volume);

            // 音量回调
            if (Date.now() - this.volumTime > 100) {
                this.volumCallback(this.volume);
                this.volumTime = Date.now();
            }

            this._encode(sample);
        };


        this.highShelf = this.context.createBiquadFilter();
        this.lowShelf = this.context.createBiquadFilter();
        this.highPass = this.context.createBiquadFilter();
        this.lowPass = this.context.createBiquadFilter();

        this.input.connect(this.highShelf);
        this.highShelf.connect(this.lowShelf);
        this.lowShelf.connect(this.highPass);
        this.highPass.connect(this.lowPass);
        this.lowPass.connect(this.processor);
        this.processor.connect(this.context.destination);

        this.highShelf.type = 'highshelf';
        this.highShelf.frequency.value = 4700;
        this.highShelf.gain.value = 50;

        this.lowShelf.type = 'lowshelf';
        this.lowShelf.frequency.value = 35;
        this.lowShelf.gain.value = 50;

        this.highPass.type = 'highpass';
        this.highPass.frequency.value = 1600;
        this.highPass.Q.value = 0.7;

        this.lowPass.type = 'lowpass';
        this.lowPass.frequency.value = 880;
        this.lowPass.Q.value = 0.7;

        // if (this.initPass) {
        //     console.log('录音初始化成功initPass()');
        //     this.initPass();
        // }
    }

    _micError (error) {
        console.log('不能录', error);
        // if (this.micFailed) {
        //     this.micFailed(error);
        // }
    }

    // 处理音频
    _appendToBuffer (mp3Buf) {
        this.samples.push(new Int8Array(mp3Buf));
    }

    _floatTo16BitPCM (input, output) {
        for (let i = 0; i < input.length; i++) {
            let s = Math.max(-1, Math.min(1, input[i]));
            output[i] = (s < 0 ? s * 0x8000 : s * 0x7FFF);
        }
    }

    _convertBuffer(arrayBuffer) {
        var data = new Float32Array(arrayBuffer);
        var out = new Int16Array(arrayBuffer.length);
        this._floatTo16BitPCM(data, out);
        return out;
    }

    _encode (arrayBuffer) {
        this.samplesMono = this._convertBuffer(arrayBuffer);
        let remaining = this.samplesMono.length;
        for (let i = 0; remaining >= 0; i += this.maxSamples) {
            let left = this.samplesMono.subarray(i, i + this.maxSamples);
            
            // 把原本的帧内压缩改为放入缓存
            this.recCache.push(left);

            // 原本的帧内压缩
            // let mp3buf = this.mp3enc.encodeBuffer(left);
            // this._appendToBuffer(mp3buf);
            
            remaining -= this.maxSamples;
        }
    }


    _dataURLtoBlob (dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    _blobToDataURL (blob, callback) {
        let fr = new FileReader();
        fr.onload = (e) => { 
            callback(e.target.result.split(',')[1]);
        };
        fr.readAsDataURL(blob);
    }

    getBase64 (callback) {
        this._blobToDataURL(this.blob, callback);
    }
}

export default Rec;
