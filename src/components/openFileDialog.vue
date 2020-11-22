<template>
    <div id = 'overlay'>
        <div id = 'dialog'>
            <h2>Open File</h2>

            <input type = 'file' accept = '.docx, .odt' @change = 'openFile' />
        </div>
    </div>
</template>

<script>
import * as d2html from 'mammoth';
export default {
    data() {
        return {
        }
    },
    methods: {
        openFile(event) {
            let file = event.target.files[0];
            console.log('FILE', file);
            let reader = new FileReader();
            let arrayBuffer;
            reader.onload = function() {
                arrayBuffer = this.result;
                // let arr = new Uint8Array(ab);
                // let binaryString = String.fromCharCode.apply(null, arr);

                // console.log('BIN STR', binaryString);

                return d2html.convertToHtml({ arrayBuffer })
                .then(res => {
                    console.log('RSULT', res);
                    this.html = res.value;
                });
            }
            reader.readAsArrayBuffer(file);
        }
    }
}
</script>

<style scoped>
div#dialog {
    width :fit-content;
    padding: 2em;
    height: fit-content;
    background: white;
}
</style>

