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
import {createDocument} from './createDocument';
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
            let userSeed = this.$store.state.user;
            let pageRouter = this.$router;

            reader.onload = function() {
                arrayBuffer = this.result;

                return d2html.convertToHtml({ arrayBuffer })
                .then(res => {
                    console.log('RSULT', res);
                    this.html = res.value;
                    return createDocument(userSeed, res.value, file.name)
                    .then(res => {
                        console.log('CREATED DOCUMENT', res);
                        pageRouter.push({ name: 'Editor', params: { docID: res.id } });
                        this.$store.state.document = doc;
                        window.location.reload();
                    });
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

